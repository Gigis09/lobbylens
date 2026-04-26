import { useState, useEffect } from "react";
import { 
  Container, Title, Text, SimpleGrid, Card, Loader, Center, Alert, Group 
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../services/api";

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAllCompanies();
  }, []);

  async function loadAllCompanies() {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchCompanies(); 
      
      const sortedCompanies = data.sort((a, b) => a.name.localeCompare(b.name));
      setCompanies(sortedCompanies);
    } catch (err) {
      console.error(err);
      setError("Failed to load the company directory.");
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <Container size="lg" mt="xl">
        <Alert color="red" title="Error">{error}</Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="lg" mt="xl">
        <Center h={300} flex={1} style={{ flexDirection: 'column', gap: '1rem' }}>
          <Loader size="xl" type="dots" color="blue" />
          <Text c="dimmed" fw={500}>Loading directory...</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl" className="animate-fade-in">
      <Title order={1} mb="xs">Company Directory</Title>
      <Text c="dimmed" mb="xl">
        Browse all {companies.length} companies currently tracked in the LobbyLens database.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {companies.map((company) => (
          <Card
            key={company.id}
            withBorder
            padding="lg"
            radius="md"
            onClick={() => navigate(`/company/${company.id}`)}
            style={{ cursor: "pointer", transition: "box-shadow 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <Group justify="space-between">
              <Title order={4}>{company.name}</Title>
              <Text size="sm" c="blue">View Profile →</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
