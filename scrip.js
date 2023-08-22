const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i"); // Changed querySelector to querySelectorAll

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// get high score from local Storage

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

// pass a random number between 1 and 30 as food position

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to Replay...");
  location.reload();
};

// change velocity value based on key press

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    // Corrected the condition
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    // Corrected the condition
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    // Corrected the condition
    velocityX = 1;
    velocityY = 0;
  }
};

// Change Direction on each key click

controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

  // when snake eats food

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([snakeY, snakeX]); // Corrected the order of coordinates
    score++;
    highScore = score >= highScore ? score : highScore;

    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  // update snake head

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1].slice(); // Corrected the assignment
  }

  snakeBody[0] = [snakeY, snakeX]; // Corrected the assignment

  // check if snake body is out of walls

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    return handleGameOver(); // Handled game over immediately
  }

  // add div for each part of snake body

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`; // Corrected the style property
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keydown", changeDirection); // Changed to keydown event
