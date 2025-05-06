const board = document.getElementById('board');
const status = document.getElementById('status');
const formOverlay = document.getElementById('playerForm');

let currentPlayer = 'X';
let gameActive = false;
let gameState = Array(9).fill("");
let playerNames = { X: '', O: '' };

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function startGame() {
  const xName = document.getElementById('playerX').value.trim();
  const oName = document.getElementById('playerO').value.trim();

  if (!xName || !oName) {
    alert('Please enter both player names!');
    return;
  }

  playerNames.X = xName;
  playerNames.O = oName;
  formOverlay.style.display = 'none';
  status.textContent = `Game Starting... ${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
  gameActive = true;
  renderBoard();
}

function handleCellClick(index) {
  if (!gameActive || gameState[index]) return;

  gameState[index] = currentPlayer;
  renderBoard();
  checkResult();
}

function renderBoard() {
  board.innerHTML = '';
  gameState.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (value) {
      cell.classList.add('taken');
      cell.textContent = value;
    }
    cell.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cell);
  });
}

function checkResult() {
  let roundWon = false;

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    status.textContent = `🎉 Congratulations ${playerNames[currentPlayer]}! You Win!`;
    gameActive = false;
    startConfetti();
    return;
  }

  if (!gameState.includes("")) {
    status.textContent = `It's a Tie! Better luck next time both 😅`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
}

function resetGame() {
  currentPlayer = 'X';
  gameState = Array(9).fill("");
  gameActive = true;
  stopConfetti();
  status.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
  renderBoard();
}

renderBoard();

// Confetti celebration
function startConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti({
      particleCount: 50,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      ...defaults
    });
  }, 200);
}

function stopConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
