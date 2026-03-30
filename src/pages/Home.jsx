// pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { fetchPosts } from "../service/post.js";
import { api } from "../service/axios.js";
import { BASE_URL } from "../constants.js";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    })();
  }, []);

  const handleLike = async (postId) => {
    if (!user) return alert("You must be logged in to like posts");
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
    } catch (err) {
      console.error(err);
      alert("Failed to like post");
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return alert("You must be logged in to delete");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "80px", fontSize: "18px" }}>
        No stories yet.
      </p>
    );
  }

  return (
    <div style={styles.feed}>
      {posts.map((post) => (
        <div
          key={post._id}
          style={styles.card}
          onClick={() => navigate(`/post/${post._id}`)}
        >
          {post.coverImage && (
            <img
              src={`${BASE_URL}${post.coverImage}`}
              alt={post.title}
              style={styles.image}
            />
          )}

          <div style={styles.content}>
            <h2 style={styles.title}>{post.title}</h2>

            {/* ✅ FIXED: strip HTML for preview */}
            <div style={styles.body}>
              {stripHtml(post.body).slice(0, 180) +
                (stripHtml(post.body).length > 180 ? "..." : "")}
            </div>

            <div style={styles.cardButtons}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post._id);
                }}
                style={styles.likeButton}
              >
                ❤️ {post.likes?.length || 0} Likes
              </button>

              {user && post.author === user.id && (
                <div style={styles.actions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${post._id}`);
                    }}
                    style={styles.mediumButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                    style={styles.mediumButton}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Helper function to strip HTML tags ---
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const styles = {
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "720px",
    margin: "30px auto",
    padding: "0 22px",
    width: "100%",
  },

  card: {
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    paddingBottom: "26px",
  },

  image: {
    width: "100%",
    maxHeight: "2000px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "14px",
  },

  content: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "clamp(18px, 4vw, 22px)",
    fontWeight: "700",
    marginBottom: "10px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.3",
  },

  body: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    lineHeight: "1.6",
    textAlign: "justify",
    marginBottom: "10px",
  },

  cardButtons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    flexWrap: "wrap",
    gap: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
  },

  likeButton: {
    background: "none",
    border: "none",
    fontSize: "13px",
    color: "#6b6b6b",
    cursor: "pointer",
  },

  mediumButton: {
    background: "none",
    border: "none",
    fontSize: "13px",
    color: "#6b6b6b",
    cursor: "pointer",
    padding: 0,
  },
};
