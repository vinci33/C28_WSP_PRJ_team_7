window.onload = async () => {
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);
  const id = parseInt(searchParams.get("id"));
  await initProductDetail(id);
  await initAddToCart(id);
};

async function initAddToCart(id) {
  try {
    // event listener for add to cart button
    const reduceBtn = document.querySelector(".reduce");
    const addBtn = document.querySelector(".add");
    const quantityEle = document.querySelector(".number-of-quantity");

    if (!reduceBtn || !addBtn || !quantityEle) {
      throw new Error("Missing button elements");
    }

    let quantity = parseInt(quantityEle.dataset.quantity);
    reduceBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityEle.innerHTML = quantity;
      }
    });

    addBtn.addEventListener("click", () => {
      quantity++;
      quantityEle.innerHTML = quantity;
    });

    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const addToCartItem = e.target;
      const resp = await fetch("/productDetail/" + id);
      if (!resp.ok) {
        throw new Error("Unable to get/fetch product details");
      }
      const product = await resp.json();
      const addToCartItemObj = {};
      addToCartItemObj.product_id = product.id;
      addToCartItemObj.product_quantity = quantity;
      const resp2 = await fetch("/cartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addToCartItemObj),
      });
      if (!resp2.ok) {
        throw new Error("Unable to post/add item to cart");
      }
      addToCartBtn.innerHTML = "Added to Cart";
      addToCartBtn.disabled = true;
    });
  } catch (err) {
    console.error(`Error in initAddToCart function: ${err.message}`);
  }
}

async function initCartCounter() {
  const cartCounter = document.querySelector("#cart-count");
  const resp = await fetch("/cartCount");
  const cartCount = await resp.json().cartCount;
  cartCounter.innerHTML = cartCount;
  console.log(cartCount);
}

async function initProductDetail(id) {
  try {
    const resp = await fetch("/productDetail/" + id);
    const product = await resp.json();
    const productContainerEle = document.querySelector(".product-detail-card");
    const templateEle = document.querySelector(
      "#product-detail-card-container-template"
    );
    const productClone = templateEle.content.cloneNode(true);
    productClone.querySelector("img").src = product.image_one;
    productClone.querySelector(".product-name").textContent =
      product.product_name.replace(/_/g, " ");
    productClone.querySelector(".product-detail").textContent =
      product.product_details.replace(/_/g, " ");
    productClone.querySelector(".subtitle-colour").textContent =
      product.product_color;
    if (product.product_size === "null") {
      productClone
        .querySelector(".storage, subtitle-storage")
        .classList.add("hidden");
    } else {
      productClone
        .querySelector(".storage, .subtitle-storage")
        .classList.remove("hidden");
      productClone.querySelector(".subtitle-storage").textContent =
        product.product_size;
    }
    productClone.querySelector(
      ".product-price-value"
    ).textContent = `$${product.selling_price.toLocaleString()}`;
    productContainerEle.appendChild(productClone);
  } catch (err) {
    console.error("initializing product detail:", err);
  }
}
