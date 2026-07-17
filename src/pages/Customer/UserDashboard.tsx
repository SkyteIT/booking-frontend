import { Box } from "@mui/material";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/CustomerNavbar";
import DashboardSideBar from "../../components/sections/userDashboard/DashboardSideBar";
import StatsCards from "../../components/sections/userDashboard/StatsCards";
import UpcomingBookings from "../../components/sections/userDashboard/UpcomingBookings";
import VendorBanner from "../../components/sections/userDashboard/VendorBanner";
import WelcomeCard from "../../components/sections/userDashboard/WelcomeCard";

import "../../components/sections/userDashboard/userDashboard.css";

const UserDashboard = () => {
  return (
    <Box className="dashboard-wrapper">

      <MainNavbar />

      <Box className="dashboard-layout">

        <Box className="dashboard-sidebar">
          <DashboardSideBar />
        </Box>

        <Box className="dashboard-main">

          <WelcomeCard />

          <VendorBanner />

          <StatsCards />

          <UpcomingBookings />

        </Box>

      </Box>

      <MainFooter />

    </Box>
  );
};

export default UserDashboard;