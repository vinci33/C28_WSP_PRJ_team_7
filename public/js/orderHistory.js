window.onload = () => {
  initOrders();
};

async function initOrders() {
  const resp = await fetch("/orderHistory.html/orders");
  const orders = await resp.json();

  const orderContainerEle = document.querySelector(".order-container");
  const templateEle = document.querySelector("#order-template");
  orderContainerEle.innerHTML = "";

  for (const order of orders) {
    const orderClone = templateEle.content.cloneNode(true);

    orderClone.querySelector(
      ".product-details"
    ).textContent = `${product.product_details} (${product.product_color})`;

    orderClone.querySelector(
      ".product-selling-price"
    ).textContent = `$ ${product.selling_price.toLocaleString()}`; //*pls use this for all price .toLocaleString()

    orderClone.querySelector(
      ".product-quantity"
    ).textContent = `${product.product_quantity}`;

    orderClone.querySelector(".product-total-price").textContent = `$ ${(
      product.selling_price * product.product_quantity
    ).toLocaleString()}`;

    orderContainerEle.appendChild(orderClone);
  }
}
