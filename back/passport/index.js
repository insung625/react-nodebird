const passport = require('passport');
const { User } = require('../models');
const local = require('./local');

module.exports = () => {

    //로그인 성공후 패스포트에서 로그인시도 하는 함수
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //로그인성공이후 그다음요청부터 매번 id를 통해 사용자정보를 확인하여 req.user에 넣어줌
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({where: id})
            done(null, user);
        } catch (error) {
            console.error(error);
            done(error);
        }
    });

    //local.js실행, 패스포트 전략임
    local();
}