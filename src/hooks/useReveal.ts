import { useEffect } from 'react';

/**
 * Adds the `vis` class to `.rv` elements when they enter the viewport.
 * Replaces the vanilla IntersectionObserver from the original project.
 */
export function useReveal(): void {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('vis');
        });
      },
      { threshold: 0.1 },
    );

    const els = document.querySelectorAll('.rv');
    els.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, []);
}
