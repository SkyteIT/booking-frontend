// Screen component: wires hook data/actions into presentational components.
// It coordinates layout only and avoids business logic.
import { Box, Container, Grid, CircularProgress, Alert } from "@mui/material";
import FiltersSidebar from "../components/FiltersSidebar";
import ResultsGrid from "../components/ResultsGrid";
import SearchToolbar from "../components/SearchToolbar";
import { useSearchResults } from "../hooks/useSearchResults";

const SearchResultsScreen = () => {
  const {
    filters,
    filteredListings,
    loading,
    error,
    categories,
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
    <Box sx={{ backgroundColor: "background.default", minHeight: "70vh", py: 4 }}>
      <Container maxWidth="xl">
        <SearchToolbar
          query={filters.q}
          total={filteredListings.length}
          onQueryChange={setQuery}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 2.5 }}>
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

          <Grid size={{ xs: 12, md: 9.5 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress sx={{ color: "#0F5A8A" }} />
              </Box>
            ) : (
              <ResultsGrid listings={filteredListings} />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchResultsScreen;
