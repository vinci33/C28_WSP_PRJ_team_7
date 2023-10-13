window.onload = () => {
  initProducts();
};

async function initProducts() {
  const resp = await fetch("/products");
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);

    productClone.querySelector("a").href = `/proDetail.html?id=${product.id}`;

    productClone.querySelector("img").src = product["image_one"];

    productClone.querySelector(
      ".product-title"
    ).textContent = `${product["product_name"].replace(/_/g, " ")} (${product["product_color"]})`;

    productClone.querySelector(".product-price").textContent = `$ ${product[
      "selling_price"
    ].toLocaleString()}`;

    productContainerEle.appendChild(productClone);
  }
}
