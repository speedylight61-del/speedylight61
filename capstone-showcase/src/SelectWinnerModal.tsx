import "./CSS/SelectModalWinner.css";
import { ProjectObj } from "./SiteInterface";
import { useState } from "react";
import MultipleImageUploader from "./MultipleImageUploader"; // Import the component

export function SelectWinnerModal({
  project,
  setSelectionMade,
  handleSelectionClose,
}: {
  project: ProjectObj;
  setSelectionMade: (project: ProjectObj, position: number, imgs: File[]) => void;
  handleSelectionClose: () => void;
}) {
   const[wimgs, setWimgs] = useState<File[]>([]);
   const[pos, setPos] = useState<number>();
  const saveWinner = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('here is the positin ', pos);
    if (!pos) {
      alert("Please select a position for the winner.");
      return;
    }
   setSelectionMade(project, pos || 0, wimgs);
    handleSelectionClose();
  };

  const updateImages = (images: File[]) => {
    setWimgs(images);
    console.log("Updated images:", images);
  };

  return (
    <div className="edit-project-container">
      <button onClick={handleSelectionClose} className="edit-close-btn">
        &times;
      </button>
      <h2>Set Project Winner</h2>
      <form className="modal-winner-form" onSubmit={saveWinner}>
        <section>
          <h3>Project Title: </h3>
          <p>{project.projectTitle}</p>
          <h3>Project Description</h3>
          <p>{project.projectDescription}</p>
          <h3>Project sponsor: </h3>
          <p>{project.sponsor}</p>
          <h3>Project Members</h3>
          <p>{project.teamMemberNames}</p>
          <section>
            <label htmlFor="position">Select Position:</label>
            <select
              name="position"
              id="position"
              onChange={(e) =>{
                console.log('selected value ', (e.target as HTMLSelectElement).value),
                setPos(Number((e.target as HTMLSelectElement).value))
              }
            }
            >
              <option value="">--Select Position--</option>
              <option value="1">1st Place</option>
              <option value="2">2nd Place</option>
              <option value="3">3rd Place</option>
            </select>
          </section>
        </section>
        {/* Integrate the MultipleImageUploader component */}
        <MultipleImageUploader onImageUpload={updateImages} img={wimgs} />
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}
