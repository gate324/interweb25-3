/*프로그램명 : 마우스 커서
설명 : 사이트 컨셉에 적합한 마우스 커서 생성 기능
작성일시 : 2025.06.16
작성자 : 김재경 */

const cursor = document.getElementById("customCursor");
const cursorImg = cursor.querySelector(".cursor-basic");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.addEventListener("mousedown", () => {
  cursorImg.src = "image/click.png";
  cursor.classList.add("clicked"); 
});

document.addEventListener("mouseup", () => {
  cursorImg.src = "image/null.png";
  cursor.classList.remove("clicked");
});

/*프로그램명 : 토스트 메시지
설명 : 칵테일 이미지 클릭 시 칵테일명 클립보드에 복사 알림 기능
작성일시 : 2025.06.17
작성자 : 채다현 */

function showToast(message) {
const toast = document.getElementById("toast");
toast.textContent = message;
toast.classList.add("show");

setTimeout(() => {
toast.classList.remove("show");
}, 2000);
}

document.querySelectorAll('.slide-box img').forEach(img => {
img.addEventListener('click', () => {
const cocktailName = img.alt;
navigator.clipboard.writeText(cocktailName)
.then(() => {
    showToast(`클립보드 '${cocktailName}' 복사 완료!`);
})
.catch(err => {
    showToast("복사 실패");
    console.error(err);
});
});
});

/*프로그램명 : 메인페이지 지도 미리보기
설명 : 주변 칵테일 바 표시+스크롤로 확대 방지 및 map.js로 이동 기능 
작성일시 : 2025.06.17
작성자 : 채다현 */

kakao.maps.load(function () {
const mapContainer = document.getElementById('map');
const placesList = document.getElementById("places-list");
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
    level: 4,
    disableZoom: true
});
map.setZoomable(false);  // 휠 확대 방지

ps = new kakao.maps.services.Places();
ps.keywordSearch("칵테일 바", placesSearchCB, {
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
    });
} else {
    placesList.innerHTML = "<p>검색 결과가 없습니다.</p>";
}
}
});

/*프로그램명 : 검색 바
설명 : 빠르게 검색 수행 및 list.html로 이동+검색결과 반영하여 결과 출력하도록 정보 넘김
작성일시 : 2025.06.17
작성자 : 채다현 */

function goSearch() {
  const keyword = document.getElementById("text").value.trim();
  if (keyword) {
    window.location.href = `list.html?query=${encodeURIComponent(keyword)}`;
  }
}

function enterSearch(event) {
  if (event.key === "Enter") {
    goSearch();
  }
}

/*프로그램명 : 로그인 시 헤더 표시
설명 : 임시 로그인 데이터 출력 기능
작성일시 : 2025.06.20
작성자 : 채다현 */

window.addEventListener("DOMContentLoaded", () => {
const nickname = localStorage.getItem("nickname");
const userDiv = document.querySelector(".user");

if (nickname && userDiv) {
  userDiv.innerHTML = `
  <a href="list.html"><img src="image/search-24.svg"style="cursor: pointer;" alt="search"></a>
  <span style="margin-right: 10px;">${nickname}님</span>
  <a href="logout.html">로그아웃</a>
  `;
}
});