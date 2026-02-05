# Capstone Showcase Website

# Website Tools Used
- Front-end: TypeScript + React + CSS
- Back-end: ExpressJS + MySQL

# Running the Website Locally
1. Change directories into the desired folder to store the files from the repo.
- Ex. `cd Downloads`

2. Clone the repository:
   ```
   https://github.com/asu-capstone-team/Capstone-Showcase.git
   ```
4. Change directories into the cloned repository:
   ```
   cd Capstone-Showcase
   ```
6. Create the Vite project:
   ```
   npm create vite@latest capstone-showcase
   ```
   Select the following options:
   - Ignore files and continue
   - React
   - TypeScript
   - No
   - No

5. Change directories into the capstone-showcase subfolder by using `cd capstone-showcase`.
- <ins>Note:</ins> This is the subfolder inside the repo and **NOT** the main folder of the repo.

6. Run the following commands:
   ```
   npm install
   git fetch --all
   git reset --hard origin/main
   npm install react-router-dom@latest
   ```
7. Run the website by using `npm run dev`.
   
8. Open the website in your browser using the Local url.

# Testing Frontend-Backend connection locally:

1. Open a terminal in VS Code.
   
2. Navigate to the backend folder:
   ```
   cd capstone-showcase
   cd backend
   ```
3. Start the backend server:
   ```
   node localServer.js
   ```
5. Open a 2nd terminal in VS Code.
6. Navigate to the project directory:
   ```
   cd capstone-showcase
   ```
7. Once in the 'capstone-showcase' directory, run the command `npm run dev`.
    
8. Launch the web application in your browser and navigate to any one of the major tabs.
    
13. Click on the "Survey Form" button to open a new capstone submission form.
    
15. Enter information as appropriate and click “Submit”.
   
17. Check the ‘backend’ terminal console for a submission confirmation.

-----------------------------------------------------------------------------------------------------
When testing code with backend make sure you use the localhost address, make sure to switch to production address when pushing code to Github
