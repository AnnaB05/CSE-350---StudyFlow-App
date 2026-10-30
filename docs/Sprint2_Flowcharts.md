
# StudyFlow – Sprint 2 Flowcharts and Logic Maps

Prepared by: Christina Ramazani  
Course: CSE 350 – Introduction to Software Engineering

## 1. Application View-Switching Flowchart

This flowchart shows how users move between the main pages of StudyFlow and how the application handles login errors and Strict Mode restrictions.

```mermaid
flowchart TD
    A([Open StudyFlow]) --> B[Login Screen]
    B --> C{Have an account?}
    C -->|No| D[Create Account]
    D --> E[Return to Login]
    E --> F[Enter Login Details]
    C -->|Yes| F
    F --> G{Login Successful?}
    G -->|No| H[Show Error Message]
    H --> F
    G -->|Yes| I[Dashboard]
    I --> J{Select a Page}
    J -->|Tasks| K{Strict Mode Active?}
    K -->|No| L[Task Checklist]
    K -->|Yes| M[Show Explanation]
    M --> N[Focus Timer]
    J -->|Timer| N
    J -->|Log Out| O([Return to Login])
    L -->|Back| I
    N -->|Back if Allowed| I

    P["DESIGN NOTE: Strict Mode blocks task entry during active focus time and displays an explanation."]
    K -.-> P

    classDef start fill:#E9D5F5,stroke:#222,color:#000;
    classDef process fill:#D6EAF8,stroke:#222,color:#000;
    classDef decision fill:#FFF0B3,stroke:#222,color:#000;
    classDef main fill:#D5F0D7,stroke:#222,color:#000;
    classDef note fill:#FFFFFF,stroke:#222,color:#000;

    class A,O start;
    class B,D,E,F,H,L,M process;
    class C,G,J,K decision;
    class I,N main;
    class P note;
```

### Design Notes

- Successful authentication directs the user to the dashboard.
- Invalid login information displays an error and allows another attempt.
- Users can navigate between the task checklist and focus timer.
- Strict Mode prevents task entry during an active focus session and displays an explanation.
- Logging out returns the user to the login screen.
