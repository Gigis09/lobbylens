import React, { useEffect, useMemo, useState } from "react";
import { Container, Title, Text, Stack, Paper } from "@mantine/core";
import { fetchDashboard } from "../src/services/api";
import FilterPanel from "./FilterPanel";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    min_spend: "",
    order: "desc",
  });

  useEffect(() => {
    fetchDashboard().then(setData).catch(() => {
      setError("Could not load dashboard data.");
    });
  }, []);

  const topCompanies = useMemo(() => {
    let rows = [...(data?.recent_disclosures ?? [])];

    if (filters.year) {
      rows = rows.filter((row) => row.date_filed?.includes(filters.year));
    }

    if (filters.min_spend) {
      rows = rows.filter(
        (row) => Number(row.amount_spent || 0) >= Number(filters.min_spend),
      );
    }

    rows.sort((a, b) => {
      if (filters.order === "asc") {
        return Number(a.amount_spent || 0) - Number(b.amount_spent || 0);
      }

      return Number(b.amount_spent || 0) - Number(a.amount_spent || 0);
    });

    return rows;
  }, [data, filters]);

  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text>Loading...</Text>;

  return (
    <Container size="md" mt="xl">
      <Title order={2} mb="md">
        Prototype Dashboard
      </Title>
      <FilterPanel filters={filters} setFilters={setFilters} />
      <Stack>
        {topCompanies.map((company, i) => (
          <Paper key={`${company.company}-${i}`} p="sm" withBorder>
            <Text fw={600}>{company.company}</Text>
            <Text c="dimmed">
              ${Number(company.amount_spent || 0).toLocaleString()}
            </Text>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
