import '../CSS/AdminDashboardShortcut.css';
import { Crown, CloudDownload, PencilOff, PackageMinus } from 'lucide-react';


interface AdminDashboardShortcutProps {
  changeTitle: (title: string) => void;
}

export const AdminDashboardShortcut: React.FC<AdminDashboardShortcutProps> = ({ changeTitle }) => {
    const access_point = [
        { label: "Make Edits", path: "/admin-dashboard/edit-students", icon: <PencilOff /> },
        { label: "Download Database", path: "/admin-dashboard/download-database", icon: <CloudDownload /> },
        { label: "Winners", path: "/admin-dashboard/update-winners", icon: <Crown /> },
        // {label: 'Sponsors', path: '/admin-dashboard/edit-sponsors', icon: <PencilOff />},
    ]
  return (
    <div className='admin-dashboard-shortcut-container'>
        
        <div className="admin-dashbord-shortcut-title">
            {/* <p>Dashboard ShortCut</p> */}
            <fieldset>
                <legend>ASU ADMIN</legend>
                Dashboard Shortcuts
            </fieldset>
            {/* <div className='admin-dashboard-shortcut-title-glass glass-card arrow-right'></div> */}
        </div>
        <div className='admin-dasboard-shortcut-grid-container'>

            {access_point.map((item) => (
                <div className='glass-card admin-dasboard-shortcut-grid-item'
                    key={item.label}
                    onClick={() => {changeTitle(item.label)}}>
                    {item.icon}
                    <p>{item.label}</p>
                </div>
            ))}
            <div className='glass-card admin-dasboard-shortcut-grid-item' onClick={() => window.location.href = "https://betasubmission.asucapstone.com/login"} style={{cursor: 'pointer'}} title={"Sponsor's Page"}><PackageMinus /><p>Sponsor's Page</p></div>
        </div>
    </div>
  );
}