import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'motion/react';

type Tile =
  | { kind: 'project'; label: string; sub: string; href: string; thumb: string; group: 'edge' | 'corner' }
  | { kind: 'soon'; label: string; sub: string; group: 'edge' | 'corner' }
  | { kind: 'cta'; label: string; sub: string; href: string; group: 'edge' | 'corner' };

// 8 surrounding tiles, in grid order (the center cell is inserted between #4 and #5).
const TILES: Tile[] = [
  { kind: 'project', label: 'Maestroni Concept', sub: 'Site vitrine · React', href: 'https://www.maestroni-concept.fr/', thumb: '/images/maestroni.jpg', group: 'corner' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'edge' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'corner' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'edge' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'edge' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'corner' },
  { kind: 'soon', label: 'Project', sub: 'Incoming', group: 'edge' },
  { kind: 'cta', label: "Let's talk", sub: '→', href: '#contact', group: 'corner' },
];

interface HeroRevealProps {
  ready: boolean;
}

export default function HeroReveal({ ready }: HeroRevealProps) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerCellRef = useRef<HTMLDivElement>(null);
  const [vidOn, setVidOn] = useState(false);
  const [dims, setDims] = useState(() => ({
    vw: window.innerWidth,
    vh: window.innerHeight,
    cellW: window.innerWidth / 3,
    cellH: window.innerHeight / 3,
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
  }));

  const reduced = useReducedMotion();
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [intro, setIntro] = useState(false);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // Center video: animate width/height from full-screen down to its grid cell.
  // Resizing the box + object-fit:cover keeps the video full-bleed instead of
  // magnifying its pixels (which a transform scale would do).
  // Everything resolves by ~70% of the scroll, leaving 0.7→1 as a "hold" where
  // the assembled grid stays pinned before the scene scrolls on.
  const centerW = useTransform(scrollYProgress, [0, 0.7], [dims.vw, dims.cellW]);
  const centerH = useTransform(scrollYProgress, [0, 0.7], [dims.vh, dims.cellH]);
  // ...and move its center from the viewport center onto the measured cell center
  // (so it lands on the grid even though a title sits above the grid).
  const centerX = useTransform(scrollYProgress, [0, 0.7], [dims.vw / 2, dims.cx]);
  const centerY = useTransform(scrollYProgress, [0, 0.7], [dims.vh / 2, dims.cy]);
  // Section title appears together with the grid.
  const sectionOpacity = useTransform(scrollYProgress, [0.45, 0.68], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0.45, 0.68], [18, 0]);
  // Surrounding tiles assemble in: held hidden, then scale + fade in (staggered by group).
  const edgeScale = useTransform(scrollYProgress, [0, 0.28, 0.62], [0, 0, 1]);
  const edgeOpacity = useTransform(scrollYProgress, [0, 0.4, 0.62], [0, 0, 1]);
  const cornerScale = useTransform(scrollYProgress, [0, 0.38, 0.7], [0, 0, 1]);
  const cornerOpacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [0, 0, 1]);

  // Latch the title/HUD fade with hysteresis so scroll jitter can't flicker it
  // back in: hide once 22% into the zoom-out, only show again near the very top.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setOverlayHidden((h) => (h ? v > 0.04 : v > 0.22));
  });

  // Measure viewport + natural center-cell size for the width/height animation.
  useEffect(() => {
    const measure = () => {
      const cell = centerCellRef.current;
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      if (!r.width || !r.height) return;
      setDims({
        vw: window.innerWidth,
        vh: window.innerHeight,
        cellW: r.width,
        cellH: r.height,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Video fade-in once it can play.
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

  // Title intro once the loader is done.
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setIntro(true), 150);
    return () => window.clearTimeout(t);
  }, [ready]);

  const tileStyle = (group: 'edge' | 'corner') =>
    reduced
      ? undefined
      : group === 'edge'
        ? { scale: edgeScale, opacity: edgeOpacity }
        : { scale: cornerScale, opacity: cornerOpacity };

  const renderTile = (t: Tile, key: number) => {
    const inner = (
      <>
        {t.kind === 'project' && (
          <div className="rtile-thumb" style={{ backgroundImage: `url(${t.thumb})` }} aria-hidden="true" />
        )}
        <div className="rtile-body">
          <span className="rtile-label">{t.label}</span>
          {'sub' in t && t.sub && <span className="rtile-sub">{t.sub}</span>}
        </div>
      </>
    );

    const className = `rtile rtile-${t.kind}`;
    const motionStyle = tileStyle(t.group);

    if (t.kind === 'project' || t.kind === 'cta') {
      const external = t.href.startsWith('http');
      return (
        <div className="rcell" key={key}>
          <motion.a
            className={className}
            style={motionStyle}
            href={t.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={`${t.label}${'sub' in t && t.sub ? ` — ${t.sub}` : ''}`}
          >
            {inner}
          </motion.a>
        </div>
      );
    }
    return (
      <div className="rcell" key={key}>
        <motion.div className={className} style={motionStyle}>
          {inner}
        </motion.div>
      </div>
    );
  };

  const videoEl = (
    <video
      className={`reveal-video${vidOn ? ' on' : ''}`}
      ref={vidRef}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  );

  // Build the 9 cells: 4 tiles, the center slot, then 4 tiles.
  const before = TILES.slice(0, 4);
  const after = TILES.slice(4);

  return (
    <div className="reveal-stage" id="hero" ref={stageRef}>
      <div className="reveal-pin">
        {/* Title / HUD overlay — full-screen at the start, fades as we zoom out */}
        <div className={`reveal-overlay${!reduced && overlayHidden ? ' hidden' : ''}`}>
          <h1 className={`hero-title reveal-title${intro ? ' in' : ''}`}>
            FULLSTACK
            <br />
            <em>Developer</em>
          </h1>
          <p className="reveal-desc">Web apps, front to back — React · TypeScript · Node · Express.</p>
          <span className="reveal-scroll">[ SCROLL ] ZOOM OUT ↓</span>
        </div>

        {/* Section title — appears together with the grid */}
        <motion.h2
          className="reveal-section-title"
          style={reduced ? undefined : { opacity: sectionOpacity, y: sectionY }}
        >
          My <em>projects</em>
        </motion.h2>

        <div className="reveal-grid">
          {before.map((t, i) => renderTile(t, i))}

          {/* Center cell — empty slot the video settles into (reduced-motion: video sits in it) */}
          <div className="rcell rcell-center" ref={centerCellRef}>
            {reduced && videoEl}
          </div>

          {after.map((t, i) => renderTile(t, i + 5))}
        </div>

        {/* Hero video — animated from full-screen down onto the center cell on scroll */}
        {!reduced && (
          <motion.div
            className="reveal-center-vid"
            style={{ left: centerX, top: centerY, width: centerW, height: centerH }}
          >
            {videoEl}
          </motion.div>
        )}
      </div>

      {/* anchor so the WORK nav link lands on the revealed grid */}
      <span id="work" className="reveal-work-anchor" aria-hidden="true" />
    </div>
  );
}
