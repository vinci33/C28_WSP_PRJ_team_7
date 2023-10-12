// Make an AJAX request to check the login status
fetch('/login-status')
    .then(response => response.json())
    .then(data => {
        const btn = document.getElementById("loginbtn");
        if (data.isLoggedIn) {
            // User is logged in
            btn.innerHTML = "Logout";
            btn.href = "/logout";
        } else {
            // User is not logged in
            btn.innerHTML = "LogIn/SignUp";
            btn.href = "/signup.html";
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });


// document.addEventListener("DOMContentLoaded", () => {
// const logoutButton = document.getElementById("loginbtn");
// logoutButton.addEventListener("click", () => {
//     // event.preventDefault();
//     console.log("Logging out...");
//     fetch("/logout", {
//         method: "GET",
//         credentials: "same-origin" // Include this option to send cookies, if using sessions
//     })
//         .then(response => {
//             if (response.ok) {
//                 // Redirect the user to the login page or perform any other desired action
//                 // window.location.href = "/";
//                 console.log("Logout request successful");

//                 // document.querySelector("#loginbtn").innerHTML = "Login/SignUp";
//             } else {
//                 console.error("Logout request failed");
//             }
//         })
//         .catch(error => {
//             console.error("An error occurred during logout:", error);
//         });
// });
// //   });