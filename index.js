window.addEventListener("DOMContentLoaded", () => {
  loadQuote();
  loadTodos();
  updateTimerDisplay();
  setupPlaylist();
  loadDarkMode();
});

// === Quote Fetch ===
function loadQuote() {
  fetch("https://type.fit/api/quotes")
    .then(res => res.json())
    .then(data => {
      const random = data[Math.floor(Math.random() * data.length)];
      document.getElementById("quote").innerText = random.text;
      document.getElementById("author").innerText = random.author ? random.author : "Unknown";
    })
    .catch(() => {
      document.getElementById("quote").innerText = "Stay focused.";
      document.getElementById("author").innerText = "";
    });
}

// === To-Do List ===
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${todo} <button onclick="deleteTodo(${i})">❌</button>`;
    todoList.appendChild(li);
  });
}
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}
todoForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (value) {
    todos.push(value);
    saveTodos();
    renderTodos();
    todoInput.value = "";
  }
});
function loadTodos() {
  renderTodos();
}

// === Pomodoro Timer ===
let timer;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
  const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const sec = (timeLeft % 60).toString().padStart(2, "0");
  document.getElementById("timer").innerText = `${min}:${sec}`;
}

document.getElementById("start-timer").addEventListener("click", () => {
  const workDuration = parseInt(document.getElementById("work-duration").value) || 25;
  timeLeft = workDuration * 60;
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      alert("Time's up! Take a break.");
    }
  }, 1000);
});
document.getElementById("reset-timer").addEventListener("click", () => {
  clearInterval(timer);timeLeft = (parseInt(document.getElementById("work-duration").value) || 25) * 60;
  updateTimerDisplay();
});

// === Audio Playlist ===
function setupPlaylist() {
  const player = document.getElementById("audio-player");
  const tracks = document.querySelectorAll("#playlist li");

  tracks.forEach(track => {
    track.addEventListener("click", () => {
      player.src = track.getAttribute("data-src");
      player.play();
      highlightTrack(track);
    });
  });

  function highlightTrack(selected) {
    tracks.forEach(t => t.classList.remove("active"));
    selected.classList.add("active");
  }

  // Start first track automatically
  if (tracks[0]) {
    player.src = tracks[0].getAttribute("data-src");
    player.play();
    highlightTrack(tracks[0]);
  }
}

// === Dark Mode Toggle ===
const darkToggle = document.getElementById("dark-mode-toggle");

darkToggle.addEventListener("change", e => {
  document.body.classList.toggle("dark-mode", e.target.checked);
  localStorage.setItem("darkMode", e.target.checked);
});

function loadDarkMode() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  darkToggle.checked = darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
}
const materialForm = document.getElementById("material-form");
const materialInput = document.getElementById("material-input");
const materialList = document.getElementById("material-list");
let materials = JSON.parse(localStorage.getItem("studyMaterials")) || [];

// Save to localStorage
function saveMaterials() {
  localStorage.setItem("studyMaterials", JSON.stringify(materials));
}

// Render materials
function renderMaterials() {
  materialList.innerHTML = "";
  if (materials.length === 0) {
    materialList.innerHTML = "<li>No materials added.</li>";
    return;
  }

  materials.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      materials.splice(index, 1);
      saveMaterials();
      renderMaterials();
    };
    li.appendChild(delBtn);
    materialList.appendChild(li);
  });
}

// Handle add
materialForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = materialInput.value.trim();
  if (value) {
    materials.push(value);saveMaterials();
    renderMaterials();
    materialInput.value = "";
  }
});

// Handle reset
materialForm.querySelector('button[type="reset"]').addEventListener("click", () => {
  materialInput.value = "";
});

// Handle display
materialForm.querySelector('button[type="display"]').addEventListener("click", (e) => {
  e.preventDefault();
  renderMaterials();
});

// Initial display
renderMaterials();
