//commit

var answer;

function createProblem() {
    var num1 = Math.floor(Math.random() * 10);
    var operator = Math.floor(Math.random() * 10);    
    var num2 = Math.floor(Math.random() * 10);
    
    if (num1 > num2) {
        document.getElementById('box1').innerHTML = num1;
        document.getElementById('box3').innerHTML = num2;
    } else {
        document.getElementById('box1').innerHTML = num2;
        document.getElementById('box3').innerHTML = num1;
    }
    
    var test;
    if (operator < 5) {
        test = '+';
        document.getElementById('box2').innerHTML = test;
        answer = num1 + num2;
    } else {
        test = '-';
        document.getElementById('box2').innerHTML = test;
        if (num1 > num2) {
            answer = num1 - num2;
        } else {
            answer = num2 - num1;
        }
    }
    //console.log(num1, test, num2);
    //console.log(answer);
}

function submitAnswer() {
    var submission = document.getElementById('answer').value;
    if (submission == answer) {
        alert("Correct, keep going!");
        var currCount = Number((document.getElementById("counterTotal").innerHTML));
        currCount++;
        document.getElementById("counterTotal").innerHTML = currCount;
        var currStreak = Number((document.getElementById("counterStreak").innerHTML));
        currStreak++;
        document.getElementById("counterStreak").innerHTML = currStreak;  
        setHighScore(currStreak);
    } else {
        alert("Wrong, try again!");
        document.getElementById("counterStreak").innerHTML = 0;
    }
    createProblem();
    document.getElementById('answer').value = "";
}

function setHighScore(currStreak) {
    var currHighScore = localStorage.getItem("highscore");
    if (currStreak > currHighScore) {
        localStorage.setItem("highscore", currStreak);
        document.getElementById("highscore").innerHTML = currStreak;
    }
}


window.onload = function() {
    createProblem();
    document.getElementById('highscore').innerHTML = localStorage.getItem("highscore");
}

document.getElementById("answer")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submitAnswer").click();
    }
});