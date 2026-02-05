import { useEffect } from "react";
import { useMenuContext } from "../MenuContext";
import "../CSS/About.css";
import { ourTeamDescription } from "../TextContent";
import asuLogo from "../assets/asuLogo.png";
import teamMember1 from "../assets/jiayuanProfile.png";
import teamMember2 from "../assets/anushHeadshot.jpg";
import teamMember3 from "../assets/naveenProfile.jpg";
import teamMember4 from "../assets/makenzieHeadshot.jpg";
import teamMember5 from "../assets/waleedHeadshot.jpg";
import teamMember6 from "../assets/anshProfile.jpg";
import teamMember7 from "../assets/alexanderProfile.jpg";
import teamMember8 from "../assets/karinaProfile.jpg";
import teamMember9 from "../assets/brianProfile.jpg";
import teamMember10 from "../assets/austinProfile.jpg";
import teamMember11 from "../assets/cameronProfile.jpg";
import teamMember12 from "../assets/kaliProfile.jpg"; 
import teamMember13 from "../assets/achuProfile.jpg"
import teamMember14 from "../assets/leroyProfile.jpg"
import teamMember15 from "../assets/joshProfile.jpg"
import teamMember16 from "../assets/marioProfile.jpg"
import teamMember17 from "../assets/hanselProfile.jpg"
import teamMember18 from "../assets/isabelleProfile.jpg";

import Footer from './Footer';


const teamMembers = [
  {
    image: teamMember1,
    name: "Jiayuan Yu",
    termsActive: "Fall 2024",
    major: "Computer Science (Cybersecurity)",
    email: "jiayuany@asu.edu",
    linkedin: "https://www.linkedin.com/in/jiayuan-yu-77b261262/",
    github: "https://github.com/jy202050",
  },
  {
    image: teamMember2,
    name: "Anush Garimella",
    termsActive: "Summer 2024 - Fall 2024",
    major: "Computer Science",
    email: "anush.garimella@gmail.com",
    linkedin: "https://www.linkedin.com/in/anush-garimella/",
    github: "https://github.com/agarimel",
  },
  {
    image: teamMember3,
    name: "Naveen Ramesh",
    termsActive: "Fall 2024",
    major: "Computer Science",
    email: "naveenramesh987@gmail.com",
    linkedin: "https://www.linkedin.com/in/naveenramesh987/",
    github: "https://github.com/naveenramesh987",
  },
  {
    image: teamMember4,
    name: "Makenzie Rutledge",
    termsActive: "Summer 2024",
    major: "Informatics",
    email: "mmrutled@gmail.com",
    linkedin: "https://www.linkedin.com/in/makenzie-rutledge/",
    github: "https://github.com/mmrutled",
  },
  {
    image: teamMember5,
    name: "Waleed Briouig",
    termsActive: "Summer 2024 - Fall 2024",
    major: "Computer Science (Software Engineering)",
    email: "wbriouig@asu.edu",
    linkedin: "https://www.linkedin.com/in/waleed-briouig-asu/",
    github: "https://github.com/wbriouig",
  },
  {
    image: teamMember6,
    name: "Ansh Tiwari",
    major: "Computer Science",
    email: "atiwar31@asu.edu",
    linkedin: "https://www.linkedin.com/in/ansht99/",
    github: "https://github.com/ansht9",
  },
  {
    image: teamMember7,
    name: "Alexander Trinh",
    termsActive: "Fall 2024 - Spring 2025",
    major: "Computer Science",
    email: "atrinh8@asu.edu",
    linkedin: "https://www.linkedin.com/in/alex-trinh-98a577259/",
    github: "https://github.com/at-trinh",
  },
  {
    image: teamMember8,
    name: "Karina Winkelmann",
    termsActive: "Fall 2024 - Spring 2025",
    major: "Computer Systems Engineering",
    email: "kwinkel2@asu.edu",
    linkedin: "https://www.linkedin.com/in/karina-winkelmann-122055235/",
    github: "https://github.com/Karina528",
  },
  {
    image: teamMember9,
    name: "Brian Amen",
    termsActive: "Fall 2024 - Spring 2025",
    major: "Computer Science (Cybersecurity)",
    email: "bamen@asu.edu",
    linkedin: "https://www.linkedin.com/in/brian-amen-697bab1b5/",
    github: "https://github.com/brainamen",
  },
  {
    image: teamMember10,
    name: "Austin Mayhew",
    termsActive: "Spring 2025",
    major: "Computer Science (Software Engineering)",
    email: "atmayhew@asu.edu",
    linkedin: "https://www.linkedin.com/in/austin-mayhew-a54a88352/",
    github: "https://github.com/Austin-Mayhew",
  },
  {
    image: teamMember11,
    name: "Cameron Mendez",
    termsActive: "Spring 2025 - Fall 2025",
    major: "Computer Science (Cybersecurity)",
    email: "cameronbrianmendez@gmail",
    linkedin: "https://www.linkedin.com/in/cameron-mendez-92b749216",
    github: "https://github.com/cameronbmendez",
  },
  {
    image: teamMember12,
    name: "Kali Armstrong",
    termsActive: "Spring 2025 - Fall 2025",
    major: "Computer Science",
    email: "kdarms5@gmail.com",
    linkedin: "https://www.linkedin.com/in/kali-armstrong/",
    github: "https://github.com/kdarmst4",
  },
  {
    image: teamMember13,
    name: "Worifung Achu",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "wachu1@asu.edu",
    linkedin: "https://www.linkedin.com/in/worifung-achu-bab3b423a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "https://github.com/Achu-Worifung",
  },
  {
    image: teamMember14,
    name: "Leroy Freelon III",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "lfreelon@asu.edu",
    linkedin: "https://github.com/lfreelon21",
    github: "https://www.linkedin.com/in/leroy-freelon-iii-0aa67b255/",
  },
  {
    image: teamMember15,
    name: "Josh Decker",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "jdeckerbfm@gmail.com",
    linkedin: "https://www.linkedin.com/in/joshua-decker-605821157/",
    github: "https://github.com/Code-Level-Beard",
  },
  {
    image: teamMember16,
    name: "Mario Zuniga",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "mozuniga@asu.edu",
    linkedin: "https://www.linkedin.com/in/mario-zuniga-0a402625a/",
    github: "https://github.com/Osvaldo1799",
  },
  {
    image: teamMember17,
    name: "Hansel Lopez",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "mozuniga@asu.edu",
    linkedin: "https://www.linkedin.com/in/hansel-lopez-9a4118386?trk=contact-info",
    github: "https://github.com/Hansel-1",
  },
  {
    image: teamMember18,
    name: "Isabelle Perkins",
    termsActive: "Fall 2025",
    major: "Computer Science",
    email: "isabellemperkins@gmail.com",
    linkedin: "https://www.linkedin.com/in/isabelle-perkins-35122a260/",
    github: "https://github.com/RainbowPecan"
  },
];

const About = () => {
  const { isSideMenu } = useMenuContext();

  useEffect(() => {
    document.body.classList.add("about-page-body");
    return () => {
      document.body.classList.remove("about-page-body");
    };
  }, []);

  return (
    <div className={`about ${isSideMenu ? "compressed" : ""}`}>
      <header className="header-background">
        <img src={asuLogo} alt="ASU Logo" className="asu-logo" />
      </header>
      <main className="about-content-area">
        <section className="event-details">
          <article>
            <p>{ourTeamDescription}</p>
          </article>
        </section>
        <div className="underline"></div>
        <section className="team-section">
          {
            
            teamMembers.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.image} alt={`${member.name} Profile`} className="team-member-image" />
                <div className="team-member-info">
                  <h3>{member.name}</h3>
                  <p className="terms-active">{member.termsActive}</p>
                  <p>{member.major}</p>
                  <p>{member.email}</p>
                   <div className="team-icons">
                        <a
                          href={`mailto:${member.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-linkedin"></i>
                        </a>
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-github"></i>
                        </a>
                      </div>

                </div>
              </div>
            ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
