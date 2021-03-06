const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = express.Router();
const PORT = 5000;
const path = require('path');

let Todo = require('./todo.model');


// Enable Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

apiRoutes.route('/todos').get(function (req, res) {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

apiRoutes.route('/todos/:id').get(function (req, res) {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.json(todo);
        }
    });
});



apiRoutes.route('/todos/add').post(function (req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json("todo added successfully: " + todo);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed: ' + err);
        });
});

apiRoutes.route('/todos/update/:id').post(function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send('data is not found');
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated:' + todo);
            })
                .catch(err => {
                    res.status(400).send("Update not possible: " + err);
                });
        }
    });
});

app.use('/api', apiRoutes);

// Serve built frontend here on port 5000, the react development server will run on port 3000
// with a proxy to http://localhost:5000 for api calls 
app.use(express.static(path.join(path.dirname(__dirname), 'frontend/build')));

app.get('*', function (req, res) {
    var file = path.join(path.dirname(__dirname)+'/frontend/build/index.html')
    console.log(file)
    res.sendFile(file);
});

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});