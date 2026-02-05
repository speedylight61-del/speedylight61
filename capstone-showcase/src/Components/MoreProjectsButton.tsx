import { useNavigate } from "react-router-dom";

export default function MoreProjectsButton({}) {
  const navigate = useNavigate();

  const handleMoreProjectsClick = () => {
    navigate("/interdisciplinary");
  };

  return (
    <button
      className="more-projects-button"
      onClick={handleMoreProjectsClick}
      aria-label="More Projects Button"
    >
      Like what you see or don't see your project? Click here to see
      interdisciplinary projects!
    </button>
  )
}