import { useState, useEffect } from "react";
import "./CSS/AdminWinners.css";
import { SelectWinnerModal } from "./SelectWinnerModal";
import { ProjectObj, WinnerSelection } from "./SiteInterface";
import { TodaysDate } from "./AdminDate";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export function Winners() {
  const [projects, setProjects] = useState<ProjectObj[] | null>(null);
  const [selectionMade, setSelectionMade] = useState<boolean>(false);
  const { isSignedIn, isTokenValid, token } = useAuth();
  const navigate = useNavigate();

  const [currSelection, setCurrSelection] = useState<ProjectObj | null>(null);
  const [selectedWinners, setSelectedWinners] = useState<
    WinnerSelection[] | null
  >(null);
  const [semester, setSemester] = useState(TodaysDate().semester);
  const [year, setYear] = useState(TodaysDate().year);
  const [loading, setLoading] = useState(false);
  const[filteredProjects, setFilteredProjects] = useState<ProjectObj[] | null>(null);
  useEffect(() => {
    fetchProjects(semester, year);
  }, []);
  const setSelection = (
    project: ProjectObj,
    position: number,
    imgs: File[]
  ) => {
    console.log("current position:", position);
    console.log("position type", typeof position);

    if (position < 1 || position > 3) {
      console.error("Invalid position selected:", position);
      return;
    }

    setSelectedWinners((prevWinners) => {
      const updatedWinners = prevWinners || [];

      // Remove any existing winner with the same position
      const filteredWinners = updatedWinners.filter(
        (winner) => winner.position !== position
      );

      filteredWinners.push({
        projectId: project.id,
        projectName: project.projectTitle,
        position: position,
        pictures: imgs,
      });

      console.log("Updated Winners:", filteredWinners);
      return filteredWinners;
    });
  };
  const handleSelectionClose = () => {
    setSelectionMade(false);
    // setSelectedWinners(null);
  };
  const API_BASE_URL =
    import.meta.env.PROD ? "/api" : "http://localhost:3000/api";
  const STATIC_BASE_URL =
    import.meta.env.PROD ? "" : "http://localhost:3000";

  const fetchProjects = async (semester: string, year: number) => {
    console.log(semester, year);
    try {
      const response = await fetch(
        `${API_BASE_URL}/survey/${semester}/${year}`
      );
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currYear - i);
  const semesters = ["fa", "sp", "su"];
  const setSearchValue = (value: string) => {
    if (value === "") {
      setFilteredProjects(projects);
      return;
    }
    if (!projects) return;
    const filtered = projects.filter((project) =>
      project.projectTitle.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  }
  const saveWinners = async () => 
  {
    setLoading(true);
    if (!selectedWinners || selectedWinners.length < 3) {
      alert("Please select all three winners before saving.");
      return;
    }
    const formData = new FormData();
    selectedWinners.forEach((winner, index) => {
      formData.append(`projectId${index + 1}`, winner.projectId.toString());
      formData.append(`position${index + 1}`, winner.position.toString());
      winner.pictures.forEach((file, fileIndex) => {
        formData.append(`picture${index + 1}_${fileIndex + 1}`, file);
      });
    });

    const header = {
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${API_BASE_URL}/set_winners`, {
      method: "POST",
      headers: header,
      body: formData,
    });
    const data = await res.json();
    if (res.status !== 200) {
      alert(data.error || "Failed to save winners.");
      setLoading(false);
      return;
    }
    alert("Winners saved successfully!");
    setSelectedWinners(null);
    fetchProjects(semester, year);
    setLoading(false);
  };
  return (
    <div className="admin-set-winners-page">
      {selectionMade && currSelection && (
        <div className="edit-project-submission">
          <SelectWinnerModal
            project={currSelection}
            setSelectionMade={setSelection}
            handleSelectionClose={handleSelectionClose}
          />
        </div>
      )}
      <p className="edit-title">Set Capstone Showcase Winners</p>
      <form>
        <section>
          <label htmlFor="semester">Semester:</label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </section>
        <section>
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </section>
        <section>
          <button
            type="button"
            onClick={() => fetchProjects(semester, year)}
            className="fetch-projects-btn"
          >
            Fetch Projects
          </button>
        </section>
      </form>
      <div className="projects-list">
      <input type="text" className="admin-search-bar" placeholder="Search by project title" onChange={(e) => setSearchValue(e.target.value)}></input>
        {projects && projects.length === 0 ? (
          <p className="winner-small-title" style={{ fontSize: "" }}>
            No projects available for the selected semester and year.
          </p>
        ) : (
          <>
            <div className="selected-winners-adminwinners">
              {selectedWinners &&
                selectedWinners.length > 0 &&
                selectedWinners.map((winner) => (
                  <span key={winner.position} className="adminwinner-selection">
                    <img
                      src={
                        winner.pictures[0] &&
                        URL.createObjectURL(winner.pictures[0])
                      }
                    />
                    <span className="position">
                      {winner.position == 1 && "1st Place"}
                      {winner.position == 2 && "2nd Place"}
                      {winner.position == 3 && "3rd Place"}
                    </span>
                    <span className="project-title-winner">
                      {winner.projectName}
                    </span>
                  </span>
                ))}
              <div className="winners-action-in-admin-winner">
                {selectedWinners && selectedWinners.length > 2 && (
                  <button className="fetch-projects-btn" onClick={saveWinners}>
                    {loading ? "Saving..." : "Save Winners"}
                  </button>
                )}
                {selectedWinners && selectedWinners.length > 0 && (
                  <button
                    className="fetch-projects-btn"
                    onClick={() => setSelectedWinners([])}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="edit-submission-table">
              {/* Table of submissions will go here */}
              <table>
                <tr>
                  <th>id</th>
                  <th>Project Title</th>
                  <th>Project Desc</th>
                  <th>Major</th>
                  <th>Project Sponsor</th>
                </tr>
                {filteredProjects &&
                  filteredProjects.map((project: any) => (
                    <tr
                      key={project.id}
                      onClick={() => {
                        setSelectionMade(true);
                        setCurrSelection(project);
                      }}
                    >
                      <td>
                        <div>{project.id}</div>
                      </td>
                      <td>
                        <div>{project.projectTitle}</div>
                      </td>
                      <td>
                        <div>{project.projectDescription}</div>
                      </td>
                      <td>
                        <div>{project.major}</div>
                      </td>
                      <td>
                        <div>{project.sponsor}</div>
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
