const express = require('express');
const { User, Post, Image, Comment } = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');
const { Op } = require('sequelize');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
 
router.get('/', async (req, res, next) => {
    console.log(req.headers);
    try {
        if(req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: {id: req.user.id},
                // attributes: ['id', 'nickname','email']
                attributes: {
                    exclude: ['password'],
                },
                include: [{ //Post에서 id만 가져오기
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User, //Followings에서 id만 가져오기
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }],
            })
            return res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//프론트 로그인 시도할떄 동작하는 라우터
//isNotLoggedIn은 middlewares.js에 들어있는 함수로 로그인했는지 확인
router.post('/login', isNotLoggedIn, (req, res, next)=>{ // POST /user/login
    //전략실행(local.js)후 콜백함수 실행 및 패스포트serialize(index.js)를 실행
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async(loginErr) => {
            if(loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            //프론트에서 필요한 유저정보만 다시 찾음.
            const fullUserWithoutPassword = await User.findOne({
                where: {id: user.id},
                //내가원하는 정보만 가져올수도 있고 attributes: ['id', 'nickname','email']
                //여기선 비밀번호만 제외
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }],
            })
            return res.status(200).json(fullUserWithoutPassword);
        })
    })(req, res, next);
});


router.post('/', isNotLoggedIn, async (req, res, next)=>{ 
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (exUser) {
           return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickName,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(201).json('ok');
    } catch (error) {
        console.log(error);
        next(error); // next는 괄호안에 에러값이 들어있다면 status(500)과 동일
    }
});

//프론트에서 로그아웃 요청이 들어왔을때 동작하는 라우터
//isLoggedIn는 middlewares.js에 들어있는 함수
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});

//닉네임 수정하기
router.patch('/nickname', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
    try {
        console.log('nickname patch')
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        });
        res.status(200).json({ nickname: req.body.nickname });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


//팔로우제거하기
router.delete('/follow/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follow/1
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('없는 사람을 차단하시네요');
        }
        console.log(user.followings);
        await user.removeFollowings(req.params.userId);
        res.status(200).json({ id: parseInt(req.params.userId, 10)});
    } catch (err) {
        console.error(err);
        next(err);
    }
});


//팔로우 리스트 불러오기
router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/1/followers
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('없는 사람을 찾을려고 하시네요');
        }
        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//팔로잉 리스트 불러오기
router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('없는 사람을 찾을려고 하시네요');
        }
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//팔로우하기
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('없는 사람을 팔로우 하시네요');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ id: parseInt(req.params.userId,10)});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//팔로우취소하기
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // DELETE /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('없는 사람을 언팔로우 하시네요');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ id: parseInt(req.params.userId,10)});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:userId/posts', async (req,res,next)=>{ // GET /user/1/posts
    try {
        //초기 로딩이 아닐떄
        let where = { UserId: req.params.userId };
        if(parseInt(req.query.lastId, 10)){
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        }
        const posts = await Post.findAll({
            where,
            // where : { id: lastId },
            limit: 10, // 특정개수만큼만 가져와라
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ], //2차원배열, 최신게시글부터 오름차순으로
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            },{ 
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                    order: [['createAt', 'DESC']],
                }]
            }, {
                model: User, //좋아요누른 작성자
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, ]
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;