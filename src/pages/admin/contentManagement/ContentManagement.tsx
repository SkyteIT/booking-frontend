// src/pages/admin/contentManagement/ContentManagement.tsx
import { useState } from "react";
import { Box, Typography, Tabs, Tab, Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import CategoryCard from "./components/CategoryCard";
import BannerTable from "./components/BannerTable";
import PromotionTable from "./components/PromotionTable";
import { useContent } from "./hooks/useContent";

export default function ContentManagement() {
  const [tab, setTab] = useState(0);
  const { categories, banners, promotions } = useContent();
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Content Management</Typography>
          <Typography color="text.secondary">
            Manage categories, banners, and promotional campaigns
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{ height: 45, px: 2, fontSize: 14 }}
          startIcon={<AddIcon />}
          onClick={() => {
            if (tab === 0) navigate("/admin/categories/add");
            if (tab === 1) navigate("/admin/banners/add");
            if (tab === 2) navigate("/admin/promotions/add");
          }}
        >
          Add New
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Categories" />
        <Tab label="Banners" />
        <Tab label="Promotions" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          {categories.map((c) => (
            <Grid size={{ xs: 12, md: 4 }} key={c.id}>
              <CategoryCard category={c} />
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 1 && <BannerTable banners={banners} />}
      {tab === 2 && <PromotionTable promotions={promotions} />}
    </Box>
  );
}
