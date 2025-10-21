// src/pages/userProfile.jsx
import { useContext } from "react";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/signIn");
  };

  return (
    <>
      <p>This is the user profile page</p>
      <p>Welcome, {username}</p>

      <button onClick={handleLogout}>Log Out</button>
    </>
  );
}