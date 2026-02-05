import { createContext, useContext } from "react";
import useFilterProjects from "../Hooks/useFilterProjects";
import usePagination from "../Hooks/usePagination";
import type { FilterState, FilterableProject } from "../Hooks/useFilterProjects";
import type { PaginationState } from "../Hooks/usePagination";
import { useEffect } from "react";

type ProjectsContextType<T extends FilterableProject> = FilterState<T> & PaginationState<T>;

interface ProjectsProviderProps<T extends FilterableProject> {
  projects: T[];
  children: React.ReactNode;
}

const ProjectsContext = createContext<any>(null);

export function ProjectsProvider<T extends FilterableProject>({ 
  projects, 
  children 
}: ProjectsProviderProps<T>) {

  const filterState = useFilterProjects(projects);
  const paginationState = usePagination(filterState.filterProjects, 8);

  // Reset to page 1 when filters change
  useEffect(() => {
    paginationState.setCurrentPage(1);
  }, [filterState.filterProjects]);

  const value = {
    ...filterState,
    ...paginationState,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}
  
export function useProjects<T extends FilterableProject>() {
  const ctx = useContext(ProjectsContext) as ProjectsContextType<T> | null;
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return ctx;
}

