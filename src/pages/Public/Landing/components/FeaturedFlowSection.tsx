import type { MutableRefObject, PointerEvent as ReactPointerEvent } from "react";

type FlowCard = {
  id: string;
  cat: string;
  name: string;
  loc: string;
  rating: string;
  price: string;
  hasOffer: boolean;
  offerLabel?: string | null;
  bg: string;
  transform: string;
  opacity: number;
  z: number;
};

type FeaturedFlowSectionProps = {
  loading: boolean;
  hasListings: boolean;
  flowWrapRef: MutableRefObject<HTMLDivElement | null>;
  onFlowPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  dragOffset: number;
  flowCards: FlowCard[];
  flowIndex: number;
  setFlowIndex: (index: number) => void;
  dragMoved: MutableRefObject<boolean>;
  onOpenListing: (id: string) => void;
};

export default function FeaturedFlowSection({
  loading,
  hasListings,
  flowWrapRef,
  onFlowPointerDown,
  dragOffset,
  flowCards,
  flowIndex,
  setFlowIndex,
  dragMoved,
  onOpenListing,
}: FeaturedFlowSectionProps) {
  return (
    <section className="orbit-section-flow orbit-reveal">
      <div className="orbit-eyebrow">Hand picked</div>
      <h2 className="orbit-h2">Spin the shelf.</h2>
      {!hasListings ? (
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
              onClick={() => {
                if (dragMoved.current) return;
                if (i === flowIndex) onOpenListing(fc.id);
                else setFlowIndex(i);
              }}
              style={{ transform: fc.transform, opacity: fc.opacity, zIndex: fc.z }}
            >
              <div
                className="orbit-flow-img"
                style={{ background: fc.bg, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <span className="orbit-tag-dark">{fc.cat}</span>
                <span className="orbit-tag-light">★ {fc.rating}</span>
                {fc.hasOffer && (
                  <span className="orbit-tag-offer">{fc.offerLabel || "Special Offer"}</span>
                )}
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
                      onOpenListing(fc.id);
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
  );
}
