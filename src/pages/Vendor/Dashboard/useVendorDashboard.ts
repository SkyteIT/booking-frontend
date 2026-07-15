import { useEffect, useState } from "react";
import type { ActivityItem } from "../../../components/Vendor/Dashboard/types";
import { useVendorBookings } from "../../../hooks/useVendorBookings";
import { getDashboard } from "../../../services/Bookings/booking";
import { getBookingStats } from "../../../services/Vendor/dashboard";
import { buildActivityItems, calculateRevenuemetrics } from "./vendorDashboard";

export function useVendorDashboard() {
  const { data, loading, error } = useVendorBookings({
    initialPageSize: 4,
  });

  const [dashboard, setDashboard] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [bookingStats, setBookingStats] = useState<any>(null);
  const [loadingBookingStats, setLoadingBookingStats] = useState(false);

  const bookings = data || [];

  const { currentRevenue, growth } = calculateRevenuemetrics(bookings);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoadingDashboard(true);
        setDashboardError(null);
        const res = await getDashboard();
        setDashboard(res);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        setDashboardError("Unable to load dashboard activity.");
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    async function loadBookingStats() {
      try {
        setLoadingBookingStats(true);
        const res = await getBookingStats();
        setBookingStats(res);
      } catch (err) {
        console.error("Booking stats fetch failed", err);
        setBookingStats(null);
      } finally {
        setLoadingBookingStats(false);
      }
    }

    loadBookingStats();
  }, []);

  const backendActivitySource =
    dashboard?.recentActivity ?? dashboard?.recentActivities ?? dashboard?.activities;

  const activity: ActivityItem[] = buildActivityItems(backendActivitySource, bookings);

  return {
    bookings,
    loading,
    error,
    dashboard,
    loadingDashboard,
    dashboardError,
    bookingStats,
    loadingBookingStats,
    currentRevenue,
    growth,
    activity,
  };
}
