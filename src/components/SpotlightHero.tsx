import { useCallback, useEffect, useRef, useState } from "react";
import portraitMain from "@/assets/portrait-main.png";
import portraitAlt from "@/assets/portrait-alt.png";

interface Echo {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

const SPOTLIGHT_RADIUS = 120;

const SpotlightHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -300, y: -300 });
  const smoothMouse = useRef({ x: -300, y: -300 });
  const prevMouse = useRef({ x: -300, y: -300 });
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const echoIdRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Smooth cursor tracking
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Parallax
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x: -cx * 8, y: -cy * 8 });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Echo spawning
  useEffect(() => {
    let lastEchoTime = 0;
    const interval = setInterval(() => {
      const dx = mouseRef.current.x - prevMouse.current.x;
      const dy = mouseRef.current.y - prevMouse.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      prevMouse.current = { ...mouseRef.current };

      if (speed > 15 && Date.now() - lastEchoTime > 60) {
        lastEchoTime = Date.now();
        const id = echoIdRef.current++;
        setEchoes((prev) => [
          ...prev.slice(-8),
          { id, x: smoothMouse.current.x, y: smoothMouse.current.y, opacity: 0.5 },
        ]);
        // Fade out
        setTimeout(() => {
          setEchoes((prev) => prev.filter((e) => e.id !== id));
        }, 600);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Canvas animation loop for spotlight mask
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Lerp smooth cursor
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.12;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.12;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw alt image clipped to spotlight circle
    const img = altImgRef.current;
    if (img && img.complete) {
      // Calculate cover dimensions
      const containerAspect = canvas.width / canvas.height;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW, drawH, drawX, drawY;
      if (imgAspect > containerAspect) {
        drawH = canvas.height;
        drawW = drawH * imgAspect;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      // Main spotlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(smoothMouse.current.x, smoothMouse.current.y, SPOTLIGHT_RADIUS, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Echo spotlights
      echoes.forEach((echo) => {
        ctx.save();
        ctx.globalAlpha = echo.opacity * 0.4;
        ctx.beginPath();
        ctx.arc(echo.x, echo.y, SPOTLIGHT_RADIUS * 0.7, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      });
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [echoes]);

  const altImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Preload alt image
    const img = new Image();
    img.src = portraitAlt;
    (altImgRef as React.MutableRefObject<HTMLImageElement>).current = img;
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  // Animated grid
  const gridRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const gridCanvas = gridRef.current;
    if (!gridCanvas) return;
    let frame: number;

    const drawGrid = () => {
      const ctx = gridCanvas.getContext("2d");
      if (!ctx) return;
      gridCanvas.width = window.innerWidth;
      gridCanvas.height = window.innerHeight;

      const spacing = 60;
      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      ctx.strokeStyle = "hsla(0, 0%, 75%, 0.08)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < gridCanvas.width; x += spacing) {
        for (let y = 0; y < gridCanvas.height; y += spacing) {
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 400);
          const offsetX = dx * influence * 0.03;
          const offsetY = dy * influence * 0.03;

          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, 1 + influence * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(drawGrid);
    };
    frame = requestAnimationFrame(drawGrid);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Text inversion detection
  const [nameInverted, setNameInverted] = useState(false);
  const [navInverted, setNavInverted] = useState(false);
  const [socialInverted, setSocialInverted] = useState(false);
  const nameElRef = useRef<HTMLDivElement>(null);
  const navElRef = useRef<HTMLAnchorElement>(null);
  const socialElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;
      const r = SPOTLIGHT_RADIUS;

      const checkOverlap = (el: HTMLElement | null) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const closestX = Math.max(rect.left, Math.min(mx, rect.right));
        const closestY = Math.max(rect.top, Math.min(my, rect.bottom));
        const dist = Math.sqrt((mx - closestX) ** 2 + (my - closestY) ** 2);
        return dist < r;
      };

      setNameInverted(checkOverlap(nameElRef.current));
      setNavInverted(checkOverlap(navElRef.current));
      setSocialInverted(checkOverlap(socialElRef.current));
    };
    const interval = setInterval(check, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-background cursor-none select-none"
    >
      {/* Animated grid */}
      <canvas ref={gridRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Main portrait */}
      <div
        className="absolute inset-0 z-10"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <img
          src={portraitMain}
          alt="Hassan Salman"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Alt portrait via canvas spotlight */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Spotlight cursor visual ring */}
      <div
        className="fixed z-30 pointer-events-none rounded-full border border-foreground/20"
        style={{
          width: SPOTLIGHT_RADIUS * 2,
          height: SPOTLIGHT_RADIUS * 2,
          left: smoothMouse.current.x - SPOTLIGHT_RADIUS,
          top: smoothMouse.current.y - SPOTLIGHT_RADIUS,
          transition: "left 0.08s ease-out, top 0.08s ease-out",
        }}
      />

      {/* Name - top left */}
      <div
        ref={nameElRef}
        className="absolute top-8 left-8 z-40 font-display leading-none"
        style={{
          color: nameInverted ? "hsl(0,0%,100%)" : "hsl(var(--foreground))",
          transition: "color 300ms ease",
          transform: `translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)`,
        }}
      >
        <div className="text-4xl md:text-5xl font-semibold tracking-tight">𝓗𝓪𝓼𝓼𝓪𝓷</div>
        <div className="text-4xl md:text-5xl font-semibold tracking-tight">𝓼𝓪𝓵𝓶𝓪𝓷</div>
      </div>

      {/* Nav - top right */}
      <a
        ref={navElRef}
        href="#"
        className="absolute top-10 right-8 z-40 text-sm tracking-widest uppercase font-medium"
        style={{
          color: navInverted ? "hsl(0,0%,100%)" : "hsl(var(--foreground))",
          transition: "color 300ms ease",
          transform: `translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)`,
          fontFamily: "var(--font-body)",
        }}
      >
        F1 Records
      </a>

      {/* Social icons - bottom right */}
      <div
        ref={socialElRef}
        className="absolute bottom-8 right-8 z-40 flex gap-5"
        style={{
          transform: `translate(${parallax.x * 0.3}px, ${parallax.y * 0.3}px)`,
        }}
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          style={{
            color: socialInverted ? "hsl(0,0%,100%)" : "hsl(var(--foreground))",
            transition: "color 300ms ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X / Twitter"
          style={{
            color: socialInverted ? "hsl(0,0%,100%)" : "hsl(var(--foreground))",
            transition: "color 300ms ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SpotlightHero;
