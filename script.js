// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// Restart Button
// let restartButtonWidth = 40;
// let restartButtonHeight = 40;
// let restartButtonX = boardWidth/2.5;
// let restartButtonY = boardHeight/1.8;
// let restartButtonImg;

// let restartButton = {
//     x : restartButtonX,
//     y : restartButtonY,
//     width : restartButtonWidth,
//     height : restartButtonHeight
// }

// Pipes
let pipeArray = [];
let pipeWidth = 64; // Width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2; // Pipes moving left side.
let velocityY = 0; // Bird jump speed.
let gravity = 0.4;

let gameOver = false;
let highScore = 0;
let currentScore = 0;

window.onload = function() {
    // const restartButton = document.getElementById("restartButton");
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

    // draw flappy bird

    birdImg = new Image();
    birdImg.src = "./Images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./Images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); 
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return ;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height-28) {
        gameOver = true;
    }

    // Pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed  && bird.x > pipe.x + pipe.width){
            currentScore += 0.5;
            pipe.passed = true; 
        }

        if(highScore < currentScore) {
            highScore = currentScore;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    // Clear Pipe
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    if(!gameOver) {
        context.fillStyle = "white";
        context.font = "30px sans-serif";
        context.fillText("HI", 180, 45);
        context.fillText(highScore, 230, 45);
        context.fillText(currentScore, 290, 45);
    } 

    // restartButtonImg = new Image();
    // restartButtonImg.src = "./Images/restart.svg";

    if(gameOver) {
        context.fillText("GAME OVER", 45, 300);
        context.font = "35px sans-serif";
        context.fillText("High Score: ", 45, 340);
        context.fillText(highScore, 230, 340);
        context.fillText("Current Score: ", 45, 380);
        context.fillText(currentScore, 280, 380);
        context.font = "29px sans-serif";
        context.fillText("Press Enter to Restart", 45, 420);
        // context.drawImage(restartButtonImg, restartButton.x, restartButton.y, restartButton.width, restartButton.height);
    }
}

function placePipes() {
    if(gameOver) {
        return ;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth, 
        height : pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.type == "click") {
        velocityY = -6;
    }
        
    // Reset Game
    if((e.code == "Enter" || e.type == "click") && gameOver) {
        bird.y = birdY;
        pipeArray = [];
        velocityY = -4;
        currentScore = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}