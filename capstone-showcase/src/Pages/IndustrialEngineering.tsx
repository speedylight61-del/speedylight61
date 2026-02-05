import React, { useEffect, useState, useMemo } from "react";
import { useMenuContext } from "../MenuContext";
import "../CSS/IndustrialEngineering.css";
import "../CSS/ProjectCards.css";
import "../CSS/Pagination.css";
import "../CSS/ProjectShowcase.css";
import { useSearchParams } from "react-router-dom";
import asuLogo from "../assets/asuLogo.png";
import Footer from "./Footer";
import PaginationControls from "../Components/PaginationControls";
import useFetchProjects from "../Hooks/useFetchProjects";
import useMajorTabHelpers from "../Hooks/useMajorTabHelpers";
import { ProjectsProvider } from "../context/ProjectsProvider";
import SearchAndFilterControls from "../Components/SearchAndFilterControls";
import ProjectsGrid from "../Components/ProjectsGrid";
import MoreProjectsButton from "../Components/MoreProjectsButton";

const IndustrialEngineering: React.FC = () => {
  const { isSideMenu } = useMenuContext();
  const [searchParams] = useSearchParams();
  const selectedSemester = searchParams.get("semester");
  const selectedYear = searchParams.get("year");

  // Fetch Projects based on selected semester and year
  const DEFAULT_SEMESTER = "fa";
  const DEFAULT_YEAR = "2025";
  const semester = selectedSemester || DEFAULT_SEMESTER;
  const year = selectedYear || DEFAULT_YEAR;
  const major = "industrial-engineering";
  const majorString = "Industrial Engineering";
  const { projects, loading, error } = useFetchProjects(major, semester, year);
  
  // Major Tab Helpers
  const { 
    handleSurveyFormClick, 
  } = useMajorTabHelpers();

  useEffect(() => {
    document.body.classList.add(`${major}-page-body`);
    return () => {
      document.body.classList.remove(`${major}-page-body`);
    }
  }, []);

  return (
    <div className={`${major} ${isSideMenu ? "compressed" : ""}`}>
      <header className="header-background"></header>
      <main className="content-area">
        <section className="event-details">
          <article>
            <img src={asuLogo} alt="ASU Logo" className="asu-logo" />
            <div className="title-container">
              <h3 className="main-page-title">{`${majorString}`}</h3>
              <button
                className="survey-form-button"
                onClick={handleSurveyFormClick}
                aria-label="Survey Form Button"
              >
                Survey Form
              </button>
            </div>
          </article>
        </section>

        {/* Render the list of projects */}
        <section className="projects-list">
          {projects.length === 0 ? (
            <p>{`No projects available for ${majorString}`}</p>
          ) : (
            <>
              <ProjectsProvider projects={projects}>
                <SearchAndFilterControls/>
                <ProjectsGrid/>
                <PaginationControls/>
              </ProjectsProvider>
              <MoreProjectsButton/>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IndustrialEngineering;
