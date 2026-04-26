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
import type { ReactNode } from "react";
import {
  filterTitleSx,
  getOptionButtonStateSx,
  optionButtonBaseSx,
} from "./styles";

// Icon map keyed by category name string (no longer tied to ListingCategory type)
const categoryIconMap: Record<string, ReactNode> = {
  Hotels: <ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Restaurants: <RestaurantOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Events: <ConfirmationNumberOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Activities: <HikingOutlinedIcon sx={{ fontSize: "1rem" }} />,
  "Car Rentals": <DirectionsCarOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Apartments: <HomeWorkOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Equipment: <HandymanOutlinedIcon sx={{ fontSize: "1rem" }} />,
};

// ← Updated Props: categories now come from API as {id, name} objects
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
          startIcon={<ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />}
        >
          All Categories
        </Button>

        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name); // ← use .name

          return (
            <Button
              key={category.id}                                           // ← use .id as key
              variant="text"
              onClick={() => onToggleCategory(category.name)}            // ← pass .name
              sx={{ ...optionButtonBaseSx, ...getOptionButtonStateSx(isSelected) }}
              startIcon={categoryIconMap[category.name]}                 // ← look up icon by .name
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