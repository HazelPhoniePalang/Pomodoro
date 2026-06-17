let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isRunning = false;
let currentMode = "work";
let tasks = []; // Store tasks with details

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const progressBar = document.getElementById("progress-bar");
const taskInput = document.getElementById("task-input");
const taskTableBody = document.getElementById("task-table-body");
const taskStats = document.getElementById("task-stats");

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

function playRingSound() {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Play 3 beeps for better alert
    for (let i = 0; i < 3; i++) {
      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);

      const startTime = audioContext.currentTime + i * 0.3;
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, startTime);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    }

    // Fade out smoothly
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1,
    );
  } catch (e) {
    console.log("Audio not available");
  }
}

function toggleTimer() {
  // if (!taskInput.value.trim() && !isRunning) {
  //   alert("Please enter a task first!");
  //   return;
  // }

  if (isRunning) {
    clearInterval(timer);
    startBtn.textContent = "Start";
    startBtn.classList.replace("btn-danger", "btn-success");
  } else {
    // Add task if it's a new one (work session only)
    if (currentMode === "work" && taskInput.value.trim()) {
      addTaskManually();
    }

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        // ⭐ TIMER FINISHED - PLAY THE RING SOUND!
        clearInterval(timer);
        playRingSound();

        // Auto-switch to break or back to work
        switchMode();
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

  // Clear task input on break modes
  if (mode !== "work") {
    taskInput.value = "";
  }
}

function switchMode() {
  if (currentMode === "work") {
    alert("Great work! Time for a break 🎉");
    setMode("short");
  } else {
    alert("Break over! Ready to work again? 💪");
    setMode("work");
  }
}

function addTaskManually() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    alert("Please enter a task!");
    return;
  }

  // Create task object
  const task = {
    id: Date.now(), // Unique ID using timestamp
    text: taskText,
    completed: false,
    addedTime: new Date().toLocaleTimeString(),
  };

  // Add to tasks array
  tasks.push(task);

  // Clear input
  taskInput.value = "";

  // Update table
  renderTable();
}

function toggleTaskComplete(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTable();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderTable();
}

function renderTable() {
  // Clear existing rows
  taskTableBody.innerHTML = "";

  if (tasks.length === 0) {
    taskTableBody.innerHTML =
      '<tr><td colspan="4" class="text-muted text-center py-4">No tasks yet. Add one to get started! 🚀</td></tr>';
    taskStats.textContent = "0 tasks • 0 completed";
    return;
  }

  // Add each task as a row
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.className = task.completed ? "completed" : "";
    row.id = `task-${task.id}`;

    row.innerHTML = `
      <td style="text-align: center;">
        <input 
          type="checkbox" 
          class="form-check-input task-checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTaskComplete(${task.id})"
        />
      </td>
      <td>${task.text}</td>
      <td style="text-align: center; font-size: 12px; color: #6c757d;">
        ${task.addedTime}
      </td>
      <td style="text-align: center;">
        <button 
          class="btn btn-danger btn-sm btn-delete"
          onclick="deleteTask(${task.id})"
        >
          Delete
        </button>
      </td>
    `;

    taskTableBody.appendChild(row);
  });

  // Update task count
  const completedCount = tasks.filter((t) => t.completed).length;
  taskStats.textContent = `${tasks.length} tasks • ${completedCount} completed`;
}

// Initialize
updateDisplay();
renderTable();
