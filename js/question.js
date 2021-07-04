// 유저 인풋 DB에 저장하는 함수
async function save_user_input(connection, disabled, tourplace, needHotel, wantArea) {
    var inputId = new Date().getTime();
    var input_save_query = `INSERT INTO user_input (user_input_id, user_disabled_type, want_tourplace_type, need_hotel, want_area)
    VALUES(${inputId}, ${disabled}, ${tourplace}, ${needHotel}, ${wantArea})`;
    await connection.execute(input_save_query);
}
