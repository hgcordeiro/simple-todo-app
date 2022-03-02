import supertest from "supertest";
import api, { todos } from "../api";

describe("server", () => {
  beforeEach(() => {
    todos.length = 0;
  });

  describe("GET /todos", () => {
    it("should return an array of todos with the existing elements", async () => {
      const lenght = todos.push({
        id: 1,
        text: "Todo 1",
        isDone: false,
      });

      const todo = todos[lenght - 1];

      await supertest(api)
        .get("/todos")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(1);
          expect(response.body[0].id).toBe(todo.id);
          expect(response.body[0].text).toBe(todo.text);
          expect(response.body[0].isDone).toBe(todo.isDone);
        });
    });

    it("should return an empty array of todos", async () => {
      await supertest(api)
        .get("/todos")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(0);
        });
    }); 
  });

  describe("POST /todo", () => {
    it("should create a new todo object", async () => {
      const data = {
        text: "Todo 1",
      };

      await supertest(api)
        .post("/todo")
        .send(data)
        .expect(201)
        .then((response) => {
          // Check the response
          expect(response.body.id).toBeTruthy();
          expect(response.body.text).toBe(data.text);
          expect(response.body.isDone).toBe(false);

          // Check the data in the array
          const todo = todos.find(todo => todo.id === response.body.id);
          expect(todo).toBeTruthy();
          expect(todo.id).toBeTruthy();
          expect(todo.text).toBe(todo.text);
          expect(todo.isDone).toBe(todo.isDone);
        });
    })
  });

  describe("PATCH /todo/:id", () => {
    it("should change isDone status", async () => {
      const isDone = true
      
      const lenght = todos.push({
        id: 1,
        text: "Todo 1",
        isDone,
      });

      const todo = todos[lenght - 1];

      const data = '';

      await supertest(api)
        .patch(`/todo/${todo.id}`)
        .send(data)
        .expect(200)
        .then((response) => {
          // Check the response
          expect(response.body.id).toBe(todo.id);
          expect(response.body.text).toBe(todo.text);
          expect(response.body.isDone).toBe(!isDone);

          // Check if data in array changed
          expect(todo.isDone).toBe(!isDone);
        });
    });
  });

  describe("DELETE /todo/:id", () => {
    it("should delete a given todo", async () => {
      const lenght = todos.push({
        id: 1,
        text: "Todo 1",
        isDone: false,
      });

      const todo = todos[lenght - 1];

      await supertest(api)
        .delete(`/todo/${todo.id}`)
        .expect(204)
        .then(() => {
          expect(todos.length).toBe(0);
        });
    });
  });
});