import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = function (props) {
    return (
        <tr>
            <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
            <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
            <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
            <td>
                <Link to={"/edit/" + props.todo._id}>Edit</Link>
            </td>
        </tr>
    )
}

export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = { todos: [] };
    }

    _isMounted = false;

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.updateTodoList();
    }


    updateTodoList() {
        console.log(window.location.hostname);
        axios.get(`/todos/`)
            .then(response => {
                if (this._isMounted) {
                    this.setState({ todos: response.data });
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    todoList() {
        return this.state.todos.map(function (currentTodo, i) {
            return <Todo todo={currentTodo} key={i} />;
        });
    }

    render() {
        return (
            <div>
                <h3 className="mt-4 mb-4" >Todos List</h3>
                <button className="btn btn-secondary" onClick={() => this.updateTodoList()}>Update list</button>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.todoList()}
                    </tbody>
                </table>
            </div>
        )
    }
}