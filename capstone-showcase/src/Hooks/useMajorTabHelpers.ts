import { useNavigate, useSearchParams } from "react-router-dom";

export default function useMajorTabHelpers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedSemester = searchParams.get("semester");
  const selectedYear = searchParams.get("year");
  
  const extractYouTubeThumbnail = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = url.match(regex);
    return match ? `https://img.youtube.com/vi/${match[1]}/0.jpg` : null;
  };

  const getSemesterLabel = () => {
    if (selectedSemester === "fa") return `Fall ${selectedYear}`;
    if (selectedSemester === "sp") return `Spring ${selectedYear}`;
    return "";
  };

  const handleSurveyFormClick = () => {
    navigate("/survey");
  };


  return {
    extractYouTubeThumbnail,
    getSemesterLabel,
    handleSurveyFormClick,
  };
}
