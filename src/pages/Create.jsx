import { useState, useRef, useEffect, useContext } from "react";
import Editor from "../components/Editor";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx"; // <-- import theme
import { BASE_URL } from "../constants.js";

export const BlogForm = ({ data, setData }) => {
  const editorContainerRef = useRef(null);
  const { darkMode } = useContext(ThemeContext); // read darkMode

  return (
    <form
      style={{
        ...styles.editorContainer,
        background: darkMode ? "#111" : "#fff",
        color: darkMode ? "#eee" : "#111",
      }}
      onSubmit={(e) => e.preventDefault()}
      ref={editorContainerRef}
    >
      <input
        type="text"
        placeholder="Title"
        value={data?.title ?? ""}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        style={{
          ...styles.title,
          color: darkMode ? "#eee" : "#111",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setData({ ...data, coverImage: e.target.files[0] })}
        style={styles.file}
      />

      {data?.coverImage && (
        <img
          src={URL.createObjectURL(data.coverImage)}
          alt="preview"
          style={{ width: "100%", marginBottom: "20px", borderRadius: "8px" }}
        />
      )}

      <Editor
        content={data.body}
        setContent={(body) => setData({ ...data, body })}
        placeholder="Tell your story..."
        autoFocus={true}
        darkMode={darkMode} // <-- pass darkMode
      />
    </form>
  );
};

export default function Create() {
  const { darkMode } = useContext(ThemeContext); // <-- read theme
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // AUTO SAVE EFFECT
  useEffect(() => {
    setSaveStatus("Saving...");
    const timeout = setTimeout(() => {
      localStorage.setItem("draft-title", title);
      localStorage.setItem("draft-body", body);
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, body]);

  // LOAD SAVED DRAFT
  useEffect(() => {
    const savedTitle = localStorage.getItem("draft-title");
    const savedBody = localStorage.getItem("draft-body");

    if (savedTitle) setTitle(savedTitle);
    if (savedBody) setBody(savedBody);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim() || !body.trim()) {
      return toast.error("Title and body cannot be empty");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (coverImage) formData.append("coverImage", coverImage);

      await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Post created!");
      navigate("/");

      localStorage.removeItem("draft-title");
      localStorage.removeItem("draft-body");

      setTitle("");
      setBody("");
      setCoverImage(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#111" : "#fff",
        color: darkMode ? "#eee" : "#111",
      }}
    >
      <div
        style={{
          ...styles.topbar,
          background: darkMode ? "#1a1a1a" : "#fff",
          borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
        }}
      >
        <span style={styles.status}>{saveStatus}</span>
        <button onClick={handleSubmit} style={styles.publish} type="button">
          Publish
        </button>
      </div>

      <BlogForm
        data={{ title, coverImage, body }}
        setData={({ title, coverImage, body }) => {
          setTitle(title);
          setCoverImage(coverImage);
          setBody(body);
        }}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Georgia, serif",
  },
  topbar: {
    position: "sticky",
    top: 0,
    height: "60px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
    padding: "0 40px",
    zIndex: 100,
  },
  status: {
    fontSize: "13px",
    color: "#6b6b6b",
  },
  publish: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    background: "#1a8917",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  editorContainer: {
    maxWidth: "740px",
    margin: "60px auto",
    display: "flex",
    flexDirection: "column",
    padding: "0 20px",
  },
  title: {
    fontSize: "56px",
    fontWeight: "700",
    border: "none",
    outline: "none",
    boxShadow: "none",
    marginBottom: "30px",
    width: "100%",
    lineHeight: "1.2",
    background: "transparent",
  },
  file: {
    margin: 0,
    marginBottom: 16,
  },
};
