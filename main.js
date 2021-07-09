const http = require("http");
const express= require("express");
const oracledb = require("oracledb");
const path = require('path');

oracledb.autoCommit = true;

const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);

//const run = require('./js/main');

app.set("view engine", "pug");
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
var conn;

//오라클 접속
oracledb.getConnection({
    user:"admin",
    password:"capstone1234",
    connectString:"database-1.crfqzvtrltdy.ap-northeast-2.rds.amazonaws.com/DATABASE" 
},function(err,con){
    if(err){
        console.log("접속이 실패했습니다.",err);
    }
    console.log("접속에 성공했습니다");
    conn = con;

});

app.set('port', 3001);

// home 화면
app.get('/', (req, res) => {
    res.render('home');
});

// login 화면
app.get('/login', (req, res) => {
    res.render('login');
});

// login 성공 시
app.post('/loggedIn', (req, res) => {
    console.log(req.body);

    var id = req.body.id;
    var pw =req.body.pw;
    res.render('main');
});

// join 화면
app.get('/join', (req, res) => {
    res.render('join');
});

//클라이언트로부터 regist를 요청받으면
app.post("/regist",function(request, response){
    console.log(request.body);
    //오라클에 접속해서 insert문을 실행한다. 
    var name = request.body.name;
    var id = request.body.id;
    var pw = request.body.pw;
    var email = request.body.email;

        //쿼리문 실행 
    conn.execute("insert into MEMBER_INFO(MEMBER_ID,PASSWORD,EMAIL,NAME) values('"+id+"','"+pw+"','"+email+"', '"+name+"')",function(err,result){
        if(err){
            console.log("등록중 에러가 발생했어요!!", err);
            response.writeHead(500, {"ContentType":"text/html"});
            response.end("fail!!");
        }else{
            console.log("result : ",result);
            response.writeHead(200, {"ContentType":"text/html"});
            response.render("resultTotal");
        }
    });
});

// question 화면
app.get("/question", (req, res) => {
    res.render('question');
});

app.get("/loading", (req, res) => {
    res.render('loading');
});

// 클라이언트로부터 reply를 요청받으면
app.post("/reply", function(request, response){
    console.log(request.body);

    // 오라클에 접속해서 insert문을 실행한다.
    var inputId = new Date().getTime();
    var disabled = request.body.disabled;
    var tourplace = request.body.tourplace;
    var wantArea = request.body.wantArea;
    var needHotel = request.body.needHotel;

    // 쿼리문 실행
    conn.execute("insert into USER_INPUT(USER_INPUT_ID,USER_DISABLED_TYPE,WANT_TOURPLACE_TYPE,NEED_HOTEL,WANT_AREA) values('"+inputId+"','"+disabled+"','"+tourplace+"','"+needHotel+"','"+wantArea+"')",function(err,result){
        if(err){
            console.log("등록중 에러가 발생했어요!!", err);
            response.writeHead(500, {"ContentType":"text/html"});
            response.end("fail!!");
        }else{
            console.log("result : ",result);
            response.writeHead(200, {"ContentType":"text/html"});
            response.render("resultTotal");
        }
    })
})


// 알고리즘이 작동되어야 할 부분



// 일단 url 작업
app.get("/reply",(req, res) => {
    res.render("resultTotal");
});

// 추천 관광지 결과 화면
app.get("/resultTour", (req, res) => {
    res.render("resultTour");
});

// 추천 음식점 결과 화면
app.get("/resultRes", (req, res) => {
    res.render("resultRes");
});

// 추천 숙박시설 결과 화면
app.get("/resultHotel", (req, res) => {
    res.render("resultHotel");
});

// 추천 코스 결과 화면
app.get("/resultTotal", (req, res) => {
    res.render("resultTotal");
});

// 마지막 관광코스 화면
app.get("/viewCourse", (req, res) => {
    res.render("viewCourse");
});

// 새로운 추천 받기 클릭 시
app.get("/replay", (req, res) => {
    res.redirect("question");
});

server.listen(3001, function(){
    console.log("웹서버 가동중...");
});
