/**
 * Metadata strip that sits under the hero — HUD-style.
 */
export default function MetaStrip() {
  const items: Array<[string, string]> = [
    ['NOW', 'WebGL editorial site for Studio Trame'],
    ['NEXT', 'Available now · Q2 2026 onwards'],
    ['STACK', 'React · TS · Node · Express'],
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
