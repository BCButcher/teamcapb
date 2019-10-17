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