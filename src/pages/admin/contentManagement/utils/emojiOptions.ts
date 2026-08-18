export type EmojiOption = {
  emoji: string;
  label: string;
  keywords: string[];
};

export const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: "🏨", label: "Hotel", keywords: ["stay", "room", "resort", "accommodation"] },
  { emoji: "🏠", label: "Home", keywords: ["house", "villa", "lodging"] },
  { emoji: "🏢", label: "City", keywords: ["building", "office", "urban"] },
  { emoji: "🏕️", label: "Camping", keywords: ["camp", "outdoor", "nature"] },
  { emoji: "🏖️", label: "Beach", keywords: ["sea", "coast", "sun"] },
  { emoji: "🏜️", label: "Desert", keywords: ["sand", "dunes", "travel"] },
  { emoji: "🏝️", label: "Island", keywords: ["tropical", "vacation", "island"] },
  { emoji: "⛱️", label: "Umbrella", keywords: ["beach", "sunshade", "summer"] },
  { emoji: "🏟️", label: "Stadium", keywords: ["sports", "arena", "event"] },
  { emoji: "🏛️", label: "Museum", keywords: ["historic", "heritage", "culture"] },
  { emoji: "🚗", label: "Car", keywords: ["rental", "drive", "auto"] },
  { emoji: "🚙", label: "SUV", keywords: ["rental", "vehicle", "travel"] },
  { emoji: "🚕", label: "Taxi", keywords: ["cab", "transport", "ride"] },
  { emoji: "🚌", label: "Bus", keywords: ["transport", "shuttle", "tour"] },
  { emoji: "🚎", label: "Trolley", keywords: ["transport", "city", "bus"] },
  { emoji: "🏎️", label: "Race Car", keywords: ["speed", "racing", "auto"] },
  { emoji: "🚐", label: "Van", keywords: ["shuttle", "group", "travel"] },
  { emoji: "🛵", label: "Scooter", keywords: ["ride", "moped", "city"] },
  { emoji: "🚲", label: "Bike", keywords: ["cycle", "ride", "eco"] },
  { emoji: "🛥️", label: "Boat", keywords: ["marine", "cruise", "water"] },
  { emoji: "✈️", label: "Flight", keywords: ["air", "travel", "plane"] },
  { emoji: "🛫", label: "Departure", keywords: ["airport", "flight", "takeoff"] },
  { emoji: "🛬", label: "Arrival", keywords: ["airport", "flight", "landing"] },
  { emoji: "🚀", label: "Launch", keywords: ["rocket", "future", "speed"] },
  { emoji: "🛩️", label: "Plane", keywords: ["airplane", "travel", "flight"] },
  { emoji: "🎫", label: "Ticket", keywords: ["event", "entry", "pass"] },
  { emoji: "🎟️", label: "Admission", keywords: ["ticket", "entry", "show"] },
  { emoji: "🎭", label: "Theater", keywords: ["drama", "arts", "performance"] },
  { emoji: "🎬", label: "Cinema", keywords: ["movie", "film", "show"] },
  { emoji: "🎤", label: "Mic", keywords: ["music", "karaoke", "voice"] },
  { emoji: "🎸", label: "Guitar", keywords: ["music", "concert", "band"] },
  { emoji: "🎷", label: "Saxophone", keywords: ["music", "jazz", "band"] },
  { emoji: "🎨", label: "Art", keywords: ["paint", "creative", "gallery"] },
  { emoji: "🎯", label: "Target", keywords: ["goal", "shooting", "sport"] },
  { emoji: "🎳", label: "Bowling", keywords: ["sports", "game", "fun"] },
  { emoji: "🏓", label: "Ping Pong", keywords: ["table tennis", "sport", "game"] },
  { emoji: "⚽", label: "Football", keywords: ["soccer", "sport", "game"] },
  { emoji: "🏀", label: "Basketball", keywords: ["sport", "game", "court"] },
  { emoji: "🏐", label: "Volleyball", keywords: ["sport", "beach", "game"] },
  { emoji: "🏸", label: "Badminton", keywords: ["sport", "racket", "game"] },
  { emoji: "🍽️", label: "Dining", keywords: ["restaurant", "food", "eat"] },
  { emoji: "🍴", label: "Fork", keywords: ["food", "restaurant", "meal"] },
  { emoji: "🥂", label: "Cheers", keywords: ["drinks", "celebration", "bar"] },
  { emoji: "☕", label: "Coffee", keywords: ["cafe", "drink", "breakfast"] },
  { emoji: "🍔", label: "Burger", keywords: ["fast food", "meal", "restaurant"] },
  { emoji: "🍕", label: "Pizza", keywords: ["food", "delivery", "restaurant"] },
  { emoji: "🌮", label: "Taco", keywords: ["food", "mexican", "restaurant"] },
  { emoji: "🍣", label: "Sushi", keywords: ["food", "japanese", "restaurant"] },
  { emoji: "🍰", label: "Dessert", keywords: ["cake", "sweet", "bake"] },
  { emoji: "🛍️", label: "Shopping", keywords: ["store", "mall", "retail"] },
  { emoji: "🧳", label: "Suitcase", keywords: ["travel", "luggage", "trip"] },
  { emoji: "📸", label: "Photo", keywords: ["camera", "gallery", "snapshot"] },
  { emoji: "📍", label: "Location", keywords: ["map", "pin", "place"] },
  { emoji: "🗺️", label: "Map", keywords: ["travel", "route", "location"] },
  { emoji: "🌴", label: "Palm", keywords: ["tropical", "vacation", "beach"] },
  { emoji: "🌊", label: "Wave", keywords: ["sea", "ocean", "water"] },
  { emoji: "🏔️", label: "Mountain", keywords: ["hike", "nature", "adventure"] },
  { emoji: "🏞️", label: "Park", keywords: ["nature", "scenery", "outdoor"] },
  { emoji: "🎡", label: "Amusement", keywords: ["fair", "fun", "ride"] },
  { emoji: "🪂", label: "Paragliding", keywords: ["adventure", "air", "extreme"] },
  { emoji: "🏥", label: "Medical", keywords: ["health", "hospital", "care"] },
  { emoji: "🌿", label: "Nature", keywords: ["eco", "green", "plant"] },
  { emoji: "🐾", label: "Pets", keywords: ["animal", "paw", "pet"] },
  { emoji: "🎮", label: "Gaming", keywords: ["game", "arcade", "play"] },
];

export function filterEmojiOptions(query: string): EmojiOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return EMOJI_OPTIONS;

  return EMOJI_OPTIONS.filter((option) =>
    [option.emoji, option.label, ...option.keywords].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  );
}
