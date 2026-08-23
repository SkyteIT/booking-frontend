import AddIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  Chip,
  MenuItem,
  Divider,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export type ConfirmationOverride = "" | "Instant" | "Request";

export interface OptionValueRow {
  name: string;
  priceModifier: string;
  // When set, replaces the base rate entirely instead of adjusting it -
  // e.g. a "Family package" that's its own per-person rate, not a delta
  // off the base price. Leave blank to use priceModifier instead.
  priceOverride: string;
  confirmationOverride: ConfirmationOverride;
  requiresSeatSelection: boolean;
}

export interface OptionGroupRow {
  name: string;
  values: OptionValueRow[];
}

type Props = {
  groups: OptionGroupRow[];
  onGroupsChange: (groups: OptionGroupRow[]) => void;
  // Only meaningful when the listing is also using a Seat grid - a
  // "requires seat selection" flag with no seats to pick from is a dead
  // option, so the checkbox only appears when it can actually do something.
  hasSeatUnits: boolean;
};

const emptyValue: OptionValueRow = {
  name: "",
  priceModifier: "",
  priceOverride: "",
  confirmationOverride: "",
  requiresSeatSelection: false,
};

const emptyGroup: OptionGroupRow = {
  name: "",
  values: [{ ...emptyValue }],
};

export default function OptionGroupsSection({ groups, onGroupsChange, hasSeatUnits }: Props) {
  const updateGroup = (index: number, patch: Partial<OptionGroupRow>) => {
    const next = [...groups];
    next[index] = { ...next[index], ...patch };
    onGroupsChange(next);
  };

  const updateValue = (
    groupIndex: number,
    valueIndex: number,
    patch: Partial<OptionValueRow>,
  ) => {
    const next = [...groups];
    const values = [...next[groupIndex].values];
    values[valueIndex] = { ...values[valueIndex], ...patch };
    next[groupIndex] = { ...next[groupIndex], values };
    onGroupsChange(next);
  };

  return (
    <Box sx={{ mt: 5, pt: 4, borderTop: "1px solid #E2E8F0" }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "#0F5A8A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <TuneIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Option groups (optional)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            Add independent dimensions customers combine when booking — e.g.
            "Room Type" (Deluxe, Suite) alongside "Stay Type" (Day Use,
            Overnight), or a "Ticket Tier" with an "Early Bird" value that
            auto-confirms instantly. Each value's price adjustment stacks on
            top of the base price or unit, and any group applies regardless
            of whether you're also using units above.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2.5} sx={{ mt: 3 }}>
        {groups.map((group, gi) => (
          <Box
            key={gi}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#FAFBFC",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: "#fff",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <DragIndicatorIcon sx={{ color: "#CBD5E1", fontSize: 20 }} />
              <TextField
                placeholder="Group name, e.g. Room Type"
                size="small"
                variant="standard"
                value={group.name}
                onChange={(e) => updateGroup(gi, { name: e.target.value })}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": { fontWeight: 600, fontSize: "1rem" },
                }}
              />
              <Chip
                label={`${group.values.filter((v) => v.name.trim()).length} value${group.values.filter((v) => v.name.trim()).length === 1 ? "" : "s"}`}
                size="small"
                sx={{ bgcolor: "#E6F0F7", color: "#0F5A8A", fontWeight: 600 }}
              />
              <IconButton
                size="small"
                onClick={() => onGroupsChange(groups.filter((_, i) => i !== gi))}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack spacing={0} divider={<Divider />} sx={{ px: 2 }}>
              {group.values.map((value, vi) => (
                <Stack key={vi} spacing={1} sx={{ py: 1.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Value"
                      placeholder="e.g. Deluxe"
                      size="small"
                      value={value.name}
                      onChange={(e) =>
                        updateValue(gi, vi, { name: e.target.value })
                      }
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      select
                      label="Confirmation"
                      size="small"
                      value={value.confirmationOverride}
                      onChange={(e) =>
                        updateValue(gi, vi, {
                          confirmationOverride: e.target
                            .value as ConfirmationOverride,
                        })
                      }
                      sx={{ flex: 1, minWidth: 160 }}
                    >
                      <MenuItem value="">Use category default</MenuItem>
                      <MenuItem value="Instant">Instant</MenuItem>
                      <MenuItem value="Request">Request</MenuItem>
                    </TextField>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateGroup(gi, {
                          values: group.values.filter((_, i) => i !== vi),
                        })
                      }
                      disabled={group.values.length === 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Price adjustment"
                      placeholder="0"
                      size="small"
                      type="number"
                      value={value.priceModifier}
                      onChange={(e) =>
                        updateValue(gi, vi, { priceModifier: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">±</InputAdornment>
                        ),
                      }}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Or set a new rate"
                      placeholder="leave blank to adjust instead"
                      size="small"
                      type="number"
                      value={value.priceOverride}
                      onChange={(e) =>
                        updateValue(gi, vi, { priceOverride: e.target.value })
                      }
                      helperText="Replaces the base price/rate entirely, e.g. a package with its own rate"
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                  {hasSeatUnits && (
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={value.requiresSeatSelection}
                          onChange={(e) =>
                            updateValue(gi, vi, {
                              requiresSeatSelection: e.target.checked,
                            })
                          }
                        />
                      }
                      label={
                        <Typography variant="caption" color="text.secondary">
                          Requires picking a specific seat (e.g. VIP assigned
                          seating) — leave off for a plain quantity like
                          General Admission
                        </Typography>
                      }
                    />
                  )}
                </Stack>
              ))}
            </Stack>

            <Box sx={{ px: 2, pb: 1.5, pt: group.values.length ? 0 : 1.5 }}>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() =>
                  updateGroup(gi, {
                    values: [...group.values, { ...emptyValue }],
                  })
                }
                sx={{ textTransform: "none" }}
              >
                Add value
              </Button>
            </Box>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onGroupsChange([...groups, { ...emptyGroup }])}
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
            borderStyle: "dashed",
            borderRadius: 3,
            px: 2.5,
            py: 1,
          }}
        >
          Add option group
        </Button>
      </Stack>
    </Box>
  );
}
