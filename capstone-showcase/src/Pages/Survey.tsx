import React, { useEffect,useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import "../CSS/Survey.css";

declare global {
  interface Window {
    grecaptcha: any;
  }
}



interface FormData {
  email: string;
  name: string;
  projectTitle: string;
  projectDescription: string;
  sponsor: string;
  numberOfTeamMembers: string;
  teamMemberNames: string;
  major: string;
  demo: string;
  power ? : string;
  nda: string;
  posterApproved ?: string;
  attendance: string;
  zoomLink ?: string;
  youtubeLink ?: string;
  teamPicturePath ?:string;
  posterPicturePath ?: string;
}

interface FormErrors {
  email: string;
  name: string;
  projectTitle: string;
  projectDescription: string;
  sponsor: string;
  numberOfTeamMembers: string;
  teamMemberNames: string;
  major: string;
  demo: string;
  power: string;
  nda: string;
  posterApproved: string;
  attendance: string;
  zoomLink ?: string;
  youtubeLink: string;
  teamPicturePath ?: string;
  posterPicturePath ?: string;
}

interface Project {
  project_id: string;
  project_title: string;
}
const Survey: React.FC = () => {

    const initialFormData: FormData = {
        email: "",
        name: "",
        projectTitle: "",
        projectDescription: "",
        sponsor: "",
        numberOfTeamMembers: "",
        teamMemberNames: "",
        major: "",
        demo: "",
        power: "",
        nda: "",
        posterApproved: "",
        attendance: "",
        zoomLink: "",
        youtubeLink: "",
        teamPicturePath: "",
        posterPicturePath: "",
    };
    const initialFormErrors: FormErrors = {
        email: "",
        name: "",
        projectTitle: "",
        projectDescription: "",
        sponsor: "",
        numberOfTeamMembers: "",
        teamMemberNames: "",
        major: "",
        demo: "",
        power: "",
        nda: "",
        posterApproved: "",
        attendance: "",
        zoomLink: "",
        youtubeLink: "",
        teamPicturePath: "",
        posterPicturePath: "",
    };
    const [formData, setFormData] = useState < FormData > (initialFormData);
    const [errors, setErrors] = useState < FormErrors > (initialFormErrors);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState < File | undefined > ();
    const [projects, setProjects] = useState < Project[] > ([]);
    const [, setSelectedProject] = useState < string > ('');
    const [contentTeamFiles, setContentTeamFiles] = useState<File[]>([]);
    const [recaptchaToken, setRecaptchaToken] = useState<string>("");
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const recaptchaWidgetId = useRef<number | null>(null);

    const navigate = useNavigate();

    const API_BASE_URL =
      import.meta.env.PROD
        ? "/api" // Relative URL - will use https://showcase.asucapstone.com/api
        : "http://localhost:3000/api";
    
    useEffect(() => {
        // Fetch the list of projects from the backend API
        fetch(`${API_BASE_URL}/projects`)
        // fetch('http://localhost:3000/api/projects')
        .then((response) => 
            response.json()).then((data) =>
            setProjects(data)).catch((error) => 
            console.error('Error fetching projects:', error));
    }, []);

    // Load reCAPTCHA script
    useEffect(() => {
        const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeRpgcsAAAAAIV7UOuvWeJfQTUlzizmRKhMWn3J";
        
        console.log('Initializing reCAPTCHA...', { siteKey: siteKey ? 'present' : 'missing'});

        if (!siteKey) {
            console.error('reCAPTCHA site key is not available');
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        let cleanupDone = false;

        const renderRecaptcha = () => {
            if (cleanupDone) return;

            if (recaptchaWidgetId.current !== null) {
                console.log('reCAPTCHA already rendered, skipping');
                return;
            }

            if (!recaptchaRef.current) {
                console.warn('reCAPTCHA ref not available, retrying...');
                setTimeout(renderRecaptcha, 100);
                return;
            }

            if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') {
                console.warn('grecaptcha not loaded yet, retrying...');
                setTimeout(renderRecaptcha, 100);
                return;
            }

            try {
                if (recaptchaRef.current) {
                  recaptchaRef.current.innerHTML = '';
                }

                recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                    sitekey: siteKey,
                    callback: (token: string) => {
                        setRecaptchaToken(token);
                    },
                    'expired-callback': () => {
                        console.log('reCAPTCHA token expired');
                        setRecaptchaToken("");
                    },
                    'error-callback': () => {
                        console.error('reCAPTCHA error');
                        setRecaptchaToken("");
                    }
                });
                console.log('reCAPTCHA widget rendered successfully, ID:', recaptchaWidgetId.current);
            } catch (error) {
                console.error('Error rendering reCAPTCHA:', error);
                if (!cleanupDone) {
                  setTimeout(renderRecaptcha, 500);
                }
            }
        };

        const loadScript = () => {
            const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
            if (existingScript) {
                console.log('reCAPTCHA script already exists');
                if (window.grecaptcha?.render) {
                    setTimeout(renderRecaptcha, 300);
                } else {
                    const handleLoad = () => {
                        console.log('Existing reCAPTCHA script loaded');
                        setTimeout(renderRecaptcha, 300);
                    };
                    existingScript.addEventListener('load', handleLoad, { once: true });
                }
                return;
            }

            console.log('Loading reCAPTCHA script...');
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('reCAPTCHA script loaded');
                setTimeout(renderRecaptcha, 300);
            };
            script.onerror = (error) => {
                console.error('Failed to load reCAPTCHA script:', error);
            };
            document.head.appendChild(script);
        };

        const timeoutID = setTimeout(() => {
          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', loadScript, { once: true });
          } else {
              loadScript();
          }
        }, 200);

        return () => {
        cleanupDone = true;
        clearTimeout(timeoutID);
        
        if (recaptchaWidgetId.current !== null && window.grecaptcha?.reset) {
            try {
                window.grecaptcha.reset(recaptchaWidgetId.current);
                recaptchaWidgetId.current = null;
            } catch (error) {
                console.error('Error resetting reCAPTCHA:', error);
            }
        }
    };
}, []);


    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
    
      if (type === "file") {
        const fileInput = e.target as HTMLInputElement & { files: FileList };
    
        // Handling different file inputs based on 'name'
        if (name === "poster" && fileInput.files.length > 0) {
          // Handling single file input for poster
          setSelectedFile(fileInput.files[0]);
          console.log(`Poster file selected: ${fileInput.files[0].name}`);
        } else if (name === "contentTeam" && fileInput.files.length > 0) {
          // Handling multiple file input for team photos
          const selectedFiles = Array.from(fileInput.files);
          setContentTeamFiles((prevFiles) => {
            const existingNames = new Set(prevFiles.map(f => f.name));
            const newFiles = selectedFiles.filter(f => !existingNames.has(f.name));
            return [...prevFiles, ...newFiles];
          });
          console.log("Team headshots selected:", selectedFiles.map(file => file.name));
        }
      } else {
        // Handling non-file inputs
        setFormData({ ...formData, [name]: value });
    
        if (name === "demo" && value === "no") {
          setFormData((prevFormData) => ({ ...prevFormData, power: "" }));
        }
    
        const selectedProjectId = e.target.value;
        const project = projects.find((project) => project.project_id === selectedProjectId);
        
        if (project) {
          const fullProjectName = `${project.project_id} - ${project.project_title}`;
          setSelectedProject(fullProjectName);
        }
      }
    
      // Clear error for this field
      setErrors({ ...errors, [name]: "" });
      console.log(`Field: ${name}, Value: ${value}`);
    };

    const [submitting, setSubmitting] = useState(false);
      
    const handleSubmit = async (e: React.FormEvent) => {
      
      e.preventDefault();

      if (submitting) return;                   // disable submission if one is already in progress
      
      console.log("[Client] Submit started");

      setSubmitting(true);
    

      console.log("Calling API");
      
      try {

        const formErrors = validateFormData(formData);
        setErrors(formErrors);
        if (hasErrors(formErrors)) {
          scrollToFirstError();
          throw new Error("__VALIDATION_ERROR__");
          //return;
          }

        // Check if reCAPTCHA is completed
        if (!recaptchaToken) {
          alert("Please complete the reCAPTCHA verification.");
          if (recaptchaRef.current) {
            recaptchaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          throw new Error("__RECAPTCHA_MISSING__");
          //return;
        }



        console.log("here1")
        let posterPath = "";
        let teamImagePaths: string[] = [];
    
       
        if (selectedFile) {
          const posterData = new FormData();
          posterData.append("poster", selectedFile);
          console.log("[Client] Selected poster file:", selectedFile);
          // const posterRes = await axios.post("http://localhost:3000/api/survey/uploadsPoster", posterData, {
           const posterRes = await axios.post(`${API_BASE_URL}/survey/uploadsPoster`, posterData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
    
          posterPath = posterRes.data.path;
        }
    
        
        if (contentTeamFiles.length > 0) {
          const teamData = new FormData();
          contentTeamFiles.forEach(file => {
            teamData.append("contentTeamFiles", file); 
          });
          
          // const teamRes = await axios.post("http://localhost:3000/api/survey/uploadsTeam", teamData, {
           const teamRes = await axios.post(`${API_BASE_URL}/survey/uploadsTeam`, teamData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
    
          teamImagePaths = teamRes.data.paths;
        }
    
        
        const updatedFormData = {
          ...formData,
          posterPicturePath: posterPath,
          teamPicturePath: teamImagePaths.join(", "), 
        };
    
        const submissionData: any = {
          ...prepareSubmissionData(updatedFormData),
        };
        
        if (recaptchaToken) {
          submissionData.recaptchaToken = recaptchaToken;
        }

        console.log("[Client] FINAL PAYLOAD being sent to /api/survey:", submissionData);
        // Final survey data submission
        // await axios.post("http://localhost:3000/api/survey", submissionData);
         await axios.post(`${API_BASE_URL}/survey`, submissionData);

         console.log("[Client] Submission success!");
    
        handleSuccessfulSubmission();
      } catch (error: any) {
        console.error("Error during form submission:", error);
        
        if (error.message === "__VALIDATION_ERROR__") return;  // controlled exit for validation
        if (error.message === "__RECAPTCHA_MISSING__") return; // controlled exit for missing captcha
        
        if (error.response?.data?.error) {
          if (error.response.data.error.includes("reCAPTCHA")) {
            alert("reCAPTCHA verification failed. Please try again.");
            if (recaptchaWidgetId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
              window.grecaptcha.reset(recaptchaWidgetId.current);
            }
            setRecaptchaToken("");
          } else {
            alert(error.response.data.error);
          }
        } else {
          alert("An error occurred while submitting. Please try again.");
        }
      } finally {
        setSubmitting(false);   // allow submissions if the current one is done
      }
    };
    const prepareSubmissionData = (formData: FormData) => {
        const submissionData = {
            ...formData
        };
        if (formData.demo === "no") {
            delete submissionData.power;
        }
        return submissionData;
    };
    const validateFormData = (formData: FormData) => {
      const {
        email,
        name,
        projectTitle,
        projectDescription,
        sponsor,
        numberOfTeamMembers,
        teamMemberNames,
        major,
        demo,
        nda,
        attendance,
        posterApproved,
        youtubeLink,
      } = formData;
    
      const errors: FormErrors = {
        email: !email ? "Please enter your ASU email." : "",
        name: !name ? "Please enter your name." : "",
        projectTitle: !projectTitle ? "Please select a project title." : "",
        projectDescription: !projectDescription ? "Please enter a project description." : "",
        sponsor: !sponsor ? "Please enter the name of your sponsor/mentor." : "",
        numberOfTeamMembers: !numberOfTeamMembers ? "Please enter the number of team members." : "",
        teamMemberNames: !teamMemberNames ? "Please enter the full names of all team members, including yourself, separated by commas." : "",
        major: !major ? "Please select a course number." : "",
        demo: !demo ? "Please specify if your group will be bringing a demo." : "",
        power: "",
        nda: !nda ? "Please specify if your group signed an NDA or IP." : "",
        attendance: !attendance ? "Please specify your attendance type." : "",
        posterApproved: nda === "yes" && !posterApproved ? "Please specify if your sponsor approved your poster or not." : "",
        youtubeLink: !youtubeLink ? "Please include the YouTube link of your presentation video." : "",
      };
    
      if (!email.endsWith("@asu.edu")) {
        errors.email = "Please enter your ASU email.";
      }
      if (parseInt(numberOfTeamMembers, 10) <= 0) {
        errors.numberOfTeamMembers = "The number of team members must be at least 1.";
      }
      if (demo === "yes" && !formData.power) {
        errors.power = "Please specify if your group will need power for your demo.";
      }

      if (attendance === "Online" && !formData.zoomLink) {
        errors.zoomLink = "Zoom link is required for online attendance.";
      }
      
    
      const file = selectedFile;
      if (!file) {
        errors.posterPicturePath = "Please upload your poster image.";
      } else if (!["image/png", "image/jpeg"].includes(file.type)) {
        errors.posterPicturePath = "Only PNG or JPEG images are allowed.";
      }
    
      return errors;
    };

    const hasErrors = (errors: FormErrors) => {
      return Object.values(errors).some((error) => error !== "");
    };
  
    const scrollToFirstError = () => {
      const firstErrorElement = document.querySelector(".error-message");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth" });
      }
    };
    const handleSuccessfulSubmission = () => {
        setFormData(initialFormData);
        setSelectedFile(undefined);
        setContentTeamFiles([]);
        setRecaptchaToken("");
        if (recaptchaWidgetId.current !== null && window.grecaptcha) {
            window.grecaptcha.reset(recaptchaWidgetId.current);
        }
        setIsSubmitted(true);
          setTimeout(() => {
           setIsSubmitted(false);
            navigate("/");
          }, 3000);
    };
    const handleCloseSuccessMessage = () => {
        setIsSubmitted(false);
        navigate("/");
    };
    
    return (
    <div className="content-container">
      <div className="form-container">
        {isSubmitted && (
          <div className="success-message">
            <p>Thank you for submitting your survey! Your responses have been recorded successfully.</p>
            <button onClick={handleCloseSuccessMessage} className="ok-button">OK</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h1 className="form-title">Capstone Showcase Information Form</h1>
            <p className="form-description">
              Read all questions and descriptions carefully. If you encounter
              issues with this form that prohibit you from submitting accurate
              information, email{" "}
              <a href="mailto:sdosburn@asu.edu">
                {" "}
                sdosburn@asu.edu{" "}
              </a>
              with a detailed description of the problem.
            </p>
          </div>
          <div className="form-box">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-box">
            <label htmlFor="email">ASU Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-box">
            <label htmlFor="projectTitle">Project:</label>
            <select
              name="projectTitle"
              id="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
            >
              <option value="">Select a project</option>
              {projects && projects.length > 0 && projects.map((project) => {
                const fullName = `${project.project_id} - ${project.project_title}`;
                return (
                  <option key={project.project_id} value={fullName}>
                    {fullName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-box">
            <label htmlFor="projectDescription">
              Project Description (3 sentences max):
            </label>
            <textarea
              name="projectDescription"
              id="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
            />
            {errors.projectDescription && (
              <p className="error-message">{errors.projectDescription}</p>
            )}
          </div>
          <div className="form-box">
            <label htmlFor="sponsor">Sponsor/Mentor:</label>
            <input
              type="text"
              name="sponsor"
              id="sponsor"
              value={formData.sponsor}
              onChange={handleChange}
            />
            {errors.sponsor && <p className="error-message">{errors.sponsor}</p>}
          </div>
          <div className="form-box">
            <label htmlFor="numberOfTeamMembers">Number of Team Members:</label>
            <input
              type="number"
              name="numberOfTeamMembers"
              id="numberOfTeamMembers"
              value={formData.numberOfTeamMembers}
              onChange={handleChange}
            />
            {errors.numberOfTeamMembers && (
              <p className="error-message">{errors.numberOfTeamMembers}</p>
            )}
          </div>
          <div className="form-box">
            <label htmlFor="teamMemberNames">Team Members' Full Names:</label>
            <textarea
              name="teamMemberNames"
              id="teamMemberNames"
              value={formData.teamMemberNames}
              onChange={handleChange}
            />
            {errors.teamMemberNames && (
              <p className="error-message">{errors.teamMemberNames}</p>
            )}
          </div>
          <div className="form-box">
            <label htmlFor="major">Major:</label>
            <select
              name="major"
              id="major"
              value={formData.major}
              onChange={handleChange}
            >
              <option value="">Select a major</option>
              <option value="computer-science">Computer Science</option>
              <option value="computer-systems-engineering">
                Computer Systems Engineering
              </option>
              <option value="biomedical-engineering">
                Biomedical Engineering
              </option>
              <option value="mechanical-engineering">
                Mechanical Engineering
              </option>
              <option value="electrical-engineering">
                Electrical Engineering
              </option>
              <option value="industrial-engineering">
                Industrial Engineering
              </option>
              <option value="informatics">Informatics</option>
              <option value="interdisciplinary">Interdisciplinary</option>
            </select>
            <small>
              * Note: Select Interdisciplinary if your team members are in
              different majors
            </small>
            {errors.major && (
              <p className="error-message">{errors.major}</p>
            )}
          </div>
          <div className="form-box">
      <label htmlFor="attendance">Are you online or in-person?</label>
      <select
        name="attendance"
        id="attendance"
        value={formData.attendance}
        onChange={handleChange}
      >
        <option value="">Select an option</option>
        <option value="online">Online</option>
        <option value="inPerson">In-Person</option>
      </select>
      {errors.attendance && (<p className="error-message">{errors.attendance}</p>)}
    </div>
          <div>
          {formData.attendance === "online" && (
          <div className="form-box">
            <label htmlFor="zoomLink">Zoom link:</label>
            <input
              type="url"
              name="zoomLink"
              id="zoomLink"
              value={formData.zoomLink}
              onChange={handleChange}
              placeholder="https://zoom.us/..."
            />
            {errors.zoomLink && (
              <p className="error-message">{errors.zoomLink}</p>
            )}
          </div>
          )}
          </div>
          
          
          <div className="form-box">
              <label>
                Will your group be bringing a demo in addition to your poster?
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="demo"
                    value="yes"
                    checked={formData.demo === "yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="demo"
                    value="no"
                    checked={formData.demo === "no"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
            </div>
            {errors.demo && <p className="error-message">{errors.demo}</p>}
          </div>
          {formData.demo === "yes" && (
            <div className="form-box">
                <label>If so, will your group need power for your demo?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="power"
                    value="yes"
                    checked={formData.power === "yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="power"
                    value="no"
                    checked={formData.power === "no"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          )}
    <div className="form-box">
      <label>Did your group sign an NDA or IP?</label>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="nda"
            value="yes"
            checked={formData.nda === "yes"}
            onChange={handleChange}
          />{" "}
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="nda"
            value="no"
            checked={formData.nda === "no"}
            onChange={handleChange}
          />{" "}
          No
        </label>
      </div>
      {errors.nda && <p className="error-message">{errors.nda}</p>}
    </div>

    {formData.nda === "yes" && (
      <div className="form-box">
        <label>Was your poster and video approved by the sponsor?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="posterApproved"
              value="yes"
              checked={formData.posterApproved === "yes"}
              onChange={handleChange}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="posterApproved"
              value="no"
              checked={formData.posterApproved === "no"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
        {formData.posterApproved === "no" && (
          <label>Please verify with your sponsor before submitting.</label>
        )}
      </div>
    )}

    <div className="form-box">
      <label htmlFor="youtubeLink">YouTube Video Link:</label>
        <input
          type="url"
          name="youtubeLink"
          id="youtubeLink"
          value={formData.youtubeLink}
          onChange={handleChange}
          className="youtube-input"
        />
      {errors.youtubeLink && (
        <p className="error-message">{errors.youtubeLink}</p>
      )}
    </div>

  <div className="contentPoster">
    <span className="title">Upload Your Poster Image</span>
    <p className="message">Select a file to upload from your computer or device.</p>

    <div className="image-upload">
      <label htmlFor="posterFile" className="button upload-btn">
        Choose File
        <input
          type="file"
          id="posterFile"
          name="poster"
          hidden
          onChange={handleChange}
        />
      </label>
    </div>

    <div className="result">
      {selectedFile ? (
        <div className="file-uploaded"><p>{selectedFile.name}</p></div>
      ) : (
        <div className="file-uploaded"><p>No file selected</p></div>
      )}
    </div>

    {errors.posterPicturePath && (
      <p className="error-message">{errors.posterPicturePath}</p>
    )}
  </div>

  <div className="contentTeam">
    <span className="title">Upload Your Team's Images</span>
    <p className="message">Select files to upload from your computer or device.</p>

    <div className="image-upload">
      <label htmlFor="teamFiles" className="button upload-btn">
        Choose Files
        <input
          type="file"
          id="teamFiles"
          name="contentTeam"
          multiple
          hidden
          onChange={handleChange}
        />
      </label>
    </div>

    <div className="result">
      {contentTeamFiles.length > 0 ? (
        <div className="file-uploaded">
          {contentTeamFiles.map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}
        </div>
      ) : (
        <div className="file-uploaded"><p>No files selected</p></div>
      )}
    </div>

          {errors.teamPicturePath && (
            <p className="error-message">{errors.teamPicturePath}</p>
          )}
        </div>

        <div className="form-box">
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <div 
                  ref={recaptchaRef} 
                  id="recaptcha-container"
                  data-testid="recaptcha-widget"
                  style={{ 
                    display: 'inline-block',
                    margin: '20px auto',
                    minHeight: '78px',
                    minWidth: '304px',
                    backgroundColor: 'transparent',
                    border: '1px dashed #ccc'
                  }}
                ></div>
                  {!recaptchaToken && import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
                    <div style={{ padding: '20px', color: '#666', fontSize: '12px' }}>
                      Loading reCAPTCHA...
                    </div>
                  )}
              </div>
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>

          </form>
        </div>
    </div>


      );
};
export default Survey;