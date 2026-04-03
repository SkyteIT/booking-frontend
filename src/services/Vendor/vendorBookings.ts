
import type { VendorBookingDto, PageResult } from "../../components/vendor/bookings/BookingTypes";
import api from "../../services/Vendor/api";


export async function getVendorBookings(params: {
  vendorId: string;
  page: number;
  pageSize: number;
}) {
  const res = await api.get<PageResult<VendorBookingDto>>(
    "/api/vendor/bookings",
    {
      params: {
        VendorId: params.vendorId,
        Page: params.page,
        PageSize: params.pageSize,
      },
    }
  );

  return res.data;
}
