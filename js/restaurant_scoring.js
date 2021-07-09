//음식점과 관광지의 x,y좌표를 가져오는 함수
async function restaurant_location(connection, tid, address) {
        
    //관광지의 컬럼을 가져오는 SQL문
    var t_locationQ = `SELECT * FROM TOURPLACE WHERE TOURPLACE_ID = '${tid}'`;
    ``
    //음식점의 컬럼을 가져오는 SQL문
    var r_locationQ =  `SELECT * FROM RESTAURANT WHERE ADDRESS2 = '${address}'`;

    var tl = await connection.execute( t_locationQ );
    var rl = await connection.execute( r_locationQ );
    console.log("관광지 명 : ", tl.rows[0].NAME)
    console.log("관광지 ID : ",tl.rows[0].TOURPLACE_ID);
    console.log("음식점 명: " ,rl.rows[3].NAME);
    console.log("음식점 ID : ",rl.rows[3].RESTAURANT_ID);

    var res_info = rl.rows[3];

    var TourPlace_address = tl.rows[0].ADDRESS2;  
    var TourPlace_X = tl.rows[0].MAPX;
    var TourPlace_Y = tl.rows[0].MAPY;

    var ResX = rl.rows[3].MAPX;
    var ResY = rl.rows[3].MAPY;
    var ResID = rl.rows[3].RESTAURANT_ID;

    console.log('관광지의 구 :', TourPlace_address );
    console.log('음식점의 MapX :', ResX );
    console.log('음식점의 MapY :', ResY );

    return [TourPlace_X, TourPlace_Y, ResX, ResY, ResID, res_info]
}

//음식점과 관광지의 거리를 얻어오는 함수
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

    //d가 관광지와 음식점의 최종거리입니다
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
    return [d,total_rate_score]; 
}

// 평점 점수 계산 함수
async function rate_scoring(connection, restaurant_id) {
    rate_query = `SELECT rating_score, w_rating FROM rating_restaurant WHERE restaurant_id = '${restaurant_id}'`;
    var rate = await connection.execute( rate_query );
    var total_rate_score = rate.rows[0].RATING_SCORE * rate.rows[0].W_RATING
    console.log("평점 점수 : ", total_rate_score);
    return total_rate_score
  }

// 편의시설 점수 계산 함수
async function conv_scoring(connection,restaurant_id, user_disabled_type) {
    var conv_query;
    conv_query = `SELECT ${user_disabled_type} FROM CONVENIENCE_RESTAURANT WHERE restaurant_id = '${restaurant_id}'`;
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

module.exports = { restaurant_location, getDistance, rate_scoring, conv_scoring };




// async function run() {
//     let connection;
//     try {
//       connection = await oracledb.getConnection( {
//         user          : "admin",
//         password      : mypw,
//         connectString : "database-1.crfqzvtrltdy.ap-northeast-2.rds.amazonaws.com/DATABASE"
//     });


//     //파라미터의 두번째 인자(162315...)가 장애유형의 input
//     u = await load_user_input(connection, 1623151866104);

//     //tid 가 관광지 input입니다
//     //이 관광지 아이디로 부터 전부 시작됩니다
//     //관광지 아이디가 들어오고 관광지가 속한 '구'를 받아옵니다
//     var tid = 'T243'
    
    
  
//     } catch (err) {
//       console.error(err);
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   }
