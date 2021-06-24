module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { //MySQL에는 소문자, 복수형태로 바꿔서 users 테이블 생성
        //id가 기본적으로 들어가 있다.
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', //한글 및 이모티콘
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
    };
    return Hashtag;
}