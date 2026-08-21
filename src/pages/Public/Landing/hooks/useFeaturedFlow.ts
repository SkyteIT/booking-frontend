import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { GRADIENTS, cardBackground } from "../landingData";
import type { ListingResponse } from "../../../../services/Vendor/listingService";

// Drives the featured coverflow: wheel/drag-to-spin plus the derived
// per-card transform for the 3D shelf effect.
export function useFeaturedFlow(featuredListings: ListingResponse[]) {
  const [flowIndex, setFlowIndex] = useState(0);
  const nFlow = Math.max(featuredListings.length, 1);

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

  const flowSource = useMemo(
    () =>
      featuredListings.map((l) => ({
        id: l.id,
        cat: l.categoryName,
        name: l.title,
        loc: l.location || "Location TBA",
        rating: l.averageRating > 0 ? l.averageRating.toFixed(1) : "New",
        price: `${l.currency} ${l.price}`,
        hasOffer: l.hasActiveOffer,
        offerLabel: l.offerBadgeText,
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
          bg: cardBackground(l.cat, GRADIENTS[i % GRADIENTS.length], i + 5),
          transform: `translateX(${off * 250}px) translateZ(${-abs * 190}px) rotateY(${-off * 24}deg)`,
          opacity: abs > 2 ? 0 : 1 - abs * 0.18,
          z: 10 - abs,
        };
      }),
    [flowSource, flowIndex, nFlow]
  );

  return {
    flowIndex,
    setFlowIndex,
    flowWrapRef,
    dragOffset,
    dragMoved,
    onFlowPointerDown,
    flowSource,
    flowCards,
  };
}
