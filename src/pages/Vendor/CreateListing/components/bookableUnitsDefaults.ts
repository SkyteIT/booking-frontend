import type { ListRow, GridConfig, TimeSlotConfig } from "./BookableUnitsSection";

export const defaultListRows: ListRow[] = [{ name: "", priceOverride: "", capacity: "1" }];
export const defaultGridConfig: GridConfig = { rows: "5", columns: "10", pricePerSeat: "" };
export const defaultTimeSlotConfig: TimeSlotConfig = {
  startTime: "17:00",
  endTime: "22:00",
  slotDurationMinutes: "30",
  capacityPerSlot: "1",
  price: "",
};
