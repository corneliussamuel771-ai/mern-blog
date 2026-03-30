import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Edit from "./pages/Edit.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext.jsx"; // <-- import ThemeContext
import "./auth.css";

export default function App() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext); // <-- read darkMode from context

  function PrivateRoute({ children }) {
    return user ? children : <Navigate to="/login" />;
  }

  const themeStyles = {
    background: darkMode ? "#121212" : "#f4f4f4",
    color: darkMode ? "white" : "black",
    minHeight: "100vh",
    transition: "all 0.3s ease", // smooth transition
  };

  return (
    <div style={themeStyles}>
      <Nav /> {/* No props needed now */}
      <div style={{ padding: "16px", maxWidth: "100%", overflowX: "hidden" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <Edit />
              </PrivateRoute>
            }
          />

          <Route path="/post/:id" element={<PostDetails />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

// Wrap the App with ThemeProvider at the root (usually index.jsx)
