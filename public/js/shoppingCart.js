window.onload = () => {
  initProducts();
};

async function initProducts() {
  const resp = await fetch("/shoppingCart.html/products");
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);

    productClone.querySelector("img").src = product["image_one"];

    productClone.querySelector(
      ".product-title"
    ).textContent = `${product["product_name"]} (${product["product_color"]})`;

    productClone.querySelector(
      ".product-price"
    ).textContent = `$ ${product["selling_price"]}`;

    productContainerEle.appendChild(productClone);
  }
}
