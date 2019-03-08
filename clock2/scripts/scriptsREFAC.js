setInterval(main, 1000);
var audio = new Audio('audio/Loud-alarm-clock-sound.wav');


var alarmHour12;
var alarmHour24;
var alarmHour;
var alarmMinute;
var alarmSeconds;
var alarmTime12;
var currentHour24;
var currentMinutes;
var currentSeconds;

function main() {
    setAlarmTime();
    writeAlarm(alarmTime12);
    setAlarmLight();
    getCurrentTime();

    if (currentSeconds == "00") {
        document.getElementById('snooze').innerHTML = '';
        document.getElementById('snoozeText').innerHTML = '';
        document.getElementById('snoozeTime').innerHTML = '';
    }
    if(alarmHour24 == currentHour24 && alarmMinute == currentMinutes && alarmSeconds == currentSeconds){
        ringAlarm();
    } 

    var currentHour12 = setMeridiem();
    writeTime(currentHour12, currentMinutes, currentSeconds);
}

function setAlarmTime() {
    alarmHour12 = addLeadingZero(document.getElementById("hour").value);
    alarmMinute = addLeadingZero(document.getElementById("minute").value);
    alarmSeconds = "00";
    var alarmHour24;
    if (document.getElementById('pmCheck').checked == true) {
        alarmHour24 = Number(addLeadingZero(alarmHour12))+12;
    } else {
        alarmHour24 = alarmHour12;
    }
    alarmTime12 = alarmHour12 + ":" + alarmMinute; 
}

function getCurrentTime() {
    var d = new Date();
    currentHour24 = addLeadingZero(d.getHours());
    currentMinutes = addLeadingZero(d.getMinutes());
    currentSeconds = addLeadingZero(d.getSeconds());
}

 function setMeridiem() {   
    if (currentHour24 >= 12) {
        var currentHour12 = currentHour24;
        document.getElementById('pmLight').style.backgroundColor = "red";
        document.getElementById('amLight').style.backgroundColor = "#320000";
        if (currentHour24 > 12) {
            currentHour12 = addLeadingZero(currentHour24-12);
        }
    } else {
        currentHour12 = currentHour24;
        document.getElementById('amLight').style.backgroundColor = "red";
        document.getElementById('pmLight').style.backgroundColor = "#320000";
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
    if (alarmTime == "00:00") {
        document.getElementById('alarmTime').style.color = "#320000";
    } else {
        document.getElementById('alarmTime').style.color = "red";
        document.getElementById('alarmTime').innerHTML = alarmTime;
    }
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

function setAlarmLight() {
    if (document.getElementById('amCheck').checked == true) {
        document.getElementById('amAlarmLight').style.backgroundColor = "red";
    } else {
        document.getElementById('amAlarmLight').style.backgroundColor = "#320000";
    }
    if (document.getElementById('pmCheck').checked == true) {
        document.getElementById('pmAlarmLight').style.backgroundColor = "red";
    } else {
        document.getElementById('pmAlarmLight').style.backgroundColor = "#320000"
    }
}

function snooze() {
    audio.pause();
    currentAlarmMinute = addLeadingZero(document.getElementById("minute").value);
    console.log("currmin: ", currentAlarmMinute);
    var snoozeTime = Number(document.getElementById("snoozeSelector").value);
    console.log("snoozetime: ", snoozeTime);
    var newAlarmMinute = Number(addLeadingZero(currentAlarmMinute))+snoozeTime;
    document.getElementById("minute").value = newAlarmMinute;
    document.getElementById('snooze').innerHTML = '';
    document.getElementById('snoozeText').innerHTML = '';
    document.getElementById('snoozeTime').innerHTML = '';
}