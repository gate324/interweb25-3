/*프로그램명 : 검색 필터
설명 : 이름만 입력+필터만 선택+이름입력 필터선택 중복 결과 출력 기능
작성일시 : 2025.06.09-2025.06.18
작성자 : 채다현 */

// 이름 검색 + 필터 조건 동시 적용 + 빈 검색어 시 필터만 반영

const listContainer = document.querySelector(".list-image");
const input = document.getElementById("text");
const categoryFilter = document.getElementById("categoryFilter");
const ingredientFilter = document.getElementById("ingredientFilter");
const alcoholFilter = document.getElementById("AlcoholFilter");

const popupContainer = document.getElementById("popup-container");
const popupImage = popupContainer.querySelector(".popup-content img");
const popupTitle = popupContainer.querySelector(".popup-text h2");
const popupCaption = popupContainer.querySelector(".popup-caption");
const popupDesc = popupContainer.querySelector(".popup-text p");

function clearList() {
  listContainer.innerHTML = "";
}

function renderDrink(drink) {
  const ingredients = [];
  for (let i = 1; i <= 5; i++) {
    const ing = drink[`strIngredient${i}`];
    if (ing) ingredients.push(ing);
  }
  const html = `
    <div class="image-box">
      <div class="image-wrapper">
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
        <div class="overlay">${drink.strCategory || ''}</div>
        <p class="cocktail-name">${drink.strDrink}</p>
      </div>
    </div>
  `;
  listContainer.insertAdjacentHTML("beforeend", html);
  // 팝업 연결
const lastWrapper = listContainer.lastElementChild.querySelector(".image-wrapper");
lastWrapper.addEventListener("click", () => openPopup(drink));

}

async function searchCocktailsWithFilters() {
  clearList();
  const keyword = input.value.trim().toLowerCase();
  const cat = categoryFilter.value;  //카테고리(api에서 설정해놓은 변수명 사용)
  const ing = ingredientFilter.value; //재료
  const alc = alcoholFilter.value; //알코올 유무

  // 검색어가 비어 있을 경우, 필터만 적용
  if (!keyword) {
    let url;
    if (cat) url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${cat}`;
    else if (ing) url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ing}`;
    else if (alc) url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alc}`;

    if (url) {
      const res = await fetch(url);
      const data = await res.json();
      if (data.drinks) {
        for (const drink of data.drinks.slice(0, 20)) {
          const full = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
          const detail = await full.json();
          renderDrink(detail.drinks[0]);
        }
      } else {
        listContainer.innerHTML = '<p style="color:white;">필터 결과가 없습니다.</p>';
      }
      return;
    } else {
      listContainer.innerHTML = '<p style="color:white;">검색어 또는 필터를 입력해주세요.</p>';
      return;
    }
  }

  const nameUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`;
  let res = await fetch(nameUrl);
  let data = await res.json();

  if (!data.drinks) {
    listContainer.innerHTML = '<p style="color:white;">검색 결과가 없습니다.</p>';
    return;
  }

  if (!cat && !ing && !alc) {
    data.drinks.forEach(renderDrink);
    return;
  }

  const filtered = data.drinks.filter(drink => {
    const matchCat = cat ? drink.strCategory === cat : true;
    const matchIng = ing ? Object.values(drink).some((v, i) => i >= 17 && i <= 31 && v === ing) : true;
    const matchAlc = alc ? drink.strAlcoholic === alc : true;
    return matchCat && matchIng && matchAlc;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = '<p style="color:white; word-break:keep-all">필터 조건과 일치하는 결과가 없습니다.</p>';
    return;
  }

  filtered.forEach(renderDrink); //필터링 호출
}

function triggerSearch() {
  searchCocktailsWithFilters();
}

function handleKeySearch() {
  if (window.event.key === "Enter") {
    triggerSearch();
  }
}

function handleClickSearch() {
  triggerSearch();
}

async function populateFilters() {
  const [catRes, ingRes] = await Promise.all([
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list"),
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
  ]);
  const categories = await catRes.json();
  const ingredients = await ingRes.json();

  categories.drinks.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat.strCategory}">${cat.strCategory}</option>`;
  });

  ingredients.drinks.slice(0, 50).forEach(ing => {
    ingredientFilter.innerHTML += `<option value="${ing.strIngredient1}">${ing.strIngredient1}</option>`;
  });

  ["Alcoholic", "Non alcoholic", "Optional alcohol"].forEach(type => {
    alcoholFilter.innerHTML += `<option value="${type}">${type}</option>`;
  });

  const params = new URLSearchParams(window.location.search);
  const alcoholParam = params.get("alcohol");
  const queryParam = params.get("query");

  if (alcoholParam) {
    alcoholFilter.value = decodeURIComponent(alcoholParam);
  }
  if (queryParam) {
    input.value = decodeURIComponent(queryParam);
  }

  // 필터나 검색어가 있다면 자동 검색 실행
  if (alcoholParam || queryParam) {
    triggerSearch();
  }
}

function applyFilters() {
  searchCocktailsWithFilters();
}

categoryFilter.onchange = applyFilters;
ingredientFilter.onchange = applyFilters;
alcoholFilter.onchange = applyFilters;

populateFilters();

//여기서부터 팝업
function openPopup(drink) {
  popupImage.src = drink.strDrinkThumb;
  popupTitle.textContent = drink.strDrink;

  const ingredients = [];
  for (let i = 1; i <= 5; i++) {
    const ing = drink[`strMeasure${i}`] && drink[`strIngredient${i}`]
      ? `${drink[`strIngredient${i}`]} ${drink[`strMeasure${i}`]}`
      : drink[`strIngredient${i}`];
    if (ing) ingredients.push(ing);
  }

  popupCaption.textContent = ingredients.join(", ");
  popupDesc.textContent = drink.strInstructions || "";
  popupContainer.style.display = "flex";
}
function toggleHeart(element) {
    const isLiked = element.classList.toggle('liked');
    element.textContent = isLiked ? '♥' : '♡';
}

function closePopup() {
  popupContainer.style.display = "none";
}

// URL에서 query 파라미터 가져오기
function getQueryParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query");
}

const initialQuery = getQueryParam();
if (initialQuery) {
  input.value = decodeURIComponent(initialQuery);
  triggerSearch(); // 검색 자동 실행
}
