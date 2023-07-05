import * as Api from "/api.js";

import {
  createOrderTable,
  createUserTable,
  createCategoryTable,
  createProductTable,
} from "./user-admin-module.js";

const mainTag = document.getElementById("main__container");

//URL
const ADMIN_URL = "/api/admin";
const CATEGORY_URL = "/api/categories";
const PRODUCT_URL = "/api/products";


//세션 키 저장
sessionStorage.setItem("key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ4MTA2YmE1NDhhYjEzZWRmNTM2ZmYiLCJlbWFpbCI6ImFkbWluIiwiaWF0IjoxNjgyNDQ0NDExfQ.yl5S7x9f7R644xvT8NQpCwGt7opU0B7RbHmVRbg7P34")


let categoryId;
let beforeValue;
let productId;

const adminBtnOrder = document.querySelector(".btn-admin__order");
const adminBtnUser = document.querySelector(".btn-admin__user");
const adminBtnCategory = document.querySelector(".btn-admin__category");
const adminBtnProduct = document.querySelector(".btn-admin__product");
const allBtns = [
  adminBtnOrder,
  adminBtnUser,
  adminBtnCategory,
  adminBtnProduct,
];

const orderAdmin = [
  "주문일자",
  "주문번호",
  "상품명",
  "총(원)",
  "주문자",
  "주문상태",
  "주문취소",
];
const userAdmin = ["이름", "이메일", "주문내역", "회원삭제"];
const categoryAdmin = [
  "카테고리명",
  "수정",
  "삭제",
];
const productAdmin = [
  "상품명",
  "카테고리",
  "가격(원)",
  "재고수량(개)",
  "수정",
  "삭제",
];

const btnAddCategory = document.querySelector(".btn-add__category");
const btnAddProduct = document.querySelector(".btn-add__product");

btnAddCategory.style =
        "display:none";
      btnAddProduct.style =
        "display:none";

function compareEnglish(lsName) {
  if (lsName === "주문관리") return "order__management";
  else if (lsName === "회원관리") return "user__management";
  else if (lsName === "카테고리관리") return "category__management";
  return "product__management";
}

for (let i = 0; i < allBtns.length; i++) {
  const listBtn = allBtns[i];
  listBtn.addEventListener("click", (element) => {
    element.preventDefault();
    //지금 table이 있는지 확인하고 있다면 다 지우기
    const currentTable = document.querySelector(".bd-example");
    if (currentTable) currentTable.remove();

    const listName = allBtns[i].innerText;
    const listNameEn = compareEnglish(listName);
    const newHtml = document.createElement("div");
    newHtml.className = `bd-example ${listNameEn}`;

    //주문관리 기능 구현
    if (listName === "주문관리") {
      btnAddCategory.style =
        "display:none";
      btnAddProduct.style =
        "display:none";

      Api.get(ADMIN_URL, "orders")
        .then((datas) => {
          const newDatas = datas.map((data) => {
            const buyerId = data.buyer && data.buyer._id ? data.buyer._id : ""; // buyer 객체와 _id 프로퍼티가 존재하는지 확인하고 null일 경우 빈 문자열로 처리
            const productNames = data.productInfo && data.productInfo.map((products)=>products.name); //상품이름 리스트
            return {
              _id: data._id,
              orderNumber: data.orderNumber,
              buyer: buyerId,
              orderDate: data.createdAt.slice(0, 10),
              productInfo: productNames,
              productCount: data.productCount,
              total: data.totalAmount,
              shoppingStatus: data.shoppingStatus,
            };
          });
          return newDatas.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
        })
        .then((newDatas) => {
          newHtml.appendChild(createOrderTable(orderAdmin, newDatas));
          mainTag.append(newHtml);
          
          const productIdList = document.querySelectorAll(".product-info");
          for (let count = 0; count < productIdList.length; count++) {
            orderSetProductsNameById(productIdList[count].innerText, count)
          }
          const userId = document.querySelectorAll(".user-info")
          for (let count = 0; count < userId.length; count++) {
            orderSetBuyerNameById(userId[count].innerText, count)
          }
        })
        .then(() => {
          orderManagementEdit();
          orderManagementDelete();
        })
        .catch((err) => console.log(err));
    }

    //회원관리 기능구현
    else if (listName === "회원관리") {
      document.querySelector(".btn-add__category").style =
        "display:none";
      document.querySelector(".btn-add__product").style =
        "display:none";
    
      Api.get(ADMIN_URL,"users")
        .then((datas) => {
          const newDatas = datas.map((data) => {
            return {
              _id: data._id,
              name: data.name,
              email: data.email,
            };
          });
          return newDatas.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
        })
        .then((newData) => {
          newHtml.appendChild(createUserTable(userAdmin, newData));
          mainTag.append(newHtml);
        })
        .then(() => {
          userManagementDelete();
        })
        .catch((err) => alert(err));

    } else if (listName === "카테고리관리") {
      //상품추가와 카테고리추가 없애기
      document.querySelector(".btn-add__category").style =
        "display:inline";
      document.querySelector(".btn-add__product").style =
        "display:none";

      Api.get(CATEGORY_URL, "categories")
        .then((datas) => {
          const newDatas = datas.categories.map((data) => {
            return {
              _id: data._id,
              name: data.name,
            };
          });
          return newDatas.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
        })
        .then((newDatas) => {
          newHtml.appendChild(createCategoryTable(categoryAdmin, newDatas));
          mainTag.append(newHtml);
        })
        .then(() => {
          categoryManagementEdit(); //수정모달창
          categoryManagementCreate();
          categoryManagementDelete();
        })
        .catch((err) => alert(err));

    } else if (listName === "상품관리") {
      //상품추가와 카테고리추가 없애기
      document.querySelector(".btn-add__category").style =
        "display:none";
      document.querySelector(".btn-add__product").style =
        "display:inline";

      // Api.get(PRODUCT_URL, "products")
      //   .then((datas) => {
      //     console.log("prod:", datas)
      //     const newDatas = datas.products.map((data) => {
      //       const categoryName = getCategoryNameByID(data.category[0]);
      //       console.log("카테고리명",categoryName)
      //       return {
      //         _id: data._id,
      //         category: categoryName,
      //         name: data.name,
      //         price: Number(data.price).toLocaleString(),
      //         stock: Number(data.stock).toLocaleString(),
      //       };
      //     });

      //     return newDatas.sort((a, b) => {
      //       return new Date(b.date) - new Date(a.date);
      //     });
      //   })
      //   .then((newDatas) => {
      //     newHtml.appendChild(createProductTable(productAdmin, newDatas));
      //     mainTag.append(newHtml);
      //     const categoryId = document.querySelectorAll(".category-info")
      //     for (let count = 0; count < categoryId.length; count++) {
      //       console.log(categoryId[count].innerHTML)
      //       // productSetCategoryNameById(categoryId[count], count)
      //     }
      //   })
      //   .then(() => {
      //     productManagementEdit();
      //     productManagementDelete();
      //     editSubmitProduct();
      //     productManagementCreate();
      //   })
      //   .catch((err) => alert(err));
      Api.get(PRODUCT_URL, "products")
  .then((datas) => {
    console.log("prod:", datas);
    const promises = datas.products.map((data) => {
      return getCategoryNameByID(data.category[0]);
    });

    return Promise.all(promises).then((categoryNames) => {
      const newDatas = datas.products.map((data, index) => {
        return {
          _id: data._id,
          category: categoryNames[index],
          name: data.name,
          price: Number(data.price).toLocaleString(),
          stock: Number(data.stock).toLocaleString(),
        };
      });

      return newDatas.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    });
  })
  .then((newDatas) => {
    newHtml.appendChild(createProductTable(productAdmin, newDatas));
    mainTag.append(newHtml);
    const categoryId = document.querySelectorAll(".category-info");
    for (let count = 0; count < categoryId.length; count++) {
      console.log(categoryId[count].innerHTML);
    }
  })
  .then(() => {
    productManagementEdit();
    productManagementDelete();
    editSubmitProduct();
    productManagementCreate();
  })
  .catch((err) => alert(err));

    }
  });
}



//============ 주문관련 =====================
function orderManagementEdit() {
  const editBtns = document.querySelectorAll(".dropdown-item");
  
  for (let count = 0; count < editBtns.length; count++) {
    editBtns[count].addEventListener("click", (e) => {
      e.preventDefault();
      const btnValue = e.target.text;
      const btnId =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.id;
      //배송상태가 바뀐 값(배송중 => 배송완료)으로 현재 버튼이 배송완료 바뀌는 기능
      e.target.parentElement.parentElement.parentElement.querySelector(
        "a"
      ).innerText = `${btnValue}`;
      Api.patch("/api/admin/orders", btnId, 
          {shoppingStatus: `${btnValue}`})
        .then((alt) =>
          alert(`배송상태가 "${alt.shoppingStatus}"으로 변경되었습니다.`)
        )
        .catch((err) => alert(err));
    });
  }
}
function orderManagementDelete() {
  const deleteBtns = document.querySelectorAll(".btn__delete");
  for (let count = 0; count < deleteBtns.length; count++) {
    deleteBtns[count].addEventListener("click", (e) => {
      const conf = confirm("해당 주문건을 삭제하시겠습니까?");
      if (conf) {
        const btnId = e.target.parentElement.parentElement.id;
        document.getElementById(`${btnId}`).remove();
        Api.delete("/api/orders",btnId)
          .then((alt) => alert(alt))
          .catch((err) => alert(err));
      }
    });
  }
}
function userOrderList(email, count) {
}
function userManagementDelete() {
  const deleteBtns = document.querySelectorAll(".btn__delete");
  for (let count = 0; count < deleteBtns.length; count++) {
    deleteBtns[count].addEventListener("click", (e) => {
      const conf = confirm("해당 유저의 정보를 삭제하시겠습니까?");
      if (conf) {
        const btnId = e.target.parentElement.parentElement.id;
        document.getElementById(`${btnId}`).remove();
        Api.delete(`/api/users/${btnId}`)
          .then(async (res) => {
            const json = await res.json();

            if (res.ok) {
              return json;
            }

            return Promise.reject(json);
          })
          .then((idData) => alert(`${idData}이 삭제되었습니다.`))
          .catch((err) => alert(err));
      }
    });
  }
}
function orderSetProductsNameById(id, count){
  Api.get(PRODUCT_URL, "products")
    .then((productsList)=>{
    const findData = productsList.products.filter((product)=> product._id === id );
    })
    .catch((err)=>alert(err))
}
function orderSetBuyerNameById(id, count){
  Api.get(ADMIN_URL, "users")
  .then((userList)=>{
    const findData = userList.filter((user)=> user._id === id );
    const userId = document.querySelectorAll(".user-info");
    userId[count].innerText = findData[0].name;
  })
  .catch((err)=>alert(err))
}
//============== 카테고리관련 ===============
function editSubmitCategory(categoryId) {
    const newValue = document.querySelector("#edit-category-name").value;
    Api.patch("/api/admin/category",categoryId, {
        name: newValue.trim()
    })
      .then((data) => {
        alert(`"${beforeValue}"이(가) "${data.category.name}" 으로 변경되었습니다.`);
        bootstrap.Modal.getInstance("#btn__admin__editCategory").hide();
      })
      .catch((err) => alert(err));
}
function categoryManagementEdit() {
  const editCategoryBtns = document.querySelectorAll(
    ".btn__edit"
  );
  for (let count = 0; count < editCategoryBtns.length; count++) {
    editCategoryBtns[count].addEventListener("click", (e) => {
      beforeValue =
        document.querySelectorAll(".current__name")[count].innerText;
      categoryId = e.currentTarget.parentElement.parentElement.id;
      const btnSubmitEditCategory = document.querySelector(".submit__edit__category");
      const inputCategoryName = document.querySelector("#edit-category-name")
      inputCategoryName.value = beforeValue;
      btnSubmitEditCategory.addEventListener("click", ()=>{
        editSubmitCategory(categoryId)
      })
      
    });
  }
}
function categoryManagementCreate(){
    btnAddCategory.addEventListener("click", (e)=>{
      console.log("categoryManagementCreate -> 버튼 클릭")
      createSubmitCategory()
  })
}
function createSubmitCategory(){
  document
    .querySelector(".submit__category")
    .addEventListener("click", (e) => {
      console.log("editSubmitCategory - 버튼 클릭")
      const newValue = document.getElementById("category-name").value;
      console.log("newValue:",newValue)
      Api.post("/api/admin/category", {
          name: newValue.trim()
      })
    .then((data) => {
          alert(`"${data.name}" 이 생성됨요.`);
          document.querySelector(".btn__admin__category").click();
          bootstrap.Modal.getInstance("#btn__admin__addCategory").hide();
        })
    .catch((err) => alert(err));
    });
}

function categoryManagementDelete() {
  const deleteBtns = document.querySelectorAll(".btn__delete");
  for (let count = 0; count < deleteBtns.length; count++) {
    deleteBtns[count].addEventListener("click", (e) => {
      const conf = confirm("해당 카테고리를 삭제하시겠습니까?");
      if (conf) {
        const btnId = e.target.parentElement.parentElement.id;
        document.getElementById(`${btnId}`).remove();
        Api.delete(`/api/admin/category/${btnId}`)
          .then(async (res) => {
            const json = await res.json();

            if (res.ok) {
              return json;
            }

            return Promise.reject(json);
          })
          .then((alt) => alert(alt))
          .catch((err) => alert(err));
      }
    });
  }
}
//============== 상품관련 ===============

function editSubmitProduct() {
  const submitBtns = document.querySelector(".submit__edit__product");
  const name = document.getElementById("edit-product-name");
  const category = document.getElementById("edit-product-category");
  const shortDesc = document.getElementById("edit-short-description");
  const longDesc = document.getElementById("edit-long-description");
  const imageFile = document.getElementById("edit-product-img");
  const stock = document.getElementById("edit-product-stock");
  const price = document.getElementById("edit-product-price");
  submitBtns.addEventListener("click", (e) => {
    const formData = new FormData();

    if (category.value === "카테고리를 선택하세요") {
      formData.append("category", "#전체");
    } else {
      formData.append("category", `#${category.value.trim()}`);
    }
    formData.append("name", name.value.trim());
    formData.append("shortDesc", shortDesc.value.trim());
    formData.append("longDesc", longDesc.value.trim());
    formData.append("productImage", imageFile.files[0]);
    formData.append("stock", stock.value.trim());
    formData.append("price", price.value.trim());

    Api.patch(`/api/products/${productId}`, formData)
      .then((data) => {
        alert(`${data.name} 의 정보가 변경되었습니다.`);
        //form 안의 input값 전부 초기화하기
        name.value = "";
        category.value = "";
        shortDesc.value = "";
        longDesc.value = "";
        imageFile.value = "";
        stock.value = "";
        price.value = "";
        bootstrap.Modal.getInstance("#btn__admin__editProduct").hide();
        document.querySelector(".btn__admin__product").click();
      })
      .catch((err) => alert(err));
  });
}
function productManagementEdit() {
  //카테고리의 리스트를 불러오는 작업
  const addCategoryList = document.querySelectorAll(
    ".btn__edit"
  );
  addCategoryList.forEach((editBtn) => {
    editBtn.addEventListener("click", (e) => {
      Api.get(CATEGORY_URL,"categories")
        .then((datas) => {
          document.getElementById("edit-product-category").innerHTML = "";
          datas.categories.forEach((element) => {
            document.getElementById("edit-product-category").innerHTML += `
        <option>${element.name}</option>`;
          });
        })
        .catch((err) => alert(err));
    });
  });

  //수정하기 모달창을 띄울 때 데이터에 맞게 모달창에 넣어주기
  const editProductBtns = document.querySelectorAll(
    // ".btn__admin__editProduct"
    ".btn__edit"
  );
  const name = document.getElementById("edit-product-name");
  const color = document.getElementById("edit-product-color");
  const shortDesc = document.getElementById("edit-short-description");
  const longDesc = document.getElementById("edit-long-description");
  const stock = document.getElementById("edit-product-stock");
  const price = document.getElementById("edit-product-price");

  for (let count = 0; count < editProductBtns.length; count++) {
    editProductBtns[count].addEventListener("click", (e) => {
      productId = e.currentTarget.parentElement.parentElement.id;
      Api.get("/api/product",productId)
        .then((newData) => {
          name.value = newData.name;
          shortDesc.value = newData.shortContent;
          longDesc.value = newData.longContent;
          stock.value = newData.stock;
          price.value = newData.price;
          color = newData.color;
        })
        .catch((err) => alert(err));
    });
  }
}
function productManagementCreate() {
  btnAddProduct.addEventListener("click", (e)=>{
    console.log("상품추가 버튼 클릭")
    createSubmitProduct()
})
}
function createSubmitProduct(){
  btnAddProduct.addEventListener("click", (e) => {
    Api.get(PRODUCT_URL,"products")
      .then((datas) => {
        // document.getElementById("create-product-category").innerHTML = "";
        // datas.forEach((element) => {
        //   document.getElementById("create-product-category").innerHTML += `
        // <option>${element.name}</option>`;
        // });
        console.log(datas)
      })
      .catch((err) => alert(err));
  });
  
  btnAddProduct.addEventListener("click", (e) => {
    const name = document.getElementById("create-product-name");
    const category = document.getElementById("create-product-category");
    const shortDesc = document.getElementById("create-short-description");
    const longDesc = document.getElementById("create-long-description");
    const imageFile = document.getElementById("create-product-img");
    const stock = document.getElementById("create-product-stock");
    const price = document.getElementById("create-product-price");

    const formData = new FormData();
    if (category.value === "카테고리를 선택하세요") {
      formData.append("category", "전체");
    } else {
      formData.append("category", category.value.trim());
    }
    formData.append("name", name.value.trim());
    formData.append("shortDesc", shortDesc.value.trim());
    formData.append("longDesc", longDesc.value.trim());
    formData.append("productImage", imageFile.files[0]);
    formData.append("stock", stock.value.trim());
    formData.append("price", price.value.trim());

    Api.patch("/api/products",formData)
      .then((data) => {
        alert(`${data.name} 이(가) 상품에 추가되었습니다.`);
        //form 안의 input값 전부 초기화하기
        name.value = "";
        category.value = "";
        shortDesc.value = "";
        longDesc.value = "";
        imageFile.value = "";
        stock.value = "";
        price.value = "";

        bootstrap.Modal.getInstance("#btn__admin__addProduct").hide();
        document.querySelector(".btn__admin__product").click();
      })
      .catch((err) => alert(err));
  });
}
function productManagementDelete() {
  const deleteBtns = document.querySelectorAll(".btn__delete");
  for (let count = 0; count < deleteBtns.length; count++) {
    deleteBtns[count].addEventListener("click", (e) => {
      const conf = confirm("해당 상품의 정보를 삭제하시겠습니까?");
      if (conf) {
        const btnId = e.target.parentElement.parentElement.id;
        document.getElementById(`${btnId}`).remove();
        Api.delete("/api/admin/product",btnId)
          .then(async (res) => {
            const json = await res.json();

            if (res.ok) {
              return json;
            }

            return Promise.reject(json);
          })
          .then((alt) => alert(alt))
          .catch((err) => alert(err));
      }
    });
  }
}
function productSetCategoryNameById(id, count){
  Api.get(CATEGORY_URL, "categories")
    .then((categories)=>{
    const findData = categories.categories.filter((category)=> category._id === id );
    const categoryId = document.querySelectorAll(".category-info");
    categoryId[count].innerText = findData[0];
  })
  .catch((err)=>alert(err))
}
function getCategoryNameByID(categoryID) {
  console.log("categoryID:", categoryID)
  return Api.get(CATEGORY_URL, "categories")
    .then((categories) => {
      console.log(categories)
      const category = categories.categories.find((cat) => cat._id.toString() === categoryID.toString());
      console.log("cate:", category.name)
      return category ? category.name : "Unknown";
    })
    .catch((error) => {
      console.error("Error retrieving category:", error);
      return "Unknown";
    });
}
