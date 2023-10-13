window.onload = () => {
  initProducts();
};

async function initProducts() {
  const resp = await fetch("/shoppingCart.html/products");
  const products = await resp.json();

  const productContainerEle = document.querySelector(".product-container");
  const templateEle = document.querySelector("#product-template");
  productContainerEle.innerHTML = "";

  let totalAmount = 0;

  for (const product of products) {
    const productClone = templateEle.content.cloneNode(true);

    productClone.querySelector("img").src = product.image_one;

    productClone.querySelector(
      ".product-details"
    ).textContent = `${product.product_details.replace(/_/g, " ")} (${product.product_color})`;
    productClone.querySelector(
      ".product-selling-price"
    ).textContent = `$ ${product.selling_price.toLocaleString()}`; //*pls use this for all price .toLocaleString()
    productClone.querySelector(
      ".product-quantity"
    ).textContent = `${product.product_quantity}`;

    productClone.querySelector(".product-total-price").textContent = `$ ${(
      product.selling_price * product.product_quantity
    ).toLocaleString()}`;

    totalAmount += product.selling_price * product.product_quantity;

    productClone
      .querySelector(".remove-button")
      .setAttribute("pid", product.product_id);


    productClone
      .querySelector(".remove-button")
      .addEventListener("click", function (e) {
        if (
          e.target.classList.contains("fa-xmark") ||
          e.target.tagName === "B"
        ) {
          const pid = e.target.parentNode.getAttribute("pid");
          deleteItems(pid);
        } else {
          const pid = e.target.getAttribute("pid");
          deleteItems(pid);
        }
      });

    // productClone
    //   .querySelector(".reduce")
    //   .setAttribute("pid", product.product_id);

    // productClone
    //   .querySelector(".add")
    //   .setAttribute("pid", product.product_id);

    productClone
      .querySelector(".reduce")
      .addEventListener("click", function (e) {
        let quantity = parseInt(
          e.target.parentNode.querySelector(".product-quantity").textContent
        );
        // const id = e.target.getAttribute("pid");
        console.log(quantity);
        //  const reduce = quantity - 1;
        if (quantity <= 1) {
          return;
        }
        else {
          reduce = quantity - 1;
          e.target.parentNode.querySelector(
            ".product-quantity"
          ).textContent = reduce;
          console.log(quantity);
          updateProductQuantity(reduce);
        }
      });

    productClone
      .querySelector(".add")
      .addEventListener("click", function (e) {
        let quantity = parseInt(
          e.target.parentNode.querySelector(".product-quantity").textContent
        );
        // const id = e.target.getAttribute("pid");
        console.log(quantity);
        add = quantity + 1;
        e.target.parentNode.querySelector(
          ".product-quantity"
        ).textContent = reduce;
        console.log(quantity);
        updateProductQuantity(add);

      });


    productContainerEle.appendChild(productClone);
  }

  document.querySelector(
    ".product-footer-total"
  ).textContent = `$ ${totalAmount.toLocaleString()}`;
}

async function deleteItems(pid) {
  const res = await fetch("/shoppingCart.html", {
    method: "DELETE",
    body: JSON.stringify({
      product_id: pid,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    initProducts();
  } else {
    alert("Error when loading the page");
  }
}

// update quantity kdl

async function updateProductQuantity(quantity) {
  const resp = await fetch("/getShoppingId", {

  })
  const res = await fetch("/updateQuantity", {
    method: "PUT",
    body: JSON.stringify({
      product_quantity: quantity,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    console.log(res);
    initProducts();
  } else {
    alert("Error when loading the page");
  }
}