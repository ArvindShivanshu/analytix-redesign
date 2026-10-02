import React, { useState, useEffect, useRef } from 'react';

export default function TrueFocus({
  words = ['AUTONOMOUS', 'VISION-GUIDED', 'HIGH-SPEED', 'PRECISION'],
  className = '',
  glowColor = 'rgba(0, 242, 254, 0.6)',
  interval = 2500,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxDimensions, setBoxDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const wordsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  useEffect(() => {
    const activeEl = wordsRef.current[currentIndex];
    if (activeEl) {
      setBoxDimensions({
        width: activeEl.offsetWidth + 16,
        height: activeEl.offsetHeight + 8,
        left: activeEl.offsetLeft - 8,
        top: activeEl.offsetTop - 4,
      });
    }
  }, [currentIndex]);

  return (
    <div className={`relative inline-flex flex-wrap items-center gap-4 py-2 ${className}`}>
      {/* Animated Focus Box */}
      <div
        className="pointer-events-none absolute rounded-lg border-2 border-cyan-400 transition-all duration-500 ease-out"
        style={{
          width: `${boxDimensions.width}px`,
          height: `${boxDimensions.height}px`,
          transform: `translate(${boxDimensions.left}px, ${boxDimensions.top}px)`,
          boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px ${glowColor}`,
        }}
      >
        {/* Corner Reticles */}
        <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-cyan-300" />
        <span className="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-cyan-300" />
        <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-300" />
        <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-300" />
      </div>

      {words.map((word, idx) => (
        <span
          key={word}
          ref={(el) => (wordsRef.current[idx] = el)}
          onClick={() => setCurrentIndex(idx)}
          className={`cursor-pointer px-2 py-1 font-mono text-sm tracking-wider uppercase transition-colors duration-300 ${
            idx === currentIndex ? 'text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
