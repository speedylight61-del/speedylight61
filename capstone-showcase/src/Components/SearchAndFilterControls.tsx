import { useProjects } from "../context/ProjectsProvider";
import "../CSS/SearchandFilterControl.css";


export default function SearchAndFilterControls() {

  const {
    searchQuery,
    setSearchQuery, 
    selectedSponsor, 
    setSelectedSponsor, 
    uniqueSponsors, 
  } = useProjects();

  return (
    <section className="search-filter-section">
      <div className="search-bar-container">
          <input
              type="text"
              className="search-bar"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      <div className="filter-container">
          <select
              className="sponsor-filter"
              value={selectedSponsor}
              onChange={(e) => setSelectedSponsor(e.target.value)}
          >
              {uniqueSponsors.map((sponsor, index) => (
                  <option key={index} value={sponsor}>
                      {sponsor === "all" ? "All Sponsors" : sponsor}
                  </option>
              ))}
          </select>
      </div>
    </section>
  )
}