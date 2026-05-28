import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useMagnetic } from '../hooks/useMagnetic';

// Three.js is heavy (~600kB) and only used here — load it on demand.
const Orb = lazy(() => import('./Orb'));

// 👉 TODO Mani : remplace ces URL par tes vrais profils.
const SOCIALS = [
  { label: 'Github', href: 'https://github.com/Mani-Ho' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'X', href: 'https://x.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
];

export default function Contact() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [showOrb, setShowOrb] = useState(false);
  useMagnetic(emailRef, 0.35, 160);

  // Signature "awakening": the orb scales up + fades in as Contact enters view.
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  // Defer loading the Three.js orb until the contact section is approaching.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowOrb(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-orb-wrap">
        <motion.div style={reduced ? undefined : { scale, opacity }}>
          {showOrb && (
            <Suspense fallback={null}>
              <Orb />
            </Suspense>
          )}
        </motion.div>
      </div>
      <div className="contact-vignette" />

      <div className="contact-inner rv">
        <div className="contact-sub">[ 04 / Contact ]</div>
        <h2 className="contact-h">
          Let&apos;s work
          <br />
          <em>together.</em>
        </h2>
        <a ref={emailRef} href="mailto:hello@mani.design" className="contact-email">
          <span className="arrow">→</span>
          hello@mani.design
        </a>
        <div className="contact-links">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${s.label} (opens in a new tab)`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
