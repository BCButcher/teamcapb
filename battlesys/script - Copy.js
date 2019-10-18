var computerTeam = [];
var playerTeam = [];

function randomPokemon(teamName) {
    var pokeID = Math.ceil(Math.random() * 151);
    var queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`
    var pokeData;

    $.get(queryURL).then(function (response) {
        pokeData = {
            name: response.name,
            hp: response.stats[5].base_stat,
            hpCurrent: response.stats[5].base_stat,
            attack: response.stats[4].base_stat,
            defense: response.stats[3].base_stat,
            status: "ready",
            spriteFront: response.sprites.front_default,
            spriteBack: response.sprites.back_default
        }
        teamName.push(pokeData);
    });
};

function generateTeam(team) {
    for (var i = 0; i < 6; i++) {
        randomPokemon(team);
    }
};

generateTeam(playerTeam);
generateTeam(computerTeam);
console.log("Player Team:", playerTeam);
console.log("Opponent Team:", computerTeam);

var computerTeam = [];
var playerTeam = [];

// Chooses a random Pokemon from the API, and creates an object with relevant data
function randomPokemon(teamName) {
    var pokeID = Math.ceil(Math.random() * 151);
    var queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`
    var isShiny = (1 == Math.ceil(Math.random() * 8192));
    var frontSpriteUrl;
    var backSpriteUrl;
    
    return new Promise( function(resolve,reject) {
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
            
            var pokeData = {
                name: response.name,
                hp: response.stats[5].base_stat,
                hpCurrent: response.stats[5].base_stat,
                attack: response.stats[4].base_stat,
                defense: response.stats[3].base_stat,
                status: "ready",
                spriteFront: frontSpriteUrl,
                spriteBack: backSpriteUrl
            }
            // Writes the object to the passed array "teamName"
            resolve();
            teamName.push(pokeData);
        
        });
    });
};

// PROMISE
// ASYNC
// GENERATOR


// Iterate through this loop until there are 6 pokemon in the array "team"
function generateTeam(team) {
    // create a promise so that we only continue when we have the actual result 
    // from the API call
    var waitPromise = [];   
    for (var i = 0; i < 6; i++) {
        waitPromise[i] = randomPokemon(team);
    }

    return Promise.all(waitPromise);
};

// function selectActive()

// Creates two teams after the document is ready
// $('document').ready(function () {

    generateTeam(playerTeam).then( function(){
        // now deal with playerTeam stuff
        console.log( `Player Team 0: ${playerTeam[0].name}`, playerTeam );
    });
    
    generateTeam(computerTeam).then( function(){
        // deal with computerTeam ONLY when it's ready
        console.log( `Computer team 0: ${computerTeam[0].name}`, computerTeam );

    })
    
    // console.log(computerTeam[0]);
   // console.log(activeComputerPokemon);
// });
