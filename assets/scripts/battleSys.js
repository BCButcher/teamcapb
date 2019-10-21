var critMultiplier = 0.25;
var allowPlayerInput = true;
var audioAttack = document.createElement("audio");
audioAttack.setAttribute("src", "assets/musictones/Barrage_1hit.mp3");
var audioBattle = document.createElement("audio");
audioBattle.setAttribute("src", "assets/musictones/115-battlevstrainer.mp3");
var audioEnd = document.createElement("audio");
audioEnd.setAttribute("src", "assets/musictones/145-ending.mp3");


// Primary attack function. Takes the attacking Pokemon, defending Pokemon, and the attack type
function attackOpponent(attacker, defender, type) {
  if (attacker.status == "fainted" || defender.status == "fainted") {
    console.log(
      `This Pokemon is unable to continue battling! Please switch to another Pokemon!`
    );
    return;
  }

  // Checks if the attack is a critical hit (6.25% chance)
  let isCrit = 0.0625 > Math.random();
  let damage = 0;
  // Total damage has a +/- 15% variability by making total damage random from 85% to 115%
  if (type == "normal") {
    damage = Math.round(
      (attacker.attack +
        attacker.attack * critMultiplier * isCrit -
        defender.defense) *
        (Math.random() * 0.3 + 0.85)
    );
  } else {
    damage = Math.round(
      (attacker.attackSp +
        attacker.attackSp * critMultiplier * isCrit -
        defender.defenseSp) *
        (Math.random() * 0.3 + 0.85)
    );
  }

  if (damage <= 0) {
    damage = 1;
  }

  defender.hpCurrent -= damage;

  // If the defending Pokemon faints, switch to a new Pokemon if available
  if (defender.hpCurrent <= 0) {
    defender.hpCurrent = 0;
    defender.status = "fainted";
    damageToaster(defender.name, damage);
    if (defender == activeComputerPokemon) {
      $("#compHP").text(`${defender.hpCurrent}/${defender.hp}`);
      $("#compHPbar").css(
        "width",
        `${Math.round((defender.hpCurrent / defender.hp) * 100)}%`
      );
      numActiveComputerPokemon--;
      if (numActiveComputerPokemon > 0) {
        setTimeout(function() {
          $("#compSpriteImg").addClass("slideDownFaint");
          setTimeout(function() {
            switchCompActivePokemon(computerTeam,
              Math.floor(Math.random() * 6),
              activeComputerPokemon
            );
            allowPlayerInput = true;
            $("#attackBtn").removeClass("disabled");
            $("#specialBtn").removeClass("disabled");
            $("#switchBtn").removeClass("disabled");
            $("#runBtn").removeClass("disabled");
            $("#playerSpriteImg").removeClass("playerAttack");
            $("#playerSpriteImg").addClass("idleBob");
          }, 1000);
        }, 1000);
        return;
      } else {
        playerWinToaster();
        setTimeout(function() {
            $("#battleContainer").addClass("hide");
            $("#endScreen").removeClass("hide");
        }, 2000);
        audioBattle.pause();
        audioEnd.play();       

        return;
      }
    } else {
        numActivePlayerPokemon--;
        if (numActivePlayerPokemon <= 0){
            setTimeout(function() {
                $("#battleContainer").addClass("hide");
                $("#endScreen").removeClass("hide");
            }, 2000);
            audioBattle.pause();
            audioEnd.play();
        }
      setTimeout(function() {
        $(".carousel > .active").addClass("pkmnFainted");
        allowPlayerInput = true;
        $("#attackBtn").removeClass("disabled");
        $("#specialBtn").removeClass("disabled");
        $("#switchBtn").removeClass("disabled");
        $("#runBtn").removeClass("disabled");
        $("#playerSpriteImg").addClass("slideDownFaint");
        setTimeout(function() {
          refreshCarousel();
        }, 700);
      }, 1000);
    }
  }

  // If the defending Pokemon is the computer's randomly choose a normal or special attack and counter
  if (defender == activeComputerPokemon) {
    damageToaster(defender.name, damage);
    let chooseAttack = Math.round(Math.random());
    let attackType = "normal";

    if (chooseAttack) {
      attackType = "special";
    }

    $("#compHP").text(`${defender.hpCurrent}/${defender.hp}`);
    $("#compHPbar").css(
      "width",
      `${Math.round((defender.hpCurrent / defender.hp) * 100)}%`
    );
    setTimeout(function() {
      $("#playerSpriteImg").removeClass("playerAttack");
      $("#compSpriteImg").addClass("computerAttack");
      attackOpponent(defender, attacker, attackType);
      audioAttack.play();
    }, 1000);

    // Otherwise if the defender is the player's Pokemon, reenable input after taking damage
  } else if (defender == activePlayerPokemon) {
    damageToaster(defender.name, damage);

    $("#playerHP").text(`${defender.hpCurrent}/${defender.hp}`);
    $("#playerHPbar").css(
      "width",
      `${Math.round((defender.hpCurrent / defender.hp) * 100)}%`
    );
    setTimeout(function() {
      allowPlayerInput = true;
      $("#attackBtn").removeClass("disabled");
      $("#specialBtn").removeClass("disabled");
      $("#switchBtn").removeClass("disabled");
      $("#runBtn").removeClass("disabled");
      $("#compSpriteImg").removeClass("computerAttack");
      $("#playerSpriteImg").addClass("idleBob");
    }, 1000);
  }
}

// Switch the computer's Pokemon if their active Pokemon faints, but only if the one chosen is usable
function switchCompActivePokemon(team, pokemonIdx, activePokemon) {
  if (numActiveComputerPokemon == 1) {
    activeComputerPokemon = computerTeam.find(obj => obj.status === "ready");
    setActiveComputerPokemonInfo(activeComputerPokemon);
    return;
  }
  if (team[pokemonIdx].status != "fainted") {
    activeComputerPokemon = team[pokemonIdx];
    setActiveComputerPokemonInfo(activeComputerPokemon);
  } else {
    pokemonIdx = Math.floor(Math.random() * 5);
    switchCompActivePokemon(team, pokemonIdx, activePokemon);
  }
}

// Switch the active Pokemon to the player's selection
function switchPlayerActivePokemon(pokemonIdx) {
  if (numActivePlayerPokemon <= 0) {
  } else {
    activePlayerPokemon = playerTeam[pokemonIdx];
    setActivePlayerPokemonInfo(activePlayerPokemon);
  }
}

// Set the active player's Pokemon info, even if it's unusable
function setActivePlayerPokemonInfo(pokemonInfo) {
  $("#playerPkmnName").text(pokemonInfo.name);
  $("#playerHP").text(`${pokemonInfo.hpCurrent}/${pokemonInfo.hp}`);
  $("#playerSpriteImg").attr("src", pokemonInfo.spriteBack);
  $("#playerHPbar").css(
    "width",
    `${Math.round((pokemonInfo.hpCurrent / pokemonInfo.hp) * 100)}%`
    );
}

// Set the active computer's Pokemon info
function setActiveComputerPokemonInfo(pokemonInfo) {
  $("#compPkmnName").text(pokemonInfo.name);
  $("#compHP").text(`${pokemonInfo.hpCurrent}/${pokemonInfo.hp}`);
  $("#compSpriteImg").attr("src", pokemonInfo.spriteFront);
  $("#compHPbar").css(
    "width",
    `${Math.round((pokemonInfo.hpCurrent / pokemonInfo.hp) * 100)}%`
  );
  $('#compSpriteImg').removeClass('slideDownFaint').addClass('slideInFromRight');
    setTimeout(function () {
        $('#compSpriteImg').removeClass('slideInFromRight');
    }, 1500)
}

// Show the carousel again when called in battle
function refreshCarousel() {
  $("#teamSelection")
    .removeClass("hide slideOut")
    .addClass("fadeIn");
  $("#battleContainer").addClass("hide");
  $('#carouselActiveName').text(`${activePlayerPokemon.name}`);
  $(".card-content").html(`
    <p id="flavorText">"${activePlayerPokemon.flavorText}"</p>
    <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
    <p>ATK: ${activePlayerPokemon.attack}</p>
    <p>DEF: ${activePlayerPokemon.defense}</p>
    <p>SP. ATK: ${activePlayerPokemon.attackSp}</p>
    <p>SP. DEF: ${activePlayerPokemon.defenseSp}</p>
    `);
}

// Wait for a delay, then call the update
function updateCurrentCarouselInfo(delay) {
  setTimeout(function() {
    let currentCarousel = $(".carousel > .active");
    let carouselIndex = $(".carousel-item").index(currentCarousel);
    switchPlayerActivePokemon(carouselIndex);
    $('#carouselActiveName').text(`${activePlayerPokemon.name}`);
    $(".card-content").html(`
        <p id="flavorText">"${activePlayerPokemon.flavorText}"</p>
        <p>HP: ${activePlayerPokemon.hpCurrent}/${activePlayerPokemon.hp}</p>
        <p>ATK: ${activePlayerPokemon.attack}</p>
        <p>DEF: ${activePlayerPokemon.defense}</p>
        <p>SP. ATK: ${activePlayerPokemon.attackSp}</p>
        <p>SP. DEF: ${activePlayerPokemon.defenseSp}</p>
        `);
  }, delay);
}

// set ActivePlayerPokemon to be equal to carousel-item active when the mouse is held down or when mouse is released
$("#playerCarousel").mousedown(function() {
  updateCurrentCarouselInfo(1000);
});

$("#playerCarousel").mouseup(function() {
  updateCurrentCarouselInfo(600);
});

// Select the Pokemon for battle if they're usable
$("#pokemonSelectBtn").click(function() {
  if (activePlayerPokemon.status == "fainted") {
    faintedToaster();
    return;
  }

  $("#teamSelection")
    .removeClass("fadeIn")
    .addClass("slideOut");
  setActivePlayerPokemonInfo(activePlayerPokemon);
  setActiveComputerPokemonInfo(activeComputerPokemon);
  audioStart.pause();

  setTimeout(function() {
    $("#teamSelection").addClass("hide");
    $("#battleContainer").removeClass("hide");
    $("#playerSpriteImg").removeClass('slideDownFaint').addClass("slideInFromLeft");
    
    setTimeout(function() {
      audioBattle.play();
      $("#playerSpriteImg")
        .removeClass("slideInFromLeft")
        .addClass("idleBob");
    }, 700);
  }, 700);
});

$("#attackBtn").on("click", function() {
  if (allowPlayerInput) {
    allowPlayerInput = false;
    $("#attackBtn").addClass("disabled");
    $("#specialBtn").addClass("disabled");
    $("#switchBtn").addClass("disabled");
    $("#runBtn").addClass("disabled");
    $("#playerSpriteImg").removeClass("idleBob");
    setTimeout(function () {
      $("#playerSpriteImg").addClass("playerAttack");
    }, 100);
    attackOpponent(activePlayerPokemon, activeComputerPokemon, "normal");
    audioAttack.play();
  }
});

$("#specialBtn").on("click", function() {
  if (allowPlayerInput) {
    allowPlayerInput = false;
    $("#attackBtn").addClass("disabled");
    $("#specialBtn").addClass("disabled");
    $("#switchBtn").addClass("disabled");
    $("#runBtn").addClass("disabled");
    $("#playerSpriteImg").removeClass("idleBob");
    setTimeout(function () {
      $("#playerSpriteImg").addClass("playerAttack");
    }, 100);
    attackOpponent(activePlayerPokemon, activeComputerPokemon, "special");
  }
});

$("#switchBtn").on("click", function() {
  if (allowPlayerInput) {
    $("#playerSpriteImg").removeClass("idleBob");
    refreshCarousel();
  }
});

// Toasters
function damageToaster(target, damage) {
    toastr.info(`${target} took ${damage} damage!`);
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-center",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "300",
      timeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  }
  
  function playerWinToaster() {
    toastr.info(`You won!`);
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-center",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "300",
      timeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  }
  
  function faintedToaster() {
    toastr.info(`This Pokemon is unable to battle!`);
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: "toast-top-center",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "300",
      timeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  }
  