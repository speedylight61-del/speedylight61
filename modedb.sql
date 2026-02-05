-- to run the update command-
USE asucapstone_jmtlqnmy_capstone_project_submission;

ALTER TABLE showcaseentries ADD COLUMN position INTEGER DEFAULT NULL;

ALTER TABLE showcaseentries ADD COLUMN winning_pic TEXT DEFAULT NULL;

SET SQL_SAFE_UPDATES = 0;

-- assign positions based on the number of members (temp solution)
UPDATE showcaseentries
SET `position` = 1
WHERE NumberOfMembers = 5;

UPDATE showcaseentries
SET `position` = 2
WHERE NumberOfMembers = 4;

UPDATE showcaseentries
SET `position` = 3
WHERE NumberOfMembers = 3;

SELECT 
  CourseNumber AS course,
  videoLink AS video,
  shouldDisplay,
  position AS position,
  MemberNames AS members,
  Sponsor,
  ProjectDescription AS description,
  ProjectTitle,
  winning_pic,
  shouldDisplay,
  NDA,
  EntryID,
  YEAR(DateStamp) AS year,
  CASE 
    WHEN MONTH(DateStamp) IN (12, 1, 2) THEN 'Winter'
    WHEN MONTH(DateStamp) IN (3, 4, 5) THEN 'Spring'
    WHEN MONTH(DateStamp) IN (6, 7, 8) THEN 'Summer'
    WHEN MONTH(DateStamp) IN (9, 10, 11) THEN 'Fall'
  END AS semester
FROM showcaseentries
WHERE position IS NOT NULL;

SET SQL_SAFE_UPDATES = 0;



