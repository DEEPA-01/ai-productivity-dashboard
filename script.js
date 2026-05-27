const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const productivity = document.getElementById("productivity");
addTaskButton.addEventListener("click", addTask);

// function addTask() {
//   const taskText = taskInput.value;
//   console.log("Button Clicked");
//   console.log("Task Text:", taskText);
// }

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  //create li

  const li = document.createElement("li");

  //add classes
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";

  //add content
  li.innerHTML = ` 
  <span>${taskText}</span>
  <div class="d-flex gap-2">

        <button class = "btn btn-success btn-sm complete-btn">
            Complete
        </button>

        <button class = "btn btn-danger btn-sm delete-btn">
            Delete
        </button>
    
    </div>
    `;

  // add to task list
  taskList.appendChild(li);

  taskInput.value = "";

  updateDashboard();
  // delete task

  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateDashboard();
  });

  // complete task
  const completeBtn = li.querySelector(".complete-btn");
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("active");
    updateDashboard();
  });

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
  }
}
