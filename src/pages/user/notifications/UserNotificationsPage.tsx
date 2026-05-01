// src/pages/user/notifications/UserNotificationsPage.tsx
import { Box, Container } from "@mui/material";
import MainNavbar from "../../../components/navbars/MainNavbar";
import MainFooter from "../../../components/footer/MainFooter";
import DashboardSideBar from "../../../components/sections/userDashboard/DashboardSideBar";
import UserNotifications from "../../../components/sections/userDashboard/UserNotifications";
import "../../../components/sections/userDashboard/userDashboard.css";

function getLoggedInUserId(): string | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.userId ?? null;
  } catch {
    return null;
  }
}

const UserNotificationsPage = () => {
  const userId = getLoggedInUserId();

  return (
    <Box
      className="dashboard-wrapper"
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <MainNavbar />

      <Box component="main" sx={{ flex: 1 }}>
        <Box className="dashboard-layout">
          {/* Sidebar */}
          <Box className="dashboard-sidebar">
            <DashboardSideBar activePage="Notifications" />
          </Box>

          {/* Main content */}
          <Box className="dashboard-main">
            <UserNotifications userId={userId} />
          </Box>
        </Box>
      </Box>

      <MainFooter />
    </Box>
  );
};

export default UserNotificationsPage;
