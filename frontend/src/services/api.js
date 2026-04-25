const API_BASE = "http://127.0.0.1:8000";


export async function fetchCompanies(query = "", limit = 500) {
  const url = new URL(`${API_BASE}/companies`);

  if (query.trim()) {
    url.searchParams.set("query", query.trim());
  }

  url.searchParams.set("limit", limit);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch companies");

  return res.json();
}
export async function fetchCompanySpending(companyId) {
  const res = await fetch(`${API_BASE}/companies/${companyId}/spending`);
  if (!res.ok) throw new Error("Failed to fetch company spending");
  return res.json();
}

export async function fetchGlobalSpending() {
  const res = await fetch(`${API_BASE}/companies/global/recent`);
  if (!res.ok) throw new Error("Failed to fetch global spending");
  return res.json();
}

export async function fetchIssueBreakdown() {
  const res = await fetch(`${API_BASE}/issues/breakdown`);
  if (!res.ok) throw new Error("Failed to fetch issue breakdown");
  return res.json();
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export async function fetchCompany(companyId) {
  const res = await fetch(`${API_BASE}/companies/${companyId}`);
  if (!res.ok) throw new Error("Failed to fetch company");
  return res.json();
}
