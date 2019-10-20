var critMultiplier = 0.25;

function attackOpponent(attacker, defender) {
    if ((attacker.status == "fainted") || (defender.status == "fainted")) {
        console.log(`This Pokemon is unable to continue battling! Please switch to another Pokemon!`);
        return;
    }

    // Checks if the attack is a critical hit (6.25% chance)
    let isCrit = (0.0625 > Math.random());
    if (isCrit) {
        console.log(`Critical!`)
    }

    // Total damage has a +/- 15% variability
    let damage = Math.round((attacker.attack + (attacker.attack * critMultiplier * isCrit) - defender.defense) * ((Math.random() * 0.30) + 0.85));
    if (damage <= 0) {
        damage = 1;
    }

    defender.hpCurrent -= damage;
    if (defender.hpCurrent <= 0) {
        defender.hpCurrent = 0;
        defender.status = "fainted"
        console.log(`${defender.name} took ${damage} damage! It has ${defender.status}!`);
        if (defender == activeComputerPokemon) {
            numActiveComputerPokemon--;
            if (numActiveComputerPokemon > 0) {
                switchCompActivePokemon(computerTeam, Math.floor(Math.random() * 6), activeComputerPokemon);
            } else {
                console.log(`Computer has no usable Pokemon! You Win!`);
            }
        } else {
            numActivePlayerPokemon--;
            $(".carousel > .active").addClass("pkmnFainted");
            refreshCarousel();
        }
    }

    if (defender == activeComputerPokemon) {
        $("#compHP").text(`${defender.hpCurrent}/${defender.hp}`);
        $("#compHPbar").css("width", `${Math.round(defender.hpCurrent / defender.hp * 100)}%`)
        attackOpponent(defender, attacker);
    } else if (defender == activePlayerPokemon) {
        $("#playerHP").text(`${defender.hpCurrent}/${defender.hp}`);
        $("#playerHPbar").css("width", `${Math.round(defender.hpCurrent / defender.hp * 100)}%`)
    }
}

$('#pokemonSelectBtn').click(function () {
    if (activePlayerPokemon.status == "fainted") {
        return;
    }
    $("#teamSelection").removeClass("fadeIn").addClass("slideOut");
    setActivePlayerPokemonInfo(activePlayerPokemon);
    setActiveComputerPokemonInfo(activeComputerPokemon);

    setTimeout(function () {
        $("#teamSelection").addClass("hide");
        $("#battleContainer").removeClass("hide");
        $("#playerSpriteImg").addClass("slideInFromLeft");
        $("#compSpriteImg").addClass("slideInFromRight");
    }, 700)

})

// set ActivePlayerPokemon to be equal to carousel-item active
$('#playerCarousel').mousedown(function () {
    setTimeout(function () {
        let currentCarousel = $(".carousel > .active");
        let carouselIndex = $('.carousel-item').index(currentCarousel);
        switchPlayerActivePokemon(carouselIndex);
        $('.card-content').html(`
        <span class="card-title">${activePlayerPokemon.name}</span>
        <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
        <p>ATK: ${activePlayerPokemon.attack}</p>
        <p>DEF: ${activePlayerPokemon.defense}</p>
        `);
    }, 1000)
})

function switchCompActivePokemon(team, pokemonIdx, activePokemon) {
    if (numActiveComputerPokemon == 1) {
        activeComputerPokemon = computerTeam.find(obj => obj.status === "ready");
        setActiveComputerPokemonInfo(activeComputerPokemon);
        return;
    }
    if (team[pokemonIdx].status != "fainted") {
        activeComputerPokemon = team[pokemonIdx];
        console.log(`${activeComputerPokemon.name} was switched out!`)
        setActiveComputerPokemonInfo(activeComputerPokemon);
    } else {
        pokemonIdx = Math.floor(Math.random() * 5)
        switchCompActivePokemon(team, pokemonIdx, activePokemon);
    }
}

function switchPlayerActivePokemon(pokemonIdx) {
    if (numActivePlayerPokemon <= 0) {
        console.log(`You don't have any usable Pokemon!`)
        // } else if (playerTeam[pokemonIdx].status != "fainted") {
    } else {
        activePlayerPokemon = playerTeam[pokemonIdx];
        setActivePlayerPokemonInfo(activePlayerPokemon);
        // } else {
        //     console.log(`Cannot switch! This Pokemon has fainted!`)
    }
}

function setActivePlayerPokemonInfo(pokemonInfo) {
    $("#playerPkmnName").text(pokemonInfo.name);
    $("#playerHP").text(`${pokemonInfo.hpCurrent}/${pokemonInfo.hp}`);
    $("#playerSpriteImg").attr("src", pokemonInfo.spriteBack);
    $("#playerHPbar").css("width", `${Math.round(pokemonInfo.hpCurrent / pokemonInfo.hp * 100)}%`)
}

function setActiveComputerPokemonInfo(pokemonInfo) {
    $("#compPkmnName").text(pokemonInfo.name);
    $("#compHP").text(`${pokemonInfo.hpCurrent}/${pokemonInfo.hp}`);
    $("#compSpriteImg").attr("src", pokemonInfo.spriteFront);
    $("#compHPbar").css("width", `${Math.round(pokemonInfo.hpCurrent / pokemonInfo.hp * 100)}%`)
}

function refreshCarousel() {
    $("#teamSelection").removeClass("hide slideOut").addClass("fadeIn");
    $("#battleContainer").addClass("hide");
    $('.card-content').html(`
    <span class="card-title">${activePlayerPokemon.name}</span>
    <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
    <p>ATK: ${activePlayerPokemon.attack}</p>
    <p>DEF: ${activePlayerPokemon.defense}</p>
    `);
}

$('#attackBtn').on('click', function () {
    attackOpponent(activePlayerPokemon, activeComputerPokemon);

})

$('#switchBtn').on('click', function () {
    refreshCarousel();
})
