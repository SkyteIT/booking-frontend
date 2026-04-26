// Screen component: wires hook data/actions into presentational components.
// It coordinates layout only and avoids business logic.
import { Box, Container, Grid } from "@mui/material";
import SearchToolbar from "../components/SearchToolbar";
import FiltersSidebar from "../components/FiltersSidebar";
import ResultsGrid from "../components/ResultsGrid";
import { useSearchResults } from "../hooks/useSearchResults";

const SearchResultsScreen = () => {
  const {
    filters,
    listings = [],    // ← guard: fallback to [] if API returns undefined
    loading,
    error,
    categories = [],  // ← guard: fallback to [] if API returns undefined
    ratingOptions,
    setQuery,
    setMinPrice,
    setMaxPrice,
    clearCategories,
    toggleCategory,
    setMinRating,
    clearFilters,
  } = useSearchResults();

  return (
    <Box sx={{ backgroundColor: "#F1F5F9", minHeight: "calc(100vh - 64px)", py: 4 }}>
      <Container maxWidth="xl">
        <SearchToolbar
          query={filters.q}
          total={listings.length}
          onQueryChange={setQuery}
        />

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FiltersSidebar
              categories={categories}
              selectedCategories={filters.categories}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              minRating={filters.minRating}
              ratingOptions={ratingOptions}
              onClearAll={clearFilters}
              onClearCategories={clearCategories}
              onToggleCategory={toggleCategory}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onMinRatingChange={setMinRating}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <ResultsGrid
              listings={listings}
              loading={loading}
              error={error}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchResultsScreen;