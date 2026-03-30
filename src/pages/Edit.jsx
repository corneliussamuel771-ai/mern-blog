// pages/Edit.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Edit.css";
import { BASE_URL } from "../constants";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { BlogForm } from "./Create.jsx";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // get logged-in user
  const { darkMode } = useContext(ThemeContext); // get theme
  const token = localStorage.getItem("token"); // JWT token

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/posts/${id}`);
        setTitle(res.data.title);
        setBody(res.data.body);
        if (res.data.coverImage) {
          setPreviewImage(`${BASE_URL}${res.data.coverImage}`);
        }

        // If the post was created before login integration, set author = current user
        if (!res.data.author && user) {
          await axios.put(
            `${BASE_URL}/api/posts/${id}`,
            { title: res.data.title, body: res.data.body },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !token) {
      return setError("You must be logged in to update this post.");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.put(`${BASE_URL}/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });

      setSuccess("Post updated successfully!");
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div
      className="edit-container"
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#f1f1f1" : "#000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 className="edit-title">Edit Post</h2>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form className="edit-form" onSubmit={handleUpdate}>
        <BlogForm
          data={{ title, body }}
          setData={({ title, body }) => {
            setTitle(title);
            setBody(body);
          }}
        />

        {/* Image Upload */}
        <label
          htmlFor="fileUpload"
          style={{
            display: "inline-block",
            padding: "10px 15px",
            background: darkMode ? "#1e88e5" : "#0d6efd",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {imageFile ? "Change Image" : "Upload Image"}
        </label>
        <input
          id="fileUpload"
          className="uploads"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            setImageFile(e.target.files[0] || null);
            if (e.target.files[0]) {
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />

        {/* Preview Selected Image */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: "100%",
              marginTop: "15px",
              borderRadius: "6px",
              maxHeight: "300px",
              objectFit: "cover",
            }}
          />
        )}

        <button
          className="edit-button"
          type="submit"
          style={{
            backgroundColor: darkMode ? "#1e88e5" : "#0d6efd",
            color: "#fff",
          }}
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
