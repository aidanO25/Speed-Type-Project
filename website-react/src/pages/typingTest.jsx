// src/pages/typingTest.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; //page navigation capability
/* ---------------- Typing Test Page ---------------- */
export default function TypingTest() {
  // for navigation to results
  const navigate = useNavigate()

  // hold snipet + loading/error
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null); 
  const [startTime, setStartTime] = useState(null); //useState allows the component to persist through re-renders

  // use the fetched snippet as the target text the user must type
  let targetText = "";
  if (snippet && snippet.snippet) {
    targetText = snippet.snippet;
  } else {
    if (loading) {
      targetText = "Loading...";
    } else {
      targetText = "Error loading snippet";
    }
  }
  const chars = useMemo(
    () => targetText.split(""), // splits targetText into an array of characters
    [targetText]                // chars only recalculates if targetText changes
  );

  /* State hooks (React remembers these between re-renders)
     const [value, setValue] = useState(initialValue);
  */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState([]);
  const [totalChars, setTotalChars] = useState(0);

  //front end funciton to fetch a code snippet
  async function language() {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("http://127.0.0.1:8000/snippets/language?language=python");
      if (!res.ok) throw new Error("Failed to fetch snippet");
      const data = await res.json();       // { id, language, content }
      setSnippet(data);
      // reset typing state for the new text
      setTyped([]);
      setCurrentIndex(0);
      setTotalChars(data.snippet.length); 
    } 
    catch (e) 
    {
      console.error(e);
      setErr(String(e));
    } finally {
      setLoading(false);
    }

  
    
  }

  /*
    - This is where we are going to attempt to build a funciton to retieve information 
      about the number of correct and incorrect characters
    - ----------

    async function loadCorrect() {
      try { // This allows us to catch a load/fetch err
        setLoading(true)
      }
    }
  */

  // fetch once on mount
  useEffect(() => { language(); }, []);


  // logic for deciding what char the user is on, and if they got it correct or incorrect
  // Runs after React renders; effect re-runs when [currentIndex, chars.length] change
  useEffect(() => {
    function onKeyDown(e) {
      if (loading || err || !snippet) return;

      // sets the start time once the first key is pressed
      if (!startTime) {
        setStartTime(Date.now());
      }
      

      // stop the page from scrolling on these keys
      const scrollKeys = new Set([
        " ",             // Space (still want to type it)
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End"
      ]);
      if (scrollKeys.has(e.key)) e.preventDefault();

      // handle Backspace
      if (e.key === "Backspace") {
        if (currentIndex > 0) {
          e.preventDefault();
          setTyped((prev) => prev.slice(0, -1)); // remove last typed char
          setCurrentIndex((i) => i - 1);         // move back one index
        }
        return;
      }

      // handle Enter
      if (e.key === "Enter") {
        e.preventDefault(); // prevents form submission or line skip

        const newTyped = [...typed, "\n"];
        const newIndex = currentIndex + 1;

        setTyped(newTyped);
        setCurrentIndex(newIndex);

        if (newIndex >= chars.length) {
          setTimeout(() => finishTest(newTyped), 0);
        }

        return;
      }

      // handle Tab
      if (e.key === "Tab") {
          e.preventDefault();

          const tabSize = 4;
          const spaces = Array(tabSize).fill(" ");
          const newTyped = [...typed, ...spaces];
          const newIndex = currentIndex + tabSize;

          setTyped(newTyped);
          setCurrentIndex(newIndex);

          if (newIndex >= chars.length) {
            setTimeout(() => finishTest(newTyped), 0);
          }

          return;
        }

      // handle normal typing
      if (e.key.length !== 1) return;           // ignore non-printing keys
      if (currentIndex >= chars.length) return; // already finished

      //setTyped((prev) => [...prev, e.key]);

      if (e.key.length === 1 && currentIndex < chars.length) {
        const finalTyped = [...typed, e.key];
        setTyped(finalTyped);

        if (currentIndex === chars.length - 1) {
          // this was the final character
          setCurrentIndex((i) => i + 1);
          setTimeout(() => finishTest(finalTyped), 0);
        } else {
          setCurrentIndex((i) => i + 1);
        }

        return;
      }
      
    }

    // function to take the user to the results page
    function finishTest(finalTypedArray) {
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const timeTakenInSeconds = (durationMs / 1000).toFixed(2);

      let correct = 0;
      let incorrect = 0;

      for (let i = 0; i < chars.length; i++) {
        if (finalTypedArray[i] === chars[i]) {
          correct ++;
        } else {
          incorrect ++;
        }
      }

      // navigate to the results page to display the information below
      navigate("/results", {
        state: {
          totalChars: chars.length,
          correct,
          incorrect,
          completionTime: timeTakenInSeconds,
        },
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, chars.length, loading, err, snippet]);







  

  /*
    - re-render UI
    - map over each character and render it as a <span>
    - className changes based on state (current, correct, incorrect)
    - React re-renders when `typed` or `currentIndex` change
  */

  return (
    <>
      <h1>Coding Speed Test</h1>

      <button onClick={language} disabled={loading} style={{ marginBottom: 12 }}>
        {loading ? "Loading…" : "python"}
      </button>

      <div className="my-box">
        {chars.map((char, i) => {

          let cls = "";
          let displayChar = char;

          if (char === "\n") {
            const isCurrent = i === currentIndex;
            const userTyped = typed[i];

            let cls = "";
            if (userTyped !== undefined && userTyped !== "\n") {
              cls = "incorrect-newline";
            } else if (userTyped === "\n") {
              cls = "correct newline";
            } else if (isCurrent) {
              cls = "current-newline";
            }

            return (
              <div key={i} className={`newline-block ${cls}`}>

              </div>
            );
          }




          if (i === currentIndex) {
            cls = "current";
          } else if (typed[i] !== undefined) {
            cls = typed[i] === char ? "correct" : "incorrect";
          }

          // special handling for space characters/errors
          if (char === " ") {
            if (typed[i] !== undefined && typed[i] !== " ") {
              return <span key={i} className="space-error"></span>
            } else {
              displayChar = "\u00A0";
            }
          }


          return (
            <span key={i} className={cls}>
              {char}
            </span>
          );
        })}

        
      </div>

      {err && <div style={{ marginTop: 8, color: "red" }}>{err}</div>}
    </>
  );
}




/* could be swapped with the current if ther's future issues
{chars.map((char, i) => {
  if (char === "\n") return <br key={i} />;         // render line breaks
  const display = char === " " ? "\u00A0" : char;   // keep visible spaces
  let cls = "";
  if (i === currentIndex) cls = "current";
  else if (typed[i] !== undefined) cls = typed[i] === char ? "correct" : "incorrect";

  return (
    <span key={i} className={cls}>
      {display}
    </span>
  );
})}
  */