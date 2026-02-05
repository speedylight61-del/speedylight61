-- Use the database
CREATE DATABASE IF NOT EXISTS new_showcase_db;
USE new_showcase_db;

-- Create the survey_entries table
CREATE TABLE IF NOT EXISTS survey_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    projectTitle VARCHAR(255) NOT NULL,
    projectDescription TEXT NOT NULL,
    sponsor VARCHAR(255),
    numberOfTeamMembers INT,
    teamMemberNames VARCHAR(255),
    major VARCHAR(50),
    demo TINYINT(1) DEFAULT 0,
    power TINYINT(1) DEFAULT 0,
    nda TINYINT(1) DEFAULT 0,
    youtubeLink VARCHAR(255)
);

-- Optional: Add a test entry to verify functionality
INSERT INTO survey_entries (email, name, projectTitle, projectDescription, sponsor, numberOfTeamMembers, teamMemberNames, major, demo, power, nda, youtubeLink)
VALUES
('test@example.com', 'Test User', 'Test Project', 'This is a test project description.', 'Test Sponsor', 3, 'Alice, Bob, Charlie', 'Computer Science', 1, 1, 0, 'https://youtu.be/9SiygND3iyE');
