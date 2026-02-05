import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminDashboard.css";
import { Winners } from "../AdminWinners";
import { AdminDashboardShortcut } from "./AdminDashboardShortcut";
import { useAuth } from "../AuthContext";
import { Menu } from "lucide-react";
import {
  LayoutDashboard,
  PencilOff,
  CloudDownload,
  PackageMinus,
  LogOut,
  Crown,
} from "lucide-react";
import { Edit } from "../Edit";
import { DownloadProjects } from "../DownloadProjects";

interface AdminDashboardProps {
  pageTitle: string;
}

const sidebarOptions = [
  { label: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard /> },
  {
    label: "Make Edits",
    path: "/admin-dashboard/edit-students",
    icon: <PencilOff />,
  },
  {
    label: "Download Database",
    path: "/admin-dashboard/download-database",
    icon: <CloudDownload />,
  },
  {
    label: "Winners",
    path: "/admin-dashboard/update-winners",
    icon: <Crown />,
  },
];

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isTokenValid, setIsSignedIn, setToken } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLoggingOut(false);
    setIsSignedIn(false);
    setToken(null);

    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (isLoggingOut) return;
    if (!isSignedIn) {
      console.warn("User is not signed in. Redirecting to /admin.");
      navigate("/admin");
      return;
    }

    if (!isTokenValid()) {
      console.warn("Token is invalid. Logging out and redirecting to /admin.");
      setIsSignedIn(false);
      setToken(null);
      navigate("/admin");
      return;
    }

    setLoading(false);
  }, [
    isSignedIn,
    isTokenValid,
    navigate,
    setIsSignedIn,
    setToken,
    isLoggingOut,
  ]);

  return (
    <>
      {loading && (
        <div className="loading-shade">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="admin-dashboard-container">
        {loggingOut && (
          <div
            className="admin-logout-shade"
            onClick={() => setLoggingOut(false)}
          >
            <div className="admin-logout-msg">
              <LogOut size={50} className="admin-logout-icon" />
              <h2>Log Out</h2>
              <p>
                Are you sure you want to log out? You’ll need to sign in again
                to access your dashboard.
              </p>
              <button className="admin-logout-yes" onClick={handleLogout}>
                Yes, Log Me Out
              </button>
              <button
                className="admin-logout-no"
                onClick={() => setLoggingOut(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* --- ADDED FOR BETTER MOBILE UX --- */}
        {showMenu && (
          <div
            className="mobile-overlay"
            onClick={() => setShowMenu(false)}
          ></div>
        )}

        <div className="admin-dashboard-header ">
          <span className="title">{pageTitle}</span>
          <span className="menu" onClick={() => setShowMenu(!showMenu)}>
            <Menu />
          </span>
        </div>
        <div className="admin-dashboard-body">
          <nav
            className={`admin-dashboard-navbar ${
              showMenu ? "admin-nav-show" : ""
            }`}
          >
            <div className="admin-dashboard-navbar-options">
              <ul className="admin-dashboard-navbar-list">
                {sidebarOptions.map((option) => (
                  <li
                    key={option.label}
                    className="admin-dashboard-navbar-items"
                    onClick={() => {
                      setPageTitle(option.label);
                      setShowMenu(false);
                    }}
                  >
                    {option.icon}
                    {option.label}
                  </li>
                ))}
                <a
                  href="https://betasubmission.asucapstone.com/login"
                  className="admin-dashboard-navbar-items"
                >
                  <PackageMinus />
                  Go to Sponsor Page
                </a>
              </ul>
            </div>

            <div className="admin-dashboard-logout-container">
              <button
                className="admin-dashboard-logout-button"
                onClick={() => {
                  setLoggingOut(true);
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
          <main className="admin-dashboard-main">
            {pageTitle === "Dashboard" && (
              <AdminDashboardShortcut changeTitle={setPageTitle} />
            )}
            {pageTitle === "Download Database" && <DownloadProjects />}
            {pageTitle === "Make Edits" && <Edit />}
            {pageTitle === "Winners" && <Winners />}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
