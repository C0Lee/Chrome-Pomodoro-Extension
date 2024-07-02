let tasks = [];

function updateTime() {
    chrome.storage.local.get(["timer","timeOption"], (res) => {
        const time = document.getElementById("time");
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
        let seconds = "00";
        if (res.timer % 60 !== 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2,"0");  // Update seconds if not a complete minute
        }
        time.textContent = `${minutes}:${seconds}`;
    });
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start_timer_button");
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
        });
    });
});

const resetTimerBtn = document.getElementById("reset_timer_button");
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "Start Timer";
    });
});

const addtaskbtn = document.getElementById("add_task_button");
addtaskbtn.addEventListener("click", () => addtask());

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : [];
    renderTasks();
});

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    });
}

function renderTask(taskNum) {
    const taskrow = document.createElement("div");

    const text = document.createElement("input");
    text.type = "text";
    text.placeholder = "Enter a task ...";
    text.value = tasks[taskNum];
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value;
        saveTasks();
    });

    const deletebtn = document.createElement("input");
    deletebtn.type = "button";
    deletebtn.value = "x";
    deletebtn.addEventListener("click", () => {
        deleteTask(taskNum);
    });

    taskrow.appendChild(text);
    taskrow.appendChild(deletebtn);

    const taskContainer = document.getElementById("task_container");
    taskContainer.appendChild(taskrow);
}

function addtask() {
    const taskNum = tasks.length;
    tasks.push("");
    renderTasks();
    saveTasks();
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1);
    renderTasks();
    saveTasks();
}

function renderTasks() {
    const taskContainer = document.getElementById("task_container");
    taskContainer.textContent = "";
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum);
    });
}