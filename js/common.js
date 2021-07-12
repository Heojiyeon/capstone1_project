// 유저 인풋 DB에 저장하는 함수
async function save_user_input(connection, disabled, tourplace, wantArea, needHotel) {
  var inputId = new Date().getTime();
  try {
    var input_save_query = `INSERT INTO user_input
    VALUES('${inputId}', '${disabled}', '${tourplace}', '${wantArea}', '${needHotel}')`;
    await connection.execute(input_save_query);
    console.log("성공적으로 저장되었습니다!")
  } catch (err) {
    console.error(err);
  }
}

// 유저 인풋 DB에서 불러오는 함수
async function load_user_input(connection) {
  var input_query =
    'SELECT * FROM (SELECT * FROM user_input ORDER BY ROWNUM DESC) WHERE ROWNUM = 1';
  var input = await connection.execute(input_query);

  var user_id = input.rows[0].USER_INPUT_ID;
  var user_disabled_type = input.rows[0].USER_DISABLED_TYPE;
  var user_want_theme = input.rows[0].WANT_TOURPLACE_TYPE;
  var user_want_area = input.rows[0].WANT_AREA;
  var user_need_hotel = input.rows[0].NEED_HOTEL;

  return [
    user_id,
    user_disabled_type,
    user_want_theme,
    user_want_area,
    user_need_hotel,
  ];
}

// 지역코드로 1차 필터링하는 함수
async function filter_wantArea(connection, want_area) {
  // TOURPLACE 에서 AREACODE에 해당하는 관광지들 받아오기
  var filter_area_query1 = `SELECT tourplace_id FROM tourplace WHERE areacode = ${want_area}`;
  var filter_area_query2 = `SELECT count(*) as a FROM tourplace WHERE areacode = ${want_area}`;
  var filtered_tourplace = await connection.execute(filter_area_query1);
  // FOR문에 필요한 필터된 총 관광지 숫자
  var n_filtered_tourplace = await connection.execute(filter_area_query2);
  // console.log(n_filtered_tourplace.rows[0].A);

  var newArray = [];

  for (i = 0; i < n_filtered_tourplace.rows[0].A - 1; i++) {
    var filtered = filtered_tourplace.rows[i].TOURPLACE_ID;
    newArray.push(filtered);
  }
  // 원하는 지역에 있는 관광지 ID Array만을 리턴합니다.
  return newArray;
}

// 관광지의 시군구로 음식점/호텔 필터링하는 함수
async function filter_address2(connection, address2, place_type) {
  var filter_query1 = `SELECT ${place_type}_id FROM ${place_type} WHERE address2 = '${address2}'`;
  var filter_query2 = `SELECT count(*) as a FROM ${place_type} WHERE address2 = '${address2}'`;
  var filtered = await connection.execute(filter_query1);
  // FOR문에 필요한 필터된 총 음식점 숫자
  var n_filtered= await connection.execute(filter_query2);

  var newArray = [];

  for (i = 0; i < n_filtered.rows[0].A - 1; i++) {
    var filtered_item;
    if (place_type == 'restaurant') {
      filtered_item = filtered.rows[i].RESTAURANT_ID;
    }
    else {
      filtered_item = filtered.rows[i].HOTEL_ID;
    }
    
    newArray.push(filtered_item);
  }
  // console.log(newArray)

  // 원하는 지역에 있는 음식점 ID Array만을 리턴합니다.
  return newArray;
}

module.exports = { save_user_input, load_user_input, filter_wantArea, filter_address2 }