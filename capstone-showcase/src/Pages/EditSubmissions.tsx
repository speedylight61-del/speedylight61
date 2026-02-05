import React, { useState, useEffect } from "react";
import axios from "axios";
import { MultipleImageUploader } from "../MultipleImageUploader";
import "../CSS/EditSubmissions.css";

interface Submission {
  id: number;
  email: string;
  name: string;
  projectTitle: string;
  projectDescription: string;
  sponsor: string;
  numberOfTeamMembers: number;
  teamMemberNames: string;
  major: string;
  demo: boolean;
  power: boolean;
  nda: boolean;
  youtubeLink: string;
  teamPicturePath: string;
  posterPicturePath: string;
  pos: string | number;
  winning_pic: string | null;
}

const EditSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedSubmission, setUpdatedSubmission] = useState<Partial<Submission>>({
    email: "",
    name: "",
    projectTitle: "",
    projectDescription: "",
    sponsor: "",
    numberOfTeamMembers: 0,
    teamMemberNames: "",
    major: "",
    demo: false,
    power: false,
    nda: false,
    youtubeLink: "",
    teamPicturePath: "",
    posterPicturePath: "",
    pos: "",
    winning_pic: null,
  });

  // Fetch submissions from the backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "https://asucapstone.com:3000/api/admin/submissions"
        );
        //const response = await axios.get('http://localhost:3000/api/admin/submissions'); // Ensure this matches your server URL
        console.log("Fetched submissions:", response.data); // Debug: Log the fetched data
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error); // Debug: Log errors
      }
    };

    fetchSubmissions();
  }, []);

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    if (updatedSubmission) {
      setUpdatedSubmission({ ...updatedSubmission, [field]: e.target.value });
    }
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Submission
  ) => {
    if (updatedSubmission) {
      setUpdatedSubmission({ ...updatedSubmission, [field]: e.target.checked });
    }
  };

  // Save changes
  const [, setSuccessMessage] = useState("");

  const handleSave = async (id: number) => {
    try {
      // Ensure updatedSubmission is being passed correctly
      console.log("Saving updated data:", updatedSubmission);

      // Send the updated data to the backend
      await axios.put(
        `https://asucapstone.com/api/admin/submissions/${id}`,
        updatedSubmission
      );
      //await axios.put(`http://localhost:3000/api/admin/submissions/${id}`, updatedSubmission);

      // After successful save, show success message
      setSuccessMessage("Change successful!");

      // Optionally, refresh the data after save to update the list of submissions
      const response = await axios.get(
        "https://asucapstone.com:3000/api/admin/submissions"
      );
      //const response = await axios.get('http://localhost:3000/api/admin/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  // Cancel editing
  const initialSubmissionState = {
    email: "",
    name: "",
    projectTitle: "",
    projectDescription: "",
    sponsor: "",
    numberOfTeamMembers: 0,
    teamMemberNames: "",
    major: "",
    demo: false,
    power: false,
    nda: false,
    youtubeLink: "",
    teamPicturePath: "",
    posterPicturePath: "",
    pos: "",
    winning_pic: null,
  };

  const handleCancel = () => {
    setEditingId(null);
    setUpdatedSubmission(initialSubmissionState); // Reset to initial state
  };

  return (
    <div className="edit-submissions-container">
      <h2>Edit Student Capstone Submissions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Project Title</th>
            <th>Major</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              {editingId === submission.id ? (
                <>
                  <td>{submission.id}</td>
                  <td>
                    <input
                      type="text"
                      value={updatedSubmission?.name || submission.name}
                      onChange={(e) => handleChange(e, "name")}
                      placeholder="Student Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        updatedSubmission?.projectTitle ||
                        submission.projectTitle
                      }
                      onChange={(e) => handleChange(e, "projectTitle")}
                      placeholder="Project Title"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedSubmission?.major || submission.major}
                      onChange={(e) => handleChange(e, "major")}
                      placeholder="Major"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(submission.id)}>
                      Save
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{submission.id}</td>
                  <td>{submission.name}</td>
                  <td>{submission.projectTitle}</td>
                  <td>{submission.major}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingId(submission.id);
                        setUpdatedSubmission(submission);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expanded form fields */}
      {editingId !== null && updatedSubmission && (
        <div className="form-container">
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={updatedSubmission.email}
              onChange={(e) => handleChange(e, "email")}
              placeholder="Email"
            />
          </div>

          <div className="form-field">
            <label>Project Description:</label>
            <textarea
              value={updatedSubmission.projectDescription}
              onChange={(e) => handleChange(e, "projectDescription")}
              placeholder="Project Description"
            />
          </div>

          <div className="form-field">
            <label>Sponsor:</label>
            <input
              type="text"
              value={updatedSubmission.sponsor}
              onChange={(e) => handleChange(e, "sponsor")}
              placeholder="Sponsor"
            />
          </div>

          <div className="form-field">
            <label>Team Member Names:</label>
            <input
              type="text"
              value={updatedSubmission.teamMemberNames}
              onChange={(e) => handleChange(e, "teamMemberNames")}
              placeholder="Team Member Names"
            />
          </div>

          <div className="form-field">
            <label>Team Size:</label>
            <input
              type="number"
              value={updatedSubmission.numberOfTeamMembers}
              onChange={(e) => handleChange(e, "numberOfTeamMembers")}
              placeholder="Number of Team Members"
            />
          </div>

          <div className="form-field">
            <label>Demo Available:</label>
            <input
              type="checkbox"
              checked={updatedSubmission.demo}
              onChange={(e) => handleCheckboxChange(e, "demo")}
            />
          </div>

          <div className="form-field">
            <label>Power available:</label>
            <input
              type="checkbox"
              checked={updatedSubmission.power}
              onChange={(e) => handleCheckboxChange(e, "power")}
            />
          </div>

          <div className="form-field">
            <label>NDA Required:</label>
            <input
              type="checkbox"
              checked={updatedSubmission.nda}
              onChange={(e) => handleCheckboxChange(e, "nda")}
            />
          </div>

          <div className="form-field">
            <label>YouTube Link:</label>
            <input
              type="text"
              value={updatedSubmission.youtubeLink}
              onChange={(e) => handleChange(e, "youtubeLink")}
              placeholder="YouTube Link"
            />
          </div>
          <div className="poster-in-edit-submission">
            {
              updatedSubmission.posterPicturePath ? (
                <img
                  src={updatedSubmission.posterPicturePath}
                  alt="Poster"
                />
              ) : (
                <MultipleImageUploader  
                  onImageUpload={(images) => {
                    if (images.length > 0) {
                      const posterPath = URL.createObjectURL(images[0]);
                      setUpdatedSubmission({
                        ...updatedSubmission,
                        posterPicturePath: posterPath,
                      });
                    }
                }}
              />
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubmissions;
