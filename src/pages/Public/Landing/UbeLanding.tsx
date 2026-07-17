import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./orbitLanding.css";
import { useLandingListings } from "./useLandingListings";

const GRADIENTS = [
  "linear-gradient(160deg, #0E5FB0, #4BA3F5)",
  "linear-gradient(160deg, #0F1B2D, #3D5A80)",
  "linear-gradient(160deg, #123B66, #1173D4)",
  "linear-gradient(160deg, #1E3A5F, #6FB3F0)",
  "linear-gradient(160deg, #0B2C4D, #2E86D9)",
  "linear-gradient(160deg, #33465C, #7C93AC)",
];

// Same fixed category photos used on the old landing page's CategoriesSection.
const CATEGORY_IMAGES: Record<string, string> = {
  hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  restaurants: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
  events: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
  event: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600",
  activities: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600",
  activity: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600",
  "car rentals": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  "car rental": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
  apartments: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  apartment: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
};

const imageFor = (name: string) => CATEGORY_IMAGES[name.trim().toLowerCase()];

const cardBackground = (name: string, gradient: string) => {
  const image = imageFor(name);
  return image
    ? `linear-gradient(to top, rgba(15,27,45,0.88) 0%, rgba(15,27,45,0.45) 35%, rgba(15,27,45,0.05) 65%, rgba(15,27,45,0) 100%), url(${image})`
    : gradient;
};

const CHIP_POS = [
  { x: "34%", y: "20%", z: "120px", rot: "-6deg", dur: "5s", delay: "0s" },
  { x: "5%", y: "86%", z: "80px", rot: "5deg", dur: "6s", delay: "0.6s" },
  { x: "20%", y: "62%", z: "40px", rot: "4deg", dur: "5.5s", delay: "1.1s" },
  { x: "48%", y: "60%", z: "90px", rot: "-4deg", dur: "4.8s", delay: "0.3s" },
  { x: "56%", y: "22%", z: "60px", rot: "3deg", dur: "6.2s", delay: "1.5s" },
  { x: "78%", y: "88%", z: "20px", rot: "-5deg", dur: "5.2s", delay: "0.9s" },
];

const STEPS = [
  { num: "01", title: "Search anything", desc: "One bar for hotels, tables, tickets, wheels and stays. Type it like you'd say it." },
  { num: "02", title: "Pick & book", desc: "Real-time availability from verified vendors. Checkout in under a minute." },
  { num: "03", title: "Go enjoy it", desc: "Everything lands in one itinerary. Reviews help the next explorer." },
];

const UbeLanding = () => {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [flowIndex, setFlowIndex] = useState(0);
  const { loading, categoryStats, featuredListings, totalListings } = useLandingListings();

  const categories = categoryStats;
  const heroWords = categories.map((c) => c.name.toLowerCase());
  const nDeck = categories.length;
  const nFlow = Math.max(featuredListings.length, 1);
  const activeHeroIndex = heroIndex % nDeck;

  const dragStartX = useRef<number | null>(null);
  const dragMoved = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const flowWrapRef = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);

  useEffect(() => {
    const el = flowWrapRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 10) return;
      // Trackpad horizontal swipe — stop the browser's native back/forward navigation.
      // (overscroll-behavior-x: none on .orbit-section-flow handles the rest.)
      e.preventDefault();
      if (wheelCooldown.current) return;
      wheelCooldown.current = true;
      if (e.deltaX > 0) setFlowIndex((i) => (i + 1) % nFlow);
      else setFlowIndex((i) => (i - 1 + nFlow) % nFlow);
      setTimeout(() => {
        wheelCooldown.current = false;
      }, 400);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [nFlow]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (dragStartX.current === null) return;
      const delta = e.clientX - dragStartX.current;
      if (Math.abs(delta) > 8) dragMoved.current = true;
      setDragOffset(delta);
    };
    const handleUp = (e: PointerEvent) => {
      if (dragStartX.current === null) return;
      const delta = e.clientX - dragStartX.current;
      dragStartX.current = null;
      setDragOffset(0);
      if (delta < -30) setFlowIndex((i) => (i + 1) % nFlow);
      else if (delta > 30) setFlowIndex((i) => (i - 1 + nFlow) % nFlow);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [nFlow]);

  const onFlowPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    dragMoved.current = false;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % nDeck);
    }, 3200);
    return () => clearInterval(timer);
  }, [nDeck]);


  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".orbit-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = stageRef.current;
      if (!el) return;
      const rx = (e.clientY / window.innerHeight - 0.5) * -6;
      const ry = (e.clientX / window.innerWidth - 0.5) * 8;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const deckCards = useMemo(
    () =>
      categories.map((c, i) => {
        let off = i - activeHeroIndex;
        if (off > nDeck / 2) off -= nDeck;
        if (off < -nDeck / 2) off += nDeck;
        const abs = Math.abs(off);
        return {
          ...c,
          bg: cardBackground(c.name, GRADIENTS[i % GRADIENTS.length]),
          transform:
            abs === 0
              ? "rotate(0deg) scale(1)"
              : `rotate(${off * 5}deg) translateX(${off * 26}px) translateY(${abs * 14}px) scale(${1 - abs * 0.07})`,
          opacity: abs > 2 ? 0 : 1,
          z: 10 - abs,
        };
      }),
    [categories, activeHeroIndex, nDeck]
  );

  const flowSource = useMemo(
    () =>
      featuredListings.map((l) => ({
        cat: l.categoryName,
        name: l.title,
        loc: l.location || "Location TBA",
        rating: l.averageRating > 0 ? l.averageRating.toFixed(1) : "New",
        price: `${l.currency} ${l.price}`,
      })),
    [featuredListings]
  );

  const flowCards = useMemo(
    () =>
      flowSource.map((l, i) => {
        let off = i - flowIndex;
        if (off > nFlow / 2) off -= nFlow;
        if (off < -nFlow / 2) off += nFlow;
        const abs = Math.abs(off);
        return {
          ...l,
          bg: cardBackground(l.cat, GRADIENTS[i % GRADIENTS.length]),
          transform: `translateX(${off * 250}px) translateZ(${-abs * 190}px) rotateY(${-off * 24}deg)`,
          opacity: abs > 2 ? 0 : 1 - abs * 0.18,
          z: 10 - abs,
        };
      }),
    [flowSource, flowIndex, nFlow]
  );

  const chips = categories.map((c, i) => ({
    ...c,
    ...CHIP_POS[i % CHIP_POS.length],
    bg: GRADIENTS[i % GRADIENTS.length],
  }));
  const fanCards = categories.map((c, i) => ({
    ...c,
    num: `0${i + 1}`,
    bg: cardBackground(c.name, GRADIENTS[i % GRADIENTS.length]),
    rot: `${((i - (categories.length - 1) / 2) * 12).toFixed(1)}deg`,
  }));

  const marqueeText = `${categories.map((c) => c.name).join(" ✦ ")} ✦ `.repeat(2);

  const goExplore = () => navigate("/search");

  return (
    <div className="orbit-page">
      {/* hero (real site nav comes from MainLayout/CustomerNavbar) */}
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
                : `${totalListings.toLocaleString()} active listings across ${categories.length} categories — one search.`}
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
                  <span className="orbit-tag-light">{d.count.toLocaleString()} listings</span>
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
                <span className="orbit-chip-count">{ch.count.toLocaleString()} listings</span>
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

      {/* marquee */}
      <div className="orbit-marquee">
        <div className="orbit-marquee-track">
          <span style={{ paddingRight: 12 }}>{marqueeText}</span>
          <span style={{ paddingRight: 12 }}>{marqueeText}</span>
        </div>
      </div>

      {/* category fan */}
      <section className="orbit-section orbit-reveal">
        <div className="orbit-eyebrow">Browse by type</div>
        <h2 className="orbit-h2">Pick a card. Any card.</h2>
        <div className="orbit-fan-wrap">
          {fanCards.map((f) => (
            <div
              key={f.name}
              className="orbit-fan-card"
              onClick={goExplore}
              style={{
                background: f.bg,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `rotate(${f.rot})`,
              }}
            >
              <div className="orbit-fan-top">
                <span className="orbit-fan-num">{f.num}</span>
                <span className="orbit-fan-count">{f.count.toLocaleString()}</span>
              </div>
              <div>
                <div className="orbit-fan-name">{f.name}</div>
                <div className="orbit-fan-tag">{f.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* featured coverflow */}
      <section className="orbit-section-flow orbit-reveal">
        <div className="orbit-eyebrow">Hand picked</div>
        <h2 className="orbit-h2">Spin the shelf.</h2>
        {flowSource.length === 0 ? (
          <div style={{ padding: "64px 0", color: "rgba(15,27,45,0.5)", fontSize: 15 }}>
            {loading ? "Loading featured listings…" : "No listings yet — check back soon."}
          </div>
        ) : (
          <div
            ref={flowWrapRef}
            className="orbit-flow-wrap"
            onPointerDown={onFlowPointerDown}
            style={{
              transform: `translateX(${dragOffset}px)`,
              transition: dragOffset === 0 ? "transform 0.3s ease" : "none",
            }}
          >
            {flowCards.map((fc, i) => (
              <div
                key={`${fc.name}-${i}`}
                className="orbit-flow-card"
                onClick={() => !dragMoved.current && setFlowIndex(i)}
                style={{ transform: fc.transform, opacity: fc.opacity, zIndex: fc.z }}
              >
                <div
                  className="orbit-flow-img"
                  style={{ background: fc.bg, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <span className="orbit-tag-dark">{fc.cat}</span>
                  <span className="orbit-tag-light">★ {fc.rating}</span>
                </div>
                <div className="orbit-flow-body">
                  <div className="orbit-flow-name">{fc.name}</div>
                  <div className="orbit-flow-loc">{fc.loc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                    <span style={{ color: "#1173D4", fontWeight: 600, fontSize: 17 }}>{fc.price}</span>
                    <span
                      className="orbit-flow-book"
                      onClick={(e) => {
                        e.stopPropagation();
                        goExplore();
                      }}
                    >
                      Book now
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* boarding pass steps */}
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

      {/* CTA */}
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
          <button className="orbit-cta-btn-large" onClick={() => navigate("/register")}>
            Start exploring →
          </button>
        </div>
      </section>
    </div>
  );
};

export default UbeLanding;
