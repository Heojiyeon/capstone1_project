const express = require('express');
const router = express.Router();

const run_al = require('../js/run_al');

var for_front_t;
var for_front_r;
var for_front_h;
var user_choice_tour;
var user_choice_res;
var user_choice_hotel;
var uc_for_front
var needHotel;

// 홈 화면
router.get('/', (req, res) => {
    res.render('home');
});

// 로그인 후 진행되는 시나리오...

// 1. 사용자 인풋 화면
router.get('/question', (req, res) => {
    res.render('question');
});

// 1.5 사용자 인풋 저장
router.post('/reply', async (req, res) => {
    console.log(req.body);
    var disabled = req.body.disabled;
    var tourplace = req.body.tourplace;
    var wantArea = req.body.wantArea;
    needHotel = req.body.needHotel;
    try {
        await run_al.question_run(disabled, tourplace, wantArea, needHotel);
        // res.redirect('/loading_tour');
        res.redirect('/loading_tour')

    } catch (err) {
        console.log("등록 중 에러가 발생했어요!!", err)
        res.end("Fail!");
    }
});

// 2. 관광지 추천 로딩
router.get('/loading_tour', async (req, res) => {
    // res.render('loading.pug');
    for_front_t = await run_al.tour_run();
    res.redirect('/resultTour');
});

// 3. 관광지 추천결과
router.get('/resultTour', async (req, res) => {
    res.render('resultTour', {
        for_front_t : for_front_t
    });
});

// 4. 유저의 선택을 받은 관광지는?!
router.post('/user_choice_tour', async (req, res) => {
    user_choice_tour = req.body.user_choice_tour;
    res.redirect('/loading_res');
});

// 5. 음식점 추천 로딩
router.get('/loading_res', async (req, res) => {
    for_front_r = await run_al.res_run(user_choice_tour);
    res.redirect('resultRes');
});

// 6. 음식점 추천결과
router.get('/resultRes', async (req, res) => {
    res.render('resultRes', {
        for_front_r : for_front_r
    });
});

// 7. 유저의 선택을 받은 음식점은?!
router.post('/user_choice_res', async (req, res) => {
    user_choice_res = req.body.user_choice_res;
    if (needHotel == "1") {
        res.redirect('loading_hotel');
    } else {
        res.redirect('/viewCourse');
    }
});

// 8. 숙박시설 추천 로딩
router.get('/loading_hotel', async (req, res) => {
    for_front_h = await run_al.hotel_run(user_choice_tour);
    res.redirect('resultHotel');
});


// 9. 숙박시설 추천결과
router.get('/resultHotel', async (req, res) => {
    res.render('resultHotel', {
        for_front_h : for_front_h
    });
});

// 10. 유저의 선택을 받은 숙박시설은?!
router.post('/user_choice_hotel', async (req, res) => {
    user_choice_hotel = req.body.user_choice_hotel;
    res.redirect('viewCourse');
});

// 10. 최종결과 (코스)
router.get('/viewCourse', async (req, res) => {
    if (needHotel == "1") {
        uc_for_front = await run_al.uc_run1(user_choice_tour, user_choice_res, user_choice_hotel);
    } else {
        uc_for_front = await run_al.uc_run2(user_choice_tour, user_choice_res);
    }
    res.render('viewCourse', {
        uc : uc_for_front
    });
});

module.exports = router;
