
window.onload = async () => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const id = parseInt(searchParams.get("id"))
    await initProductDetail(id);
    initAddToCart()
}



function initAddToCart() {
    // event listener for add to cart button

    const reduceBtn = document.querySelector(".reduce");
    const addBtn = document.querySelector(".add");
    const quantityEle = document.querySelector(".number-of-quantity");



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
}


async function initProductDetail(id) {
    const resp = await fetch("/proDetail.html/" + id);
    const product = await resp.json();
    console.log(product.product_name);
    const productContainerEle = document.querySelector(".product-detail-card");
    const templateEle = document.querySelector("#product-detail-card-container-template");
    console.log(templateEle);
    const productClone = templateEle.content.cloneNode(true);
    productClone.querySelector("img").src = product.image_one;
    productClone.querySelector(".product-name").textContent = product.product_name.replace(/_/g, " ");
    productClone.querySelector(".product-detail").textContent = product.product_details.replace(/_/g, " ");
    productClone.querySelector(".subtitle-colour").textContent = product.product_color;
    productClone.querySelector(".subtitle-storage").textContent = product.product_size;
    productClone.querySelector(".product-price-value").textContent = `$${product.selling_price}`;
    productContainerEle.appendChild(productClone);
}


