import { useEffect } from 'react';

const SECTION_IDS = ['hero', 'work', 'lab', 'contact'];

/**
 * Toggles `scrolled` on <nav> past 80px, and highlights the nav link of the
 * section currently crossing the middle of the viewport (scrollspy).
 */
export function useScrollNav(): void {
  useEffect(() => {
    const nav = document.getElementById('mainNav');

    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 80);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    const setActive = (id: string) => {
      document
        .querySelectorAll<HTMLAnchorElement>('.nav-pill a, .nav-mobile a')
        .forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    };

    // Thin band at mid-viewport (top/bottom margins eat 45% each) — the section
    // intersecting it is the one the user is reading.
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      spy.disconnect();
    };
  }, []);
}
