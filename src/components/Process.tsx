interface Experiment {
  t: string;
  tag: string;
}

// 👉 Fill this array when you have real experiments to show
// (each one needs an actual screenshot, GIF or link).
const EXPERIMENTS: Experiment[] = [];

/**
 * Lab — shows side experiments that complement client Work.
 * Honest empty-state while the lab is still being built.
 */
export default function Process() {
  const hasExperiments = EXPERIMENTS.length > 0;

  return (
    <section className="section" id="lab">
      <div className="lab-layout">
        <div>
          <div className="sec-tag rv">[ 03 / Lab ]</div>
          <h2 className="sec-h2 rv">
            Things I&apos;m
            <br />
            <em>tinkering</em> with.
          </h2>
          <p
            className="rv d1"
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--muted)',
              marginTop: 24,
              maxWidth: 340,
            }}
          >
            Side experiments. Each one teaches me something I bring back into client work.
          </p>
        </div>

        {hasExperiments ? (
          <div className="lab-grid">
            {EXPERIMENTS.map((x, i) => (
              <div key={x.t} className={`lab-card rv d${i % 4}`}>
                <div className="lab-thumb">{x.t}</div>
                <div className="lab-title">{x.t}</div>
                <div className="lab-tag">{x.tag}</div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rv d2"
            style={{
              border: '1px dashed var(--line2)',
              padding: '48px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 16,
              minHeight: 240,
            }}
          >
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'var(--muted)',
                maxWidth: 360,
                margin: 0,
              }}
            >
              Lab in progress.
              <br />
              First public experiments dropping soon.
            </p>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: 2,
                color: 'var(--muted2)',
                textTransform: 'uppercase',
              }}
            >
              ◇ ◇ ◇ &nbsp;&nbsp; WIP &nbsp;&nbsp; ◇ ◇ ◇
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
