


document.addEventListener("DOMContentLoaded", function() {
    var carousel = document.querySelector("#carouselExampleIndicators");
    var carouselItems = carousel.querySelectorAll(".carousel-item");
    var carouselControls = carousel.querySelectorAll(".carousel-control-prev, .carousel-control-next");
    var carouselIndicators = carousel.querySelector(".carousel-indicators");
  
    if (carouselItems.length <= 1) {
      carouselControls.forEach(function(control) {
        control.style.display = "none";
      });
  
      carouselIndicators.style.display = "none";
    } else {
      carouselControls.forEach(function(control) {
        control.style.display = "block";
      });
  
      carouselIndicators.style.display = "flex";
    }
  });