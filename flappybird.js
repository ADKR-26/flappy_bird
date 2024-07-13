// board setup
let board;
let boardWidth = 360;
let boardHeight = 640;
let context; // use for drawing on canvas

// bird setup
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

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// game physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = 0;

// canvas setup
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  // load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  // load pipe images
  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);

  setInterval(placePipes, 1500); // every 1.5 seconds

  document.addEventListener("click", moveBird);
  document.addEventListener("keydown", moveBird); // to move the bird
};

// main game loop
function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  // bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      highScore = Math.max(score, highScore);
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
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
    context.font = "45px sans-serif";
    context.fillText("GAME OVER", 35, 290);
  }

  // Run the AI
  auto_AI();
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
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

function auto_AI() {
  if (pipeArray.length > 0) {
    let nearestPipe = pipeArray[0];
    for (let i = 0; i < pipeArray.length; i++) {
      if (pipeArray[i].x + pipeWidth > bird.x) {
        nearestPipe = pipeArray[i];
        break;
      }
    }

    let pipeMiddle = nearestPipe.y + pipeHeight + (board.height / 4) / 2;

    if (bird.y > pipeMiddle) {
      moveBird({ code: "Space" });
    }
  }
}
