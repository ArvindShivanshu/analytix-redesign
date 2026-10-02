import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Increment progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFading(true);
          setTimeout(() => {
            setHidden(true);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      className="aaruush-preloader"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFading ? 'none' : 'all',
      }}
    >
      <div className="preloader-content">
        {/* Insignia / Brand mark */}
        <div className="preloader-logo-box">
          <img src="/stock/facicon.png" alt="AnalytiX" className="preloader-logo" />
        </div>

        {/* System Boot Subtitle */}
        <div className="preloader-tag">
          TEAM ANALYTIX // SEGROBOT PROTOCOL
        </div>

        {/* Progress Bar Track */}
        <div className="preloader-track">
          <div
            className="preloader-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Numbers & Telemetry */}
        <div className="preloader-meta">
          <span className="preloader-percent">{progress}%</span>
          <span className="preloader-status">
            {progress < 40
              ? 'CALIBRATING KINEMATICS...'
              : progress < 80
              ? 'INITIALIZING SIFT VISION MODELS...'
              : 'SYSTEM READY // SRI VENKATESWARA ARENA'}
          </span>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            setIsFading(true);
            setTimeout(() => {
              setHidden(true);
              if (onComplete) onComplete();
            }, 300);
          }}
          className="preloader-skip-btn"
        >
          Skip Intro ↗
        </button>
      </div>
    </div>
  );
}
