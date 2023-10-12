window.onload = () => {
  initOrders();
};

async function initOrders() {
  const resp = await fetch("/orderHistory.html/orders");
  const orders = await resp.json();

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

    // Change it or not??
    orderClone.querySelector(
      ".payment-status"
    ).textContent = `Payment Status: Successful`;

    orderClone.querySelector(
      ".payment-method"
    ).textContent = `Payment Method: ${order.payment_method}`;

    let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
    orderContainerEle.appendChild(orderClone);
  }
}
