import { useProjects } from "../context/ProjectsProvider"
import type { FilterableProject } from "../Hooks/useFilterProjects";
import { Link } from "react-router-dom";
import useMajorTabHelpers from "../Hooks/useMajorTabHelpers";

export default function ProjectsGrid() {
  interface Project extends FilterableProject{
    youtubeLink?: string;
  }
  const { currentProjects } = useProjects<Project>();

  const { extractYouTubeThumbnail } = useMajorTabHelpers();

  return (
    <section className="project-catalog">
      <div className="projects-grid">
        {currentProjects.map((project, index) => (
          <Link
            key={project.id || index}
            to={`/survey/${project.id}`}
            state={{ project }}
            className="project-card-link"
          >
            <div className="project-card">
              {project.youtubeLink && (
                <img
                  src={extractYouTubeThumbnail(project.youtubeLink) || ""}
                  alt={`${project.projectTitle} Thumbnail`}
                  className="youtube-thumbnail"
                />
              )}

              <div className="project-details">
                <h4 className="project-title left-aligned">
                  {project.projectTitle}
                </h4>

                <p className="project-description left-aligned">
                  {project.projectDescription}
                </p>

                <div className="project-meta">
                  <p>
                    <strong>Team:</strong> {project.teamMemberNames}
                  </p>
                  <p>
                    <strong>Sponsor:</strong> {project.sponsor}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}