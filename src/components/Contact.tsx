import { useRef } from 'react';
import Orb from './Orb';
import { useMagnetic } from '../hooks/useMagnetic';

// 👉 TODO Mani : remplace ces URL par tes vrais profils.
const SOCIALS = [
  { label: 'Github', href: 'https://github.com/Mani-Ho' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'X', href: 'https://x.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
];

export default function Contact() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(emailRef, 0.35, 160);

  return (
    <section className="contact" id="contact">
      <div className="contact-orb-wrap">
        <Orb />
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
