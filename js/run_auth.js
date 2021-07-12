// DB 관련 설정
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const db = require('../js/db');

// DB와의 연결입니다.
let connection;

// DB에 접속합니다.
async function db_run () {
    try {
        // await db.pool_init();
        connection = await oracledb.getConnection('mypool'); // 아주 중요한 부분!!!
    } catch (err) {
        console.error(err); 
    }
}

async function join(id, pw, email, name) {
    await db_run();
    try {
        var join_query = `INSERT INTO member_info
        VALUES('${id}', '${pw}', '${email}', '${name}')`;
        await connection.execute(join_query);
        console.log("회원가입이 완료되었습니다!")
    } catch (err) {
        console.error(err, "회원가입에 실패하였습니다."); 
    }
}

async function login_check(id, pw) {
    await db_run();
    try {
        // 유저가 입력한 아이디의 비번을 불러옵니다.
        var check_query = `SELECT password FROM member_info WHERE member_id='${id}'`;
        var correct_pw = await connection.execute(check_query);
        // console.log(typeof(correct_pw.rows[0].PASSWORD));
        if (pw === correct_pw.rows[0].PASSWORD) {
            console.log("로그인 성공!")
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error(err, "존재하지 않는 아이디입니다.");
    }
}

module.exports = { join, login_check }