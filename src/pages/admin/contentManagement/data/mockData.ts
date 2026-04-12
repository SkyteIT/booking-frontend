// src/pages/admin/contentManagement/data/mockData.ts
import type { Category, Banner, Promotion } from "../types/contentType";
import { MOCK_LISTINGS } from "../../../public/search/data/mockListings";

function getListingCount(categoryName: string) {
  return MOCK_LISTINGS.filter(
    (item) => item.category === categoryName
  ).length;
}

export const categories: Category[] = [
  { id: 1, name: "Hotels", listings: getListingCount("Hotels"), status: true, icon: "/assets/icons/hotel.png" },
  { id: 2, name: "Car Rentals", listings: getListingCount("Car Rentals"), status: true, icon: "/assets/icons/car.png" },
  { id: 3, name: "Activities", listings: getListingCount("Activities"), status: true, icon: "/assets/icons/activity.png" },
  { id: 4, name: "Restaurants", listings: getListingCount("Restaurants"), status: true, icon: "/assets/icons/restaurant.png" },
  { id: 5, name: "Event Tickets", listings: getListingCount("Events"), status: false, icon: "/assets/icons/event.png" },
];

export const banners: Banner[] = [
  {
    id: 1,
    title: "Summer Sale 2024",
    description: "Get up to 50% off on all bookings",
    placement: "Homepage Hero",
    startDate: "2024-02-20",
    endDate: "2024-03-20",
    status: "Active",
  },
  {
    id: 2,
    title: "New Vendor Spotlight",
    description: "Discover amazing new vendors",
    placement: "Homepage Banner",
    startDate: "2024-02-15",
    endDate: "2024-02-29",
    status: "Active",
  },
  {
    id: 3,
    title: "Weekend Special",
    description: "Book now and save",
    placement: "Category Pages",
    startDate: "2024-02-10",
    endDate: "2024-02-18",
    status: "Inactive",
  },
];

export const promotions: Promotion[] = [
  {
    id: 1,
    code: "SUMMER50",
    type: "Percentage",
    value: 50,
    usageCount: 234,
    usageLimit: 500,
    startDate: "2024-02-20",
    endDate: "2024-03-20",
    status: "Active",
  },
  {
    id: 2,
    code: "WELCOME25",
    type: "Fixed Amount",
    value: 25,
    usageCount: 1234,
    usageLimit: null,
    startDate: "2024-02-20",
    endDate: "2024-03-20",
    status: "Active",
  },
  {
    id: 3,
    code: "WEEKEND15",
    type: "Percentage",
    value: 15,
    usageCount: 89,
    usageLimit: 200,
    startDate: "2024-02-20",
    endDate: "2024-03-20",
    status: "Expired",
  },
];
