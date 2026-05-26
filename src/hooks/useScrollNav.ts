import { useEffect } from 'react';

/**
 * Toggles the `scrolled` class on <nav id="mainNav"> when scroll > 80px.
 */
export function useScrollNav(): void {
  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 80);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
