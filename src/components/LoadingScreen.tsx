import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200);
    const hideTimer = setTimeout(() => setHidden(true), 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? "hidden" as const : "visible" as const,
        transition: "opacity 0.8s ease, visibility 0.8s ease",
      }}
    >
      <span
        className="font-display text-lg tracking-[0.3em] text-foreground animate-pulse"
      >
        HASSAN SALMAN
      </span>
    </div>
  );
};

export default LoadingScreen;
