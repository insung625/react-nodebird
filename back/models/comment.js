// const { Module } = require('module');
// const DataTypes = require('sequelize');
// const { Model } = DataTypes;


// Module.exports = class Comment extends Model {
//     static init(sequelize) {
//         return super.init({
//             content: {
//                 type: DataTypes.TEXT,
//                 allowNull: false,
//             },           
//         }, {
//             modelName: 'Comment',
//             table: 'comments',
//             charset: 'utf8mb4',
//             collate: 'utf8mb4_general_ci',
//             sequelize,
//         });        
//     }

//     static associate(db) {
//       db.Comment.belongsTo(db.User); // User관련 id컬럼이 생성
//       db.Comment.belongsTo(db.Post); // Post관련 id컬럼이 생성
//     }
// }


module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { //MySQL에는 소문자, 복수형태로 바꿔서 users 테이블 생성
        //id가 기본적으로 들어가 있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        //belongsTo의 역할 id컬럼 생성
        //UserId: {}
        //PostId: {}
    }, {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', //한글 및 이모티콘
    });
    Comment.associate = (db) => {
      db.Comment.belongsTo(db.User); // User관련 id컬럼이 생성
      db.Comment.belongsTo(db.Post); // Post관련 id컬럼이 생성
    };
    return Comment;
}