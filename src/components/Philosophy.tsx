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
          <strong>Interactive web experiences.</strong> Micro-sites, landing pages, portfolios
          that don&apos;t look like every other template. Available for projects that deserve
          real attention to detail.
        </p>
        <p className="rv d1">
          <strong>Hands-on, design-aware.</strong> I sketch, code, iterate fast. No Figma handoff:
          typography, motion, interactions — all decided in the browser, where they actually live.
        </p>
        <p className="rv d2">
          <strong>Independent and focused.</strong> Solo practice. You get one person, full
          attention, from kickoff to ship — no relay race, no agency overhead.
        </p>

        <div className="philo-bullet rv d3">
          <span>Availability</span>
          <span className="v">Available now · Open to projects</span>
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
