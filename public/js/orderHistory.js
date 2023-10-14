window.onload = () => {
  initOrders();
};

async function initOrders() {
  const resp = await fetch("/orderHistory.html/orders");
  let orders = await resp.json();

  const orderContainerEle = document.querySelector(".order-container");
  const templateEle = document.querySelector("#order-template");
  orderContainerEle.innerHTML = "";
  let count = 0;

  for (const order of orders) {
    const orderClone = templateEle.content.cloneNode(true);

    count++


    if (count % 2 === 0) {
      orderClone.querySelector('#color-container').style.backgroundColor = '#b6e2d3'
    } else {
      orderClone.querySelector('#color-container').style.backgroundColor = '#FFFFFF'
    }

    orderClone.querySelector(".order_number").textContent = `Order ${count}: `;

    orderClone.querySelector(
      ".created_at"
    ).textContent = `Order Date: ${new Date(order.created_at).toLocaleString()}`;

    orderClone.querySelector(
      ".name"
    ).textContent = `Recipient: ${order.first_name} ${order.last_name}`;

    orderClone.querySelector(
      ".phone"
    ).textContent = `Contact Number: ${order.phone}`;

    let address = [order.address1]

    if (order.address2 !== null) {
      address.push(order.address2)
    }
    if (order.street !== null) {
      address.push(order.street)
    }
    if (order.city !== null) {
      address.push(order.city)
    }
    if (order.country !== null) {
      address.push(order.country)
    }

    orderClone.querySelector(
      ".address"
    ).textContent = `Detailed Address: ${address.join(', ')}`;

    orderClone.querySelector(
      ".total-amount"
    ).textContent = `Total Amount: $ ${(order.total_amount).toLocaleString()}`;

    orderClone.querySelector(
      ".payment-method"
    ).textContent = `Payment Method: ${order.payment_method}`;

    orderClone.querySelector(
      ".payment-status"
    ).textContent = `Payment Status: Successful`;

    orderClone.querySelector(".collapsible").addEventListener("click", async function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });

    let orderResp = await fetch(`/orderHistory.html/orderData?orderId=${order.id}`);
    const orderData = await orderResp.json();
    let orderDetailsContainerEle = orderClone.querySelector(".content")
    let itemCount = 0
    for (const details of orderData) {
      itemCount++
      const div2 = document.createElement("div");
      div2.innerHTML = `${itemCount}. ${details.product_name} (${details.product_color}) x ${details.product_quantity} pcs <b>(Subtotal: $${(+details.product_total_price).toLocaleString()})</b>`;
      orderDetailsContainerEle.appendChild(div2);

    }
    orderContainerEle.appendChild(orderClone);
  }
}
