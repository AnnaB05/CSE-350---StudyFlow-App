# StudyFlow - LocalStorage Text Structure Specification

## Overview

This file defines the string-serialized JSON structure for the StudyFlow Task Manager checklist sets. Browser `localStorage` can only accept plain text strings so this layout acts as the definitive schema model that our frontend scripts must parse (`JSON.parse()`) and serialize (`JSON.stringify()`) during runtime execution.


## Serialization Blueprint

The main browser storage footprint for managing tasks utilizes the single static data string key: `studyflow_tasks_array`. 

When this text structure is pulled from browser memory, it expands into a JSON array containing unique task item objects.

### 1. Raw Serialized Text Format (Inside Browser Memory)

The user's checklist looks like this while sitting compressed inside the local browser storage engine:

```json
"[{\"id\":1729176400000,\"user_email\":\"student@louisville.edu\",\"title\":\"Complete CSC-350 Deliverables\",\"isCompleted\":0},{\"id\":1729176510000,\"user_email\":\"student@louisville.edu\",\"title\":\"Review Lecture Notes\",\"isCompleted\":1}]"
```

### 2. Deserialized Document Schema Structure

When our application scripts load the storage footprint using `localStorage.getItem('studyflow_tasks_array')` and pass it through a JSON parsing layer, the data inflates into a multi-attribute array:

```json
[
  {
    "id": 1729176400000,
    "user_email": "student@louisville.edu",
    "title": "Complete CSC-350 Deliverables",
    "isCompleted": 0
  },
  {
    "id": 1729176510000,
    "user_email": "student@louisville.edu",
    "title": "Review Lecture Notes",
    "isCompleted": 1
  }
]
```

## Attribute Constraints & Validation Rules

To protect our application state loop from formatting crashes, every task object written to browser storage will need to adhere to the following parameters:

| Attribute Key | JavaScript Type | SQLite Equivalent | Constraints | Purpose / System Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Number | INTEGER | Primary Key, Unique | Represents the unique Unix millisecond timestamp via `Date.now()`. Used as the target reference key for edits and deletions. |
| `user_email` | String | TEXT | Not Null, Foreign Key | Traces the task explicitly to the active logged-in account profile to isolate multi-user session views. |
| `title` | String | TEXT | Not Null, Max 120 Chars | Holds the custom string input captured from the client form submission wrapper. |
| `isCompleted` | Number | INTEGER | Default: 0, Range: [0, 1] | Binary completion flag. `0` indicates active/incomplete task status. `1` triggers a striking style transformation line on the UI. |

## Data State Flow Chart (showing how data states transform from browser input to storage memory blocks)



```text
CLIENT TEXT SUBMISSION
         |
         v
[Capture form values: user_email, title]
         |
         v
[Generate structural properties: id, isCompleted]
         |
         v
INFLATED JAVASCRIPT OBJECT BUNDLE
         |
         v
   Array.push() into current session collection
         |
         v
JSON.stringify() DATA TRANSFORMATION
         |
         v
SERIALIZED STRING ARRAY STREAM
         |
         v
localStorage.setItem('studyflow_tasks_array', stringStream)
         |
         v
PERSISTED LOCAL DISK STORAGE MATRIX
```
