// Make an AJAX request to check the login status

fetch('/login-status')
    .then(response => response.json())
    .then(data => {
        const loginbtn = document.getElementById("loginbtn");
        const profilebtn = document.getElementById("profilebtn");
        const cartbtn = document.getElementById("cartbtn");

        if (data.isLoggedIn) {
            // User is logged in
            loginbtn.innerHTML = "Logout";
            loginbtn.href = "/logout";
            profilebtn.style.display = "block"; // Show profile button
            cartbtn.style.display = "block"; // Show cart button
        } else {
            // User is not logged in
            loginbtn.innerHTML = "LogIn/SignUp";
            loginbtn.href = "/signup.html";
            profilebtn.style.display = "none"; // Hide profile button
            cartbtn.style.display = "none"; // Hide cart button
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });