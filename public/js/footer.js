

// Function to generate and insert the footer
function generateFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('mt-5', 'py-5');
  
    const container = document.createElement('div');
    container.classList.add('row', 'container', 'mx-auto', 'pt-5');
  
    // Footer content - replace with your desired footer content
    const content = `
    <div class="row container mx-auto pt-5">
            <div class="footer-one col-lg-4 col-md-6 col-12 mb-3">
                <img class="footer-img" src="../asset/logo-three/white.png" alt="">
                <p>We strive to create a community where technology enthusiasts, programmers, and Apple enthusiasts can
                    come together to share knowledge, exchange ideas, and stay updated on the latest trends in the tech
                    world. We believe that fostering this sense of community will spur innovation, collaboration, and
                    personal growth for all our customers.</p>
            </div>
    <div class="footer-one col-lg-4 col-md-6 col-12 mb-3">
    <h5 class="pb-2">Featured</h5>
    <ul class="text-uppercase list-unstyled">
        <li><a href="./product.html">Mobile</a></li>
        <li><a href="./phonecase.html">Phone Case</a></li>
        <li><a href="./aboutus.html">About Us</a></li>
    </ul>
</div>
<div class="footer-one col-lg-4 col-md-6 col-12 mb-3">
    <h5 class="pb-2">Contact Us</h5>
    <div>
        <h6 class="text-uppercase">Address</h6>
        <p>Suite C-E, 11/F, Golden Sun Centre
            59-67 Bonham Strand West, Sheung Wan, Hong Kong</p>
    </div>
    <div>
        <h6 class="text-uppercase">Phone</h6>
        <p>+852 9725 6400</p>
    </div>
    <div>
        <h6 class="text-uppercase ">Email</h6>
        <a class="teckyemail" href="mailto:hello@tecky.com">
            <p>hello@tecky.com</p>
        </a>
    </div>
</div>
</div>
<div class="copyright mt-5">
<div class="row container mx-auto">
    <div class="col-lg-6 col-md-6 col-12 mb-2">
        <p>© 2023 Tecky Academy Limited. All rights reserved.</p>
    </div>
    <div class="col-lg-6 col-md-6 col-12">
        <a href="#"><i class="fa-brands fa-facebook"></i></a>
        <a href="#"><i class="fa-brands fa-instagram"></i></a>
        <a href="#"><i class="fa-brands fa-twitch"></i></a>
        <a href="#"><i class="fa-brands fa-telegram"></i></a>
        <a href="#"><i class="fa-brands fa-linkedin"></i></a>
    </div>
</div>
    `;
  
    container.innerHTML = content;
    footer.appendChild(container);
  
    // Insert the footer into the HTML
    const body = document.querySelector('body');
    body.appendChild(footer);
  }
  
  // Call the function to generate and insert the footer
  generateFooter();