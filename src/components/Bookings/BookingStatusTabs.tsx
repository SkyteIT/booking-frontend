import SegmentedTabs from "../common/SegmentedTabs";

export type BookingStatusFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type Props = {
  value: BookingStatusFilter;
  onChange: (value: BookingStatusFilter) => void;
};

const tabs: BookingStatusFilter[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function BookingsStatusTabs({ value, onChange }: Props) {
  return <SegmentedTabs options={tabs} value={value} onChange={onChange} />;
}
