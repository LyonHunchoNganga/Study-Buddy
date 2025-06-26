window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  loadQuote();
});

function loadQuote() {
  const quoteEl = document.getElementById("quote");
  quoteEl.innerText = "Loading quote...";
  
  fetch("https://type.fit/api/quotes")
    .then((res) => res.json())
    .then((data) => {
      const random = data[Math.floor(Math.random() * data.length)];
      const text = random.text || "Keep pushing forward.";
      const author = random.author || "lyon";
      quoteEl.innerText = `${text} — ${author}`;
      removeRetryButton();
    })
    .catch(() => {
      quoteEl.innerText = "Keep pushing forward";
      showRetryButton();
    });
}

function showRetryButton() {
  if (!document.getElementById("retry-btn")) {
    const btn = document.createElement("button");
    btn.id = "retry-btn";
    btn.innerText = "Retry";
    btn.style.marginTop = "10px";
    btn.onclick = () => {
      btn.disabled = true;
      loadQuote();
    };
    document.getElementById("quote-section").appendChild(btn);
  }
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
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${todo} <button onclick="deleteTodo(${index})">❌</button>`;
    todoList.appendChild(li);
  });
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
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


let timer;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

document.getElementById("start-timer").addEventListener("click", () => {
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
  clearInterval(timer);
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

updateTimerDisplay();

// === Dark Mode Toggle ===
const toggle = document.getElementById("dark-mode-toggle");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", toggle.checked);
});
