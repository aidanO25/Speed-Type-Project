// src/pages/results.jsx
import { useLocation, Link } from "react-router-dom";


export default function Results() {
  // obtaining variables state's
  const { state } = useLocation();
  const totalChars = state?.totalChars ?? 0;
  const correct = state?.correct ?? 0;
  const incorrect = state?.incorrect ?? 0;
  const completionTime = state?.completionTime ?? 0;



  return (
    <>
      <section className="my-box">
        <h1>Results</h1>

        <p>Total characters: {totalChars}</p>
        <p>Correct: {correct}</p>
        <p>Incorrect: {incorrect}</p>
        <p>Total time: {completionTime}ms</p>
      </section>

      {/* section to allow a user to sign in to save results */}
      <p style={{ marginTop: "20px", fontSize: "16px" }}>
        <Link 
          to="/signIn" 
          style={{ 
            color: "inherit", 
            textDecoration: "none", 
            fontWeight: "bold" 
          }}>

          Sign in {" "}
        </Link>
        to save progress
      </p>


    </>
  );
}
