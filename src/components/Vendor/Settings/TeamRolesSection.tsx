import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const mockMembers = [
  { id: 1, name: "John Smith", email: "john@acmerentals.com", role: "Owner" },
  { id: 2, name: "Sarah Johnson", email: "sarah@acmerentals.com", role: "Manager" },
];

export default function TeamRolesSection() {
  return (
    <Box>
      {/* 🔹 Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">

        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Invite member
        </Button>
      </Stack>

      {/* 🔹 Members list */}
      <Box sx={{ mt: 2, display: "grid", gap: 1.2 }}>
        {mockMembers.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "all 0.2s ease",

              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // 🔥 subtle hover
              },
            }}
          >
            {/* 🔹 Left */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                })}
              >
                <PersonOutlineIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  {m.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {m.email}
                </Typography>
              </Box>
            </Stack>

            {/* 🔹 Right */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="caption" color="text.secondary">
                {m.role}
              </Typography>

              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  minWidth: 0,
                }}
              >
                Edit
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
}