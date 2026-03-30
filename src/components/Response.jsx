import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import ResponseItem from "./ResponseItem.jsx";
import { SendHorizontal } from "lucide-react";

export default function Responses({ postId }) {
  const { user } = useContext(AuthContext);
  const [responses, setResponses] = useState([]);
  const [text, setText] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/responses/${postId}`);
      setResponses(res.data);
    } catch (err) {
      console.error("Failed to load responses");
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/api/responses/${postId}`,
        { body: text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setResponses([res.data, ...responses]);
      setText("");
    } catch (err) {
      console.error("Failed to add response");
    }
  };

  return (
    <div style={styles.container}>
      <h3>Responses</h3>

      {user && (
        <div style={styles.inputBox}>
          <textarea
            placeholder="Write a response..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={handleSubmit} style={styles.button}>
            <SendHorizontal />
          </button>
        </div>
      )}

      {responses
        .filter((r) => r.parent === null)
        .map((response) => (
          <ResponseItem
            key={response._id}
            response={response}
            responses={responses}
            setResponses={setResponses}
            postId={postId}
          />
        ))}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "60px",
    outline: "none",
  },

  inputBox: {
    marginBottom: "30px",
    outline: "none",
    display: "flex",
    gap: "1rem",
    alignItems:"center"
  },

  textarea: {
    flex: 1,
    minHeight: "80px",
    fontFamily: "serif",
    fontSize: "15px",
    padding: "10px",
    outline: "none",
    border: "none",
    background: "white",
    color: "black",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  button: {
    background: "#000",
    width: 40,
    height:40,
    padding:0,
    border: "none",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:"50%",
    fontSize: "13px",
    color: "#c2c2c2d8",
    cursor: "pointer",
    outline: "none",
  },

  response: {
    borderBottom: "1px solid #eee",
    padding: "15px 0",
  },
};
