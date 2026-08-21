import type { CategoryStat } from "../useLandingListings";

type FanCard = CategoryStat & {
  num: string;
  bg: string;
  rot: string;
};

type CategoryFanSectionProps = {
  fanCards: FanCard[];
  goToCategory: (categoryName: string) => void;
};

export default function CategoryFanSection({ fanCards, goToCategory }: CategoryFanSectionProps) {
  return (
    <section className="orbit-section orbit-reveal">
      <div className="orbit-eyebrow">Browse by type</div>
      <h2 className="orbit-h2">Pick a card. Any card.</h2>
      <div className="orbit-fan-wrap">
        {fanCards.map((f) => (
          <div
            key={f.name}
            className="orbit-fan-card"
            onClick={() => goToCategory(f.name)}
            style={{
              background: f.bg,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `rotate(${f.rot})`,
            }}
          >
            <div className="orbit-fan-top">
              <span className="orbit-fan-num">{f.num}</span>
            </div>
            <div>
              <div className="orbit-fan-name">{f.name}</div>
              <div className="orbit-fan-tag">{f.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
