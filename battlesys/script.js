var computerTeam = [];
var playerTeam = [];
var activePlayerPokemon;
var activeComputerPokemon;
var numActiveCompPokemon = 6;
var numActivePlayerPokemon = 6;
var critMultiplier = 0.25;

function randomPokemon(teamName) {
    var pokeID = Math.ceil(Math.random() * 151);
    var queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeID}/`
    var isShiny = (1 == Math.ceil(Math.random() * 8192));
    var frontSpriteUrl;
    var backSpriteUrl;

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
        teamName.push(pokeData);
    });
};

function generateTeam(team) {
    for (var i = 0; i < 6; i++) {
        randomPokemon(team);
    }
};

function attackOpponent(attacker, defender) {
    if ((attacker.status == "fainted")||(defender.status == "fainted")) {
        console.log(`This Pokemon is unable to continue battling! Please switch to another Pokemon!`);
        return;
    }

    // Checks if the attack is a critical hit (6.25% chance)
    let isCrit = (0.0625 > Math.random());
    if (isCrit) {
        console.log(`Critical!`)
    }

    // Total damage has a +/- 15% variability
    let damage = Math.round((attacker.attack + (attacker.attack*critMultiplier*isCrit) - defender.defense) * ((Math.random() * 0.30) + 0.85));
    if (damage <= 0) {
        damage = 1;
    }

    defender.hpCurrent -= damage;
    if (defender.hpCurrent <= 0) {
        defender.hpCurrent = 0;
        defender.status = "fainted"
        console.log(`${defender.name} took ${damage} damage! It has ${defender.status}!`);
        if (defender == activeComputerPokemon) {
            if (numActiveComputerPokemon > 0) {
                numActiveCompPokemon--;
                switchCompActivePokemon(computerTeam, Math.floor(Math.random()*6), activeComputerPokemon);
            } else {
                console.log(`Computer has no usable Pokemon! You Win!`);
            }
        } else {
            numActivePlayerPokemon--;
            if (numActivePlayerPokemon <= 0) {
                console.log(`You have no active Pokemon left! You Lose!`);
            } else {
                console.log(`Please switch to your next Pokemon`);
            }
        }
    } else {
        console.log(`${defender.name} took ${damage} damage! HP: ${defender.hpCurrent}/${defender.hp}`);
        if (defender == activeComputerPokemon) {
            attackOpponent(defender, attacker);
        }
    }
}

function switchCompActivePokemon(team, pokemonIdx, activePokemon) {
    if (team[pokemonIdx].status != "fainted") {
        activeComputerPokemon = team[pokemonIdx];
        console.log(`${activeComputerPokemon.name} was switched out!`)
    } else {
        pokemonIdx = Math.floor(Math.random() * 5)
        switchCompActivePokemon(team, pokemonIdx, activePokemon);
    }
}

function switchPlayerActivePokemon(pokemonIdx) {
    if (numActivePlayerPokemon <= 0) {
        console.log(`You don't have any usable Pokemon!`)
    } else if (playerTeam[pokemonIdx].status != "fainted") {
        activePlayerPokemon = playerTeam[pokemonIdx];
        console.log(`${activePlayerPokemon.name} was switched out!`)
    } else {
        console.log(`Cannot switch! This Pokemon has fainted!`)
    }
}

generateTeam(playerTeam);
generateTeam(computerTeam);
console.log("Player Team:", playerTeam);
console.log("Opponent Team:", computerTeam);

$("#startGame").click(function () {
    
    // Get that landing page outta here
    $("#landingPage").addClass("slideOut");
    $("#pkBallCircleBack").addClass("slideOutBottom");
    $("#startGame").addClass("slideOutBottom");
    setTimeout(function () {
        $("#landingPage").css("display", "none");
        activePlayerPokemon = playerTeam[0];
        activeComputerPokemon = computerTeam[0];
    }, 700)
})