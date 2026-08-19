export type EmojiOption = {
  emoji: string;
  label: string;
  keywords: string[];
};

export type EmojiGroup = {
  key: string;
  title: string;
  description: string;
  options: EmojiOption[];
};

const STAYS: EmojiOption[] = [
  { emoji: "🏨", label: "Hotel", keywords: ["stay", "room", "resort", "accommodation"] },
  { emoji: "🏠", label: "Home", keywords: ["house", "villa", "lodging"] },
  { emoji: "🏢", label: "City", keywords: ["building", "office", "urban"] },
  { emoji: "🏕️", label: "Camping", keywords: ["camp", "outdoor", "nature"] },
  { emoji: "🏖️", label: "Beach", keywords: ["sea", "coast", "sun"] },
  { emoji: "🏝️", label: "Island", keywords: ["tropical", "vacation", "island"] },
];

const TRANSPORT: EmojiOption[] = [
  { emoji: "🚗", label: "Car", keywords: ["rental", "drive", "auto"] },
  { emoji: "🚙", label: "SUV", keywords: ["rental", "vehicle", "travel"] },
  { emoji: "🚕", label: "Taxi", keywords: ["cab", "transport", "ride"] },
  { emoji: "🚌", label: "Bus", keywords: ["transport", "shuttle", "tour"] },
  { emoji: "🚐", label: "Van", keywords: ["shuttle", "group", "travel"] },
  { emoji: "✈️", label: "Flight", keywords: ["air", "travel", "plane"] },
  { emoji: "🛥️", label: "Boat", keywords: ["marine", "cruise", "water"] },
  { emoji: "🛵", label: "Scooter", keywords: ["ride", "moped", "city"] },
  { emoji: "🚲", label: "Bike", keywords: ["cycle", "ride", "eco"] },
];

const EXPERIENCES: EmojiOption[] = [
  { emoji: "🎫", label: "Ticket", keywords: ["event", "entry", "pass"] },
  { emoji: "🎭", label: "Theater", keywords: ["drama", "arts", "performance"] },
  { emoji: "🎬", label: "Cinema", keywords: ["movie", "film", "show"] },
  { emoji: "🎤", label: "Mic", keywords: ["music", "karaoke", "voice"] },
  { emoji: "🎨", label: "Art", keywords: ["paint", "creative", "gallery"] },
  { emoji: "🎯", label: "Target", keywords: ["goal", "shooting", "sport"] },
  { emoji: "⚽", label: "Football", keywords: ["soccer", "sport", "game"] },
  { emoji: "🏀", label: "Basketball", keywords: ["sport", "game", "court"] },
  { emoji: "🎮", label: "Gaming", keywords: ["game", "arcade", "play"] },
];

const FOOD: EmojiOption[] = [
  { emoji: "🍽️", label: "Dining", keywords: ["restaurant", "food", "eat"] },
  { emoji: "☕", label: "Coffee", keywords: ["cafe", "drink", "breakfast"] },
  { emoji: "🍔", label: "Burger", keywords: ["fast food", "meal", "restaurant"] },
  { emoji: "🍕", label: "Pizza", keywords: ["food", "delivery", "restaurant"] },
  { emoji: "🍣", label: "Sushi", keywords: ["food", "japanese", "restaurant"] },
  { emoji: "🎂", label: "Dessert", keywords: ["cake", "sweet", "bake"] },
  { emoji: "🥂", label: "Cheers", keywords: ["drinks", "celebration", "bar"] },
];

const TRAVEL: EmojiOption[] = [
  { emoji: "🧳", label: "Suitcase", keywords: ["travel", "luggage", "trip"] },
  { emoji: "📍", label: "Location", keywords: ["map", "pin", "place"] },
  { emoji: "🗺️", label: "Map", keywords: ["travel", "route", "location"] },
  { emoji: "📷", label: "Photo", keywords: ["camera", "gallery", "snapshot"] },
  { emoji: "🌴", label: "Palm", keywords: ["tropical", "vacation", "beach"] },
  { emoji: "🌊", label: "Wave", keywords: ["sea", "ocean", "water"] },
  { emoji: "🏔️", label: "Mountain", keywords: ["hike", "nature", "adventure"] },
  { emoji: "🏞️", label: "Park", keywords: ["nature", "scenery", "outdoor"] },
];

const SERVICES: EmojiOption[] = [
  { emoji: "🛍️", label: "Shopping", keywords: ["store", "mall", "retail"] },
  { emoji: "🏥", label: "Medical", keywords: ["health", "hospital", "care"] },
  { emoji: "🌿", label: "Nature", keywords: ["eco", "green", "plant"] },
  { emoji: "🐾", label: "Pets", keywords: ["animal", "paw", "pet"] },
  { emoji: "🎡", label: "Amusement", keywords: ["fair", "fun", "ride"] },
  { emoji: "🪂", label: "Adventure", keywords: ["adventure", "air", "extreme"] },
];

export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    key: "stays",
    title: "Stays",
    description: "Accommodation and lodging options",
    options: STAYS,
  },
  {
    key: "transport",
    title: "Transport",
    description: "Vehicles and travel movement",
    options: TRANSPORT,
  },
  {
    key: "experiences",
    title: "Experiences",
    description: "Activities, events, and entertainment",
    options: EXPERIENCES,
  },
  {
    key: "food",
    title: "Food & Drink",
    description: "Dining, coffee, and cuisine",
    options: FOOD,
  },
  {
    key: "travel",
    title: "Travel & Places",
    description: "Trips, locations, and scenery",
    options: TRAVEL,
  },
  {
    key: "services",
    title: "Services",
    description: "Shopping, wellness, and lifestyle",
    options: SERVICES,
  },
];

export function filterEmojiOptions(query: string): EmojiOption[] {
  const normalized = query.trim().toLowerCase();
  const allOptions = EMOJI_GROUPS.flatMap((group) => group.options);
  if (!normalized) return allOptions;

  return allOptions.filter((option) =>
    [option.emoji, option.label, ...option.keywords].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  );
}

export function getGroupedEmojiOptions(query: string): EmojiGroup[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return EMOJI_GROUPS;

  return EMOJI_GROUPS
    .map((group) => ({
      ...group,
      options: group.options.filter((option) =>
        [option.emoji, option.label, ...option.keywords].some((value) =>
          value.toLowerCase().includes(normalized)
        )
      ),
    }))
    .filter((group) => group.options.length > 0);
}
