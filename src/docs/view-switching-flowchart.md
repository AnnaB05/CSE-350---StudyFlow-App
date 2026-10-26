# StudyFlow - View-Switching Flowchart & Navigation Logic Specs

## Overview

This file defines the client-side routing state machine for StudyFlow's User Login Gateway, Focus Timer Screen, and Task Manager Planner. 

Our architecture has been streamlined into a highly efficient client-side application, view-switching is driven by functional conditional state rendering tags (such as an explicit `currentView` string state tracking variable) inside our React web workspace layer. 


## Centralized App Navigation Matrix

The core user experience is bound to three primary state conditions. The table below outlines how state conditions dictate what layout mounts on the screen and what actions trigger a route alteration:

| Active State Value |Mounted Layout Panel          | Security Rule          |Available Outbound Target Actions                                                                               |
| `VIEW_LOGIN`       |User Credentials Form Card    |Unauthenticated Unlocked|`Submit Form Success`➔Sets profile variable➔Shifts to `VIEW_TIMER`                                            | 
| `VIEW_TIMER`       |Circular 25-Min Countdown Hub |Authenticated Protected |`Click Nav: Tasks Link`➔Shifts to `VIEW_TASKS`<br>`Click Button: Logout`➔Wipes session➔Shifts to `VIEW_LOGIN`|
| `VIEW_TASKS`       |Interactive Homework Checklist|Authenticated Protected |`Click Nav: Timer Link`➔Shifts to `VIEW_TIMER`<br>`Click Button: Logout`➔Wipes session➔Shifts to `VIEW_LOGIN`|
      

## Navigation Logic State Validation Rules

Our view controller logic must enforce strict boundary rules to protect user profile memory spaces and keep the application state loop stable:

1. **Unauthenticated Redirects:** If `studyflow_logged_in_user` is blank inside browser local memory, the application must completely override any user navigation attempt and force-render the `VIEW_LOGIN` layout card.
2. **Persistent App State:** When switching views between the Timer panel and the Task Planner checklist, the countdown state must remain actively executing in the background. Switching screens must never reset, pause, or crash an active focus session thread.
3. **Session Purge Cleanup:** Clicking the Logout action option button must clear out the browser's active session profile memory before flipping the view-switching flag back to the landing screen.

## Technical Routing Flowchart

```text
               LAUNCH APPLICATION ENGINE
                           |
                           v
               READ LOCALSTORAGE PROFILE
                           |
                           v
               Is user email profile valid?
                           |
            +--------------+--------------+

            |                             |
           YES                            NO

            |                             |
            v                             v
    MOUNT WORKSPACE HUB            MOUNT LOGIN ENTRY
    [Set state: VIEW_TIMER]        [Set state: VIEW_LOGIN]

            |                             |
            |                             v
            |                    Capture Credential Data

            |                             |
            |                             v
            |                    Submit to POST /login

            |                             |
            |                             v
            |                      Passed Match Check?

            |                             |
            |               +-------------+-------------+

            |               |                           |
            |              YES                          NO

            |               |                           |
            |               v                           v
            |         Write Session Key           Display Form Error
            |       ➔ Advance to Dashboard        Keep on VIEW_LOGIN

            |               |
            +-------+-------+
                    |
                    v
         DASHBOARD ROOT RENDERING
                    |
      +-------------+-------------+

      |                           |
      v                           v
VIEW_TIMER PANEL             VIEW_TASKS PANEL
[Circular Countdown UI]      [Checklist CRUD Forms]

      |                           |
      +-------------+-------------+
                    |
      +-------------+-------------+

      |                           |
      v                           v
NAVIGATION TRIGGER           LOGOUT ACTION TRIGGER
[Toggle currentView tag]     [Trigger session wipe logic]

      |                           |
      v                           v
Update UI View Panel         Clear Local Cache Keys
Remain Authenticated         ➔ Force Route to VIEW_LOGIN
```
