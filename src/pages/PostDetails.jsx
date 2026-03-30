// pages/PostDetails.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
import Responses from "../components/Response.jsx";
import { BlogForm } from "./Create.jsx";
import { api } from "../service/axios.js";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        setTitle(res.data.title);
        setBody(res.data.body);
      } catch (err) {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!user) return toast.error("You must be logged in to delete");
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Deleted!");
      navigate("/"); // navigate after deletion
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleUpdate = async () => {
    if (!user) return toast.error("You must be logged in to edit");
    if (!title.trim() || !body.trim())
      return toast.error("Title and body cannot be empty");

    setUpdating(true);
    try {
      const res = await api.put(`/posts/${post._id}`, { title, body });
      setPost(res.data);
      setEditing(false);
      toast.success("Updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("You must be logged in to like posts");
    try {
      const res = await api.put(`/posts/${post._id}/like`); // removed unnecessary {}
      setPost(res.data);
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <Toaster position="top-right" />

      {editing ? (
        <>
          <BlogForm
            data={{ title, body }}
            setData={({ title, body }) => {
              setTitle(title);
              setBody(body);
            }}
          />

          <div style={styles.buttons}>
            <button
              onClick={handleUpdate}
              disabled={updating}
              style={{ ...styles.button, background: "#1a8917" }}
            >
              {updating ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              style={{ ...styles.button, background: "#ccc", color: "#000" }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 style={styles.title}>{post.title}</h1>

          <div style={styles.buttons}>
            <button
              onClick={handleLike}
              style={{
                ...styles.button,
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                fontSize: "13px",
                color: "hsla(0, 5%, 66%, 0.69)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              ❤️ {post.likes.length} likes
            </button>

            {user && String(post.author) === String(user.id) && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    ...styles.button,
                    background: "none",
                    border: "none",
                    padding: 0,
                    marginLeft: "auto", // responsive fix
                    fontWeight: "500",
                    fontSize: "13px",
                    color: "hsl(0, 1%, 40%)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  style={{
                    ...styles.button,
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "13px",
                    color: "hsl(0, 1%, 40%)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {post.coverImage && (
            <img
              src={`${BASE_URL}${post.coverImage}`}
              alt={post.title}
              style={styles.image}
            />
          )}

          <div
            style={styles.body}
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <style>{`
            .post-body p,
            .post-body h1,
            .post-body h2,
            .post-body h3,
            .post-body li {
              margin: 0 0 1em 0;
              padding: 0;
            }
            .post-body ul,
            .post-body ol {
              padding-left: 1.2em;
            }
          `}</style>
        </>
      )}

      {post && <Responses postId={post._id} />}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "680px",
    margin: "80px auto",
    padding: "0 20px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "20px",
    fontFamily: "Georgia, serif",
  },
  body: {
    fontSize: "21px",
    lineHeight: "1.6",
    fontFamily: "Georgia, serif",
    letterSpacing: "0.01em",
    marginTop: "30px",
    marginBottom: "40px",
    maxWidth: "680px",
    whiteSpace: "normal",
    textAlign: "justify",
    wordBreak: "break-word", // fix text overflow
    hyphens: "auto", // fix uneven justification
  },
  buttons: { display: "flex", gap: "10px" },
  button: {
    paddingBlock: ".2rem",
    paddingInline: "1rem",
    border: "none",
    borderRadius: "6px",
    color: "#ffffffdd",
    fontWeight: "600",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    borderRadius: "6px",
    marginTop: "20px",
    marginBottom: "30px",
  },
};
