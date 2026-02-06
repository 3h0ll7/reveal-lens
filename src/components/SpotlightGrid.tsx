import { useEffect, useRef } from "react";

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

const SpotlightGrid = ({ mouseRef }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 60;
      const mx = mouseRef.current?.x ?? 0;
      const my = mouseRef.current?.y ?? 0;

      const targetX = (mx - window.innerWidth / 2) * 0.02;
      const targetY = (my - window.innerHeight / 2) * 0.02;
      gridOffset.current.x += (targetX - gridOffset.current.x) * 0.05;
      gridOffset.current.y += (targetY - gridOffset.current.y) * 0.05;

      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = gridOffset.current.x % spacing; x < canvas.width; x += spacing) {
        const dist = Math.abs(x - mx);
        const influence = Math.max(0, 1 - dist / 300);
        const wave = Math.sin(x * 0.01 + Date.now() * 0.001) * influence * 5;
        ctx.beginPath();
        ctx.moveTo(x + wave, 0);
        ctx.lineTo(x + wave, canvas.height);
        ctx.globalAlpha = 0.3 + influence * 0.4;
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = gridOffset.current.y % spacing; y < canvas.height; y += spacing) {
        const dist = Math.abs(y - my);
        const influence = Math.max(0, 1 - dist / 300);
        const wave = Math.sin(y * 0.01 + Date.now() * 0.001) * influence * 5;
        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        ctx.lineTo(canvas.width, y + wave);
        ctx.globalAlpha = 0.3 + influence * 0.4;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
    />
  );
};

export default SpotlightGrid;
