// src/pages/SignIn.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { API_BASE } from "../config";

export default function SignIn() {
  const navigate = useNavigate();
   const { setIsLoggedIn } = useContext(AuthContext);

  // FORM STATE
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
        // user is looking to create an account
        if (isSignUp) {

            if (password !== verifyPassword) {
                setErrorMessage("❌ Passwords do not match");
                return;
            }

            // CREATE ACCOUNT
            const result = await fetch(`${API_BASE}/createAcc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            });

            const createData = await result.json();
            if (!result.ok) throw new Error(createData.detail || "Signup failed");

            // AUTO LOGIN ONCE ACCOUNT CREATED
            const loginRes = await fetch(`${API_BASE}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.detail || "Login failed");

            // SAVE THE TOKEN AND UPDATE LOGIN STATE
            localStorage.setItem("access_token", loginData.access_token);
            localStorage.setItem("username", username);
            setIsLoggedIn(true);
            navigate("/userProfile");
        } 
        // REGULAR LOGIN
        else {
            const res = await fetch(`${API_BASE}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Invalid credentials");

            // SAVE TOKEN AND UPDATE LOGIN STATE
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("username", username);
            setIsLoggedIn(true);
            navigate("/userProfile");
        }
    } 
    catch (err) {
      setErrorMessage(err.message);
    }
  }

  // CONDITIONAL HEADING TEXT
  let headingText;
  if (isSignUp) {
    headingText = "Create Account";
  } else {
    headingText = "Welcome Back";
  }

  // CONDITIONAL FORM FIELDS FOR SIGNUP VS LOGIN
  let extraFields = null;
  if (isSignUp) {
    extraFields = (
      <>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Verify password"
          value={verifyPassword}
          onChange={(event) => setVerifyPassword(event.target.value)}
          required
        />
      </>
    );
  }
    

  // CONDITIONAL SUBMIT BUTTON TEXT
  let submitButtonText;
  if (isSignUp) {
    submitButtonText = "Sign Up";
  } else {
    submitButtonText = "Log In";
  }

  // CONDITIONAL BOTTOM TEXT
  let toggleText;
  let toggleButtonText;
  if (isSignUp) {
    toggleText = "Already have an account?";
    toggleButtonText = "Log In";
  } else {
    toggleText = "Don't have an account?";
    toggleButtonText = "Sign Up";
  }

  // CONDITIONAL TITLE TEXT
  let signInClass = "signIn";
  if (isSignUp) {
    signInClass += " signIn--large";
  }

  return (
    <div className={signInClass}>
      <h1 style={{ paddingBottom: "20px" }}>{headingText}</h1>

      <form className="profileList" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {extraFields}

        <button type="submit">{submitButtonText}</button>

        {errorMessage && (
          <p className="error-text" style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}
      </form>

      <p className="accountCreate" style={{ marginTop: "10px" }}>
        {toggleText}{" "}
        <button
          type="button"
          className="accountCreateButton"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {toggleButtonText}
        </button>
      </p>
    </div>
  );
}