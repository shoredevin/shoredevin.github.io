// Client ID and API key from the Developer Console
const CLIENT_ID = '1031814387459-03essqpn06v2iqa7qhqlvrgk27t70c2q.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAiTPu0gDQqDPL0-LKbSu1Jvw4lcCEdFvE';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const authorizeContainer = document.querySelector('#authorize-container');
const authorizeButton = document.getElementById('authorize_button');
const signoutContainer = document.querySelector('#signout-container');
const signoutButton = document.getElementById('signout_button');

let tableStorage;
let userEmail;
let catchPercent;
let shinyPercent;
let sheetName;
let sheet;
let formPreferences = {};
let rowRowRow;
let USER_ROLE;
let changesMade = false;
let persistPre = false;
let images;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest")
        .then(function() { 
            console.log("GAPI client loaded for API");
            gapi.client.setApiKey(API_KEY);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
            
        },
        function(err) { console.error("Error loading GAPI client for API", err); });


    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
async function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        setTableContents();
        addTimeStamp('f');
    } 
    else {
        document.getElementById('not-signed-in').style.display = "inline-block"
        authorizeContainer.style.display = 'block';
        signoutContainer.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly"});
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    document.getElementById('tableBody').innerHTML = '';
    document.getElementById('content-container').style = 'display:none';
    // document.getElementById('pre').style = 'visibility: hidden';
    document.getElementById('username-container').style.display = 'none';
    document.getElementById('username-container').innerHTML = '';
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('pre');
    pre.innerHTML = '';
    document.getElementById('pre').style = 'background-color: white';
    document.getElementById('pre').style = 'visibility: visible';
    if(message == 403) {
        handleSignoutClick();
        authorizeContainer.style.display = 'block';
        var x = document.createElement('a');
        var t = document.createTextNode('You currently do not have access to this site. To request access click here.')
        x.setAttribute('href', 'javascript:funk()');
        x.appendChild(t);
        pre.appendChild(x);
    } else {
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }
}

async function setTableContents() {
    appendPre('Loading your Pokedex, please wait...');
    userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
    USER_ROLE = await getPermissionId();
    console.log(USER_ROLE);
    if(USER_ROLE == undefined) {
        appendPre(403);
        showSnackBar("You're not authorized")
        return
    }
    document.getElementById('not-signed-in').style.display = "none"
    authorizeContainer.style.display = 'none';
    signoutContainer.style.display = 'block';
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        if  (USER_ROLE == undefined) {
            console.log('undefined user role');
        } else {
            console.log('here is my user role ' + USER_ROLE)
        }
        
        for (var i = 0; i < response.result.values.length; i++) {
            if (response.result.values[i][0] == userEmail) {
                rowRowRow = i;
                sheetName = response.result.values[i][1];
                catchPercent = response.result.values[i][8];
                shinyPercent = response.result.values[i][10];
                if (response.result.values[i][11] != undefined) {
                    formPreferences = JSON.parse(response.result.values[i][11]);
                } 
                userStats = {
                    'email' : userEmail,
                    'catchPercent': catchPercent,
                    'shinyPercent': shinyPercent
                }
                sessionStorage.setItem('userStats', JSON.stringify(userStats));
            };
        };
    }, function(reason) {
        if(reason.result.error.code == 403) {
            appendPre(403);
        } else {
            appendPre('error: ' + reason.result.error.status);
        }
    });
    
    setTimeout(function() {
        sheet = sheetName + '!A:L';
        gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
        range: sheet,
        }).then(function (response) {
            var range = response.result;
            if (range.values.length > 0) {
                console.log(range);
                console.log('(╯°□°)╯︵◓')
                document.getElementById('content-container').style = 'display: block';
                table = document.getElementById('myTable');
                tbdy = document.getElementById('myTable').getElementsByTagName('tbody')[0];
                for (i = 0; i < range.values.length; i++) {
                    var tr = document.createElement('tr');
                    var row = range.values[i];
                    for (var k = 0; k < range.values[i].length; k++) {
                        tr.appendChild(document.createElement('td'));
                        if (k != 1) {
                            if (k == 0) {
                                tr.cells[k].appendChild(document.createTextNode(row[k]+row[k+1]));
                                tr.cells[k].classList.add('pokemonID')
                            } else {
                                tr.cells[k].innerHTML = row[k];
                            }
                            if (k == 3 || k == 4) {
                                var type = row[k].toLowerCase();
                                var typeClass = type + 'Type';
                                tr.cells[k].classList.add(typeClass);
                                if(k == 3) { tr.cells[k].classList.add('type1') }
                                if(k == 4) { tr.cells[k].classList.add('type2') }
                            }
                            if (k == 5) {
                                tr.cells[k].onclick = function () {
                                    console.log(this.innerHTML);
                                    if (this.innerHTML == '<i class="far fa-star"></i>' || this.innerHTML == '<i class="far fa-star" aria-hidden="true"></i>') {
                                        changesMade = true;
                                        this.innerHTML = '<i class="fas fa-star"></i>';
                                        this.parentElement.querySelector('img').classList.remove('grayscale-image');
                                    } else {
                                        let text = this.parentElement.querySelector('.shiny').innerHTML;
                                        let hiddenAbilityText = this.parentElement.querySelector('.hidden-ability').innerHTML;
                                        if (text == '<i class="fas fa-heart"></i>' || text == '<i class="fas fa-heart" aria-hidden="true"></i>') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else if (hiddenAbilityText == '<i class="fas fa-square"></i>' || hiddenAbilityText == '<i class="fas fa-square" aria-hidden="true"></i>') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            this.innerHTML = '<i class="far fa-star"></i>';
                                            this.parentElement.querySelector('.shiny').innerHTML = '<i class="far fa-heart"></i>'; 
                                            this.parentElement.style.color = "black";
                                            if (this.parentElement.querySelector('.form-selector') == null) {
                                                /*
                                                    -- To Do --
                                                    update query function below once class
                                                    has been added to the ID column
                                                    0 - .pokemonID 
                                                */
                                                pokemonNumber = this.parentElement.querySelector('.pokemonID').innerHTML;
                                                console.log(pokemonNumber);
                                            } else {
                                                console.log(this.parentElement.querySelector('.form-selector').value);
                                                pokemonNumber = JSON.parse(this.parentElement.querySelector('.form-selector').value).id;
                                            }
                                            let normalImg = "/images/sprites/" + pokemonNumber + ".gif";
                                            this.parentElement.querySelector('img').src = normalImg;
                                            this.parentElement.querySelector('img').classList.add('grayscale-image');
                                        }
                                    }
                                    saveOnClick(this);
                                };
                            }
                            if (k == 6) {
                                tr.cells[k].onclick = function () {
                                    var pokemonNumber;  
                                    if (this.parentElement.querySelector('form-selector') == null) {
                                        pokemonNumber = this.parentElement.querySelector('.pokemonID').innerHTML;
                                    } else {
                                        pokemonNumber = JSON.parse(this.parentElement.querySelector('.form-selector').value).id;
                                    }
                                    if (this.innerHTML == '<i class="far fa-heart"></i>' || this.innerHTML == '<i class="far fa-heart" aria-hidden="true"></i>') {
                                        let text = this.previousElementSibling.innerHTML;
                                        if (text == '<i class="far fa-star"></i>' || text == '<i class="far fa-star" aria-hidden="true"></i>') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            this.innerHTML = '<i class="fas fa-heart"></i>';
                                            this.parentElement.style.color = 'red';
                                            let shinyUrl = "/images/sprites/" + pokemonNumber + "-s" + ".gif";
                                            console.log(this.parentElement.querySelector('img'));
                                            this.parentElement.querySelector('img').src = shinyUrl;
                                            this.previousElementSibling.innerHTML = '<i class="fas fa-star"></i>' 
                                        }
                                    } else {
                                        changesMade = true;
                                        this.innerHTML = '<i class="far fa-heart"></i>';
                                        this.parentElement.style.color = 'black';
                                        let shinyUrl ="/images/sprites/" + pokemonNumber + ".gif";
                                        this.parentElement.querySelector('img').src = shinyUrl;
                                        let text = this.previousElementSibling.innerHTML;
                                        if (text == '<i class="far fa-star"></i>' || text == '<i class="far fa-star" aria-hidden="true"></i>') {
                                            this.parentElement.querySelector('img').classList.add('grayscale-image');
                                        }
                                    }
                                    saveOnClick(this);
                                };
                            }
                            if (k == 5) {
                                tr.cells[k].classList.add('caught')
                            }
                            if (k == 6) {
                                tr.cells[k].classList.add('shiny')
                            }
                            if (k == 9) {
                                tr.cells[k].contentEditable = 'true';
                                tr.cells[k].style = 'word-wrap: break-word';
                                tr.cells[k].classList.add('notes-field')
                                tr.cells[k].classList.add('notes')
                                tr.cells[k].onkeyup = function () {
                                    happyMappy(this);
                                }
                            }
                            if (k == 8) {
                                tr.cells[k].classList.add('gen')
                            }
                            if (k == 7) {
                                tr.cells[k].classList.add('hidden-ability')
                                tr.cells[k].onclick = function() {
                                    if (this.innerHTML == '<i class="far fa-square"></i>' || this.innerHTML == '<i class="far fa-square" aria-hidden="true"></i>') {
                                        let text = this.parentElement.querySelector('.caught').innerHTML;
                                        if(text == '<i class="far fa-star"></i>' || text == '<i class="far fa-star" aria-hidden="true"></i>') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            this.innerHTML = '<i class="fas fa-square"></i>';
                                        } 
                                    } else {
                                        changesMade = true;
                                        this.innerHTML = '<i class="far fa-square"></i>';
                                    }
                                    saveOnClick(this);
                                }
                            }
                            /*
                                -- TO DO --
                                swap the below if statement to fix form col
                            */
                            if (k == 10) {
                                tr.cells[k].classList.add('other-forms')
                                tr.cells[k].onchange = function() {
                                    let type1Cell = this.parentElement.querySelector('.type1');
                                    let type2Cell = this.parentElement.querySelector('.type2');
                                    let formId = JSON.parse(this.parentElement.querySelector('.form-selector').value);
                                    let formImg;
                                    let catchStatus = this.parentElement.querySelector('.caught').innerHTML;
                                    let shinyStatus = this.parentElement.querySelector('.shiny').innerHTML;
                                    /*  
                                        -- TO DO --
                                        this if block can probably be reduced
                                        should not need to add grayscale class
                                    */
                                    if (shinyStatus == '<i class="fas fa-heart"></i>' || shinyStatus == '<i class="fas fa-heart" aria-hidden="true"></i>') {
                                        formImg = '/images/sprites/' + formId.id + '-s' + '.gif';
                                    } else if (catchStatus == '<i class="fas fa-star"></i>' || catchStatus == '<i class="fas fa-star" aria-hidden="true"></i>') {
                                        formImg = '/images/sprites/' + formId.id + '.gif';         
                                    } else {
                                        formImg = '/images/sprites/' + formId.id + '.gif';
                                        this.parentElement.querySelector('img').classList.add('grayscale-image');
                                    }
                                    this.parentElement.querySelector('img').src = formImg;
                                    /*  
                                        -- TO DO --
                                        need to add classes to the following cells
                                        0 - .pokemonID
                                        3 - .form1
                                        4 - .form2
                                    */
                                    type1Cell.innerHTML = formId.type1;
                                    type2Cell.innerHTML = formId.type2;
                                    type1Cell.className = "";
                                    type2Cell.className = "";
                                    type1Cell.classList.add(formId.type1.toLowerCase() + 'Type');
                                    type1Cell.classList.add('type1');
                                    if(formId.type2.toLowerCase() != '') {
                                        type2Cell.classList.add(formId.type2.toLowerCase() + 'Type')
                                        type2Cell.classList.add('type2')

                                    }
                                    let newId = this.parentElement.querySelector('.pokemonID').innerHTML;
                                    let newForm = this.parentElement.querySelector('.form-selector').selectedIndex;
                                    formPreferences[newId] = newForm;
                                    let strang = JSON.stringify(formPreferences);
                                    updateFormPreferences();
                                }
                                let content = tr.cells[k].innerHTML;
                                if(content.length == 0 || content.indexOf(' ') == 0) {
                                    tr.cells[k].innerHTML = '';  
                                } else if(tr.cells[0].innerHTML == "801" & catchPercent != 100) {
                                    tr.cells[k].innerHTML = '';  
                                } else {
                                    tr.cells[k].innerHTML = '';
                                    let sel = document.createElement('select');
                                    sel.classList.add('form-selector')
                                    sel.setAttribute('id', 'form-select' + i)
                                    sel.setAttribute('size', 6)
                                    let options = JSON.parse(content);
                                    for(option in options) {
                                        var opt = document.createElement('option');
                                        opt.appendChild(document.createTextNode(option));
                                        let val = {
                                        "id": options[option].id,
                                        "type1": options[option].type1,
                                        "type2": options[option].type2
                                        };
                                        opt.value = JSON.stringify(val);
                                        opt.title = option;
                                        sel.appendChild(opt);
                                    }
                                    let currNum =  tr.cells[0].innerHTML;
                                    sel.getElementsByTagName('option')[0].selected = 'seleted'
                                    if(formPreferences[currNum] == undefined) {
                                        sel.getElementsByTagName('option')[0].selected = 'seleted'
                                    } else {
                                        sel.getElementsByTagName('option')[formPreferences[currNum]].selected = 'selected'
                                        let uuuu = document.createElement('img'); //formImg
                                        let iiii = tr.cells[5].innerHTML; //shinyStatus
                                        let oooo = tr.cells[6].innerHTML; //catchStatus
                                        let formId = JSON.parse(sel.value);
                                        if (oooo == '<i class="fas fa-heart"></i>' || oooo == '<i class="fas fa-heart" aria-hidden="true"></i>') {
                                            /*
                                                -- TO DO --
                                                switch this to data-src
                                            */
                                            uuuu.src = '/images/sprites/' + formId.id + '-s' + '.gif';
                                        } else if (iiii == '<i class="fas fa-star"></i>' || iiii == '<i class="fas fa-star" aria-hidden="true"></i>') {
                                            /*
                                                -- TO DO -- 
                                                switch this to data-src
                                            */
                                            uuuu.src = '/images/sprites/' + formId.id + '.gif';
                                        } else {
                                            /*
                                                -- TO DO -- 
                                                switch this to data-src
                                            */
                                            uuuu.src = '/images/sprites/' + formId.id + '.gif';
                                            uuuu.classList.add('grayscale-image');
                                        }
                                        uuuu.classList.add('sprite');
                                        tr.cells[1].replaceChild(uuuu, tr.cells[1].childNodes[0]);
                                        tr.cells[3].innerHTML = formId.type1
                                        tr.cells[4].innerHTML = formId.type2
                                        tr.cells[3].className = formId.type1.toLowerCase() + 'Type';
                                        tr.cells[3].classList.add('type1');
                                        if(formId.type2.toLowerCase() != '') {
                                            tr.cells[4].className = formId.type2.toLowerCase() + 'Type';
                                            tr.cells[4].classList.add('type2');
                                        } else {
                                            tr.cells[4].className = '';
                                        }
                                    }
                                    tr.cells[k].appendChild(sel);
                                }
                            }
                            if (k == 11) {
                                tr.cells[k].classList.add('tag-cell')
                            }
                            if (k == 5 || k == 6 || k == 7 || k == 9) {
                                tr.cells[k].classList.add('pointer-cell')
                            }
                            if (k == 5 || k == 6 || k == 7 || k == 9) {
                                tr.cells[k].classList.add('status-setter')
                            }
                        } else {
                            tr.cells[k].onclick = function() { createSpritePopup(this) };
                            var img = document.createElement('img');
                            if (row[6] == '<i class="fas fa-heart"></i>' || row[6] == '<i class="fas fa-heart" aria-hidden="true"></i>') {
                                img.setAttribute('data-src', "/images/sprites/" + row[0].toLowerCase() + row[1].toLowerCase() + "-s" + ".gif")
                            } else {
                                img.setAttribute('data-src', "/images/sprites/" + row[0].toLowerCase() + row[1].toLowerCase() + ".gif")
                            }
                            img.classList.add('sprite');
                            if (row[5] == '<i class="far fa-star"></i>' || row[5] == '<i class="far fa-star" aria-hidden="true"></i>') {
                                img.classList.add('grayscale-image');
                            }
                            tr.cells[k].appendChild(img);
                            tr.cells[k].classList.add('pointer-cell');
                        }
                        if (row[6] == "TRUE" || row[6] == '<i class="fas fa-heart"></i>' || row[6] == '<i class="fas fa-heart" aria-hidden="true"></i>') {
                            tr.style = "color: red";
                        }
                    }
                    tbdy.appendChild(tr);

                }
                //check user permission level here
                console.log(USER_ROLE);
                if (USER_ROLE != "writer" && USER_ROLE != "owner") {
                    appendPre("You are not authorized to make updates. Changes will not be saved.");
                    document.querySelector('#mytable').innerHTML = '';
                } else {
                    document.getElementById('pre').style = 'visibility: hidden'; 
                }
                //
                images = document.querySelectorAll("[data-src]")
                images.forEach(image => {
                    imgObserver.observe(image);
                })
                setTotalRows();
                showHide();
            } else {
                appendPre('No data found.');
            }
        }, function (response) {
            if(response.status != 403){
                appendPre('No Pokedex found for ' + userEmail + '. Building Pokedex now, please wait.');
                createWorksheet();
            }
        });
    }, 5000);
    var userSheetLength;
    var defaultSheetLength;
    params.range = userEmail;
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
    userSheetLength = response.result.values.length;
    console.log('length of user sheet: ' + userSheetLength);
    });

    params.range = 'Default';
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
    defaultSheetLength = response.result.values.length;
    console.log('length of default sheet: ' + defaultSheetLength);
    });
    setTimeout (async function () {  
        if(defaultSheetLength > userSheetLength && userSheetLength != null) {
            await new Promise (resolve => {
                syncSheets(userSheetLength, defaultSheetLength);
                resolve()
            }).then(function() {
                setTimeout (async function() {
                    dexSort();
                }, 2000);
            })
        }
    }, 750);
    document.getElementById('username-container').style.display = "inline";
    document.getElementById('user-icon').innerHTML = '<i class="far fa-user"></i>';
    document.getElementById('user-icon').title = userEmail
}

//add link to dex entry
function createSpritePopup(e) {
    let currCell = e.closest('td');
    let img = document.getElementById('image-holder');
    let id;
    if (e.parentElement.querySelector('.form-selector') == null) { 
        id = e.parentElement.querySelector('.pokemonID').innerHTML;
    } else {d;
        id = JSON.parse(e.parentElement.querySelector('.form-selector').value).id;
    }
    new Promise(function (resolve) {
        if(
            currCell.parentElement.querySelector('.shiny').innerHTML.toLowerCase() == '<i class="fas fa-heart"></i>' ||
            currCell.parentElement.querySelector('.shiny').innerHTML.toLowerCase() == '<i class="fas fa-heart" aria-hidden="true"></i>'
        ) {
            img.src = "/images/sprites/" + id + "-s.gif"
        } else {
            img.src = "/images/sprites/" + id + ".gif"
        }
        resolve(currCell);
    }).then(async function(currCell) {
        await setBorder(currCell);
        img.style.display = 'block';
        document.getElementById("overlay").style.display = "block";
    })
}

document.getElementById('overlay').addEventListener("click", function(){
    document.getElementById('image-holder').style.display = 'none';
    document.getElementById('profile-container').style.display = 'none';
    document.getElementById('search-info').style.display = 'none';
    document.getElementById("overlay").style.display = "none";
});

let typeColors = 
{
    "fire"      : "#ff4422",
    "normal"    : "#aaaa99",
    "water"     : "#3399ff",
    "grass"     : "#77cc55",
    "electric"  : "#ffcc33",
    "ice"       : "#66ccff",
    "fighting"  : "#bb5544",
    "poison"    : "#aa5599",
    "ground"    : "#ddbb55",
    "flying"    : "#8899ff",
    "psychic"   : "#ff5599",
    "bug"       : "#aabb22",
    "rock"      : "#bbaa66",
    "ghost"     : "#6666bb",
    "dark"      : "#775544",
    "dragon"    : "#7766ee",
    "steel"     : "#aaaabb",
    "fairy"     : "#ee99ee"
};

async function setBorder(currCell) {
    let tbColor = typeColors[currCell.parentElement.querySelector('.type1').innerHTML.toLowerCase()];   //top-bottom color
    let lrColor;                                                                                        //left-right color            
    if(currCell.parentElement.querySelector('.type2').innerHTML.toLowerCase() == '') {                  //if pokemon only has one type tbColor and lrColor are the same
        lrColor = tbColor;
    } else {
        lrColor = typeColors[currCell.parentElement.querySelector('.type2').innerHTML.toLowerCase()];
    }
    let color = tbColor + " " + lrColor
    document.getElementById('image-holder').style.borderColor = color;
};

window.addEventListener("load", function() { 
    let sheet = document.styleSheets[1];
    for(x in typeColors) {
        style = '.' + x + 'Type {background-color:' + typeColors[x] + '; color: white;}';
        sheet.insertRule (
            style,
            sheet.rules.length
        );
    }
});

/*
    functions for saving to backend
    setup before functions 
*/
var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
const input = document.querySelector('#myTable');
var rowToUpdate = undefined;
var updateContents = undefined;

input.onkeyup = function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
}

input.onkeypress = function() {
    clearTimeout(typingTimer);
}


/*
    update the googlesheet when changes are made to front end
    via typing
    only saves the edited row
*/
async function doneTyping () {
    if(updateContents != undefined) {
        if(await getPermissionId() == undefined) {
            permissionsChanged();
        } else {
            let values = [
                [
                    updateContents
                ]
            ];
            let body = {
                values: values
            };
            let range = sheetName + '!' + 'j' + rowToUpdate;
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
                range: range,
                valueInputOption: 'RAW',
                resource: body
            }).then((response) => {
                var result = response.result;
                console.log(range + ' updated');
                console.log(`${result.updatedCells} cells updated.`);
            }).catch((err) => {
                console.error(err);
            });
            addTimeStamp("d");
        }
    }
}  

function happyMappy(e) {
    rowToUpdate = e.parentElement.rowIndex;
    updateContents = e.innerHTML;
}


/*
    update the googlesheet when changes are made to front end
    via click (caught and shiny columns)
    only saves the edited row
*/
async function saveOnClick(e) {
    if (changesMade == true) {
        if(await getPermissionId() == undefined) {
            permissionsChanged();
        } else {
            let col = e.cellIndex;
            let row = e.parentNode.rowIndex;
            if (col == 5) {
                col = "f";
            } else if (col == 6){
                col = "g";
            } else if (col == 7) {
                col = "h";
            }
            let values = [
                [
                    e.innerHTML
                ]
            ];
            let body = {
                values: values
            };
            let range = sheetName + '!' + col + row;
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
                range: range,
                valueInputOption: 'RAW',
                resource: body
            }).then((response) => {
                var result = response.result;
                console.log(`${result.updatedCells} cell(s) updated.`);
                setSessionStorage();
                changesMade = false;
            });
            addTimeStamp("d");
        }
    }
};

function createWorksheet() {
    console.log('Creating worksheet...');
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',  // TODO: Update placeholder value.
        sheetId: 1243340013, 
    };
    var copySheetToAnotherSpreadsheetRequestBody = {
        destinationSpreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
    };
    var request = gapi.client.sheets.spreadsheets.sheets.copyTo(params, copySheetToAnotherSpreadsheetRequestBody);
    request.then(function(response) {
        var sheetName = response.result.title;
        var sheetId = response.result.sheetId;
        changeName(sheetId);
        sheetName = userEmail;
        addToMappings(sheetName, sheetId);
        dexSort();
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
        appendPre('error: ' + reason.result.error.message);
    });
}

function addToMappings(sheetName, sheetId) {
    var row;
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) {
        if (response.result.values == undefined) {
            row = 1;
        } else {
            row = response.result.values.length+1;
        }  
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    setTimeout(function() {  
        var values = [
            [
                userEmail, 
                sheetName, 
                sheetId
            ]
        ];
        var body = {
            values: values
        };
        var range = 'Mappings!a' + row + ':c' + row;
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
            range: range,
            valueInputOption: 'RAW',
            resource: body
        }).then((response) => {
            console.log("updates saved...")
            appendPre('Refresh the page to view your Pokedex.');
            addTimeStamp('e');
            var result = response.result;
            /*
                -- To Do --
                What does this do?
            */
            const url = 'https://script.google.com/macros/s/AKfycbwioWXB142H66DKuc99s9Mn482Er-ACxE4XwxV7McZNcogJrMc/exec?currentRow=' + row;
            fetch(url)
                .then(response => response.json())
                .then(data => console.log(data))
        }).catch((err) => {
            console.error(err.result.error.message);
        });    
    }, 5000)
}

function changeName(sheetId) {
    var requests = [];
    requests.push({
        updateSheetProperties: {
            properties: {
            sheetId: sheetId,
            title: userEmail
            },
            fields: 'title'
        }
    });
    var batchUpdateRequest = {requests: requests}
    gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
        resource: batchUpdateRequest
    }).then((response) => {
        console.log('name changed...');
    }).catch((err) => {
        console.error(err);
    });
}

async function addTimeStamp(column) {
    let currTime = undefined;
    try {
    await new Promise(resolve => {
        currTime = getCurrTimeUTC();
        resolve(currTime);
    });
    currTime.then(function(currTime) {
        var values = [
            [currTime],
        ];
        var body = {
            values: values
        };
        var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
            range: 'Mappings',
        };
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        request.then(function(response) {
            var length = response.result.values.length;
            for (var i = 0; i < length; i++) {
                if (response.result.values[i][0] == userEmail) {
              
                    let userRow = i + 1;
                    var userCell = 'Mappings!' + column + userRow;
                    params = {
                        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
                        range: userCell,
                        valueInputOption: 'RAW',
                    }      
                    var request = gapi.client.sheets.spreadsheets.values.update(params, body);
                    request.then(function(response) {
                        console.log(response);
                    }, function(reason) {
                        console.error(reason)
                    });
                    
                };
            };
        });
    });
    } 
    catch (err) {
        console.error(err)
    }
}

function syncSheets(userSheetLength, defaultSheetLength) {
    userSheetLength++
    var values = [];
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
        range: 'Default!' + 'A' + userSheetLength + ':' + 'L' + defaultSheetLength,
        valueRenderOption: 'FORMULA',
        dateTimeRenderOption: 'FORMATTED_STRING',
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        values = response.result.values;
        console.log(values);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
    setTimeout(function() {
        var params = {
            spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
            range: userEmail + '!' + 'A' + userSheetLength,
            valueInputOption: 'USER_ENTERED',
        };
        var body = {
            values: values
        };
        console.log('yeet');
        var request = gapi.client.sheets.spreadsheets.values.update(params, body);
        request.then(function(response) {
            console.log(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }, 1000);
}

async function dexSort() {
    const url = 'https://script.google.com/macros/s/AKfycbz7TaNtf0Hq1LixcFMrziWDH7Ja5IwmTbT-TbfM8u1xwvZcApQ/exec?sheetName=' + userEmail;
    try {
        fetch(url)
            .then(response => response.json())
            .then(data => console.log(data));
    } catch (err) {
        console.log(err);
    }
}

function setSessionStorage() {
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        for(var i = 0; i < response.result.values.length; i++) {
            if (response.result.values[i][0] == userEmail) {
                sheetName = response.result.values[i][1];
                catchPercent = response.result.values[i][8];
                shinyPercent = response.result.values[i][10];
                userStats = {
                    'email' : userEmail,
                    'catchPercent': response.result.values[i][8],
                    'shinyPercent': response.result.values[i][10]
                };
                sessionStorage.setItem('userStats', JSON.stringify(userStats));
            };
        };
    });
}

function updateFormPreferences() {
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    let userRow = rowRowRow + 1;
    let cell = 'Mappings!L' + userRow
    var values = [
        [JSON.stringify(formPreferences)],
    ];
    var body = {
        values: values
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
            range: cell,
            valueInputOption: 'RAW',
            resource: body
        }).then((response) => {
            var result = response.result;
            console.log(cell + ' updated')
            console.log(`${result.updatedCells} cell(s) updated.`);
        });
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

async function funk() {
    let url = 'https://script.google.com/macros/s/AKfycbySF-KSzHQfGJAZLFk-dmO-kGhcApxVQtbG4WsSuyVIpbg82gkg/exec?email=' + userEmail;
    try {
        fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                appendPre('Your request for access has been submitted. You will be notified if access is granted.');
            })
    } catch (err) {
        console.log(err);
    }
}

async function requestAccess() {
    let userEmail = document.getElementById('requester-email').value;
    if (userEmail == "") {
        alert('You must provide an email address to request access.');
    } else {
        let url = 'https://script.google.com/macros/s/AKfycbySF-KSzHQfGJAZLFk-dmO-kGhcApxVQtbG4WsSuyVIpbg82gkg/exec?email=' + userEmail;
        try {
            fetch(url, {
                method: 'GET',
                mode: 'no-cors',
                catch: 'no-cache'
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    appendPre('Your request for access has been submitted. You will be notified if access is granted.');
                })
        } catch (err) {
            console.log(err);
        }
    }
}

function back() {
    console.log('here')
    document.getElementById('request-2').style.display = "none"
    document.getElementById('not-signed-in').style.display = "block"

}

// async function main() {
//     console.log(await getPermissionId());
// }

async function getPermissionId() {
    return gapi.client.drive.permissions.getIdForEmail({
      "email": userEmail
    })
    .then(async function(response) {
        console.log("Response", response);
        return await getPerm(response.result.id)
    },
    function(err) { console.error("Execute error", err.result.error.message); });
}

function getPerm(id) {
    return gapi.client.drive.permissions.get({
      "fileId": "1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI",
      "permissionId": id
    })
    .then(function(response) {
        console.log("Response", response);
        return response.result.role
    },
    function(err) { console.error("Execute error", err); });
}

async function permissionsChanged() {
    handleSignoutClick();
    document.getElementById('content-container').style.display = "none";
    document.getElementById('content-container').innerHTML = "";
    showSnackBar('Your permissions have been changed.')
};

function preloadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) {
        return;
    }
    img.src = src;
}

const imgOptions = { };

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            preloadImage(entry.target);
            imgObserver.unobserve(entry.target);
        }
    })
}, imgOptions);
