import React, { useState } from "react";
import { Button, Container, Group, Select, Text, Title } from "@mantine/core";
import { fetchCompanies, fetchCompanySpending } from "../src/services/api";

export default function Comparison() {
  const [options, setOptions] = useState([]);
  const [companyA, setCompanyA] = useState(null);
  const [companyB, setCompanyB] = useState(null);
  const [difference, setDifference] = useState(null);
  const [error, setError] = useState("");

  React.useEffect(() => {
    fetchCompanies("", 100).then((companies) => {
      setOptions(companies.map((c) => ({ value: String(c.id), label: c.name })));
    });
  }, []);

  const handleCompare = async () => {
    if (!companyA || !companyB) return;
    try {
      setError("");
      const [a, b] = await Promise.all([
        fetchCompanySpending(companyA),
        fetchCompanySpending(companyB),
      ]);
      const delta = Number(a.total_spending || 0) - Number(b.total_spending || 0);
      setDifference(delta);
    } catch (err) {
      console.error("Failed to compare companies:", err);
      setError("Could not compare companies right now.");
    }
  };

  return (
    <Container size="md" mt="xl">
      <Title order={2} mb="md">
        Prototype Comparison
      </Title>

      <Group grow mb="sm">
        <Select
          placeholder="Select company A"
          data={options}
          value={companyA}
          onChange={setCompanyA}
          searchable
        />
        <Select
          placeholder="Select company B"
          data={options}
          value={companyB}
          onChange={setCompanyB}
          searchable
        />
      </Group>

      <Button onClick={handleCompare}>Compare</Button>

      {difference !== null && (
        <Text mt="md">
          Spending difference (A - B): ${difference.toLocaleString()}
        </Text>
      )}

      {error && (
        <Text c="red" mt="sm">
          {error}
        </Text>
      )}
    </Container>
  );
}
