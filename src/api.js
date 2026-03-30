// src/api.js
import axios from "axios";
import { BASE_URL } from "./constants";

const token = localStorage.getItem("token");

// Axios instance for API requests
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export async function fetchPosts() {
  const { data } = await api.get("/posts");
  return data;
}

export async function fetchPost(id) {
  const { data } = await api.get(`/posts/${id}`);
  return data;
}

export async function createPost(postData) {
  const { data } = await api.post("/posts", postData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updatePost(id, updatedData) {
  const { data } = await api.put(`/posts/${id}`, updatedData);
  return data;
}

export async function deletePost(id) {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
}
