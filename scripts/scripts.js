// let totalRows;

// window.onload = () => {
    // console.log('here');
    
    "use strict";

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../service-worker.js', { scope: '/' }).then(function(reg) {
            console.log('Successfully registered service worker', reg);
        }).catch(function(err) {
            console.warn('Error whilst registering service worker', err);
        });
    }
// }

window.onload = function() {
    //switch hidden ability (class name) with variable from option selection
    setupGridPreferences();
    document.querySelector('#myInput').addEventListener("keyup", function() {
        setSearchLogic();
    });
}

window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    document.getElementById('pre').style = 'visibility: hidden';
    document.getElementById('content-container').style = 'display:block';
    //Page.hideOfflineWarning();
    //Arrivals.loadData();
}, false);

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    //Page.showOfflineWarning();
    appendPre("You are currently offline");
    document.getElementById('content-container').style = 'display:none';
}, false);

// Check if the user is connected.
if (navigator.onLine) {
    document.getElementById('pre').style = 'visibility: hidden';
} else {
    // Show offline message
    //Page.showOfflineWarning();
    appendPre("You're currently offline");
}

//search logic
function setSearchLogic() {
    console.log('i am here...')
        const regex = / & /gi;
        var value = document.querySelector('#myInput').value.toLowerCase().replace(regex, '&');
        const caughtRegX = /caught/gi;
        const uncaughtRegX = /!caught/gi;
        const uncaughtExplicitRegX = /uncaught/gi;
        const shinyRegX = /shiny/gi;
        const notShinyRegX = /!shiny/gi;
        value = value.replace(uncaughtRegX, '<i class="far fa-star" aria-hidden="true"></i>');
        value = value.replace(uncaughtExplicitRegX, '<i class="far fa-star" aria-hidden="true"></i>');
        value = value.replace(caughtRegX, '<i class="fas fa-star" aria-hidden="true"></i>');
        value = value.replace(notShinyRegX, '<i class="far fa-heart" aria-hidden="true"></i>');
        value = value.replace(shinyRegX, '<i class="fas fa-heart" aria-hidden="true"></i>');
        var filter = [];
        while (value.length > 0) {
            if (value.indexOf('||') == -1) {
                if (value.trim().length > 0) {
                    filter.push(value.trim());
                };
                break;
            } else {
                index = value.indexOf('||');
                filter.push(value.slice(0, index).trim())
                value = value.slice(index+2, value.length);
            };
        };
        var table = document.getElementById('tableBody');
        var tr = table.getElementsByTagName('tr');
        for (var i = 0; i < tr.length; i++) {
            if (filter.length == 0) {
                tr[i].style.display = '';
            } else {
                for (var k = 0; k < filter.length; k++) {
                    if (filter[k].indexOf('&') > -1) {
                        let string = filter[k];
                        let countAmp =  string.match(/&/g).length;
                        for (var m = 0; m <= countAmp + 1; m++) {
							if (m == countAmp + 1) {
								if (tr[i].innerHTML.toLowerCase().indexOf(string.slice(0, string.length)) > -1) {
                                    tr[i].style.display = '';
                                    break;
								} else {
                                    tr[i].style.display = 'none';
								}
							} else if (tr[i].innerHTML.toLowerCase().indexOf(string.slice(0, string.indexOf('&'))) > -1) {
								string = string.slice(string.indexOf('&') + 1, string.length);
                            } else {
                                tr[i].style.display = 'none';      
                            }
                        }
                    } else if (tr[i].innerHTML.toLowerCase().indexOf(filter[k]) > -1) {
                        tr[i].style.display = '';
                        break;
                    } else {
                        tr[i].style.display = 'none';
                    };
                };
            };
        };
    logSortTotal();
}

function addToSearch(char) {
    var currChar = document.getElementById('myInput').value;
    if (char == '★' && currChar == '★') {
        document.getElementById('myInput').value = '☆';
    } else if (char == '♥' && currChar == '♥') {
        document.getElementById('myInput').value = '♡';
    } else if (char == '◼' && currChar == '◼') {
        document.getElementById('myInput').value = '◻';
    } else {
        document.getElementById('myInput').value = char;
    }
    document.getElementById('myInput').focus();
}

function clearSearch() {
    document.getElementById('myInput').value = '';
    document.getElementById('myInput').focus();
    document.activeElement.blur()
    document.getElementById('table-container').scrollTo(0,0);
    setSearchLogic();
}

async function getCurrTimeUTC() {
    let url = 'https://worldtimeapi.org/api/timezone/America/new_york';
    let response = await fetch(url);
    let data = await response.json();
    let str = data.utc_datetime;
    let time = str.slice(str.indexOf('T') + 1, str.indexOf('.'));
    let date = str.slice(0, str.indexOf('T'))
    let timeStamp = time + ' ' + date + ' ' + 'UTC';
    return timeStamp;
}

function showHide() {
    if (localStorage.length > 0) {
        for(let i = 0; i < localStorage.length; i++) {
            let cols = document.getElementsByClassName(localStorage.key(i));
            for (let k = 0; k < cols.length; k++) {
                cols[k].style.cssText = 'display: none';
            }
        }
    }
};

function setupGridPreferences() {
    if(localStorage.length > 0) {
        for(let i = 0; i < localStorage.length; i++) {
            let id = localStorage.key(i);
            console.log(id);
            document.getElementById(id).checked = true;
            let cols = document.getElementsByClassName(id);
            for (const col of cols) {
                col.style.cssText = 'display: none';
            }
        }
    }
}

function hideMe(classToChange) {
    let cols = document.getElementsByClassName(document.getElementById(classToChange).value);
    if (document.getElementById(classToChange).checked == true) {
        localStorage.setItem(classToChange, "hide")
        for (let i = 0; i < cols.length; i++) {
            cols[i].style.cssText = 'display: none';
        }
    };
    if (document.getElementById(classToChange).checked == false) {
        localStorage.removeItem(classToChange)
        for (let i = 0; i < cols.length; i++) {
            cols[i].style.cssText = 'display: table-cell';
        }
    };
}

function showSnackBar(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = msg;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

let totalRows;

function setTotalRows() {
    totalRows = table.getElementsByTagName('tr').length - 1;
    document.getElementById('table-size').innerHTML = "Showing " + totalRows + " of " + totalRows + " rows";
}

function logSortTotal() {
    let sortTotal = -1;
    var tr = table.getElementsByTagName('tr');
    for (var i = 0; i < tr.length; i++) {
        if(tr[i].style.display != 'none') {
            sortTotal++;
        }
    }
    if(sortTotal > -1 && sortTotal < totalRows) {
        document.getElementById('table-size').innerHTML = "Showing " + sortTotal + " of " + totalRows + " rows";
    } else {
        document.getElementById('table-size').innerHTML = "Showing " + totalRows + " of " + totalRows + " rows";
    }

}

// function openPopupWindow(myURL, title, myWidth, myHeight) {
//     var left = (screen.width - myWidth) / 2;
//     var top = (screen.height - myHeight) / 4;
//     var myWindow = window.open(myURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + myWidth + ', height=' + myHeight + ', top=' + top + ', left=' + left);
// }

function showProfile() {
    let userStats = JSON.parse(sessionStorage.userStats);
    document.getElementById('username-cell').innerHTML = userStats.email;
    document.getElementById('catch-percent-cell').innerHTML = userStats.catchPercent;
    document.getElementById('shiny-percent-cell').innerHTML = userStats.shinyPercent;
    document.getElementById('overlay').style.display = 'block'
    document.getElementById('profile-container').style.display = 'inline-block'
}

function openRequestForm() {
    document.getElementById('not-signed-in').style.display = "none";
    document.getElementById('request-2').style.display = "block";
}

function showSearchInfo() {
    document.getElementById('search-info').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'
}

function showGridPreferences() {
    document.getElementById('grid-preferences-container').style.display = 'block';
    document.getElementById('user-profile-container').style.display = 'none';
}

function hideGridPreferences() {
    document.getElementById('grid-preferences-container').style.display = 'none';
    document.getElementById('user-profile-container').style.display = 'block';
}

function removeFormCol() {
    console.log('running');
    let formColCells = document.querySelectorAll('.other-forms');
    for (let i = 0; i < formColCells.length; i++) {
        formColCells[i].remove();
    }
}

function toggleHeader() {
    const header = document.querySelector('header');

    header.classList.toggle('header-open')
}