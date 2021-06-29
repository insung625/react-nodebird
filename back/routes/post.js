const express = require('express');
const { Post, Image, Comment, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');


const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (err) {
    console.log('uploads폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
};

//이미지 업로드 미들웨어
//이미지를 PC에 저장
//기존 하드웨어에서 저장하는것에서 AWS의 S3에 저장하는것으로 변경
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
}); 

const upload = multer({
    //하드디스크에 저장
    // storage: multer.diskStorage({
    //     destination(req, file, done) {
    //         done(null, 'uploads');
    //     },
    //     filename(req, file, done) {
    //         const ext = path.extname(file.originalname); // 확장자 추출(.png)
    //         const basename = path.basename(file.originalname, ext); // 
    //         done(null, basename + '_' + new Date().getTime() + ext);
    //     },
    // }),
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'react-nodebird-lis',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: { filesize: 20 * 1024 * 1024 }, //20MB
});

//프론트에서 post작성 요청시 동작하는 부분 
//isLoggedIn는 로그인한 사람만 접근할수 있게하는 미들웨어임
router.post('/', isLoggedIn, upload.none(), async (req,res, next ) => {
    try {
        console.log(req.body.content);
        const hashtags = req.body.content.match(/(#[^\s#]+)/g);
        console.log(hashtags);
        const post = await Post.create({
            //req.user는 passport deserialize를 통해서 접근이 가능하다.
            UserId: req.user.id,
            content: req.body.content,
        });
        if(hashtags) {
            const result = await Promise.all(hashtags.map((tag)=>Hashtag.findOrCreate({
                where : { name: tag.slice(1).toLowerCase()}
            })));
            // result 형태 [[노드, true],[...],...]
            await post.addHashtags(result.map((v)=>v[0]));
        }
        // 이미지가 있는 경우
        if(req.body.image){
            if(Array.isArray(req.body.image)){ //이미지를 여러개 올리면
                //db에는 접근가능한 파일주소를 넣음, 파일은 PC에 저장
               console.log(req.body.image);
               const images =  await Promise.all(req.body.image.map((image) => Image.create({content: image})));
               await post.addImages(images);
            } else { //이미지가 하나인 경우
               const image = await Image.create({ content: req.body.image });
               await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User, //댓글 작성자
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User, //게시글 작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User, //좋아요누른 작성자
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        console.log(fullPost);
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//이미지 업로드
//어레이로 쓴 이유는 여러장을 올리기 위해
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
    try {
        // console.log(req.files);
        res.json(req.files.map((v)=>v.location));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//프론트에서 커멘트 작성 요청시 동작하는 부분
//주소부분에서 동적으로 바뀌는 부분이 있어서 ':'를 붙여서 작성 
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try {
        //실제 게시글이 존재하는지 확인
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        //게시글이 없으면?
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        };
        //게시글이 있으면 커멘트를 db에 작성
        const comment = await Comment.create({
            UserId: req.user.id,
            PostId: parseInt(req.params.postId, 10), //req.params 안의 값은 문자열로 인식
            content: req.body.content,
        });

        const fullComment = await Comment.findOne({
            where: {id: comment.id},
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }],
        });

        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async (req,res,next) => { // PATCH /post/1/like
    try {
        const post = await Post.findOne({where: { id: req.params.postId }});
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.')
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {

    }
});

router.delete('/:postId/like', isLoggedIn, async (req,res,next) => { // DELETE /post/1/like
    try {
        const post = await Post.findOne({where: { id: req.params.postId }});
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.')
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {

    }
});

router.delete('/:postId', isLoggedIn, async (req,res,next)=>{ // DELETE /post/10
    try {
       //특정 포스트를 삭제 할때 destory를 써야한다.
    //    console.log(req.user.id);
    //    console.log(req.params.postId);
       await Post.destroy({
           where: { 
               id: req.params.postId,
               UserId: req.user.id, 
           },
       });
       res.json({ PostId: parseInt(req.params.postId, 10) });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//리트윗하기
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
    try {
        //실제 게시글이 존재하는지 확인
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet'
            }]
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        };
        //자신이 쓴글을 리트윗하는지 검사
        if(req.user.id === post.UserId || (post.Retweet && post.Retwwewt.UserId === req.user.id)){
            return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.');
        }
        //이미 리트윗한것을 또 리트윗하진 않는지 검사
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: { 
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗 했습니다.');
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        })
        const retweetWithPrevPost = await Post.findOne({
            where: {
                id: retweet.id,
            },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes:  ['id'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:postId', async (req, res, next) => {
    try {
        //실제 게시글이 존재하는지 확인
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send('존재하지 않는 게시글입니다.');
        };

        const fullPost = await Post.findOne({
            where: {
                id: post.id,
            },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes:  ['id'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id', 'nickname'],
            }]
        })
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;