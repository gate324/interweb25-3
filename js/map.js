/*프로그램명 : 검색 바
설명 : 빠르게 검색 수행 및 list.html로 이동+검색결과 반영하여 결과 출력하도록 정보 넘김
작성일시 : 2025.06.05
작성자 : 채다현 */

kakao.maps.load(function () {
const mapContainer = document.getElementById('kakao-map'); //이게 지도 표시 영역
const placesList = document.querySelector(".shop-scroll-area"); //이게 목록 표시 영역
let map, ps;
const markers = [];

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert("GPS를 지원하지 않습니다.");
}

function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const loc = new kakao.maps.LatLng(lat, lng);

  map = new kakao.maps.Map(mapContainer, {
    center: loc,
    level: 4
  });

  ps = new kakao.maps.services.Places();
  ps.keywordSearch("칵테일 바", placesSearchCB, { //검색 키워드
    location: loc,
    radius: 3000
  });

  new kakao.maps.Marker({
    map: map,
    position: loc
  });
}

function error() {
  alert("위치 정보를 가져올 수 없습니다.");
}

function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    placesList.innerHTML = "";
    markers.forEach(marker => marker.setMap(null));
    markers.length = 0;

    data.forEach((place, index) => {
      const position = new kakao.maps.LatLng(place.y, place.x);
      const marker = new kakao.maps.Marker({
        map: map,
        position: position,
        zIndex: 1
      });
      markers.push(marker);

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:0.9rem;">${place.place_name}</div>`
      });

      kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

      // HTML 리스트 아이템 생성
      const el = document.createElement("div");
      el.className = "shop";
      el.innerHTML = `
        <div class="shop-num">${index + 1}</div>
        <div class="shop-text">
          <div class="shop-header">
            <h6>${place.place_name}</h6>
            <div class="shop-distance">${place.distance ? (place.distance >= 1000 ? (place.distance / 1000).toFixed(1) + "Km" : place.distance + "m") : "정보 없음"}</div>
          </div>
          <p>주소 : ${place.road_address_name || place.address_name || "주소 정보 없음"}</p>
          <p>전화번호 : ${place.phone || "정보 없음"}</p>
        </div>
      `;

      // 마커 강조 이벤트 연결
      el.addEventListener('mouseover', () => {
        marker.setZIndex(10);
        marker.setImage(new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 36)
        ));
      });

      el.addEventListener('mouseout', () => {
        marker.setZIndex(1);
        marker.setImage(null);
      });

      placesList.appendChild(el);
    });
  } else {
    placesList.innerHTML = "<p>검색 결과가 없습니다.</p>";
  }
}
});