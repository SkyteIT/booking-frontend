
import { IconButton, Badge, alpha} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";

export default function CartButton({ count = 0 }: { count?: number }) {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate("/cart")}
      sx={{
        borderRadius: 999,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        color: "primary.main",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
      }}
    >
      <Badge badgeContent={count} color="error">
        <ShoppingCartIcon/>
      </Badge>
    </IconButton>
  );
}