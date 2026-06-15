let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isRunning = false;
let currentMode = "work";

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const progressBar = document.getElementById("progress-bar");

const modes = {
  work: 1500,
  short: 300,
  long: 900,
};

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Update Progress Bar
  let totalTime = modes[currentMode];
  let percentage = (timeLeft / totalTime) * 100;
  progressBar.style.width = `${percentage}%`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    startBtn.textContent = "Start";
    startBtn.classList.replace("btn-danger", "btn-success");
  } else {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        alert("Time's up!");
        resetTimer();
      }
    }, 1000);
    startBtn.textContent = "Pause";
    startBtn.classList.replace("btn-success", "btn-danger");
  }
  isRunning = !isRunning;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = modes[currentMode];
  startBtn.textContent = "Start";
  startBtn.classList.replace("btn-danger", "btn-success");
  updateDisplay();
}

function setMode(mode) {
  currentMode = mode;
  // Update active button UI
  document.querySelectorAll(".btn-group .btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(mode))
      btn.classList.add("active");
  });
  resetTimer();
}

// Initialize
updateDisplay();
