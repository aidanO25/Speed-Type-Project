// src/pages/userProfile.jsx
export default function Profile() {
  const username = localStorage.getItem("username");
  
  return (
    <>
      <p>This is the user profile page</p>
      return <p>Wlecome, {username}</p>
    </>
  );
}