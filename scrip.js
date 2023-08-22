// Seleciona elementos da página
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i"); // Seleciona os botões de controle

// Variáveis de controle do jogo
let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtém o placar máximo do armazenamento local ou define como 0
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `Pontuação Máxima: ${highScore}`;

// Gera uma posição aleatória para a comida entre 1 e 30
const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

// Lida com o fim do jogo
const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Fim do Jogo! Pressione OK para jogar novamente...");
  location.reload(); // Recarrega a página para reiniciar o jogo
};

// Altera a direção da cobra com base na tecla pressionada
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Altera a direção ao clicar em cada botão de controle
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

// Inicializa o jogo
const initGame = () => {
  if (gameOver) return handleGameOver(); // Encerra o jogo se acabou
  let html = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`; // Adiciona a comida ao HTML

  // Quando a cobra come a comida
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition(); // Gera nova posição para a comida
    snakeBody.push([snakeY, snakeX]); // Adiciona segmento à cobra
    score++;
    highScore = score >= highScore ? score : highScore; // Atualiza a pontuação máxima

    localStorage.setItem("high-score", highScore); // Salva a nova pontuação máxima no armazenamento local
    scoreElement.innerText = `Pontuação: ${score}`;
    highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;
  }

  // Atualiza a posição da cabeça da cobra
  snakeX += velocityX;
  snakeY += velocityY;

  // Atualiza o corpo da cobra
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1].slice(); // Move cada segmento do corpo
  }
  snakeBody[0] = [snakeY, snakeX]; // Atualiza a posição da cabeça

  // Verifica se a cobra atingiu as paredes ou a si mesma
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    return handleGameOver(); // Encerra o jogo
  }

  // Adiciona uma div para cada segmento do corpo da cobra
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
  }

  playBoard.innerHTML = html; // Atualiza o tabuleiro do jogo no HTML
};

updateFoodPosition(); // Gera posição inicial da comida
setIntervalId = setInterval(initGame, 100); // Inicia o loop do jogo a cada 100ms
document.addEventListener("keydown", changeDirection); // Captura eventos de tecla para mudar a direção da cobra
