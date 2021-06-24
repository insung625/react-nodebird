module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //MySQL에는 소문자, 복수형태로 바꿔서 users 테이블 생성
        //id가 기본적으로 들어가 있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        //RetweetId: {}
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글 및 이모티콘
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); //belongsTo : 속해있다.
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'}); // belongsToMany : 많이 속해있다., 'PostHashtag'라는 다대다관계 임의의 테이블이 생김
        db.Post.hasMany(db.Comment); // hasMany : 많이 가지고 있다. 
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, {as: 'Retweet'});
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers'}); // 첫번째 줄 User와 헷갈리므로 as로 user를 likers로 바꿔 구별한다.
    };
    return Post;
}