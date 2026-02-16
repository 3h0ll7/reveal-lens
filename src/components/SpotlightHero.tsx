import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
  const navElRef = useRef<HTMLButtonElement>(null);
  const socialElRef = useRef<HTMLDivElement>(null);
  const [nameInverted, setNameInverted] = useState(false);
  const [navInverted, setNavInverted] = useState(false);
  const [socialInverted, setSocialInverted] = useState(false);

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
      <button
        ref={navElRef}
        onClick={() => navigate("/projects")}
        className="absolute top-14 right-12 z-[6] font-display text-[clamp(14px,1.5vw,18px)] tracking-[0.15em] uppercase relative group cursor-none bg-transparent border-none"
        style={{
          color: textColor(navInverted),
          transition: "color 300ms ease, opacity 800ms ease 200ms, transform 800ms ease 200ms",
          opacity: entered ? 1 : 0,
          ...textParallax(1.2),
        }}
      >
        Projects
        <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
      </button>

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
        {[
          { label: "Instagram", href: "https://instagram.com/staiiq", d: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z", vb: "0 0 448 512" },
          { label: "X / Twitter", href: "https://twitter.com/3h0ll7", d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z", vb: "0 0 512 512" },
          { label: "GitHub", href: "https://github.com/3h0ll7", d: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.8-14.9-112.8-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z", vb: "0 0 496 512" },
          { label: "YouTube", href: "https://youtube.com/@stai9", d: "M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z", vb: "0 0 576 512" },
          { label: "Facebook", href: "https://www.facebook.com/share/1SXTmx3Zcj/", d: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z", vb: "0 0 320 512" },
          { label: "TikTok", href: "https://linktr.ee/3h0ll", d: "M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z", vb: "0 0 448 512" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex items-center justify-center w-11 h-11 transition-transform duration-300 hover:scale-110"
            style={{ color: textColor(socialInverted), transition: "color 300ms ease" }}
          >
            <svg width="20" height="20" viewBox={s.vb} fill="currentColor"><path d={s.d} /></svg>
          </a>
        ))}
      </div>

    </div>
  );
};

export default SpotlightHero;
