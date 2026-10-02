import React, { useRef, useState } from 'react';

export default function Magnet({
  children,
  strength = 30,
  radius = 120,
  className = '',
  ...props
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < radius) {
      const pull = 1 - distance / radius;
      setPosition({
        x: (distanceX / (width / 2)) * strength * pull,
        y: (distanceY / (height / 2)) * strength * pull,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
