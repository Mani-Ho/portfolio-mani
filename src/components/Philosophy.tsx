/**
 * "About / Now" section — honest version, no fake stats or testimonials.
 * Replaces the old Philosophy + Stat counter.
 */
export default function Philosophy() {
  return (
    <section className="philo" id="philosophy">
      <div className="rv">
        <div className="sec-tag">[ 02 / About ]</div>
        <h2 className="sec-h2">
          The way
          <br />
          I <em>work</em>.
        </h2>
      </div>

      <div>
        <p className="rv">
          <strong>One project at a time.</strong> I bill by the week or by the phase, never by the
          hour. You know what you&apos;re paying for, I know what I&apos;m shipping.
        </p>
        <p className="rv d1">
          <strong>Design and code, by the same person.</strong> No Figma thrown over the wall.
          Typography and motion decisions are made in the browser.
        </p>
        <p className="rv d2">
          <strong>Performance by default.</strong> Lighthouse 95+ on every delivery — or you
          don&apos;t pay the final phase. Simple promise, kept on every project.
        </p>

        <div className="philo-bullet rv d3">
          <span>Availability</span>
          <span className="v">Booking Q3 2026 · ~2 days/week</span>
        </div>
        <div className="philo-bullet rv d3">
          <span>Location</span>
          <span className="v">Cannes FR · Remote worldwide</span>
        </div>
        <div className="philo-bullet rv d3">
          <span>Languages</span>
          <span className="v">EN · FR</span>
        </div>
      </div>
    </section>
  );
}
