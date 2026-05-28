import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

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
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ ready }: HeroProps) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [vidOn, setVidOn] = useState(false);
  const [revealTitle, setRevealTitle] = useState(false);
  const [revealDesc, setRevealDesc] = useState(false);
  const [revealScroll, setRevealScroll] = useState(false);
  const [clock, setClock] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Cinematic zoom — map scroll progress through the tall stage onto the hero's
  // scale + opacity. useScroll reads native scroll (which Lenis drives), so it
  // works without extra wiring. Disabled under reduced-motion, milder on mobile.
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });
  const maxScale = reduced ? 1 : isMobile ? 1.3 : 1.6;
  const scale = useTransform(scrollYProgress, [0, 1], [1, maxScale]);
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Video: fade in once it can play
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    const showVid = () => setVidOn(true);
    vid.addEventListener('canplaythrough', showVid);
    vid.addEventListener('loadeddata', showVid);
    if (vid.readyState >= 2) showVid();

    return () => {
      vid.removeEventListener('canplaythrough', showVid);
      vid.removeEventListener('loadeddata', showVid);
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
    <div className="hero-stage" ref={stageRef}>
      <motion.section className="hero" id="hero" style={reduced ? undefined : { scale, opacity }}>
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
      </motion.section>
    </div>
  );
}
