const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req,res,next)=>{ // GET /posts
    try {
        //초기 로딩이 아닐떄
        let where = {};
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