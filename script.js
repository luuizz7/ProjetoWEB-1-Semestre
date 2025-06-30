document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("toggleTheme");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
  });

  const input = document.getElementById("taskInput");
  const addBtn = document.getElementById("addTaskBtn");
  const list = document.getElementById("taskList");
  const highlightBtn = document.getElementById("highlightBtn");

  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text !== "") {
      const li = document.createElement("li");
      li.textContent = text;

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "✓";
      completeBtn.addEventListener("click", () => {
        li.classList.toggle("completed");
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => {
        li.remove();
      });

      const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");
        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(deleteBtn);
        li.appendChild(buttonGroup);
        list.appendChild(li);
        input.value = "";
    }
  });

  highlightBtn.addEventListener("click", () => {
    let maxLength = 0;
    let longestTask = null;
    const tasks = list.querySelectorAll("li");

    tasks.forEach(task => {
      task.style.color = "";
      const taskText = task.firstChild.textContent;
      if (taskText.length > maxLength) {
        maxLength = taskText.length;
        longestTask = task;
      }
    });

    if (longestTask) {
      longestTask.style.color = "red";
    }
  });
});