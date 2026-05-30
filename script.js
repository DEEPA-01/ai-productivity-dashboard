const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");
const themeToggle = document.getElementById("themeToggle");
const toastContainer = document.getElementById("toastContainer");
const taskChartCanvas = document.getElementById("taskChart");
const aiInsights = document.getElementById("aiInsights");
const remindersContainer = document.getElementById("remindersContainer");
const dueDateInput = document.getElementById("dueDate");
const timerDisplay = document.getElementById("timerDisplay");
const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resetTimer = document.getElementById("resetTimer");
const currentProjectName = document.getElementById("currentProjectName");
const themeIcon = document.getElementById("themeIcon");
const sidebarContent = document.getElementById("sidebarContent");
console.log(currentProjectName);
//intialize variables
// Task Array to store tasks
let tasks = [];
let taskChart;

addTaskButton.addEventListener("click", addTask);
themeToggle.addEventListener("click", toggleTheme);
// function addTask() {
//   const taskText = taskInput.value;
//   console.log("Button Clicked");
//   console.log("Task Text:", taskText);
// }

function addTask() {
  const taskText = taskInput.value.trim();

  //task object
  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate: dueDateInput.value,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  if (dueDateInput.value === "") {
    alert("Please select a due date");
    return;
  }
  //create li

  //save task into array

  tasks.push(task);
  saveTasks();

  // const li = document.createElement("li");

  // //add classes
  // li.className =
  //   "list-group-item d-flex justify-content-between align-items-center";

  // //add content
  // li.innerHTML = `
  // <span>${taskText}</span>
  // <div class="d-flex gap-2">

  //       <button class = "btn btn-success btn-sm complete-btn">
  //           Complete
  //       </button>

  //       <button class = "btn btn-danger btn-sm delete-btn">
  //           Delete
  //       </button>

  //   </div>
  //   `;

  // // add to task list
  // taskList.appendChild(li);

  // taskInput.value = "";

  // updateDashboard();
  // // delete task

  // const deleteBtn = li.querySelector(".delete-btn");
  // deleteBtn.addEventListener("click", () => {
  //   li.remove();
  //   updateDashboard();
  // });

  // // complete task
  // const completeBtn = li.querySelector(".complete-btn");
  // completeBtn.addEventListener("click", () => {
  //   li.classList.toggle("active");
  //   updateDashboard();
  // });
  createTask(task);
  taskInput.value = "";
  dueDateInput.value = "";
  updateDashboard();
  showToast("Task Added!", "success");
}

function createTask(task) {
  //create li
  const li = document.createElement("li");

  //add classses

  li.className =
    "list-group-item d-flex justify-content-between align-items-center";

  //completed task

  if (task.completed) {
    li.classList.add("active");
  }

  //html
  li.innerHTML = `
  <span>${task.text}
  <br>
  <small class="text-muted">Due: ${task.dueDate || "No due date"}</small>
  </span>
 <div class="d-flex gap-2">

  <button class="btn btn-primary btn-sm track-btn">
      Track
  </button>

  <button class="btn btn-success btn-sm complete-btn">
      Complete
  </button>

<button class="btn btn-outline-danger btn-sm delete-btn" title="Delete Project">
    <i class="bi bi-trash"></i>
</button>

</div>
  `;

  //add task to ui

  taskList.appendChild(li);

  //delete button
  const trackBtn = li.querySelector(".track-btn");

  trackBtn.addEventListener("click", () => {
    console.log("TRACK CLICKED");
    console.log(task.text);

    currentProjectName.textContent = task.text;
  });

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    updateDashboard();
    showToast("Task Deleted", "delete");
  });

  //complete button

  const completeBtn = li.querySelector(".complete-btn");
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("active");
    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = null;
    }
    saveTasks();
    updateDashboard();
    showToast("Task Completed", "complete");
  });
}

function updateDashboard() {
  //Total Tasks
  const allTasks = document.querySelectorAll("#taskList li");

  //Completed Tasks
  const completed = document.querySelectorAll("#taskList li.active");

  //counts
  const totalCount = allTasks.length;
  const completedCount = completed.length;
  const pendingCount = totalCount - completedCount;

  //productivity
  let productivityValue = 0;

  if (totalCount > 0) {
    productivityValue = Math.round((completedCount / totalCount) * 100);
  }

  //update UI
  totalTasks.textContent = totalCount;
  completedTasks.textContent = completedCount;
  pendingTasks.textContent = pendingCount;
  productivity.textContent = productivityValue + "%";
  document.getElementById("notificationBadge").textContent = pendingCount;
  renderChart();
  generateInsights();
  generateReminders();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      createTask(task);
    });
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  themeIcon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";

  localStorage.setItem("theme", isDark ? "dark" : "light");

  renderChart();
}

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");

    themeIcon.className = "bi bi-sun-fill";
  } else {
    themeIcon.className = "bi bi-moon-fill";
  }
}

function showToast(message, type) {
  //create toast

  const toast = document.createElement("div");

  //bg color based on type
  let bgColor = "bg-success";
  if (type === "delete") {
    bgColor = "bg-danger";
  }

  if (type === "complete") {
    bgColor = "bg-primary";
  }

  if (type === "pending") {
    bgColor = "bg-warning";
  }

  //add classes
  toast.className = `toast align-items-center text-white ${bgColor} border-0 show`;

  //html
  toast.innerHTML = `
  <div class="d-flex">
    <div class="toast-body">
      ${message}
    </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  `;

  //add to screen
  toastContainer.appendChild(toast);
  //remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function renderChart() {
  if (taskChart) {
    taskChart.destroy();
  }

  const weeklyData = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach((task) => {
    if (task.completed && task.completedAt) {
      const day = new Date(task.completedAt).getDay();

      weeklyData[day]++;
    }
  });

  const isDarkMode = document.body.classList.contains("dark-mode");

  taskChart = new Chart(taskChartCanvas, {
    type: "bar",

    data: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

      datasets: [
        {
          label: "Tasks Completed",

          data: weeklyData,

          backgroundColor: [
            "#6366f1",
            "#8b5cf6",
            "#06b6d4",
            "#10b981",
            "#f59e0b",
            "#ec4899",
            "#ef4444",
          ],

          borderRadius: 12,

          borderSkipped: false,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,

          labels: {
            color: isDarkMode ? "#ffffff" : "#000000",
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: isDarkMode ? "#ffffff" : "#000000",
          },

          grid: {
            color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            precision: 0,

            color: isDarkMode ? "#ffffff" : "#000000",
          },

          grid: {
            color: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: "smooth" });
}

/* AI INSIGHTS ENGINE */

function generateInsights() {
  const completedCount = tasks.filter((task) => task.completed).length;

  const pendingCount = tasks.length - completedCount;

  const productivityScore =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  let insights = "";

  // Productivity Analysis

  if (productivityScore >= 80) {
    insights += `
      <div class="insight-box">
        🚀 Excellent productivity today (${productivityScore}%).
      </div>
    `;
  } else if (productivityScore >= 50) {
    insights += `
      <div class="insight-box">
        👍 Productivity is improving (${productivityScore}%).
      </div>
    `;
  } else {
    insights += `
      <div class="insight-box">
        ⚠ Productivity needs attention (${productivityScore}%).
      </div>
    `;
  }

  // Overload Detection

  if (pendingCount >= 5) {
    insights += `
      <div class="insight-box">
        🔥 High workload detected (${pendingCount} pending tasks).
      </div>
    `;
  }

  // Due Tomorrow Detection

  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  const dueTomorrow = tasks.filter(
    (task) => !task.completed && task.dueDate === tomorrowDate,
  );

  if (dueTomorrow.length > 0) {
    insights += `
      <div class="insight-box">
        ⏰ ${dueTomorrow.length} project(s) due tomorrow.
      </div>
    `;
  }

  // Overdue Detection

  const today = new Date().toISOString().split("T")[0];

  const overdue = tasks.filter(
    (task) => !task.completed && task.dueDate < today,
  );

  if (overdue.length > 0) {
    insights += `
      <div class="insight-box">
        🚨 ${overdue.length} overdue project(s) require attention.
      </div>
    `;
  }

  // Smart Focus Recommendation

  const nearestTask = tasks
    .filter((task) => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  if (nearestTask) {
    insights += `
      <div class="insight-box">
        🎯 Focus on "${nearestTask.text}" first.
      </div>
    `;
  }

  aiInsights.innerHTML = insights;
}

function generateReminders() {
  let reminderHtml = "";

  const today = new Date();

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const due = new Date(task.dueDate);

    return due >= today;
  });

  if (upcomingTasks.length === 0) {
    reminderHtml = `
      <div class="reminder-box">
        🎉 No upcoming deadlines
      </div>
    `;
  } else {
    upcomingTasks.forEach((task) => {
      reminderHtml += `
        <div class="reminder-box mb-3">
          📅 ${task.text}
          <br>
          <small>
            Due: ${task.dueDate}
          </small>
        </div>
      `;
    });
  }

  remindersContainer.innerHTML = reminderHtml;
}

let seconds = 0;

let timerInterval = null;

function updateTimer() {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");

  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");

  const secs = String(seconds % 60).padStart(2, "0");

  timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

startTimer.addEventListener("click", () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds++;

      updateTimer();
    }, 1000);
  }
});

pauseTimer.addEventListener("click", () => {
  clearInterval(timerInterval);

  timerInterval = null;
});

resetTimer.addEventListener("click", () => {
  clearInterval(timerInterval);

  timerInterval = null;

  seconds = 0;

  updateTimer();
});

document.getElementById("notificationBtn").addEventListener("click", () => {
  const pending = tasks.filter((task) => !task.completed).length;

  showToast(`${pending} pending project(s)`, "pending");
});

document.getElementById("helpBtn").addEventListener("click", () => {
  sidebarContent.innerHTML = `
    <div class="sidebar-content-box">
      <h6>Help Center</h6>

      <hr>

      <p>✅ Create Project</p>
      <p>✅ Assign Due Date</p>
      <p>✅ Track Time</p>
      <p>✅ Complete Project</p>
      <p>✅ View Analytics</p>
    </div>
  `;
});

document.getElementById("aboutBtn").addEventListener("click", () => {
  sidebarContent.innerHTML = `
    <div class="sidebar-content-box">
      <h6>About Dashboard</h6>

      <hr>

      <p>AI Productivity Dashboard</p>

      <small>
        Built using HTML, CSS,
        Bootstrap, JavaScript,
        Chart.js & LocalStorage.
      </small>
    </div>
  `;
});

document.getElementById("projectsBtn").addEventListener("click", () => {
  if (tasks.length === 0) {
    sidebarContent.innerHTML = `
      <div class="sidebar-content-box">
        <h6>Projects</h6>
        <hr>
        <p>No projects available.</p>
      </div>
    `;
    return;
  }

  let projectHtml = "";

  tasks.forEach((task) => {
    projectHtml += `
  <div class="mb-2">

    <strong>
      ${task.completed ? "✅" : "📋"}
      ${task.text}
    </strong>

    <br>

    <small>
      Due: ${task.dueDate}
    </small>

  </div>
`;
  });

  sidebarContent.innerHTML = `
    <div class="sidebar-content-box">
      <h6>Projects (${tasks.length})</h6>

      <hr>

      ${projectHtml}
    </div>
  `;
});

document.getElementById("analyticsBtn").addEventListener("click", () => {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  sidebarContent.innerHTML = `
    <div class="sidebar-content-box">
      <h6>Analytics Summary</h6>

      <hr>

      <p>Completed: ${completed}</p>
      <p>Pending: ${pending}</p>
      <p>Total Projects: ${tasks.length}</p>
    </div>
  `;
});

document.getElementById("dashboardBtn").addEventListener("click", () => {
  sidebarContent.innerHTML = `
    <div class="sidebar-content-box">

      <h6>Dashboard Overview</h6>

      <hr>

      <p>📋 Total Projects: ${tasks.length}</p>

      <p>✅ Completed: ${completedTasks.textContent}</p>

      <p>⏳ Pending: ${pendingTasks.textContent}</p>

      <p>📈 Productivity: ${productivity.textContent}</p>

    </div>
  `;
});
loadTasks();

loadTheme();

updateDashboard();

renderChart();

generateInsights();

showToast("Welcome to your AI Dashboard!", "success");
