document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"><\/script>');
var username = "";
var myname = "";
var timer = null;
var keys;

let backgroundColor, textColor, ballColor, racketColor;
let gameScreen;
let backgroundImage;

let gravity = 0.3;
let airfriction = 0.00001;
let friction = 0.1;

let score = 0;
let likeCount = 0;
let maxHealth = 100;
let health = 100;
let healthDecrease = 25;
let healthBarWidth = 60;

let ballX, ballY;
let ballSpeedVert = 0;
let ballSpeedHorizon = 0;
let ballSize = 20;
let ballImage;

let racketWidth = 100;
let racketHeight = 50;
let racket;
let startTime;
let countdownDuration = 3000;
let countdownActive = false;
function setup() {
    frameRate(60);
    createCanvas(1600, 800);
    ballX = width / 4;
    ballY = height / 5;
    ballImage = loadImage('img/moon.png');
    backgroundImage = loadImage('img/mk.jpg');
    racket = createImg('img/blh.gif', 'racket');
    racket.id('racket-image');
    racket.hide(); // ซ่อนรูปภาพเดิมที่ใช้ loadImage() เพื่อไม่ให้แสดงทับกับ GIF
    noCursor();
    backgroundColor = color(34, 34, 34);
    textColor = color(255);
    ballColor = color('#FF9900');
    racketColor = color('#0081FF');
    gameScreen = 0;
    textFont('cursive');

    //Show 
    showLoginForm();
}

function showLoginForm() {
    document.getElementById('loginform').style.display = 'flex';
}

function draw() {
    noCursor();
    if (gameScreen == 0) {
        initScreen();
    } else if (gameScreen == 1) {
        if (!countdownActive) {
            background(0);
            startCountdown();
        } else {
            racket.hide();
            let elapsed = millis() - startTime;
            if (elapsed >= countdownDuration) {
                gameScreenFunction();
            } else {
                background(0);
                stroke(255);
                strokeWeight(5);
                noFill();
                rect(5, 5, width - 10, height - 10);
                
                noStroke();
                textSize(32);
                fill(255);
                textAlign(CENTER, CENTER);
                let remainingTime = ceil((countdownDuration - elapsed) / 1000);
                text("Game starts in " + remainingTime + " seconds", width / 2, height / 2);
            }
        }
    } else if (gameScreen == 2) {
        racket.hide();
        gameOverScreen();
    }
}
function startCountdown() {
    // กำหนดเวลาเริ่มต้นนับ
    startTime = millis();
    countdownActive = true;
}

function initScreen() {
    // กำหนด Canvas ใหม่ให้มีขนาดเท่ากับภาพพื้นหลัง
    createCanvas(1600, 800);
    image(backgroundImage, 0, 0);

    stroke(255);
    strokeWeight(5);
    noFill();
    rect(5, 5, width - 10, height - 10);
    
    noStroke();
    textAlign(CENTER);
    fill(textColor);
    textSize(70);
    text("Ball Bouncing", width / 2, height / 2);
    textSize(24);
    text("Press Enter to start", width / 2, height - 50);
}

function gameScreenFunction() {
    // กำหนด Canvas ใหม่ให้มีขนาดเท่ากับภาพพื้นหลัง
    setTimeout
    createCanvas(1600, 800);
    image(backgroundImage, 800, 400);

    stroke(255);
    strokeWeight(5);
    noFill();
    rect(5, 5, width - 10, height - 10);
    
    noStroke();

    drawRacket();
    watchRacketBounce();
    drawBall();
    applyGravity();
    applyHorizontalSpeed();
    keepInScreen();
    drawHealthBar();
    printScore();
}

function gameOverScreen() {
    // กำหนด Canvas ใหม่ให้มีขนาดเท่ากับภาพพื้นหลัง
    createCanvas(1600, 800);
    image(backgroundImage, 800, 400);

    stroke(255);
    strokeWeight(5);
    noFill();
    rect(5, 5, width - 10, height - 10);
    
    noStroke();

    textAlign(CENTER);
    fill(textColor);
    textSize(70);
    text("Game Over", width / 2, height / 2 - 120);
    textSize(24);
    text("Your Score:", width / 2, height / 2);
    textSize(60);
    text(score, width / 2, height / 2 + 60);
    textSize(24);
    text("Press Enter to restart", width / 2, height - 50);
}
window.onload = pageLoad;

function pageLoad() {
    getData();
    setUsername();

    document.getElementById('displayPic').onclick = fileUpload;
    document.getElementById('fileField').onchange = fileSubmit;

    var x = document.getElementById("submitmsg");
    x.onclick = sendMsg;

    showImg('img/' + getCookie('img'));
}
function showImg(filename) {
    if (filename !== "") {
        var showpic = document.getElementById('displayPic');
        showpic.innerHTML = "";
        var temp = document.createElement("img");
        temp.src = filename;
        showpic.appendChild(temp);
    }
}
function fileUpload() {
    document.getElementById('fileField').click();
}

function fileSubmit() {
    document.getElementById('formId').submit();
}
// getData();
async function sendScoreToServer() {
    // Get the score from the input field
    const Nscore = score;
    const Numlike = 0;
    if (score == 0) {
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/submitScore", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: score,
                user: username,
                nlike: Numlike,
            }), // Send the score in the request body
        });
        await getData();

        // Handle the response if needed
    } catch (error) {
        console.error('Error submitting score:', error);
        // Handle the error if needed
    }
}
async function sendLikeToServer(username, likeCount) {
    myname = getCookie('username');
    try {
        const response = await fetch("/submitLike", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: myname,
                leadername: username,
            }),
        });

        // Handle the response if needed

        // Call getData() to fetch updated data after submitting like
        await getData();
    } catch (error) {
        console.error('Error submitting like:', error);
        // Handle the error if needed
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (gameScreen === 0) {
            startGame();
        } else if (gameScreen === 2) {
            restart();
        }
    }
}

function startGame() {
    gameScreen = 1;
}

function gameOver() {
    sendScoreToServer();
    racketWidth = 100;
    gameScreen = 2;
}

function restart() {
    // sendScoreToServer();
    score = 0;
    health = maxHealth;
    ballX = width / 4;
    ballY = height / 5;
    ballSpeedVert = 0;
    ballSpeedHorizon = 0;
    gameScreen = 1;
    countdownActive = false;
}

function drawBall() {
    // หาค่าที่ใช้ในการหมุนรูป
    let rotation = frameCount * 0.1;

    // ระบุศูนย์กลางของลูกบอล
    let centerX = ballX;
    let centerY = ballY;

    // ให้เลื่อนตำแหน่งเดิมมีพื้นที่บวกเพื่อให้รอบลูกบอลตรงกับขอบที่หมุน
    translate(centerX, centerY);

    // ให้ลูกบอลหมุนรอบตัวเอง
    rotate(rotation);

    // แสดงรูปลูกบอล
    imageMode(CENTER);
    image(ballImage, 0, 0, ballSize, ballSize);

    // รีเซ็ตการเคลื่อนที่ทั้งหมดเพื่อไม่ให้ภาพถูกหมุนไปด้วยลูกบอล
    resetMatrix();
}


function drawRacket() {
    fill(racketColor);
    // rectMode(CENTER);
    // imageMode(CENTER);
    racket.show();
    let imageX = mouseX - racket.width / 2;
    let imageY = mouseY - racket.height / 2;
    // แสดงรูปแร็คเก็ต
    imageX = constrain(imageX, 0, width - racket.width);
    imageY = constrain(imageY, 0, height - racket.height);

    racket.position(imageX+125, imageY+ 110);
    racket.size(racketWidth, racketHeight);
}

let hasScored = false;

function watchRacketBounce() {
    let overhead = mouseY - pmouseY;
    if (
        ballX + ballSize / 2 > mouseX - racketWidth / 2 &&
        ballX - ballSize / 2 < mouseX + racketWidth / 2
    ) {
        if (
            dist(ballX, ballY, ballX, mouseY) <= ballSize / 2 + abs(overhead)
        ) {
            makeBounceBottom(mouseY);
            ballSpeedHorizon = (ballX - mouseX) / 10;
            if (overhead < 0) {
                ballY += overhead / 2;
                ballSpeedVert += overhead / 2;
            }
            if (!hasScored) {
                score++;
                hasScored = true;
                // สุ่มความยาวของแร็กเก็ตใหม่
                racketWidth = random(10, 100);
                ballX = random(width);
                ballY = random(0, height / 2);
                ballSpeedHorizon *= 1.5;
                ballSpeedVert *= 0.5;
            }
        } else {
            hasScored = false;
        }
    } else {
        hasScored = false;
    }
}

function applyGravity() {
    ballSpeedVert += gravity;
    ballY += ballSpeedVert;
    ballSpeedVert -= ballSpeedVert * airfriction;
}

function applyHorizontalSpeed() {
    ballX += ballSpeedHorizon;
    ballSpeedHorizon -= ballSpeedHorizon * airfriction;
}

function makeBounceBottom(surface) {
    ballY = surface - ballSize / 2;
    ballSpeedVert *= -1;
    ballSpeedVert -= ballSpeedVert * friction;
    // ballY = random(height / 4, 3 * height / 4);
}

function keepInScreen() {
    if (ballX - ballSize / 2 < 0) {
        ballX = ballSize / 2;
        ballSpeedHorizon *= -1;
    } else if (ballX + ballSize / 2 > width) {
        ballX = width - ballSize / 2;
        ballSpeedHorizon *= -1;
    }

    if (ballY - ballSize / 2 < 0) {
        ballY = ballSize / 2;
        ballSpeedVert *= -1;
    } else if (ballY + ballSize / 2 > height) {
        ballY = height - ballSize / 2;
        ballSpeedVert *= -1;
        decreaseHealth();
    }
}

function drawHealthBar() {
    noStroke();
    fill(189, 195, 199);
    rectMode(CORNER);
    rect(
        ballX - healthBarWidth / 2,
        ballY - 30,
        healthBarWidth,
        5
    );
    if (health > 60) {
        fill(46, 204, 113);
    } else if (health > 30) {
        fill(230, 126, 34);
    } else {
        fill(231, 76, 60);
    }
    rectMode(CORNER);
    rect(
        ballX - healthBarWidth / 2,
        ballY - 30,
        (healthBarWidth * health) / maxHealth,
        5
    );

    textAlign(CENTER);
    fill(255);
    textSize(14);
    text("health", ballX, ballY - 45);
}

function decreaseHealth() {
    health -= healthDecrease;
    if (health <= 0) {
        gameOver();
    }
}

function printScore() {
    textAlign(CENTER);
    fill(255);
    textSize(30);
    text("Score: " + score, width / 2, 50);
}
async function getData() {
    try {
        const response = await fetch("/showDB");
        const content = await response.json();
        showTable(content);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});

function logout() {
    clearCookies();
    window.location.href = "login.html";
    document.getElementById('errordisplay').innerHTML = "";
}

function clearCookies() {
    var cookieNames = ["username"];
    var cookieIMG = ["img"];

    cookieNames.forEach(function (cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
    cookieIMG.forEach(function (cookieIMG) {
        document.cookie = cookieIMG + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
}

function showTable(data) {
    keys = Object.keys(data);
    var keys2 = Object.keys(data[keys[0]]);
    var tablearea = document.getElementById("table")
    var table = document.createElement("table");
    var tr = document.createElement("tr");

    var columnNames = ["User", "Score", "Likes"];

    for (var i = 0; i < columnNames.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = columnNames[i];
        tr.appendChild(th);
    }

    table.appendChild(tr);

    for (var i = 0; i < keys.length; i++) {
        var tr = document.createElement("tr");

        for (var j = 0; j < keys2.length; j++) {
            var td = document.createElement("td");
            var temp = data[keys[i]];
            td.innerHTML = temp[keys2[j]];
            tr.appendChild(td);
        }

        var button = document.createElement("button");

        button.innerHTML = `Like for Rank ${i + 1}`;

        button.addEventListener("click", function (index) {
            return async function () {
                const selectedUser = data[keys[index]].leadername;
                await sendLikeToServer(selectedUser);
            };
        }(i));

        button.classList.add("table-but");

        tr.appendChild(button);
        table.appendChild(tr);
    }

    tablearea.innerHTML = "";
    tablearea.appendChild(table);

    table.style.marginTop = "10px";
    // table.style.marginRight = "10px";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    // Add style to create space between cells
    var cells = table.getElementsByTagName("td");
    for (var k = 0; k < cells.length; k++) {
        cells[k].style.padding = "8px";
    }
}

function getCookie(name) {
    var value = "";
    try {
        value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
        return value
    } catch (err) {
        return false
    }
}
function setUsername() {
    username = getCookie('username');
    var x = document.getElementById("username");
    x.innerHTML = username;

    timer = setInterval(loadLog, 1000);//Reload file every 3000 ms
    document.getElementById("submitmsg").disabled = false;
    readLog();
}


function loadLog() {
    readLog();
}

function sendMsg() {
    //get msg
    var text = document.getElementById("userMsg").value;
    document.getElementById("userMsg").value = "";
    writeLog(text);
}

//ทำให้สมบูรณ์
const writeLog = async (msg) => {
    const d = new Date();

    try {
        const response = await fetch("/outmsg", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                user: username,
                message: msg
            })
        });
    } catch (err) {
        console.error(err);
    }
};

//ทำให้สมบูรณ์
const readLog = (async () => {
    let response = await fetch("/inmsg");
    let responsedata = await response.json();
    postMsg(responsedata);
})

// รับ msg ที่เป็น JS object ที่อ่านมาได้จาก file
function postMsg(msg) {
    var x = document.getElementById("chatbox");
    while (x.firstChild) {
        x.removeChild(x.lastChild);
    }

    if (msg.dataMsg && msg.dataMsg.length > 0) {
        for (var item of msg.dataMsg) {
            var div_d = document.createElement("div");
            div_d.className = "message";

            // แปลงเวลาใน item.reg_date เป็นวัตถุ Date
            var regDate = new Date(item.reg_date);

            // กำหนดรูปแบบเวลาที่ต้องการ
            var optionsDate = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            };

            var optionsTime = {
                hour: 'numeric',
                minute: 'numeric',
            };


            var dateStr = regDate.toLocaleString('en-US', optionsDate);
            var timeStr = regDate.toLocaleString('en-US', optionsTime);
            var timemsg = document.createTextNode("[" + dateStr + "] [" + timeStr + "] ");

            var boldmsg = document.createElement("b");
            boldmsg.innerHTML = item.username || "Undefined User";

            var textmsg = document.createTextNode(": " + (item.text || ""));

            div_d.append(timemsg, boldmsg, textmsg);
            div_d.appendChild(document.createElement("br"));
            x.appendChild(div_d);
        }
    }
    checkScroll();
}
function checkScroll() {
    var chatbox = document.getElementById('chatbox');
    var scroll = chatbox.scrollTop + chatbox.clientHeight === chatbox.scrollHeight;
    if (!scroll) {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}
