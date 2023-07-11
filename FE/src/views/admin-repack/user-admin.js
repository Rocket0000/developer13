import * as Api from "/api.js";
// --------- API 불러오기
const ADMIN_URL = "/api/admin";
const CATEGORY_URL = "/api/categories";
const PRODUCT_URL = "/api/products";

// ------------- 관리 탭 생성
const adminList = document.querySelector('.admin-list');
const ADMIN_ITEMS = [
  { text: '주문관리', className: 'admin_order' ,
    rows: [
    "주문일자",
    "주문번호",
    "상품명",
    "총(원)",
    "주문자",
    "주문상태",
    "주문상세",
    "주문취소",
  ]},
  { text: '회원관리', className: 'admin_user',
    rows: ["이름", "이메일", "주문내역", "회원삭제"]},
  { text: '카테고리관리', className: 'admin_category',
    rows: [
    "카테고리(대)",
    "카테고리(소)",
    "수정",
    "삭제",
  ]},
  { text: '상품관리', className: 'admin_product',
    rows: [
    "상품명",
    "카테고리",
    "가격(원)",
    "재고수량(개)",
    "수정",
    "삭제",
  ]},
];

const adminButtons = ADMIN_ITEMS.map((item) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.className = item.className;
  button.textContent = item.text;

  const link = document.createElement('a');
  link.setAttribute('href', '');
  link.appendChild(button);

  const listItem = document.createElement('li');
  listItem.appendChild(link);

  return listItem;
});

const ul = document.createElement('ul');
adminButtons.forEach((button) => {
  // 4개의 버튼 추가
  ul.appendChild(button);
  //클릭 시 이벤트
  button.addEventListener('click', handleAdminButtonClick);
});

adminList.appendChild(ul);

//--------추가 버튼
// "상품 추가" 버튼 생성
const addProductButton = document.createElement('button');
addProductButton.className = "add-button";
addProductButton.textContent = "상품 추가";

// "카테고리 추가" 버튼 생성
const addCategoryButton = document.createElement('button');
addCategoryButton.className = "add-button";
addCategoryButton.textContent = "카테고리 추가";

adminList.appendChild(addProductButton);
adminList.appendChild(addCategoryButton);

// ------------- 테이블 생성 - 관리 탭에 따라 다르게 생성
const tableWrap = document.querySelector('.table-wrap');

function handleAdminButtonClick(e) {
  e.preventDefault();
  const className = e.target.className;
  const adminButtonText = e.target.textContent;
  // 기존에 생성된 div 요소가 있다면 삭제
  clearTableWrap();

  // 새로운 div 요소 생성
  const newTable = document.createElement('div');
  // 버튼과 동일한 클래스명을 넣어줌
  newTable.className = className;
  // table-wrap에 새로운 div 요소 추가
  tableWrap.appendChild(newTable);

  //테이블에 row추가
  const rows = getTableRows(newTable.className);
  if (rows) {
    // 테이블 헤더가 될 ul 생성
    const ul = document.createElement('ul');
    ul.className = 'table-head';

    rows.forEach((rowText) => {
      const li = document.createElement('li');
      li.textContent = rowText;
      ul.appendChild(li);
    });

    // 테이블 헤더를 삽입함
    newTable.appendChild(ul);

    //테이블 필드 추가
    getTableField(className)
      .then((tableField) => newTable.appendChild(tableField))
      .catch((err) => console.log(err));
  }
}

//기존 테이블을 지우는 함수
function clearTableWrap() {
  //요소가 존재한다면 child요소를 지움
  if (tableWrap.firstChild) {
    tableWrap.firstChild.remove();
  }
}

// 각 탭에 따른 테이블 rows 가져오기
function getTableRows(className) {
  return ADMIN_ITEMS.find((item) => item.className === className).rows;
}

function getTableField(className) {
  // 주문 탭 테이블
  if (className === "admin_order") {
     //추가 버튼 display: none;
     addCategoryButton.style.display = "none";
     addProductButton.style.display = "none";

    return Api.get(ADMIN_URL, "orders")
      .then((res) => {
        const orderData = res.map((data) => ({
          orderId: data._id,
          orderDate: data.createdAt.slice(0, 10),
          orderNumber: data.orderNumber,
          productName: data.productInfo && data.productInfo.map((products)=>products.name),
          buyer: data.buyer && data.buyer._id ? data.buyer.name : "",
          total: data.totalAmount,
          shoppingStatus: data.shoppingStatus,
        }));

        const ul = document.createElement('ul');

        orderData.forEach((order) => {
        const li = document.createElement('li');

        const orderInfo = ['orderDate', 'orderNumber', 'productName', 'total', 'buyer', 'shoppingStatus'].map((key) => {
          const span = document.createElement('span');
          span.textContent = order[key];
          return span;
        });

        const buttons = ['주문상세', '주문삭제'].map((text, index) => {
          const button = document.createElement('button');
          button.textContent = text;
      
          // 주문삭제 버튼 클릭 이벤트 핸들러
          if (index === 1) { // 주문삭제 버튼
            button.addEventListener('click', () => {
              const orderId = order.orderId;
              // API 호출 - 주문 삭제
              api.delete(ADMIN_URL, `orders/${orderId}`)
                .then(() => {
                  // 삭제에 성공한 경우 해당 주문을 화면에서 제거하거나 업데이트하는 등의 동작을 수행할 수 있습니다.
                  // 예를 들면, ul.removeChild(li); 와 같은 방법으로 삭제된 주문을 리스트에서 제거할 수 있습니다.
                })
                .catch((err) => {
                  console.log(err);
                  // 주문 삭제에 실패한 경우 오류 처리를 수행합니다.
                });
            });
          }
      
          return button;
        });

        li.append(...orderInfo, ...buttons);
        ul.appendChild(li);
        ul.className = "table-body";
      });
      return ul;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
  // 유저 탭 테이블
  if (className === "admin_user") {
    //추가 버튼 display: none;
    addCategoryButton.style.display = "none";
    addProductButton.style.display = "none";

    return Api.get(ADMIN_URL, "users")
      .then((res) => {
        const userData = res.map((data) => ({
          userId: data._id,
          userName: data.name,
          userEmail: data.email,
        }));

        const ul = document.createElement('ul');

        userData.forEach((user) => {
          const li = document.createElement('li');

          const userInfo = ['userName', 'userEmail'].map((key) => {
            const span = document.createElement('span');
            span.textContent = user[key];
            return span;
          });

          const buttons = ['주문내역', '회원삭제'].map((text) => {
            const button = document.createElement('button');
            button.textContent = text;
            return button;
          });

          
          li.append(...userInfo, ...buttons);
          ul.appendChild(li);
          ul.className = "table-body";
        });
        return ul;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
  // 카테고리 탭 테이블
  if (className === "admin_category") {
    //추가 버튼 display
    addCategoryButton.style.display = "block";
    addProductButton.style.display = "none";
    addCategoryButton.addEventListener('click', () => openModal("category"));

    return Api.get(CATEGORY_URL, "categories")
      .then((res) => {
        console.log("category 출력", res)
        const categoryData = [];
        res.categories.forEach((category) => {
          const isMainCategory = category.parentCategory ? true : false;
          if (!isMainCategory) {
            // Main Category인 경우
            categoryData.push({
              categoryId: category._id,
              categoryName: category.name,
              subCategory: [],
            });
          } else {
            // Sub Category인 경우
            const mainCategoryId = category.parentCategory;
            const mainCategory = categoryData.find((main) => main.categoryId === mainCategoryId);
            if (mainCategory) {
              mainCategory.subCategory.push({
                categoryId: category._id,
                categoryName: category.name,
              });
            }
          }
        })

        const ul = document.createElement('ul');

        categoryData.forEach((category) => {
          const li = document.createElement('li');

          const categoryInfo = ['categoryName', 'subCategory'].map((key) => {
            const span = document.createElement('span');
            if (key === 'subCategory') {
              span.textContent = category['subCategory'].map((subCat) => subCat.categoryName);
            } else {
              span.textContent = category[key];
            }
            return span;
          });
          
          const buttons = ['수정', '삭제'].map((text) => {
            const button = document.createElement('button');
            button.textContent = text;
            return button;
          });

          li.append(...categoryInfo, ...buttons);
          ul.appendChild(li);
          ul.className = "table-body";
        });
        return ul;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
  // 상품 탭 테이블
  if (className === "admin_product") {
    //추가 버튼 display
    addCategoryButton.style.display = "none";
    addProductButton.style.display = "block";
    addProductButton.addEventListener('click', function() {
      openModal("product");
    });

    // 상품 & 카테고리 모두 요청 필요
    return Promise.all([
      Api.get(CATEGORY_URL, "categories"),
      Api.get(PRODUCT_URL, "products")
    ])
      .then(([categoryRes, productRes]) => {
        // 카테고리 정보를 객체 형태로 변환
        const categoryMap = {};
        categoryRes.categories.forEach((category) => {
          categoryMap[category._id] = category.name;
        });

        // 제품 데이터 구성
        const productData = productRes.products.map((data) => {
          const categories = data.category.map((categoryId) => categoryMap[categoryId] || '');
          return {
            productId: data._id,
            productName: data.name,
            productPrice: data.price,
            category: categories.join(' > '), // 카테고리명 결합
            stock: data.stock,
          };
        });
        
        const ul = document.createElement('ul');

        productData.forEach((product) => {
          const li = document.createElement('li');

          const productInfo = ['productName', 'category', 'productPrice', 'stock'].map((key) => {
            const span = document.createElement('span');
            span.textContent = product[key];
            return span;
          });

          const buttons = ['수정', '삭제'].map((text) => {
            const button = document.createElement('button');
            button.textContent = text;
            return button;
          });

          li.append(...productInfo, ...buttons);
          ul.appendChild(li);
          ul.className = "table-body";
        });
        return ul;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

// --------- 모달 관련 함수

// 모달 열기 함수
function openModal(division) {
  const modal = document.getElementById('myModal');
  const modalContent = document.getElementById('modal-content');
  modal.style.display = "block";
  // 모달 내용 초기화
  modalContent.innerHTML = '';
  // 모달 헤더
  const modalHeader = document.createElement('p');
  modalHeader.id = 'modal-header';
  
  if (division === "category") {
    // 기존 모달 창 내용 복제
    const clonedModalContent = modalContent.cloneNode(true);
    
    // 카테고리 추가를 위한 요소 생성
    const categoryInputLabel = document.createElement('label');
    categoryInputLabel.textContent = "카테고리(대)";

    const categoryInput = document.createElement('input');
    categoryInput.type = "text";
    categoryInput.placeholder = "카테고리(대)";

    const subCategoryInputLabel = document.createElement('label');
    subCategoryInputLabel.textContent = "카테고리(소)";

    const subCategoryInput = document.createElement('input');
    subCategoryInput.type = "text";
    subCategoryInput.placeholder = "카테고리(소)";
    
    // saveButton 생성
    const saveButton = document.createElement('button');
    saveButton.textContent = "저장";
    // 저장 버튼 클릭 시 카테고리 추가 로직을 구현할 수 있습니다.
    saveButton.addEventListener('click', function() {
      const category = categoryInput.value;
      const subCategories = subCategoryInput.value.split(',');
      
      // 카테고리(대)와 카테고리(소) 값 활용 예시
      console.log('카테고리(대):', category);
      console.log('카테고리(소):', subCategories);
      // 카테고리 생성 로직 구현
      createCategory(category, subCategories);

      //모달 닫기
      modal.style.display = "none";
    });
    
     // "닫기" 버튼 생성
     const closeButton = document.createElement('button');
     closeButton.className = 'close';
     closeButton.innerHTML = '&times;';
     closeButton.addEventListener('click', function() {
       modal.style.display = 'none';
     });

    // 모달 내용에 카테고리 추가를 위한 요소들을 추가합니다.

    clonedModalContent.appendChild(closeButton);
    clonedModalContent.appendChild(categoryInputLabel);
    clonedModalContent.appendChild(categoryInput);
    clonedModalContent.appendChild(subCategoryInputLabel);
    clonedModalContent.appendChild(subCategoryInput);
    clonedModalContent.appendChild(saveButton);
    
    // 모달 내용 업데이트
    modalContent.appendChild(clonedModalContent);
  }
  
}


// 모달 닫기 함수
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = "none";
}

// "닫기" 버튼 클릭 시 모달 닫기
const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', closeModal);

// 모달 창 외부 클릭 시 모달 닫기
window.addEventListener('click', function(event) {
  const modal = document.getElementById('myModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// post API
// 카테고리 생성 함수
function createCategory(category, subCategories) {
  // 카테고리 데이터 생성
  const categoryData = {
    category: category,
    subCategories: subCategories
  };

   // 카테고리 생성 API 요청
   Api.post("/api/admin/category", categoryData)
    .then(response => response.json())
    .then(data => {
      console.log('카테고리 생성 성공:', data.category);
      // 추가로 필요한 처리 작업 수행
    })
    .catch(error => {
      console.error('카테고리 생성 실패:', error);
      // 에러 처리 작업 수행
    });
}

//세션 키 저장
sessionStorage.setItem("key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ4MTA2YmE1NDhhYjEzZWRmNTM2ZmYiLCJlbWFpbCI6ImFkbWluIiwiaWF0IjoxNjgyNDQ0NDExfQ.yl5S7x9f7R644xvT8NQpCwGt7opU0B7RbHmVRbg7P34")
