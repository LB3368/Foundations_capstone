//fetchTodos function is called when the page loads and then fetches the todos from the server to populate the todo list
let addBtn = document.getElementById('add-button').addEventListener('click', addTodo)
document.addEventListener('DOMContentLoaded', fetchTodos)

// getting the todos from the server
function fetchTodos() {
    fetch('/todos')
    .then(res => res.json())
    .then(todos => {
        const todoList = document.getElementById('todo-list')
        todoList.innerHTML = ''

        todos.forEach(todo => {
            const listItem = document.createElement('li')
            listItem.textContent = todo.title
            todoList.appendChild(listItem)
        })
    })
    .catch((error => {
        console.error('Error getting todos', error)
    }))
}

//const todoList = document.getElementById('todoList')
//const todoInput = document.getElementById('todoInput')

//addTodo function is triggered when the user clicks the "Add" button sending a POST request to add a new todo then fetch the updated todos
function addTodo() {
    const todoInput = document.getElementById('todo-input')
    const todoTitle = todoInput.value

    if (todoTitle) {
        const newTodo = { title: todoTitle }

        fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo)
        })
        .then(() => {
            todoInput.value = ''
            fetchTodos()
        })
        .catch((err) => {
            console.error('Error adding todos:', err)
        })
    }

    const todoText = todoInput.ariaValueMax.trim()
    if (todoText !== '') {
        const li = document.createElement('li')
        li.textContent = todoText
        todoList.appendChild(li)
        todoInput.value = ''
    }
}