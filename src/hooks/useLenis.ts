import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Global smooth GPU scroll (Lenis).
 * Replaces useSmoothScroll: Lenis takes over the page scroll and exposes
 * .scrollTo(), which we rewire onto anchor links.
 */
export function useLenis(): void {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Anchor links — intercept and route through lenis.scrollTo, otherwise
    // the native scroll cuts off Lenis's interpolation.
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      try {
        const el = document.querySelector<HTMLElement>(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -20 });
        }
      } catch {
        /* invalid selector, ignore */
      }
    };
    document.addEventListener('click', handler);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handler);
      lenis.destroy();
    };
  }, []);
}
