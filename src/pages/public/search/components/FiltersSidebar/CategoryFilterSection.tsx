// Category filter section: renders all category options and handles
// single-click add/remove behavior through callbacks from the hook.
import { Button, Stack, Typography } from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import NightlifeOutlinedIcon from "@mui/icons-material/NightlifeOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import type { ReactNode } from "react";
import {
  filterTitleSx,
  getOptionButtonStateSx,
  optionButtonBaseSx,
} from "./styles";

const ICON_SX = { fontSize: "1rem" };

// ── Exact-name map (highest priority) ─────────────────────────────────────────
// Covers the built-in seed categories by their exact names.
const exactIconMap: Record<string, ReactNode> = {
  Hotels: <HotelOutlinedIcon sx={ICON_SX} />,
  Restaurants: <RestaurantOutlinedIcon sx={ICON_SX} />,
  Events: <ConfirmationNumberOutlinedIcon sx={ICON_SX} />,
  Activities: <HikingOutlinedIcon sx={ICON_SX} />,
  "Car Rentals": <DirectionsCarOutlinedIcon sx={ICON_SX} />,
  Apartments: <HomeWorkOutlinedIcon sx={ICON_SX} />,
  Equipment: <HandymanOutlinedIcon sx={ICON_SX} />,
};

// ── Keyword rules (checked in order, first match wins) ───────────────────────
// Each rule maps a list of keywords (matched case-insensitively anywhere in the
// category name) to the icon to show. Add more rows here for new keyword groups.
const keywordRules: { keywords: string[]; icon: ReactNode }[] = [
  // Accommodation
  { keywords: ["hotel", "resort", "inn", "lodge", "hostel", "motel", "villa", "suite"], icon: <HotelOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["apartment", "flat", "condo", "studio", "cabin", "cottage", "chalet"], icon: <HomeWorkOutlinedIcon sx={ICON_SX} /> },

  // Food & Drink
  { keywords: ["restaurant", "dining", "bistro", "brasserie", "grill", "eatery", "diner"], icon: <RestaurantOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["cafe", "coffee", "bakery", "tea", "patisserie"], icon: <LocalCafeOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["bar", "pub", "nightclub", "night", "lounge", "club", "nightlife"], icon: <NightlifeOutlinedIcon sx={ICON_SX} /> },

  // Music & Performing Arts
  { keywords: ["music", "musical", "concert", "band", "orchestra", "jazz", "opera", "choir", "festival"], icon: <MusicNoteOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["theatre", "theater", "show", "comedy", "drama", "play", "performance", "circus", "magic"], icon: <TheaterComedyOutlinedIcon sx={ICON_SX} /> },

  // Transport
  { keywords: ["car", "rental", "vehicle", "automobile", "drive", "chauffeur", "taxi", "limo"], icon: <DirectionsCarOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["bike", "cycle", "bicycle", "scooter", "moto"], icon: <DirectionsBikeOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["flight", "airline", "aviation", "airport", "travel", "tour", "trip"], icon: <FlightOutlinedIcon sx={ICON_SX} /> },

  // Outdoor & Adventure
  { keywords: ["hik", "trek", "climb", "mountain", "adventure", "outdoor", "camping", "safari", "wildlife", "nature"], icon: <HikingOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["beach", "surf", "snorkel", "dive", "swim", "water", "kayak", "rafting", "boat", "sail"], icon: <BeachAccessOutlinedIcon sx={ICON_SX} /> },

  // Sports & Fitness
  { keywords: ["sport", "gym", "fitness", "yoga", "pilates", "martial", "boxing", "tennis", "golf", "football", "soccer", "cricket", "rugby"], icon: <SportsOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["workout", "training", "exercise", "crossfit"], icon: <FitnessCenterOutlinedIcon sx={ICON_SX} /> },

  // Wellness & Beauty
  { keywords: ["spa", "massage", "wellness", "beauty", "salon", "skincare", "health"], icon: <SpaOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["medical", "hospital", "clinic", "dental", "doctor", "therapy", "rehab"], icon: <LocalHospitalOutlinedIcon sx={ICON_SX} /> },

  // Events
  { keywords: ["event", "ticket", "conference", "workshop", "seminar", "convention", "expo", "wedding", "party"], icon: <ConfirmationNumberOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["campaign", "campign", "marketing", "promotion", "advertis"], icon: <CampaignOutlinedIcon sx={ICON_SX} /> },

  // Shopping & Equipment
  { keywords: ["shop", "shopping", "retail", "store", "market", "boutique", "mall"], icon: <ShoppingBagOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["equipment", "gear", "tool", "kit", "hardware", "supply", "rental gear"], icon: <HandymanOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["camera", "photo", "photography", "video"], icon: <CameraAltOutlinedIcon sx={ICON_SX} /> },

  // Education & Business
  { keywords: ["school", "education", "learn", "course", "class", "tutor", "training", "academy"], icon: <SchoolOutlinedIcon sx={ICON_SX} /> },
  { keywords: ["business", "corporate", "office", "service", "consultant", "professional"], icon: <BusinessCenterOutlinedIcon sx={ICON_SX} /> },

  // Pets
  { keywords: ["pet", "dog", "cat", "animal", "vet", "grooming"], icon: <PetsOutlinedIcon sx={ICON_SX} /> },
];

/**
 * Resolves the best icon for any category name.
 * 1. Checks the exact-name map first (covers built-in seed categories).
 * 2. Checks keyword rules in order (case-insensitive substring match).
 * 3. Falls back to a generic category icon so there's always something shown.
 */
function getCategoryIcon(name: string): ReactNode {
  // 1. Exact match
  if (exactIconMap[name]) return exactIconMap[name];

  // 2. Keyword scan
  const lower = name.toLowerCase();
  for (const rule of keywordRules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.icon;
    }
  }

  // 3. Generic fallback — always shows an icon
  return <CategoryOutlinedIcon sx={ICON_SX} />;
}

interface CategoryFilterSectionProps {
  categories: { id: string; name: string }[];
  selectedCategories: string[];
  onClearCategories: () => void;
  onToggleCategory: (category: string) => void;
}

const CategoryFilterSection = ({
  categories,
  selectedCategories,
  onClearCategories,
  onToggleCategory,
}: CategoryFilterSectionProps) => {
  const isAllSelected = selectedCategories.length === 0;

  return (
    <>
      <Typography sx={filterTitleSx}>Category</Typography>
      <Stack spacing={0.6} sx={{ mb: 2.8 }}>
        <Button
          variant="text"
          onClick={onClearCategories}
          sx={{ ...optionButtonBaseSx, ...getOptionButtonStateSx(isAllSelected) }}
          startIcon={<ApartmentOutlinedIcon sx={ICON_SX} />}
        >
          All Categories
        </Button>

        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);

          return (
            <Button
              key={category.id}
              variant="text"
              onClick={() => onToggleCategory(category.name)}
              sx={{ ...optionButtonBaseSx, ...getOptionButtonStateSx(isSelected) }}
              startIcon={getCategoryIcon(category.name)}
            >
              {category.name}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

export default CategoryFilterSection;