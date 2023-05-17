require('dotenv').config()
const Todo = require('./App')
const { CONNECTION_STRING } = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

// Defining the model
const Todo = sequelize.define('Todo', {
    todo_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isComplete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
})

module.exports = {
    seed: (req, res) => {
        sequelize
        .sync({ force: true })// drops existing table and re creates it
        .then(() => {
            console.log('Table created successfully')
            return Todo.bulkCreate ([
                { text: 'Task 1' },
                { text: 'Task 2' },
                { text: 'Task 3' },
            ])
        })
        .then(() => {
            console.log('Data seeded successfully')
            res.send('Data seeded successfully')
        })
        .catch((error) => {
            console.log((error) => {
                res.status(500).send('Error seeding data', error)
            })
        })
    }
}

module.exports = {
    getTodos: (req, res) => {
        Todo.findAll()
        .then(todos => {
            res.json(todos)
        })
        .catch((err) => {
            console.error('Error getting todos:', err)
            res.status(500).json({ err: 'Server error' })
        })
    },
    createTodo: (req, res) => {
        const { title } = req.body

        if (!title) {
            res.status(400).json({ error: 'Title is required' })
            return
        }
        Todo.create({ title })
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.error('Error creating todo:', err)
            res.status(500).json({ error: 'Server error'})
        })
    },
    //get the id from the requested params and the title from the req.body
    updateTodo: (req, res) => {
        const { id } = req.params
        const { title } = req.body
//if the title isn't provided, send 400 error
        if (!title) {
            res.status(400).json({ error: 'Title is required'})
            return
        }
// update the todo with id and set title to value; if successful send 200 message
        Todo.update({ title }, { where: { id } })
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.error('Error updating todo:', err)
            res.status(500).json({ error: 'Server error'})
        })
    },
// get id from params and use the destroy method to delete the todo 
    deleteTodo: (req, res) => {
        const { id } = req.params

        Todo.destroy({ where: { id } })
        .then(() => {
            res.sendStatus(200)
        })
        .catch((err) => {
            console.error('Error deleting todo:', err)
            res.status(500).json({ error: 'Server error' })
        })
    }
}


/*const Todo = sequelize.define('Todo', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize.STRING,
    },
    description: {
        type: sequelize.STRING,
    },
    completed: {
        type: sequelize.BOOLEAN,
        default: false,
    },
})

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.findAll()
        res.json(todos)
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
})*/

/*
module.exports = {
    createTodo: async (req, res) => {
        const { title } = req.body
        try {
            const todo = await Todo.create({ title })
            res.status(200).send(dbRes[0])
        }
    }
}*/