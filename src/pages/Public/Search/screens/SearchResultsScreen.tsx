// Screen component: wires hook data/actions into presentational components.
// It coordinates layout only and avoids business logic.
import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import FiltersSidebar from "../components/FiltersSidebar";
import ResultsGrid from "../components/ResultsGrid";
import SearchToolbar from "../components/SearchToolbar";
import { useSearchResults } from "../hooks/useSearchResults";

const SearchResultsScreen = () => {
  const {
    filters,
    listings = [],
    filteredListings,
    loading,
    error,
    categories = [],
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
    <Box
      sx={{
        backgroundColor: "background.default",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        pt: { xs: 16, md: 18 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 5, md: 8, lg: 12 } }}>
        <SearchToolbar query={filters.q} total={listings.length} onQueryChange={setQuery} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={5}>
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
                <CircularProgress sx={{ color: "primary.main" }} />
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
