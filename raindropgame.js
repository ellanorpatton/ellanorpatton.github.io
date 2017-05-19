var currentDrop = 0;
var fast = 1;
var points = 0;
var lastDropCaught = -1;
var life = 3;
var loseLife = -1;

function preload() {
  backImg = loadImage("sky.jpg");
  raindropImg = loadImage("raindrop.png");
  bucketBottomImg = loadImage("bucketbottom.png");
  bucketTopImg = loadImage("buckettop.png");
}

function setup() {
  createCanvas(600, 600);
  for (var i = 0; i < 10; i++) {
    raindrops.push(new Raindrop());
  }
}

function draw(){
  if (life > 0){
    bucket.display();

    for (var i = 0; i < raindrops.length; i++) {
      raindrops[i].display();
      raindrops[i].move();
    }

// EVERY 200 FRAMES WE DROP A DROPLET
    if (frameCount % 200  === 1) {
      raindrops[currentDrop].isFalling = true;
      currentDrop++;
      if(currentDrop === 9){
        currentDrop = 0;
      }
    }

    var startBucket = millis();
    fillBucket();

//this prints to the console how long it takes to run the startBucket function. if the program is running slowly, it is probably because startBucket is taking too long.
    console.log((millis()-startBucket) + "time of fill bucket");

    keyCheck();
    score();
    lives();

    textSize(20);
    textFont("Georgia");
    fill(255, 80, 140);

    text("Score:", 400, 50);
    text("Lives:", 400, 80);
    text(points, 460, 50);
    text(life, 460, 80);
  }

  else{
    image(backImg, 0, 0, windowWidth, windowHeight);
    textSize(50);
    fill(255, 80, 140);
    textFont("Georgia");
    text("Game Over!", 50, 200);
  }
}

var bucket = {
  x: 250,
  display: function() {
    image(backImg, 0, 0, windowWidth, windowHeight);
    image(bucketTopImg, this.x, 500, 100, 100);
  }
}

function keyCheck() {
//I make the raindrop move with the bucket until it goes off of the screen so that it will not  go out of the bucket when the bucket moves to reach the next drop.
  if(bucket.x<500 && bucket.x>0){
    if (keyIsDown(LEFT_ARROW)){
      bucket.x -= 3;
      moveRaindropWithBucket(-3);
    }
    else if(keyIsDown(RIGHT_ARROW)){
      bucket.x += 3;
      moveRaindropWithBucket(3);
    }
  }
  else if(bucket.x>499){
    if (keyIsDown(LEFT_ARROW)){
      bucket.x -= 3;
    }
  }
  else if(bucket.x<1){
    if(keyIsDown(RIGHT_ARROW)){
      bucket.x += 3;
    }
  }
}

//object constructor which creates an array of raindrops:
var raindrops  = [];

function Raindrop(){
  this.x = random(560);
  this.y = -40;

  this.isFalling = false;
  this.isHidden = false;
  this.isLockedOnBucket = false;

  this.display = function() {
    if (this.isHidden === false){
      image(raindropImg, this.x, this.y, 40, 40);
    }
    image(bucketBottomImg, bucket.x, 500, 100, 100);
  }

  this.move = function() {
    if (this.isFalling === true){
      this.y += fast;
//every 10 frames, the speed increases by a very small amount
    }
    if(frameCount % 10 === 0){
      fast+=.0003;
    }
//when the raindrop reaches the bottom of the screen, it stops falling and resets at the top as a new drop
    if(this.y > 600){
      this.isFalling = false;
      this.y = -50;
      this.isHidden = false;
      this.isLockedOnBucket = false;
    }
    if(this.x > bucket.x && this.x < bucket.x+60 && this.y > 520){
      this.isHidden = true;
    }
    if(this.x > bucket.x+10 && this.x < bucket.x+60 && this.y > 480){
      this.isLockedOnBucket = true;
    }
  }
}

function moveRaindropWithBucket(moveDirection) {
  for (var i = 0; i < raindrops.length; i++) {
    if (raindrops[i].isLockedOnBucket === true) {
      raindrops[i].x += moveDirection;
      console.log("should be moving!");
    }
  }
}

function fillBucket(){
  for (var i = 0; i < raindrops.length; i++) {
    if(raindrops[i].x > bucket.x && raindrops[i].x < bucket.x+60 && raindrops[i].y > 550){
      console.log("Good!");
      textSize(40);
      text("Good job!", 100, 200);
      fill(255, 80, 140);
      textFont("Georgia");
    }
    else if (raindrops[i].x < bucket.x && raindrops[i].y > 550){
      console.log("Bad!");
      textSize(40);
      text("Bad!", 100, 200);
      fill(255, 80, 140);
      textFont("Georgia");
    }
    else if(raindrops[i].x > bucket.x+60 && raindrops[i].y > 550){
      console.log("Bad!");
      textSize(40);
      text("Bad!", 100, 200);
      fill(255, 80, 140);
      textFont("Georgia");
    }
  }
}

//when a drop goes into the bucket, the score increases by 1
function score(){
  for (var i = 0; i < raindrops.length; i++) {
    if(raindrops[i].x > bucket.x && raindrops[i].x < bucket.x+60 && raindrops[i].y > 550){
      if(i === lastDropCaught){
      }
      else{
        points++;
      }
      lastDropCaught = i;
    }
  }
}

//when the drop reaches the ground and is not in the bucket, you lose a life
function lives(){
  for (var i = 0; i < raindrops.length; i++) {
    if (raindrops[i].x < bucket.x && raindrops[i].y > 550){
      if(i === loseLife){
      }
      else{
        life --;
      }
      loseLife = i;
    }
    else if(raindrops[i].x > bucket.x+60 && raindrops[i].y > 550){
      if(i === loseLife){
      }
      else{
        life --;
      }
      loseLife = i;
    }
  }
}
