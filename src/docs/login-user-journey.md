# StudyFlow - Login User Journey

## Overview

The purpose of this user journey is to describe how a user interacts with the StudyFlow login and signup system. During Sprint 1, this process is being mapped before the full authentication system is implemented.

The final version of StudyFlow will use SQLite for storing user accounts and `bcryptjs` for password hashing.

## User Journey

### 1. Launch Application

The user opens the StudyFlow application.

The application displays the authentication screen with two options:

- Login
- Sign Up

### 2. New User Signup

If the user does not already have an account, they select **Sign Up**.

The user enters:

- Username
- Email
- Password
- Confirm Password

The system checks that:

- No required fields are empty.
- The email is valid.
- The password and confirmation password match.
- The username or email is not already registered.

If the information is valid:

1. The account is created.
2. The password is hashed.
3. The user information is stored.
4. The user is redirected to the StudyFlow dashboard.

If the information is invalid:

1. An error message is displayed.
2. The user remains on the signup page.
3. The user can correct the information and try again.

### 3. Existing User Login

If the user already has an account, they select **Login**.

The user enters:

- Username or email
- Password

The system checks the login credentials.

If the credentials are correct:

1. The user is authenticated.
2. The application loads the user account.
3. The user is redirected to the StudyFlow dashboard.

If the credentials are incorrect:

1. An error message is displayed.
2. The user remains on the login page.
3. The user can try again.

### 4. StudyFlow Dashboard

After a successful login, the user reaches the StudyFlow dashboard.

From the dashboard, the user can access:

- Focus Timer
- Task Manager
- Strict Mode
- User Settings
- Logout

### 5. Logout

When the user selects **Logout**:

1. The current session ends.
2. User session information is cleared.
3. The application returns to the login screen.

## Login User Flow

```text
START APPLICATION
        |
        v
LOGIN / SIGNUP SCREEN
        |
        v
Does the user already have an account?
        |
   +----+----+
   |         |
  YES        NO
   |         |
   v         v
 LOGIN     SIGN UP
   |         |
   v         v
Enter      Enter Account
Credentials Information
   |         |
   v         v
Validate   Validate
Credentials Information
   |         |
   v         v
Valid?     Valid?
   |         |
 +---+---+ +---+---+
 |       | |       |
YES      NO YES     NO
 |       | |       |
 v       v v       v
Dashboard Error  Create Error
          |      Account |
          |        |     |
          +--------+     |
                         |
                    Correct Input