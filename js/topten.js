// 상위 10개의 이름 출력
async function print_topten(connection, place_type, rank_score) {
    for (let i of rank_score) {
        print_name = await connection.execute(`SELECT name FROM ${place_type} WHERE ${place_type}_id = '${i.id}'`);
        console.log(i.id, ": ", print_name.rows[0].NAME);
    }
}

// 관광지 상세정보 불러오기 (SQL - JOIN)
async function load_info(connection, tid) {
    var load_info_query = `SELECT *
    FROM (SELECT * FROM TOURPLACE TP
    JOIN DETAIL_TOURPLACE DTP 
    ON TP.TOURPLACE_ID = DTP.TOURPLACE_ID) SRC
    WHERE SRC.TOURPLACE_ID = '${tid}'`;

    var load_info = await connection.execute( load_info_query );
    return load_info.rows
}

// 편의시설 상세정보 불러오기 (SQL - JOIN)
async function load_conv_info(connection, place_type, id) {
    var load_conv_query = `SELECT *
    FROM (SELECT * FROM ${place_type} T
    JOIN CONVENIENCE_${place_type} C
    ON T.${place_type}_ID = C.${place_type}_ID ) SRC
    WHERE SRC.${place_type}_ID = '${tid}'`;

    var load_conv = await connection.execute( load_conv_query );
    return load_conv.rows
}

module.exports = { load_info, load_conv_info };