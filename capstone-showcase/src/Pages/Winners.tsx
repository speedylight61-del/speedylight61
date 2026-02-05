import "../CSS/Winners.css";
import { WinnerComponent } from "../Components/WinnerComponent";
import useWinners from "../Hooks/useWinners";
import Footer from "./Footer";




const Winner: React.FC = () => {
  const {
    pastWinnersData,
    filteredWinnersData,
    hasFiltered,
    searchValue,
    filters,
    setFilters,
    handleSearchChange,
    handleFilterSubmit,
    clearFilters,
  } = useWinners();



  return (
    <div className="winners__form-container">
      <h1 className="winners__showcase-title">
        ASU Winners Showcase
      </h1>
      <p className="winners__showcase-desc">Celebrating academic excellence and innovation through outstanding student achievements at Arizona State University.</p>

      <div className="winners__filter-bar-container">
        <form className="winners__form" onSubmit={handleFilterSubmit}>
        {/* <form className="winners__form"> */}
          <div className="winners__left-filter-bar">

              <div className="winners__item-container">
                <label htmlFor="department"></label>
                <select
                  name="department"
                  id="department"
                  className="winners__filter-param winners__department-dropdown"
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                >
                  <option value="all">Department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="computer-systems-engineering">Computer Systems Engineering</option>
                  <option value="biomedical-engineering">Biomedical Engineering</option>
                  <option value="mechanical-engineering">Mechanical Engineering</option>
                  <option value="electrical-engineering">Electrical Engineering</option>
                  <option value="industrial-engineering">Industrial Engineering</option>
                  <option value="informatics">Informatics</option>
                  <option value="interdisciplinary">Interdisciplinary</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="winners__filter-param winners__search-input"
              />
          </div>

          <div className="winners__item-container">
            <div className="winners__button-container">
              <button type="submit" className="winners__form-button">
                Filter
              </button>
              <button className="winners__form-button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      <WinnerComponent winners={hasFiltered ? filteredWinnersData : pastWinnersData} />
      {/* <div className="winners__z-index"> */}
        <Footer />
      {/* </div> */}
    </div>
  );
};

export default Winner;
