import { statusLabel } from "@/lib/format";
import type { VehicleStatus } from "@/types/vehicle";

const styles: Record<VehicleStatus, string> = {
  available: "bg-stone text-ink",
  pending: "bg-sand text-ink",
  sold: "bg-ink text-paper",
};

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium tracking-wide ${styles[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
