//로그인을 했는지, 로그인을 안했는지를 검사하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
    //로그인 했는지 확인 isAuthenticated는 passport 라이브러리에서 제공하는 함수로 얘가 true이면 로그인한 상태이다.
    if(req.isAuthenticated()){
        //()안에 값이 없으면 다음 미들웨어로 가라는 의미
        next();
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    //로그인이 안되어있다면
    if(!req.isAuthenticated()){
        next();
    } else {
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
}