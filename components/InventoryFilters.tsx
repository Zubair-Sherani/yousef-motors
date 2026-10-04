"use client";

import type { VehicleFilterState, VehicleSort } from "@/types/vehicle";

const sortOptions: { value: VehicleSort; label: string }[] = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "mileage-asc", label: "Mileage: low to high" },
  { value: "year-desc", label: "Newest year" },
];

export function InventoryFilters({
  filters,
  makes,
  models,
  years,
  resultCount,
  onChange,
  onReset,
}: {
  filters: VehicleFilterState;
  makes: string[];
  models: string[];
  years: number[];
  resultCount: number;
  onChange: (next: Partial<VehicleFilterState>) => void;
  onReset: () => void;
}) {
  return (
    <form
      className="grid gap-4 border border-line bg-stone p-5 md:grid-cols-2 lg:grid-cols-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Make</span>
        <select
          value={filters.make}
          onChange={(event) => onChange({ make: event.target.value, model: "" })}
          className="border border-line bg-paper px-3 py-2"
        >
          <option value="">All makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Model</span>
        <select
          value={filters.model}
          onChange={(event) => onChange({ model: event.target.value })}
          className="border border-line bg-paper px-3 py-2"
        >
          <option value="">All models</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Year</span>
        <select
          value={filters.year}
          onChange={(event) => onChange({ year: event.target.value })}
          className="border border-line bg-paper px-3 py-2"
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Max price</span>
        <select
          value={filters.maxPrice}
          onChange={(event) => onChange({ maxPrice: event.target.value })}
          className="border border-line bg-paper px-3 py-2"
        >
          <option value="">Any price</option>
          <option value="15000">Under $15,000</option>
          <option value="20000">Under $20,000</option>
          <option value="25000">Under $25,000</option>
          <option value="30000">Under $30,000</option>
          <option value="40000">Under $40,000</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Max mileage</span>
        <select
          value={filters.maxMileage}
          onChange={(event) => onChange({ maxMileage: event.target.value })}
          className="border border-line bg-paper px-3 py-2"
        >
          <option value="">Any mileage</option>
          <option value="30000">Under 30,000</option>
          <option value="50000">Under 50,000</option>
          <option value="75000">Under 75,000</option>
          <option value="100000">Under 100,000</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Sort</span>
        <select
          value={filters.sort}
          onChange={(event) => onChange({ sort: event.target.value as VehicleSort })}
          className="border border-line bg-paper px-3 py-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm md:col-span-2 lg:col-span-2">
        <input
          type="checkbox"
          checked={filters.includeSold}
          onChange={(event) => onChange({ includeSold: event.target.checked })}
        />
        Include sold vehicles
      </label>

      <div className="flex items-end justify-between gap-3 md:col-span-2 lg:col-span-1">
        <p className="text-sm text-muted">{resultCount} vehicle{resultCount === 1 ? "" : "s"}</p>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-ink underline-offset-2 hover:underline"
        >
          Reset filters
        </button>
      </div>
    </form>
  );
}
