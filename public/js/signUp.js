document.getElementById("createAccountForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the values from the input fields
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.getElementById("passworderror");
  const emailerror = document.getElementById("emailerror");
  const existerror = document.getElementById("existerror");

  // Regular expression pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate the email format
  if (!emailRegex.test(email)) {
    emailerror.textContent = 'Invalid email format';
    emailerror.style.display = 'block';
  } else {
    emailerror.style.display = 'none';
  }

    // Check if email already exists
    // if (result.exists) {
    //   existerror.textContent = 'Email address already exists';
    //   existerror.style.display = 'block';
    // } else {
    //   existerror.style.display = 'none';
    // }
  

  // Validate the form input
  if (password !== confirmPassword) {
    passwordError.textContent = 'Passwords do not match';
    passwordError.style.display = 'block';
  } else {
    passwordError.style.display = 'none';
  }

  // Check if there are any errors
  if (emailerror.style.display === 'block' || passwordError.style.display === 'block') {
    return; // Exit the function if there are errors
  }

  // Create an object to hold the data
  const data = {
    email: email,
    password: password
  };

  // Send an HTTP request to check email existence
  fetch("/check-email-existence", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error checking email existence');
      }
      return response.json();
    })
    .then(result => {
      console.log('existerror.style.display:', existerror.style.display);
      if (result.exists) {
        // Email already exists
        console.log('Email address already exists');
        existerror.textContent = 'Email address already exists';
        existerror.style.display = 'block';
      } else {
        // Email does not exist, proceed with account creation
        existerror.style.display = 'none';

        // Send an HTTP request to create the account
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
      }
    })
    .catch(error => {
      console.error("Error checking email existence:", error);
      // Handle the error appropriately, such as displaying an error message to the user
    });
});