/*프로그램명 : 칵테일 유형 테스트
설명 : 문항 별 칵테일 요소 매핑 후 사용자 응답 결과에 가장 가까운 칵테일이 출력되도록 하는 기능
작성일시 : 2025.06.19
작성자 : 채다현 */

const questions = [
    { q: "지금 기분을 한마디로 표현하자면?", choices: ["놀고 싶다","쉬고 싶다","울고 싶다","외로워","두근두근해"], mapTo:"glass" },
    { q: "지금 있는 장소는?", choices: ["이불 속","혼술 중","여행 중","다같이 노는 중","야근 중"], mapTo:"ingredient" },
    { q: "목 마를 땐?", choices: ["스무디","에너지 드링크","아메리카노","생과일 주스","탄산음료"], mapTo:"ingredient" },
    { q: "좋아하는 영화 분위기는?", choices: ["라라랜드","존 윅","미드나잇 인 파리","토이스토리","기생충"], mapTo:"alcoholic" },
    { q: "오늘 하루를 색으로 표현하자면?", choices: ["노랑","파랑","빨강","초록","검정"], mapTo:"category" },
    { q: "위로받고 싶을 때 내게 필요한 것은?", choices: ["따뜻한 말","놀라운 선물","새 모험","아늑한 공간","유머"], mapTo:"category" }
];

const glassMap = {
    "놀고 싶다": ["Cocktail glass", "Highball glass", "Shot glass"],
    "쉬고 싶다": ["Coffee mug", "Old-fashioned glass"],
    "울고 싶다": ["Old-fashioned glass", "Collins glass"],
    "외로워": ["Old-fashioned glass", "Whiskey sour glass"],
    "두근두근해": ["Cocktail glass", "Champagne flute"]
};

const ingredientMap = {
    "이불 속": [
      "Chocolate syrup", "Carbonated water", "Dry Vermouth", "Spiced rum", "Absolut Citron"
    ],
    "혼술 중": [
      "Apricot brandy", "Dark rum", "Scotch", "Sweet Vermouth", "Coffee"
    ],
    "여행 중": [
      "Peach Vodka", "Añejo rum", "Midori melon liqueur", "Everclear", "Coffee brandy"
    ],
    "다같이 노는 중": [
      "Apple cider", "Cocoa powder", "7-Up", "Kiwi", "Jack Daniels"
    ],
    "야근 중": [
      "Lemon vodka", "Cherry brandy", "Lime", "Berries", "Chocolate liqueur"
    ],

    "스무디": [
      "Chocolate syrup", "Yoghurt", "Baileys irish cream", "Heavy cream",
      "Cocoa powder", "Irish cream", "Milk", "Chocolate liqueur", "Chocolate", "Mango"
    ],
    "에너지 드링크": [
      "Spiced rum", "Absolut Citron", "Lemonade", "Tequila", "Dark rum", "Light rum",
      "Peach Vodka", "Añejo rum", "Rum", "Lemon vodka", "Vodka"
    ],
    "아메리카노": [
      "Kahlua", "Apricot brandy", "Coffee", "Brandy", "Bourbon", "Whiskey",
      "Apple brandy", "Coffee brandy", "Coffee liqueur", "Blended whiskey", "Espresso",
      "Irish whiskey", "Blackberry brandy", "Cherry brandy"
    ],
    "생과일 주스": [
      "Lime juice", "Peach nectar", "Cranberry juice", "Strawberries", "Applejack",
      "Pineapple juice", "Apple juice", "Grapefruit juice", "Grapes", "Apple cider",
      "Berries", "Lemon juice", "Cranberries", "Tomato juice", "Grape juice"
    ],
    "탄산음료": [
      "Carbonated water", "Dry Vermouth", "Johnnie Walker", "Tea", "Water",
      "Orange bitters", "Triple sec", "Champagne", "Egg", "Lemon", "Scotch",
      "Sweet Vermouth", "Gin", "Ginger", "Sprite", "Port", "Lager", "Orange",
      "Midori melon liqueur", "Everclear", "Ale", "Amaretto", "Ricard", "Firewater",
      "Strawberry schnapps", "Grenadine", "Creme de Cacao", "Sugar", "7-Up", "Kiwi",
      "Jack Daniels", "Cognac", "Egg yolk", "Galliano", "Sherry", "Sloe gin", "Bitters",
      "Pisco", "Southern Comfort", "Peppermint schnapps", "Dubonnet Rouge", "Lime",
      "Angelica root", "Sambuca", "Ouzo", "Creme de Cassis", "Red wine", "Cantaloupe",
      "Cider", "Sugar syrup"
    ]
};

const alcoholicMap = {
    "라라랜드": "Non alcoholic",
    "존 윅": "Alcoholic",
    "미드나잇 인 파리": "Optional alcohol",
    "토이스토리": "Non alcoholic",
    "기생충": "Alcoholic"
};

const categoryMap = {
    // 기존 색상
    "노랑": ["Cocktail", "Punch / Party Drink"],
    "파랑": ["Soft Drink", "Other / Unknown"],
    "빨강": ["Shot", "Beer"],
    "초록": ["Ordinary Drink", "Homemade Liqueur"],
    "검정": ["Coffee / Tea", "Cocoa"],

    // 감정 문항
    "따뜻한 말": ["Coffee / Tea", "Cocoa"],
    "놀라운 선물": ["Other / Unknown", "Cocktail"],
    "새 모험": ["Homemade Liqueur", "Punch / Party Drink"],
    "아늑한 공간": ["Ordinary Drink", "Shake"],
    "유머": ["Shot", "Beer"]
};

function getMapping(type, choice) {
    switch(type) {
    case "glass": return glassMap[choice] || [];
    case "ingredient": return ingredientMap[choice] || [];
    case "alcoholic": return alcoholicMap[choice] || null;
    case "category": return categoryMap[choice] || [];
    }
}

let userAns = {};
let qIndex = 0;

function renderCard() {
    const container = document.getElementById("card-container");
    container.innerHTML = "";
    const q = questions[qIndex];
    const card = document.createElement("div");
    card.className = "card active";
    const title = document.createElement("h3");
    title.textContent = q.q;
    card.appendChild(title);
    q.choices.forEach(ch => {
    const item = document.createElement("div");
    item.className = "answer-option";
    item.textContent = ch;
    item.onclick = () => {
    userAns[`q${qIndex+1}`] = ch;
    if (qIndex < questions.length - 1) {
        qIndex++;
        updateProgress();
        renderCard();
    } else {
        submitAnswers();
    }
    };
    card.appendChild(item);
        });
    container.appendChild(card);
}

function updateProgress() {
    const pct = ((qIndex) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = pct + "%";
}

async function submitAnswers() {
    const counts = {glass:{}, ingredient:{}, category:{}, alcoholic:{}};
    for (let i = 0; i < questions.length; i++) {
    const key = `q${i+1}`, choice = userAns[key], type = questions[i].mapTo;
    const mapped = getMapping(type, choice);
    if (!mapped) continue;
    const arr = Array.isArray(mapped)?mapped:[mapped];
    arr.forEach(v => (counts[type][v] = (counts[type][v] || 0) + 1));
    }

    const ingKeys = Object.keys(counts.ingredient);
    if (ingKeys.length === 0) return alert("재료 매핑 오류");
    const pick = ingKeys[Math.floor(Math.random()*ingKeys.length)];
    const resp = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${pick}`);
    const drinks = (await resp.json()).drinks;
    if (!drinks) return alert("칵테일 없음");

    const scored = await Promise.all(drinks.slice(0,5).map(async d => {
    const proxyURL = `https://corsproxy.io/?url=https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${d.idDrink}`;
    await new Promise(r => setTimeout(r, 500));
    const res = await fetch(proxyURL);
    const data = await res.json();
    const detail = data.drinks[0];

    let score = 0;
    score += counts.glass[detail.strGlass] || 0;
    score += counts.alcoholic[detail.strAlcoholic] || 0;
    score += counts.category[detail.strCategory] || 0;
    for (let i=1;i<=15;i++) {
        const ing = detail[`strIngredient${i}`];
        if (counts.ingredient[ing]) score += counts.ingredient[ing];
    }
    return {detail, score};
    }));

    const maxScore = Math.max(...scored.map(s=>s.score));
    const best = scored.filter(s=>s.score === maxScore);
    const chosen = best[Math.floor(Math.random()*best.length)].detail;

    console.log("최종 선택된 응답들:", userAns);
    console.log("매핑된 속성 점수 누적:", counts);      

    document.getElementById("result-container").innerHTML = `
    <div class="result-card">
        <h2 class="result-title">당신을 위한 칵테일은:</h2>

        <div class="result-content">
        <img src="${chosen.strDrinkThumb}" alt="${chosen.strDrink}" class="cocktail-img">
        <div class="recipe-section">
            <h1 class="cocktail-name">${chosen.strDrink}</h1>
            <h3>📜 Recipe</h3>
            <p class="recipe-text">${chosen.strInstructions.replace(/\r?\n/g, '<br>')}</p>
        </div>
        </div>

        <div class="button-group right-align">
        <button class="result-button" onclick="location.reload()">다시 테스트하기</button>
        <button class="result-button" onclick="alert('저장 기능은 준비 중입니다.')">저장하기</button>
        </div>
    </div>
    `;
    document.getElementById("progress-bar").style.width = "100%";
}

renderCard();
updateProgress();