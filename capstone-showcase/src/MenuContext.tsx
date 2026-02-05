import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MenuContextProps {
  isSideMenu: boolean;
  toggleMenu: () => void;
  selectedSemester: string | null;
  selectedYear: string | null;
  setSelectedSemester: (semester: string, year: string) => void;
  getSelectedSemester: () => string | undefined;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isSideMenu, setIsSideMenu] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSemesterYear, setSelectedSemesterYear] = useState<string | null>(null);

  useEffect(() =>
  {
    const selectedSemesterYear = localStorage.getItem('selectedSemesterYear');

    if (selectedSemesterYear) {
      const [semester, year] = selectedSemesterYear.split('-');
      setSelectedSemesterYear(selectedSemesterYear);
      setSelectedSemester(semester);
      setSelectedYear(year);
    }


  }, [])
  const toggleMenu = () => {
    setIsSideMenu(!isSideMenu);
  };

  const setSelectedSemesterHandler = (semester: string, year: string) => {
    setSelectedSemester(semester);
    setSelectedYear(year);
  };

  const getSelectedSemester = () => {
    if (selectedSemesterYear) {
      console.log(selectedSemesterYear);
      return selectedSemesterYear;
    } else 
    {
      console.log("No semester selected");
      return undefined;
    }
  };

  return (
    <MenuContext.Provider value={{ isSideMenu, toggleMenu, selectedSemester, selectedYear, setSelectedSemester: setSelectedSemesterHandler,  getSelectedSemester }}>
      {children}
    </MenuContext.Provider>
  );
};