// src/pages/Vendor/CreateListing/CreateListing.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import CheckIcon from "@mui/icons-material/Check";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import StepperBar, {
  type StepperStep,
} from "../../../components/navbars/StepperBar";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import {
  createListing,
  updateListing,
  getCategories,
  getEditableListingById,
} from "../../../services/Vendor/listingService";
import type {
  CreateListingRequest,
  CategoryDto,
  ListingResponse,
  ListingType,
} from "../../../services/Vendor/listingService";
import type { ListingFormData, ListingCategory } from "../../../utils/types";
import ActivityFields from "./components/ActivityFields";
import BaseFields from "./components/BaseFields";
import CarRentalFields from "./components/CarRentalFields";
import EventFields from "./components/EventFields";
import HotelFields from "./components/HotelFields";
import ImagesStep from "./components/ImagesStep";
import ReviewStep from "./components/ReviewStep";
import RestaurantFields from "./components/RestaurantFields";
import BookableUnitsSection, {
  type UnitsMode,
  type ListRow,
  type GridConfig,
  type TimeSlotConfig,
} from "./components/BookableUnitsSection";
import {
  defaultListRows,
  defaultGridConfig,
  defaultTimeSlotConfig,
} from "./components/bookableUnitsDefaults";
import { normalizeTimeValue, formatTimeAmPm } from "./components/timeOptions";
import {
  addUnit,
  addUnitsGrid,
  addUnitsTimeSlots,
} from "../../../services/Vendor/listingUnitsService";
import { getLocalizationSettings } from "../../../services/Vendor/settings";
import { getUnits } from "../../../services/Vendor/listingUnitsService";
import OptionGroupsSection, {
  type OptionGroupRow,
} from "./components/OptionGroupsSection";
import {
  getOptionGroups,
  addOptionGroup,
  addOptionValue,
} from "../../../services/Vendor/listingOptionsService";

// ListingType and ListingCategory are the same set of string literals
// (Hotel/Restaurant/Event/CarRental/Activity) — kept as an explicit map
// rather than a cast so the two concepts read as distinct at each call site.
const typeToCategory: Record<ListingType, ListingCategory> = {
  Hotel: "Hotel",
  Restaurant: "Restaurant",
  Event: "Event",
  CarRental: "CarRental",
  Activity: "Activity",
};

const numericTypeToCategory: Record<number, ListingCategory> = {
  0: "Hotel",
  1: "Restaurant",
  2: "Event",
  3: "CarRental",
  4: "Activity",
};

function resolveListingCategory(
  category: CategoryDto,
): ListingCategory | undefined {
  const rawType = (category as { type?: unknown }).type;

  if (typeof rawType === "number") return numericTypeToCategory[rawType];
  if (typeof rawType === "string") {
    const normalizedType = rawType.replace(/[\s&_-]/g, "").toLowerCase();
    const typeMatch = (Object.keys(typeToCategory) as ListingType[]).find(
      (type) => type.toLowerCase() === normalizedType,
    );
    if (typeMatch) return typeToCategory[typeMatch];
  }

  // Category names are the stable labels vendors see. This fallback keeps
  // the correct form visible if an older API omits or numerically serializes
  // Category.Type.
  const name = category.name.toLowerCase();
  if (name.includes("hotel") || name.includes("resort")) return "Hotel";
  if (
    name.includes("restaurant") ||
    name.includes("restaurent") ||
    name.includes("dining")
  ) {
    return "Restaurant";
  }
  if (name.includes("event") || name.includes("ticket")) return "Event";
  if (name.includes("car rental") || name.includes("carrental"))
    return "CarRental";
  if (name.includes("activit") || name.includes("tour")) return "Activity";
  return undefined;
}

const WIZARD_STEPS: StepperStep[] = [
  { label: "Basic Info", icon: InfoIcon },
  { label: "Category Details", icon: CategoryIcon },
  { label: "Bookable Units", icon: EventSeatIcon },
  { label: "Images", icon: ImageIcon },
  { label: "Review", icon: CheckIcon },
];


const BASIC_INFO_FIELDS: (keyof ListingFormData)[] = [
  "title",
  "location",
  "categoryId",
  "price",
  "currency",
];
const CATEGORY_REQUIRED_FIELDS: Record<
  ListingCategory,
  (keyof ListingFormData)[]
> = {
  Hotel: ["roomTypes", "amenities"],
  Restaurant: [
    "cuisineType",
    "seatingCapacity",
    "openingTime",
    "closingTime",
    "averageCost",
  ],
  Activity: ["activityType", "duration"],
  Event: ["organizer", "seatCount", "eventDate", "eventTime"],
  CarRental: ["brand", "model", "seatCountCar"],
};

const notifyDashboardRefresh = () => {
  window.dispatchEvent(new Event("admin-dashboard-refresh"));
};

function getApiErrorMessage(error: unknown): string | undefined {
  if (!isAxiosError(error)) return undefined;

  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (!data || typeof data !== "object") return undefined;

  const problem = data as {
    message?: unknown;
    detail?: unknown;
    title?: unknown;
    errors?: Record<string, unknown>;
  };


  if (problem.errors && typeof problem.errors === "object") {
    const messages = Object.values(problem.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter(
        (value): value is string =>
          typeof value === "string" && Boolean(value.trim()),
      );
    if (messages.length > 0) return messages.join("\n");
  }

  for (const value of [problem.message, problem.detail, problem.title]) {
    if (typeof value === "string" && value.trim()) return value;
  }

  return undefined;
}

function buildEditFormData(listing: ListingResponse): Partial<ListingFormData> {
  const data: Partial<ListingFormData> = {
    title: listing.title,
    description: listing.description ?? "",
    location: listing.location ?? "",
    price: listing.price,
    category: typeToCategory[listing.type] ?? "Hotel",
    categoryId: listing.categoryId,
    isActive: listing.isActive,
    currency: listing.currency ?? "LKR",
    images: [...(listing.images ?? [])],
    tagsInput: (listing.tags ?? []).join(", "),
    cancellationPolicy: listing.cancellationPolicy ?? "",
    pricingUnitOverride: listing.pricingUnitOverride ?? "",
  };

  const {
    hotelDetails,
    restaurantDetails,
    activityDetails,
    eventDetails,
    carRentalDetails,
  } = listing;

  if (hotelDetails) {
    data.pricePerNight = hotelDetails.pricePerNight ?? listing.price;
    data.numberOfRooms = hotelDetails.availableRooms;
    data.amenities = [...(hotelDetails.amenities ?? [])];
    data.checkInTime = normalizeTimeValue(hotelDetails.checkInTime);
    data.checkOutTime = normalizeTimeValue(hotelDetails.checkOutTime);
    data.roomTypes = [...(hotelDetails.roomTypes ?? [])];
    data.propertyType = hotelDetails.propertyType ?? "";
    data.roomType = hotelDetails.primaryRoomType ?? "";
  } else if (restaurantDetails) {
    const [openingTime, closingTime] =
      restaurantDetails.openingHours.split(" - ");
    data.cuisineType = restaurantDetails.cuisineType;
    data.averageCost = restaurantDetails.averageCost;
    data.openingTime = normalizeTimeValue(openingTime) || "06:00";
    data.closingTime = normalizeTimeValue(closingTime) || "23:00";
    data.seatingCapacity = restaurantDetails.tableCapacity;
    data.tableTypes = [...(restaurantDetails.tableTypes ?? [])];
    data.reservationRules = restaurantDetails.reservationRules ?? "";
  } else if (activityDetails) {
    data.activityType = activityDetails.activityType;
    data.duration = `${activityDetails.durationHours} hours`;
    data.difficultyLevel = activityDetails.difficultyLevel;
    data.activityPrice = activityDetails.price ?? listing.price;
    data.minGroupSize = activityDetails.minGroupSize;
    data.maxGroupSize = activityDetails.maxGroupSize;
    data.minAge = activityDetails.minAge;
    data.maxAge = activityDetails.maxAge;
    data.includedServices = [...(activityDetails.includedServices ?? [])];
    data.safetyRequirements = activityDetails.safetyRequirements;
    data.availabilitySchedule = activityDetails.availabilitySchedule;
  } else if (eventDetails) {
    const [eventDate, eventTime] = eventDetails.dateAndTime.split("T");
    data.organizer = eventDetails.organizer;
    data.eventDate = eventDate ?? "";
    data.eventTime = normalizeTimeValue(eventTime);
    data.seatCount = eventDetails.seatCount;
    data.eventType = eventDetails.eventType ?? "";
    data.venueName = eventDetails.venueName ?? "";
    data.venueAddress = eventDetails.venueAddress ?? "";
    data.ticketTypes = (eventDetails.ticketTypes ?? []).map((ticket) => ({
      ...ticket,
    }));
  } else if (carRentalDetails) {
    data.brand = carRentalDetails.brand;
    data.model = carRentalDetails.model;
    data.vehicleType = carRentalDetails.vehicleType ?? "";
    data.transmission = carRentalDetails.transmission;
    data.dailyRate = carRentalDetails.pricePerDay ?? listing.price;
    data.seatCountCar = carRentalDetails.seatCount;
    data.fuelType = carRentalDetails.fuelType;
    data.availabilityStatus = carRentalDetails.availabilityStatus;
    data.year = carRentalDetails.year;
    data.hourlyRate = carRentalDetails.hourlyRate;
    data.pickupLocation = carRentalDetails.pickupLocation ?? "";
    data.returnLocation = carRentalDetails.returnLocation ?? "";
    data.insuranceOptions = carRentalDetails.insuranceOptions ?? "";
  }

  return data;
}

function buildCreateListingRequest(
  data: ListingFormData,
  categoryId: string,
): CreateListingRequest {
  const request: CreateListingRequest = {
    categoryId,
    title: data.title,
    description: data.description ?? "",
    price: Number(data.price) || 0,
    currency: data.currency || "LKR",
    location: data.location,
    isActive: data.isActive ?? true,
    images: data.images?.filter(Boolean) ?? [],
    tags: data.tagsInput
      ? data.tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    cancellationPolicy:
      data.cancellationPolicy || "Free cancellation within 24 hours",
    pricingUnitOverride:
      (data.pricingUnitOverride as "FixedPrice" | "PerPerson" | undefined) ||
      undefined,
  };

  switch (data.category) {
    case "Hotel":
      request.hotelDetails = {
        pricePerNight: Number(data.pricePerNight ?? data.price) || 0,
        availableRooms: Number(data.numberOfRooms) || 0,
        amenities: data.amenities ?? [],
        // Form state stores times as 24-hour "HH:mm" internally (see
        // normalizeTimeValue), but the backend validator requires 12-hour
        // AM/PM format (e.g. "2:00 PM") - convert at the request boundary.
        checkInTime: formatTimeAmPm(data.checkInTime) || "2:00 PM",
        checkOutTime: formatTimeAmPm(data.checkOutTime) || "12:00 PM",
        roomTypes: data.roomTypes ?? [],
        propertyType: data.propertyType ?? "",
        primaryRoomType: data.roomType ?? "",
      };
      break;
    case "Restaurant":
      request.restaurantDetails = {
        cuisineType: data.cuisineType ?? "",
        averageCost: Number(data.averageCost) || 0,
        // Same 24-hour-internal / 12-hour-AM/PM-on-the-wire conversion as
        // Hotel's check-in/out times above.
        openingHours: `${formatTimeAmPm(data.openingTime) || "6:00 AM"} - ${formatTimeAmPm(data.closingTime) || "11:00 PM"}`,
        tableCapacity: Number(data.seatingCapacity) || 0,
        tableTypes: data.tableTypes ?? [],
        reservationRules: data.reservationRules ?? "",
      };
      break;
    case "Activity":
      request.activityDetails = {
        activityType: data.activityType ?? "",
        durationHours: parseInt(data.duration?.replace(/\D/g, "") || "0", 10),
        difficultyLevel: data.difficultyLevel || "Easy",
        price: Number(data.activityPrice) || 0,
        minGroupSize: Number(data.minGroupSize) || 1,
        maxGroupSize: Number(data.maxGroupSize) || 10,
        minAge: Number(data.minAge) || 0,
        maxAge: Number(data.maxAge) || 100,
        includedServices: data.includedServices ?? [],
        safetyRequirements: data.safetyRequirements ?? "",
        availabilitySchedule: data.availabilitySchedule ?? "",
      };
      break;
    case "Event":
      request.eventDetails = {
        eventName: data.title,
        organizer: data.organizer ?? "",
        dateAndTime: `${data.eventDate || "2026-05-10"}T${data.eventTime || "19:00"}:00`,
        seatCount: Number(data.seatCount) || 0,
        ticketPrice: Number(data.ticketTypes?.[0]?.price) || 0,
        eventType: data.eventType ?? "",
        venueName: data.venueName ?? "",
        venueAddress: data.venueAddress ?? "",
        ticketTypes: (data.ticketTypes ?? []).map((t) => ({
          type: t.type,
          quantity: Number(t.quantity) || 0,
          price: Number(t.price) || 0,
        })),
      };
      break;
    case "CarRental":
      request.carRentalDetails = {
        brand: data.brand || data.vehicleType || "",
        model: data.model ?? "",
        vehicleType: data.vehicleType ?? "",
        transmission: data.transmission || "Automatic",
        pricePerDay: Number(data.dailyRate) || 0,
        seatCount: Number(data.seatCountCar) || 0,
        fuelType: data.fuelType ?? "",
        availabilityStatus: data.availabilityStatus || "Available",
        year: Number(data.year) || undefined,
        hourlyRate: Number(data.hourlyRate) || undefined,
        pickupLocation: data.pickupLocation ?? "",
        returnLocation: data.returnLocation ?? "",
        insuranceOptions: data.insuranceOptions || "Basic Insurance",
      };
      break;
  }

  return request;
}

const CreateListing = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [activeStep, setActiveStep] = useState(0);
  const [unitsError, setUnitsError] = useState<string | null>(null);

  const [unitsMode, setUnitsMode] = useState<UnitsMode>("none");
  const [listRows, setListRows] = useState<ListRow[]>(defaultListRows);
  const [gridConfig, setGridConfig] = useState<GridConfig>(defaultGridConfig);
  const [timeSlotConfig, setTimeSlotConfig] = useState<TimeSlotConfig>(
    defaultTimeSlotConfig,
  );
  const [optionGroups, setOptionGroups] = useState<OptionGroupRow[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [hasExistingUnits, setHasExistingUnits] = useState(false);
  const [hasExistingOptionGroups, setHasExistingOptionGroups] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  const showMessage = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info",
  ) => setSnackbar({ open: true, message, severity });

  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    defaultValues: {
      category: "Hotel",
      currency: "LKR",
      images: [],
      ticketTypes: [
        { type: "General Admission", quantity: 100, price: 50 },
        { type: "VIP", quantity: 100, price: 150 },
        { type: "Early Bird", quantity: 100, price: 35 },
      ],
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);

        if (isEditMode && id) {
          const listing = await getEditableListingById(id);
          const editData = buildEditFormData(listing);
          const savedCategory = cats.find(
            (category) =>
              category.id === listing.categoryId ||
              category.name.trim().toLowerCase() ===
                listing.categoryName.trim().toLowerCase(),
          );
          if (savedCategory) {
            editData.categoryId = savedCategory.id;
            editData.category =
              resolveListingCategory(savedCategory) ?? editData.category;
          }
          reset({
            category: "Hotel",
            currency: "LKR",
            images: [],
            roomTypes: [],
            amenities: [],
            tableTypes: [],
            includedServices: [],
            ticketTypes: [],
            ...editData,
          } as ListingFormData);

          try {
            const units = await getUnits(id);
            setHasExistingUnits(units.length > 0);
            if (
              units.length > 0 &&
              units.every((unit) => unit.kind === "Generic")
            ) {
              setUnitsMode("list");
              setListRows(
                units.map((unit) => ({
                  name: unit.name,
                  description: unit.description ?? "",
                  priceOverride:
                    unit.priceOverride == null
                      ? ""
                      : String(unit.priceOverride),
                  capacity: String(unit.capacity),
                })),
              );
            } else if (
              units.length > 0 &&
              units.every((unit) => unit.kind === "Seat")
            ) {
              setUnitsMode("grid");
              const rowIndexes = units.map((unit) =>
                Number(unit.rowIndex ?? 0),
              );
              const columnIndexes = units.map((unit) =>
                Number(unit.columnIndex ?? 0),
              );
              setGridConfig({
                rows: String(new Set(rowIndexes).size),
                columns: String(new Set(columnIndexes).size),
                pricePerSeat:
                  units[0].priceOverride == null
                    ? ""
                    : String(units[0].priceOverride),
              });
            } else if (
              units.length > 0 &&
              units.every((unit) => unit.kind === "TimeSlot")
            ) {
              setUnitsMode("timeslot");
              const starts = units
                .map((unit) => normalizeTimeValue(unit.slotStartTime ?? ""))
                .filter(Boolean)
                .sort();
              const durationMatch = units[0].slotDuration?.match(
                /(?:(\d+):)?(\d+):(\d+)|PT(?:(\d+)H)?(?:(\d+)M)?/i,
              );
              const durationMinutes = durationMatch
                ? Number(durationMatch[1] ?? durationMatch[4] ?? 0) * 60 +
                  Number(durationMatch[2] ?? durationMatch[5] ?? 30)
                : 30;
              setTimeSlotConfig({
                startTime: starts[0] ?? "09:00",
                endTime: starts.at(-1) ?? "17:00",
                slotDurationMinutes: String(durationMinutes || 30),
                capacityPerSlot: String(units[0].capacity),
                price:
                  units[0].priceOverride == null
                    ? ""
                    : String(units[0].priceOverride),
              });
            }
          } catch {
            setHasExistingUnits(false);
          }

          try {
            const groups = await getOptionGroups(id);
            setHasExistingOptionGroups(groups.length > 0);
            if (groups.length > 0) {
              setOptionGroups(
                groups.map((group) => ({
                  name: group.name,
                  values: group.values.map((value) => ({
                    name: value.name,
                    priceModifier:
                      value.priceModifier === 0
                        ? ""
                        : String(value.priceModifier),
                    priceOverride:
                      value.priceOverride == null
                        ? ""
                        : String(value.priceOverride),
                    confirmationOverride: value.confirmationTypeOverride ?? "",
                    requiresSeatSelection: value.requiresSeatSelection,
                  })),
                })),
              );
            }
          } catch {
            setHasExistingOptionGroups(false);
          }
        } else {
          try {
            const localization = await getLocalizationSettings();
            if (localization.currency) {
              setValue("currency", localization.currency);
            }
          } catch {
            // Keep the LKR default if localization settings aren't available.
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showMessage("Failed to load listing data.", "error");
        setTimeout(() => navigate("/vendor/listings"), 1200);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode, navigate, reset]);

  const formData = watch();
  const watchedCategory = watch("category");
  const selectedCategoryId = watch("categoryId");
  const chosenCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const resolvedCategory = chosenCategory
    ? resolveListingCategory(chosenCategory)
    : undefined;
  const selectedCategory = resolvedCategory ?? watchedCategory;

  // ListingType is no longer picked independently — it's derived from the
  // chosen category's Type, which decides which detail-fields section
  // renders below (see typeToCategory above).
  useEffect(() => {
    if (resolvedCategory) setValue("category", resolvedCategory);
  }, [resolvedCategory, setValue]);

  const createUnitsIfConfigured = async (listingId: string) => {
    if (unitsMode === "list") {
      const rows = listRows.filter((r) => r.name.trim());
      for (const row of rows) {
        await addUnit(listingId, {
          name: row.name.trim(),
          description: row.description.trim() || undefined,
          priceOverride: row.priceOverride
            ? Number(row.priceOverride)
            : undefined,
          capacity: Number(row.capacity) || 1,
        });
      }
    } else if (unitsMode === "grid") {
      const rows = Number(gridConfig.rows);
      const columns = Number(gridConfig.columns);
      if (rows > 0 && columns > 0) {
        await addUnitsGrid(listingId, {
          rows,
          columns,
          pricePerSeat: gridConfig.pricePerSeat
            ? Number(gridConfig.pricePerSeat)
            : undefined,
        });
      }
    } else if (unitsMode === "timeslot") {
      await addUnitsTimeSlots(listingId, {
        startTime: `${timeSlotConfig.startTime}:00`,
        endTime: `${timeSlotConfig.endTime}:00`,
        slotDurationMinutes: Number(timeSlotConfig.slotDurationMinutes) || 30,
        capacityPerSlot: Number(timeSlotConfig.capacityPerSlot) || 1,
        price: timeSlotConfig.price ? Number(timeSlotConfig.price) : undefined,
      });
    }
  };

  const createOptionGroupsIfConfigured = async (listingId: string) => {
    const groups = optionGroups.filter((g) => g.name.trim());
    for (const group of groups) {
      const created = await addOptionGroup(listingId, {
        name: group.name.trim(),
      });
      const values = group.values.filter((v) => v.name.trim());
      for (const value of values) {
        await addOptionValue(listingId, created.id, {
          name: value.name.trim(),
          priceModifier: value.priceModifier ? Number(value.priceModifier) : 0,
          priceOverride: value.priceOverride ? Number(value.priceOverride) : null,
          confirmationTypeOverride: value.confirmationOverride || null,
          requiresSeatSelection: value.requiresSeatSelection,
        });
      }
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      // The category select is required and only ever offers real,
      // currently-fetched admin categories — no fallback to "closest match"
      // or "first available". If it doesn't exist as a real category, this
      // listing cannot be published as that category.
      const categoryExists = categories.some((c) => c.id === data.categoryId);
      if (!categoryExists) {
        showMessage("Please select a valid category.", "error");
        return;
      }

      const request = buildCreateListingRequest(data, data.categoryId);

      if (isEditMode && id) {
        await updateListing(id, request, imageFiles);
        if (!hasExistingUnits) await createUnitsIfConfigured(id);
        if (!hasExistingOptionGroups) await createOptionGroupsIfConfigured(id);
        showMessage("Listing updated successfully!", "success");
      } else {
        const created = await createListing(request, imageFiles);
        // The listing is already published once POST /listings succeeds.
        // Unit/option setup is a follow-up operation and must not turn a
        // successful publish into a misleading failure (or encourage a
        // duplicate retry).
        const hasFollowUpSetup =
          unitsMode !== "none" || optionGroups.some((g) => g.name.trim());
        if (hasFollowUpSetup) {
          if (!created.id) {
            showMessage(
              "Listing published successfully, but bookable units/options could not be added because the API did not return the new listing ID.",
              "warning",
            );
          } else {
            try {
              await createUnitsIfConfigured(created.id);
              await createOptionGroupsIfConfigured(created.id);
              showMessage("Listing published successfully!", "success");
            } catch (unitError) {
              console.error(
                "Listing published, but unit/option setup failed:",
                unitError,
              );
              const unitMessage = getApiErrorMessage(unitError);
              showMessage(
                `Listing published successfully, but bookable units/options could not be added${unitMessage ? `: ${unitMessage}` : ". You can add them by editing the listing."}`,
                "warning",
              );
            }
          }
        } else {
          showMessage("Listing published successfully!", "success");
        }
      }
      notifyDashboardRefresh();
      // Delay the redirect slightly so the success toast is actually seen
      // before this page (and the snackbar mounted on it) unmounts.
      setTimeout(() => navigate("/vendor/listings"), 1200);
    } catch (error) {
      console.error(error);
      const backendMessage = getApiErrorMessage(error);
      showMessage(
        backendMessage ||
          `Failed to ${isEditMode ? "update" : "publish"} listing.`,
        "error",
      );
    }
  };

  const renderCategoryFields = () => {
    switch (selectedCategory) {
      case "Hotel":
        return (
          <HotelFields register={register} control={control} errors={errors} />
        );
      case "Restaurant":
        return (
          <RestaurantFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Activity":
        return (
          <ActivityFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      case "Event":
        return (
          <EventFields register={register} control={control} errors={errors} />
        );
      case "CarRental":
        return (
          <CarRentalFields
            register={register}
            control={control}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const validateUnitsStep = (): string | null => {
    if (unitsMode === "grid") {
      const rows = Number(gridConfig.rows);
      const columns = Number(gridConfig.columns);
      if (!(rows > 0 && columns > 0))
        return "Enter positive rows and columns, or switch back to None.";
    } else if (unitsMode === "timeslot") {
      if (
        !timeSlotConfig.startTime ||
        !timeSlotConfig.endTime ||
        !(Number(timeSlotConfig.slotDurationMinutes) > 0)
      ) {
        return "Fill in start time, end time, and a positive slot duration, or switch back to None.";
      }
    } else if (unitsMode === "list") {
      if (!listRows.some((r) => r.name.trim())) {
        return "Name at least one unit, or switch back to None.";
      }
    }

    // A group with values but no name (or a value typed into a group
    // that was never named) would otherwise be silently dropped on save
    // with no feedback - name it here before it's lost.
    const unnamedGroupWithValues = optionGroups.find(
      (g) => !g.name.trim() && g.values.some((v) => v.name.trim()),
    );
    if (unnamedGroupWithValues) {
      return "One of your option groups has values but no group name (e.g. \"Package\", \"Ticket Tier\") - name the group or remove its values.";
    }

    return null;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const valid = await trigger(BASIC_INFO_FIELDS);
      if (!valid) return;
      if (!resolvedCategory) {
        showMessage(
          "This category is not connected to a listing type. Please select one of the five main categories.",
          "error",
        );
        return;
      }
    } else if (activeStep === 1) {
      const fields = CATEGORY_REQUIRED_FIELDS[selectedCategory] ?? [];
      const valid = fields.length === 0 || (await trigger(fields));
      if (!valid) return;
    } else if (activeStep === 2) {
      const error = validateUnitsStep();
      setUnitsError(error);
      if (error) return;
    }
    setActiveStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1));
  };

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  if (loading) {
    return (
      <Container sx={{ py: 20 }}>
        <LoadingSpinner
          fullScreen={false}
          message="Loading listing details..."
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />

      <Box sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/vendor/listings"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            "&:hover": { color: "#0F5A8A" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Back to Listings
        </MuiLink>
      </Box>

      <StepperBar
        activeStep={activeStep}
        steps={WIZARD_STEPS}
        title={isEditMode ? "Edit Listing" : "Create New Listing"}
      />

      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #E2E8F0",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {activeStep === 0 && (
              <BaseFields
                register={register}
                control={control}
                errors={errors}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
              />
            )}

            {activeStep === 1 && renderCategoryFields()}

            {activeStep === 2 && (
              <>
                <BookableUnitsSection
                  category={selectedCategory}
                  mode={unitsMode}
                  onModeChange={(mode) => {
                    setUnitsMode(mode);
                    setUnitsError(null);
                  }}
                  listRows={listRows}
                  onListRowsChange={setListRows}
                  gridConfig={gridConfig}
                  onGridConfigChange={setGridConfig}
                  timeSlotConfig={timeSlotConfig}
                  onTimeSlotConfigChange={setTimeSlotConfig}
                />
                {unitsError && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {unitsError}
                  </Typography>
                )}
                <OptionGroupsSection
                  groups={optionGroups}
                  onGroupsChange={setOptionGroups}
                  hasSeatUnits={unitsMode === "grid"}
                />
              </>
            )}

            {activeStep === 3 && (
              <ImagesStep
                existingImages={formData.images ?? []}
                onRemoveExisting={(url) =>
                  setValue(
                    "images",
                    (formData.images ?? []).filter((img) => img !== url),
                  )
                }
                newFiles={imageFiles}
                onAddFiles={(files) =>
                  setImageFiles((prev) => [...prev, ...files])
                }
                onRemoveNewFile={(index) =>
                  setImageFiles((prev) => prev.filter((_, i) => i !== index))
                }
              />
            )}

            {activeStep === 4 && (
              <ReviewStep
                data={formData}
                categories={categories}
                register={register}
                unitsMode={unitsMode}
                listRows={listRows}
                gridConfig={gridConfig}
                timeSlotConfig={timeSlotConfig}
                optionGroups={optionGroups}
                onSubmit={handleSubmit(onSubmit)}
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
                pendingImageCount={imageFiles.length}
              />
            )}

            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                onClick={
                  activeStep === 0
                    ? () => navigate("/vendor/listings")
                    : handleBack
                }
                sx={{ borderRadius: "10px", px: 3 }}
              >
                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>

              {activeStep < WIZARD_STEPS.length - 1 && (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    borderRadius: "10px",
                    px: 4,
                    backgroundColor: "#0F5A8A",
                    "&:hover": { backgroundColor: "#0C4A73" },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateListing;
