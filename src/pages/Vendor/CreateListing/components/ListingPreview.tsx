import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid
} from "@mui/material";
import type { ListingFormData } from "../../../../utils/types";

interface ListingPreviewProps {
  open: boolean;
  onClose: () => void;
  data: ListingFormData;
}

const ListingPreview = ({ open, onClose, data }: ListingPreviewProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Listing Preview</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {data.title || "Untitled Listing"}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {data.location || "No location specified"}
          </Typography>
          <Chip label={data.category} color="primary" size="small" />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2" paragraph>
              {data.description || "No description provided."}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Base Price
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                LKR {data.price || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
           <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
             Details
           </Typography>
           <Typography variant="body2" color="text.secondary">
             This is a preview of how your {data.category} listing will appear to customers.
           </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close Preview</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListingPreview;