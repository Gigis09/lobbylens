import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Table,
  Badge,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
// 1. Remove mock data, import the new API function!
import { fetchIssueBreakdown } from "../services/api";

export default function IssueBreakdown() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Fetch the data when the page loads
  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchIssueBreakdown();
      setIssues(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load policy issues from the database.");
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Loading & Error States
  if (error) {
    return (
      <Container size="lg" mt="xl">
        <Alert color="red" title="Database Error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="lg" mt="xl">
        <Center
          h={300}
          flex={1}
          style={{ flexDirection: "column", gap: "1rem" }}
        >
          <Loader size="xl" type="dots" color="teal" />
          <Text c="dimmed" fw={500}>
            Calculating issue aggregations...
          </Text>
        </Center>
      </Container>
    );
  }

  // 4. Map the real data to the charts!
  const chartData = issues.map((issue) => ({
    issueName: issue.name,
    amount: issue.totalValue,
    color: issue.color || "teal.6", // Fallback color just in case
  }));

  const rows = issues.map((issue) => (
    <Table.Tr key={issue.name}>
      <Table.Td>
        <Badge color={(issue.color || "teal").split(".")[0]} variant="light">
          {issue.name}
        </Badge>
      </Table.Td>
      <Table.Td fw={500}>${(issue.totalValue / 1000000).toFixed(1)}M</Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {issue.topSpender || "N/A"}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" mt="xl" className="animate-fade-in">
      <Title order={1} mb="xs">
        Issue Breakdown
      </Title>
      <Text c="dimmed" mb="xl">
        Explore the most heavily funded policy issues across our database.
      </Text>

      <Card withBorder radius="md" padding="xl" mb="xl">
        <Title order={3} mb="xl">
          Total Spending by Policy Issue
        </Title>
        {issues.length > 0 ? (
          <BarChart
            h={300}
            data={chartData}
            dataKey="issueName"
            series={[{ name: "amount", color: "teal.6", label: "Total Spend" }]}
            tickLine="y"
            valueFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            cursorFill="transparent"
            styles={{ tooltipItemColor: { display: "none" } }}
          />
        ) : (
          <Center h={200} bg="gray.0">
            <Text c="dimmed">No issues found.</Text>
          </Center>
        )}
      </Card>

      <Card withBorder radius="md" padding="xl">
        <Title order={3} mb="md">
          Detailed Issue Report
        </Title>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Policy Issue</Table.Th>
              <Table.Th>Total Spent (All Companies)</Table.Th>
              <Table.Th>Top Contributor</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
}
