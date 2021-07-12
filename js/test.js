async function testrun () {
    const db = require('./db');
    const common = require('./common');
    let connection;

    await db.init();
    try {
        connection = oracledb.getConnection();
        var tr = await common.load_user_input(connection);
        console.log(tr);
    
    } catch (err) {
        console.error(err); 
    }
}

testrun();
