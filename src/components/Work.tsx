/**
 * Work — 3-card grid (1 featured + 2 secondary) following variant C.
 * For now: honest empty-state (no fake screenshots) with CTA.
 * Once you have real projects, fill the PROJECTS array below.
 */

interface Project {
  n: string;
  title: string;
  cat: string;
  feature?: boolean;
  href?: string;
  thumb?: string; // image path in /public or external URL
}

// 👉 Fill this array with your real projects as soon as possible.
const PROJECTS: Project[] = [
  // Example:
  // { n: '01', title: 'Periphery', cat: 'WebGL · Editorial', feature: true, thumb: '/images/periphery.jpg', href: 'https://...' },
];

export default function Work() {
  const hasProjects = PROJECTS.length > 0;

  return (
    <section className="section" id="work">
      <div className="sec-head">
        <div>
          <div className="sec-tag rv">[ 01 / Work ]</div>
          <h2 className="sec-h2 rv">
            Selected
            <br />
            <em>experiments.</em>
          </h2>
        </div>
        <div className="sec-meta rv d1">
          {hasProjects ? `${PROJECTS.length} recent · view all →` : 'Catalogue · Q3 2026'}
        </div>
      </div>

      {hasProjects ? (
        <div className="work-grid">
          {PROJECTS.slice(0, 3).map((p, i) => (
            <a
              key={p.n}
              className={`work-card${p.feature ? ' feature' : ''} rv d${i}`}
              href={p.href}
              target={p.href?.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <div className="wc-head">
                <span className="idx">[{p.n}]</span>
                <span className={`status${p.feature ? ' feat' : ''}`}>
                  {p.feature ? '● FEATURED' : 'OPEN ↗'}
                </span>
              </div>
              <div
                className="wc-thumb"
                style={
                  p.thumb
                    ? { backgroundImage: `url(${p.thumb})`, backgroundSize: 'cover' }
                    : undefined
                }
              >
                {!p.thumb && `${p.title} preview`}
              </div>
              <div>
                <div className="wc-title">{p.title}</div>
                <div className="wc-cat">{p.cat}</div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="work-empty rv d2">
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--muted)',
              maxWidth: 540,
              margin: '0 auto',
            }}
          >
            The 2024–2026 catalogue is currently being published.
            <br />
            In the meantime, let&apos;s talk directly about the project you have in mind.
          </p>
          <div className="work-empty-line">
            ◇ ◇ ◇ &nbsp;&nbsp; 3 SLOTS / LAST QUARTER &nbsp;&nbsp; ◇ ◇ ◇
          </div>
          <a className="work-empty-cta" href="#contact">
            Start a conversation
          </a>
        </div>
      )}
    </section>
  );
}
