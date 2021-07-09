// 테마 점수 계산 함수
async function theme_scoring(connection, tid, user_want_theme) {
  // 해당 관광지 테마
  var theme_query = `SELECT type FROM tourplace WHERE tourplace_id = '${tid}'`;
  var theme = await connection.execute( theme_query );
  var total_theme_score;
  if (theme.rows[0].TYPE == null) {
    total_theme_score = 0;
    console.log("해당 관광지의 테마는: 없어요!");
    console.log("테마 점수는: ", total_theme_score);
  } else {
    ref = ['industry', 'history', 'nature', 'culture','shopping']
    diff = ref.indexOf(user_want_theme)-ref.indexOf(theme.rows[0].TYPE)
    // 10점 만점에서 두 테마의 차를 절대값, 2배를 뺀다.
    var total_theme_score = 10 - (Math.abs(diff))*2;
    console.log("해당 관광지의 테마는: ", theme.rows[0].TYPE);
    console.log("테마 점수는: ", total_theme_score);
  }
  return total_theme_score
}

// 평점 점수 계산 함수
async function rate_scoring(connection, tid) {
    rate_query = `SELECT rating_score, w_rating FROM rating_tourplace WHERE tourplace_id = '${tid}'`;
    var rate = await connection.execute( rate_query );
    var total_rate_score;
    if (rate.rows[0] == null) {
      console.log("해당 평점 점수: 없어요!");
      total_rate_score = 0;
    } else {
      total_rate_score = rate.rows[0].RATING_SCORE * rate.rows[0].W_RATING;
      console.log("평점 점수는: ", total_rate_score);
    }
      return total_rate_score
}

// 편의시설 점수 계산 함수
async function conv_scoring(connection, tid, user_disabled_type) {
  var conv_query = `SELECT ${user_disabled_type} FROM convenience_tourplace WHERE tourplace_id = '${tid}'`;
  var conv = await connection.execute( conv_query );
  var total_conv_score;
  if ( conv.rows[0] == null ) {
    console.log("해당 편의시설 점수: 없어요!");
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
  console.log("편의시설 점수는: ", total_conv_score);
  return total_conv_score
}

module.exports = { theme_scoring, rate_scoring, conv_scoring };