/*프로그램명 : 텍스트+이미지 저장
설명 : 마이레시피 저장 기능
작성일시 : 2025.06.18
작성자 : 김재경 */

document.querySelectorAll(".memo").forEach(memo => {
    memo.addEventListener("click", function () {
        let detail = this.querySelector(".memo-detail");
        if (detail.style.maxHeight) {
            detail.style.maxHeight = null;
        } else {
            detail.style.maxHeight = detail.scrollHeight + "px";
        }
    });
});

const wrapper = document.getElementById("imageUploadWrapper");

function createUploadBox() {
    const uploadBox = document.createElement('div');
    uploadBox.classList.add('image-upload-area');

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    const icon = document.createElement('img');
    icon.src = 'https://cdn-icons-png.flaticon.com/512/685/685655.png';
    icon.className = 'upload-icon';

    uploadBox.appendChild(icon);
    uploadBox.appendChild(input);

    uploadBox.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            icon.remove();

            const img = document.createElement('img');
            img.src = e.target.result;
            uploadBox.appendChild(img);

            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-button';
            deleteBtn.innerText = 'x';
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                wrapper.removeChild(uploadBox);

                if (!Array.from(wrapper.children).some(child => child.querySelector('input').files.length === 0)) {
                    createUploadBox();
                }
            });
            uploadBox.appendChild(deleteBtn);

            if (!Array.from(wrapper.children).some(child => child.querySelector('input').files.length === 0)) {
                createUploadBox();
            }
        };
        reader.readAsDataURL(file);
    });

    wrapper.appendChild(uploadBox);
}

createUploadBox();

/*프로그램명 : 텍스트+이미지 저장
설명 : 마이레시피 저장 기능 수정(일자 반영, 세션스토리지)
작성일시 : 2025.06.18
작성자 : 채다현 */

document.querySelector(".save-button").addEventListener("click", () => {
    const title = document.querySelector(".title-input").value.trim();
    const content = document.querySelector(".content-input").value.trim();
    const date = new Date().toISOString().split("T")[0]; //현재 일자 추가해놓음

    const imageBox = wrapper.querySelector(".image-upload-area img");
    if (!title || !content || !imageBox) {
        alert("제목, 이미지, 내용을 모두 입력해주세요.");
        return;
    }

    const imageDataURL = imageBox.src;

    const memo = { title, content, date, image: imageDataURL };
    const memos = JSON.parse(sessionStorage.getItem("memos") || "[]");
    memos.push(memo);
    sessionStorage.setItem("memos", JSON.stringify(memos)); //창 닫으면 사라지게 세션스토리지로 해놓음

    renderMemos();
    clearInputs();
});

function clearInputs() {
    document.querySelector(".title-input").value = "";
    document.querySelector(".content-input").value = "";
    wrapper.innerHTML = "";
    createUploadBox();
}

function renderMemos() {
    const memoList = document.querySelector(".memo-list");
    if (!memoList) return;
    memoList.innerHTML = '<h6>메모 기록</h6>';

    const memos = JSON.parse(sessionStorage.getItem("memos") || "[]");

    memos.forEach(({ date, title, image, content }) => {
        const memoHTML = `
            <div class="memo">
                <p class="date">${date}</p>
                <p>${title}</p>
                <div class="memo-detail">
                    <img src="${image}" alt="업로드 이미지">
                    <p>${content}</p>
                </div>
            </div>
        `;
        memoList.innerHTML += memoHTML;
    });

    // 다시 이벤트 바인딩
    document.querySelectorAll(".memo").forEach(memo => {
        memo.addEventListener("click", function () {
            let detail = this.querySelector(".memo-detail");
            if (detail.style.maxHeight) {
                detail.style.maxHeight = null;
            } else {
                detail.style.maxHeight = detail.scrollHeight + "px";
            }
        });
    });
}

renderMemos();