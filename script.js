const menu = document.getElementById("menu");
const playBtn = document.getElementById("play-btn");
const helpBtn = document.getElementById("help-btn");
const backBtn = document.getElementById("back-btn");
const help = document.getElementById("help");
const gameDiv = document.getElementById("game");
const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const clouds = document.querySelector(".clouds");
const gameOverScreen = document.getElementById("game-over");

const scoreDisplay = document.createElement("div");
scoreDisplay.classList.add("score");
document.body.appendChild(scoreDisplay);
const scoreFinal = document.createElement("h2");
scoreFinal.style.color = "#fff";
scoreFinal.style.marginTop = "2rem";
gameOverScreen.appendChild(scoreFinal);

const audioStart = new Audio("./sound/audio_theme.mp3");
const audioGameOver = new Audio("./sound/audio_gameover.mp3");
const audioJump = new Audio("./sound/smb_jump.mp3");

let loopInterval = null,
  scoreInterval = null,
  score = 0;
let gameState = "init"; // init, running, gameover

function updateScore() {
  score++;
  scoreDisplay.textContent = `Pontuação: ${score}`;
}

function resetPipe() {
  pipe.classList.remove("pipe-animation");
  pipe.style.right = "-80px";
  void pipe.offsetWidth;
  pipe.classList.add("pipe-animation");
}

function startGame() {
  if (gameState === "running") return;
  clearInterval(loopInterval);
  clearInterval(scoreInterval);
  score = 0;
  updateScore();
  menu.style.display = "none";
  help.style.display = "none";
  gameDiv.style.display = "block";
  gameOverScreen.style.display = "none";

  mario.src = "./img/mario.gif";
  mario.style.width = "150px";
  mario.style.bottom = "0";
  mario.style.marginLeft = "0";
  clouds.style.animationPlayState = "running";

  audioGameOver.pause();
  audioGameOver.currentTime = 0;
  audioStart.play();
  audioStart.currentTime = 0;

  resetPipe();

  loopInterval = setInterval(checkCollision, 10);
  scoreInterval = setInterval(updateScore, 100);
  gameState = "running";
}

function gameOver() {
  if (gameState !== "running") return;
  gameState = "gameover";
  clearInterval(loopInterval);
  clearInterval(scoreInterval);

  pipe.classList.remove("pipe-animation");
  pipe.style.right = "";
  clouds.style.animationPlayState = "paused";

  mario.src = "./img/game-over.png";
  mario.style.width = "80px";
  mario.style.marginLeft = "50px";

  audioStart.pause();
  audioGameOver.play();

  gameOverScreen.style.display = "flex";
  scoreFinal.textContent = `Pontuação final: ${score}`;
}

function jump() {
  if (gameState !== "running") return;
  if (!mario.classList.contains("jump")) {
    mario.classList.add("jump");
    audioJump.play();
    setTimeout(() => mario.classList.remove("jump"), 800);
  }
}

function checkCollision() {
  const pipePos = pipe.offsetLeft;
  const marioBottom = parseInt(window.getComputedStyle(mario).bottom);
  if (pipePos <= 120 && pipePos > 0 && marioBottom < 80) {
    gameOver();
  }
}

// Eventos
playBtn.addEventListener("click", startGame);
helpBtn.addEventListener("click", () => {
  menu.style.display = "none";
  help.style.display = "flex";
});
backBtn.addEventListener("click", () => {
  menu.style.display = "flex";
  help.style.display = "none";
});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === "ArrowUp") jump();
  if (
    (e.code === "Enter" || e.code === "NumpadEnter") &&
    gameState !== "running"
  )
    startGame();
});
document.addEventListener("touchstart", jump);

function restartGame() {
  startGame(); // reinicia o jogo
}

document.getElementById("restart-btn").addEventListener("click", restartGame);

document.getElementById("touch-area").addEventListener("touchstart", () => {
  jump();
});
