var computerTeam = [];
var playerTeam = [];
var activePlayerPokemon;
var activeComputerPokemon;
const genericCarouselID = "playerPkmn";
var numActiveComputerPokemon = 6;
var numActivePlayerPokemon = 6;
var audioStart = document.createElement("audio");
audioStart.setAttribute("src", "assets/musictones/101-opening.mp3");

function randomPokemon(teamName) {
    let pokeID = Math.ceil(Math.random() * 649);
    let queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`
    let isShiny = (1 == Math.ceil(Math.random() * 8192));
    let frontSpriteUrl;
    let backSpriteUrl;

    $.get(queryURL).then(function (response) {
        // Totally unnecessary but now we can have shinies in battle
        if (isShiny && response.sprites.back_shiny && response.sprites.front_shiny) {
            frontSpriteUrl = response.sprites.front_shiny
            backSpriteUrl = response.sprites.back_shiny
            console.log("We have a shiny!");
        } else {
            frontSpriteUrl = response.sprites.front_default
            backSpriteUrl = response.sprites.back_default
        }

        let pkmnName = response.name;
        let pkmnHP = calcHP(response.stats[5].base_stat);
        let pkmnAtk = calcStat(response.stats[4].base_stat);
        let pkmnDef = calcStat(response.stats[3].base_stat);
        let pkmnSpAtk = calcStat(response.stats[2].base_stat);
        let pkmnSpDef = calcStat(response.stats[1].base_stat);

        var pokeData = {
            name: pkmnName[0].toUpperCase() + pkmnName.slice(1),
            hp: pkmnHP,
            hpCurrent: pkmnHP,
            attack: pkmnAtk,
            defense: pkmnDef,
            attackSp: pkmnSpAtk,
            defenseSp: pkmnSpDef,
            status: "ready",
            spriteFront: frontSpriteUrl,
            spriteBack: backSpriteUrl
        }
        teamName.push(pokeData);
    });
};

function generateTeam(team) {
    var waitPromise = []
    for (var i = 0; i < 6; i++) {
        waitPromise[i] = randomPokemon(team);
    }
    return Promise.all(waitPromise);
};

function calcHP(baseHP) {
    let newHP = (((baseHP * 2) + (Math.sqrt(125) / 4)) / 2) + 50 + 10
    return Math.round(newHP)
}

function calcStat(baseStat) {
    let newStat = (((baseStat * 2) + (Math.sqrt(125) / 4)) / 2) + 5
    return Math.round(newStat)
}

generateTeam(playerTeam);
generateTeam(computerTeam);

generateTeam(playerTeam).then(generateTeam(computerTeam).then(function () {

    $("#startGame").removeClass("disabled");
    $("#startGame").text("Start Game!");
    $("#startGame").click(function () {
      audioStart.play();
        
        // Set background image equal to pokeball sprite from API call
        // $.ajax({
        //     url: "https://pokeapi.co/api/v2/item/poke-ball/",
        //     method: "GET"
        // }).then(function(response) {
        //     var bgImage = response.sprites.default;
        //     $("body").css('background-image', `url( ${bgImage} )` );
        // });


        // Get that landing page outta here
        $("#landingPage").addClass("slideOut");
        $("#pkBallCircleBack").addClass("slideOutBottom");
        $("#startGame").addClass("slideOutBottom");
        

        setTimeout(function () {
            $('.carousel').carousel();
            $.each($(".carousel-item"), function (i) {
                let carouselID = '#' + genericCarouselID + i;
                $(carouselID).attr("src", playerTeam[i].spriteFront);
            })


            // Show the first Pokemon selection and displays their stats under the Carousel
            $("#landingPage").css("display", "none");
            $("#teamSelection").css("visibility", "visible").addClass("fadeIn");
            activePlayerPokemon = playerTeam[0];
            activeComputerPokemon = computerTeam[0];
            $('.card-content').html(`
            <span class="card-title">${activePlayerPokemon.name}</span>
            <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
            <p>ATK: ${activePlayerPokemon.attack}</p>
            <p>DEF: ${activePlayerPokemon.defense}</p>
            <p>SP. ATK: ${activePlayerPokemon.attackSp}</p>
            <p>SP. DEF: ${activePlayerPokemon.defenseSp}</p>
            `);
        }, 700);
    })
}));
