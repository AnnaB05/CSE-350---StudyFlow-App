
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



## 2. Focus Timer and Strict Mode Flowchart

This flowchart shows how users manage their focus sessions and how the application handles timer controls and Strict Mode restrictions.

```mermaid
flowchart TD
    A([Open Focus Timer]) --> B[Set Study Duration]
    B --> C{Strict Mode Enabled?}
    C -->|Yes| D[Block Task Entry]
    C -->|No| E[Allow Task Entry]
    D --> F[Timer Running]
    E --> F
    F --> G{Timer Finished?}
    G -->|No| H{User Action?}
    H -->|Continue| F
    H -->|Pause| I[Pause Timer]
    I --> J{Resume or Cancel?}
    J -->|Resume| F
    J -->|Cancel| K[End Session]
    H -->|Cancel| K
    G -->|Yes| L[Show Completion Message]
    L --> M[Restore Task Access]
    K --> M
    M --> N([Return to Dashboard])

    O["DESIGN NOTE: Strict Mode blocks task entry during active focus time and displays an explanation."]
    D -.-> O

    classDef start fill:#E9D5F5,stroke:#222,color:#000;
    classDef process fill:#D6EAF8,stroke:#222,color:#000;
    classDef decision fill:#FFF0B3,stroke:#222,color:#000;
    classDef main fill:#D5F0D7,stroke:#222,color:#000;
    classDef note fill:#FFFFFF,stroke:#222,color:#000;

    class A,N start;
    class B,D,E,F,I,K,M process;
    class C,G,H,J decision;
    class L main;
    class O note;
```

### Design Notes

- Users can choose a study duration before starting the focus timer.
- Strict Mode prevents users from entering tasks during an active focus session.
- Users can pause, resume, or cancel the timer.
- A completion message appears when the countdown finishes.
- Task access is restored when the session ends.
