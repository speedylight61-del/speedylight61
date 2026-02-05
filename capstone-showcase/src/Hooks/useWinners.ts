import { useEffect, useState } from "react";

export type ShowcaseEntry = {
  course: string;
  video: string;
  id: number;
  shouldDisplay: "YES" | "NO";
  position: number;
  members: string;
  Sponsor: string;
  description: string;
  ProjectTitle: string;
  winning_pic: string | null;
  NDA: "Yes" | "No";
  year: number;
  semester: "Spring" | "Summer" | "Fall" | "Winter";
  department?: string;
};

interface Filters {
  semester: string;
  year: string;
  department: string;
};

export default function useWinners() {
  const [pastWinnersData, setPastWinnersData] = useState<ShowcaseEntry[]>([]);
  const [filteredWinnersData, setFilteredWinnersData] = useState<ShowcaseEntry[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters>({
    semester: "all",
    year: "all",
    department: "all",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const API_BASE_URL =
  import.meta.env.PROD
    ? "/api" // Relative URL - will use https://showcase.asucapstone.com/api
    : "http://localhost:3000/api";
  useEffect(() => {
    fetch(`${API_BASE_URL}/winners`)
      .then((res) => res.json())
      .then((data) => setPastWinnersData(data))
      .catch(() => setPastWinnersData([]));
  }, []);

  const departmentMap: Record<string, string> = {
    "computer-science": "CS/E",
    "computer-systems-engineering": "Computer Systems Engineering",
    "biomedical-engineering": "Biomedical Engineering",
    "mechanical-engineering": "Mechanical Engineering",
    "electrical-engineering": "Electrical Engineering",
    "industrial-engineering": "IEE",
    "informatics": "Informatics",
    "interdisciplinary": "Interdisciplinary",
  };

  function applyTextSearch(data: ShowcaseEntry[], text: string) {
    if (!text) return data;
    const value = text.toLowerCase();
    return data.filter((entry) => {
      return (
        entry.ProjectTitle.toLowerCase().includes(value) ||
        entry.members.toLowerCase().includes(value) ||
        entry.description.toLowerCase().includes(value) ||
        entry.Sponsor.toLowerCase().includes(value)
      );
    });
  }

  function applySelectFilters(data: ShowcaseEntry[], f: Filters) {
    return data.filter((entry) => {
      const semester = f.semester.toLowerCase();
      const year = f.year.toLowerCase();
      const department = f.department.toLowerCase();

      return (
        (semester === "all" || entry.semester.toLowerCase() === semester) &&
        (year === "all" || entry.year.toString() === year) &&
        (department === "all" || entry.ProjectTitle.includes(departmentMap[department as keyof typeof departmentMap]))
      );
    });
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setHasFiltered(true);
    const searched = applyTextSearch(pastWinnersData, value);
    setFilteredWinnersData(searched);
  };

  const handleFilterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setHasFiltered(true);
    const filtered = applySelectFilters(pastWinnersData, filters);
    setFilteredWinnersData(filtered);
  };

  const clearFilters = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setHasFiltered(false);
    setSearchValue("");
    setFilteredWinnersData([]);
    setFilters({ semester: "all", year: "all", department: "all" });
  };

  return {
    pastWinnersData,
    filteredWinnersData,
    hasFiltered,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    years,
    handleSearchChange,
    handleFilterSubmit,
    clearFilters,
  } as const;
}