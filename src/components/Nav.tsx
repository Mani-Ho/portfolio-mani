import { useState } from 'react';

const LINKS = [
  { href: '#hero', label: 'INDEX' },
  { href: '#work', label: 'WORK' },
  { href: '#lab', label: 'LAB' },
  { href: '#contact', label: 'INFO' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="mainNav">
        <a href="#hero" className="nav-logo" onClick={() => setOpen(false)}>
          MANI
        </a>

        <ul className="nav-pill">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-status">
          <span className="live" />
          ONLINE · CANNES
        </div>

        <button
          type="button"
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navMobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Overlay kept OUTSIDE <nav>: nav.scrolled has backdrop-filter, which would
          otherwise trap this position:fixed element inside the nav's box. */}
      <div id="navMobile" className={`nav-mobile${open ? ' open' : ''}`}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-mobile-status">
          <span className="live" />
          ONLINE · CANNES
        </div>
      </div>
    </>
  );
}
