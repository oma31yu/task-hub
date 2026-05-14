
import { apiClient } from './apiClient';

export const fetchTodos = () => apiClient.get('/todos');

export const createTodo = (todoData) => apiClient.post('/todos', todoData);

export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);