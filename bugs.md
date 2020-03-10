
# Bug #01
Carousel was not updating info properly for touch events or mouseclicks

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

Changed delay to 1500, still not getting reliable carousel info updates


# Bug #02 

Click's + taps inside #playerCarousel cause erratic movement of carousel items

