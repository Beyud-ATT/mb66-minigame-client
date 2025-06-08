import { useState, useEffect } from "react";
import { formatTime } from "../utils/timeUtils";

const CountdownTimer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const progress = (timeLeft / initialTime) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Get color based on progress
  const getProgressColor = () => {
    if (progress <= 25) return "bg-red-500"; // Red for last 25%
    if (progress <= 50) return "bg-yellow-500"; // Yellow for 26-50%
    return "bg-green-500"; // Green for 51-100%
  };

  return (
    <div className="w-full px-4 max-w-[400px]">
      {/* Timer text */}
      <div className="text-center mb-1 font-bold">{formatTime(timeLeft)}</div>

      {/* Progress bar container */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        {/* Progress bar */}
        <div
          className={`h-full transition-all duration-1000 ${getProgressColor()}`}
          style={{
            width: `${progress}%`,
            transition: "width 1s linear",
          }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
