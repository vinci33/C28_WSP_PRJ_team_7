
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
