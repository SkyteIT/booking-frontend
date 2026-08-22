// Screen component: wires hook data/actions into presentational components.
// It coordinates layout only and avoids business logic.
import { Alert, Box, Container, Grid } from "@mui/material";
import FiltersSidebar from "../components/FiltersSidebar";
import ResultsGrid from "../components/ResultsGrid";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import SearchToolbar from "../components/SearchToolbar";
import { useSearchResults } from "../hooks/useSearchResults";
import BannerCarouselSection from "../../../../components/sections/banners/BannerCarouselSection";

const SearchResultsScreen = () => {
  const {
    filters,
    filteredListings,
    loading,
    loadingMore,
    totalCount,
    hasMore,
    loadMore,
    error,
    categories = [],
    ratingOptions,
    setQuery,
    setMinPrice,
    setMaxPrice,
    clearCategories,
    toggleCategory,
    setMinRating,
    toggleHasOffer,
    clearFilters,
  } = useSearchResults();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        backgroundColor: "background.default",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)",
        backgroundRepeat: "no-repeat",
        pt: { xs: 16, md: 18 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ width: "100%", maxWidth: 1600, mx: "auto", px: { xs: 2, md: 4 } }}>
        <BannerCarouselSection
          placement="Explore"
          showHeader={false}
          compact
        />

        <SearchToolbar query={filters.q} total={totalCount} onQueryChange={setQuery} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 96 },
                maxHeight: { md: "calc(100vh - 112px)" },
                overflowY: { md: "auto" },
              }}
            >
              <FiltersSidebar
                categories={categories}
                selectedCategories={filters.categories}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                minRating={filters.minRating}
                ratingOptions={ratingOptions}
                hasOffer={filters.hasOffer}
                onClearAll={clearFilters}
                onClearCategories={clearCategories}
                onToggleCategory={toggleCategory}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onMinRatingChange={setMinRating}
                onToggleHasOffer={toggleHasOffer}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            {loading ? (
              <LoadingSpinner fullScreen={false} py={10} />
            ) : (
              <ResultsGrid
                listings={filteredListings}
                hasMore={hasMore}
                loadingMore={loadingMore}
                onLoadMore={loadMore}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchResultsScreen;
