const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const mypw = "capstone1234";

async function run() {
    // DB에 접속합니다.
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : mypw,
        connectString : "database-1.crfqzvtrltdy.ap-northeast-2.rds.amazonaws.com/DATABASE"
      } );

    // 직접 만든 모듈 Import
    const common = require('./common');
    const topten = require('./topten');
    const tourplace_recommend = require('./tourplace_recommend');
    // const restaurant_recommend = require('./restaurant_recommend');
    const restaurant_scoring = require('./restaurant_scoring');
    const hotel_scoring = require('./hotel_scoring');

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

    // const ti = await topten.load_info(connection, user_choice);
    // console.log("유저가 선택한 관광지의 상세정보: ", ti);

    // --- 음식점 추천 시작 --- // 
    add = await connection.execute(`SELECT ADDRESS2 FROM TOURPLACE WHERE TOURPLACE_ID = '${user_choice.id}'`); //execute문호출, 가리키는 건 resultset.
    add2 = add.rows[0].ADDRESS2.trim();
    //console.log(add2);

    l = await restaurant_scoring.restaurant_location(connection, user_choice.id, add2); //함수 호출, r이 가리키는 건 return값.    
    g = await restaurant_scoring.getDistance(Number(l[1]),Number(l[0]), Number(l[3]), Number(l[2]));
    r = await restaurant_scoring.rate_scoring(connection, l[4]);
    c = await restaurant_scoring.conv_scoring(connection, l[4], disabled_type);
 
   
    recommend_score = c*0.55 + g[1]*0.35 + r*0.1
    console.log("음식점 최종 추천도 점수는: ", recommend_score);
    
      
    //var ffff = JSON.stringify(user_choice);
    //console.log(ffff[id]);
    console.log(user_choice);
   
    
    

    
    //restaurant_location(connection, user_choice.id,)
    //const r_recommend = await restaurant_recommend.restaurant_recommend(connection, user_choice);
    



    // --- 숙박 추천 시작 --- //
    h_add = await connection.execute(`SELECT ADDRESS2 FROM TOURPLACE WHERE TOURPLACE_ID = '${user_choice.id}'`); //execute문호출, 가리키는 건 resultset.
    h_add2 = add.rows[0].ADDRESS2.trim();


   
    h_l = await hotel_scoring.hotel_location(connection, user_choice.id, add2); //함수 호출, r이 가리키는 건 return값.    
    h_g = await hotel_scoring.getDistance(Number(h_l[1]),Number(h_l[0]), Number(h_l[3]), Number(h_l[2]));
    h_r = await hotel_scoring.rate_scoring(connection,    h_l[4]);
    h_c = await hotel_scoring.conv_scoring(connection,    h_l[4], disabled_type);
 

    recommend_score = h_c *0.55 +  h_g [1]*0.35 + h_r*0.1
    console.log("호텔 최종 점수 : : ", recommend_score);

  
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