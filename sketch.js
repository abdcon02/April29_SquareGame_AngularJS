var squid;
var score = 0;
var highscores = [];
var timer;
var gameState = "pre";
var gameTimer = null;

function preload() {
  img = loadImage("img/squid.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //set fill color to white, no border
  fill(255);
  noStroke();
}

//if we pushed space, start the game
function startGame() {
  if(gameState === "pre") {
    gameState = "playing";
    timer = 30;
    //check if a timer is already started
    if(gameTimer !== null) {
      clearInterval(gameTimer); //clear it
    }
    //make a new one
    gameTimer = setInterval(countdown, 1000);
    score = 0;
    squid = new Target();
  }
}

//checks if we have time left and ticks down
//ends the game when it reaches zero
function countdown() {
  if( timer > 0) {
    timer -= 1;
  } else {
    endGame();
  }
}

//when player hits ESC or game is over
function endGame() {
  gameState = "post";
  //stop the timer
  clearInterval(gameTimer);

  //add score then sort the highscores by highest
  highscores.push(score);
  highscores = highscores.sort(function(a, b) { return b - a;});
}

function resetGame() {
  // if(gameState === "post") {
    gameState = "pre";
  // }
}

function keyPressed() {
  if(keyCode === 32) {
    startGame();
  } else if(keyCode === ESCAPE) {
    resetGame();
  }
}

//every frame
function draw() {
  background('blue'); //paint over last frame
  textSize(32);

  //it's pregame
  if(gameState === "pre") {
    textAlign(CENTER);
    text("Keep the cursor over the squid to earn points.\nSee how many you can get before the timer runs out!\n\nSPACE to start!", width/2, height/4);
  }
  //if we are playing the game
  else if(gameState === "playing") {
    squid.move();
    squid.display();
    fill(255);
    textAlign(LEFT);
    text("Score: " + score, 50, windowHeight - 50);
    text("Timer: " + timer, windowWidth - 175, windowHeight - 50);
  }
  //it's game over
  else {
    textAlign(CENTER);
    text("Time's up!\nYour score is " + score, width/2, 100);
    text("The high score is " + highscores[0], width/2, 250);
    text("ESC to restart.", width/2, 350);
  }
}

//update the canvas size to be the new size of the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Target() {
  //starting pos
  this.x = width/2;
  this.y = height/2;
  this.maxSpeed = 10;
  this.diameter = 50;
  this.variation = 0.01;
  this.startingDirection = [-1, 1];
  var randNumX = round(random(0, 1));
  var randNumY = round(random(0, 1));
  console.log(randNumX + " " + randNumY);
  this.Xvelocity = this.startingDirection[randNumX];
  this.Yvelocity = this.startingDirection[randNumY];

  // this.Xvelocity = 0;
  // this.Yvelocity = 0;

  this.move = function() {

    //prevents the box from going off the screen
    if (this.x > windowWidth - this.diameter) {
      this.Xvelocity *= -1 + random(-0.1, 0.1);
      this.x = windowWidth - this.diameter - 1;
    }
    if (this.x < 0) {
      this.Xvelocity *= -1 + random(-0.1, 0.1);
      this.x = 1;
    }
    if (this.y > windowHeight - this.diameter) {
      this.Yvelocity *= -1 + random(-0.1, 0.1);
      this.y = windowHeight - this.diameter -1;
    }
    if (this.y < 0) {
      this.Yvelocity *= -1 + random(-0.1, 0.1);
      this.y = 1;
    }

    //checks if the mouse is inside the box
    //gives points if it is
    if (mouseX >= this.x && mouseX <= this.x + this.diameter && mouseY >= this.y && mouseY <= this.y + this.diameter ) {
      this.Xvelocity *= (1 + this.variation);
      this.Yvelocity *= (1 + this.variation);
      score++;

      //add more speed and points if we are in the red box
      if (mouseX >= this.x + 18.75 && mouseX <= this.x + 31.25 && mouseY >= this.y + 18.75 && mouseY <= this.y + 31.25) {
        this.Xvelocity *= (1.01);
        this.Yvelocity *= (1.01);
        score += 2;
      }
    }
    else if(this.Xvelocity > 1 && this.Yvelocity > 1) {
      //if not slow the box down
      this.Xvelocity *= (1 - this.variation);
      this.Yvelocity *= (1 - this.variation);
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
