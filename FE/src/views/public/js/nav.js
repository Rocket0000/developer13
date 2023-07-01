//스크롤 이벤트
const header = document.querySelector("header");
const nav = document.querySelector("nav");
let headerHeight = header.offsetHeight;

window.onscroll = function () {
  let windowTop = window.scrollY;
  if (windowTop > 195) {
    header.classList.add("drop");
    nav.classList.add("drop");
  } else {
    header.classList.toggle("drop", windowTop !== 0);
    nav.classList.toggle("drop", windowTop !== 0);
  }
};

const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    const category = event.target.textContent;
    console.log("category", category);
    if (category == "애플") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("category", "644aa57feecee8cec114fd09"); // encodeURIComponent로 카테고리 인코딩
      const productListUrl = `../product-list/product-list.html${currentUrl.search}`;
      window.location.href = productListUrl;
    } else if (category == "삼성") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("category", "644aa58aeecee8cec114fd0b"); // encodeURIComponent로 카테고리 인코딩
      const productListUrl = `../product-list/product-list.html${currentUrl.search}`;
      window.location.href = productListUrl;
    } else if (category == "샤오미") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("category", "644aa58feecee8cec114fd0d"); // encodeURIComponent로 카테고리 인코딩
      const productListUrl = `../product-list/product-list.html${currentUrl.search}`;
      window.location.href = productListUrl;
    } else if (category == "정품 스트랩") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("category", "644aa59beecee8cec114fd0f"); // encodeURIComponent로 카테고리 인코딩
      const productListUrl = `../product-list/product-list.html${currentUrl.search}`;
      window.location.href = productListUrl;
    } else if (category == "호환 스트랩") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("category", "644aa5a1eecee8cec114fd11"); // encodeURIComponent로 카테고리 인코딩
      const productListUrl = `../product-list/product-list.html${currentUrl.search}`;
      window.location.href = productListUrl;
    }
  });
});
/*
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach(function(item) {
  item.addEventListener("click", function(event) {
    event.preventDefault();
    const category = event.target.textContent;
    if (category) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('category', category);
      window.location.href = currentUrl.toString();
    }
  });
});
*/
// 제품 목록에서 클릭한 제품의 id값을 URL에 추가하는 함수
function goToProductDetail(id) {
  window.location.href = "../product-detail/product-detail.html?id=" + id;
}

// 제품 목록에서 제품 클릭 시 이벤트 리스너 등록
const items = document.querySelectorAll(".item");
items.forEach((item) => {
  const productId = item.dataset.id;
  item.addEventListener("click", function (event) {
    event.preventDefault();
    goToProductDetail(productId);
  });
});

//로그인 유무 체크
const utilLink = document.querySelector(".util-link");

const loginBtn = document.querySelector("#login");
const logoutBtn = document.querySelector("#logout");
const mypageBtn = document.querySelector("#mypage");
const registerBtn = document.querySelector("#register");
const cartBtn = document.querySelector("#cart");

const token = sessionStorage.getItem("token");
if (token) {
  // 로그인 상태
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
  registerBtn.style.display = "none";
  mypageBtn.style.display = "inline-block";
  cartBtn.style.display = "inline-block";
} else {
  // 로그아웃 상태
  loginBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
  registerBtn.style.display = "inline-block";
  mypageBtn.style.display = "none";
  cartBtn.style.display = "inline-block";
}

// 로그아웃 이벤트 등록
logoutBtn.addEventListener("click", logout);

function logout(e) {
  e.preventDefault();

  if (window.confirm("로그아웃 하시겠습니까?")) {
    sessionStorage.removeItem("token");
    console.log("token");
    alert("로그아웃 되었습니다.");

    location.href = "/";
  }
}

// 이벤트 등록
loginBtn.addEventListener("click", () => {
  location.href = "../login.html";
});
signupBtn.addEventListener("click", () => {
  location.href = "../register.html";
});
mypageBtn.addEventListener("click", () => {
  location.href = "../user-mypage/user-mypage.html";
});
cartBtn.addEventListener("click", () => {
  location.href = "../cart/cart.html";
});
