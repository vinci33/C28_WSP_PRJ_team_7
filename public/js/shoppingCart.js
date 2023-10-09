window.onload = () => {
  initProducts();
  // deleteItems();
};

async function initProducts() {
  const resp = await fetch("/shoppingCart.html/products");
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);

    productClone.querySelector("img").src = product.image_one;

    productClone.querySelector(
      ".product-details"
    ).textContent = `${product.product_details} (${product.product_color})`;
    productClone.querySelector(
      ".product-selling-price"
    ).textContent = `$ ${product.selling_price}`;
    productClone.querySelector(
      ".product-quantity"
    ).textContent = `${product.product_quantity}`;

    productClone.querySelector(".product-total-price").textContent = `$ ${(
      product.selling_price * product.product_quantity
    ).toLocaleString()}`;

    productContainerEle.appendChild(productClone);
  }
}

// 需要定義番product_id 及 user_id
// 執行initProducts()時，要delete all div????
//1:00:00
// async function deleteItems(pid) {
//   const res = await fetch("/shoppingCart.html"),
//     {
//       method: "DELETE",
//       body: json.stringify({
//         product_id: pid,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     if (res.ok){
//       initProducts()
//     } else {
//       alert('Error when loading the page')
//     }

//   document.addEventListener(".remove-button", async function('click', (e) => {

//   })
// }
