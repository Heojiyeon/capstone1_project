const express = require('express');
const router = express.Router();

const run_auth = require('../js/run_auth');
const db = require('../js/db');

// DB 관련 설정
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// 로그인 및 회원가입 관련 부분 라우팅

// 로그인 화면
router.get('/login', async (req, res) => {
    // DB Initialize
    await db.pool_init();
    res.render('login');
});

// 회원가입 화면
router.get('/join', async (req, res) => {
    // DB Initialize
    await db.pool_init();
    res.render('join');
});

// 로그인 체크
router.post('/logged_in', async (req, res) => {
    console.log(req.body);
    var id = req.body.id;
    var pw = req.body.pw;
    var auth = await run_auth.login_check(id, pw);
    if (auth) {
        res.redirect('/question');
    } else {
        res.redirect('/login')
    }
});

// 회원가입 등록
router.post("/register", async (req, res) => {
    console.log(req.body);
    var id = req.body.id;
    var pw = req.body.pw;
    var email = req.body.email;
    var name = req.body.name;
    try {
        await run_auth.join(id, pw, email, name);
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;