const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const muteBtn = document.querySelector("#mute-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");
const bgMusic = new Audio("sounds/bg-music.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.3;

let turnO = true;
let count = 0;
let muted = false;
let musicStarted = false;

const winPatterns = [
  [0, 1, 2], [0, 3, 6], [0, 4, 8],
  [1, 4, 7], [2, 5, 8], [2, 4, 6],
  [3, 4, 5], [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  msgContainer.classList.add("hide");
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!musicStarted) {
      bgMusic.play().catch(() => {});
      musicStarted = true;
    }

    if (!muted) clickSound.play();

    box.innerText = turnO ? "O" : "X";
    turnO = !turnO;
    box.disabled = true;
    count++;

    const winnerFound = checkWinner();
    if (count === 9 && !winnerFound) {
      gameDraw();
    }
  });
});

const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const val1 = boxes[a].innerText;
    const val2 = boxes[b].innerText;
    const val3 = boxes[c].innerText;

    if (val1 && val1 === val2 && val2 === val3) {
      showWinner(val1);
      return true;
    }
  }
  return false;
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  boxes.forEach(box => box.disabled = true);
  if (!muted) winSound.play();
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  boxes.forEach(box => box.disabled = true);
  if (!muted) drawSound.play();
};

muteBtn.addEventListener("click", () => {
  muted = !muted;
  muteBtn.textContent = muted ? "🔇" : "🔊";

  [clickSound, winSound, drawSound, bgMusic].forEach(sound => {
    sound.muted = muted;
  });
});

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
