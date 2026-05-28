import { useEffect, type RefObject } from 'react';

/**
 * Magnetic effect — the referenced element smoothly follows the cursor
 * when it enters the `radius` zone.
 *
 * @param ref      ref of the target element
 * @param strength 0..1, how strongly the element is pulled (default 0.35)
 * @param radius   in pixels, activation distance from the center (default 140)
 */
export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T>,
  strength = 0.35,
  radius = 140,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced-motion: keep the button perfectly still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const k = 1 - dist / radius;
        cx = dx * strength * k;
        cy = dy * strength * k;
      } else {
        cx = 0;
        cy = 0;
      }
    };

    const loop = () => {
      tx += (cx - tx) * 0.18;
      ty += (cy - ty) * 0.18;
      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [ref, strength, radius]);
}
