import React from "react";
import "../css/aboutUs.css";
const AboutUs = () => {
  // Sample data for the team members
  const teamMembers = [
    {
      name: "Kritika Joshi",
      contribution: "Responsible for developing the front-end of the website.",
    },
    {
      name: "Pooja Rani",
      contribution:
        "Responsible for requirement gathering, front-end of the website.",
    },
    {
      name: "Supraja Seshadri",
      contribution: "Responsible for developing the back-end of the website.",
    },
    {
      name: "Zia Mahmood Hussain",
      contribution: "Responsible for developing the back-end of the website.",
    },
  ];

  return (
    <div className="about-us">
      {/* Page Header */}
      <header className="about-header">
        <h1>About Us</h1>
        <p>
          Welcome to the <strong>Conversational Elicitation Tool</strong>, a
          solution designed to streamline the reporting process and bridge the
          gap between users and data engineering teams. Our platform ensures an
          efficient and interactive way to manage report requests while
          prioritizing customization and user experience.
        </p>
      </header>

      {/* Project Details */}
      <section className="project-details">
        <h2>What Our Project Does</h2>

        {/* Feature 1: Secure Login */}
        <div className="feature">
          <h3>Secure Login and Authentication</h3>
          <ul>
            <li>
              <strong>Admin and User Access: </strong>
              Provides separate dashboards for Admins and Users with robust
              authentication and session management.
            </li>
          </ul>
        </div>

        {/* Feature 2: Upload Meta-Model */}
        <div className="feature">
          <h3>Upload Meta-Model</h3>
          <ul>
            <li>
              <strong>Admin Functionality:</strong> Admins can upload JSON
              meta-models to customize chatbot interactions, ensuring the format
              and structure are validated. A preview feature allows reviewing
              the meta-model before finalizing the upload. Successfully uploaded
              meta-models dynamically modify chatbot conversation flows to meet
              specific requirements.
            </li>
          </ul>
        </div>

        {/* Feature 3: Chatbot Interaction */}
        <div className="feature">
          <h3>Interactive Chatbot for Report Requests</h3>
          <ul>
            <li>
              <strong>Start Conversation:</strong> Users can start a
              conversation with the chatbot via a "Start Conversation" button on
              their dashboard. The chatbot guides them step-by-step, collecting
              details like report type and filters, with input validation for
              accuracy. Users can pause and resume the conversation anytime to
              provide additional details.
            </li>
          </ul>
        </div>

        {/* Feature 4: Admin Review */}
        <div className="feature">
          <h3>Admin Review and Categorization</h3>
          <ul>
            <li>
              <strong>Dashboard Access:</strong> Admins can view all pending
              report requests. Each request provides a detailed summary for
              Admin review, with the option to flag requests requiring further
              clarification.
            </li>
          </ul>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <h3>{member.name}</h3>
              <p>{member.contribution}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
