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
  <div className="profile-container">
    {(() => {
      if (loading) {
        return <p className="profile-loading">Loading profile data...</p>;
      }

      if (error) {
        return <p className="profile-error">Error: {error}</p>;
      }

      if (profileData) {
        return (
          <div className="profile-stats">
            <p>Username: {profileData.username}</p>
            <p><strong>Total Attempts:</strong> {profileData.total_attempts}</p>

            <p><strong>Average WPM:</strong> {profileData.avg_wpm}</p>
            <p><strong>Best WPM:</strong> {profileData.best_wpm}</p>


            <p><strong>Easy WPM:</strong> {profileData.easy_best_wpm}</p>
            <p><strong>Medium WPM:</strong> {profileData.medium_best_wpm}</p>
            <p><strong>Hard WPM:</strong> {profileData.hard_best_wpm}</p>
          </div>
        );
      }

      return <p>No profile data available.</p>;
    })()}






    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Log Out
    </button>



    
  </div>
);
}