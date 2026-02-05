import { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

export default function useFetchProjects(major: string, semester: string, year: string) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/survey/${major}/term=${semester}-${year}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if (!ignore) setProjects(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [major, semester, year]);

  return { projects, loading, error };
}
