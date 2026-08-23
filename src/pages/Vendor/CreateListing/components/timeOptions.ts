export const normalizeTimeValue = (value?: string): string => {
  const trimmed = (value?.trim() ?? "").toUpperCase();
  if (!trimmed) return "";
  const match = trimmed.match(
    /^(\d{1,2})(?::(\d{1,2}))?(?::\d{2})?\s*(AM|PM)?/i,
  );
  if (!match) return "";
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const period = match[3];
  if (minutes > 59) return "";
  if (period) {
    hours %= 12;
    if (period === "PM") hours += 12;
  }
  if (hours > 23) return "";
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const formatTimeAmPm = (value?: string): string => {
  const normalized = normalizeTimeValue(value);
  if (!normalized) return value ?? "";
  const [hourText, minuteText] = normalized.split(":");
  const hours = Number(hourText);
  if (!Number.isFinite(hours)) return value ?? "";
  return `${hours % 12 || 12}:${minuteText || "00"} ${hours < 12 ? "AM" : "PM"}`;
};
