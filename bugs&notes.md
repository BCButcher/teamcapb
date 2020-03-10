Major bugs may get a number and be listed here, smaller updates may be pointed out under Changelog

# Bug #01
Carousel was not updating info properly for touch events or mouseclicks

# Bug #01 a 

Click's + taps inside #playerCarousel cause erratic movement of carousel items

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

Changed delay to 1500, still not getting reliable carousel info updates but is improved

# Bug #02 

Enemy pkmn sprite overlaps player pkmn sprite during player attack


Changelog

Mar 10
Changed battlebuttons to flexbox, space evenly, and small margin. Also made run button match width of special attack button for nice even looking display

Mar 10
Updated pokemon battle sprite sizes - Previously much too large - Still work to do on responsive sizing and positioning

Mar 10
Formatted carousel info box display center and justify content center. Created stat-box wrapper and set min-width of 80px and 10px padding left

Mar 10
Restart button after losing or winning not working - fixed by changing link on button from /onClick="reload"/ to /onClick="window.location.reload();/