const express= require("express");
const path = require('path');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();

const db = require('./js/db');
db.pool_init();

// 라우터 불러오기
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

// Pug 연결
app.set("view engine", "pug");
app.set('views', './views');

app.use( morgan('dev') );
app.use( express.static( path.join(__dirname, 'public') ) );
app.use( express.urlencoded ({ extended: true}) );
app.use( express.json() ) ;

// 요청 경로에 따라 Router 실행
app.use('/', pageRouter);
app.use('/', authRouter);

// Port는 3001
app.set('port', 3001);

app.listen(3001, () => {
    console.log('3001번 포트에서 대기중');
})
