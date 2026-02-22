import { useMemo, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

// Components we will create next
import ListingSelector from "../../components/vendor/Availability/ListingSelector";
import AvailabilityToolbar from "../../components/vendor/Availability/AvailabilityToolbar";
import AvailabilityLegend from "../../components/vendor/Availability/Availabilitystatus";
import AvailabilityMonthGrid from "../../components/vendor/Availability/AvailabilityMonthGrid";


import type { ListingCard } from "../../components/vendor/Availability/type";

export default function Availability() {
  

  // dummy listings 
  const listings: ListingCard[] = useMemo(
    () => [
      { id: "55555555-5555-5555-5555-555555555555", name: "Beach House Villa", bookedCount: 5, blockedCount: 2 },
      { id: "66666666-6666-6666-6666-666666666666", name: "Tesla Model 3", bookedCount: 3, blockedCount: 4 },
      { id: "77777777-7777-7777-7777-777777777770", name: "Canon EOS R5", bookedCount: 2, blockedCount: 0 },
    ],
    []
  );

  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id ?? "");
  const [monthDate, setMonthDate] = useState(() => new Date());

  // Selected 
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  

  return (
    <Stack spacing={3}>
      {/* Page header */}
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Availability Calendar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage availability for each of your listings
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Listing selector cards */}
          <ListingSelector
            listings={listings}
            value={selectedListingId}
            onChange={(id) => {
              setSelectedListingId(id);
              setSelectedDates([]); // reset selection when listing changes
            }}
          />

          <Box sx={{ mt: 3 }}>
            <AvailabilityToolbar
              monthDate={monthDate}
              onPrevMonth={() => {
                setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
                setSelectedDates([]);
              }}
              onNextMonth={() => {
                setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
                setSelectedDates([]);
              }}
              selectedCount={selectedDates.length}
              onBlock={() => console.log("Block selected dates", selectedDates)}
              onUnblock={() => console.log("Unblock selected dates", selectedDates)}
              onClear={() => setSelectedDates([])}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <AvailabilityLegend />
          </Box>

          <Box sx={{ mt: 2 }}>
            <AvailabilityMonthGrid
              monthDate={monthDate}
              selectedDates={selectedDates}
              onToggleDate={(dateOnly) => {
                setSelectedDates((prev) =>
                  prev.includes(dateOnly)
                    ? prev.filter((d) => d !== dateOnly)
                    : [...prev, dateOnly]
                );
              }}
              // Step 3+ will pass booked/blocked ranges here
              bookedRanges={[]}
              blockedRanges={[]}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Upcoming bookings mini-card */}
      
    </Stack>
  );
}