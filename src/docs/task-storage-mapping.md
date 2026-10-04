# StudyFlow - Task Storage and Memory Mapping

##Overview

This file maps out how the task manager tracks, structures, and saves student checklist items inside local browser memory.

The final version of StudyFlow will use the browser's native `localStorage` engine to retain user data across reloads without requiring complex, background server installations.

## Local Storage Mapping

### 1. Global Memory Keys

To keep our database boundaries organized, the client web view tracks three global keys inside browser memory:

- `studyflow_logged_in_user` (tracks the active student email profile)
- `studyflow_task_array` (holds complete row checklist arrays)
- `studyflow_active_timer_state` (saves the clock state to preserve countdown parameters)

### 2. Task Checklist Data Schema (`studyflow_tasks_array`)

A student will need the ability to track multiple assignments (tasks), the task checklist data properties are structured as an array of singular task objects. Each task object contains four parameters:

- **id** (Unique integer tracking timestamp keys using JavaScript's `Date.now()` function)
- **user_email** (String matching the task directly to the logged-in student)
- **title** (The custom task string typed into the input bar by the user)
- **isCompleted** (A binary number flag: `0` for an uncompleted empty checkbox, `1` for a completed task)

## Data Operations (CRUD)

### 1. Create (Adding Tasks)

When the user types a new task title and clicks **Add Task**:
1. The system creates a fresh object using the current millisecond timestamp as the unique ID.
2. The object is pushed into the active tasks list array
3. The array is converted to a string layout and saved using `localStorage.setItem()`
4. The frontend refreshes the view row display

### 2. Read (Loading Tasks)

When the user enters their dashboard layout views:
1. The application parses the stored text string from memory using `localStorage.getItemm()`.
2. The text is parsed back into a standard JavaScript array loop
3. The system filters out items that don't match the current logged-in user's email.
4. The user interface renders rows for the studen's personal checklist tasks.

### 3. Update (Toggling Checkboxes)

When the user clicks an active checkbox item on their list:
1. The app reads the array and finds the specific task matching the row's unique timestamp ID.
2. The system flips the `isCompleted` parameter between `0` and `1`.
3. The updated array is saved back to `localStorage`.
4. The frontend triggers a strikethrough visual line style over the completed task row text.

### 4. Delete (Purging Tasks)

When the user clicks the delete button option next to a task:
1. The app reads the array and removes the item matching that row's unique timestamp ID.
2. The revised list bundle is written to `localStorage`.
3. The frontend immediately updates the dashboard to remove the visual row.

## Task Storage Data Flow

```text
USER INTERACTS WITH PLANNER
              |
              v
     Is a task being modified?
              |
      +-------+-------+

      |               |
   CREATING       MUTATING
   NEW TASK      EXISTING TASK

      |               |
      v               v
Enter Title      Select Target Row
Text String       by Timestamp ID

      |               |
      v               +-------+-------+
Generate Unique               |               |
Timestamp ID               TOGGLING       DELETING
      |                    CHECKBOX       TASK ROW
      v                       |               |
Push New Object               v               v
to Tasks Array            Flip Binary     Filter Array
      |                 isCompleted flag  to Drop ID

      |                       |               |
      +-------+-------+-------+               |

              |                               |
              +---------------+---------------+
                              |
                              v
                  Stringify Updated Array Bundle
                              |
                              v
                  Write to Browser LocalStorage
                              |
                              v
                  Refresh Frontend List View
```
