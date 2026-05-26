export default function Nav() {
  return (
    <nav id="mainNav">
      <a href="#hero" className="nav-logo">
        MANI
      </a>
      <ul className="nav-pill">
        <li>
          <a href="#work">INDEX</a>
        </li>
        <li>
          <a href="#work">WORK</a>
        </li>
        <li>
          <a href="#process">LAB</a>
        </li>
        <li>
          <a href="#contact">INFO</a>
        </li>
      </ul>
      <div className="nav-status">
        <span className="live" />
        ONLINE · CANNES
      </div>
    </nav>
  );
}
