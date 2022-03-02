import React, { InputHTMLAttributes, useCallback, useEffect, useState } from "react";
import "./App.css";
import { Todo } from "./types/Todo";
import api from './services/api';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  todo: Todo;
  index: number;
  changeTodoStatus: any;
  removeTodoItem: any;
}

const TodoItem: React.FC<InputProps> = ({ todo, index, changeTodoStatus, removeTodoItem }) => {
  const [isDone, setIsDone] = useState(false);
  
  const handleOnChange = () => {
    setIsDone(!isDone);
    changeTodoStatus(index);
  }
  
  return (
    <div className="todo-item">
      <input className="done-checkbox" type="checkbox" checked={todo.isDone} onChange={handleOnChange}/>
      <div style={{ textDecoration: todo.isDone ? "line-through" : "" }} className="todo-text">{todo.text}</div>
      <button className="rmv-button" onClick={() => removeTodoItem(index)}>x</button>
    </div>
  );
}

const TodoForm: React.FC<any> = ({ addTodoItem }) => {
  const [value, setValue] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    addTodoItem(value);
    setValue("");
  };

  return (
    <form data-testid="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="Write a task here and press 'enter'"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() =>{
    api.get<Todo[]>("/todos").then(response => {
      const todosFromApi = response.data;
      setTodos(todosFromApi);
    });
  });

  const addTodoItem = useCallback(async (text: number) => {
    const response = await api.post('todo', { text });

    const todo = response.data;

    const newTodos = [...todos, todo ];

    setTodos(newTodos);
  },[todos]);

  const changeTodoStatus = useCallback(async (id: number) => {
    const response = await api.patch(`todo/${id}`);

    const changedTodo = response.data;

    const newTodos = todos.map(todo => {
      if (todo.id === Number(id)) {
        todo.isDone = changedTodo.isDone;
      }
      return todo;
    });

    setTodos(newTodos);
  },[todos]);

  const removeTodoItem = useCallback(async (id: number) => {
    await api.delete(`todo/${id}`);

    const newTodos = todos.filter(todo => todo.id !== id);

    setTodos(newTodos);
  },[todos]);

  return (
    <div className="app">
      <div className="todo-list">
        <TodoForm addTodoItem={addTodoItem} />
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            index={todo.id}
            todo={todo}
            changeTodoStatus={changeTodoStatus}
            removeTodoItem={removeTodoItem}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
