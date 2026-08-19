import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/CustomerNavbar";
import DashboardSideBar from "../../components/sections/userDashboard/DashboardSideBar";
import StatsCards from "../../components/sections/userDashboard/StatsCards";
import UpcomingBookings from "../../components/sections/userDashboard/UpcomingBookings";
import VendorBanner from "../../components/sections/userDashboard/VendorBanner";
import WelcomeCard from "../../components/sections/userDashboard/WelcomeCard";
import { useAuth } from "../../context/useAuth";
import { useCustomerBookings } from "../../hooks/useCustomerBookings";
import { getMyReviews } from "../../services/reviewService";

import "../../components/sections/userDashboard/userDashboard.css";

const UPCOMING_STATUSES = new Set(["Pending", "Confirmed"]);

const UserDashboard = () => {
  const { user } = useAuth();

  // A generous page size so the upcoming-bookings filter below has enough
  // to work with without adding a second, more specific backend endpoint.
  const { data: bookings, totalCount, loading: bookingsLoading } = useCustomerBookings({ initialPageSize: 50 });

  const [reviewsCount, setReviewsCount] = useState<number | null>(null);
  // Captured once on mount rather than read inline during render/useMemo,
  // which the rules-of-hooks purity check flags as an impure render.
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    getMyReviews({ pageNumber: 1, pageSize: 1 })
      .then((result) => {
        if (!cancelled) setReviewsCount(result.totalCount ?? 0);
      })
      .catch(() => {
        if (!cancelled) setReviewsCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allUpcomingBookings = useMemo(() => {
    return bookings
      .filter((b) => UPCOMING_STATUSES.has(b.status) && new Date(b.startDateTime).getTime() >= now)
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }, [bookings, now]);

  const upcomingBookingsPreview = allUpcomingBookings.slice(0, 5);

  return (
    <Box className="dashboard-wrapper">
      <MainNavbar />

      <Box className="dashboard-layout">
        <Box className="dashboard-sidebar">
          <DashboardSideBar />
        </Box>

        <Box className="dashboard-main">
          <WelcomeCard firstName={user?.firstName} />

          <VendorBanner />

          <StatsCards
            totalBookings={bookingsLoading ? null : totalCount}
            upcomingCount={bookingsLoading ? null : allUpcomingBookings.length}
            reviewsCount={reviewsCount}
          />

          <UpcomingBookings bookings={upcomingBookingsPreview} loading={bookingsLoading} />
        </Box>
      </Box>

      <MainFooter />
    </Box>
  );
};

export default UserDashboard;
