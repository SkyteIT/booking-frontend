import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortOptions: string;
  onSortChange: (value: string) => void;
  selectedStatusLabel: string;
};

export default function VendorManagementToolbar({
  search,
  onSearchChange,
  sortOptions,
  onSortChange,
  selectedStatusLabel,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },

        // 🔥 premium container
        p: 2,
        mt: 2,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
      }}
    >
      {/* 🔍 SEARCH */}
      <TextField
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={`Search ${selectedStatusLabel.toLowerCase()}...`}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "white",
          },
        }}
      />

      {/* 🔽 SORT */}
      <FormControl size="small" fullWidth>
        <InputLabel>Sort</InputLabel>
        <Select
          label="Sort"
          value={sortOptions}
          onChange={(e) => onSortChange(String(e.target.value))}
          sx={{
            borderRadius: 3,
            bgcolor: "white",
          }}
        >
          <MenuItem value="SubmittedAtDesc">Newest first</MenuItem>
          <MenuItem value="SubmittedAtAsc">Oldest first</MenuItem>
          <MenuItem value="BusinessNameAsc">A → Z</MenuItem>
          <MenuItem value="BusinessNameDesc">Z → A</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}