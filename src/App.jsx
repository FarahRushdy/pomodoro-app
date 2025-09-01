import React, { useState, useEffect, useRef } from "react";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState("Session");
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // format time mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartStop = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setMode("Session");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // break/session adjust
  const changeBreak = (amount) => {
    if (running) return;
    const newLength = breakLength + amount;
    if (newLength > 0 && newLength <= 60) {
      setBreakLength(newLength);
    }
  };

  const changeSession = (amount) => {
    if (running) return;
    const newLength = sessionLength + amount;
    if (newLength > 0 && newLength <= 60) {
      setSessionLength(newLength);
      setTimeLeft(newLength * 60);
    }
  };

  // timer effect
  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        }

        // === when timer reaches 0 ===
        if (audioRef.current) {
          audioRef.current.play();
        }

        if (mode === "Session") {
          setMode("Break");
          return breakLength * 60;
        } else {
          setMode("Session");
          return sessionLength * 60;
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, mode, breakLength, sessionLength]);

  return (
    <div className="app" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>25 + 5 Clock</h1>

      <div id="break-label">
        Break Length
        <button id="break-decrement" onClick={() => changeBreak(-1)}>
          -
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={() => changeBreak(1)}>
          +
        </button>
      </div>

      <div id="session-label">
        Session Length
        <button id="session-decrement" onClick={() => changeSession(-1)}>
          -
        </button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={() => changeSession(1)}>
          +
        </button>
      </div>

      <div>
        <h2 id="timer-label">{mode}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <button id="start_stop" onClick={handleStartStop}>
        {running ? "Pause" : "Start"}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>

      <audio
        id="beep"
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      ></audio>
    </div>
  );
}

export default App;
