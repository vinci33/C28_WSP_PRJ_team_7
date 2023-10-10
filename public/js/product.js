window.onload = () => {
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);
  initProducts(searchParams);
  initCategorySelect();
  initColorSelect();
  handleSortingChange();
};

async function initCategorySelect() {
  const selectEle = document.querySelector("#category-select");
  const resp = await fetch("/product.html/product_categories");
  const categories = await resp.json();
  for (const category of categories) {
    if (
      decodeURIComponent(window.location.search) ===
      `?category=${category.categories_name}`
    ) {
      selectEle.innerHTML += `<option value="${category.categories_name}" selected='${category.categories_name}'>${category.categories_name}</option>`;
    } else {
      selectEle.innerHTML += `<option value="${category.categories_name}">${category.categories_name}</option>`;
    }
  }
  selectEle.addEventListener("change", async () => {
    window.location = `/product.html?category=${selectEle.value}`;
    if (selectEle.value === "all-products") {
      window.location = "/product.html";
    }
  });
}

async function initColorSelect() {
  const selectEle = document.querySelector("#color-select");
  const resp = await fetch("/product.html/product_colors");
  const colors = await resp.json();
  for (const color of colors) {
    if (
      decodeURIComponent(window.location.search) === `?product_color=${color}`
    ) {
      selectEle.innerHTML += `<option value="${color}" selected='${color}'>${color}</option>`;
    } else {
      selectEle.innerHTML += `<option value="${color}">${color}</option>`;
    }
  }
  selectEle.addEventListener("change", async () => {
    window.location = `/product.html?product_color=${selectEle.value}`;
    if (selectEle.value === "all-colors") {
      window.location = "/product.html";
    }
  });
}

async function initProducts(searchParams) {
  const resp = await fetch("/product.html/all_products?" + searchParams);
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);

    productClone.querySelector("a").href = `/proDetail.html?id=${product.id}`;

    productClone.querySelector("img").src = product["image_one"];

    productClone.querySelector(
      ".product-title"
    ).textContent = `${product["product_name"]} (${product["product_color"]})`;

    productClone.querySelector(".product-price").textContent = `$ ${product[
      "selling_price"
    ].toLocaleString()}`;

    let difference =
      new Date().getTime() - new Date(product["modified_at"]).getTime();
    productClone.querySelector(
      ".post-date"
    ).textContent = `Posted On: ${Math.floor(
      difference / (1000 * 3600 * 24)
    )} day(s) ago`;
    productContainerEle.appendChild(productClone);
  }
}

function handleSortingChange() {
  const productContainer = document.querySelector(".product-container");
  const selectElement = document.querySelector("#date-order");
  selectElement.addEventListener("change", function () {
    const productCards = Array.from(document.querySelectorAll(".product"));
    productCards.reverse();
    productContainer.innerHTML = "";
    for (const card of productCards) {
      productContainer.appendChild(card);
    }
  });
}
