document.getElementById("createAccountForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the values from the input fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate the form input
  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  // Create an object to hold the data
  const data = {
    email: email,
    password: password
  };

  // Send an HTTP request to the server
  fetch("/create-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      // Account created successfully
      console.log("Account created!");

      // Redirect to the success page
      window.location.href = "/signupSuccess.html";
    } else {
      // Handle error response
      console.error("Error creating account");
    }
  })
  .catch(error => {
    console.error("Request failed:", error);
  });
});