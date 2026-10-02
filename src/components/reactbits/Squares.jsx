import React, { useRef, useEffect } from 'react';

export default function Squares({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(255, 255, 255, 0.05)',
  squareSize = 40,
  hoverFillColor = 'rgba(0, 242, 254, 0.12)',
  className = '',
}) {
  const canvasRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const col = Math.floor((mouseX - (gridOffset.current.x % squareSize)) / squareSize);
      const row = Math.floor((mouseY - (gridOffset.current.y % squareSize)) / squareSize);

      hoveredSquare.current = { col, row };
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numCols = Math.ceil(canvas.width / squareSize) + 2;
      const numRows = Math.ceil(canvas.height / squareSize) + 2;

      const offsetX = gridOffset.current.x % squareSize;
      const offsetY = gridOffset.current.y % squareSize;

      for (let i = -1; i < numCols; i++) {
        for (let j = -1; j < numRows; j++) {
          const x = i * squareSize + offsetX;
          const y = j * squareSize + offsetY;

          if (
            hoveredSquare.current &&
            hoveredSquare.current.col === i &&
            hoveredSquare.current.row === j
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      // Move grid based on direction
      if (direction === 'diagonal') {
        gridOffset.current.x = (gridOffset.current.x - speed + squareSize) % squareSize;
        gridOffset.current.y = (gridOffset.current.y - speed + squareSize) % squareSize;
      } else if (direction === 'down') {
        gridOffset.current.y = (gridOffset.current.y + speed) % squareSize;
      } else if (direction === 'right') {
        gridOffset.current.x = (gridOffset.current.x + speed) % squareSize;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className={`w-full h-full pointer-events-auto ${className}`} />;
}
