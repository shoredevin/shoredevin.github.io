setInterval(getCurrentTime, 1000);
var audio = new Audio('audio/Loud-alarm-clock-sound.wav');

var alarmMeridiem = undefined;
var theme = "red";
var currentHour24;
var alarmHour12 = undefined;
var alarmMinute = undefined;

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
        document.getElementById('snooze').innerHTML = '';
        document.getElementById('snoozeText').innerHTML = '';
        document.getElementById('snoozeTime').innerHTML = '';
    }
    console.log(alarmHour24 + ":" + alarmMinute)
    if(alarmHour24 == currentHour24 && alarmMinute == currentMinutes && alarmSeconds == currentSeconds){
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
        document.getElementById('amLight').style.backgroundColor = theme;
        document.getElementById('pmLight').style.backgroundColor = theme + "-dark";
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
    document.getElementById('snooze').innerHTML = '<button id="snoozeButton" onclick="snooze()">Snooze</button>';

    //var input = document.getElementById('snooze');
    window.addEventListener("keyup", function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            document.getElementById('snoozeButton').click();
        }
    });

    document.getElementById('snoozeText').innerHTML = "Snooze for this many minutes:";
    document.getElementById('snoozeTime').innerHTML = '<select name="snoozeSelector" id="snoozeSelector" class="snoozeSelector"><option value="10">10</option> <option value="15">15</option> <option value="20">20</option> <option value="25">25</option> <option value="30">Lazy Fucker</option></select>';
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
    document.getElementById('snooze').innerHTML = '';
    document.getElementById('snoozeText').innerHTML = '';
    document.getElementById('snoozeTime').innerHTML = '';
    writeAlarm();
}

function changeThemeColor(color) {
    // var color = document.getElementById('colorSelector').value;
    console.log(color)
    // if (color == "blue") {
        // document.getElementById('clock').style.color = "blue";
        // document.getElementById('background').style.color = "#000032";
    theme = color;
    var elems = document.getElementsByClassName("themed-elem");
    console.log(elems)
    for (let elem of elems) {
        console.log(elem.id + "  " + elem.innerHTML);
        if (elem.id == "alarmTime" && elem.innerHTML == "88:88") {
            elem.className = "themed-elem " + color + "-dark"
        } else {
            elem.classList.remove("red");
            elem.classList.remove("blue");
            elem.classList.add(color);
        }
    }
    var backgroundElem = document.getElementById("background");
    backgroundElem.classList.remove("red-dark");
    backgroundElem.classList.remove("blue-dark");
    backgroundElem.classList.add(color + "-dark");

    elems = document.getElementsByClassName("light");
    for (let elem of elems) {
        elem.classList = "light themed-elem";
    }
    setAlarmMeridiem(alarmMeridiem);
    setMeridiem();
}
