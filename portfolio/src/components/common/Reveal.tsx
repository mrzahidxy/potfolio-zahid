"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  y?: number;
  once?: boolean;
  threshold?: number;
}

const Reveal = ({
  children,
  className,
  delayMs = 0,
  durationMs = 620,
  y = 18,
  once = true,
  threshold = 0.18,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);

    updateMotionPreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMotionPreference);
      return () => mediaQuery.removeEventListener("change", updateMotionPreference);
    }

    mediaQuery.addListener(updateMotionPreference);
    return () => mediaQuery.removeListener(updateMotionPreference);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    if (reduceMotion) {
      setIsVisible(true);
      setIsReady(true);
      return;
    }

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const initiallyInView = rect.top <= viewportHeight * 0.88 && rect.bottom >= 0;

    setIsVisible(initiallyInView);
    setIsReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, reduceMotion, threshold]);

  const style: CSSProperties | undefined =
    isReady && !reduceMotion
      ? {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate3d(0, 0, 0)" : `translate3d(0, ${y}px, 0)`,
          transitionProperty: "opacity, transform",
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: isVisible ? `${delayMs}ms` : "0ms",
          willChange: "opacity, transform",
        }
      : undefined;

  return (
    <div ref={ref} className={className} style={style} data-reveal>
      {children}
    </div>
  );
};

export default Reveal;
