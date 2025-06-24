/*프로그램명 : 카카오 로그인 및 사용자 정보 전달(테스트)
설명 : 카카오 API 활용 로그인 테스트 기능+임시 로그인 데이터 넘김(index.html user 영역 표시)
작성일시 : 2025.06.0
작성자 : 채다현 */

const KAKAO_REST_API_KEY = "e37ce401983310e0504374af8b67725c";
const REDIRECT_URI = "http://127.0.0.1:5500/login.html";
const isPopup = window.opener !== null;

window.addEventListener("DOMContentLoaded", () => {
  if (!isPopup) {
    const loginBtn = document.querySelector('.group .button');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        localStorage.setItem("nickname", "평소지");
      });
    }
    const kakaoBtn = document.getElementById("kakao-login-btn");
    if (kakaoBtn) {
      kakaoBtn.addEventListener("click", () => {
        localStorage.setItem("nickname", "평소지");

        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

        window.open(
          kakaoAuthUrl,
          "kakaoLogin",
          "width=500,height=600,top=100,left=200,resizable=no,scrollbars=yes"
        );
      });
    }
    window.addEventListener("message", (event) => {
      if (event.data.type === "kakao-auth") {
        window.location.href = "index.html";
      }
    });

  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      window.opener.postMessage({ type: "kakao-auth", code }, "*");
      window.close();
    }
  }
});

/*프로그램명 : 비밀번호 제한 및 확인
설명 : 비밀번호 길이, 특수문자 포함 제한+보임숨김 기능
작성일시 : 2025.06.05
작성자 : 채다현 */

const pw = document.getElementById("password2");
const pwConfirm = document.getElementById("password-confirm");
const pwMsg = document.getElementById("password2-warning");
const pwConfirmMsg = document.getElementById("password-confirm-warning");

const specialCharPattern = /[!@#$%^&*()_+\[\]{}|;:'",.<>\/?\\`~]/; //특수문자 종류

function validatePassword() { //비밀번호 경고 문구
  const value = pw.value;
  if (value.length < 8) {
    pwMsg.textContent = "비밀번호는 8자 이상이어야 합니다.";
    return false;
  } else if (!specialCharPattern.test(value)) {
    pwMsg.textContent = "특수문자를 최소 1자 이상 포함해야 합니다.";
    return false;
  } else {
    pwMsg.textContent = "";
    return true;
  }
}

function validateConfirm() {
  if (pwConfirm.value !== pw.value) {
    pwConfirmMsg.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  } else {
    pwConfirmMsg.textContent = "";
    return true;
  }
}

document.addEventListener("DOMContentLoaded", function () { //비밀번호 보임 안 보임 아이콘 전환
  const toggleIcons = document.querySelectorAll(".toggle-password");

  toggleIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "visibility";
      } else {
        input.type = "password";
        this.textContent = "visibility_off";
      }
    });
  });
});
