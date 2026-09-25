# CSE-350---StudyFlow - Smart Study and Productivity App

An open-source, lightweight desktop application designed to help students optimize study habits. 

## Team Members/Core Responsibilities
*   **Anna Baker** – *Project Manager & Quality Assurance Lead*
    *   *Repository management, branch protection controls, automated testing gates, and documentation assembly.*

*   **Christina Ramazani** – *Scrum Master & Release Engineer*
    *   *GitHub Projects board management, daily standup coordination, and system view logic flowcharts.*

*   **Efrain Rosales** – *Lead Software Developer (Backend / Architecture)*
    *   *SQLite schema configurations, REST API endpoints, database encryption, and task CRUD processing.*

*   **Karthik Patta** – *Software Developer (Frontend / UI)*
    *   *React user interfaces, HTML/CSS layout templates, client state hooks, and LocalStorage caching.*

*   **Zaria Pinkston** – *Researcher & UI/UX Designer*
    *   *Competitor gap auditing, high-fidelity Figma blueprints, and interface usability testing.*



## Application Architecture
StudyFlow uses a decoupled client-server web stack bundled into a local environment layout for frictionless multi-machine development:
*   **Frontend Client:** React.js using local functional state hooks and Context API for global timer state tracking.
*   **Backend Server:** Node.js with an Express runtime framework hosting a clean RESTful API gateway.
*   **Database Management:** SQLite3 - A file-bound relational database module sitting right in the root directory as `studyflow.db`.
*   **Testing Suites:** Jest automation scripts and Supertest assertion blocks for continuous boundary verification.



## Core Features/Functional Requirements
*   **FR1 [Initialization]:** Standalone downloadable desktop window wrapper that boots cleanly and mounts the local database.
*   **FR2 [User Auth]:** Secure signup and login card. Scrambles passwords using `bcryptjs` hashing algorithms inside SQLite tables.
*   **FR3 [Focus Timer]:** Asynchronous 25-minute Pomodoro countdown engine containing `Start`, `Pause`, `Short Break`, and `End Session` controls.
*   **FR4 [Task Manager]:** Interactive homework checkbox rows supporting full CRUD processing (`Create`, `Read`, `Update`, `Delete`) linked to the user account.
*   **FR5 [Strict Mode]:** Simulated focus switch that hides task entry modules during an active timer and warns users if they try to click away.



## Development Milestones

###  Sprint 1 – Requirement Mapping (09/26/2026 – 10/09/2026)
*   [ ] Audit basic competitor interfaces & trace checklist layouts (`Zaria`)
*   [ ] Write client user journey mappings for simulated login routes (`Efrain`)
*   [ ] Map localized browser storage tracking for checklist items (`Karthik`)
*   [ ] Configure central GitHub code repository & branch protection controls (`Anna`)
*   [ ] Configure group shared workflow monitoring boards & card pipelines (`Christina`)
*   [ ] Compile master requirement list outlining core functional features (`Anna`)

### Sprint 2 – Feature Designing (10/10/2026 – 10/30/2026)
*   [ ] Map out LocalStorage text structure layouts for task checklist sets (`Efrain`)
*   [ ] Sketch user interface mockups for the circular clock countdown display (`Zaria`)
*   [ ] Sketch design layouts for the Login box & task checklist inputs (`Karthik`)
*   [ ] Draw functional application view-switching flowcharts & logic maps (`Christina`)
*   [ ] Establish project master test verification plan & feature criteria sheets (`Anna`)

### Sprint 3 – Code Writing (10/31/2026 – 11/30/2026)
*   [ ] Code browser script wrappers tracking simulated profile configurations (`Efrain`)
*   [ ] Code HTML/CSS style rules formatting responsive view login forms (`Karthik`)
*   [ ] Code live timer countdown intervals & interactive checklist rows (`Efrain` / `Karthik`)
*   [ ] Compile and submit the official Development Demo recording link & slide deck **(Due 11/13)** (`ALL`)
*   [ ] Run manual integration test execution passes & compile bug metrics (`Christina`)
*   [ ] Compile UI display screenshots, research citations, & user feedback (`Zaria`)
*   [ ] Merge and format the final 50+ Page Paper **(Due 11/30)** (`ALL`)


## Unit Testing
Our repository has an automated quality control check configured via **GitHub Actions**. 
Whenever anyone submits a **Pull Request** targeting the `main` branch, the cloud system will automatically trigger our internal test matrix. You guys can also run the command **'npm run test'** from your **Linux/GitBash terminal** provided you have **npm** properly installed. (Let me know **ASAP** if you need help installing anything! - Anna)

When you run the tests you will see 1 of the following outcomes: 
*   **🟢 Passing Tests:** Unlocks the merge block and displays a green checkmark.
*   **🔴 Failing Tests:** Permanently seals the merge block and displays a red X until the bug is resolved by the developer.
