// src/api/tasks.js
import api from "./axios";

export const getTasks = () => api.get("/tasks");

export const createTask = (data) => api.post("/tasks", data);

export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Needed for Kanban drag + drop:
export const updateTaskStatus = (id, status) =>
  api.put(`/tasks/${id}`, { status });
