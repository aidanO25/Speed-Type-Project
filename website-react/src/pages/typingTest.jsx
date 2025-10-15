// src/pages/typingTest.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; //page navigation capability
/* ---------------- Typing Test Page ---------------- */
export default function TypingTest() {
  // for navigation to results
  const navigate = useNavigate()

  // useState variables
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


  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState([]);
  const [totalChars, setTotalChars] = useState(0);

  //front end function to fetch a code snippet
  async function languageChange(selectedLang) {
    try {
      setLoading(true);
      setErr(null);

      // prefer the passed-in value, otherwise use current state
      const lang = typeof selectedLang === "string" ? selectedLang : language;

      const res = await fetch(
        `http://127.0.0.1:8000/snippets/language?language=${encodeURIComponent(lang)}&difficulty=${difficulty}`
      );
      if (!res.ok) throw new Error("Failed to fetch snippet");
      const data = await res.json();

      setSnippet(data);
      setTyped([]);
      setCurrentIndex(0);
      setTotalChars(data.snippet.length);
    } catch (e) {
      console.error(e);
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  // LOGIC FOR CHANGING THE SNIPET LANGUAGE 
  const [language, setLanguage] = useState("python"); // select language (python default)
  const [difficulty, setDifficulty] = useState("all") // select the difficulty (default to any)
  
  // logic for the language select button
  let buttonText;
  if (loading) {
    buttonText = "Loading...";
  } else {
    buttonText = "load new";
  }

  // fetch once on mount
  useEffect(() => { languageChange(); }, []);

  // loads a new snipet when a user selects a new language
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    languageChange(selectedLang); // immediately fetch new for this language
  }

  // CHANGES THE SNIPPET DIFFICULTY LEVEL
  useEffect(() => {
  async function fetchByDifficulty() {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(
        `http://127.0.0.1:8000/snippets/alterDifficulty?difficulty=${difficulty}&language=${language}`
      );
      if (!res.ok) throw new Error("Failed to fetch snippet");
      const data = await res.json();

      setSnippet(data); // full object
      setCurrentIndex(0);
      setTyped([]);
      setTotalChars(data.snippet.length);
    } catch (e) {
      console.error(e);
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  fetchByDifficulty();
}, [difficulty]);


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


      /* -------------- SPECIAL KEY HANDLING-------------- */
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

      {/* -------------- TYPING AREA-------------- */}
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

          {/* Typing logic */}
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

      {/* -------------- USER OPTIONS-------------- */}
      < div className = "option-row">

              {/* LOAD SNIPPET BUTTON */}
              <button 
                onClick={() => {
                  setLoading(true);
                  fetch(`http://127.0.0.1:8000/snippets/alterDifficulty?difficulty=${difficulty}&language=${language}`)
                    .then((res) => res.json())
                    .then((data) => {
                      setSnippet(data); // <- full object
                      setLanguage(data.language);
                      setCurrentIndex(0);
                      setTyped([]);
                      setTotalChars(data.snippet.length);
                    })
                    .catch((err) => setErr(String(err)))
                    .finally(() => setLoading(false));
                }}
                disabled={loading}
                className="snippet-options"
              >
                {buttonText}
              </button>


              {/* LANGUAGE SELECT */}
              <select 
                value = {language}
                onChange={handleLanguageChange}
                disabled = {loading}
                className="snippet-options"

              >
                <option value = "python">Python</option>
                <option value = "java">Java</option>
                <option value = "plain">Plain</option>
              </select>


              {/* DIFFICULTY SELECT */}
              <select 
                className="snippet-options"
                value = {difficulty}
                disabled = {loading}
                onChange = {(e) => setDifficulty(e.target.value)}
              >
                <option value = "all">Any Level</option>
                <option value = "1">Lv 1</option>
                <option value = "2">Lv 2</option>
                <option value = "3">Lv 3</option>
                <option value = "4">Lv 4</option>
                <option value = "5">Lv 5</option>
                <option value = "6">Lv 6</option>
                <option value = "7">Lv 7</option>
                <option value = "8">Lv 8</option>
                <option value = "9">Lv 9</option>
                <option value = "10">Lv 10</option>

              </select>

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