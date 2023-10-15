window.onload = () => {
  initOrders();
  handleSortingChange()
};

async function initOrders() {
  const resp = await fetch("/orderHistory.html/orders");
  let orders = await resp.json();

  const orderContainerEle = document.querySelector(".order-container");
  const templateEle = document.querySelector("#order-template");
  orderContainerEle.innerHTML = "";
  let count = orders.length + 1;

  for (const order of orders) {
    const orderClone = templateEle.content.cloneNode(true);

    count--

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

    let address = []

    let address1 = order.address1
    if (address1.endsWith(',')) {
      address.push(address1.slice(0, -1))
    } else address.push(address1)

    let address2 = order.address2
    if (order.address2 !== null && address2.endsWith(',')) {
      address.push(address2.slice(0, -1))
    } else if (order.address2 !== null) {
      address.push(address2)
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
    ).textContent = `Payment Status: ${order.payment_status}`;

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


function handleSortingChange() {
  const orderContainer = document.querySelector(".order-container");
  const selectElement = document.querySelector("#date-order");
  selectElement.addEventListener("change", function () {
    const orderCards = Array.from(document.querySelectorAll(".order"));
    orderCards.reverse();
    orderContainer.innerHTML = "";
    for (const card of orderCards) {
      orderContainer.appendChild(card);
    }
  });
}
