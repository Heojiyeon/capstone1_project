const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
const mypw = "capstone1234";

// Connection Pool 생성
async function pool_init() {
  try {
    await oracledb.createPool({
      user          : "admin",
      password      : mypw,
      connectString : "database-1.crfqzvtrltdy.ap-northeast-2.rds.amazonaws.com/DATABASE",
      poolIncrement : 0,
      poolMax       : 4,
      poolMin       : 4,
      poolAlias: 'mypool'
    });

  } catch (err) {
    console.error("init() error: " + err.message);
  }
}

module.exports = { pool_init }