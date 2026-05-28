import { useEffect, useRef, useState } from 'react';

interface HeroProps {
  ready: boolean;
}

/**
 * Splits a word into letter-spans with a staggered animation delay.
 * Combined with the `.sw-letter` CSS rules, this cascades each letter in.
 */
function StaggerWord({
  text,
  italic = false,
  startDelay = 0,
  step = 30,
}: {
  text: string;
  italic?: boolean;
  startDelay?: number;
  step?: number;
}) {
  return (
    <span className={italic ? 'sw sw-italic' : 'sw'}>
      {Array.from(text).map((c, i) => (
        <span
          key={i}
          className="sw-letter"
          style={{ ['--d' as string]: `${startDelay + i * step}ms` }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ ready }: HeroProps) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [vidOn, setVidOn] = useState(false);
  const [revealTitle, setRevealTitle] = useState(false);
  const [revealDesc, setRevealDesc] = useState(false);
  const [revealScroll, setRevealScroll] = useState(false);
  const [clock, setClock] = useState('');

  // Video: fade-in once ready + parallax on scroll
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    const showVid = () => setVidOn(true);
    vid.addEventListener('canplaythrough', showVid);
    vid.addEventListener('loadeddata', showVid);
    if (vid.readyState >= 2) showVid();

    // Parallax — skip entirely when the user asked to reduce motion.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const r = Math.min(window.pageYOffset / window.innerHeight, 1);
      vid.style.transform = `scale(${1 + r * 0.08}) translateY(${r * 30}px)`;
    };
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      vid.removeEventListener('canplaythrough', showVid);
      vid.removeEventListener('loadeddata', showVid);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Sequential reveal after loader
  useEffect(() => {
    if (!ready) return;
    const t1 = window.setTimeout(() => setRevealTitle(true), 200);
    const t2 = window.setTimeout(() => setRevealDesc(true), 900);
    const t3 = window.setTimeout(() => setRevealScroll(true), 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [ready]);

  // Live Cannes clock — always Paris time, regardless of the visitor's timezone
  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Paris',
        timeZoneName: 'short',
      }).formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
      setClock(`${get('hour')}:${get('minute')} ${get('timeZoneName')}`);
    };
    tick();
    const iv = window.setInterval(tick, 30_000);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <section className="hero" id="hero">
      <video
        className={`hero-video${vidOn ? ' on' : ''}`}
        ref={vidRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay" />
      <div className="hero-tint" />
      <div className="hero-scanlines" />

      {/* Viewfinder corners */}
      <div className="vf tl" />
      <div className="vf tr" />
      <div className="vf bl" />
      <div className="vf br" />

      {/* REC indicator */}
      <div className="hero-rec">
        <span className="dot" />
        REC / LIVE REEL
      </div>

      {/* Top-left meta */}
      <div className="hero-top-meta">
        <div>
          [ <span className="k">00</span> / HELLO ]
        </div>
        <div>v.2026.05</div>
        <div>{clock}</div>
      </div>

      {/* Title + scroll */}
      <div className="hero-content">
        <div>
          <h1 className={`hero-title${revealTitle ? ' vis' : ''}`}>
            <StaggerWord text="FULLSTACK" />
            <br />
            <StaggerWord text="Developer" italic startDelay={380} step={32} />
          </h1>
          <p className={`hero-desc${revealDesc ? ' vis' : ''}`}>
            Web apps, front to back. APIs, UIs, and the motion in between.
            <br />
            React · TypeScript · Node · Express.
          </p>
        </div>

        <div className={`hero-scroll${revealScroll ? ' vis' : ''}`}>
          <div>
            [ SCROLL ]
            <br />
            ENTER THE WORK ↓
          </div>
          <div className="hero-scroll-line" />
        </div>
      </div>
    </section>
  );
}
