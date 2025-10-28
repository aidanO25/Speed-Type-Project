// src/pages/userProfile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProfileData = async() => {
      try {
        const response = await fetch ("http://localhost:8000/profileData/profileData", {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        } 

        const data = await response.json();
        setProfileDate(data);
      }
      catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);







  {/* USER LOG OUT */}
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/signIn");
  };

  return (
  <>
    {(() => {
      if (loading) {
        return <p className="profile-loading">Loading profile data...</p>;
      }

      if (error) {
        return <p className="profile-error">Error: {error}</p>;
      }



      if (profileData) {
        return (
    <div className="profile-container">
      {/* Main Profile Section */}
      <div className="profile-main">
        <div className="profile-avatar">👤</div>

        <div className="profile-info">
          <h2>{profileData.username}</h2>
          <p>Joined: {profileData.created_at}</p>
          <p>Snippets Completed: {profileData.total_attempts}</p>
        </div>
      </div>

      <div className="user_profile_stat_linebreak">



      </div>

      {/* Horizontal Stats Row */}
      <div className="profile-stats">
        <div className="stat-card">
          <h3>Easy WPM</h3>
          <p>{profileData.easy_best_wpm}</p>
        </div>
        <div className="stat-card">
          <h3>Medium WPM</h3>
          <p>{profileData.medium_best_wpm}</p>
        </div>
        <div className="stat-card">
          <h3>Hard WPM</h3>
          <p>{profileData.hard_best_wpm}</p>
        </div>
      </div>
    </div>
  );
      }

      return <p>No profile data available.</p>;
    })()}






    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Log Out
    </button>




  </>
);
}