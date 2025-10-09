import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
/* ---------------- imported pages ------------------- */
import Profile from "./pages/signIn.jsx";
import Results from "./pages/results.jsx";
import TypingTest from "./pages/typingTest.jsx";

// declaring a React component (whatever return(...) contains will be rendered to the screen)
export default function App() {
  return (
    <>
      {/* Keep your existing heading */}
      <div className="heading">
        <div style={{ textAlign: "left" }}>
          <Link to="/">
            <img
              src="https://static.thenounproject.com/png/3574480-200.png"
              width="60"
              alt="Home" //nothing alternative now, just placeholder
            />
          </Link>
        </div>

        <div style={{ textAlign: "right" }}>
          <Link to="/signIn">
            <img
              src="https://static.thenounproject.com/png/638636-200.png"
              width="50"
              alt="Profile" //nothing alternative now, just placeholder
            />
          </Link>
        </div>
      </div>

      {/* Page routes */}
      <div className="main-aspect">
          <Routes>
            <Route path="/" element={<TypingTest />} /> 
            <Route path="/signIn" element={<Profile />} />
            <Route path="/results" element={<Results />} />
          </Routes>
      </div>
    </>
  );
}


/* ---------------- End of TypingTest function */
