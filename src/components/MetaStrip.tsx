/**
 * Metadata strip that sits under the hero — HUD-style.
 */
export default function MetaStrip() {
  const items: Array<[string, string]> = [
    ['NOW', 'WebGL editorial site for Studio Trame'],
    ['NEXT', 'Booking open from Q3 2026'],
    ['STACK', 'React · TS · Three.js · WGSL'],
    ['BASE', 'Cannes 43.55°N · Remote'],
  ];
  return (
    <div className="meta-strip" aria-label="Status">
      {items.map(([k, v]) => (
        <div key={k}>
          <div className="k">{k}</div>
          <div className="v">{v}</div>
        </div>
      ))}
    </div>
  );
}
