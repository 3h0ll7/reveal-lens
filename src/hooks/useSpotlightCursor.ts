import { useCallback, useEffect, useRef, useState } from "react";

const SPOTLIGHT_RADIUS = typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 120;

export function useSpotlightCursor() {
  const mouseRef = useRef({ x: -300, y: -300 });
  const smoothRef = useRef({ x: -300, y: -300 });
  const prevRef = useRef({ x: -300, y: -300 });
  const velocityRef = useRef(0);
  const [cursor, setCursor] = useState({ x: -300, y: -300, radius: SPOTLIGHT_RADIUS });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: t.clientY };
      smoothRef.current = { x: t.clientX, y: t.clientY };
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchstart", onTouchStart);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  const loop = useCallback(() => {
    const ease = 0.12;
    smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * ease;
    smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * ease;

    const dx = mouseRef.current.x - prevRef.current.x;
    const dy = mouseRef.current.y - prevRef.current.y;
    velocityRef.current = Math.sqrt(dx * dx + dy * dy);
    prevRef.current = { ...mouseRef.current };

    const dynamicRadius = SPOTLIGHT_RADIUS + Math.min(velocityRef.current * 0.5, 40);

    const cx = (mouseRef.current.x / window.innerWidth - 0.5) * 2;
    const cy = (mouseRef.current.y / window.innerHeight - 0.5) * 2;

    setCursor({
      x: smoothRef.current.x,
      y: smoothRef.current.y,
      radius: dynamicRadius,
    });
    setParallax({ x: -cx * 10, y: -cy * 10 });

    frameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);

  return {
    cursor,
    parallax,
    smoothRef,
    velocityRef,
    baseRadius: SPOTLIGHT_RADIUS,
  };
}
