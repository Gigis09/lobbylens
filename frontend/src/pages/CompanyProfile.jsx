import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Group,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { useParams } from "react-router-dom";
import { fetchCompany, fetchCompanySpending } from "../services/api";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [spending, setSpending] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  async function loadCompanyData() {
    try {
      setIsLoading(true);
      setError("");

      const companyData = await fetchCompany(id);
      const spendingData = await fetchCompanySpending(id);

      setCompany(companyData);
      setSpending(spendingData);
    } catch (err) {
      console.error("Failed to load company profile:", err);
      setError(
        "Could not load company data. Please ensure the backend is running.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const formatSpend = (value) => {
    if (!value) return "$0";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  if (error) {
    return (
      <Container size="lg" mt="xl">
        <Alert color="red" title="Error Loading Profile" variant="light">
          {error}
        </Alert>
      </Container>
    );
  }

  if (isLoading || !company || !spending) {
    return (
      <Container size="lg" mt="xl">
        <Center
          h={300}
          flex={1}
          style={{ flexDirection: "column", gap: "1rem" }}
        >
          <Loader size="xl" type="dots" color="blue" />
          <Text c="dimmed" fw={500}>
            Pulling financial records...
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl" className="animate-fade-in">
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={1}>{company.name}</Title>
          <Text c="dimmed" mt="sm" maw={600}>
            Lobbying spending details pulled directly from the historical
            database.
          </Text>
        </div>

        <Card
          withBorder
          radius="md"
          padding="xl"
          bg="var(--mantine-color-blue-light)"
        >
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            Total Spending
          </Text>
          <Title order={2}>{formatSpend(spending.total_spending || 0)}</Title>
        </Card>
      </Group>

      <Grid gutter="xl" mt="xl">
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Card withBorder radius="md" padding="xl">
            <Title order={3} mb="xl">
              Spending Over Time
            </Title>

            {spending.by_year && spending.by_year.length > 0 ? (
              <BarChart
                h={300}
                data={spending.by_year}
                dataKey="year"
                series={[
                  { name: "amount", color: "blue.6", label: "Lobbying Spend" },
                ]}
                tickLine="y"
                valueFormatter={formatSpend}
                cursorFill="transparent"
                styles={{
                  tooltipItemColor: { display: "none" },
                }}
              />
            ) : (
              <Center h={200} bg="gray.0" style={{ borderRadius: "8px" }}>
                <Text c="dimmed">
                  No historical spending data found for this company.
                </Text>
              </Center>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
