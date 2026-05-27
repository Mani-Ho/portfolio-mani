import { useRef } from 'react';
import Orb from './Orb';
import { useMagnetic } from '../hooks/useMagnetic';

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
          <a href="#">Github</a>
          <a href="#">LinkedIn</a>
          <a href="#">X</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </section>
  );
}
