import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Building, Mail, User, Calendar } from "lucide-react";
import "../CSS/SurveryDetails.css";
import { useMenuContext } from "../MenuContext";
import Missing_photo from "../assets/Missing_photo.svg";
import Footer from "./Footer";

interface ProjectData {
  id: number;
  email: string;
  name: string;
  projectTitle: string;
  projectDescription: string;
  sponsor: string;
  teamMemberNames: string;
  numberOfTeamMembers: number;
  major: string;
  demo: number;
  power: number;
  nda: number;
  youtubeLink: string;
  teamPicturePath: string;
  posterPicturePath: string;
}

export function SurveyDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { getSelectedSemester } = useMenuContext();

  const STATIC_BASE_URL =
    import.meta.env.PROD ? "" : "http://localhost:3000";

  const API_BASE_URL =
    import.meta.env.PROD
      ? "/api"
      : "http://localhost:3000/api";

  // project may come from location.state
  const [project, setProject] = useState<ProjectData | null>(
    (state && (state as { project?: ProjectData }).project) || null
  );
  console.log("SurveyDetails project:", project);

  // teamMemberNames may use commas or newlines — we'll normalize when building `teamMembers` in effect
  // team member names and final resolved photo URLs
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [teamMemberPhotos, setTeamMemberPhotos] = useState<string[]>([]);

  const normalizePathToUrl = (path: string) => {
    if (!path) return "";
    const trimmed = path.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `${STATIC_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  };

  // Fetch project if not provided via state
  useEffect(() => {
    if (project) return;

    let canceled = false;
    fetch(`${API_BASE_URL}/single_survey/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data: ProjectData) => {
        if (!canceled) setProject(data);
      })
      .catch((err) => {
        console.error("fetch project error:", err);
      });

    return () => {
      canceled = true;
    };
  }, [API_BASE_URL, id, project]);

  useEffect(() => {
    if (!project) return;

    // names — accept commas and newlines as separators
    const names = project.teamMemberNames
      ? project.teamMemberNames
          .split(/[,\n\r]+/) // split on commas or newlines (CR/LF)
          .map((n) => n.trim())
          .filter(Boolean)
      : [];
    setTeamMembers(names);

    // paths -> URLs
    const rawPaths = project.teamPicturePath
      ? project.teamPicturePath
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const checkImage = async (path: string) => {
      if (!path) return Missing_photo;
      const url = normalizePathToUrl(path);
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok) return url;
        return Missing_photo;
      } catch (e) {
        return Missing_photo;
      }
    };

    (async () => {
      // Validate all provided image paths
      const validatedRaw: string[] = [];
      for (const path of rawPaths) {
          const result = await checkImage(path);
          validatedRaw.push(result);
      }

      // Keep only actually valid images (not Missing_photo)
      const validImages = validatedRaw.filter((url) => url !== Missing_photo);

      // CASE 1: No images submitted OR all invalid -> placeholders per team member
      if (rawPaths.length === 0 || validImages.length === 0) {
        const placeholders = names.map(() => Missing_photo);
        setTeamMemberPhotos(placeholders);
        return;
      }

      // CASE 2: Exactly ONE valid image -> show only that image (group photo)
      if (validImages.length === 1) {
        setTeamMemberPhotos(validImages); 
        return;
      }

      // CASE 3: More than one valid image
      // If fewer images than team members -> pad with placeholders
      if (names.length > 0 && validImages.length < names.length) {
        const withPlaceholders = [...validImages];
        while (withPlaceholders.length < names.length) {
          withPlaceholders.push(Missing_photo);
        }
        setTeamMemberPhotos(withPlaceholders);
        return;
      }

      // CASE 4: Images >= team members -> just show all valid images for now
      setTeamMemberPhotos(validImages);
    })();
  }, [project]);

  // Helpers (YouTube / semester / badges)
  const extractYouTubeId = (url: string) => {
    if (!url) return "";
    // try common patterns: v=VIDEOID, youtu.be/VIDEOID, /embed/VIDEOID
    const patterns = [
      /[?&]v=([0-9A-Za-z_-]{11})/, // watch?v=
      /youtu\.be\/([0-9A-Za-z_-]{11})/, // youtu.be/
      /embed\/([0-9A-Za-z_-]{11})/, // /embed/
      /\/v\/([0-9A-Za-z_-]{11})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m && m[1]) return m[1];
    }
    // fallback: last path segment (may include query params)
    const last = url.split("/").pop() || "";
    return last.split("?")[0].split("&")[0];
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const id = extractYouTubeId(url);
    if (!id) return "";
    return `https://www.youtube.com/embed/${id}`;
  };

  const formatSelectedSemester = () => {
    const selectedSemester = getSelectedSemester();
    let semester = selectedSemester ? selectedSemester.split("-")[0] : null;
    let year = selectedSemester ? selectedSemester.split("-")[1] : null;
    if (semester === "sp") return `Spring ${year}`;
    if (semester === "fa") return `Fall ${year}`;
    return "Semester Not Set";
  };

  if (!project) {
    return (
      <div className="survey-details-error">
        <p>Loading project...</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="survey-details-container">
      <div className="survey-details-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Back to Projects
        </button>
      </div>

      <div className="survey-title-div">
        <div className="project-badges">
          <span className={`requirement-badge`}>
            <Calendar size={16} />
            {formatSelectedSemester()}
          </span>
        </div>
        <p className="survey-project-title">{project.projectTitle}</p>
      </div>

      <div className="project-description-section">
        <h3>Project Description</h3>
        <p className="project-description-text">{project.projectDescription}</p>
      </div>

      <div className="video-team-members-posters">
        <span className="video-team-members">
          {project.youtubeLink && (() => {
            const embedUrl = getYouTubeEmbedUrl(project.youtubeLink);
            const id = extractYouTubeId(project.youtubeLink);
            const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
            console.log("YouTube embedUrl:", embedUrl);

            if (embedUrl) {
              return (
                <div className="video-container">
                  <iframe
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                  />
                </div>
              );
            }

            // fallback: show clickable thumbnail that opens the YouTube page
            return (
              <div className="video-container">
                {thumb ? (
                  <a href={project.youtubeLink} target="_blank" rel="noreferrer">
                    <img src={thumb} alt="YouTube thumbnail" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 8 }} />
                  </a>
                ) : (
                  <a href={project.youtubeLink} target="_blank" rel="noreferrer">Watch on YouTube</a>
                )}
              </div>
            );
          })()}

          {project.teamMemberNames && (
            <div className="team-members-section">
              <h3>Team Members</h3>
              
              {teamMemberPhotos.length > 0 && (
                <div
                  className={
                    teamMemberPhotos.length === 1
                      ? "team-photos-grid single-photo-grid"
                      : "team-photos-grid"
                  }
                >
                  {teamMemberPhotos.map((photoUrl, i) => (
                    <div
                      key={i}
                      className={
                        teamMemberPhotos.length === 1
                          ? "team-photo-wrapper single-photo-wrapper"
                          : "team-photo-wrapper"
                      }
                    >
                      <img
                        src={photoUrl}
                        alt={teamMembers[i] ? `${teamMembers[i]}'s photo` : "Team photo"}
                        className="team-members-img"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="team-members-list">
                {teamMembers.map((name, i) => (
                  <span key={i} className="member-tag-names">
                    <p>{name}</p>
                  </span>
                ))}
              </div>
            </div>
          )}
          <span className="extra-details-survey">
            {project.sponsor && (
              <span className="detail-item-survey">
                <p>
                  <Building size={16} /> Project Sponsor
                </p>

                <p>{project.sponsor}</p>
              </span>
            )}

            {project.name && (
              <span className="detail-item-survey">
                <p>
                  <User size={16} />
                  Project Name
                </p>
                <p>{project.name}</p>
              </span>
            )}
            {project.email && (
              <span className="detail-item-survey">
                <p>
                  <Mail size={16} /> Contact Email
                </p>
                <p>{project.email}</p>
              </span>
            )}
          </span>
        </span>
        <span className="posters-in-survey-details">
          {project.posterPicturePath ? (
            <img
              src={normalizePathToUrl(project.posterPicturePath)}
              alt="Project Poster"
              className="poster-in-survey-details-img"
            />
          ) : (
            <div className="no-poster-found-div">
              <div className="no-poster-text">
                <p className="no-poster-title">No poster available</p>
                <p className="no-poster-sub">
                  This project did not submit a poster.
                </p>
              </div>
            </div>
          )}
        </span>
      </div>

      <div className="asu-branding">
        <img
          src="https://innovationshowcase.engineering.asu.edu/wp-content/themes/pitchfork/src/endorsed-logos/asu_fultonengineering_white.png"
          alt="ASU Fulton Engineering"
          className="asu-logo"
        />
      </div>

      <Footer />
    </div>
  );
}

export default SurveyDetails;
