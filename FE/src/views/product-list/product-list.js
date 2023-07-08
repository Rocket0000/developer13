import * as Api from "../api.js";

const itemlist = document.querySelector(".main-container__itemlist");
const itemCount = document.createElement("p");
itemCount.classList.add("item-count");
itemlist.insertAdjacentElement("beforebegin", itemCount);

const productUrl = "/api/product/category";
const params = new URLSearchParams(location.search);
const category = params.get("category");

Api.get(productUrl, `${category}`)
  .then((productList) => {
    console.log(productUrl);
    if (productList.products.length === 0) {
      const message = document.createElement("p");
      message.textContent = "해당 카테고리의 제품이 존재하지 않습니다.";
      itemlist.style.display = "none";
      message.style.textAlign = "center";
      itemlist.insertAdjacentElement("afterend", message);
    } else {
      productList.products.forEach((product) => {
        const item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = `
          <a href="../product-detail/product-detail.html?id=${product._id}" data-id="${product._id}" class="item">
            <img src="${product.smallImageURL}" alt="${product.name}">
            <p class="item-title">${product.name}</p>
            <span class="item-price">${product.price}</span>
          </a>
        `;
        itemlist.appendChild(item);
      });
    }

    itemCount.textContent = `전체 : ${productList.products.length}개`;

    const items = document.querySelectorAll(".item a");
    items.forEach((item) => {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const id = this.dataset.id;
        localStorage.setItem("productId", id);
        location.href = `../product-detail/product-detail.html?id=${encodeURIComponent(
          id
        )}`;
      });
    });
  })
  .catch((error) => {
    console.error("에러 발생:", error);
  });

/*

import * as Api from "../api.js";

const itemlist = document.querySelector(".main-container__itemlist");
const itemCount = document.createElement("p");
itemCount.classList.add("item-count");
itemlist.insertAdjacentElement("beforebegin", itemCount);

const params = new URLSearchParams(location.search);
const category = params.get("category");
Api.get(`api/product/category/${encodeURIComponent(category)}`)
    .then(response => response.json())
    .then(productList => {
        if (productList.length === 0) {
            const message = document.createElement("p");
            message.textContent = "해당 카테고리의 제품이 존재하지 않습니다.";
            itemlist.style.display = "none";
            message.style.textAlign = "center";
            itemlist.insertAdjacentElement("afterend", message);
        } else {
            productList.forEach(product => {
                const item = document.createElement("div");
                item.classList.add("item");
                item.innerHTML = `
                    <a href="../product-detail/product-detail.html?id=${encodeURIComponent(product._id)}" class="item">
                      <img src="${product.smallImageURL}" alt="${product.name}">
                      <p class="item-title">${product.name}</p>
                      <span class="item-price">${product.price}</span>
                    </a>`;
                itemlist.appendChild(item);
            });
        }

        itemCount.textContent = `전체 : ${productList.length}개`;

        const items = document.querySelectorAll(".item a");
        items.forEach(item => {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                const id = this.dataset.id;
                localStorage.setItem("productId", id);
                location.href = `../product-detail/product-detail.html?id=${encodeURIComponent(
                    product._id
                )}`;
            });
        });
    })
    .catch(error => {
        console.error("에러 발생:", error);
    });
    */
