import "./CSS/EditProject.css";
import { useEffect, useMemo, useState } from "react";
import { ProjectObj } from "./SiteInterface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function EditProject({
  project,
  closeFunc,
}: {
  project: ProjectObj;
  closeFunc: (changeMap?: Map<string, string> | null) => void;
}) {
  const { isSignedIn, isTokenValid, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isSignedIn || !isTokenValid()) {
      navigate("/admin");
    }
  }, [isSignedIn, isTokenValid, navigate]);

  // Helpers
  const splitList = (value?: string | null) =>
    value
      ? value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Initialize arrays once per project (prevents weird stale state if project changes)
  const initialMembers = useMemo(
    () => splitList(project.teamMemberNames),
    [project.teamMemberNames]
  );
  const initialMajors = useMemo(
    () => splitList(project.teamMemberMajors),
    [project.teamMemberMajors]
  );
  const initialPhotos = useMemo(
    () => splitList(project.teamMemberPhotos),
    [project.teamMemberPhotos]
  );

  const [members, setMembers] = useState<string[]>(initialMembers);
  const [majors, setMajors] = useState<string[]>(initialMajors);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);

  // If the user opens Edit on a different project without a full remount, sync state
  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);
  useEffect(() => {
    setMajors(initialMajors);
  }, [initialMajors]);
  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const [changeMap, setChangeMap] = useState<Map<string, string>>(new Map());

  const updateChangeMap = (key: string, value: string) => {
    setChangeMap((prev) => {
      const newMap = new Map(prev);
      const originalValue = project[key as keyof ProjectObj];

      // Normalize original value to string for comparison
      const originalString =
        originalValue === null || originalValue === undefined
          ? ""
          : String(originalValue);

      if (value !== originalString) {
        newMap.set(key, value);
      } else {
        newMap.delete(key);
      }

      return newMap;
    });
  };

  const addMember = () => {
    setMembers((prev) => [...prev, ""]);
    setMajors((prev) => [...prev, ""]);
    setPhotos((prev) => [...prev, ""]);

    // Mark as changed so backend sees it even before typing
    updateChangeMap("teamMemberNames", [...members, ""].join(", "));
    updateChangeMap("teamMemberMajors", [...majors, ""].join(", "));
    updateChangeMap("teamMemberPhotos", [...photos, ""].join(", "));
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
    updateChangeMap("teamMemberNames", newMembers.join(", "));
  };

  const updateMajor = (index: number, value: string) => {
    const newMajors = [...majors];
    newMajors[index] = value;
    setMajors(newMajors);
    updateChangeMap("teamMemberMajors", newMajors.join(", "));
  };

  const updatePhoto = (index: number, value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
    updateChangeMap("teamMemberPhotos", newPhotos.join(", "));
  };

  const removeMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    const newMajors = majors.filter((_, i) => i !== index);
    const newPhotos = photos.filter((_, i) => i !== index);

    setMembers(newMembers);
    setMajors(newMajors);
    setPhotos(newPhotos);

    updateChangeMap("teamMemberNames", newMembers.join(", "));
    updateChangeMap("teamMemberMajors", newMajors.join(", "));
    updateChangeMap("teamMemberPhotos", newPhotos.join(", "));
  };

  const handleCloseEvent = (changes?: Map<string, string>) => {
    if (changeMap.size > 0) {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!ok) return;
    }
    closeFunc(changes || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (changeMap.size === 0) {
      closeFunc();
      return;
    }

    const API_BASE_URL =
      import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/${project.id}/update`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...Object.fromEntries(changeMap) }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Failed to update project.");
      closeFunc();
      return;
    }

    alert("Project updated successfully!");
    const updatedChangeMap = new Map(changeMap);
    updatedChangeMap.set("EntryId", project.id.toString());
    closeFunc(updatedChangeMap);
  };

  return (
    <div className="edit-project-container">
      <button
        onClick={() => handleCloseEvent(changeMap)}
        className="edit-close-btn"
        type="button"
      >
        &times;
      </button>

      <h2>Edit Project</h2>

      <form className="edit-project-form" onSubmit={handleSubmit}>
        <section>
          <label htmlFor="project-title">Project Title:</label>
          <input
            type="text"
            id="project-title"
            name="project-title"
            defaultValue={project.projectTitle}
            onChange={(e) => updateChangeMap("projectTitle", e.target.value)}
          />
        </section>

        <section>
          <label htmlFor="project-description">Project Description:</label>
          <textarea
            id="project-description"
            name="project-description"
            defaultValue={project.projectDescription}
            onChange={(e) =>
              updateChangeMap("projectDescription", e.target.value)
            }
          />
        </section>

        <section>
          <label htmlFor="sponsor">Sponsor:</label>
          <input
            type="text"
            id="sponsor"
            name="sponsor"
            defaultValue={project.sponsor}
            onChange={(e) => updateChangeMap("sponsor", e.target.value)}
          />
        </section>

        <section>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={project.email}
            onChange={(e) => updateChangeMap("email", e.target.value)}
          />
        </section>

        <section>
          <label htmlFor="course-number">Major:</label>
          <input
            type="text"
            id="course-number"
            name="course-number"
            defaultValue={project.major}
            onChange={(e) => updateChangeMap("major", e.target.value)}
          />
        </section>

        <section>
          <label>Members:</label>
          <div className="members-list">
            {members.map((member, index) => (
              <div key={index} className="member-input-group">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(index, e.target.value)}
                  placeholder="Enter member name"
                />

                <input
                  type="text"
                  value={majors[index] ?? ""}
                  onChange={(e) => updateMajor(index, e.target.value)}
                  placeholder="Enter member major"
                />

                <input
                  type="text"
                  value={photos[index] ?? ""}
                  onChange={(e) => updatePhoto(index, e.target.value)}
                  placeholder="Enter member photo URL"
                />

                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="remove-member-btn"
                  aria-label="Remove member"
                >
                  ×
                </button>
              </div>
            ))}

            <button type="button" onClick={addMember} className="add-member-btn">
              + Add Member
            </button>
          </div>
        </section>

        <section>
          <label htmlFor="video-link">Video Link:</label>
          <input
            type="url"
            id="video-link"
            name="video-link"
            defaultValue={project.youtubeLink}
            onChange={(e) => updateChangeMap("youtubeLink", e.target.value)}
          />
        </section>

        <section className="form-buttons">
          <button type="submit" className="save-btn">
            <span style={{ color: "gold", fontWeight: "bold", padding: "0.5rem" }}>
              {changeMap.size}
            </span>
            Save Changes
          </button>

          <span>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => handleCloseEvent(changeMap)}
            >
              Cancel
            </button>
          </span>
        </section>
      </form>
    </div>
  );
}

