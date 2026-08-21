type CtaSectionProps = {
  onStartExploring: () => void;
};

export default function CtaSection({ onStartExploring }: CtaSectionProps) {
  return (
    <section className="orbit-cta-section orbit-reveal">
      <div className="orbit-cta-box">
        <div className="orbit-cta-grid-bg" />
        <div className="orbit-cta-badge">
          <svg viewBox="0 0 200 200" width="200" height="200">
            <defs>
              <path id="orbitCirc" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" />
            </defs>
            <text style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, letterSpacing: "0.32em", fill: "#7CBAF0", textTransform: "uppercase" }}>
              <textPath href="#orbitCirc">UBE · BOOK EVERYTHING · UBE · BOOK</textPath>
            </text>
          </svg>
        </div>
        <h2 className="orbit-cta-title">
          The whole city,
          <br />
          <span className="orbit-cta-highlight">one checkout.</span>
        </h2>
        <button className="orbit-cta-btn-large" onClick={onStartExploring}>
          Start exploring →
        </button>
      </div>
    </section>
  );
}
