// 상위 10개의 이름 출력
async function print_topten(connection, place_type, rank_score) {
    for (let i of rank_score) {
        print_name = await connection.execute(`SELECT name FROM ${place_type} WHERE ${place_type}_id = '${i.id}'`);
        console.log(i.id, ": ", print_name.rows[0].NAME);
    }
}

// 관광지 편의시설, 상세정보 불러오기 (SQL - JOIN)
async function load_info(connection, tid) {
    var load_info_query = `SELECT *
    FROM (SELECT * FROM TOURPLACE TP
    JOIN CONVENIENCE_TOURPLACE CTP
    ON TP.TOURPLACE_ID = CTP.TOURPLACE_ID
    JOIN DETAIL_TOURPLACE DTP 
    ON TP.TOURPLACE_ID = DTP.TOURPLACE_ID) SRC
    WHERE SRC.TOURPLACE_ID = '${tid}'`;

    var load_info = await connection.execute( load_info_query );

    return load_info.rows[0]
}

// 음식점, 호텔 편의시설 정보 불러오기 (SQL - JOIN)
async function load_info2(connection, id, place_type) {
    var load_info_query = `SELECT *
    FROM ${place_type}
    JOIN convenience_${place_type}
    ON ${place_type}.${place_type}_id = convenience_${place_type}.${place_type}_id
    WHERE ${place_type}.${place_type}_id = '${id}'`;

    var load_info = await connection.execute( load_info_query );

    return load_info.rows[0]
}

module.exports = { print_topten, load_info, load_info2 };