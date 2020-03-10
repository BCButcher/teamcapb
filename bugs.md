
# Bug #01
Carousel was not updating info properly for touch events or mouseclicks

Fix: 

## Commented out below:
// $("#playerCarousel").mousedown(function () {
//   updateCurrentCarouselInfo(600);
// });

$("#playerCarousel").mouseup(function () {
  updateCurrentCarouselInfo(1000);
});

## Added below:
$("#playerCarousel").on("touchend", function () {
  updateCurrentCarouselInfo(1000);
});


<!-- # Bug #02  -->

