import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Title,
  Text,
  Autocomplete,
  Button,
  Group,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../services/api";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies("", 100);
  }, []);

  async function loadCompanies(query = "", limit = 100) {
    try {
      setIsLoading(true);
      setError("");
      const data = await fetchCompanies(query, limit);
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies:", err);
      setError("Could not connect to the database. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const query = searchValue.trim();

    const timeoutId = setTimeout(() => {
      if (query) {
        loadCompanies(query, 100);
      } else {
        loadCompanies("", 100);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const companyNames = useMemo(() => {
    return companies.map((company) => company.name);
  }, [companies]);

  const handleSearch = async () => {
    try {
      let selectedCompany = companies.find(
        (c) => c.name.toLowerCase() === searchValue.toLowerCase(),
      );

      if (!selectedCompany && searchValue.trim()) {
        const fallbackMatches = await fetchCompanies(searchValue, 100);
        selectedCompany = fallbackMatches.find(
          (c) => c.name.toLowerCase() === searchValue.toLowerCase(),
        );
      }

      if (selectedCompany) {
        setError("");
        navigate(`/company/${selectedCompany.id}`);
      } else {
        setError(
          `We couldn't find a company named "${searchValue}". Try picking one from the dropdown!`,
        );
      }
    } catch (err) {
      console.error("Failed to search companies:", err);
      setError("Could not search companies right now. Please try again.");
    }
  };

  const handleInputChange = (value) => {
    setSearchValue(value);
  };

  if (isLoading && companies.length === 0) {
    return (
      <Container size="md" mt="xl">
        <Center
          h={300}
          flex={1}
          style={{ flexDirection: "column", gap: "1rem" }}
        >
          <Loader size="xl" type="dots" color="blue" />
          <Text c="dimmed" fw={500}>
            Waking up the LobbyLens database...
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" mt="xl" className="animate-fade-in">
      <Title order={1} ta="center" mb="md">
        LobbyLens
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Discover how much companies spend on lobbying and the issues they
        support.
      </Text>

      {error && (
        <Alert color="red" mb="md" variant="light" title="Search Error">
          {error}
        </Alert>
      )}

      <Group align="flex-start" justify="center">
        <Autocomplete
          placeholder="Search companies or brands (e.g., Apple, DroneUp)..."
          data={companyNames}
          value={searchValue}
          onChange={handleInputChange}
          style={{ flex: 1, maxWidth: 500 }}
          limit={Math.max(50)}
          maxDropdownHeight={300}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button onClick={handleSearch} color="blue">
          Search
        </Button>
      </Group>

      <Center mt="xl">
        <Button 
          variant="subtle" 
          color="gray" 
          onClick={() => navigate("/companies")}
        >
          Not sure what to search? Browse the full directory →
        </Button>
      </Center>
    </Container>
  );
}
