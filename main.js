const express= require("express");

const path = require('path');
const morgan = require('morgan');
const bodyParser = require("body-parser");

// DB 관련설정
const oracledb = require("oracledb");
oracledb.autoCommit = true;

const app = express();

// 라우터 불러오기
const pageRouter = require('./routes/page');

// Pug 연결
app.set("view engine", "pug");
app.set('views', './views');

app.use( morgan('dev') );
app.use( express.static(path.join(__dirname, 'public')) );
app.use( express.urlencoded ({ extended: true}) );
app.use( express.json() ) ;

// Port는 3001
app.set('port', 3001);

// // login 성공 시
// app.post('/loggedIn', (req, res) => {
//     console.log(req.body);

//     var id = req.body.id;
//     var pw =req.body.pw;
//     res.render('main');
// });

// // join 화면
// app.get('/join', (req, res) => {
//     res.render('join');
// });

// //클라이언트로부터 regist를 요청받으면
// app.post("/regist",function(request, response){
//     console.log(request.body);
//     //오라클에 접속해서 insert문을 실행한다. 
//     var name = request.body.name;
//     var id = request.body.id;
//     var pw = request.body.pw;
//     var email = request.body.email;

//         //쿼리문 실행 
//     conn.execute("insert into MEMBER_INFO(MEMBER_ID,PASSWORD,EMAIL,NAME) values('"+id+"','"+pw+"','"+email+"', '"+name+"')",function(err,result){
//         if(err){
//             console.log("등록중 에러가 발생했어요!!", err);
//             response.writeHead(500, {"ContentType":"text/html"});
//             response.end("fail!!");
//         }else{
//             console.log("result : ",result);
//             response.writeHead(200, {"ContentType":"text/html"});
//             response.render("resultTotal");
//         }
//     });
// });

// 요청 경로에 따라 Router 실행
app.use('/', pageRouter);


// // 클라이언트로부터 reply를 요청받으면
// app.post("/reply", function(request, response){
//     console.log(request.body);

//     // 오라클에 접속해서 insert문을 실행한다.
//     var inputId = new Date().getTime();
//     var disabled = request.body.disabled;
//     var tourplace = request.body.tourplace;
//     var wantArea = request.body.wantArea;
//     var needHotel = request.body.needHotel;

//     // 쿼리문 실행
//     conn.execute("insert into USER_INPUT(USER_INPUT_ID,USER_DISABLED_TYPE,WANT_TOURPLACE_TYPE,NEED_HOTEL,WANT_AREA) values('"+inputId+"','"+disabled+"','"+tourplace+"','"+needHotel+"','"+wantArea+"')",function(err,result){
//         if(err){
//             console.log("등록중 에러가 발생했어요!!", err);
//             response.writeHead(500, {"ContentType":"text/html"});
//             response.end("fail!!");
//         }else{
//             console.log("result : ",result);
//             response.writeHead(200, {"ContentType":"text/html"});
//             response.render("resultTotal");
//         }
//     })
// })

// // 일단 url 작업
// app.get("/reply",(req, res) => {
//     res.render("resultTotal");
// });

// // 추천 관광지 결과 화면
// app.get("/resultTour", (req, res) => {
//     res.render("resultTour");
// });

// // 추천 음식점 결과 화면
// app.get("/resultRes", (req, res) => {
//     res.render("resultRes");
// });

// // 추천 숙박시설 결과 화면
// app.get("/resultHotel", (req, res) => {
//     res.render("resultHotel");
// });

// // 추천 코스 결과 화면
// app.get("/resultTotal", (req, res) => {
//     res.render("resultTotal");
// });

// // 마지막 관광코스 화면
// app.get("/viewCourse", (req, res) => {
//     res.render("viewCourse");
// });

// // 새로운 추천 받기 클릭 시
// app.get("/replay", (req, res) => {
//     res.redirect("question");
// });

app.listen(3001, () => {
    console.log('3001번 포트에서 대기중');
})
