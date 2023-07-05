function createTop(listArr) {
    const top = document.createElement("thead");
    top.className = "table-light";
    const tr = document.createElement("tr");
    const addHtml = [];
    for (let count = 0; count < listArr.length; count++) {
      addHtml.push(`
      <th scope="col">
        ${listArr[count]}
      </th>`);
    }
    tr.innerHTML += addHtml.join("");
    top.prepend(tr);
    return top;
  }
  
function createOrderMiddle(dataArr) {
  return `<tbody>${dataArr.map(data =>
    `<tr id="${data._id}">
          <th scope="row">
            ${data.orderDate}
          </th>
          <td>
            ${data.orderNumber}
          </td>
          <td class="product-info">
            ${data.productInfo}
          </td>
          <td>
            ${data.total}
          </td>
          <td class="user-info">
            ${data.buyer}
          </td>
          <td>
            <div class="dropdown">
              <a class="btn btn-outline-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${data.shoppingStatus}
              </a>
              <ul class="dropdown-menu btn__edit">
                <li><a class="dropdown-item">결제완료</a></li>
                <li><a class="dropdown-item">배송준비중</a></li>
                <li><a class="dropdown-item">배송중</a></li>
                <li><a class="dropdown-item">배송완료</a></li>
              </ul>
            </div>
          </td>
          <td>
            <button type="button" class="btn btn-outline-danger btn__delete">주문삭제</button>
          </td>
        </tr>`
    ).join("")}
    </tbody>`
}

function createOrderTable(listArr, datasArr) {
  //datas 는 필요한 데이터만 받아온 객체들의 배열
  const table = document.createElement("table");
  table.className = "table text-center";
  table.prepend(createTop(listArr));
  table.insertAdjacentHTML('beforeend',createOrderMiddle(datasArr));
  return table;
}

function createUserTable(listArr, datasArr) {
  //datas 는 필요한 데이터만 받아온 객체들의 배열
  const table = document.createElement("table");
  table.className = "table text-center";
  table.prepend(createTop(listArr));
  table.insertAdjacentHTML('beforeend', createUserMiddle(datasArr));
  return table;
}

function createUserMiddle(dataArr) {
  return `<tbody>${dataArr.map(data =>
    `<tr id="${data._id}">
          <th scope="row">
            ${data.name}
          </th>
          <td class="user-email">
            ${data.email}
          </td>
          <td>
          <button type="button" class="btn btn-outline-primary ms-auto p-2 bd-highlight btn__show-list" data-bs-toggle="modal"
          data-bs-target="#btn__admin__showList">조회</button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-danger btn__delete">회원삭제</button>
          </td>
        </tr>`).join("")}
    </tbody>`
}

function createCategoryMiddle(dataArr) {
  return `<tbody>${dataArr.map(data => 
      `<tr id="${data._id}">
          <td class="current__name">
            ${data.name}
          </td>
          <td>
            <button type="button" class="btn btn-outline-primary ms-auto p-2 bd-highlight btn__edit" data-bs-toggle="modal"
        data-bs-target="#btn__admin__editCategory">수정</button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-danger btn__delete">삭제</button>
          </td>
        </tr>`).join("")}
    </tbody>`
}

function createCategoryTable(listArr, datasArr) {
  //datas 는 필요한 데이터만 받아온 객체들의 배열
  const table = document.createElement("table");
  table.className = "table text-center";
  table.prepend(createTop(listArr));
  table.insertAdjacentHTML('beforeend', createCategoryMiddle(datasArr));
  console.log(table)
  return table;
}

function createProductMiddle(dataArr) {
  return `<tbody>${dataArr.map(data =>
    `<tr id="${data._id}">
          <th scope="row" class="current__name">
            ${data.name}
          </th>
          <td class="category-info">
            ${data.category[0]}
          </td> 
          <td>
            ${data.price}
          </td>
          <td>
            ${data.stock}
          </td>
          <td>
          <button type="button" class="btn btn-outline-primary ms-auto p-2 bd-highlight btn__edit" data-bs-toggle="modal"
      data-bs-target="#btn__admin__editProduct">수정</button>
          </td>
          <td>
            <button type="button" class="btn btn-outline-danger btn__delete">삭제</button>
          </td>
        </tr>`
    ).join("")}</tbody>`
}

function createProductTable(listArr, datasArr) {
  //datas 는 필요한 데이터만 받아온 객체들의 배열
  const table = document.createElement("table");
  table.className = "table text-center";
  table.prepend(createTop(listArr));
  table.insertAdjacentHTML('beforeend',createProductMiddle(datasArr));
  return table;
}

export {
  createOrderTable,
  createUserTable,
  createCategoryTable,
  createProductTable,
};
  