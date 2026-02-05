import { useState } from "react";
import "./CSS/AdminWinners.css";
export interface WinnerSelection {
    position: string;
    projectId:number;
    projectName: string;
    pictures: string[];
}
interface projectsProps 
{
    projectId: number;
    projectName: string;
    projectDescription: string;
    projectSponsor: string;
}
export function ShowAllProjects(projects: projectsProps[]) {
  const [filteredProjects, setFilteredProjects] =
    useState<projectsProps[]>(projects);
  const[firstPlace, setFirstPlace] = useState<WinnerSelection | null>(null);
  const[secondPlace, setSecondPlace] = useState<WinnerSelection | null>(null);
  const[thirdPlace, setThirdPlace] = useState<WinnerSelection | null>(null);
  const[selectedProject, setSelectedProject] = useState<projectsProps | null>(null);

  const handleSelectWinner = (project: WinnerSelection) => {
    if (project.position === "first") {
      setFirstPlace(project);
    } else if (project.position === "second") {
      setSecondPlace(project);
    } else if (project.position === "third") {
      setThirdPlace(project);
    }
  };

  const handleFilterProjects = (projectName: string) => {
    const filtered = projects.filter((project) =>
      project.projectName.toLowerCase().includes(projectName.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  return (
    <div>
        <div className="winner-selected-project-backdrop" onClick={() => setSelectedProject(null)}>
        <div className="winner-selected-project-modal">
          {selectedProject && (
            <form>
                <h2>Project Details</h2>
                <p>Project Name: {selectedProject.projectName}</p>
                <p>Project Sponsor: {selectedProject.projectSponsor}</p>
                <p>Project Description </p>
                <p>{selectedProject.projectDescription}</p>
                <section>
                    <label>Select Winner</label>
                    <select onChange={(e) => handleSelectWinner({position: e.target.value, projectId: selectedProject.projectId, projectName: selectedProject.projectName, pictures: []})}>
                        <option value="">--Select Position--</option>
                        <option value="first">First Place</option>
                        <option value="second">Second Place</option>
                        <option value="third">Third Place</option>
                    </select>
                </section>
                <section>
                    <input type="file" accept="image/*"></input>
                </section>

            </form>
        )}
        </div>
        </div>
     <input
        type="text"
        placeholder="Filter by project name"
        onChange={(e) => handleFilterProjects(e.target.value)}
      />
      <h2>All Projects</h2>
      <table>
        <thead>
            <tr>
                <th>Project id</th>
                <th>Project Name</th>
                <th>Project Description</th>
                <th>Project Sponsor</th>
            </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.projectId}>
              <td>{project.projectId}</td>
              <td>{project.projectName}</td>
              <td>{project.projectDescription}</td>
              <td>{project.projectSponsor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
