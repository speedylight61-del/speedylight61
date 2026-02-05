// ContactSupport.tsx
import React, { useState } from "react";
import "../CSS/ContactSupport.css";

const ContactSupport: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Support request submitted:", { email, message });
    alert("Your request has been submitted!");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-support-container">
      <h1>Contact Support</h1>
      <form onSubmit={handleFormSubmit} className="support-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="form-input"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactSupport;
