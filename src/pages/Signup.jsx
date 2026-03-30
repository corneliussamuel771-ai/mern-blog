import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Signup failed");
      navigate("/login");
    } catch (err) {
      setError("Server error, please try again.");
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "60px auto", textAlign: "center" }}
    >
      <h1>Create Account</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};
const btnStyle = {
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "none",
  marginLeft: "30px",
  backgroundColor: "#498bed",
  color: "#fff",
  cursor: "pointer",
};
