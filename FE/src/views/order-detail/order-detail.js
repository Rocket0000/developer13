import * as Api from "/api.js";


const orderId = window.location.href.split('/');


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
};

const token = sessionStorage.getItem('token')
const userId = parseJwt(token).userId

console.log('user::::', userId)


Api.get('/api/mypage/orders', `${orderId[5]}`)
    .then((order) => {
        const orderDetailWrap = document.getElementById("order-detail--wrap");
        orderDetailWrap.innerHTML += renderOrderContent(order);

        const productInfoLayout = document.getElementById("order-detail__product--info");

        renderOrderProduct(order, productInfoLayout);
        
        checkOrderShippingStatus(order);

        fillOrderEditModalInput(order);
    })
    .catch((error) => {
        alert(error);
    });

// order-content 렌더
function renderOrderContent(order) {

    const date = new Date(order.orderDate);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;

    const orderTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

    return `
    <div class="order-detail__content card">
        <div class="order-detail__content--date">
            <div class="order-detail__content--underline">
                <h4>주문일자: ${orderTime}</h4>
            </div>
        </div>
        <div class="order-detail__content--shipping">
            <ul class="status nav justify-content-center" id="order-detail__content--wrap">
                <li class="nav-item">
                    <span class="shipping-status">주문접수</span>
                </li>
                <li class="nav-item">
                    <span>></span>
                </li>
                <li class="nav-item">
                    <span class="shipping-status" id="pay-finished">결제완료</span>
                </li>
                <li class="nav-item">
                    <span>></span>
                </li>
                <li class="nav-item">
                    <span class="shipping-status" id="shipping-ready">배송준비중</span>
                </li>
                <li class="nav-item">
                    <span>></span>
                </li>
                <li class="nav-item">
                    <span class="shipping-status" id="shipping-ongoing">배송중</span>
                </li>
                <li class="nav-item">
                    <span>></span>
                </li>
                <li class="nav-item">
                    <span class="shipping-status" id="shipping-finished">배송완료</span>
                </li>
            </ul>
        </div>

        <div class="order-detail__content--list">
            <label for="order-detail__content--history" class="order-detail__content--history" >배송 상품</label>
            <div class="order-detail__content card" id="order-detail__product--info">
                
            </div>
        </div>

        <div class="order-detail__content--payment">
            <label for="total__price" class="order-detail__content--total">총 결제금액</label>
            <div class="order-detail__content--price">
                ${Number(order.totalPrice).toLocaleString()} 원
            </div>
        </div>
    </div>

    <div class="subtitle-area--02">
        <h2 class="subtitle">배송지 정보</h2>
    </div>

    <div class="order-detail__content card">
        <div class="order-detail__content--info">
            <label for="order-detail--recipient" class="order-detail--recipient">받는분</label>
            <div class="order-detail__content--underline">
                ${order.receiverName}
            </div>
        </div>
        <div class="order-detail__content--info">
            <label for="order-detail--recipient" class="order-detail--phonenumber">연락처</label>
            <div class="order-detail__content--underline">
                ${order.receiverPhone}
            </div>
        </div>
        <div class="order-detail__content--info">
            <label for="order-detail--recipient" class="order-detail--address">주소</label>
            <div class="order-detail__content--underline">
                (${order.zipCode})
                ${order.extraAddress}
                ${order.extraAddress_2}
            </div>
        </div>
    </div>
    <div
        id="order__options--wrap"
        class="btn-group"
        role="group"
        aria-label="Basic example"
    >
        <button
            id="order__options--edit"
            type="button"
            class="order__options--option btn btn-warning "
            data-bs-toggle="modal"
            data-bs-target="#order-edit__modal"
        >
            주문 정보 수정
        </button>
        <button
            id="order__options--cancel"
            type="button"
            class="order__options--option btn btn-danger"
            onclick="
                const orderIdNum = window.location.href.split('/'); 
                console.log('/api/mypage/orders/'+orderIdNum[5])

                if(window.confirm('주문을 취소하시겠습니까?')){
                    fetch('/api/mypage/orders/'+orderIdNum[5],{
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('token')
                        },
                        body: orderIdNum[5]
                    }).then((res) => {
                        if(res.status === 201){
                            alert('주문이 취소되었습니다')
                        }
                        location.href = '/mypage/orders'
                    }).catch((err) => {
                        console.log('err::::', err)
                    })
                }
            "
        >
            주문 취소
        </button>
    </div>
</div>
    `;
}

// order-content 중 product-info 렌더
function renderOrderProduct(order, productInfo) {
    for(let i = 0 ; i < order['productInfo'].length; i++){
        const productItem = document.createElement("div");

        productItem.classList.add(
            "product-info__product--item"
        );
        productInfo.appendChild(productItem);

        const productItemLink = document.createElement("a");

        productItemLink.classList.add(
            "product-info__product--link"
        );

        productItemLink.href = `/product-detail/${order.productInfo[i]._id}`;
        productItem.appendChild(productItemLink);

        const productItemSmallImageURL = document.createElement("img");
        productItemSmallImageURL.classList.add(
            "product-info__content"
        );
        productItemSmallImageURL.setAttribute("id", "order-detail__product--image");
        productItemSmallImageURL.src = order.productInfo[i].smallImageURL;
        productItemLink.appendChild(productItemSmallImageURL);

        const productItemName = document.createElement("div");
        productItemName.classList.add(
            "product-info__content"
        );
        productItemName.innerText = `${order.productInfo[i].name} ${order.productCount[i]} 개`;
        productItemLink.appendChild(productItemName);

        const productItemPrice = document.createElement("div");
        productItemPrice.classList.add(
            "product-info__content"
        );
        productItemPrice.innerText = `${Number(
            order.productInfo[i].price
        ).toLocaleString()} 원 x ${order.productCount[i]} = ${(
            Number(order.productInfo[i].price) * Number(order.productCount[i])
        ).toLocaleString()} 원`;
        productItemLink.appendChild(productItemPrice);        
    }
}

function checkOrderShippingStatus(order) {
    const shippingStatus = order.shoppingStatus;
    console.log('orderStatus::', shippingStatus)
    if (shippingStatus === "배송준비중") {
        document.getElementById("shipping-ready").style.color = "rgba(0, 0, 0, 0.7)";
        document.getElementById("shipping-ready").style.fontSize = "23px";
    }else if (shippingStatus === '결제완료'){
        document.getElementById("pay-finished").style.color = "rgba(0, 0, 0, 0.7)";
        document.getElementById("pay-finished").style.fontSize = "23px";
        document.getElementById("shipping-ready").style.color = "rgba(0, 0, 0, 0.3)";
        document.getElementById("shipping-ready").style.fontSize = "18px";
    }else {
        const orderEditBtn = document.getElementById(
            "order__options--edit"
        );
        const orderCancelBtn = document.getElementById(
            "order__options--cancel"
        );

        orderEditBtn.disabled = true;
        orderEditBtn.title = "배송이 시작되어 주문 정보를 수정할 수 없습니다.";
        orderCancelBtn.disabled = true;
        orderCancelBtn.title = "배송이 시작되어 주문을 취소할 수 없습니다.";

        if (shippingStatus === "배송중") {
            document.getElementById("shipping-ongoing").style.color = "rgba(0, 0, 0, 0.7)";
            document.getElementById("shipping-ongoing").style.fontSize = "23px";
            document.getElementById("shipping-ready").style.color = "rgba(0, 0, 0, 0.3)";
            document.getElementById("shipping-ready").style.fontSize = "18px";
        } else if (shippingStatus === "배송완료") {
            document.getElementById("shipping-finished").style.color = "rgba(0, 0, 0, 0.7)";
            document.getElementById("shipping-finished").style.fontSize = "23px";
            document.getElementById("shipping-ready").style.color = "rgba(0, 0, 0, 0.3)";
            document.getElementById("shipping-ready").style.fontSize = "18px";
        } else if (shippingStatus === "취소완료") {
            document.getElementById(
            "order-detail__content--wrap"
            ).innerHTML = `<h2 id="shipping-cancel" class="shipping-status">취소완료</h2>`;
        }
    }
}

// 주문 수정 기능
// 주문 수정 모달 창의 기본 값 채우기
function fillOrderEditModalInput(order) {
    document.getElementById("modal-user__name").value = order.receiverName;
    document.getElementById("modal-user__phonenumber").value = order.receiverPhone;
    document.getElementById("modal-user__postcode").value = order.zipCode;
    document.getElementById("modal-address__input--first").value = order.extraAddress;
    document.getElementById("modal-address__input--second").value = order.extraAddress_2;
}

sessionStorage.getItem('token')

// 회원탈퇴 기능
const userDeleteBtn = document.querySelector(".user__delete");

async function deleteUser() {

    const answer = confirm(
        "회원 탈퇴 하시겠습니까? \n탈퇴즉시 정보가 삭제됩니다."
    );
    
    if (answer) {
        try{
            await Api.delete('/api/mypage', userId)
        }catch(e){
            sessionStorage.removeItem('token')
            window.location.href = '/'
        }
    }
}

userDeleteBtn.addEventListener("click", deleteUser);
