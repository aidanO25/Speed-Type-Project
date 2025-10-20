import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
/* ---------------- imported pages ------------------- */
import SignIn from "./pages/signIn.jsx";
import Results from "./pages/results.jsx";
import TypingTest from "./pages/typingTest.jsx";
import Profile from "./pages/userProfile.jsx";
import Settings from "./pages/settings.jsx";

// declaring a React component (whatever return(...) contains will be rendered to the screen)
export default function App() {
  return (
    <>
      {/* Keep your existing heading */}
      <div className="heading">
        <div className = "left-icons">
          <h1 style={{ fontSize: "40px" }}>Logo</h1>
          <Link to="/">
            <img
              src="https://static.thenounproject.com/png/3574480-200.png"
              width="45"
              alt="Home" //nothing alternative now, just placeholder
            />
          </Link>


          <Link to="/settings">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ic_settings_48px.svg/1024px-Ic_settings_48px.svg.png"
              width="30"
              alt="Home" //nothing alternative now, just placeholder
            />
          </Link>
      </div>

        <div style={{ textAlign: "right" }}>
          <Link to="/signIn">
            <img
              src="https://static.thenounproject.com/png/638636-200.png"
              width="40"
              alt="Profile" //nothing alternative now, just placeholder
            />
          </Link>
        </div>
      </div>

      {/* Page routes */}
      <div className="main-aspect">
          <Routes>
            <Route path="/" element={<TypingTest />} /> 
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/results" element={<Results />} />
            <Route path="/userProfile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
      </div>
    </>
  );
}


/* ---------------- End of TypingTest function */
