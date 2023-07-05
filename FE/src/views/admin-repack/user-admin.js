import * as Api from "/api.js";

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
    "주문취소",
  ]},
  { text: '회원관리', className: 'admin_user',
    rows: ["이름", "이메일", "주문내역", "회원삭제"]},
  { text: '카테고리관리', className: 'admin_category',
    rows: [
    "카테고리명",
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

// ------------- 테이블 생성 - 관리 탭에 따라 다르게 생성
const tableWrap = document.querySelector('.table-wrap');

function handleAdminButtonClick(e) {
  e.preventDefault();
  const ButtonClassName = e.target.className;
  const adminButtonText = e.target.textContent;
  // 기존에 생성된 div 요소가 있다면 삭제
  clearTableWrap();

  // 새로운 div 요소 생성
  const newTable = document.createElement('div');
  // 버튼과 동일한 클래스명을 넣어줌
  newTable.className = ButtonClassName;
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