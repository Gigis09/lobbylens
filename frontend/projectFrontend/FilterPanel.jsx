import React from "react";
export default function FilterPanel({ filters, setFilters }) {
  return (
    <div>
      <h3>Filters</h3>

      <input
        placeholder="Year"
        onChange={(e) =>
          setFilters({ ...filters, year: e.target.value })
        }
      />

      <input
        placeholder="Min Spend"
        onChange={(e) =>
          setFilters({ ...filters, min_spend: e.target.value })
        }
      />

      <select
        onChange={(e) =>
          setFilters({ ...filters, order: e.target.value })
        }
      >
        <option value="desc">High → Low</option>
        <option value="asc">Low → High</option>
      </select>
    </div>
  );
}
