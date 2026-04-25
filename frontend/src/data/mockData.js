export const mockCompanies = [
  {
    id: "tech-corp-1",
    name: "TechNova Corp",
    description:
      "A leading multinational technology company specializing in consumer electronics and software.",
    totalSpent2023: 8500000,
    spendingByYear: [
      { year: "2019", amount: 5200000 },
      { year: "2020", amount: 6100000 },
      { year: "2021", amount: 6800000 },
      { year: "2022", amount: 7900000 },
      { year: "2023", amount: 8500000 },
    ],
    topIssues: [
      { name: "Technology & Data Privacy", value: 4500000, color: "blue.6" },
      { name: "Taxes", value: 2000000, color: "teal.6" },
      { name: "Trade", value: 1200000, color: "orange.6" },
      { name: "Labor & Antitrust", value: 800000, color: "red.6" },
    ],
  },
  {
    id: "green-energy-2",
    name: "EcoPower Solutions",
    description:
      "Renewable energy provider focused on solar and wind infrastructure.",
    totalSpent2023: 3200000,
    spendingByYear: [
      { year: "2019", amount: 1500000 },
      { year: "2020", amount: 1800000 },
      { year: "2021", amount: 2200000 },
      { year: "2022", amount: 2800000 },
      { year: "2023", amount: 3200000 },
    ],
    topIssues: [
      { name: "Environment & Climate", value: 1800000, color: "green.6" },
      { name: "Energy Infrastructure", value: 1000000, color: "yellow.6" },
      { name: "Taxes", value: 400000, color: "teal.6" },
    ],
  },
];
