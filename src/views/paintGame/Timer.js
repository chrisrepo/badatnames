import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ maxTime }) => {
  const [secondsLeft, setSecondsLeft] = useState(maxTime);
  const intervalRef = useRef(null); // Maintain one interval across hook rerenders

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [maxTime]); // Since maxTime is constant, this useEffect will only run once

  if (secondsLeft === 0) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  return (
    <div className="timer">
      Time:<div className="timer-count">{secondsLeft}</div>
    </div>
  );
};

export default Timer;
