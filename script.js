/* ================= SIGNUP ================= */

function signup() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (!user || !pass) {
    document.getElementById("error").innerText = "Fill all fields";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[user]) {
    document.getElementById("error").innerText = "User already exists";
    return;
  }

  users[user] = pass;
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("error").innerText = "Account created! Now login 😌";
}

/* ================= LOGIN ================= */

function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[user] && users[user] === pass) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", user);

    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "Invalid credentials";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("currentUser");

  if (user) {
    document.getElementById("welcome").innerText = `Welcome, ${user} 😌`;
  }
});

/* ================= LOGOUT ================= */

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

/* ================= DASHBOARD DATA ================= */

let currentFilter = "All";

let topics = JSON.parse(localStorage.getItem("topics")) || [];
let questions = JSON.parse(localStorage.getItem("questions")) || [];

/* SAVE */
function saveAll() {
  localStorage.setItem("topics", JSON.stringify(topics));
  localStorage.setItem("questions", JSON.stringify(questions));
}

/* ================= TOPICS ================= */

function addTopic() {
  let input = document.getElementById("topicInput");
  if (!input.value.trim()) return;

  topics.push({ name: input.value.trim(), status: "Pending" });

  input.value = "";
  saveAll();
  renderTopics();
}

function toggleTopic(i) {
  topics[i].status = topics[i].status === "Pending" ? "Done" : "Pending";
  saveAll();
  renderTopics();
}

function deleteTopic(i) {
  topics.splice(i, 1);
  saveAll();
  renderTopics();
}

function renderTopics() {
  let list = document.getElementById("topicList");
  list.innerHTML = "";

  topics.forEach((t, i) => {
    list.innerHTML += `
      <div class="item">
        <span>${t.name}</span>

        <div>
          <button class="status-btn ${t.status === "Done" ? "done" : "pending"}"
            onclick="toggleTopic(${i})">
            ${t.status}
          </button>

          <span class="material-symbols-outlined delete-icon"
            onclick="deleteTopic(${i})">
            delete
          </span>
        </div>
      </div>
    `;
  });

  updateStats();
}

/* ================= QUESTIONS ================= */

function setFilter(type) {
  currentFilter = type;
  renderQuestions();
}

function addQuestion() {
  let title = document.getElementById("qTitle");
  let diff = document.getElementById("qDifficulty");

  if (!title.value.trim()) return;

  questions.push({
    title: title.value.trim(),
    difficulty: diff.value,
    status: "Unsolved"
  });

  title.value = "";
  saveAll();
  renderQuestions();
}

function toggleQuestion(i) {
  questions[i].status =
    questions[i].status === "Unsolved" ? "Solved" : "Unsolved";

  saveAll();
  renderQuestions();
}

function deleteQuestion(i) {
  questions.splice(i, 1);
  saveAll();
  renderQuestions();
}

function renderQuestions() {
  let list = document.getElementById("questionList");
  list.innerHTML = "";

  questions.forEach((q, i) => {

    if (currentFilter !== "All" && q.difficulty !== currentFilter) return;

    list.innerHTML += `
      <div class="item">
        <span>${q.title} (${q.difficulty})</span>

        <div>
          <button class="status-btn ${q.status === "Solved" ? "done" : "pending"}"
            onclick="toggleQuestion(${i})">
            ${q.status}
          </button>

          <span class="material-symbols-outlined delete-icon"
            onclick="deleteQuestion(${i})">
            delete
          </span>
        </div>
      </div>
    `;
  });

  updateStats();
}

/* ================= STATS ================= */

function updateStats() {
  let completedTopics = topics.filter(t => t.status === "Done").length;
  let solvedQuestions = questions.filter(q => q.status === "Solved").length;

  document.getElementById("totalTopics").innerText = topics.length;
  document.getElementById("completedTopics").innerText = completedTopics;

  document.getElementById("totalQuestions").innerText = questions.length;
  document.getElementById("solvedQuestions").innerText = solvedQuestions;
}

/* ================= THEME ================= */

function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

/* LOAD THEME */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* INIT */
renderTopics();
renderQuestions();
updateStats();