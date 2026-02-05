import React, { useEffect, useState } from "react";
import { useMenuContext } from "../MenuContext";
import "../CSS/PreEventLandingPage.css";
import asuLogo from "../assets/asuLogo.png";
import { MapPinCheck } from "lucide-react";
import showcase from "../assets/showcase.jpg";
import {
  capstoneDescription,
  landingPageIntro,
  navigationInstructions,
} from "../TextContent";
import Footer from "./Footer";

const PreEventLandingPage: React.FC = () => {
  const { isSideMenu } = useMenuContext();

  const [, setSavedTime] = useState<string | null>(null);
  const [, setSavedDate] = useState<string | null>(null);
  const [, setSavedImage] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const API_BASE_URL = import.meta.env.PROD
    ? "/api"
    : "http://localhost:3000/api";
  const STATIC_BASE_URL = import.meta.env.PROD ? "" : "http://localhost:3000";
  const normalizePathToUrl = (path: string) => {
    console.log("Original URL:", path);
    if (!path) return;
    const trimmed = path.trim();
    console.log(
      "Normalized URL:",
      `${STATIC_BASE_URL}/${trimmed.replace(/^\/+/, "")}`
    );
    return `${STATIC_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  };
  useEffect(() => {
    document.body.classList.add("pre-event-landing-page-body");
    return () => {
      document.body.classList.remove("pre-event-landing-page-body");
      const time = localStorage.getItem("savedTime");
      setSavedTime(time);
      const date = localStorage.getItem("savedDate");
      setSavedDate(date);
      const image = localStorage.getItem("savedImage");
      setSavedImage(image);
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/presentation`);
      const data = await res.json();
      setPresentation(data[0]);
      console.log("here is the data", data);
      setLoading(false);
    };
    fetchData();
    console.log("here is the presentation data", presentation);
  }, []);

  const militaryToStandardTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const standardHours = hours % 12 || 12;
    return `${standardHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <>
      <title>ASU Capstone Showcase</title>
      <div className={`pre-event-landing-page `}>
        <header
          className="header-background"
          aria-label="ASU Showcase Event Header"
        >
          <img src={asuLogo} alt="ASU Logo" className="asu-logo" />
        </header>
        <main className="content-area" aria-label="Main Event Content">
          <div className="home-page-title-container">
            <img
              src={showcase}
              alt="Showcase Event"
              className="showcase-image"
            />
            {presentation && (
              <div className="pre_event_information">
                <p className="showcase_title">ASU CAPSTONE SHOWCASE EVENT</p>
                <div className="showcase_event_display">
                  <span className="day_span">
                    <p className="event-day_of-week">
                      {months[new Date(presentation.p_date).getMonth()]}
                    </p>
                    <p className="event_day_of_month">
                      {presentation.p_date.slice(8, 10)}
                    </p>
                  </span>
                  <span className="event_supp_information">
                    <p>Location: {presentation.p_loca}</p>
                    <p>
                      Check In & Poster Pickup Time:{" "}
                      {militaryToStandardTime(
                        presentation.p_checking_time.slice(11, 16)
                      )}
                    </p>
                    <p>
                      {" "}
                      Presentation Time:{" "}
                      {militaryToStandardTime(
                        presentation.p_presentation_time.slice(11, 16)
                      )}
                    </p>
                  </span>
                </div>
              </div>
            )}
          </div>
          <section className="event-details" aria-label="Event Details Section">
            <article>
              {presentation && (
                <>
                  {/* <div className="pre_event_information">
                    <p className="showcase_title">
                      ASU CAPSTONE SHOWCASE EVENT
                    </p>
                    <div className="showcase_event_display">
                      <span className="day_span">
                        <p className="event-day_of-week">
                          {months[new Date(presentation.p_date).getMonth()]}
                        </p>
                        <p className="event_day_of_month">
                          {presentation.p_date.slice(8, 10)}
                        </p>
                      </span>
                      <span className="event_supp_information">
                        <p>Location: {presentation.p_loca}</p>
                        <p>
                          Check In & Poster Pickup Time:{" "}
                          {militaryToStandardTime(
                            presentation.p_checking_time.slice(11, 16)
                          )}
                        </p>
                        <p>
                          {" "}
                          Presentation Time:{" "}
                          {militaryToStandardTime(
                            presentation.p_presentation_time.slice(11, 16)
                          )}
                        </p>
                      </span>
                    </div>
                  </div> */}
                  {/* <p>
                    <strong>Showcase Date:</strong>{" "}
                    {presentation?.p_date.slice(0, 10)}
                    <br />
                    <strong>Location:</strong> {presentation?.p_loca}
                    <br />
                    <strong>Check In & Poster Pickup Time:</strong>{" "}
                    {presentation?.p_checking_time.slice(11, 16)}
                    <br />
                    <strong>Event Time:</strong>{" "}
                    {presentation?.p_presentation_time.slice(11, 16)}
                    <br />
                  </p> */}

                  <section
                    className="pdf-section"
                    aria-label="Event Map and Resourses"
                    style={{
                      marginTop: "40px",
                      textAlign: "center",
                      color: "#333",
                      fontSize: "24px",
                    }}
                  >
                    <h2>Event Map & Resources</h2>
                    <p>
                      Explore the venue maps and download the showcase materials
                      below.
                    </p>

                    <div
                      style={{
                        marginTop: "30px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {loading ? (
                        <p>Loading presentation details...</p>
                      ) : presentation?.file_path ? (
                        <object
                          data={normalizePathToUrl(presentation.file_path)}
                          type="application/pdf"
                          width="100%"
                          height="600px"
                          style={{ border: "1px solid #ccc" }}
                          title="Presentation"
                        >
                          <p>Map not available.</p>
                        </object>
                      ) : (
                        <p>Map not available.</p>
                      )}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <a
                        href={normalizePathToUrl(presentation?.file_path || "")}
                        download
                        style={{
                          color: "#8C1D40",
                          fontSize: "18px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        Download Capstone Locations and Diagrams (PDF)
                      </a>
                    </div>
                  </section>
                </>
              )}

              <p>{landingPageIntro}</p>
              <p>{capstoneDescription}</p>
              <p>{navigationInstructions}</p>
            </article>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PreEventLandingPage;
