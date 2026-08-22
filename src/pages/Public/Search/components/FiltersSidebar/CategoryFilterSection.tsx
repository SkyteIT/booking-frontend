// Category filter section: renders all category options and handles
// single-click add/remove behavior through callbacks from the hook.
import { Button, Stack, Typography } from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import type { ReactNode } from "react";
import type { ListingCategory } from "../../utils/types";
import {
  filterTitleSx,
  getOptionButtonStateSx,
  optionButtonBaseSx,
} from "./styles";

const categoryIconMap: Record<ListingCategory, ReactNode> = {
  Hotel: <ApartmentOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Restaurant: <RestaurantOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Event: <ConfirmationNumberOutlinedIcon sx={{ fontSize: "1rem" }} />,
  Activity: <HikingOutlinedIcon sx={{ fontSize: "1rem" }} />,
  CarRental: <DirectionsCarOutlinedIcon sx={{ fontSize: "1rem" }} />,
};

interface CategoryFilterSectionProps {
  categories: ListingCategory[];
  selectedCategories: ListingCategory[];
  onClearCategories: () => void;
  onToggleCategory: (category: ListingCategory) => void;
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
          const isSelected = selectedCategories.includes(category);

          return (
            <Button
              key={category}
              variant="text"
              onClick={() => onToggleCategory(category)}
              sx={{
                ...optionButtonBaseSx,
                ...getOptionButtonStateSx(isSelected),
              }}
              startIcon={categoryIconMap[category]}
            >
              {category}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

export default CategoryFilterSection;
