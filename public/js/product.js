window.onload = () => {
  const paramsString = window.location.search;
  // const searchParams = new URLSearchParams(paramsString);
  // initProducts(searchParams);
  initCategorySelect();
  initColorSelect();
};

async function initCategorySelect() {
  const selectEle = document.querySelector("#category-select");
  const resp = await fetch("/product_categories");
  const categories = await resp.json();
  for (const category of categories) {
    selectEle.innerHTML += `<option value="${category.categories_name}">${category.categories_name}</option>`;
  }
  selectEle.addEventListener("change", async () => {
    window.location = `/?category=${selectEle.value}`;
  });
}

async function initColorSelect() {
  const selectEle = document.querySelector("#color-select");
  const resp = await fetch("/product_colors");
  const colors = await resp.json();
  for (const color of colors) {
    selectEle.innerHTML += `<option value="${color}">${color}</option>`;
  }
  selectEle.addEventListener("change", async () => {
    window.location = `/?product_color=${selectEle.value}`;
  });
}

// async function initProducts(searchParams) {
//   const resp = await fetch("/products?" + searchParams);
//   const products = await resp.json();

//   const productContainerEle = document.querySelector(".product-container");
//   const templateEle = document.querySelector("#product-template");

//   for (const product of products) {
//     const productClone = templateEle.content.cloneNode(true);
//     productClone.querySelector("img").src = product.image;
//     productClone.querySelector(".title").textContent = product.title;
//     productClone.querySelector(".description").textContent =
//       product.description;
//     productContainerEle.appendChild(productClone);
//   }
// }
