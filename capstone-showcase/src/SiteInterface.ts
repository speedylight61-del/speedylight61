export interface ProjectObj {
  id: number;
  email: string;
  major: string;
  Name: string;
  projectTitle: string;
  projectDescription: string;
  sponsor: string;
  NumberOfMembers: number;
  teamMemberNames: string;
  teamMemberMajors?: string;
  teamMemberPhotos?: string;
  CourseNumber: string;
  Demo: string;  
  Power: string; 
  NDA: string;   
  VideoLink: string;
  youtubeLink: string;
  DateStamp: string;
  ShouldDisplay: string; 
  position: string | number;
  winning_pic: string | null;
}

export interface WinnerSelection {
  position: string | number;
  projectId: number;
  projectName: string;
  pictures: File[];
}

export interface ShowcaseEntry {
  course: string;
  EntryID: number;
  video: string;
  shouldDisplay: "YES" | "NO"; 
  position: number;
  members: string;
  Sponsor: string;
  description: string;
  ProjectTitle: string;
  winning_pic: string | null;
  department?: string;
  NDA: "Yes" | "No"; 
  year: number;
  semester: "Spring" | "Summer" | "Fall" | "Winter"; 
  teamPicturePath: string | null;
  posterPicturePath: string | null;
};
