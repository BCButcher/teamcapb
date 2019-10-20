var critMultiplier = 0.25;
var allowPlayerInput = true;

function attackOpponent(attacker, defender, type) {
    if ((attacker.status == "fainted") || (defender.status == "fainted")) {
        console.log(`This Pokemon is unable to continue battling! Please switch to another Pokemon!`);
        return;
    }

    // Checks if the attack is a critical hit (6.25% chance)
    let isCrit = (0.0625 > Math.random());
    if (isCrit) {
        console.log(`Critical!`)
    }
    let damage = 0;
    // Total damage has a +/- 15% variability
    if (type == "normal") {
        damage = Math.round((attacker.attack + (attacker.attack * critMultiplier * isCrit) - defender.defense) * ((Math.random() * 0.30) + 0.85));
    } else {
        damage = Math.round((attacker.attackSp + (attacker.attackSp * critMultiplier * isCrit) - defender.defenseSp) * ((Math.random() * 0.30) + 0.85));
    }

    if (damage <= 0) {
        damage = 1;
    }

    defender.hpCurrent -= damage;
    if (defender.hpCurrent <= 0) {
        defender.hpCurrent = 0;
        defender.status = "fainted"
        damageToaster(defender.name, damage)
        if (defender == activeComputerPokemon) {
            $("#compHP").text(`${defender.hpCurrent}/${defender.hp}`);
            $("#compHPbar").css("width", `${Math.round(defender.hpCurrent / defender.hp * 100)}%`)
            numActiveComputerPokemon--;
            if (numActiveComputerPokemon > 0) {
                setTimeout(function() {
                    switchCompActivePokemon(computerTeam, Math.floor(Math.random() * 6), activeComputerPokemon);
                    allowPlayerInput = true;
                    $('#attackBtn').removeClass('disabled');
                    $('#specialBtn').removeClass('disabled');
                    $('#switchBtn').removeClass('disabled');
                    $('#runBtn').removeClass('disabled');
                    $('#playerSpriteImg').removeClass('playerAttack');
                }, 1000);
                return;
            } else {
                playerWinToaster()
                return;
            }
        } else {
            numActivePlayerPokemon--;
            $(".carousel > .active").addClass("pkmnFainted");
            refreshCarousel();
            allowPlayerInput = true;
            $('#attackBtn').removeClass('disabled');
            $('#specialBtn').removeClass('disabled');
            $('#switchBtn').removeClass('disabled');
            $('#runBtn').removeClass('disabled');
        }
    }

    if (defender == activeComputerPokemon) {
        damageToaster(defender.name, damage);
        let chooseAttack = Math.round(Math.random());
        let attackType = "normal";
        if (chooseAttack) {
            attackType = "special";
        }
        
        $("#compHP").text(`${defender.hpCurrent}/${defender.hp}`);
        $("#compHPbar").css("width", `${Math.round(defender.hpCurrent / defender.hp * 100)}%`)
        setTimeout(function() {
            $('#playerSpriteImg').removeClass('playerAttack');
            $('#compSpriteImg').addClass('computerAttack');
            console.log(attackType);
            attackOpponent(defender, attacker, attackType);
        }, 1000)
    } else if (defender == activePlayerPokemon) {
        damageToaster(defender.name, damage);

        $("#playerHP").text(`${defender.hpCurrent}/${defender.hp}`);
        $("#playerHPbar").css("width", `${Math.round(defender.hpCurrent / defender.hp * 100)}%`)
        setTimeout(function() {
            allowPlayerInput = true;
            $('#attackBtn').removeClass('disabled');
            $('#specialBtn').removeClass('disabled');
            $('#switchBtn').removeClass('disabled');
            $('#runBtn').removeClass('disabled');
            $('#compSpriteImg').removeClass('computerAttack');
        }, 1000);
    }
}

function damageToaster(target, damage) {
    toastr.info(`${target} took ${damage} damage!`);
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}

function playerWinToaster() {
    toastr.info(`You won!`);
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}

function faintedToaster() {
    toastr.info(`This Pokemon is unable to battle!`);
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}

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
    } else {
        activePlayerPokemon = playerTeam[pokemonIdx];
        setActivePlayerPokemonInfo(activePlayerPokemon);
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
    <p>SP. ATK: ${activePlayerPokemon.attackSp}</p>
    <p>SP. DEF: ${activePlayerPokemon.defenseSp}</p>
    `);
}

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
        <p>SP. ATK: ${activePlayerPokemon.attackSp}</p>
        <p>SP. DEF: ${activePlayerPokemon.defenseSp}</p>
        `);
    }, 1000)
})

$('#pokemonSelectBtn').click(function () {
    if (activePlayerPokemon.status == "fainted") {
        faintedToaster();
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
        setTimeout(function () {
            $("#playerSpriteImg").removeClass("slideInFromLeft");
            $("#compSpriteImg").removeClass("slideInFromRight");
        }, 700)
    }, 700)

})

$('#attackBtn').on('click', function () {
    if (allowPlayerInput) {
        allowPlayerInput = false;
        $('#attackBtn').addClass('disabled');
        $('#specialBtn').addClass('disabled');
        $('#switchBtn').addClass('disabled');
        $('#runBtn').addClass('disabled');
        $('#playerSpriteImg').addClass('playerAttack');
        attackOpponent(activePlayerPokemon, activeComputerPokemon, "normal");
    }
})

$('#specialBtn').on('click', function () {
    if (allowPlayerInput) {
        allowPlayerInput = false;
        $('#attackBtn').addClass('disabled');
        $('#specialBtn').addClass('disabled');
        $('#switchBtn').addClass('disabled');
        $('#runBtn').addClass('disabled');
        $('#playerSpriteImg').addClass('playerAttack');
        attackOpponent(activePlayerPokemon, activeComputerPokemon, "special");
    }
})

$('#switchBtn').on('click', function () {
    if (allowPlayerInput) {
        refreshCarousel();
    }
})
