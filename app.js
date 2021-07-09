const http = require("http");
const express= require("express");
const oracledb = require("oracledb");
const path = require('path');

oracledb.autoCommit = true;

const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);

app.set("view engine", "pug");
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));


async function run() {
    // DB에 접속합니다.
    let connection;
    try {
        connection = await oracledb.getConnection( {
            user          : "admin",
            password      : mypw,
            connectString : "database-1.crfqzvtrltdy.ap-northeast-2.rds.amazonaws.com/DATABASE"
        });

    // 직접 만든 모듈 Import
    const common = require('./common');
    const topten = require('./topten');
    const tourplace_recommend = require('./tourplace_recommend');
    const restaurant_scoring = require('./restaurant_scoring');

    // --- 시작 --- //
    // 유저 인풋 불러오기 //
    const u = await common.load_user_input(connection);
    const disabled_type = u[1];
    const want_theme = u[2];
    const want_area = u[3];
    const need_hotel = u[4];
    console.log("유저 인풋: ", u);

    // --- 관광지 추천 시작 --- // 
    console.log("관광지부터 추천합니다!");
    // 1차 필터링 되었던 관광지 ID가 Array 'f' 에 저장됩니다.
    const f1 = await common.filter_wantArea(connection, want_area);
    const t_recommend = await tourplace_recommend.tourplace_recommend(connection, f1, want_theme, disabled_type);
    console.log("추천 관광지 탑텐: ", t_recommend);

    // 유저의 선택을 받은 관광지의 ID -- 임의로 1위로 선택해둡니다.
    var user_choice = t_recommend[0];

    // --- 음식점 추천 시작 --- // 
    add = await connection.execute(`SELECT ADDRESS2 FROM TOURPLACE WHERE TOURPLACE_ID = '${user_choice.id}'`); //execute문호출, 가리키는 건 resultset.
    add2 = add.rows[0].ADDRESS2.trim();

    l = await restaurant_scoring.restaurant_location(connection, user_choice.id, add2); //함수 호출, r이 가리키는 건 return값.    
    g = await restaurant_scoring.getDistance(Number(l[1]),Number(l[0]), Number(l[3]), Number(l[2]));
    r = await restaurant_scoring.rate_scoring(connection, l[4]);
    c = await restaurant_scoring.conv_scoring(connection, l[4], disabled_type);

    recommend_score = c*0.55 + g[1]*0.35 + r*0.1
    console.log("음식점 최종 추천도 점수는: ", recommend_score);
    
    console.log(user_choice);
    console.log(`${user_choice.id}에 가까운 음식점을 추천합니다!`);

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
    }
}

run();

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
            response.render("success!");
        }
    });
});

// question 화면
app.get("/question", (req, res) => {
    res.render('question');
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