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
    const restaurant_recommend = require('./restaurant_recommend');
    const hotel_recommend = require('./hotel_recommend');

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

    // 1차 필터링 되었던 관광지 ID가 Array 'f1' 에 저장됩니다.
    const f1 = await common.filter_wantArea(connection, want_area);
    const t_recommend = await tourplace_recommend.tourplace_recommend(connection, f1, want_theme, disabled_type);
    console.log("추천 관광지 탑텐: ", t_recommend);

    // 유저의 선택을 받은 관광지의 ID -- 임의로 1위로 선택해둡니다.
    var user_choice_tourplace = t_recommend[0].id;

    const ti = await topten.load_info(connection, user_choice_tourplace);
    console.log("유저가 선택한 관광지의 상세정보: ", ti);

    // 선택된 관광지의 시군구(ADDRESS2)
    var choice_add2 = ti.ADDRESS2.trim();
    console.log(choice_add2);

    // --- 음식점 추천 시작 --- //
    console.log("선택하신 관광지 주위 음식점을 추천합니다!");

    // 관광지의 시군구에 존재하는 음식점 ID가 Array 'f2'에 저장됩니다.
    const f2 = await common.filter_address2(connection, choice_add2, 'restaurant');
    const r_recommend = await restaurant_recommend.restaurant_recommend(connection, f2, user_choice_tourplace, disabled_type);
    console.log("추천 음식점 탑텐: ", r_recommend);

    // 유저의 선택을 받은 음식점의 ID -- 임의로 1위로 선택해둡니다.
    var user_choice_res = r_recommend[0].id;

    const ri = await topten.load_info2(connection, user_choice_res, 'restaurant');
    console.log("유저가 선택한 음식점의 상세정보: ", ri);

    // --- 숙박 추천 시작 --- //
    if (need_hotel == '1') {
      console.log("선택하신 관광지 주위 호텔을 추천합니다!");
    
      // 관광지의 시군구에 존재하는 호텔 ID가 Array 'f3'에 저장됩니다.
      const f3 = await common.filter_address2(connection, choice_add2, 'hotel');
      console.log(f3);
      const h_recommend = await hotel_recommend.hotel_recommend(connection, f3, user_choice_tourplace, disabled_type);
      console.log("추천 호텔 탑텐: ", h_recommend);
  
      // 유저의 선택을 받은 숙박의 ID -- 임의로 1위로 선택해둡니다.
      var user_choice_hotel = h_recommend[0].id;
  
      const hi = await topten.load_info2(connection, user_choice_hotel, 'hotel');
      console.log("유저가 선택한 숙박의 상세정보: ", hi);
  
      // --- 관광 코스 요약 --- //
      console.log("관광지:", ti.NAME);
      console.log("음식점:", ri.NAME);
      console.log("숙박:", hi.NAME);
    }
  
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