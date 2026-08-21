import { STEPS } from "../landingData";

export default function StepsSection() {
  return (
    <section className="orbit-steps-section orbit-reveal">
      <div style={{ textAlign: "center" }}>
        <div className="orbit-eyebrow">Simple process</div>
        <h2 className="orbit-h2">Your boarding pass to anywhere.</h2>
      </div>
      <div className="orbit-steps-grid">
        {STEPS.map((st) => (
          <div key={st.num} className="orbit-step-card">
            <div className="orbit-step-head">
              <span>UBE Air</span>
              <span className="orbit-step-gate">Gate {st.num}</span>
            </div>
            <div className="orbit-step-body">
              <div className="orbit-step-num">{st.num}</div>
              <div className="orbit-step-title">{st.title}</div>
              <div className="orbit-step-desc">{st.desc}</div>
            </div>
            <div className="orbit-step-foot">
              <span>Seat ∞</span>
              <span>Boarding now</span>
            </div>
            <div className="orbit-step-notch-left" />
            <div className="orbit-step-notch-right" />
          </div>
        ))}
      </div>
    </section>
  );
}
