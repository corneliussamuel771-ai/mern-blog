import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ResponseItem({
  response,
  responses,
  setResponses,
  postId,
}) {
  const { user } = useContext(AuthContext);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  console.log(user);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const [replies, setReplies] = useState([]);

  const getReplies = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/responses/reply/${response._id}`,
    );

    setReplies(res.data);
  };

  useEffect(() => {
    getReplies();
  }, []);

  const submitReply = async () => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/responses/reply/${response._id}`,
      {
        reply: replyText,
        author: user.id,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    await getReplies();

    setResponses((prev) => [...prev, res.data]);
    setReplyText("");
    setShowReply(false);
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${BASE_URL}/api/responses/like/${response._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setResponses((prev) =>
      prev.map((r) => (r._id === res.data._id ? res.data : r)),
    );
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    await axios.delete(`${BASE_URL}/api/responses/${response._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setResponses((prev) => prev.filter((r) => r._id !== response._id));
  };

  const isAuthor =
    user && (response.author?._id === user.id || response.author === user.id);

  return (
    <div
      style={{
        marginTop: "20px",
        marginLeft: response.parent ? "30px" : "0px",
        marginBottom: "15px",
        position: "relative",
      }}
    >
      {!!replies.length && (
        <div
          style={{
            borderLeft: "1px solid #d3d3d3",
            position: "absolute",
            bottom: 0,
            left: 12,
            height: "calc(100% - 32px)",
          }}
        />
      )}

      <div style={styles.header}>
        <img
          src={
            response.author?.avatar
              ? `${BASE_URL}${response.author.avatar}`
              : "https://i.pravatar.cc/40"
          }
          alt="avatar"
          style={styles.avatar}
        />

        <div>
          <strong>{response.author?.username || "User"}</strong>
          <p style={{ margin: 0 }}>{response.body}</p>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <button
              onClick={handleLike}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                fontSize: "13px",
                color: "#6b6b6b",
                cursor: "pointer",
                outline: "none",
              }}
            >
              👍 {response.likes?.length || 0}
            </button>

            {user && (
              <button
                onClick={() => setShowReply(!showReply)}
                style={styles.plainButton}
              >
                Reply {replies?.length ?? 0}
              </button>
            )}

            {isAuthor && (
              <button
                onClick={handleDelete}
                style={{ ...styles.plainButton, color: "#b42318" }}
              >
                Delete
              </button>
            )}
          </div>

          {/* REPLY BOX */}
          {showReply && (
            <div style={{ marginTop: "10px", marginLeft: "12px" }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "60px",
                  background: "white",
                  color: "black",
                }}
                placeholder="Write a reply..."
              />
              <button onClick={submitReply}> Reply</button>
            </div>
          )}
        </div>
      </div>

      {/* REPLIES */}
      {!!replies?.length && (
        <div
          style={{
            paddingLeft: "16px",
            paddingTop: "20px",
            marginTop: "8px",
            marginLeft: "8px",
          }}
        >
          {replies?.map((reply) => (
            <ResponseReplies key={reply._id} response={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
export function ResponseReplies({ response }) {
  const styles = {
    header: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
    },

    avatar: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      objectFit: "cover",
      marginTop: "8px",
    },
  };

  return (
    <div
      style={{
        marginLeft: response.parent ? "30px" : "0px",
        paddingBottom: "4px",
      }}
    >
      <div style={styles.header}>
        <img
          src={
            response.author?.avatar
              ? `${BASE_URL}${response.author.avatar}`
              : "https://i.pravatar.cc/40"
          }
          alt="avatar"
          style={styles.avatar}
        />

        <div style={{ padding: 0 }}>
          <span
            style={{
              margin: 0,
              padding: 0,
              fontSize: "12px",
            }}
          >
            @{response.author?.username || "User"}
          </span>
          <p style={{ margin: 0, padding: 0 }}>{response.reply}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  avatar: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  plainButton: {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    fontSize: "13px",
    color: "#6b6b6b",
    cursor: "pointer",
    outline: "none",
  },
};
