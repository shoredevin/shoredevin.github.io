// let totalRows;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/scripts/service-worker.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
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

// Set Knockout view model bindings.
// ko.applyBindings(Page.vm);

//search logic
$(document).ready(function () {
    $('#myInput').on('keyup focus', function () {
        const regex = / & /gi;
        var value = this.value.toLowerCase().replace(regex, '&');
        const caughtRegX = /"caught"/gi;
        const uncaughtRegX = /"!caught"/gi;
        const shinyRegX = /"shiny"/gi;
        const notShinyRegX = /"!shiny"/gi;
        value = value.replace(caughtRegX, "★");
        value = value.replace(uncaughtRegX, "☆");
        value = value.replace(shinyRegX, "♥");
        value = value.replace(notShinyRegX, "♡");
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
								if (tr[i].textContent.toLowerCase().indexOf(string.slice(0, string.length)) > -1) {
                                    tr[i].style.display = '';
                                    break;
								} else {
                                    tr[i].style.display = 'none';
								}
							} else if (tr[i].textContent.toLowerCase().indexOf(string.slice(0, string.indexOf('&'))) > -1) {
								string = string.slice(string.indexOf('&') + 1, string.length);
                            } else {
                                tr[i].style.display = 'none';      
                            }
                        }
                    } else if (tr[i].textContent.toLowerCase().indexOf(filter[k]) > -1) {
                        tr[i].style.display = '';
                        break;
                    } else {
                        tr[i].style.display = 'none';
                    };
                };
            };
        };
        logSortTotal();
    });
});

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
    // $('#table-container').scrollTop(0);
    document.getElementById('table-container').scrollTo(0,0);
}

async function getCurrTimeUTC() {
    let url = 'https://worldtimeapi.org/api/timezone/America/new_york';
    let response = await fetch(url);
    let data = await response.json();
    let str = data.utc_datetime;
    let time = str.slice(str.indexOf('T') + 1, str.indexOf('.'));
    let date = str.slice(0, str.indexOf('T'))
    // let timezone = data.abbreviation;
    let timeStamp = time + ' ' + date + ' ' + 'UTC';
    // console.log(timeStamp);
    return timeStamp;
}

window.onload = function() {
    //switch hidden ability (class name) with variable from option selection
    document.getElementById('show-hide-button').addEventListener("click", function() {
        let classToChange = document.getElementById('col-selector').value;
        let element = document.querySelector('.' + classToChange);
        let styles = getComputedStyle(element);
        let disp = styles.display;
        if (disp == 'none') {
            let cols = document.getElementsByClassName(classToChange);
            for (let i = 0; i < cols.length; i++) {
                cols[i].style.cssText = 'display: table-cell';
            }
            console.log('show', classToChange)
            localStorage.removeItem(classToChange);
        } else {
            let cols = document.getElementsByClassName(classToChange);
            for (let i = 0; i < cols.length; i++) {
                cols[i].style.cssText = 'display: none';

            }
            console.log("hide", classToChange)
            localStorage.setItem(classToChange, "hide");
        }
        document.getElementById('col-selector').selectedIndex=0;
        document.getElementById('show-hide-button').disabled = true;
        document.getElementById('show-hide-button').innerHTML = "Show/Hide";
        
    });

    document.getElementById('col-selector').addEventListener("click", function() {
        currSelection = document.getElementById('col-selector').value;
        if(currSelection == '---') {
            document.getElementById('show-hide-button').disabled = true;
            document.getElementById('show-hide-button').innerHTML = 'Show/Hide';
        } else {
            document.getElementById('show-hide-button').disabled = false;
            let classToChange = document.getElementById('col-selector').value;
            let element = document.querySelector('.' + classToChange);
            let styles = getComputedStyle(element);
            let disp = styles.display;
            if (disp == 'none') {
                document.getElementById('show-hide-button').innerHTML = "Show";
            } else {
                document.getElementById('show-hide-button').innerHTML = "Hide";
            }
        }
    });
}

function showHide() {
    //console.log('hello world')
    if (localStorage.length > 0) {
        for(let i = 0; i < localStorage.length; i++) {
            let cols = document.getElementsByClassName(localStorage.key(i));
            for (let k = 0; k < cols.length; k++) {
                cols[k].style.cssText = 'display: none';
            }
        }
    }
};

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

function openPopupWindow(myURL, title, myWidth, myHeight) {
    var left = (screen.width - myWidth) / 2;
    var top = (screen.height - myHeight) / 4;
    var myWindow = window.open(myURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + myWidth + ', height=' + myHeight + ', top=' + top + ', left=' + left);
}

function showProfile() {
    let userStats = JSON.parse(sessionStorage.userStats);
    // console.log(userStats)
    // console.log(userStats.catchPercent);
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
