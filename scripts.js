function makeShiny(name, location, button) {
    var buttonToCheck = document.getElementById(button);
    var shinyUrl = 'https://img.pokemondb.net/sprites/x-y/shiny/' + name + '.png';
    var normalUrl = 'https://img.pokemondb.net/sprites/x-y/normal/' + name + '.png';
    if (buttonToCheck.checked == true) {
        document.getElementById(location).src = shinyUrl;
    } else {
        document.getElementById(location).src = normalUrl;
    }
}

function makeShinyGen8(name, location, button) {
    var buttonToCheck = document.getElementById(button);
    var shinyUrl = 'https://img.pokemondb.net/sprites/sun-moon/shiny/' + name + '.png';
    var normalUrl = 'https://img.pokemondb.net/sprites/sun-moon/normal/' + name + '.png';
    if (buttonToCheck.checked == true) {
        document.getElementById(location).src = shinyUrl;
    } else {
        document.getElementById(location).src = normalUrl;
    }
}

function makeCaught(dexNum, caughtButton) {
    var buttonToCheck = document.getElementById(caughtButton);
    if (buttonToCheck.checked == true) {
        document.getElementById(dexNum).style.backgroundColor = "yellow";
    } else {
        document.getElementById(dexNum).style.backgroundColor = "white";
    }
}
