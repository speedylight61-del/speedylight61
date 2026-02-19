import "./CSS/EditProject.css";
import { useEffect, useState } from "react";
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
  const initialMembers = project.teamMemberNames
    ? project.teamMemberNames.split(", ")
    : [];
  const [members, setMembers] = useState(initialMembers);

  const initialMajors = project.teamMemberMajors
    ? project.teamMemberMajors.split(", ")
    : [];
  const [majors, setMajors] = useState(initialMajors);

  const initialPhotos = project.teamMemberPhotos
    ? project.teamMemberPhotos.split(", ")
    : [];
  const [photos, setPhotos] = useState(initialPhotos);

  const [changeMap, setChangeMap] = useState<Map<string, string>>(new Map());
  const { isSignedIn, isTokenValid, token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn || !isTokenValid()) {
      navigate("/admin");
    }
  }, [isSignedIn, isTokenValid, navigate, token]);
  const updateChangeMap = (key: string, value: string) => {
    setChangeMap((prev) => {
      const newMap = new Map(prev);
      const originalValue = project[key as keyof ProjectObj];

      if (value !== originalValue) {
        newMap.set(key, value);
      } else {
        newMap.delete(key);
      }
      console.log("ChangeMap Updated:", Array.from(newMap.entries()));

      return newMap;
    });
  };

  const addMember = () => {
    setMembers([...members, ""]);
    setMajors([...majors, ""]);
    setPhotos([...photos, ""]);
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
    setMembers(newMembers);
    updateChangeMap("teamMemberNames", newMembers.join(", "));

    const newMajors = majors.filter((_, i) => i !== index);
    setMajors(newMajors);
    updateChangeMap("teamMemberMajors", newMajors.join(", "));

    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    updateChangeMap("teamMemberPhotos", newPhotos.join(", "));
  };

  const handleCloseEvent = (changes?: Map<string, string>) => {
    if (changeMap.size > 0) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      )
        return;
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

    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${API_BASE_URL}/${project.id}/update`, {
      method: "PUT",
      headers: header,
      body: JSON.stringify({ ...Object.fromEntries(changeMap) }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      alert(data.error || "Failed to update project.");
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
      >
        &times;
      </button>
      <h2>Edit Project</h2>
      <form className="edit-project-form" onSubmit={(e) => handleSubmit(e)}>
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
          <label>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={project.email}
            onChange={(e) => updateChangeMap("email", e.target.value)}
          />
        </section>

        <section>
          <label>Major:</label>
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
                  value={majors[index] || ""}
                  onChange={(e) => updateMajor(index, e.target.value)}
                  placeholder="Enter member major"
                />

                <input
                  type="text"
                  value={photos[index] || ""}
                  onChange={(e) => updatePhoto(index, e.target.value)}
                  placeholder="Enter member photo URL"
                />

                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="remove-member-btn"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="add-member-btn"
            >
              + Add Member
            </button>
          </div>
        </section>

        <section>
          <label>Video Link:</label>
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
            <span
              style={{ color: "gold", fontWeight: "bold", padding: "0.5rem" }}
            >
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
