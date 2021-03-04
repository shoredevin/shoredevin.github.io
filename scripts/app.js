// Client ID and API key from the Developer Console
var CLIENT_ID = '1031814387459-03essqpn06v2iqa7qhqlvrgk27t70c2q.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAiTPu0gDQqDPL0-LKbSu1Jvw4lcCEdFvE';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var tableStorage;
var userEmail;
var catchPercent;
var shinyPercent;
var sheetName;
var sheet;
let formPreferences = {};
let rowRowRow;
let USER_ROLE;
var changesMade = false;
let persistPre = false;


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
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('not-signed-in').style.display = "none"
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //check user permissions here, if they do not have permissions stop
        //if user has permission do this
        setTableContents();
        // doTheGoodThing();
        addTimeStamp('f');
    } else {
        document.getElementById('not-signed-in').style.display = "block"
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

// async function doTheGoodThing() {
//     USER_ROLE = await getPermissionId();
//     console.log(USER_ROLE);
//     setTableContents();
// }

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
    document.getElementById('pre').style = 'visibility: hidden';
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
        var x = document.createElement('a');
        var t = document.createTextNode('You currently do not have access to this site. To request access click here.')
        x.setAttribute('href', 'javascript:funk()');
        x.appendChild(t);
        pre.appendChild(x);
    } else {
        // console.log(message);
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
        return
    }
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        // if  (USER_ROLE == undefined) {
        //     console.log('undefined user role');
        //     // break
        // } else {
        //     console.log('here is my user role ' + USER_ROLE)
        // }
        
        for (var i = 0; i < response.result.values.length; i++) {
            if (response.result.values[i][0] == userEmail) {
                rowRowRow = i;
                sheetName = response.result.values[i][1];
                catchPercent = response.result.values[i][8];
                shinyPercent = response.result.values[i][10];
                // console.log(response.result.values[i][11])
                if (response.result.values[i][11] != undefined) {
                    formPreferences = JSON.parse(response.result.values[i][11]);
                } 
                userStats = {
                    'email' : userEmail,
                    'catchPercent': catchPercent,
                    'shinyPercent': shinyPercent
                }
                sessionStorage.setItem('userStats', JSON.stringify(userStats));
                // console.log(JSON.parse(sessionStorage.userStats))
                // console.log('sheetname ', sheetName);
            };
        };
    }, function(reason) {
        if(reason.result.error.code == 403) {
            // console.log('yo dawg');
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
                            } else {
                                tr.cells[k].appendChild(document.createTextNode(row[k]));
                            }
                            if (k == 3 || k == 4) {
                                var type = row[k].toLowerCase();
                                var typeClass = type + 'Type';
                                tr.cells[k].classList.add(typeClass);
                            }
                            if (k == 5) {
                                tr.cells[k].onclick = function () {
                                    if ($(this).text() == '☆') {
                                        changesMade = true;
                                        $(this).text('★');
                                        $(this).parent().find('td:eq(1) img').removeClass('grayscale-image');
                                    } else {
                                        var text = $(this).parent().find('td:eq(6)').text();
                                        var hiddenAbilityText = $(this).parent().find('td:eq(9)').text();
                                        if (text == '♥') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else if (hiddenAbilityText == '◼') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            $(this).parent().find('td:eq(6)').text('♡');
                                            $(this).closest('tr').css('color', 'black');
                                            $(this).text('☆');
                                            if (document.getElementById('form-select' + $(this).closest('tr').index()) == null) {
                                                pokemonNumber = $(this).parent().find('td:eq(0)').text();
                                                console.log(pokemonNumber);
                                            } else {
                                                pokemonNumber = JSON.parse(document.getElementById('form-select' + $(this).closest('tr').index()).value).id;
                                            }
                                            let normalImg = document.createElement('img');
                                            normalImg.src ="/images/images/" + pokemonNumber + ".gif";
                                            normalImg.classList.add('sprite');
                                            $(this).parent().find('td:eq(1)').html(normalImg);
                                            console.log($(this).parent().find('td:eq(1)'));
                                            console.log($(this).parent().find('td:eq(1) img'));
                                            $(this).parent().find('td:eq(1) img').addClass('grayscale-image');
                                        }
                                    }
                                };
                            }
                            if (k == 6) {
                                tr.cells[k].onclick = function () {
                                    var shinyImg = document.createElement('img');
                                    var pokemonNumber;  
                                    if (document.getElementById('form-select' + $(this).closest('tr').index()) == null) {
                                        pokemonNumber = $(this).parent().find('td:eq(0)').text();
                                        // console.log(pokemonNumber);
                                    } else {
                                        pokemonNumber = JSON.parse(document.getElementById('form-select' + $(this).closest('tr').index()).value).id;
                                    }
                                    if ($(this).text() == '♡') {
                                        var text = $(this).parent().find('td:eq(5)').text();
                                        if (text == '☆') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            $(this).text('♥');
                                            $(this).closest('tr').css('color', 'red');
                                            shinyImg.src = "/images/images/" + pokemonNumber + "-s" + ".gif";
                                            shinyImg.classList.add('sprite');
                                            $(this).parent().find('td:eq(1)').html(shinyImg);
                                            $(this).parent().find('td:eq(5)').text('★');
                                        }
                                    } else {
                                        changesMade = true;
                                        $(this).text('♡');
                                        $(this).closest('tr').css('color', 'black');
                                        shinyImg.src ="/images/images/" + pokemonNumber + ".gif";
                                        shinyImg.classList.add('sprite');
                                        $(this).parent().find('td:eq(1)').html(shinyImg);
                                        var text = $(this).parent().find('td:eq(5)').text();
                                        if (text == '☆') {
                                            $(this).parent().find('td:eq(1) img').addClass('grayscale-image');
                                        }
                                    }
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
                            }
                            if (k == 8) {
                                tr.cells[k].classList.add('gen')
                            }
                            if (k == 7) {
                                tr.cells[k].classList.add('hidden-ability')
                                tr.cells[k].onclick = function() {
                                    if ($(this).text() == '◻') {
                                        var text = $(this).parent().find('td:eq(5)').text();
                                        if(text == '☆') {
                                            showSnackBar("OAK: " + userEmail + "! This isn't the time to use that!")
                                        } else {
                                            changesMade = true;
                                            $(this).text('◼');
                                        } 
                                    } else {
                                        changesMade = true;
                                        $(this).text('◻');
                                    }
                                }
                            }
                            if (k == 10) {
                                tr.cells[k].onchange = function() {
                                    let formId = JSON.parse(document.getElementById('form-select' + $(this).closest('tr').index()).value);
                                    let formImg = document.createElement('img');
                                    let catchStatus = $(this).parent().find('td:eq(5)').text();
                                    let shinyStatus = $(this).parent().find('td:eq(6)').text();
                                    if (shinyStatus == '♥') {
                                        formImg.src = '/images/images/' + formId.id + '-s' + '.gif';
                                    } else if (catchStatus == '★') {
                                        formImg.src = '/images/images/' + formId.id + '.gif';
                                        
                                    } else {
                                        formImg.src = '/images/images/' + formId.id + '.gif';
                                        formImg.classList.add('grayscale-image');
                                    }
                                    formImg.classList.add('sprite');
                                    $(this).parent().find('td:eq(1)').html(formImg);
                                    $(this).parent().find('td:eq(3)').html(formId.type1);
                                    $(this).parent().find('td:eq(4)').html(formId.type2);
                                    $(this).parent().find('td:eq(3), td:eq(4)').removeClass()
                                    $(this).parent().find('td:eq(3)').addClass(formId.type1.toLowerCase() + 'Type')
                                    if(formId.type2.toLowerCase() != '') {
                                        $(this).parent().find('td:eq(4)').addClass(formId.type2.toLowerCase() + 'Type')
                                    }
                                    let newId = $(this).parent().find('td:eq(0)').text();
                                    let newForm =  document.getElementById('form-select' + $(this).closest('tr').index()).selectedIndex;
                                    formPreferences[newId] = newForm;
                                    let strang = JSON.stringify(formPreferences);
                                    updateFormPreferences();
                                    // console.log(document.getElementById('form-select' + $(this).closest('tr').index()).selectedIndex);
                                }
                                let content = tr.cells[k].innerHTML;
                                // console.log(content);
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
                                        if (oooo == '♥') {
                                            uuuu.src = '/images/images/' + formId.id + '-s' + '.gif';
                                        } else if (iiii == '★') {
                                            uuuu.src = '/images/images/' + formId.id + '.gif';
                                        } else {
                                            uuuu.src = '/images/images/' + formId.id + '.gif';
                                            uuuu.classList.add('grayscale-image');
                                        }
                                        uuuu.classList.add('sprite');
                                        tr.cells[1].replaceChild(uuuu, tr.cells[1].childNodes[0]);
                                        tr.cells[3].innerHTML = formId.type1
                                        tr.cells[4].innerHTML = formId.type2
                                        tr.cells[3].className = formId.type1.toLowerCase() + 'Type';
                                        if(formId.type2.toLowerCase() != '') {
                                            tr.cells[4].className = formId.type2.toLowerCase() + 'Type';
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
                            var img = document.createElement('img');
                            if (row[6] == '♥') {
                                img.src = "/images/images/" + row[0].toLowerCase() + row[1].toLowerCase() + "-s" + ".gif";
                            } else {
                                img.src = "/images/images/" + row[0].toLowerCase() + row[1].toLowerCase() + ".gif";
                            }
                            img.classList.add('sprite');
                            if (row[5] == '☆') {
                                img.classList.add('grayscale-image');
                            }
                            tr.cells[k].appendChild(img);
                            tr.cells[k].classList.add('pointer-cell');
                        }
                        if (row[6] == "TRUE" || row[6] == "♥") {
                            tr.style = "color: red";
                        }
                    }
                    tbdy.appendChild(tr);

                }
                //check user permission level here
                console.log(USER_ROLE);
                if (USER_ROLE != "writer" && USER_ROLE != "owner") {
                    appendPre("You are not authorized to make updates. Changes will not be saved.");
                    $('#myTable').off()
                    $('.form-selector').off('change')
                } else {
                    document.getElementById('pre').style = 'visibility: hidden'; 
                }
                //
                setTotalRows();
                showHide();
            } else {
                appendPre('No data found.');
            }
        }, function (response) {
            if(response.status != 403){
                // appendPre('Error: ' + response.result.error.message);
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
    document.getElementById('username-container').innerHTML = userEmail;
}

//add link to dex entry
$(document).on('click', '.sprite, .sprite-big', async function() {
    let currCell = $(this).closest('tr') 
    let img = document.getElementById('image-holder');
    let id;
    if (document.getElementById('form-select' + $(this).closest('tr').index()) == null) {
        id = document.getElementById("myTable").rows[$(this).closest('tr').index() + 1].cells[0].innerHTML;
        // console.log(id);
    } else {
        id = JSON.parse(document.getElementById('form-select' + $(this).closest('tr').index()).value).id;
    }
    new Promise(function (resolve) {
        if(currCell.find('td:eq(6)').text().toLowerCase() == "♥") {
            img.src = "/images/images/" + id + "-s.gif"
        } else {
            img.src = "/images/images/" + id + ".gif"
        }
        resolve(currCell);
    }).then(async function(currCell) {
        await setBorder(currCell);
        img.style.display = 'block';
        // document.getElementById('close-button').style.display = 'block';
        // document.getElementById('myInput').disabled = true;
        // document.getElementById('clear-button').style.pointerEvents = 'none';
        document.getElementById("overlay").style.display = "block";

        // let ay = document.getElementsByClassName('pointer-cell');
        // for(i = 0; i < ay.length; i++) {
        //     ay[i].style.pointerEvents = 'none';
        // }
    })
});

document.getElementById('overlay').addEventListener("click", function(){
    document.getElementById('image-holder').style.display = 'none';
    document.getElementById('profile-container').style.display = 'none';
    // document.getElementById('close-button').style.display = 'none';
    // document.getElementById('myInput').disabled = false;
    // document.getElementById('clear-button').style.pointerEvents = 'auto';
    document.getElementById("overlay").style.display = "none";

    // let ay = document.getElementsByClassName('pointer-cell');
    // for(i = 0; i < ay.length; i++) {
    //     ay[i].style.pointerEvents = 'auto';
    // }
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
    let tbColor = typeColors[currCell.find('td:eq(3)').text().toLowerCase()];   //top-bottom color
    let lrColor;                                                                //left-right color
    if (currCell.find('td:eq(4)').text().toLowerCase() == '') {                 //if pokemon only has one type tbColor and lrColor are the same
        lrColor = tbColor;
    } else {
        lrColor = typeColors[currCell.find('td:eq(4)').text().toLowerCase()];
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

//functions for saving to backend
//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms, 5 second for example
var $input = $('#myTable');
var test = undefined;
var test2 = undefined;

//on keyup, start the countdown
$input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
    clearTimeout(typingTimer);
});

//update the googlesheet when changes are made to front end
//via typing
//only saves the edited row
async function doneTyping () {
    if(test2 != undefined) {
        // console.log(test2);
        if(await getPermissionId() == undefined) {
            permissionsChanged();
        } else {
            let values = [
                [
                    test2
                ]
            ];
            let body = {
                values: values
            };
            // console.log(body);
            let range = sheetName + '!' + 'j' + test;
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

$("#myTable").delegate(".notes-field", "keyup", function(e) {
    test = this.parentNode.rowIndex; //row
    test2 = $(this)[0].textContent; //data
});

//update the googlesheet when changes are made to front end
//via click (caught and shiny columns)
//only saves the edited row
$("#myTable").delegate(".status-setter", "click", async function(e) {
    if (changesMade == true) {
        if(await getPermissionId() == undefined) {
            permissionsChanged();
        } else {
            let col = this.cellIndex;
            let row = this.parentNode.rowIndex;
            if (col == 5) {
                col = "f";
            } else if (col == 6){
                col = "g";
            } else if (col == 7) {
                col = "h";
            }
            let values = [
                [
                    $(this)[0].textContent
                ]
            ];
            let body = {
                values: values
            };
            // console.log(body);
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
});

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
            const url = 'https://script.google.com/macros/s/AKfycbwioWXB142H66DKuc99s9Mn482Er-ACxE4XwxV7McZNcogJrMc/exec?currentRow=' + row;
            $.get(url, function(data, status) {
                console.log(data)
            });
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
                    // valueRangeBody = {body};
                    var request = gapi.client.sheets.spreadsheets.values.update(params, body);
                    // gapi.client.sheets.spreadsheets.values.update({
                    //     spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI',
                    //     range: userCell,
                    //     valueInputOption: 'RAW',
                    //     resource: body
                    request.then(function(response) {
                        console.log(response);
                        // var result = response.result;
                        // console.log(response.result.error.code);
                        // if(response.status == 403) {console.log('uh oh')}
                        // console.log(`${result.updatedCells} cell(s) updated.`);
                    }, function(reason) {
                        console.error(reason)
                        // if(reason.status == 403) {
                        //     appendPre("You are not authorized to make updates. Changes will not be saved.");
                        //     persistPre = true;
                        //     $('#myTable').off('click')
                        // }
                    });
                    
                };
            };
        });
    });
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
        // console.log(body);
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
    $.get(url, function(data, status) {
        console.log(data)
    });
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
    // console.log(rowRowRow);
    var params = {
        spreadsheetId: '1FPZBycraxhpYwlQyeO2y_JeWBLunzTw3F45A4g237JI', 
        range: 'Mappings',
    };
    let userRow = rowRowRow + 1;
    //add let here not sure this was defined previously
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
    $.get(url, function(data, status) {
        console.log(data);
        appendPre('Your request for access has been submitted. You will be notified if access is granted.');
    });
}

async function requestAccess() {
    let userEmail = document.getElementById('requester-email').value;
    if (userEmail == "") {
        alert('You must provide an email address to request access.');
    } else {
        let url = 'https://script.google.com/macros/s/AKfycbySF-KSzHQfGJAZLFk-dmO-kGhcApxVQtbG4WsSuyVIpbg82gkg/exec?email=' + userEmail;
        $.get(url, function(data, status) {
            console.log(data);
            appendPre('Your request for access has been submitted. You will be notified if access is granted.');
        });
    }
}

function back() {
    console.log('here')
    document.getElementById('request-2').style.display = "none"
    document.getElementById('not-signed-in').style.display = "block"

}


async function main() {
    // await loadDriveClient();
    console.log(await getPermissionId());
}

// async function loadDriveClient() {
//     gapi.client.setApiKey('AIzaSyAiTPu0gDQqDPL0-LKbSu1Jvw4lcCEdFvE');
//     return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest")
//         .then(function() { console.log("GAPI client loaded for API"); },
//               function(err) { console.error("Error loading GAPI client for API", err); });
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
    // alert('hello');
    // console.log(await getPermissionId());
    // let role = 
    // if(await getPermissionId() == undefined) {
        // await new Promise(resolve => {
            alert('Your access has expired')
            document.getElementById('content-container').innerHTML = "";
            // resolve();
        // });
        // await new Promise(resolve => {
            
            // clearInterval(int);
            // document.getElementById('content-container').innerHTML = "";
            appendPre(403);
            // showSnackBar('Your permissions have been changed.')
            // resolve();
        // });
    // }
};