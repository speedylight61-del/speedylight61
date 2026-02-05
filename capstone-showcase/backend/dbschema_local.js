/**
 * -- HELPER CONSTANTS --
 * The below constants manage all the tables/columns 
 * that should exist in the local SQL DB. 
 * 
 * If your code needs to add or remove any tables/columns to local DB
 * please update the below constants respectively. 
 * 
 * When "node localServer.js" is run, all local db tables/columns
 * will be checked (per the below) automatically.
 * - Terminal will prompt if any tables/columns are missing in your local DB
 *  - If "Y" is entered, respective column will be created and code will continue
 *  - If "N" is entered, respective column will NOT be created and all code processes will exit
 *    - Exit avoids crashes due to referencing table items that do not exist
 */

// ============================
// -- COLUMN CONSTANTS
// ============================

// Columns for admin_pass_hash table
const admin_pass_hash_Columns = [
  { name: "id", definition: "INT PRIMARY KEY NOT NULL AUTO_INCREMENT" },
  { name: "pass_hash", definition: "VARCHAR(255) NOT NULL" },
];

// Columns for presentation table
const presentation_Columns = [
  { name: "id", definition: "INT PRIMARY KEY NOT NULL AUTO_INCREMENT" },
  { name: "p_date", definition: "DATE NOT NULL" },
  { name: "p_loca", definition: "VARCHAR(255) NOT NULL" },
  { name: "p_checking_time", definition: "DATETIME NOT NULL" },
  { name: "p_presentation_time", definition: "DATETIME NOT NULL" },
  { name: "file_path", definition: "VARCHAR(255) DEFAULT NULL" },
];

// Columns for showcaseentries table
const showcaseentries_Columns = [
  { name: "EntryID", definition: "INT PRIMARY KEY NOT NULL AUTO_INCREMENT" },
  { name: "Email", definition: "VARCHAR(255) NOT NULL" },
  { name: "Name", definition: "VARCHAR(255) NOT NULL" },
  { name: "ProjectTitle", definition: "VARCHAR(255) NOT NULL" },
  { name: "ProjectDescription", definition: "TEXT NOT NULL" },
  { name: "Sponsor", definition: "VARCHAR(255) NOT NULL" },
  { name: "NumberOfMembers", definition: "INT NOT NULL" },
  { name: "MemberNames", definition: "TEXT NOT NULL" },
  { name: "CourseNumber", definition: "VARCHAR(50) NOT NULL" },
  { name: "Demo", definition: "ENUM('Yes','No') NOT NULL" },
  { name: "Power", definition: "ENUM('Yes','No') NOT NULL" },
  { name: "NDA", definition: "ENUM('Yes','No') NOT NULL" },
  { name: "VideoLink", definition: "VARCHAR(255) NOT NULL" },
  { name: "VideoLinkRaw", definition: "VARCHAR(255) NOT NULL" },
  { name: "DateStamp", definition: "DATE NOT NULL" },
  { name: "ShouldDisplay", definition: "ENUM('YES','NO') NOT NULL" },
];

// Columns for showcaseentries_backup table
const showcaseentries_backup_Columns = [...showcaseentries_Columns]; // same as main table

// Columns for survey_entries
const survey_entries_Columns = [
  { name: "id", definition: "INT PRIMARY KEY NOT NULL AUTO_INCREMENT" },
  { name: "Major", definition: "VARCHAR(255) DEFAULT NULL" },
  { name: "youtubeLink", definition: "VARCHAR(255) DEFAULT NULL" },
  { name: "position", definition: "INT DEFAULT NULL" },
  { name: "teamMemberNames", definition: "VARCHAR(255) DEFAULT NULL" },
  { name: "Sponsor", definition: "VARCHAR(255) DEFAULT NULL" },
  { name: "ProjectDescription", definition: "TEXT DEFAULT NULL" },
  { name: "ProjectTitle", definition: "VARCHAR(255) DEFAULT NULL" },
  { name: "winning_pic", definition: "TEXT DEFAULT NULL" },
  { name: "submitDate", definition: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  { name: "email", definition: "VARCHAR(255) NOT NULL" },
  { name: "name", definition: "VARCHAR(255) NOT NULL" },
  { name: "numberOfTeamMembers", definition: "INT DEFAULT NULL" },
  { name: "major", definition: "VARCHAR(50) DEFAULT NULL" },
  { name: "demo", definition: "TINYINT(1) DEFAULT NULL" },
  { name: "power", definition: "TINYINT(1) DEFAULT NULL" },
  { name: "nda", definition: "TINYINT(1) DEFAULT NULL" },
];

// Columns for teams_and_teams_ids___sheet1
const teams_and_teams_ids___sheet1_Columns = [
  { name: "Team ID", definition: "VARCHAR(10) DEFAULT NULL" },
  { name: "Teams", definition: "VARCHAR(255) DEFAULT NULL" },
];

// ============================
// -- MASTER TABLE DEFINITIONS
// ============================

const allLocalTables = [
  {
    name: "admin_pass_hash",
    createSQL: `CREATE TABLE admin_pass_hash (id INT PRIMARY KEY AUTO_INCREMENT)`,
    columns: admin_pass_hash_Columns,
  },
  {
  name: "presentation",
  createSQL: `CREATE TABLE presentation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    p_date DATE NOT NULL,
    p_loca VARCHAR(255) NOT NULL,
    p_checking_time DATETIME NOT NULL,
    p_presentation_time DATETIME NOT NULL,
    file_path VARCHAR(255) DEFAULT NULL,
    s_date DATE DEFAULT (CURRENT_DATE),
    e_date DATE DEFAULT (DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
  columns: presentation_Columns,
  },
  {
    name: "showcaseentries",
    createSQL: `CREATE TABLE showcaseentries (EntryID INT PRIMARY KEY AUTO_INCREMENT)`,
    columns: showcaseentries_Columns,
  },
  {
    name: "showcaseentries_backup",
    createSQL: `CREATE TABLE showcaseentries_backup (EntryID INT PRIMARY KEY DEFAULT 0)`,
    columns: showcaseentries_backup_Columns,
  },
  {
    name: "survey_entries",
    createSQL: `CREATE TABLE survey_entries (id INT PRIMARY KEY AUTO_INCREMENT)`,
    columns: survey_entries_Columns,
  },
  {
    name: "teams_and_teams_ids___sheet1",
    createSQL: `CREATE TABLE teams_and_teams_ids___sheet1 (TeamID VARCHAR(10))`,
    columns: teams_and_teams_ids___sheet1_Columns,
  },
];

module.exports = {
  admin_pass_hash_Columns,
  presentation_Columns,
  showcaseentries_Columns,
  showcaseentries_backup_Columns,
  survey_entries_Columns,
  teams_and_teams_ids___sheet1_Columns,
  allLocalTables
};