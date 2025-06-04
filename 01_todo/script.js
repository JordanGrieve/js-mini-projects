document.addEventListener('DOMContentLoaded', () => {
        
    const todoInput = document.getElementById("todo-input")
    const addTaskButton = document.getElementById("add-task-btn")
    const todoList = document.getElementById("todo-list")

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => renderTask(task))

    addTaskButton.addEventListener("click", () => {
        const taskText = todoInput.value.trim()
        if(taskText === "") return

        const newTask = {
            id: Date.now(),
            text: taskText,
            complete: false
        }
        tasks.push(newTask)
        saveTasks()
        renderTask(newTask)
        todoInput.value = "" //clear input
        console.log(tasks);
        
    })

    function renderTask(task) {
        const li = document.createElement("li")
        li.setAttribute("data-id", task.id)
        if(task.complete) li.classList.add("completed")
        li.innerHTML = `
        <span>${task.text}</span>
        <button>delete</button>
        `
        li.addEventListener("click", (event) => {
            if(event.target.tagNName === 'BUTTON') return
            task.complete = !task.completed
            li.classList.toggle("completed")
            saveTasks() 
        })
        
        li.querySelector("button").addEventListener("click", (event) => {
            event.stopPropagation() /// prevent toggle from firing
            tasks = tasks.filter(t => t.id !== task.id)
            li.remove()
            saveTasks()
        })

        todoList.appendChild(li)
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

})