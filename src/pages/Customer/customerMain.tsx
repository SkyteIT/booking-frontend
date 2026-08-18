import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const CustomerMain = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "100px",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default CustomerMain;