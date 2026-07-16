// Top toolbar: contains search text input and current result count.
// It is presentational and forwards text changes via callback props.
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface SearchToolbarProps {
  query: string;
  total: number;
  onQueryChange: (value: string) => void;
}

const SearchToolbar = ({ query, total, onQueryChange }: SearchToolbarProps) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "primary.main",
          mb: 0.75,
        }}
      >
        Explore
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mb: 3,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontSize: { xs: "2rem", md: "2.6rem" },
          color: "text.primary",
          display: "flex",
          alignItems: "baseline",
          gap: "2px",
        }}
      >
        All services
        <Box
          component="span"
          sx={{
            width: 10,
            height: 10,
            borderRadius: "3px",
            backgroundColor: "primary.main",
            display: "inline-block",
            ml: 0.5,
          }}
        />
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "999px",
          border: "1px solid",
          borderColor: "divider",
          p: 1,
          mb: 2.5,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search properties, locations..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: "1.1rem" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              backgroundColor: "transparent",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
          }}
        />
        <Button
          variant="contained"
          disableElevation
          sx={{ minWidth: 120, borderRadius: "999px", px: 3, textTransform: "none", fontWeight: 600 }}
        >
          Search
        </Button>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 2.5,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", fontWeight: 500 }}>
          {total} {total === 1 ? "property" : "properties"} found
        </Typography>
      </Box>
    </>
  );
};

export default SearchToolbar;
