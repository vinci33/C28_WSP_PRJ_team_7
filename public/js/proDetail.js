
// const product = document.querySelector("product");
// const productDetails = document.querySelector("#productDetails");

// product.addEventListener("click", async (event) => {
//     event.preventDefault();
//     const productId = document.querySelector("#productId").value;
//     const response = await fetch(`/product/${productId}`);
//     const data = await response.json();
//     if (data.success) {
//         const product = data;
//         productDetails.innerHTML = `
//       <h2>${product.name}</h2>
//       <p>${product.description}</p>
//       <p>Price: $${product.price}</p>
//     `;
//     } else {
//         productDetails.innerHTML = `<p>${data.msg}</p>`;
//     }
// });
window.onload = () => {
    initAddToCart()
    initProductsV2(2)
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

    //     addToCartBtn.addEventListener("click", async () => {
    //         const addToCartBtn = document.querySelector(".add-to-cart-btn");
    //         const productId = document.querySelector("#productId").value;
    //         const response = await fetch(`/product/${productId}`);
    //         const data = await response.json();
    //         if (data.success) {
    //             const product = data;
    //             const { name, price, image } = product;
    //             const cartItem = {
    //                 name,
    //                 price,
    //                 image,
    //                 quantity,
    //             };
    //             const response = await fetch("/cart", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(cartItem),
    //             });
    //             const data = await response.json();
    //             if (data.success) {
    //                 alert("Add to cart successfully");
    //             } else {
    //                 alert(data.msg);
    //             }
    //         } else {
    //             alert(data.msg);
    //         }
    //     });

}


async function initProductsV2(searchParams) {
    const resp = await fetch("/proDetail.html/products?" + searchParams);
    const products = await resp.json();
    console.log(products);
    const productContainerEle = document.querySelector(".product-detail-card");
    const templateEle = document.querySelector("#product-detail-card-container-template");

    // for (const product of products) {
    //     const productClone = templateEle.content.cloneNode(true);
    //     productClone.querySelector("img").src = products.image_one;
    //     productClone.querySelector(".product-name").textContent = products.product_name;
    //     productClone.querySelector(".product-detail").textContent = products.product_details;
    //     productContainerEle.appendChild(productClone);
    // }
}


