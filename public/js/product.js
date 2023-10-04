window.onload = () => {
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);
  initProducts(searchParams);
  initCategorySelect();
};

async function initCategorySelect() {
  const selectEle = document.querySelector("#category-select");
  const resp = await fetch("/categories");
  const categories = await resp.json();
  for (const category of categories) {
    selectEle.innerHTML += `<option value="${category}">${category}</option>`;
  }
  selectEle.addEventListener("change", async () => {
    window.location = `/?category=${selectEle.value}`;
  });
}

async function initProducts(searchParams) {
  const resp = await fetch("/products?" + searchParams);
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);
    productClone.querySelector("img").src = product.image;
    productClone.querySelector(".title").textContent = product.title;
    productClone.querySelector(".description").textContent =
      product.description;
    productContainerEle.appendChild(productClone);
  }
}
