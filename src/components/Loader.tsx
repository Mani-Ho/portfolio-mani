import { useEffect, useRef, useState } from 'react';

interface LoaderProps {
  onFinish: () => void;
}

/**
 * Minimal loader — bar + mono percentage.
 * No more glitch / scramble: less chrome, more calm.
 */
export default function Loader({ onFinish }: LoaderProps) {
  const [pct, setPct] = useState(0);
  const [hide, setHide] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setPct(100);
      window.setTimeout(() => {
        setHide(true);
        window.setTimeout(onFinish, 800);
      }, 300);
    };

    const iv = window.setInterval(() => {
      if (finishedRef.current) {
        window.clearInterval(iv);
        return;
      }
      setPct((prev) => {
        const next = prev + Math.random() * 14 + 8;
        if (next >= 100) {
          window.clearInterval(iv);
          finish();
          return 100;
        }
        return next;
      });
    }, 80);

    const failsafe = window.setTimeout(finish, 1800);

    return () => {
      window.clearInterval(iv);
      window.clearTimeout(failsafe);
    };
  }, [onFinish]);

  return (
    <div id="loader" className={hide ? 'hide' : ''}>
      <div className="ld-meta">MANI · LOADING REEL</div>
      <div className="ld-line">
        <div className="ld-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="ld-pct">{String(Math.floor(pct)).padStart(2, '0')}%</div>
    </div>
  );
}
