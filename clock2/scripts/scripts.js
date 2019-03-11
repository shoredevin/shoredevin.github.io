var devdevedev;
setInterval(getCurrentTime, 1000);
var audio = new Audio('audio/Loud-alarm-clock-sound.wav');


window.onload = function () {
    addCustomsToColorSelector();
    buildInitialSavedThemes();
}

// var x = {
//     "time": "1:00",
//     "checked": true
// }

// JSON.stringify(x)

var alarmMeridiem = undefined;
var theme = "red";
var currentHour24;
var alarmHour12 = undefined;
var alarmMinute = undefined;
var randomStyleClasses;
var r;
var g;
var b;
var rDark;
var gDark;
var bDark;

function getCurrentTime() {
    // changeThemeColor();
    //set alarm time
    var alarmSeconds = "00";
    var alarmHour24;
    if (document.getElementById('pmCheck').checked == true && currentHour24 != 12) {
        alarmHour24 = Number(addLeadingZero(alarmHour12))+12;
    } else {
        alarmHour24 = alarmHour12;
    }
    // var alarmTime12 = alarmHour12 + ":" + alarmMinute;
    // writeAlarm(alarmTime12);
    // setAlarmLight();
    //
    //set current time
    var d = new Date();
    currentHour24 = addLeadingZero(d.getHours());
    var currentMinutes = addLeadingZero(d.getMinutes());
    var currentSeconds = addLeadingZero(d.getSeconds());
    //
    //ring alarm
    //console.log(currentSeconds);
    if (currentSeconds == "00") {
        document.getElementById('snooze-container').style = "display: none";
    }
    //console.log(alarmHour24 + ":" + alarmMinute)
    if (alarmHour24 == currentHour24 && alarmMinute == currentMinutes && alarmSeconds == currentSeconds){
        ringAlarm();
    } 
    //   
    //set meridiem
    var currentHour12 = setMeridiem();
    //
    writeTime(currentHour12, currentMinutes, currentSeconds)    
}

function setMeridiem() {
    if (currentHour24 >= 12) {
        var currentHour12 = currentHour24;
        document.getElementById('pmLight').className = "light themed-elem " + theme;
        document.getElementById('amLight').className = "light themed-elem "+ theme + "-dark";
        if (currentHour24 > 12) {
            var currentHour12 = addLeadingZero(currentHour24-12);
        }
    } else {
        var currentHour12 = currentHour24;
        document.getElementById('amLight').className = "light themed-elem " + theme;
        document.getElementById('pmLight').className = "light themed-elem "+ theme + "-dark";
    }
    return currentHour12;
}

function writeTime(hour, minute, second) {
    document.getElementById('clock').innerHTML = hour + ":" + minute + ":" + second;
}

function addLeadingZero(number) {
    return (number < 10 ? '0' : '') + number
}

function writeAlarm(alarmTime) {
    alarmHour12 = addLeadingZero(document.getElementById("hour").value);
    alarmMinute = addLeadingZero(document.getElementById("minute").value);
    var elem = document.getElementById("alarmTime");
    elem.className = "themed-elem " + theme;
    var alarmTime12 = alarmHour12 + ":" + alarmMinute;
    elem.innerHTML = alarmTime12;
}

function ringAlarm() {        
    audio.play();
    // document.getElementById('snooze').innerHTML = '<button id="snoozeButton" onclick="snooze()">Snooze</button>';

    document.getElementById('snooze-container').style = "display: block";

    //var input = document.getElementById('snooze');
    window.addEventListener("keyup", function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            document.getElementById('snoozeButton').click();
        }
    });

    // document.getElementById('snoozeText').innerHTML = "Snooze for this many minutes:";
    // document.getElementById('snoozeTime').innerHTML = '<select name="snoozeSelector" id="snoozeSelector" class="snoozeSelector"><option value="10">10</option> <option value="15">15</option> <option value="20">20</option> <option value="25">25</option> <option value="30">Lazy Fucker</option></select>';
}

function clearPMCheckBox() {
    document.getElementById('pmCheck').checked = false;
}

function clearAMCheckBox() {
    document.getElementById('amCheck').checked = false;
}

// function setAlarmLight() {
//     if (document.getElementById('amCheck').checked == true) {
//         // document.getElementById('amAlarmLight').style.backgroundColor = "red";
//     } else {
//         // document.getElementById('amAlarmLight').style.backgroundColor = "#320000";
//     }
//     if (document.getElementById('pmCheck').checked == true) {
//         // document.getElementById('pmAlarmLight').style.backgroundColor = "red";
//     } else {
//         // document.getElementById('pmAlarmLight').style.backgroundColor = "#320000"
//     }
// }

function setAlarmMeridiem(meridia) {
    var amLight = document.getElementById("amAlarmLight")
    var pmLight = document.getElementById("pmAlarmLight")
    if (meridia != undefined) {
        console.log(meridia)
        alarmMeridiem = meridia;
        if (meridia == "am") {
            amLight.classList.add(theme);
            amLight.classList.remove(theme + "-dark");
            pmLight.classList.remove(theme);
            pmLight.classList.add(theme + "-dark");
        } else {
            pmLight.classList.add(theme);
            pmLight.classList.remove(theme + "-dark");
            amLight.classList.remove(theme);
            amLight.classList.add(theme + "-dark");
        }
    } else {
        amLight.classList.add(theme + "-dark");
        pmLight.classList.add(theme + "-dark");
    }
}

function snooze() {
    audio.pause();
    var snoozeTime = Number(document.getElementById("snoozeSelector").value);
    alarmMinute = addLeadingZero(document.getElementById("minute").value);
    alarmHour = addLeadingZero(document.getElementById("hour").value);
    if (Number(alarmMinute)+Number(snoozeTime) > 59) {
        console.log(Number(alarmMinute)+Number(snoozeTime));
        var newAlarmMinute = (Number(addLeadingZero(alarmMinute))+snoozeTime)%60;
        var newAlarmHour = (Number(addLeadingZero(alarmHour))+1);
    } else {
        var newAlarmMinute = Number(addLeadingZero(alarmMinute))+snoozeTime;
        var newAlarmHour = Number(addLeadingZero(alarmHour));
    }
    document.getElementById("minute").value = newAlarmMinute;
    document.getElementById("hour").value = newAlarmHour;
    // document.getElementById('snooze').innerHTML = '';
    // document.getElementById('snoozeText').innerHTML = '';
    // document.getElementById('snoozeTime').innerHTML = '';

    document.getElementById('snooze-container').style = "display: none";
    writeAlarm();
}

function changeThemeColor(color) {
    document.getElementById("save-container").style = "display: none";
    // var color = document.getElementById('colorSelector').value;
    //console.log(color)
    // if (color == "blue") {
        // document.getElementById('clock').style.color = "blue";
        // document.getElementById('background').style.color = "#000032";
    
    theme = color;
    var elems = document.getElementsByClassName("themed-elem");
    //console.log(elems)
    for (let elem of elems) {
        //console.log(elem.id + "  " + elem.innerHTML);
        if (elem.id == "alarmTime" && elem.innerHTML == "88:88") {
            elem.className = "themed-elem " + color + "-dark"
        } else {
            elem.classList.remove("red");
            elem.classList.remove("blue");
            elem.classList.remove("green");
            elem.classList.remove("purple");
            elem.classList.remove("random");
            
            var length = localStorage.length;
            for (var i = 0; i < length; i++) {
                var currColor = localStorage.key(i);
                elem.classList.remove(currColor);
            }
            elem.classList.add(color);
        }
    }
    var backgroundElem = document.getElementById("background");
    backgroundElem.classList.remove("red-dark");
    backgroundElem.classList.remove("blue-dark");
    backgroundElem.classList.remove("green-dark");
    backgroundElem.classList.remove("purple-dark");
    backgroundElem.classList.remove("random-dark");

    for (var i = 0; i < length; i++) {
        var currColor = localStorage.key(i);
        backgroundElem.classList.remove(currColor  + "-dark");
    }

    backgroundElem.classList.add(color + "-dark");

    elems = document.getElementsByClassName("light");
    for (let elem of elems) {
        elem.classList = "light themed-elem";
    }

    if (color == "random") {
        document.getElementById("save-container").style = "display: block";
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        rDark = r * .2;
        gDark = g * .2;
        bDark = b * .2;
        //document.getElementById('box1').style.backgroundColor = 'rgb(' + r + ',' + g + ',' +  b + ')';
        //document.getElementById('random').style.color = 'pink';
        //document.getElementsByClassName('random-dark').style.color = 'purple';

        var style = createRandomStyleClasses('rgb(' + r + ',' + g + ',' +  b + ')', 'rgb(' + rDark + ',' + gDark + ',' +  bDark + ')');

        document.getElementById("random-style-elem").innerHTML = "";
        document.getElementById("random-style-elem").innerHTML = style;

        console.log(r, g, b);
        console.log(rDark, gDark, bDark);

        // var randoms = document.getElementsByClassName('random');
        // for (let random of randoms) {
        //     random.style.color = 'rgb(' + r + ',' + g + ',' +  b + ')';
        // }

        // var darkRandoms = document.getElementsByClassName('random-dark');
        // for (let darkRandom of darkRandoms) {
        //     darkRandom.style.color = 'rgb(' + rDark + ',' + gDark + ',' +  bDark + ')';
        // }

        // var spans = document.getElementsByTagName('span');
        // console.log(spans);

        // for (var span of spans) {
        //     spanRandoms = span.getElementsByClassName('random');
        //     for (let spanRandom of spanRandoms) {
        //     //if (span.getElementsByClassName('random') == true) {
        //     span.style.backgroundColor = 'rgb(' + r + ',' + g + ',' +  b + ')';
        //     }
        //     var spandarkRandoms = span.getElementsByClassName('random-dark');
        //     for (let spandarkRandom of spandarkRandoms) {
        //         spandarkRandom.style.backgroundColor = 'rgb(' + rDark + ',' + gDark + ',' +  bDark + ')';
        //     }
        // }

    }
    setAlarmMeridiem(alarmMeridiem);
    setMeridiem();
}

function createRandomStyleClasses(light, dark) {
    return "span.random { background-color: " + light + ";" +
    "} span.random-dark { background-color: " + dark + ";" +
    "} #alarmTime.random, .random { color: " + light + ";" +
    "} #alarmTime.random-dark, .random-dark{ color: " + dark + ";" +
    "}"
}

function saveTheme() {
    var themeName = document.getElementById("themeName").value;
    if (themeName == "") {
        alert("A name must be entered");
    } else {
        alert("You saved a theme named: " + themeName + " (r" + r + ".g" + g + ".b" + b + ")");
        //var themeName = "*" + document.getElementById("themeName").value;
        document.getElementById("themeName").value = "";
        document.getElementById("save-container").style = "display: none";
        //var rgb = r+"."+g+"."+b;
        var color = [r, g, b];
        localStorage.setItem(themeName, JSON.stringify(color));
        
        addCustomsToColorSelector();
        addCustomThemeToCss(themeName);
        // var retrievedData = localStorage.getItem("light-purple");
        // var colorPurple = JSON.parse(retrievedData);
        // console.log(colorPurple[1]);
    }
}

function addCustomsToColorSelector() {
    console.log("adding customs");
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var currColor = localStorage.key(i);
        var select = document.getElementById("colorSelector");
        select.options[select.options.length] = new Option(currColor, currColor);
        console.log(localStorage.key(i));
    }
}

function addCustomThemeToCss(themeName) {
    var light = "rgb(" + r + "," + g + "," + b + ")";
    var dark = "rgb(" + rDark + "," + gDark + "," + bDark + ")";

    var sheet = document.getElementById('stylin').sheet
    var css_rules_num = sheet.cssRules.length;
    
    var string1 = "span." + themeName + " {background-color:" + light + ";}";
    console.log(string1);
    var string2 = "span." + themeName + "-dark" + " {background-color:" + dark + ";}";
    var string3 = "#alarmTime." + themeName + ", ." + themeName + " {color:" + light + ";}";
    var string4 = "#alarmTime." + themeName + "-dark" + ", ." + themeName + "-dark" + " {color:" + dark + ";}";

    sheet.insertRule(string1, css_rules_num);    
    sheet.insertRule(string2, css_rules_num+1);    
    sheet.insertRule(string3, css_rules_num+2);    
    sheet.insertRule(string4, css_rules_num+1);    
}   

function buildInitialSavedThemes() {
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var currColor = localStorage.key(i);
        console.log(currColor);
        var rgb = JSON.parse(localStorage.getItem(currColor)); 
        console.log(rgb);
        console.log(rgb.length)
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        var themeName = currColor;
        addCustomThemeToCss(themeName);
    }
}