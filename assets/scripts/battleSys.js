var numActiveCompPokemon = 6;
var numActivePlayerPokemon = 6;
var critMultiplier = 0.25;

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
