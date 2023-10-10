document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the values from the input fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Create an object to hold the data
  const data = {
    email: email,
    password: password
  };

  // Send an HTTP request to the server
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      // Login successful
      console.log("Login successful!");

      // Redirect to the success page
      window.location.href = "/loginSuccess.html";
    } else {
      // Handle error response
      console.error("Error logging in");
    }
  })
  .catch(error => {
    console.error("Request failed:", error);
  });
});