// Top toolbar: contains search text input and current result count.
// It is presentational and forwards text changes via callback props.
import { useState, useEffect } from "react";
import { Box, Button, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchToolbarProps {
  query: string;
  total: number;
  onQueryChange: (value: string) => void;
}

const SearchToolbar = ({ query, total, onQueryChange }: SearchToolbarProps) => {
  // Local state buffers the input so we only commit to the URL (and trigger
  // the API call) when the user clicks Search or presses Enter — not on
  // every keystroke, which previously caused race-condition API floods.
  const [inputValue, setInputValue] = useState(query);

  // Keep local input in sync if the URL query changes externally
  // (e.g. browser back/forward navigation).
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSubmit = () => {
    onQueryChange(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  // Clear: wipe both the local input AND commit the empty string to the URL
  // so the API re-fetches all listings immediately — no need to press Search.
  const handleClear = () => {
    setInputValue("");
    onQueryChange("");
  };

  return (
    <>
      <Typography
        variant="h2"
        sx={{ mb: 2.5, fontWeight: 700, fontSize: { xs: "1.7rem", md: "2.2rem" } }}
      >
        Explore All Services
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          p: 1,
          mb: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search properties, locations..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8", fontSize: "1rem" }} />
              </InputAdornment>
            ),
            endAdornment: inputValue ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label="Clear search"
                  edge="end"
                  sx={{ color: "#94A3B8", "&:hover": { color: "#64748B" } }}
                >
                  <ClearIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ minWidth: 120, borderRadius: "8px", px: 3 }}
        >
          Search
        </Button>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ color: "#334155", fontSize: "0.9rem", fontWeight: 500 }}>
          {total} properties found
        </Typography>
      </Box>
    </>
  );
};

export default SearchToolbar;