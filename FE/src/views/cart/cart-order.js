import * as Api from "/api.js";

// 장바구니 데이터 불러오기
// 총 상품 개수와 총 상품 가격 업데이트 함수
function updateCartTotal() {
  let buyList = JSON.parse(localStorage.getItem("cart"));
  console.log("받아온 주문목록 입니다", buyList);

  let total_amount = JSON.parse(localStorage.getItem("totalAmount"));
  console.log("받아온 총 수량 입니다", total_amount);

  let total_price = JSON.parse(localStorage.getItem("totalPrice"));
  console.log("받아온 총 금액 입니다", total_price);

  let totalAmountElement = document.getElementById("cart-total-amount");
  let totalPriceElement = document.getElementById("cart-total-price");
  let totalAmount = 0;
  let totalPrice = 0;

  buyList.forEach(function (item) {
    totalAmount += item.totalAmount;
    totalPrice += item.totalPrice;
  });

  totalAmountElement.innerHTML = `${total_amount}개`;
  totalPriceElement.innerHTML = `${total_price}원`;
}
updateCartTotal();

// 배송지 정보 입력
const deliveryName = document.querySelector("#cartOrder__name");
const deliveryPostcode = document.querySelector("#cartOrder__postcode");
const deliveryAddress = document.querySelector("#cartOrder__address1");
const deliveryAddress2 = document.querySelector("#cartOrder__address2");
const deliveryTel = document.querySelector("#cartOrder__contact");

const payButton = document.querySelector("#cart-order--submit");

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const token = sessionStorage.getItem("token");
const userId = parseJwt(token).userId;


// // 로그인 유저 id 불러오기
Api.get("/api/mypage", userId)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  });
  
  let userData;
async function inputOrdererInfo() {
  userData = await Api.get("/api/mypage", userId);
  deliveryName.value = userData.name || null;
  deliveryPostcode.value = userData.zip || null;
  deliveryAddress.value = userData.address_1 || null;
  deliveryAddress2.value = userData.address_2 || null;
  deliveryTel.value = userData.phone || null;
}
inputOrdererInfo();

// ******* 결제 정보 및 유저 DB post 보내기 ********
async function order() {
  if (
    !deliveryName.value ||
    !deliveryPostcode.value || //상품 상세페이지에서 끌어오는 거
    !deliveryAddress.value ||
    !deliveryAddress2.value ||
    !deliveryTel.value
    ) {
      return alert("배송지 정보를 입력해주세요.");
    }
    
    let buyList = JSON.parse(localStorage.getItem("cart"));
    console.log("받아온 주문목록 입니다", buyList);
    
    let total_amount = JSON.parse(localStorage.getItem("totalAmount"));
    console.log("받아온 총 수량 입니다", total_amount);
    
    let total_price = localStorage.getItem("totalPrice");
    console.log("받아온 총 금액 입니다", total_price);
    
    

  const receiverName = deliveryName.value;
  const zipCode = deliveryPostcode.value;
  const extraAddress = deliveryAddress.value;
  const extraAddress_2 = deliveryAddress2.value;
  const receiverPhone = deliveryTel.value;
  const listArr = JSON.parse(localStorage.getItem("cart")).map((i) => i.id);
  const productCount = JSON.parse(localStorage.getItem('cart')).map(item => item.count);
  
  let finalOrderList = {
    receiverName: receiverName,
    zipCode: zipCode,
    extraAddress: extraAddress,
    extraAddress_2: extraAddress_2,
    receiverPhone: receiverPhone,
    productInfo: listArr,
    productCount: productCount,
    totalAmount: total_amount,
    totalPrice: total_price,
    buyer: userId,
  };

  Api.post("/api/cart/order", finalOrderList) // 주문하기
    .then((res) => {
      alert("주문이 정상적으로 완료되었습니다.");
      // buylist 지우기
      if (buyList == localStorage.getItem("buy-direct")) {
        localStorage.removeItem("buy-direct");
      } else {
        localStorage.removeItem("buy-cart");
        localStorage.removeItem("cart");
      }
      window.location.href = "./cart-order-finished.html";
    })
    .catch((err) => {
      alert(
        `문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`
      );
    });
}

payButton.addEventListener("click", order);

