export function Hero() {
  return <section id="hero-section" className="hero">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="kicker">Christmas Concert · Bamenda</p>
        <h1>Sing Unto God <em>for Christ is Born</em></h1>
        <p className="hero-date"><time dateTime="2026-12-27T13:00:00+01:00">Sunday, 27 December 2026 · 1:00 PM WAT</time></p>
        <p>Christ the King Parish, Mankon, Nacho, Bamenda</p>
        <a className="action gold" href="#rsvp-portal">Reserve my free seat</a>
      </div>
      <figure><img src="/assets/st_cletus_choir_group.jpeg" alt="St. Cletus Choir gathered outside the parish in blue and black" fetchPriority="high" /></figure>
    </div>
  </section>;
}
