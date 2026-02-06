import { useCallback, useEffect, useRef, useState } from "react";
import portraitMain from "@/assets/portrait-main.png";
import portraitAlt from "@/assets/portrait-alt.png";
import SpotlightGrid from "./SpotlightGrid";
import { useSpotlightCursor } from "@/hooks/useSpotlightCursor";

interface Echo {
  id: number;
  x: number;
  y: number;
  size: number;
}

const SpotlightHero = () => {
  const { cursor, parallax, smoothRef, velocityRef, baseRadius } = useSpotlightCursor();
  const [entered, setEntered] = useState(false);
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const echoIdRef = useRef(0);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 1400); // after loader
    return () => clearTimeout(timer);
  }, []);

  // Echo spawning
  useEffect(() => {
    let lastEchoTime = 0;
    const interval = setInterval(() => {
      const vel = velocityRef.current;
      if (vel > 8 && Date.now() - lastEchoTime > 50) {
        lastEchoTime = Date.now();
        const id = echoIdRef.current++;
        const size = baseRadius * 2 * Math.min(vel / 30, 1.2);
        setEchoes((prev) => [
          ...prev.slice(-10),
          { id, x: smoothRef.current.x, y: smoothRef.current.y, size },
        ]);
        setTimeout(() => {
          setEchoes((prev) => prev.filter((e) => e.id !== id));
        }, 800);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [velocityRef, smoothRef, baseRadius]);

  // Text inversion
  const nameElRef = useRef<HTMLDivElement>(null);
  const navElRef = useRef<HTMLAnchorElement>(null);
  const socialElRef = useRef<HTMLDivElement>(null);
  const labelElRef = useRef<HTMLSpanElement>(null);
  const [nameInverted, setNameInverted] = useState(false);
  const [navInverted, setNavInverted] = useState(false);
  const [socialInverted, setSocialInverted] = useState(false);
  const [labelInverted, setLabelInverted] = useState(false);

  const checkOverlap = useCallback((el: HTMLElement | null, cx: number, cy: number, r: number) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const closestX = Math.max(rect.left, Math.min(cx, rect.right));
    const closestY = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dist = Math.sqrt((cx - closestX) ** 2 + (cy - closestY) ** 2);
    return dist < r;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const { x, y, radius } = cursor;
      setNameInverted(checkOverlap(nameElRef.current, x, y, radius));
      setNavInverted(checkOverlap(navElRef.current, x, y, radius));
      setSocialInverted(checkOverlap(socialElRef.current, x, y, radius));
      setLabelInverted(checkOverlap(labelElRef.current, x, y, radius));
    }, 50);
    return () => clearInterval(interval);
  }, [cursor, checkOverlap]);

  const textColor = (inverted: boolean) =>
    inverted ? "hsl(0,0%,100%)" : "hsl(var(--foreground))";

  const textParallax = (factor: number) => ({
    transform: `translate(${parallax.x * -factor * 0.15}px, ${parallax.y * -factor * 0.15}px)`,
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background cursor-none select-none">
      {/* Grid */}
      <SpotlightGrid mouseRef={smoothRef} />

      {/* Base image (cyborg) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <img src={portraitMain} alt="Hassan Salman" className="w-full h-full object-cover" />
      </div>

      {/* Reveal image (natural) via clip-path */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          clipPath: `circle(${cursor.radius}px at ${cursor.x}px ${cursor.y}px)`,
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <img src={portraitAlt} alt="Hassan Salman" className="w-full h-full object-cover" />
      </div>

      {/* Echo rings */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {echoes.map((echo) => (
          <div
            key={echo.id}
            className="absolute rounded-full border-2 border-white/30 pointer-events-none animate-echo"
            style={{
              width: echo.size,
              height: echo.size,
              left: echo.x - echo.size / 2,
              top: echo.y - echo.size / 2,
            }}
          />
        ))}
      </div>

      {/* Custom cursor */}
      <div
        className="fixed z-[10] pointer-events-none rounded-full border-2 border-white/60"
        style={{
          width: cursor.radius * 2,
          height: cursor.radius * 2,
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s",
          boxShadow: "0 0 30px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Name - top left */}
      <div
        ref={nameElRef}
        className="absolute top-12 left-12 z-[6] font-display leading-none"
        style={{
          color: textColor(nameInverted),
          transition: "color 300ms ease, opacity 800ms ease, transform 800ms ease",
          opacity: entered ? 1 : 0,
          ...textParallax(1.5),
        }}
      >
        <span className="block text-[clamp(28px,4vw,56px)] font-semibold tracking-tight leading-[1.1]">
          𝓗𝓪𝓼𝓼𝓪𝓷
        </span>
        <span className="block text-[clamp(28px,4vw,56px)] font-semibold tracking-tight leading-[1.1]">
          𝓼𝓪𝓵𝓶𝓪𝓷
        </span>
      </div>

      {/* Nav - top right */}
      <a
        ref={navElRef}
        href="#"
        className="absolute top-14 right-12 z-[6] font-display text-[clamp(14px,1.5vw,18px)] tracking-[0.15em] uppercase relative group"
        style={{
          color: textColor(navInverted),
          transition: "color 300ms ease, opacity 800ms ease 200ms, transform 800ms ease 200ms",
          opacity: entered ? 1 : 0,
          ...textParallax(1.2),
        }}
      >
        F1 Records
        <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
      </a>

      {/* Social icons - bottom right */}
      <div
        ref={socialElRef}
        className="absolute bottom-12 right-12 z-[6] flex gap-6 items-center"
        style={{
          transition: "opacity 800ms ease 400ms, transform 800ms ease 400ms",
          opacity: entered ? 1 : 0,
          ...textParallax(1.2),
        }}
      >
        <a
          href="https://instagram.com/hassansalman"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex items-center justify-center w-11 h-11 transition-transform duration-300 hover:scale-110"
          style={{ color: textColor(socialInverted), transition: "color 300ms ease" }}
        >
          <svg width="26" height="26" viewBox="0 0 448 512" fill="currentColor">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        </a>
        <a
          href="https://x.com/hassansalman"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X / Twitter"
          className="flex items-center justify-center w-11 h-11 transition-transform duration-300 hover:scale-110"
          style={{ color: textColor(socialInverted), transition: "color 300ms ease" }}
        >
          <svg width="26" height="26" viewBox="0 0 512 512" fill="currentColor">
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
          </svg>
        </a>
      </div>

      {/* Bottom left label */}
      <div
        className="absolute bottom-12 left-12 z-[6] pointer-events-none"
        style={{
          transition: "opacity 800ms ease 600ms, transform 800ms ease 600ms",
          opacity: entered ? 1 : 0,
          ...textParallax(1),
        }}
      >
        <span
          ref={labelElRef}
          className="font-display text-xs tracking-[0.2em] uppercase"
          style={{
            color: labelInverted ? "rgba(255,255,255,0.7)" : "hsl(var(--muted-foreground))",
            transition: "color 300ms ease",
          }}
        >
          Portfolio © 2026
        </span>
      </div>
    </div>
  );
};

export default SpotlightHero;
