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
    console.log("추천 관광지 탑텐의 계산: ", t_recommend);
    const ten = await topten.print_topten(connection, 'tourplace', t_recommend);
    console.log("추천 관광지 순위: ", ten);

    // // 유저의 선택을 받은 관광지의 ID -- 임의로 1위로 선택해둡니다.
    // var user_choice_tourplace = t_recommend[0].id;

    // const ti = await topten.load_info(connection, user_choice_tourplace);
    // console.log("유저가 선택한 관광지의 상세정보: ", ti);

    return ten
    
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

  // run()

module.exports = { run };