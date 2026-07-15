import { useEffect, useMemo, useState } from "react";
import type { VendorManagementTab } from "../../../components/Admin/VendorManagement/VendorManagementTabs";
import {getVendorApplications, getVendorApplicationById, reviewVendorApplication } from "../../../services/Admin/vendor";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
};

export function useVendorManagement() {
  const [activeTab, setActiveTab] = useState<VendorManagementTab>("pending");
  const [vendors, setVendors] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOptions, setSortOptions] = useState("SubmittedAtDesc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const selectedStatusLabel =
    activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const getVendorId = (vendor: any) =>
    vendor?.id ?? vendor?.applicationId ?? vendor?.vendorApplicationId ?? "";

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getVendorApplications({
          status: activeTab,
          sortOptions,
          search: search.trim() || undefined,
          pageNumber: page,
          pageSize,
        });

        if (cancelled) return;

        if (Array.isArray(data)) {
          setVendors(data);
          setTotalCount(data.length);
        } else {
          const items = data.items ?? data.data ?? data.results ?? [];
          setVendors(items);
          setTotalCount(data.totalCount ?? data.count ?? items.length ?? 0);
        }
      } catch (error) {
        console.error("Error fetching vendor applications:", error);
        if (!cancelled) {
          setVendors([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [activeTab, sortOptions, search, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, sortOptions, search, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const handleRowClick = async (id: string) => {
    try {
      setLoadingDetails(true);
      const data = await getVendorApplicationById(id);
      setSelectedVendor(data);
    } catch (err) {
      console.error("Failed to fetch vendor details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAction = async (type: "Approved" | "Rejected") => {
    if (!selectedVendor) return;

    if (type === "Rejected") {
      setRejectMode(true);
      return;
    }

    const selectedId = getVendorId(selectedVendor);
    if (!selectedId) return;

    try {
      await reviewVendorApplication(selectedId, "Approved");

      setSnackbar({
        open: true,
        message: "Vendor approved successfully",
        severity: "success",
      });

      setVendors((prev) =>
        prev.map((v) =>
          getVendorId(v) === selectedId ? { ...v, status: "Approved" } : v
        )
      );
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to approve vendor",
        severity: "error",
      });
    } finally {
      setSelectedVendor(null);
    }
  };

  const handleReject = async () => {
    if (!selectedVendor || !rejectionReason.trim()) return;

    const selectedId = getVendorId(selectedVendor);
    if (!selectedId) return;

    try {
      await reviewVendorApplication(selectedId, "Rejected", rejectionReason);

      setSnackbar({
        open: true,
        message: "Vendor rejected successfully",
        severity: "warning",
      });

      setVendors((prev) =>
        prev.map((v) =>
          getVendorId(v) === selectedId ? { ...v, status: "Rejected" } : v
        )
      );
    } catch (err) {
      console.error("Reject failed", err);
      setSnackbar({
        open: true,
        message: "Failed to reject vendor",
        severity: "error",
      });
    } finally {
      setRejectMode(false);
      setRejectionReason("");
      setSelectedVendor(null);
    }
  };

  return {
    activeTab,
    setActiveTab,
    vendors,
    loading,
    search,
    setSearch,
    sortOptions,
    setSortOptions,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    pageCount,
    selectedStatusLabel,
    selectedVendor,
    setSelectedVendor,
    loadingDetails,
    rejectMode,
    rejectionReason,
    setRejectionReason,
    setRejectMode,
    snackbar,
    setSnackbar,
    handleRowClick,
    handleAction,
    handleReject,
  };
}