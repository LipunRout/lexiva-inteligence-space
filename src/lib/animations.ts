import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { MotionStyle } from 'framer-motion';

export function useFadeInUp(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [20, 0], [0, 1]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay }
    );
  }, [delay]);

  return { ref, style: { y, opacity } satisfies MotionStyle };
}

export function useStaggerChildren(delay = 0) {
  const container = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!container.current) return;
    const nodeList = container.current.querySelectorAll<HTMLElement>('[data-stagger-item]');
    items.current = Array.from(nodeList);

    gsap.fromTo(
      items.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        delay,
      }
    );
  }, [delay]);

  return { container, items };
}

export function useSpringValue(value: number, damping = 20, stiffness = 100) {
  return useSpring(value, { damping, stiffness });
}

export function animateOnScroll(ref: React.RefObject<HTMLElement>, animation: () => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animation();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => {
    if (ref.current) observer.unobserve(ref.current);
  };
}

export const ease = 'power2.out';
export const duration = 0.6;
