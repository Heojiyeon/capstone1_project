const express = require('express');
const router = express.Router();
var trying_al = require('../js/trying_al');

router.get('/', (req, res, next) => {
    res.render('home');
});

// login 화면
router.get('/login', (req, res) => {
    res.render('login');
});

// question 화면
router.get("/question", (req, res) => {
    res.render('question');
});

// 관광지 추천 화면
router.get("/trying", async (req, res, next) => {
    const ten = await trying_al.run();
    res.render('trying', {
        ten : ten
    });
})

// router.get("/res", async (req, res, next) => {

// }


module.exports = router;

