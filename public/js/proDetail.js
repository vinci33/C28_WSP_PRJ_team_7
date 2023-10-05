
const form = document.querySelector("form");
const productDetails = document.querySelector("#productDetails");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productId = document.querySelector("#productId").value;
    const response = await fetch(`/product/${productId}`);
    const data = await response.json();
    if (data.success) {
        const product = data;
        productDetails.innerHTML = `
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
    `;
    } else {
        productDetails.innerHTML = `<p>${data.msg}</p>`;
    }
});