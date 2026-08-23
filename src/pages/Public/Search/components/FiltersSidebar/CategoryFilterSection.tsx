// Category filter section: renders all category options and handles
// single-click add/remove behavior through callbacks from the hook.
import { Button, Stack, Typography } from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import type { ReactNode } from "react";
import {
  filterTitleSx,
  getOptionButtonStateSx,
  optionButtonBaseSx,
} from "./styles";

const getCategoryIcon = (name: string): ReactNode => {
  const clean = name.trim().toLowerCase();
  if (clean.includes("hotel")) return <ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />;
  if (clean.includes("restaurant")) return <RestaurantOutlinedIcon sx={{ fontSize: "1rem" }} />;
  if (clean.includes("event")) return <ConfirmationNumberOutlinedIcon sx={{ fontSize: "1rem" }} />;
  if (clean.includes("activity") || clean.includes("activities")) return <HikingOutlinedIcon sx={{ fontSize: "1rem" }} />;
  if (clean.includes("car")) return <DirectionsCarOutlinedIcon sx={{ fontSize: "1rem" }} />;
  return <ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />;
};

interface CategoryFilterSectionProps {
  categories: { id: string; name: string }[];
  selectedCategories: string[];
  onClearCategories: () => void;
  onToggleCategory: (categoryName: string) => void;
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
          sx={{
            ...optionButtonBaseSx,
            ...getOptionButtonStateSx(isAllSelected),
          }}
          startIcon={<ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />}
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
              sx={{
                ...optionButtonBaseSx,
                ...getOptionButtonStateSx(isSelected),
              }}
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
