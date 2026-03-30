import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx"; // use global theme
import { BASE_URL } from "../constants";
import { fetchUserPosts } from "../service/post.js";

export default function Profile({ posts }) {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext); // read darkMode from context

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const posts = await fetchUserPosts();
      setUserPosts(posts);
    })();
  }, []);

  const totalLikes = userPosts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0,
  );

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Please login to view your profile</h2>
      </div>
    );
  }

  const themeStyles = {
    container: {
      maxWidth: "850px",
      margin: "60px auto",
      padding: "20px",
      color: darkMode ? "#eee" : "#111",
      background: darkMode ? "#111" : "#fff",
      transition: "all 0.3s ease",
    },
    header: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      borderBottom: `1px solid ${darkMode ? "#444" : "#eee"}`,
      paddingBottom: "20px",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "#0d6efd",
      color: "white",
      fontSize: "32px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    username: { margin: 0 },
    email: { color: darkMode ? "#aaa" : "#666" },
    stats: { marginTop: "10px", display: "flex", gap: "20px" },
    postTitle: { marginTop: "40px" },
    postCard: {
      display: "flex",
      gap: "20px",
      padding: "20px 0",
      borderBottom: `1px solid ${darkMode ? "#444" : "#eee"}`,
    },
    image: {
      width: "120px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "6px",
    },
    postHeading: { margin: 0 },
    postBody: { color: darkMode ? "#ccc" : "#555" },
    meta: { color: darkMode ? "#aaa" : "#888", fontSize: "14px" },
  };

  return (
    <div style={themeStyles.container}>
      <div style={themeStyles.header}>
        <div style={themeStyles.avatar}>
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 style={themeStyles.username}>{user.username}</h1>
          <p style={themeStyles.email}>{user.email}</p>

          <div style={themeStyles.stats}>
            <span>
              <strong>{userPosts.length}</strong> Posts
            </span>
            <span>
              <strong>{totalLikes}</strong> Likes
            </span>
          </div>
        </div>
      </div>

      <h2 style={themeStyles.postTitle}>Your Stories</h2>

      {userPosts.length === 0 ? (
        <p>You haven't written any posts yet.</p>
      ) : (
        userPosts.map((post) => (
          <div key={post._id} style={themeStyles.postCard}>
            {post.coverImage && (
              <img
                src={`${BASE_URL}${post.coverImage}`}
                alt={post.title}
                style={themeStyles.image}
              />
            )}

            <div>
              <h3 style={themeStyles.postHeading}>{post.title}</h3>
              <p style={themeStyles.postBody}>{post.body?.slice(0, 120)}...</p>
              <div style={themeStyles.meta}>
                ❤️ {post.likes?.length || 0} likes
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
