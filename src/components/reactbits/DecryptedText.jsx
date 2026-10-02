import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEF0123456789!@#$%^&*<>[]{}~=+/';

export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover', // 'hover' | 'view'
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
    : CHARS.split('');

  const triggerAnimation = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            if (sequential) {
              const shouldReveal =
                revealDirection === 'start'
                  ? index <= iteration
                  : index >= text.length - 1 - iteration;

              if (shouldReveal) {
                return text[index];
              }
            } else {
              if (iteration >= maxIterations) {
                return text[index];
              }
            }

            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration > (sequential ? text.length + 5 : maxIterations)) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            triggerAnimation();
            setHasAnimated(true);
          }
        },
        { threshold: 0.2 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [animateOn, hasAnimated, text]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovering(true);
      triggerAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block' }}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
