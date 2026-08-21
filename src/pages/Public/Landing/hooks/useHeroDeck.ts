import { useEffect, useMemo, useState } from "react";
import { GRADIENTS, cardBackground } from "../landingData";
import type { CategoryStat } from "../useLandingListings";

// Drives the hero's cycling word + the rotating card deck beneath it.
export function useHeroDeck(categories: CategoryStat[]) {
  const [heroIndex, setHeroIndex] = useState(0);
  const nDeck = categories.length;
  const activeHeroIndex = nDeck > 0 ? heroIndex % nDeck : 0;
  const heroWords = categories.map((c) => c.name.toLowerCase());

  useEffect(() => {
    if (nDeck === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % nDeck);
    }, 3200);
    return () => clearInterval(timer);
  }, [nDeck]);

  const deckCards = useMemo(
    () =>
      categories.map((c, i) => {
        let off = i - activeHeroIndex;
        if (off > nDeck / 2) off -= nDeck;
        if (off < -nDeck / 2) off += nDeck;
        const abs = Math.abs(off);
        return {
          ...c,
          bg: cardBackground(c.name, GRADIENTS[i % GRADIENTS.length], i),
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

  return { heroIndex, setHeroIndex, activeHeroIndex, heroWords, deckCards };
}
