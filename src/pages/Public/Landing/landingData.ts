export const GRADIENTS = [
  "linear-gradient(160deg, #0E5FB0, #4BA3F5)",
  "linear-gradient(160deg, #0F1B2D, #3D5A80)",
  "linear-gradient(160deg, #123B66, #1173D4)",
  "linear-gradient(160deg, #1E3A5F, #6FB3F0)",
  "linear-gradient(160deg, #0B2C4D, #2E86D9)",
  "linear-gradient(160deg, #33465C, #7C93AC)",
];

const CATEGORY_IMAGE_SETS: { keywords: string[]; images: string[] }[] = [
  {
    keywords: ["hotel", "resort", "stay"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
    ],
  },
  {
    keywords: ["restaurant", "dining", "food"],
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    ],
  },
  {
    keywords: ["event", "ticket"],
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    ],
  },
  {
    keywords: ["activit", "tour", "experience"],
    images: [
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=1200&q=80",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80",
    ],
  },
  {
    keywords: ["car", "rental", "vehicle"],
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    ],
  },
  {
    keywords: ["apartment", "rent"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
  },
  {
    keywords: ["photo"],
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
    ],
  },
];

// seed varies the pick across repeated cards of the same category (deck vs
// coverflow vs fan, and repeated positions within one) - deterministic per
// render (no flicker), not truly random.
const imageFor = (name: string, seed: number) => {
  const lower = name.trim().toLowerCase();
  const set = CATEGORY_IMAGE_SETS.find((s) => s.keywords.some((k) => lower.includes(k)));
  if (!set) return undefined;
  return set.images[Math.abs(seed) % set.images.length];
};

export const cardBackground = (name: string, gradient: string, seed: number) => {
  const image = imageFor(name, seed);
  return image
    ? `linear-gradient(to top, rgba(15,27,45,0.88) 0%, rgba(15,27,45,0.45) 35%, rgba(15,27,45,0.05) 65%, rgba(15,27,45,0) 100%), url(${image})`
    : gradient;
};

export const CHIP_POS = [
  { x: "34%", y: "20%", z: "120px", rot: "-6deg", dur: "5s", delay: "0s" },
  { x: "5%", y: "86%", z: "80px", rot: "5deg", dur: "6s", delay: "0.6s" },
  { x: "20%", y: "62%", z: "40px", rot: "4deg", dur: "5.5s", delay: "1.1s" },
  { x: "48%", y: "60%", z: "90px", rot: "-4deg", dur: "4.8s", delay: "0.3s" },
  { x: "56%", y: "22%", z: "60px", rot: "3deg", dur: "6.2s", delay: "1.5s" },
  { x: "78%", y: "88%", z: "20px", rot: "-5deg", dur: "5.2s", delay: "0.9s" },
];

export const STEPS = [
  { num: "01", title: "Search anything", desc: "One bar for hotels, tables, tickets, wheels and stays. Type it like you'd say it." },
  { num: "02", title: "Pick & book", desc: "Real-time availability from verified vendors. Checkout in under a minute." },
  { num: "03", title: "Go enjoy it", desc: "Everything lands in one itinerary. Reviews help the next explorer." },
];
