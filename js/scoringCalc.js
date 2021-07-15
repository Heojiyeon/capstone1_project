// 테마 점수 계산 함수
async function theme_scoring(connection, tid, user_want_theme) {
  // 해당 관광지 테마
  var theme_query = `SELECT type FROM tourplace WHERE tourplace_id = '${tid}'`;
  var theme = await connection.execute( theme_query );
  var total_theme_score;
  if (theme.rows[0].TYPE == null) {
    total_theme_score = 0;
    // console.log("해당 관광지의 테마는: 없어요!");
    // console.log("테마 점수는: ", total_theme_score);
  } else {
    ref = ['industry', 'history', 'nature', 'culture', 'shopping']
    diff = ref.indexOf(user_want_theme)-ref.indexOf(theme.rows[0].TYPE)
    // 10점 만점에서 두 테마의 차를 절대값, 2배를 뺀다.
    var total_theme_score = 10 - (Math.abs(diff))*2;
    // console.log("해당 관광지의 테마는: ", theme.rows[0].TYPE);
    // console.log("테마 점수는: ", total_theme_score);
  }
  return total_theme_score
}

// 평점 점수 계산 함수
async function rate_scoring(connection, id, place_type) {
    rate_query = `SELECT rating_score, w_rating FROM rating_${place_type} WHERE ${place_type}_id = '${id}'`;
    var rate = await connection.execute( rate_query );
    var total_rate_score;
    if (rate.rows[0] == null) {
      // console.log("해당 평점 점수: 없어요!");
      total_rate_score = 0;
    } else {
      total_rate_score = rate.rows[0].RATING_SCORE * rate.rows[0].W_RATING;
      // console.log("평점 점수는: ", total_rate_score);
    }
      return total_rate_score
}

// 편의시설 점수 계산 함수
async function conv_scoring(connection, id, user_disabled_type, place_type) {
  var conv_query = `SELECT ${user_disabled_type} FROM convenience_${place_type} WHERE ${place_type}_id = '${id}'`;
  var conv = await connection.execute( conv_query );
  var total_conv_score;
  if ( conv.rows[0] == null ) {
    // console.log("해당 편의시설 점수: 없어요!");
    total_conv_score = 0;
  } else {
    if (user_disabled_type == 'physical') {
      total_conv_score = parseInt(conv.rows[0].PHYSICAL);
    } else if (user_disabled_type == 'visual') {
      total_conv_score = parseInt(conv.rows[0].VISUAL);
    } else if (user_disabled_type == 'hearing') {
      total_conv_score = parseInt(conv.rows[0].HEARING);
    }
  }
  // console.log("편의시설 점수는: ", total_conv_score);
  return total_conv_score
}

// 거리 점수 계산 함수
async function dist_scoring(connection, tid, pid, place_type) {
  // 선택된 관광지의 X,Y 좌표를 가져옵니다.
  var t_locationQ = `SELECT MAPX, MAPY FROM TOURPLACE WHERE TOURPLACE_ID = '${tid}'`;
  // 선택된 음식점 혹은 호텔의 X,Y 좌표를 가져옵니다.
  var p_locationQ = `SELECT MAPX, MAPY FROM ${place_type} WHERE ${place_type}_ID = '${pid}'`;

  var tl = await connection.execute( t_locationQ );
  var pl = await connection.execute( p_locationQ );

  var tour_x = tl.rows[0].MAPX;
  var tour_y = tl.rows[0].MAPY;
  var p_x = pl.rows[0].MAPX;
  var p_y = pl.rows[0].MAPY;

  // -- XY좌표로 거리를 계산하는 부분-- //
  // XY좌표를 계산 가능한 lat, lng로 변환
  var dLat = (tour_x - p_x) * (Math.PI/180);
  var dLon = (tour_y - p_y) * (Math.PI/180);
  var val1 = (tour_x) * (Math.PI/180);
  var val2 = (p_x) * (Math.PI/180);
  const earth_rad = 6371;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(val1) * Math.cos(val2) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  // d가 관광지와 음식점의 최종거리
  var d = earth_rad * c; 

  var dist_score;

  // 실제 거리 값으로 거리점수를 매깁니다.
  if (1 >= d ){
      dist_score = 10
  } else if ( d > 1 && d <2 ){
      dist_score = 9
  }else if ( d > 2 && d <3 ){
      dist_score = 8
  }else if ( d > 3 && d <4 ){
      dist_score = 7
  }else if ( d > 4 && d <5 ){
      dist_score = 6
  }else if ( d > 5 ){
      dist_score = 5
  }

  // console.log("거리 점수는 : ", dist_score)

  // 실제 거리 값과 거리점수 값 둘 다 저장합니다.
  return [d, dist_score]
}

module.exports = { theme_scoring, rate_scoring, conv_scoring, dist_scoring };