//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context; // use for drawing on canvase

//bird setup
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let velocityX = -1.8; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.18;

let gameOver = false;
let score = 0;
let highScore = 0;

// canvas setup
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  //draw flappy bird
  //   context.fillStyle = "green";
  //   context.fillRect(bird.x, bird.y, bird.width, bird.height);

  // load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  // load pipe image
  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);

  setInterval(placePipes, 1500); // every 1.5 seconds

  // Event listener for mouse click
  document.addEventListener("click", moveBird);

  document.addEventListener("keydown", moveBird); // to move the bird
};

// use to update the frames  of canvas or Main game loop
function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  // clear frame when new frame updated
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity; // gravity effect
  //   bird.y += velocityY;

  // to make sure the bird is not going out of the board on top
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // drop collision  detection
  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes -> will draw pipes on the board
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX; // will shift pipes to the left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    // to increase score
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are two pipes! 0.5*2 = 1, 1 for each set of pipes
      highScore = Math.max(score, highScore);
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //removes first element from array
  }

  // score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  // high score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(highScore, 315, 45);

  if (gameOver) {
    // context.fillStyle = "red";
    context.font = "45px sans-serif";
    context.fillText("GAME OVER", 35, 290);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2); // change the y position of the pipes
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  //bottom pipe
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(event) {
  if (
    event.code == "Space" ||
    event.code == "ArrowUp" ||
    event.code == "KeyX" ||
    event.type == "click"
  ) {
    velocityY = -6;

    //reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      gameOver = false;
      score = 0;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
