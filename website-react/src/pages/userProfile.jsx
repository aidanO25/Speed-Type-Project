// src/pages/userProfile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_BASE}/profileData/profileData`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        /* This is more of a bandaid at the moment. If the user was signed in previously and their toek expired 
        the error would be throw. I figued if that happens we just send them back to the signIn page if they try to access
        the profileData*/
        if (!response.ok) throw new Error(navigate("/signIn"));

        const data = await response.json();
        setProfileData(data);

      } catch (err) {
        console.error("Error:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  // USER LOG OUT
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/signIn");
  };

  return (
    <>
      {(() => {
        if (loading) return <p className="profile-loading">Loading profile data...</p>;
        if (error) return <p className="profile-error">Error: {error}</p>;
        if (!profileData) return <p>No profile data available.</p>;


        // data formating
        const rawDate = profileData.created_at;
        const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });


        return (
          <div className="profile-container">

            {/* Main Profile Section */}
            <div className="profile-main">
              <div className="profile-avatar">👤</div>

              <div className="profile-info">
                <h2>{profileData.username}</h2>
                <p>Joined: {formattedDate}</p>
                <p>Snippets Completed: {profileData.total_attempts}</p>
              </div>
            </div>

            <div className="user_profile_stat_linebreak"></div>

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
      })()}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Log Out
      </button>
    </>
  );
}