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
      poolAlias: 'mypool',
      enableStatistics : true,
    });
    console.log("DB Pool Initialized!");
  } catch (err) {
    console.error("init() error: " + err.message);
  }
}

async function closePoolAndExit() {
  console.log("DB Terminating");
  try {
    await oracledb.getPool('mypool').close(30);
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { pool_init, closePoolAndExit }