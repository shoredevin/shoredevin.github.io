setInterval(getCurrentTime, 1000);
var audio = new Audio('audio/Loud-alarm-clock-sound.wav');

window.onload = function () {
    addCustomsToColorSelector("old");
    //buildInitialSavedThemes();
    showClearSavedThemesButton();
}

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

var rgbToHex = function (rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
};

function writeAlarm(alarmTime) {
    alarmHour12 = addLeadingZero(document.getElementById("hour").value);
    alarmMinute = addLeadingZero(document.getElementById("minute").value);
    var elem = document.getElementById("alarmTime");
    elem.className = "themed-elem " + theme;
    var alarmTime12 = alarmHour12 + ":" + alarmMinute;
    elem.innerHTML = alarmTime12;
}

function ringAlarm() { 
    var vol = document.getElementById("myRange").value/100; 
    console.log("Ring volume: " + vol);
    audio.volume = vol;      
    audio.play();
    // document.getElementById('snooze').innerHTML = '<button id="snoozeButton" onclick="snooze()">Snooze</button>';

    document.getElementById('snooze-container').style = "display: block";

    //var input = document.getElementById('snooze');
    window.addEventListener("keyup", function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            document.getElementById('snoozeButton').click();
            window.removeEventListener("keyup", function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                    document.getElementById('snoozeButton').click();
                }
            });
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
        //console.log(meridia)
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
        //console.log(Number(alarmMinute)+Number(snoozeTime));
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
    var savedRgb = localStorage.getItem(color); 
    if (savedRgb !== null) {
        color = "random";
    }
    document.getElementById("save-container").style = "display: none";
    theme = color;
    var elems = document.getElementsByClassName("themed-elem");
    for (let elem of elems) {
        if (elem.id == "alarmTime" && elem.innerHTML == "88:88") {
            elem.className = "themed-elem " + color + "-dark"
        } else {
            elem.classList.remove("red");
            elem.classList.remove("blue");
            elem.classList.remove("green");
            elem.classList.remove("purple");
            elem.classList.remove("random");
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
        if (savedRgb === null) {
            document.getElementById("save-container").style = "display: block";
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
        } else {
            savedRgb = JSON.parse(savedRgb);
            r = savedRgb[0];
            g = savedRgb[1];
            b = savedRgb[2];
        }
        //get hex value for random color rgb
        var hexR = rgbToHex(r);
        var hexG = rgbToHex(g);
        var hexB = rgbToHex(b);
        var hexColor = "#"+hexR+hexG+hexB;
        //create dark version of RGB color (1/5 light color)
        rDark = r * .2;
        gDark = g * .2;
        bDark = b * .2;
        //set style
        var style = createRandomStyleClasses('rgb(' + r + ',' + g + ',' +  b + ')', 'rgb(' + rDark + ',' + gDark + ',' +  bDark + ')');
        document.getElementById("random-style-elem").innerHTML = "";
        document.getElementById("random-style-elem").innerHTML = style;
        //get and print name of random color hex
        if (savedRgb === null) {
            var randomColorName  = ntc.name(hexColor)[1];
            console.log("Random RGB name: " + randomColorName);
            console.log("Random RGB values:" + "\n", "light: " + r, g, b + "\n", "dark: " + rDark, gDark, bDark);
            document.getElementById('themeName').value = randomColorName;
        }
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
        document.getElementById("themeName").value = "";
        document.getElementById("save-container").style = "display: none";
        var color = [r, g, b];
        localStorage.setItem(themeName, JSON.stringify(color));
        addCustomsToColorSelector("new");
        changeThemeColor(themeName);
        showClearSavedThemesButton();
    }
}

function addCustomsToColorSelector(trigger) {
    console.log("adding customs");
    var length = localStorage.length;
    var select = document.getElementById("colorSelector");
    var optGroup = document.getElementById("custom-optgroup");
    if (trigger == "new") {
        for (var i = 0; i < length-1; i++) {
            select.remove(select.length-1);
        }
    }
    if (length > 0) {
        for (var i = 0; i < length; i++) {
            var currColor = localStorage.key(i);
            var optGroup = document.getElementById("custom-optgroup");
            optGroup.style = "display: block";
            opt = new Option(currColor, currColor);
            select.options[select.options.length] = opt;
            optGroup.appendChild(opt);
            console.log(localStorage.key(i));
        }
    }
}

// function addCustomThemeToCss(themeName) {
//     var light = "rgb(" + r + "," + g + "," + b + ")";
//     var dark = "rgb(" + rDark + "," + gDark + "," + bDark + ")";

//     var sheet = document.getElementById('stylin').sheet
//     var css_rules_num = sheet.cssRules.length;
    
//     var string1 = "span." + themeName + " {background-color:" + light + ";}";
//     var string2 = "span." + themeName + "-dark" + " {background-color:" + dark + ";}";
//     var string3 = "#alarmTime." + themeName + ", ." + themeName + " {color:" + light + ";}";
//     var string4 = "#alarmTime." + themeName + "-dark" + ", ." + themeName + "-dark" + " {color:" + dark + ";}";

//     sheet.insertRule(string1, css_rules_num);    
//     sheet.insertRule(string2, css_rules_num+1);    
//     sheet.insertRule(string3, css_rules_num+2);    
//     sheet.insertRule(string4, css_rules_num+1);    
// }   

// function buildInitialSavedThemes() {
//     var length = localStorage.length;
//     for (var i = 0; i < length; i++) {
//         var currColor = localStorage.key(i);
//         var rgb = JSON.parse(localStorage.getItem(currColor)); 
//         r = rgb[0];
//         g = rgb[1];
//         b = rgb[2];
//         rDark = r * .2;
//         gDark = g * .2;
//         bDark = b * .2;
//     }
// }

function clearTheme() {
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var select = document.getElementById("colorSelector");
        select.remove(select.length-1);
    }
    localStorage.clear();
    showClearSavedThemesButton();
}

function showClearSavedThemesButton() {
    var length = localStorage.length;
    if (length > 0) {
        document.getElementById("clear-theme").style = "display: inline";
    } else {
        document.getElementById("clear-theme").style = "display: none";
        var optGroup = document.getElementById("custom-optgroup");
        optGroup.style = "display: none";
    }
}