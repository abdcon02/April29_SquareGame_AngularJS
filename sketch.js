var squid;
var score = 0;
var highscores = [];
var timer;
var gameOver = false;
var startGame = false;
var gameTimer = null;

function preload() {
  img = loadImage("img/squid.png");
}

function countdown() {
    if (timer > 0) {
        timer -= 1;
    } else {
        highscores.push(score);
        gameOver = true;
        startGame = false;

        var sorted = highscores.sort(function(a, b) { return b - a;});
        textAlign(CENTER);
        text("Time's up! Your score is " + score + "\nClick to restart.", width/2, 100);
        text("The high score is " + sorted[0], width/2, 250);
    }
}

function startTimer() {
    if(gameTimer !== null) {
        clearInterval(gameTimer);
    }

    gameTimer = setInterval(countdown, 1000);
}

function mouseClicked(){
    if(startGame === false) {
        timer = 30;
        startGame = true;
        gameOver = false;
        score = 0;
        startTimer();
        squid = new Target();
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background('blue');
    textSize(32);
    fill(255);
    noStroke();
    textAlign(CENTER);
    text("Keep the cursor over the squid to earn points.\nSee how many you can get before the timer runs out!\n\nClick to start!", width/2, height/2 - 150);
}

function draw() {

    if ((!gameOver) && (startGame)) {
        background('blue');
        squid.move();
        squid.display();
        fill(255);
        textAlign(LEFT);
        text("Score: " + score, 50, windowHeight - 50);
        text("Timer: " + timer, windowWidth - 175, windowHeight - 50);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background('blue');
    textSize(32);
    squid.display();
    fill(255);
    text("Score: " + score, 50, windowHeight - 50);
    text("Timer: " + timer, windowWidth - 175, windowHeight - 50);
}

function Target(){
    this.x = width/2;
    this.y = height/2;
    this.maxSpeed = 15;
    this.diameter = 50;
    this.variation = 0.01;
    var randNumX = random(-1, 1);
    var randNumY = random(-1, 1);
    //
    // this.Xvelocity = 0;
    // this.Yvelocity = 0;
    //
    //
    this.Xvelocity = (randNumX == 0) ? 1 : randNumX;
    this.Yvelocity = (randNumY == 0) ? 1 : randNumY;
    this.acceleration;

    this.move = function() {

        //prevents the box from going off the screen
        if (this.x > windowWidth - this.diameter) {
            //add slight variation
            this.Xvelocity *= -1;
            this.x = windowWidth - this.diameter - 1;
        }
        if (this.x < 0) {
            this.Xvelocity *= -1;
            this.x = 1;
        }
        if (this.y > windowHeight - this.diameter) {
            this.Yvelocity *= -1;
            this.y = windowHeight - this.diameter -1;
        }
        if (this.y < 0) {
            this.Yvelocity *= -1;
            this.y = 1;
        }

        //checks if the cursor is inside(/near) the squid + awards points
        if (mouseX >= this.x && mouseX <= this.x + this.diameter && mouseY >= this.y && mouseY <= this.y + this.diameter ) {
            this.Xvelocity *= (1 + random(0, this.variation));
            this.Yvelocity *= (1 + random(0, this.variation));
            score++;
        }

        //triple points if the cursor is over the squid's eye
        if (mouseX >= this.x + 18.75 && mouseX <= this.x + 31.25 && mouseY >= this.y + 18.75 && mouseY <= this.y + 31.25) {
            this.Xvelocity *= (1 + random(0, this.variation));
            this.Yvelocity *= (1 + random(0, this.variation));
            score+=2;
        }
        //caps the velocity at maxSpeed
        if(this.Xvelocity > this.maxSpeed) {
            this.Xvelocity = this.maxSpeed;
        }
        if(this.Yvelocity > this.maxSpeed) {
            this.Yvelocity = this.maxSpeed;
        }
        this.x += this.Xvelocity;
        this.y += this.Yvelocity;
    };

    this.display = function() {
        image(img, this.x, this.y);
    }
}
