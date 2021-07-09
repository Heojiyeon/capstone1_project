//숙박업소와 관광지의 x,y좌표를 가져오는 함수
async function hotel_location(connection, tid, address) {

        
  //관광지의 컬럼을 가져오는 SQL문
  var t_locationQ = `SELECT * FROM TOURPLACE WHERE TOURPLACE_ID = '${tid}'`;
  
  //숙박업소의 컬럼을 가져오는 SQL문
  var h_locationQ =  `SELECT * FROM HOTEL WHERE ADDRESS2 = '${address}'`;

  var tl = await connection.execute( t_locationQ );
  var hl = await connection.execute( h_locationQ );
  console.log("관광지 명 : ", tl.rows[0].NAME)
  console.log("관광지 ID : ",tl.rows[0].TOURPLACE_ID);
  console.log("    ");
  console.log("호텔 명: " ,hl.rows[0].NAME);
  console.log("호텔 ID : ",hl.rows[0].HOTEL_ID);
 
  var TourPlace_address = tl.rows[0].ADDRESS2;  
  var TourPlace_X = tl.rows[0].MAPX;
  var TourPlace_Y = tl.rows[0].MAPY;

  
  var hotX = hl.rows[0].MAPX;
  var hotY = hl.rows[0].MAPY;
  var hotID = hl.rows[0].HOTEL_ID;

  console.log('관광지의 구 :', TourPlace_address );
  console.log("    ");
  console.log('호텔의 MapX :', hotX);
  console.log('호텔의 MapY :', hotY );
  console.log("    ");

  return [TourPlace_X, TourPlace_Y, hotX, hotY, hotID]
}

//호텔과 관광지의 거리를 얻어오는 함수
async function getDistance(lat1,lng1,lat2,lng2) { 
  async function deg2rad(deg) {
    return deg * (Math.PI/180) 
  }
  var R = 6371; // Radius of the earth in km 
  var dLat = await deg2rad(lat2-lat1);
  var dLon = await deg2rad(lng2-lng1); 
  var val1 = await deg2rad(lat1);
  var val2 = await deg2rad(lat2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2)
  + Math.cos(val1) * Math.cos(val2) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; 
  console.log("관광지와의 거리 : ", d)
  console.log("    ");

  //d가 관광지와 호텔의 최종거리입니다
  //d가 1보다 작거나 같으면 10점, 1보다크고 2보다 작으면 9점...
  var total_rate_score;
  if (1 >= d ){
      total_rate_score = 10
  } else if ( d > 1 && d <2 ){
      total_rate_score = 9
  }else if ( d > 2 && d <3 ){
      total_rate_score = 8
  }else if ( d > 3 && d <4 ){
      total_rate_score = 7
  }else if ( d > 4 && d <5 ){
      total_rate_score = 6
  }else if ( d > 5 ){
      total_rate_score = 5
  }
  console.log("거리 점수 : ", total_rate_score)
  return [d , total_rate_score]; 
}

// 평점 점수 계산 함수
async function rate_scoring(connection, Hotel_id) {
  rate_query = `SELECT rating_score, w_rating FROM rating_hotel WHERE hotel_id = '${Hotel_id}'`;
  var rate = await connection.execute( rate_query );
  var total_rate_score = rate.rows[0].RATING_SCORE * rate.rows[0].W_RATING
  console.log("평점 점수 : ", total_rate_score);
  return total_rate_score
}

// 편의시설 점수 계산 함수
async function conv_scoring(connection, Hotel_id, user_disabled_type) {
  var conv_query;
  conv_query = `SELECT ${user_disabled_type} FROM CONVENIENCE_HOTEL WHERE hotel_id = '${Hotel_id}'`;
  var conv = await connection.execute( conv_query );
  var total_conv_score;
  if (user_disabled_type == 'physical') {
    total_conv_score = parseInt(conv.rows[0].PHYSICAL);
  } else if (user_disabled_type == 'visual') {
    total_conv_score = parseInt(conv.rows[0].VISUAL);
  } else if (user_disabled_type == 'hearing') {
    total_conv_score = parseInt(conv.rows[0].HEARING);
  }
  console.log("편의시설 점수 : ", total_conv_score);
  return total_conv_score
}

module.exports = { hotel_location, getDistance, rate_scoring, conv_scoring };