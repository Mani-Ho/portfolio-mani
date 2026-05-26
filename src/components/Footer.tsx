export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer>
      <div className="f-logo">MANI / 2026</div>
      <div className="f-build">
        v.2026.05 · build <span className="f-hash">{__BUILD_HASH__}</span> · {__BUILD_DATE__}
      </div>
      <button type="button" className="f-up" onClick={scrollTop}>
        ↑ TOP
      </button>
    </footer>
  );
}
