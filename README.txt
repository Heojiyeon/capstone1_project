무장애 관광코스 추천 시스템 "무야호"
: " 관광지 - 음식점 - 숙박시설 " 을 한눈에 확인할 수 있는 사용자 맞춤형 추천 서비스를 제공합니다.

개발 ( 명지대학교 융합소프트웨어학부 강희수 권민찬 소유정 허지연 )



<관광지 추천도 계산 알고리즘>
!완료 ! 1. input이 제출될 때마다 value 저장
        (inputid, disabledtype, tourplacetype, wantarea, needhotel)

!완료! 2. 원하는 관광지역으로 1차 필터링 
        서울 || 경기

!완료! 3. disabledtype, tourplacetype으로 해당 관광지역 관광지 각각 점수화

!완료! 4. 점수화된 관광지 순위 정렬

!완료! 5. 1- 10등 관광지 정보 확인
        [id, name, score]

<음식점 추천도 계산 알고리즘>
1. tourScoring.js에서 계산된 10등까지 관광지 정보 불러오기
    (disabledtype)
2. 추천된 관광지의 tid를 통해 거리 계산 및 음식점 추천 시작

<숙박시설 추천도 계산 알고리즘>
1. restaurant_scoring.js에서 계산된 10들까지 관광지 정보 불러오기 
2. 추천된 관광지의 tid를 통해 거리 계산 및 음식점 추천 시작


