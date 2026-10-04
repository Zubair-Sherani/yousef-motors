"use client";

import { useMemo, useState } from "react";

import { InventoryFilters } from "@/components/InventoryFilters";
import { VehicleGrid } from "@/components/VehicleGrid";
import { filterVehicles, getModels } from "@/lib/vehicles";
import type { Vehicle, VehicleFilterState } from "@/types/vehicle";

const defaultFilters: VehicleFilterState = {
  make: "",
  model: "",
  year: "",
  maxPrice: "",
  maxMileage: "",
  includeSold: false,
  sort: "year-desc",
};

export function InventoryBrowser({
  vehicles,
  makes,
  years,
}: {
  vehicles: Vehicle[];
  makes: string[];
  years: number[];
}) {
  const [filters, setFilters] = useState<VehicleFilterState>(defaultFilters);

  const models = useMemo(() => getModels(filters.make || undefined), [filters.make]);
  const visible = useMemo(() => filterVehicles(vehicles, filters), [vehicles, filters]);

  return (
    <div className="space-y-8">
      <InventoryFilters
        filters={filters}
        makes={makes}
        models={models}
        years={years}
        resultCount={visible.length}
        onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
        onReset={() => setFilters(defaultFilters)}
      />
      <VehicleGrid vehicles={visible} />
    </div>
  );
}
