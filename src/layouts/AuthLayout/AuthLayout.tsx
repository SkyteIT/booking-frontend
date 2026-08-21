import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import "./auth.css";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/useAuth";

type AuthLayoutProps = {
  children?: ReactNode;
};

// Slow crossfade slideshow filling the whole page behind the glass card.
// The local image is guaranteed to exist and is always shown first; the
// external ones only join the rotation once they've actually finished
// loading, so a slow/blocked network never leaves a blank flat gradient.
const LOCAL_SLIDE = "/images/auth-bg.jpg";
const REMOTE_SLIDES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80",
];
const SLIDE_DURATION_MS = 7000;

function AuthLayout({ children }: AuthLayoutProps) {
  const { loading } = useAuth();
  const [slides, setSlides] = useState<string[]>([LOCAL_SLIDE]);
  const [activeSlide, setActiveSlide] = useState(0);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    REMOTE_SLIDES.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setSlides((prev) => (prev.includes(src) ? prev : [...prev, src]));
      };
      img.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  // Gentle mouse-tilt on the glass card - capped to a small angle so it
  // reads as "alive", not gimmicky.
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = cardWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relY * -6, y: relX * 6 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="auth-container auth-fullbleed">
      {/* Refraction/displacement filter powering the liquid-glass card -
          purely decorative, contributes no visible markup of its own. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="glass-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {slides.map((src, index) => (
        <div
          key={src}
          className={`auth-left-slide${index === activeSlide ? " active" : ""}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      <div className="auth-blob auth-blob-a" />
      <div className="auth-blob auth-blob-b" />

      <div className="auth-topleft-brand">
        <div className="auth-hero-mark">
          <span className="auth-hero-ring auth-hero-ring-outer" />
          <span className="auth-hero-ring auth-hero-ring-orbit">
            <span className="auth-hero-satellite" />
          </span>
          <span className="auth-hero-core" />
        </div>
        <span className="auth-hero-wordmark">
          UBE<span className="auth-hero-dot" />
        </span>
      </div>

      <div className="auth-center">
        <div
          className="auth-card-tilt-wrap"
          ref={cardWrapRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform:
              tilt.x === 0 && tilt.y === 0
                ? "none"
                : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {children}
        </div>

        <div className="auth-slide-dots">
          {slides.map((src, index) => (
            <span key={src} className={index === activeSlide ? "active" : ""} />
          ))}
        </div>

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}

export default AuthLayout;
