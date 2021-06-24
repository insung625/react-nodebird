module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', { //MySQL에는 소문자, 복수형태로 바꿔서 users 테이블 생성
        //id가 기본적으로 들어가 있다.
        content: {
            type: DataTypes.STRING(200),
            allowNULL: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}