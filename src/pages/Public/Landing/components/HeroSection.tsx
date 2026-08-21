import type { RefObject } from "react";
import type { CategoryStat } from "../useLandingListings";

type DeckCard = CategoryStat & {
  bg: string;
  transform: string;
  opacity: number;
  z: number;
};

type ChipCard = CategoryStat & {
  x: string;
  y: string;
  z: string;
  rot: string;
  dur: string;
  delay: string;
  bg: string;
};

type HeroSectionProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
  totalListings: number;
  categoryCount: number;
  activeHeroIndex: number;
  heroWords: string[];
  deckCards: DeckCard[];
  categories: CategoryStat[];
  setHeroIndex: (index: number) => void;
  chips: ChipCard[];
  goExplore: () => void;
};

export default function HeroSection({
  stageRef,
  loading,
  totalListings,
  categoryCount,
  activeHeroIndex,
  heroWords,
  deckCards,
  categories,
  setHeroIndex,
  chips,
  goExplore,
}: HeroSectionProps) {
  return (
    <section className="orbit-hero">
      <div className="orbit-floor" />
      <div className="orbit-hero-glow" />
      <div className="orbit-stage" ref={stageRef}>
        <div className="orbit-hero-text">
          <div className="orbit-badge">
            <span className="orbit-badge-dot" />
            One engine · every booking
          </div>
          <h1 className="orbit-h1">
            Book
            <br />
            <span key={activeHeroIndex} className="orbit-cycle-word">
              {heroWords[activeHeroIndex]}
            </span>
            <br />
            instantly.
          </h1>
          <p className="orbit-hero-desc">
            {loading
              ? "Loading live inventory…"
              : `${totalListings.toLocaleString()} active listings across ${categoryCount} categories — one search.`}
          </p>
        </div>

        <div className="orbit-deck">
          {deckCards.map((d, i) => (
            <div
              key={d.name}
              className="orbit-deck-card"
              onClick={() => setHeroIndex(i)}
              style={{
                background: d.bg,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: d.transform,
                opacity: d.opacity,
                zIndex: d.z,
              }}
            >
              <div className="orbit-deck-tags">
                <span className="orbit-tag-dark">{d.name}</span>
              </div>
            </div>
          ))}
          <div className="orbit-deck-dots">
            {categories.map((c, i) => (
              <span
                key={c.name}
                className="orbit-dot"
                onClick={() => setHeroIndex(i)}
                style={{ width: i === activeHeroIndex ? 26 : 8, background: i === activeHeroIndex ? "#1173D4" : "rgba(15,27,45,0.25)" }}
              />
            ))}
          </div>
        </div>

        {chips.map((ch) => (
          <div
            key={ch.name}
            className="orbit-chip"
            style={{
              left: ch.x,
              top: ch.y,
              transform: `translateZ(${ch.z})`,
              ["--r" as string]: ch.rot,
              animationDuration: ch.dur,
              animationDelay: ch.delay,
            }}
          >
            <div className="orbit-chip-inner" style={{ background: ch.bg }}>
              <span className="orbit-chip-name">{ch.name}</span>
            </div>
          </div>
        ))}

        <div className="orbit-search-wrap">
          <div className="orbit-search-pill">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, padding: "8px 0" }}>
              <span className="orbit-search-label">Anything, anywhere</span>
              <input
                className="orbit-search-input"
                placeholder='Try "rooftop dinner in Lisbon"'
                onKeyDown={(e) => e.key === "Enter" && goExplore()}
              />
            </div>
            <button className="orbit-search-btn" onClick={goExplore}>
              Search →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
