// 직접 만든 모듈 Import
const common = require('./common');
const topten = require('./topten');
const tourplace_recommend = require('./tourplace_recommend');
const restaurant_recommend = require('./restaurant_recommend');
const hotel_recommend = require('./hotel_recommend');

// DB 관련 설정
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const db = require('./db');

// DB와의 연결입니다.
let connection;

// DB에 접속합니다.
async function db_run() {
    try {
        // await db.pool_init();
        connection = await oracledb.getConnection('mypool'); // 아주 중요한 부분!!!
    } catch (err) {
        console.error(err); 
    }
}

// Question 이후 실행되는 부분
async function question_run(disabled, tourplace, wantArea, needHotel) {
    await db_run();

    await common.save_user_input(connection, disabled, tourplace, wantArea, needHotel)
}

// 유저 인풋 불러오기
async function load_run() {
    await db_run();

    const user_info = await common.load_user_input(connection);
    // console.log(user_info);
    return user_info 
}

// 관광지 추천 실행
async function tour_run() {
    // --- 시작 --- //
    // 유저 인풋 불러오기 //
    const u = await load_run()
    const disabled_type = u[1];
    const want_theme = u[2];
    const want_area = u[3];

    // --- 관광지 추천 시작 --- // 
    console.log("관광지부터 추천합니다!");

    // 1차 필터링 되었던 관광지 ID가 Array 'f1' 에 저장됩니다.
    const f1 = await common.filter_wantArea(connection, want_area);
    const t_recommend = await tourplace_recommend.tourplace_recommend(connection, f1, want_theme, disabled_type);
    // console.log("추천 관광지 탑텐의 계산: ", t_recommend);
    var ten = await topten.print_topten(connection, 'tourplace', t_recommend);
    console.log("추천 관광지 순위: ", ten);

    // 사용자에게 보여줄 수 있는 오브젝트를 담은 배열 생성
    for_front = [];
    for (let i of ten) {
      const info = await topten.load_info(connection, i.id)
    //   console.log(info)
    //   console.log(typeof(i))
      for_front.push(Object.assign(i, info));
      // console.log(for_front);
    }



    return for_front
}

// 음식점 추천 실행
async function res_run(user_choice_tid) {
    // 유저 인풋 불러오기 //
    const u = await load_run()
    const disabled_type = u[1];

    // console.log("유저 인풋: ", u);
    const ti = await topten.load_info(connection, user_choice_tid);
    console.log("유저가 선택한 관광지의 상세정보: ", ti);
    
    // 선택된 관광지의 시군구(ADDRESS2)
    var choice_add2 = ti.ADDRESS2.trim();
    console.log(choice_add2);
    
    // --- 음식점 추천 시작 --- //
    console.log("선택하신 관광지 주위 음식점을 추천합니다!");

    // 관광지의 시군구에 존재하는 음식점 ID가 Array 'f2'에 저장됩니다.
    const f2 = await common.filter_address2(connection, choice_add2, 'restaurant');
    const r_recommend = await restaurant_recommend.restaurant_recommend(connection, f2, user_choice_tid, disabled_type);
    // console.log("추천 음식점 탑텐: ", r_recommend);
    var ten = await topten.print_topten(connection, 'restaurant', r_recommend);
    console.log("추천 음식점 순위: ", ten);

    // 사용자에게 보여줄 수 있는 오브젝트를 담은 배열 생성
    for_front = [];
    for (let i of ten) {
      const info = await topten.load_info2(connection, i.id, 'restaurant')
    //   console.log(info)
    //   console.log(typeof(i))
      for_front.push(Object.assign(i, info));
    //   console.log(for_front);
    }

    return for_front
}

// 숙박시설 추천 실행
async function hotel_run(user_choice_tid) {
    // 유저 인풋 불러오기 //
    const u = await load_run()
    const disabled_type = u[1];

    const ti = await topten.load_info(connection, user_choice_tid);
    // 선택된 관광지의 시군구(ADDRESS2)
    var choice_add2 = ti.ADDRESS2.trim();
    console.log(choice_add2);

    // --- 숙박 추천 시작 --- //
    console.log("선택하신 관광지 주위 호텔을 추천합니다!");
    
    // 관광지의 시군구에 존재하는 호텔 ID가 Array 'f3'에 저장됩니다.
    const f3 = await common.filter_address2(connection, choice_add2, 'hotel');
    const h_recommend = await hotel_recommend.hotel_recommend(connection, f3, user_choice_tid, disabled_type);
    // console.log("추천 호텔 탑텐: ", h_recommend);
    var ten = await topten.print_topten(connection, 'hotel', h_recommend);
    console.log("추천 호텔 순위: ", ten);

    // 사용자에게 보여줄 수 있는 오브젝트를 담은 배열 생성
    for_front = [];
    for (let i of ten) {
      const info = await topten.load_info2(connection, i.id, 'hotel')
    //   console.log(info)
    //   console.log(typeof(i))
      for_front.push(Object.assign(i, info));
    //   console.log(for_front);
    }

    return for_front
}

// 최종 추천 코스 정리 (풀 코스)
async function uc_run1(tid, rid, hid) {
    // // 유저 인풋 불러오기 //
    // const u = await load_run();

    // 사용자에게 보여줄 수 있는 오브젝트를 담은 배열 생성
    uc_for_front = [];
    const ucti = await topten.load_info(connection, tid);
    const ucri = await topten.load_info2(connection, rid, 'restaurant');
    const uchi = await topten.load_info2(connection, hid, 'hotel');
    uc_for_front.push(ucti, ucri, uchi);
    // console.log(uc_for_front);

    return uc_for_front
}

// 최종 추천 코스 정리 (숙박 X)
async function uc_run2(tid, rid) {
  // 사용자에게 보여줄 수 있는 오브젝트를 담은 배열 생성
  uc_for_front = [];
  const ucti = await topten.load_info(connection, tid);
  const ucri = await topten.load_info2(connection, rid, 'restaurant');
  uc_for_front.push(ucti, ucri);
  console.log(uc_for_front);

  return uc_for_front
}


async function test_run() {
    // await question_run('visual', 'shopping', '31', '1');
    // await tour_run();
    // await res_run('T62');
    // await hotel_run('T62');
    // await uc_run('T1', 'R1', 'H1')
}

// test_run();

module.exports = { db_run, question_run, load_run, tour_run, res_run, hotel_run, uc_run1, uc_run2 }