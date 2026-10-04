import { VehicleCard } from "@/components/VehicleCard";
import type { Vehicle } from "@/types/vehicle";

export function VehicleGrid({
  vehicles,
  emptyMessage = "No vehicles match the current filters.",
}: {
  vehicles: Vehicle[];
  emptyMessage?: string;
}) {
  if (vehicles.length === 0) {
    return <p className="border border-dashed border-line px-5 py-12 text-center text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle, index) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 3} />
      ))}
    </div>
  );
}
