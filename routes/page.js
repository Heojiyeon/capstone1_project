const express = require('express');
const router = express.Router();
var trying_al = require('../js/trying_al');
var for_front;

// 홈 화면
router.get('/', (req, res, next) => {
    res.render('home');
});

// 로그인 화면
router.get('/login', (req, res) => {
    res.render('login');
});

// 사용자 인풋 화면
router.get('/question', (req, res) => {
    res.render('question');
});

router.get('/loading', async (req, res) => {
    for_front = await trying_al.tour_run();
    res.redirect("/trying")
});

// 유저로부터 reply를 요청받으면
router.post('/reply', async (req, res) => {
    console.log(req.body);
    var disabled = req.body.disabled;
    var tourplace = req.body.tourplace;
    var wantArea = req.body.wantArea;
    var needHotel = req.body.needHotel;
    try {
        await trying_al.question_run(disabled, tourplace, wantArea, needHotel);
        res.redirect("/loading");

    } catch (err) {
        console.log("등록 중 에러가 발생했어요!!", err)
        res.end("Fail!");
    }
});

// 관광지 추천 화면
router.get('/trying', async (req, res, next) => {
    // const for_front = await trying_al.tour_run();
    res.render('trying', {
        for_front : for_front
    });
})

// 유저의 선택을 받은 관광지는?!
router.post('/trying', async (req, res) => {
    const user_choice_tourplace = req.body.user_choice;
    res.send(user_choice_tourplace);
})

// router.get("/res", async (req, res, next) => {

// }


module.exports = router;

