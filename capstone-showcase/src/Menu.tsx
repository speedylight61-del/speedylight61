import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import asuLogo from "./assets/asuLogo.png";
import "./Menu.css";
import {  ChevronDown  } from "lucide-react";

const API_BASE_URL =
  import.meta.env.PROD
    ? "/api" // relative to showcase.asucapstone.com
    : "http://localhost:3000/api"; 

const Menu: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  const [toggleDropdown, setToggleDropdown] = useState(false);

  //const submenuRef = useRef<HTMLLIElement>(null);
  const [currentSemester, setCurrentSemester] = useState<"sp" | "fa" | null>(
    null
  );
  const [currentYear, setCurrentYear] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const menuOptions = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Winners", path: "/winners" },
    { name: "Computer Science", path: "/computer-science" },
    {
      name: "Computer Systems Engineering",
      path: "/computer-systems-engineering",
    },
    { name: "Interdisciplinary", path: "/interdisciplinary" },
    { name: "Biomedical Engineering", path: "/biomedical-engineering" },
    { name: "Mechanical Engineering", path: "/mechanical-engineering" },
    { name: "Electrical Engineering", path: "/electrical-engineering" },
    { name: "Industrial Engineering", path: "/industrial-engineering" },
    { name: "Informatics", path: "/informatics" },
  ];
  const arrowStyle = {
    marginTop: 3.5,
    marginLeft: 3,
  }

  useEffect(() => {
    setToggleDropdown(false);
  },[location.pathname]);

  const getAvailableSemesters = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const semesters: { semester: "sp" | "fa"; year: string }[] = [];

    semesters.push({ semester: "sp", year: currentYear.toString() });
    semesters.push({ semester: "fa", year: currentYear.toString() });

    semesters.push({ semester: "sp", year: (currentYear - 1).toString() });
    semesters.push({ semester: "fa", year: (currentYear - 1).toString() });

    return semesters;
  };

  const getMajorSlugFromPath = (pathname: string): string | null => {
    // These routes are not tied to a specific major
    if (pathname === "/" || pathname === "/about" || pathname === "/winners") {
      return null;
    }
    // "/computer-science" -> "computer-science"
      return pathname.replace(/^\//, "");
  };

  const getDefaultSemester = (): { semester: "sp" | "fa"; year: string } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();  // 0 = Jan, 11 = Dec

    // Fall if month >= Aug (7), otherwise Spring
    return currentMonth >= 7
      ? { semester: "fa", year: currentYear.toString() }
      : { semester: "sp", year: currentYear.toString() };
  };

  const getPreviousSemester = (
    sem: "sp" | "fa",
    year: string
  ): { semester: "sp" | "fa"; year: string } => {
    const numericYear = parseInt(year, 10);
    if (sem === "sp") {
      return { semester: "fa", year: (numericYear - 1).toString() };
    }
    return { semester: "sp", year };
  };

  /**
  * Check if a given semester/year actually has survey entries.
  * - For major pages: GET /api/survey/:major/term=:semester-:year
  * - For home/about/winners: we just skip the check and assume "true".
   */
  const semesterHasEntries = async (
    pathname: string,
    semester: "sp" | "fa",
    year: string
  ): Promise<boolean> => {
    const majorSlug = getMajorSlugFromPath(pathname);

    // If there is no major (home, about, winners), skip backend check and return true.
    if (!majorSlug) {
      return true;
    }

    try {
      const url = `${API_BASE_URL}/survey/${majorSlug}/term=${semester}-${year}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error(
          "semesterHasEntries fetch failed:",
          res.status,
          res.statusText
        );
        return false;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn("semesterHasEntries expected array, got:", data);
        return false;
      }

      return data.length > 0;
    } catch (err) {
      console.error("semesterHasEntries error:", err);
      return false;
    }
  };

  const handleSemesterSelection = (semester: "sp" | "fa", year: string) => {
    setCurrentSemester(semester);
    setCurrentYear(year);
    localStorage.setItem("selectedSemesterYear", `${semester}-${year}`);
    navigate(`${pathname}?semester=${semester}&year=${year}`);
  };

  useEffect(() => {
    // Only run semester/year redirect logic on top-level routes
    const topLevelRoutes = [
      "/",
      "/winners",
      "/about",
      "/computer-science",
      "/computer-systems-engineering",
      "/interdisciplinary",
      "/biomedical-engineering",
      "/mechanical-engineering",
      "/electrical-engineering",
      "/industrial-engineering",
      "/informatics",
    ];
    if (!topLevelRoutes.includes(pathname)) return;

    const semesterFromUrl = searchParams.get("semester") as "sp" | "fa" | null;
    const yearFromUrl = searchParams.get("year");

    const initSemester = async () => {
      // 1) If the URL already specifies semester/year, just use it
      if (semesterFromUrl && yearFromUrl) {
        setCurrentSemester(semesterFromUrl);
        setCurrentYear(yearFromUrl);
        localStorage.setItem(
          "selectedSemesterYear",
          `${semesterFromUrl}-${yearFromUrl}`
        );
        return;
      }

      // 2) Try stored preference if it still has entries
      const stored = localStorage.getItem("selectedSemesterYear");
      if (stored) {
        const [storedSem, storedYr] = stored.split("-");
        const sem = storedSem as "sp" | "fa";
        const yr = storedYr;

        if (await semesterHasEntries(pathname, sem, yr)) {
          setCurrentSemester(sem);
          setCurrentYear(yr);
          navigate(`${pathname}?semester=${sem}&year=${yr}`, { replace: true });
          return;
        }
      }

      // 3) Start from date-based "current" semester 
      let { semester, year } = getDefaultSemester();

      // 4) Walk backwards until we find a semester with entries
      // limit loop to avoid infinite fallback
      for (let i = 0; i < 8; i++) {
        const hasData = await semesterHasEntries(pathname, semester, year);
        if (hasData) {
          setCurrentSemester(semester);
          setCurrentYear(year);
          localStorage.setItem("selectedSemesterYear", `${semester}-${year}`);
          navigate(`${pathname}?semester=${semester}&year=${year}`, {
            replace: true,
          });
          return;
        }

        const prev = getPreviousSemester(semester, year);
        semester = prev.semester;
        year = prev.year;
      }

      // 5) Final fallback: use current date-based semester even if empty
      const fallback = getDefaultSemester();
      setCurrentSemester(fallback.semester);
      setCurrentYear(fallback.year);
      navigate(
        `${pathname}?semester=${fallback.semester}&year=${fallback.year}`,
        { replace: true }
      );
    };

    void initSemester();
  }, [location.search, pathname, navigate, searchParams]);
  
  const renderSemesterDropdown = () => (
    <button className="department-button">
      {currentSemester && currentYear ? `${currentSemester === "sp" ? "Spring" : "Fall"} ${currentYear}` : "Semester"}
      <ChevronDown size={16} style={arrowStyle} strokeWidth={2} className="arrow" />
      <div className="department-dropdown">
         {getAvailableSemesters()
          .filter(sem => sem.semester != currentSemester || sem.year != currentYear)
          .map(({ semester, year }) => {
            const label = `${semester === "sp" ? "Spring" : "Fall"} ${year}`;
            return (
              <div key={`${semester}-${year}`} className="menu-item" onClick={() => handleSemesterSelection(semester, year)}>
              {label}
            </div>
          );
        })}
      </div>
    </button>
  );
  
  const renderMobileSemesterDropdown = () => (
      <li className="semester-selector">
        <label htmlFor="semesterDropdown">
        </label>
        <select
          id="semesterDropdown"
          className="semesterDropdown"
          value={
            currentSemester && currentYear
              ? `${currentSemester}-${currentYear}`
              : ""
          }
          onChange={(e) => {
            const [sem, yr] = e.target.value.split("-");
            handleSemesterSelection(sem as "sp" | "fa", yr);
          }}
        >
          <option value="">-- Select --</option>
          {getAvailableSemesters().map(({ semester, year }) => {
            const label = `${semester === "sp" ? "Spring" : "Fall"} ${year}`;
            return (
              <option key={`${semester}-${year}`} value={`${semester}-${year}`}>
                {label}
              </option>
            );
          })}
        </select>
      </li>
    );

  return (
    <div className="parent">
      <div className="nav-container">
        <div className="left-third">
          <Link to="/" className="">
            <div className="logo-container">
              <img src={asuLogo} alt="ASU Logo" className="asu-logo-nav" width={450}/>
            </div>
          </Link>
        </div>
        <div
          className="nav-mobile-dropdown"
          style={{ height: toggleDropdown ? 525 : 0 }}
        >
          <ul>
            {menuOptions.map((option) => (
              <li key={option.path} className="menu-item">
                <Link
                  to={option.path}
                  className={`menu-item ${
                    pathname === option.path ? "active" : ""
                  }`}
                >
                  {option.name}
                </Link>
              </li>
            ))}
            <li className="menu-item">
              {renderMobileSemesterDropdown()}
            </li>
          </ul>
        </div>
        <div
          className="burger-menu"
          onClick={() => setToggleDropdown(!toggleDropdown)}
        >
          <span
            className="bun"
            style={{
              top: toggleDropdown ? "50%" : "30%",
              left: "50%",
              transform: toggleDropdown
                ? "translate(-50%, -50%) rotate(45deg)"
                : "translate(-50%, -50%)",
            }}
          />
          <span
            className="patty"
            style={{
              opacity: toggleDropdown ? 0 : 1,
            }}
          />
          <span
            className="bun"
            style={{
              top: toggleDropdown ? "50%" : "70%",
              left: "50%",
              transform: toggleDropdown
                ? "translate(-50%, -50%) rotate(-45deg)"
                : "translate(-50%, -50%)",
            }}
          />
        </div>
        {/* desktop view menu  */}
        <div className="desktop-menu">
          <div className="center-third">
            <Link to="/winners" className="special-link">
              Winners
            </Link>
            <button className="department-button">
              Department
              <ChevronDown size={16} style={arrowStyle} strokeWidth={2} className="arrow" />
              <div className="department-dropdown">
                {menuOptions
                  .filter(option => !['About', 'Winners', 'Home'].includes(option.name))
                  .map(option => (
                    <Link
                      key={option.path}
                      to={option.path}
                      className={`menu-item ${
                        pathname === option.path ? "active" : ""
                      }`}
                    >
                      {option.name}
                    </Link>
                  ))}
              </div>
            </button>
            {renderSemesterDropdown()}
          </div>
          <div className="right-third">
            <Link to="/about" className="special-link">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
