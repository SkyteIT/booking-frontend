// src/pages/admin/contentManagement/components/CategoryCard.tsx
import {
  Card,
  CardContent,
  Typography,
  Switch,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Correct relative import
import type { Category } from "../types/contentType";

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" gap={2} alignItems="center">
            <img src={category.icon} width={40} />
            <Box>
              <Typography fontWeight={600}>{category.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {category.listings} listings
              </Typography>
            </Box>
          </Box>

          <Box>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography color={category.status ? "green" : "gray"}>
            {category.status ? "Active" : "Inactive"}
          </Typography>
          <Switch checked={category.status} />
        </Box>
      </CardContent>
    </Card>
  );
}