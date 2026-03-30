import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { BASE_URL } from "../constants";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Login failed");
      login(data);
      navigate("/");
    } catch (err) {
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="auth-page">
    <div
      style={{ maxWidth: "400px", margin: "60px auto", textAlign: "center" }}
    >
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
          disabled={loading}
        />
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    //</div>
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
  marginLeft: "30px",
  border: "none",
  backgroundColor: "#498bed",
  color: "#fff",
  cursor: "pointer",
};
