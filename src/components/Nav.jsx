import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        ...styles.nav,
        backgroundColor: darkMode ? "#121212" : "white",
        color: darkMode ? "white" : "#000",
      }}
    >
      <div style={styles.inner}>
        <h2 style={styles.logo}>MyBlog</h2>

        {/* Hamburger menu */}
        {isMobile && (
          <button
            style={styles.menuBtn}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Links */}
        <div
          style={{
            ...styles.links,
            flexDirection: isMobile ? "column" : "row",
            position: isMobile ? "absolute" : "static",
            top: isMobile ? "60px" : "auto",
            right: isMobile ? 0 : "auto",
            width: isMobile ? "100%" : "auto",
            maxHeight: isMobile ? (open ? "500px" : "0") : "none",
            overflow: isMobile ? "hidden" : "visible",
            background: isMobile
              ? darkMode
                ? "#121212"
                : "white"
              : "transparent",
            padding: isMobile ? "10px 20px" : "0",
            borderRadius: isMobile ? "0 0 6px 6px" : "0",
            boxShadow: isMobile ? "0 2px 12px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.3s ease",
            zIndex: 1000,
            display: isMobile ? "flex" : "flex",
          }}
        >
          <Link
            style={{ ...styles.link, color: darkMode ? "white" : "#000" }}
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                style={{ ...styles.link, color: darkMode ? "white" : "#000" }}
                to="/create"
                onClick={() => setOpen(false)}
              >
                Write
              </Link>
              <Link
                style={{ ...styles.link, color: darkMode ? "white" : "#000" }}
                to="/profile"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <button
                style={{
                  ...styles.linkBtn,
                  color: darkMode ? "white" : "#000",
                }}
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                style={{ ...styles.link, color: darkMode ? "white" : "#000" }}
                to="/login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                style={{ ...styles.link, color: darkMode ? "white" : "#000" }}
                to="/register"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button style={styles.darkBtn} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: "100%",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    borderBottom: "1px solid #e2e2e2",
    zIndex: 1000,
  },
  inner: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
    position: "relative",
  },
  logo: {
    fontFamily: "serif",
    fontWeight: "bold",
    fontSize: "1.5rem",
    margin: 0,
  },
  menuBtn: {
    fontSize: "1.8rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    zIndex: 1100,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    textDecoration: "none",
    fontWeight: 500,
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  linkBtn: {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
  },
  darkBtn: {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    color: "#6b6b6b",
    fontSize: "1.1rem",
    outline: "none",
  },
};
