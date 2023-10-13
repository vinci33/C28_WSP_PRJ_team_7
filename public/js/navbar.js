// Make an AJAX request to check the login status

fetch('/login-status')
    .then(response => response.json())
    .then(data => {
        const loginbtn = document.getElementById("loginbtn");
        const profilebtn = document.getElementById("profilebtn");
        const cartbtn = document.getElementById("cartbtn");

        if (data.isLoggedIn) {
            // User is logged in
            loginbtn.innerHTML = /*html*/ `<i class="fa-solid fa-arrow-right-to-bracket"></i> Logout`;
            loginbtn.href = "/logout";
            profilebtn.innerHTML = '<i class="fa-solid fa-user"></i>My Orders';
            profilebtn.style.display = "block"; // Show profile button
            cartbtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>My Cart';
            cartbtn.style.display = "block"; // Show cart button
        } else {
            // User is NOT logged in
            loginbtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> LogIn / SignUp';
            loginbtn.href = "/login.html";
            profilebtn.style.display = "none"; // Hide profile button
            cartbtn.style.display = "none"; // Hide cart button
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });