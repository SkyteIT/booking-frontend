// Parent sidebar component: composes all filter sections
// and passes down current filter values + action handlers.
import { Paper } from "@mui/material";
import CategoryFilterSection from "./CategoryFilterSection";
import FiltersHeader from "./FiltersHeader";
import OfferFilterSection from "./OfferFilterSection";
import PriceRangeFilterSection from "./PriceRangeFilterSection";
import RatingFilterSection from "./RatingFilterSection";
import type { FiltersSidebarProps } from "./types";

const FiltersSidebar = ({
  categories,
  selectedCategories,
  minPrice,
  maxPrice,
  minRating,
  ratingOptions,
  hasOffer,
  onClearAll,
  onClearCategories,
  onToggleCategory,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onToggleHasOffer,
}: FiltersSidebarProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: "1px solid",
        borderColor: "divider",
        p: 2.5,
        backgroundColor: "background.paper",
      }}
    >
      <FiltersHeader onClearAll={onClearAll} />

      <CategoryFilterSection
        categories={categories}
        selectedCategories={selectedCategories}
        onClearCategories={onClearCategories}
        onToggleCategory={onToggleCategory}
      />

      <PriceRangeFilterSection
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
      />

      <RatingFilterSection
        minRating={minRating}
        ratingOptions={ratingOptions}
        onMinRatingChange={onMinRatingChange}
      />

      <OfferFilterSection
        hasOffer={hasOffer}
        onToggleHasOffer={onToggleHasOffer}
      />
    </Paper>
  );
};

export default FiltersSidebar;
