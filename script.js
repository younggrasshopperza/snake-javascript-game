const gameBoard = document.getElementById("game-board");
const scoreBoard = document.getElementById("score-board");
const highScoreBoard = document.getElementById("high-score-board");
const menu = document.getElementById("menu");
const classicModeBtn = document.getElementById("classic-mode");
const spaceModeBtn = document.getElementById("space-mode");

let snake = [{x: 10, y: 10}];
let food = {x: 20, y: 20};
let direction = "right";
let score = 0;
let paused = false;
let gameMode = "";

let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let userName = localStorage.getItem("userName") || "";
highScoreBoard.textContent = `High Score: ${highScore} - ${userName}`;

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreBoard.textContent = `High Score: ${highScore}`;
  }
}

function render() {
  gameBoard.innerHTML = "";

  snake.forEach((segment) => {
    const snakeSegment = document.createElement("div");
    snakeSegment.className = "snake";
    snakeSegment.style.left = segment.x + "px";
    snakeSegment.style.top = segment.y + "px";
    gameBoard.appendChild(snakeSegment);
  });

  const foodElement = document.createElement("div");
  foodElement.className = "food";
  foodElement.style.left = food.x + "px";
  foodElement.style.top = food.y + "px";
  gameBoard.appendChild(foodElement);

  scoreBoard.textContent = `Score: ${score}`;
}

function move() {
    if (paused) {
      return;
    }
  
    const head = {x: snake[0].x, y: snake[0].y};
  
    switch (direction) {
      case "up":
        head.y -= 10;
        break;
      case "down":
        head.y += 10;
        break;
      case "left":
        head.x -= 10;
        break;
      case "right":
        head.x += 10;
        break;
    }
  
    if (gameMode === "classic") {
    if (head.x < 0 || head.x >= 490 || head.y < 0 || head.y >= 490) {
        alert("Game over!");
        restartGame();
        return;
    }
    } else if (gameMode === "space") {
        if (head.x < 0) head.x = 480;
        if (head.x >= 490) head.x = 0;
        if (head.y < 0) head.y = 480;
        if (head.y >= 490) head.y = 0;
    }

  snake.unshift(head);

  if (snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
    alert("Game over!");
    restartGame();
  } else {
    if (head.x === food.x && head.y === food.y) {
      food = {x: Math.floor(Math.random() * 50) * 10, y: Math.floor(Math.random() * 50) * 10};
      score++;
      updateHighScore();
    } else {
      snake.pop();
    }

    render();

    clearInterval(gameLoop);
    gameLoop = setInterval(move, 100 - Math.min(score * 2, 70));
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case "ArrowDown":
      if (direction !== "up") {
        direction = "down";
      }
      break;
    case "ArrowLeft":
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case "ArrowRight":
      if (direction !== "left") {
        direction = "right";
      }
      break;
    case " ":
      paused = !paused;
      break;
  }
});

function selectButton(button) {
    classicModeBtn.classList.remove("selected");
    spaceModeBtn.classList.remove("selected");
    button.classList.add("selected");
  }
  
  classicModeBtn.addEventListener("click", () => {
    gameMode = "classic";
    selectButton(classicModeBtn);
    startGame();
  });
  
  spaceModeBtn.addEventListener("click", () => {
    gameMode = "space";
    selectButton(spaceModeBtn);
    startGame();
  });

function startGame() {
  gameLoop = setInterval(move, 100);
}

function restartGame() {
    clearInterval(gameLoop);
    snake = [{x: 250, y: 250}];
    food = {x: 20, y: 20};
    direction = "right";
    score = 0;
    paused = false;
    render();
    promptUserName();
  }

let highScoreName = document.getElementById("high-score-name");
let highScoreValue = document.getElementById("high-score-value");

let newHighScore = false;

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    newHighScore = true;
  }
}

function promptUserName() {
  if (newHighScore) {
    userName = prompt("New high score! Please enter your name:");
    if (userName === null || userName.trim() === "") {
      userName = "Anonymous";
    }
    highScore = parseInt(localStorage.getItem("highScore")) || 0;
    userName = localStorage.getItem("userName") || "";
    highScoreBoard.textContent = `High Score: ${highScore} - ${userName}`;
    localStorage.setItem("highScore", highScore);
    localStorage.setItem("userName", userName);
    highScoreName.textContent = userName;
    highScoreValue.textContent = highScore;
    newHighScore = false;
  }
}

let touchStartX = null;
let touchStartY = null;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "right") {
      direction = "left";
    } else if (diffX < 0 && direction !== "left") {
      direction = "right";
    }
  } else {
    if (diffY > 0 && direction !== "down") {
      direction = "up";
    } else if (diffY < 0 && direction !== "up") {
      direction = "down";
    }
  }

  touchStartX = null;
  touchStartY = null;
}

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

