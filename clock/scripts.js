setInterval(getCurrentTime, 1000);

function getCurrentTime() {
    //set alarm time
    var alarmHour12 = addLeadingZero(document.getElementById("hour").value);
    var alarmMinute = addLeadingZero(document.getElementById("minute").value);
    var alarmSeconds = "00";
    var alarmHour24;
    if (document.getElementById('pmCheck').checked == true) {
        alarmHour24 = Number(addLeadingZero(alarmHour12))+12;
    } else {
        alarmHour24 = alarmHour12;
    }
    //var alarmTime = alarmHour24 + ":" + alarmMinute;
    var alarmTime12 = alarmHour12 + ":" + alarmMinute;
    writeAlarm(alarmTime12);
    setAlarmLight();
    //
    //set current time
    var d = new Date();
    var currentHour24 = addLeadingZero(d.getHours());
    var currentMinutes = addLeadingZero(d.getMinutes());
    var currentSeconds = addLeadingZero(d.getSeconds());
    //
    //ring alarm
    if(alarmHour24 == currentHour24 && alarmMinute == currentMinutes && alarmSeconds == currentSeconds){
        ringAlarm();
    } 
    //   
    //set meridiem
    if (currentHour24 >= 12) {
        var currentHour12 = currentHour24;
        document.getElementById('pmLight').style.backgroundColor = "red";
        if (currentHour24 > 12) {
            var currentHour12 = addLeadingZero(currentHour24-12);
        }
    } else {
        var currentHour12 = currentHour24;
        document.getElementById('amLight').style.backgroundColor = "red";
    }
    //
    writeTime(currentHour12, currentMinutes, currentSeconds)    
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
    var audio = new Audio('audio/Clock-ringing.mp3');
    audio.play();
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