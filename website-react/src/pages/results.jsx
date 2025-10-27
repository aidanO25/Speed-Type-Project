// src/pages/results.jsx
import { useLocation, useNavigate } from "react-router-dom";


export default function Results() {
  // obtaining variables state's
  const { state } = useLocation();
  const totalChars = state?.totalChars ?? 0;
  const correct = state?.correct ?? 0;
  const incorrect = state?.incorrect ?? 0;
  const completionTime = state?.completionTime ?? 0;
  const wpm = state?.wpm ?? 0;
  const accuracy = state?.accuracy ?? 100;

  // CHECK IF THE USER IS LOGGED IN AND SHOW/HIDE THE "SIGN IN TO SAVE" LINK
  const token = localStorage.getItem("access_token");

  const navigate = useNavigate();




  return (
    <>
      <section className="my-box">
        <h1>Results</h1>

        <p>Total characters: {totalChars}</p>
        <p>Correct: {correct}</p>
        <p>Incorrect: {incorrect}</p>
        <p>Total time: {completionTime}ms</p>
        <p>WPM: {wpm}</p>
        <p>Accuracy: {accuracy}%</p>
      </section>

      {/* SHOW / HIDE THE "SIGN IN TO SAVE PROGRESS" LINK */}
      {!token && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <button
          className="save-progress-button"
          onClick={() => navigate("/signIn")}
          to="/signIn" 
        >

          Sign in to save progress
        </button>
      </div>
      )}


    </>
  );
}
