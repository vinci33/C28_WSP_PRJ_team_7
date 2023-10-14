// Make an AJAX request to check the login status
fetch('/login-status')
    .then(response => response.json())
    .then(data => {
        const loginbtn = document.getElementById("loginbtn");
        const profilebtn = document.getElementById("profilebtn");
        const cartbtn = document.getElementById("cartbtn");
        const homebtn = document.getElementById("homebtn");
        const productbtn = document.getElementById("productbtn");
        const phonecasebtn = document.getElementById("phonecasebtn");
        const aboutusbtn = document.getElementById("aboutusbtn");

        // Hide or show buttons based on login status and current page
        if (data.isLoggedIn) {
            // User is logged in
            loginbtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> LogOut';
            loginbtn.style.display = "block"; // Show login button
            loginbtn.href = "/logout";
            profilebtn.innerHTML = '<i class="fa-solid fa-user"></i>My Orders';
            profilebtn.style.display = "block"; // Show profile button
            profilebtn.href = "/orderhistory.html";
            cartbtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>My Cart';
            cartbtn.style.display = "block"; // Show cart button
            cartbtn.href = "/shoppingcart.html";
        } else {
            // User is NOT logged in
            loginbtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> LogIn / SignUp';
            loginbtn.style.display = "block"; // Show login button
            loginbtn.href = "/login.html";
            profilebtn.style.display = "none"; // Hide profile button
            cartbtn.style.display = "none"; // Hide cart button
        }


        const currentPage = window.location.pathname;

        // Update innerHTML and href for static buttons based on the current page
        if (currentPage === "/index.html") {
            homebtn.style.display = "none"; // Hide home button on index page
        } else {
            homebtn.innerHTML = 'Home';
            homebtn.href = "/index.html";
        }

        if (currentPage === "/product.html") {
            productbtn.style.display = "none"; // Hide product button on product page
        } else {
            productbtn.innerHTML = 'Mobile';
            productbtn.href = "/product.html";
        }

        if (currentPage === "/phonecase.html") {
            phonecasebtn.style.display = "none"; // Hide phone case button on phone case page
        } else {
            phonecasebtn.innerHTML = 'Cases and Accessories';
            phonecasebtn.href = "/phonecase.html";
        }

        if (currentPage === "/aboutus.html") {
            aboutusbtn.style.display = "none"; // Hide about us button on about us page
        } else {
            aboutusbtn.innerHTML = 'About Us';
            aboutusbtn.href = "/aboutus.html";
        }

        if (currentPage === "/signup.html") {
            loginbtn.style.display = "none"; // Hide about us button on about us page
        } else {
            loginbtn.innerHTML = 'LogIn / SignUp';
            loginbtn.href = "/login.html";
        }

        // Check if it's the signup success page
        if (currentPage === "/signupSuccess.html") {
            loginbtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Logout';
            loginbtn.href = "/logout";
        }

        // Hide order history button if user is not logged in or if it's the order history page
        if (!data.isLoggedIn || currentPage === "/orderhistory.html") {
            profilebtn.style.display = "none";
        } else {
            profilebtn.style.display = "block";
        }

        // Hide shopping cart button if user is not logged in or if it's the shopping cart page
        if (!data.isLoggedIn || currentPage === "/shoppingcart.html") {
            cartbtn.style.display = "none";
        } else {
            cartbtn.style.display = "block";
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });