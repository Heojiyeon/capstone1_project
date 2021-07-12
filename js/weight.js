// 관광지 가중치 불러오기
async function load_tour_weight(user_disabled_type) {
    var total_weight;
    if (user_disabled_type = "physical") {
      total_weight = { "theme" : 0.4, "rating" : 0.1, "conv" : 0.5 }; 
    }
    else if (user_disabled_type = "visual") {
      total_weight = { "theme" : 0.4, "rating" : 0.2, "conv" : 0.4 }; 
    }
    else if (user_disabled_type = "hearing") {
      total_weight = { "theme" : 0.5, "rating" : 0.15, "conv" : 0.35 }; 
    }
    return total_weight
}
// 음식점 가중치 불러오기
async function load_res_weight(user_disabled_type) {
    var total_weight;
    if (user_disabled_type = "physical") {
        total_weight = { "dist" : 0.5, "rating" : 0.1, "conv" : 0.4 }; 
    }
    else if (user_disabled_type = "visual") {
        total_weight = { "dist" : 0.3, "rating" : 0.4, "conv" : 0.3 }; 
    }
    else if (user_disabled_type = "hearing") {
        total_weight = { "dist" : 0.3, "rating" : 0.6, "conv" : 0.1 }; 
    }
    return total_weight
}

// 호텔 가중치 불러오기
async function load_hotel_weight(user_disabled_type) {
  var total_weight;
  if (user_disabled_type = "physical") {
      total_weight = { "dist" : 0.5, "rating" : 0.1, "conv" : 0.4 }; 
  }
  else if (user_disabled_type = "visual") {
      total_weight = { "dist" : 0.3, "rating" : 0.4, "conv" : 0.3 }; 
  }
  else if (user_disabled_type = "hearing") {
      total_weight = { "dist" : 0.3, "rating" : 0.6, "conv" : 0.1 }; 
  }
  return total_weight
}

module.exports = { load_tour_weight, load_res_weight, load_hotel_weight };