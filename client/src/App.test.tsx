import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the TodoForm component', () => {
    render(<App />);
    const todoForm = screen.getByTestId("todo-form");
    expect(todoForm).toBeInTheDocument();
  });

  it('should render the todo text input', () => {
    render(<App />);
    const imputElement = screen.getByPlaceholderText("Write a task here and press 'enter'");
    expect(imputElement).toBeInTheDocument();
  });
});
