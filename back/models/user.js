module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //MySQL에는 소문자, 복수형태로 바꿔서 users 테이블 생성
        //id가 기본적으로 들어가 있다.
        email: {
            type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, //필수
            unique: true, //고유한값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false, //필수
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false, //필수
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', //한글저장
    });
    User.associate = (db) => {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked'});
        db.User.belongsToMany(db.User, {through: 'Folllow', as: 'Followers', foreignKey: 'FollowingId'}); //키 이름이 중복되므로 foriegnkey로 키이름 변경
        db.User.belongsToMany(db.User, {through: 'Folllow', as: 'Followings', foreignKey: 'FollowerId'});
    };
    return User;
}