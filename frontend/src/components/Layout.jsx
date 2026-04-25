import { AppShell, Group, Title, Button } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title
            order={3}
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            LobbyLens
          </Title>
          <Group>
            <Button component={Link} to="/issues" variant="subtle">
              Issues
            </Button>
            <Button component={Link} to="/transparency" variant="subtle">
              Transparency
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
