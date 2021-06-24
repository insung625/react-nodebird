const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local'); //: 넣는 이유! 구조분해할때 변수명 바꾸는 방법
const { User } = require('../models'); //User 검색을 위해 require
const bcrypt = require('bcrypt');

//여기서 로그인 관련 동작구조를 만듦
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        //항상 await이 있는경우 try로 감싸줘서 비동기관련 에러관련 오동작 방지
        try {
            //사용자 검색
            const user = await User.findOne({
                where: { email }
            });
            //사용자가 없으면
            if (!user) { //아래 done의 파라미터는 순서대로 서버에러, 성공, 클라이언트 에러를 의미한다. 
                return done(null, false, { reason: '존재하지 않는 이메일입니다!'});
            }
            //사용자가 있으면 암호화 비교
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            //암호화 비교시 틀렸을때 
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
        } catch (error) {
            console.error(error);
            return done(error);
        }

    }));
};