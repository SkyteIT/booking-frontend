import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, it } from "vitest";
import type { SearchListing } from "../../../../services/searchService";
import ResultsGrid from "./ResultsGrid";

it("keeps Explore cards compact and opens details only after clicking a listing", () => {
  const listing: SearchListing = {
    id: "hotel-1", title: "Beach Hotel", categoryName: "Hotels", location: "Galle",
    price: 100, currency: "LKR", averageRating: 4, isFeatured: false, isActive: true,
    thumbnailUrl: null, hasActiveOffer: false, offerBadgeText: null,
    details: {
      id: "hotel-1", title: "Beach Hotel", vendorProfileId: "vendor", vendorName: "Vendor",
      categoryId: "hotels", categoryName: "Hotels", type: "Hotel", price: 100, currency: "LKR",
      averageRating: 4, totalReviews: 2, isActive: true, images: [], tags: [], hasActiveOffer: false,
      description: "A detailed description for the listing page",
      hotelDetails: {
        propertyType: "Resort", primaryRoomType: "Suite", roomTypes: ["Suite"], amenities: ["Pool"],
        availableRooms: 2, checkInTime: "14:00", checkOutTime: "11:00", pricePerNight: 100,
      },
    },
  };
  render(
    <MemoryRouter initialEntries={["/explore"]}>
      <Routes>
        <Route path="/explore" element={<ResultsGrid listings={[listing]} />} />
        <Route path="/view-product/hotel-1" element={<div>Listing details page</div>} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.queryByText(/All listing details/)).toBeNull();
  expect(screen.queryByText("A detailed description for the listing page")).toBeNull();
  expect(screen.queryByText("Suite")).toBeNull();
  fireEvent.click(screen.getByText("Beach Hotel"));
  expect(screen.getByText("Listing details page")).toBeDefined();
});
