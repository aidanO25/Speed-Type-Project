// src/pages/Profile.jsx
import { useState  } from "react";
import { useNavigate } from "react-router-dom"; //page navigation capability (use for navigating to the profile page)

export default function signIn() {
    const [isSignUp, setIsSignUp] = useState(false)

    let signInClass = "signIn" // base class
    if (isSignUp) {
        signInClass += " signIn--large"; // add a modifer when in sign-up mode
    }

    let title;
    let extraFields = null;
    let submitButtonText; 
    let toggleExistingAccText;
    let toggleButtonText;

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

                        // if the user is creating an account
                        if(isSignUp) {
                            const email = document.querySelector('input[placeholder="Email"]').value;
                            const vPassword = document.querySelector('input[placeholder="Verify password"]').value

                            if (password != vPassword) {
                                alert("❌ Passwords do not match");
                                return;
                            }
                            
                            res = await fetch("http://127.0.0.1:8000/createAcc", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ username, password, email}),
                            });
                        } else { // otherwise sign the existing user in
                            res = await fetch("http://127.0.0.1:8000/auth", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ username, password }),
                            });
                        }
                        const data = await res.json();

                        if (res.ok) {
                        alert(`✅ ${data.message}`);
                        } else {
                        alert(`❌ ${data.detail}`);
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