// jQuery

$(document).ready(function(){


    $('.carousel').carousel();

    var queryURL = "https://pokeapi.co/api/v2/pokemon/charizard";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(response.name);
        console.log(response.stats[3]);
        console.log(response.stats[3].stat.name);
        console.log(response.sprites.front_default);
        console.log(response.sprites.back_default);
        $("#charizardPic").attr("src", response.sprites.back_default);
        $(".testSpriteImg").attr("src", response.sprites.back_default);
    });
     // Function generate team


    // Set background image equal to pokeball sprite from API call
    $.ajax({
        url: "https://pokeapi.co/api/v2/item/poke-ball/",
        method: "GET"
    }).then(function(response) {
        var bgImage = response.sprites.default;
        $("body").css('background-image', `url( ${bgImage} )` );
    });

});

