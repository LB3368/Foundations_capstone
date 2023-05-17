require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const todosController = require('./controller')

app.use(express.json())
app.use(cors())

//**********create my routes**********//

//get all the todos
app.get('/todos', (req, res) => {
    Todo.findAll()
    .then((todos) => {
        res.json(todos)
    })
    .catch((err) => {
        console.error('Server error', err)
        res.status(500).send(err)
    })
})

//creating a new todo
app.post('/todos', (req, res) => {
    const todo = new Todo ({
        title: req.body.title,
        description: req.body.description,
    })
    todo.save()
    .then((todo) => {
        res.json(todo)
    })
    .catch((err) => {
        res.status(500).send(err)
    })
})

// Create route for updating todo
app.put('/todos/:id', (req, res) => {
    Todo.findByPk(req.params.id)
    .then((todo) => {
        if (!todo) {
            res.status(404).send('Todo not found')
            return
        }
        todo.title = req.body.title
        todo.description = req.body.description

        return todo.save()
    })
    .then((todo) => {
        res.json(todo)
    })
    .catch((err) => {
        res.status(500).send(err)
    })
})
// route for deleting a todo
app.delete('/todos/:id', (req, res) => {
    Todo.findByPk(req.params.id)
    .then((todo) => {
        if (!todo) {
            res.status(404).send('Todo not found')
            return
        }
        return todo.destroy()
    })
    .then(() => {
        res.sendStatus(200)
    })
    .catch((error) => {
        console.error('Error deleting todo:', error)
        res.status(500).send('server error')
    })
})

//connecting my server
const PORT = SERVER_PORT || 8080
app.listen(PORT, () => console.log(`Running on port ${PORT}`))