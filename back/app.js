const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const morgan = require('morgan');
const db = require('./models');
const app = express();
const passportConfig = require('./passport');
const passport = require('passport');
const path = require('path');

dotenv.config();

passportConfig();
app.use(morgan('dev'));

//db를 연결
db.sequelize.sync()
    .then(()=>{
        console.log('db연결 성공');
    })
    .catch(console.error);

//개발시 cors(보안)문제를 쉽게 회피하게 해줌
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, //쿠키를 같이 전달하고 싶을때 true
})); 

app.use('/', express.static(path.join(__dirname, 'uploads')));
//front의 데이터 req.body를 전달받는 역할
//위에서부터 아래로 실행되므로, 항상 라우터보다 위에 위치해야한다.
app.use(express.json());
//이것은 form submit을 했을때 url받는 방식으로 데이터를 전달받음
app.use(express.urlencoded({extended: true}));

//비밀번호,아이디 같은 실제 정보대신 랜덤화된 정보(쿠키)를 브라우저에 대신 보내주기 위한 미들웨어들
//쿠키와 실제정보가 통채로 들어있는게 서버쪽 세션
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session()); 

app.get('/', (req,res)=>{
    res.send('hello express');
})

app.get('/api', (req,res)=>{
    res.send('hello express');
})

app.get('/api/posts', (req,res)=>{
    res.json([
        {
            id: 1,
            name: 'inseong',
        }
    ]);
})

app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/posts',postsRouter);
app.use('/hashtag',hashtagRouter);


// 아래는 에러처리 미들웨어로 따로 변경을 하고 싶다면 아래와 같이 작성하여 진행하면 된다. 
// app.use((err,req,res,next)=>{


// });

app.listen(3065, ()=>{
    console.log('서버 실행 중');
});
