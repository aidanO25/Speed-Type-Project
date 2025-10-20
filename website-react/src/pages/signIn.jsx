// src/pages/Profile.jsx
import { useState  } from "react";
import { useNavigate } from "react-router-dom"; //page navigation capability (use for navigating to the profile page)

export default function signIn() {

    const navigate = useNavigate()// for navigating to the profile page once signed in
    const [isSignUp, setIsSignUp] = useState(false) // to figure out if a user is looking to create an account or not

    let title;
    let extraFields = null;
    let submitButtonText; 
    let toggleExistingAccText;
    let toggleButtonText;

    let signInClass = "signIn" // base case
    if (isSignUp) {
        signInClass += " signIn--large"; // add a modifer when in sign-up mode
    }

    // IF THE USER IS TRYING TO SIGN UP
    if (isSignUp) {
        title = "Create Account";
        submitButtonText = "Sign Up"
        toggleExistingAccText = "Already have an account?";
        toggleButtonText = "Log In"
        extraFields = (
            <>
                <li>
                    <input type="email" placeholder="Email" />
                </li>
                <li>
                    <input type = "password" placeholder="Verify password" />
                </li>
            </>
        );
    }
    // user has an account
    else {
        title = "Welcome Back";
        submitButtonText = "Log In";
        toggleExistingAccText="Don't have an account?";
        toggleButtonText="Sign up";
    }


  return (
    // list of user fields for sign in/log in 
    <div className={signInClass}>
      <h1 style={{paddingBottom: "20px"}}>{title}</h1>
       <ul className="profileList">
            <li>
                <input type="text" placeholder="Username" />
            </li>
            <li>
                <input type="password" placeholder="Password"/>
            </li>

            {extraFields}

            <li>
                <input
                    type="button"
                    value={submitButtonText}
                    onClick={async () => {

                        const username = document.querySelector('input[placeholder="Username"]').value;
                        const password = document.querySelector('input[placeholder="Password"]').value;

                        let res;


                        // USER IS CREATING AN ACCOUNT (ALSO AUOT LOGS THEM IN)
                        if(isSignUp) {
                            const email = document.querySelector('input[placeholder="Email"]').value;
                            const vPassword = document.querySelector('input[placeholder="Verify password"]').value


                            //  CHANGE THIS FROM AN ELERT TO RED TEXT WITHIN THE PASSWORDS BOX
                            if (password != vPassword) {
                                alert("❌ Passwords do not match");
                                return;
                            }
                            
                            // CREATES THE USER ACCOUNT
                            res = await fetch("http://127.0.0.1:8000/createAcc", { 
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ username, password, email }),
                            });

                            const createResData = await res.json();

                            if (!res.ok) {
                                setErrorMessage(`❌ ${createResData.detail || "Signup failed"}`);
                                return;
                            }

                            // NOW AUTO-LOGIN THE USER AFTER ACCOUNT CREATION
                            const loginRes = await fetch("http://127.0.0.1:8000/auth/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ username, password }),
                            });

                            const loginResData = await loginRes.json();

                            if (!res.ok) {
                                setErrorMessage(`❌ ${loginResData.detail || "Login failed"}`);
                                return;
                            }

                            // Store session
                            localStorage.setItem("access_token", loginResData.access_token);
                            localStorage.setItem("username", username);

                            alert(`✅ Account created and signed in!`);
                            navigate("/userProfile");
                        } 

                        // USER IS LOGGING IN 
                        else {
                            res = await fetch("http://127.0.0.1:8000/auth/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ username, password }),
                            });

                            const logInData = await res.json();

                            if (!res.ok) {
                                setErrorMessage(`❌ ${logInData.detail || "Invalid credentials"}`);
                                return;
                            }

                            localStorage.setItem("access_token", logInData.access_token);
                            localStorage.setItem("username", username);

                            alert(`✅ Welcome back!`);
                            navigate("/userProfile");
                        }
                    }}
                />
            </li>
        </ul>

        
        <p className="accountCreate" style={{ marginTop: "10px" }}>
        {toggleExistingAccText}{" "}
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