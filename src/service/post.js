import { api } from "./axios";

export async function fetchPosts() {
  try {
    const { data } = await api.get("/posts");

    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchUserPosts() {
  const { data } = await api.get("/posts/user-posts");
  return data;
}
