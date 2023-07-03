import * as Api from "/api.js";

const orderNone = document.querySelector(".mypage__order--none");
const orderListZone = document.querySelector(".order__list");
const userDeleteBtn = document.querySelector(".user__delete");
const orderCheckBtn = document.querySelector(".order__check");


//token역파시 하는 것
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

// 1000 -> 1,000
const addCommas = n => {
    return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


Api.get('/api/admin', "orders")
  .then((data) => {

      const myOrder = data.filter(i  => i['buyer']?._id === userId)
      let orders = myOrder.map((item, i) => item)

      const productCount = orders.map((item, inx) => item.productCount)
      const orderDate = orders.map(items => items['orderDate'])
      const shoppingStatus = orders.map(items => items['shoppingStatus'])
    
      if(myOrder.length === 0 ){
        return (
            orderListZone.innerHTML += `
            <section class="mypage__order--none">
                <h3>주문한 내역이 없습니다.</h3>
            </section>
            `
        )
      }
      
      for(let i = 0 ; i < orders.length; i++){
        //날짜 포맷
        const date = new Date(orderDate[i]);

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

        console.log('order', myOrder[i]._id)

        orderListZone.innerHTML +=
        `   
            <div class="order__contents card" style="margin-bottom: 55px">
                <div class="card-header">${orderTime} 주문</div>
                <div class="orderzone__${i}">
                    <div class="order__${i}" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                     ">
                        <div aria-label="card_item${i}">
                        </div>
                    <div>
                    <div class="detail__zone">
                        <div class="shipping__status__${i}">${shoppingStatus[i]}</div>
                            <a type="button" class="btn btn-outline-secondary" href="/mypage/order/${myOrder[i]._id}">
                                주문상세
                            </a>
                        </div>
                    </div>
                </div>                
            </div>
        `
        const cardItem = document.querySelector(`[aria-label="card_item${i}"]`);

        for(let j = 0; j < orders[i].productInfo.length; j ++){
            cardItem.innerHTML += `
                <a href="" display:"block">
                    <div class="card-body order__body__${j}">
                        <div class="product__picture">
                            <img src="${orders[i].productInfo[j]?.smallImageURL}" class="product__image"/>
                        </div>
                        <div class="product__information">
                            <h5 class="card-title">${orders[i].productInfo[j]?.name}</h5>
                            <span class="card-text">₩ ${addCommas(orders[i].productInfo[j]?.price)}</span>
                            <span class="card-text">/</span>
                            <span class="card-text">${productCount[i][j]} 개</span>
                        </div>
                    </div>     
                </a>    
            `
        }
        if (shoppingStatus[i] === "취소완료") {
            const shippingStatusMessage = document.querySelector(`.shipping__status__${i}`);
            shippingStatusMessage.style.color = "red";
        }
      }
  })
  .catch((err) => {
    alert(`에러가 발생했습니다. 관리자에게 문의하세요. \n ${err}`);
    window.location.href = "/";
  });


function orderListMake() {

// 전체 리스트에서 로그인 한 회원의 주문 내역만 불러오기


}

orderCheckBtn.addEventListener("click", orderListMake);


// 회원탈퇴 기능
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
