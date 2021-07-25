async function tourplace_recommend(connection, f, want_theme, disabled_type) {
    // 직접 만든 모듈 Import
    const scoringCalc = require('./scoringCalc');
    const weight = require('./weight');

    var scores = [];

    // 전체 관광지에서의 추천도 계산 반복문 
    for (i = 0; i < f.length; i++) {
        t = await scoringCalc.theme_scoring(connection, f[i], want_theme);
        r = await scoringCalc.rate_scoring(connection, f[i], 'tourplace');
        c = await scoringCalc.conv_scoring(connection, f[i], disabled_type, 'tourplace');
        w = await weight.load_tour_weight(disabled_type);
        recommend_score = w.theme*t + w.rating*r + w.conv*c;
  
        // console.log("최종 추천도 점수는: ", recommend_score);
        // console.log("관광지 아이디는: ", f[i]);
        // console.log("_________________");
  
        var new_score = {};
        new_score.id = f[i];
        new_score.theme_score = w.theme*t;
        new_score.rate_score = w.rating*r;
        new_score.conv_score = w.conv*c;
        new_score.recommend_score = recommend_score;
  
        scores.push(new_score);
    }

    // 상위 10개 정렬 - rank_score 에 관광지ID와 각 항목 점수가 담겨있다.
    scores.sort((a, b) => b.recommend_score - a.recommend_score);
    const rank_score = scores.slice(0, 10);
    console.log("당신을 위해 계산한 관광지 갯수 : ", f.length);

    return rank_score
}

module.exports = { tourplace_recommend };