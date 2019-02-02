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

// function changeTypeColor() {
//     var allShinyCheckBoxes = document.getElementsByClassName("shinyBox");
//     var numOfShinyCheckboxes = document.getElementsByClassName("shinyBox").length;
//     console.log(allShinyCheckBoxes[3]);
//     for ( var i = 0; i < numOfShinyCheckboxes; i++) {
//         if (allShinyCheckBoxes[i] = "Fire") {
//             document.getElementById(allShinyCheckBoxes[i]).style.backgroundColor = "yellow";
//         } 
//         }
// }

document.addEventListener("DOMContentLoaded", function() {
    var i;
    var allShinyCheckBoxes = document.getElementsByClassName("shinyBox");
    var numOfShinyCheckboxes = document.getElementsByClassName("shinyBox").length;
    console.log(numOfShinyCheckboxes);
    for (i = 0; i < numOfShinyCheckboxes; i++) {    
        if (allShinyCheckBoxes[i] == "Fire") {
            console.log("i equals fire at posiiton " + i);
            //console.log(allShinyCheckBoxes[i]);
            document.getElementById(allShinyCheckBoxes[i]).style.backgroundColor = "yellow";
        } 
    }
    document.getElementById(allShinyCheckBoxes[3]).style.backgroundColor = "yellow";
});