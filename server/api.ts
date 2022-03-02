import express, { Application, Request, Response } from "express";
import { Todo } from "./types/Todo";

const api: Application = express();
const port = process.env.PORT || 3001;

// TODO use database instead of arrays
export let todos: Todo[] = [];

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get("/todos", (_request: Request, response: Response) => {
  return response.json(todos);
});

api.post('/todo', (request: Request, response: Response) => {
  const { text } = request.body;

  const id = (todos[todos.length - 1]?.id + 1) || 1;

  const todo = {
    id,
    text,
    isDone: false,
  }

  todos.push(todo);

  return response.status(201).json(todo);
});

api.delete('/todo/:id', (request: Request, response: Response) => {
  const { id } = request.params;

  todos = todos.filter(todo => {
    return todo.id !== Number(id);
  });

  return response.status(204).json();
});

api.patch('/todo/:id', (request: Request, response: Response) => {
  const { id } = request.params;

  todos = todos.map(todo => {
    if (todo.id === Number(id)) {
      todo.isDone = !todo.isDone;
    }
    return todo;
  });

  const todo = todos.find(todo => todo.id === Number(id));

  return response.json(todo);
});

api.listen(port, () => {console.log(`🚀 Listening on port ${port}`)});

export default api;
