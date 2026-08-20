// Curated stand-in photos, keyed by category keyword, for listings that
// don't have a real uploaded image yet (vendors currently add photos via a
// plain "paste comma-separated image URLs" field - see roadmap "Blocked").
// Picking from a varied set keyed by category avoids every such listing
// rendering the exact same stock photo regardless of what it actually is.
const CATEGORY_IMAGE_SETS: { keywords: string[]; images: string[] }[] = [
  {
    keywords: ["hotel", "resort", "stay"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    ],
  },
  {
    keywords: ["restaurant", "dining", "food"],
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    ],
  },
  {
    keywords: ["event", "ticket"],
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    ],
  },
  {
    keywords: ["activit", "tour", "experience"],
    images: [
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    ],
  },
  {
    keywords: ["car", "rental", "vehicle"],
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    ],
  },
  {
    keywords: ["apartment", "rent"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
  },
  {
    keywords: ["photo"],
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],
  },
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";

// seed varies the pick across repeated cards in the same category so a
// grid of e.g. five hotels doesn't all show the same one photo either.
// Deterministic per render (no flicker), not truly random.
export function imageForCategory(categoryName: string | undefined, seed = 0): string {
  const lower = (categoryName ?? "").trim().toLowerCase();
  const set = CATEGORY_IMAGE_SETS.find((s) => s.keywords.some((k) => lower.includes(k)));
  if (!set) return FALLBACK_IMAGE;
  return set.images[Math.abs(seed) % set.images.length];
}

// Small stable string hash, for deriving a seed from an id so the same
// listing always picks the same fallback image across re-renders/re-sorts.
export function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
