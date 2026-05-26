import { useEffect, useRef } from 'react';

/**
 * Custom cursor — small accent dot + ring that grows on hover targets.
 * Disabled on mobile via CSS.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let dx = 0;
    let dy = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.left = `${dx}px`;
        dotRef.current.style.top = `${dy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onEnter = () => document.body.classList.add('hov');
    const onLeave = () => document.body.classList.remove('hov');

    document.addEventListener('mousemove', onMouse);
    raf = requestAnimationFrame(loop);

    // Use event delegation so we catch elements added late (e.g. reveal-on-scroll)
    const root = document.body;
    const matches = (el: EventTarget | null) =>
      el instanceof Element && el.closest('a,button,.work-card,.lab-card');

    const over = (e: MouseEvent) => {
      if (matches(e.target)) onEnter();
    };
    const out = (e: MouseEvent) => {
      if (matches(e.target)) onLeave();
    };
    root.addEventListener('mouseover', over);
    root.addEventListener('mouseout', out);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouse);
      root.removeEventListener('mouseover', over);
      root.removeEventListener('mouseout', out);
    };
  }, []);

  return (
    <div id="cur">
      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />
    </div>
  );
}
