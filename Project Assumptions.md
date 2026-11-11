# Project Assumptions - School Admission System

## Overview
This document outlines the explains assumptions made during the development of the School Admission System. These assumptions help guide architectural decisions, feature implementation, and system behavior when requirements are ambiguous or unspecified.

---

## Frontend (React) Assumptions

### API Response Structure
- **Class API responses** return data in one of two formats:
  - Direct array: `response.data` is an array of class objects
  - Nested structure: `response.data.data` contains the array
- The application gracefully handles both formats to support varying backend implementations

### Form Validation
- All form fields (Class Name, Section, Total Seats) are **required** before submission
- Validation happens on the client-side before API calls
- Users receive alert notifications for validation errors and API failures
- We assume alert-based feedback is acceptable for MVP; future iterations may use toast notifications

### Class Data Model
Each class object includes:
- `id`: Unique identifier
- `name`: Display name (e.g., "Class 6-Shift")
- `section`: Section identifier (e.g., "A", "B", "C")
- `totalSeats`: Maximum seat capacity (stored as integer)
- `confirmedSeats`: Number of confirmed admissions
- `availableSeats`: Calculated as `totalSeats - confirmedSeats`

### User Interactions
- **Edit mode** loads class data into the form and hides the class list
- **Destructive actions** (delete) require confirmation via browser dialog
- Success/failure messages use browser alerts (suitable for development/MVP phase)
- Create and Update operations both refresh the full class list after completion

### UI/UX Behavior
- The "Add New Class" button toggles form visibility and changes to a "Cancel" button
- Section badges display as cyan-colored pills for visual consistency
- Available seats show in green if available, red if none remain
- Grid layout uses responsive columns (minimum 300px width, auto-fill)
- The admin panel occupies at least 80vh of vertical space

---

## Backend (.NET 8) Assumptions

### Class Management API
- The API endpoints support CRUD operations: GET all, GET by ID, POST (create), PUT (update), DELETE
- Endpoints return appropriate HTTP status codes (200 for success, 4xx for client errors, 5xx for server errors)
- The backend validates seat capacity and prevents overbooking
- Updates to seat counts trigger recalculation of available seats

### Data Persistence
- Class data persists in a database (assumed to be relational, like SQL Server)
- No soft-delete functionality; deleted classes are permanently removed
- Concurrent requests are handled without race conditions on seat availability

### Hold Entity Specifics
- The Hold entity uses `HoldStatus.Held` as the default status (not Pending)
- Hold status enum values are: `Held`, `Confirmed`, `Expired`, `Cancelled`
- The entity includes `UpdatedAt` timestamp instead of `ConfirmedAt`
- The HoldService uses these exact enum values and status transitions

---

## General System Assumptions

### Authentication & Authorization
- No authentication/authorization checks are currently implemented in the AdminPanel
- We assume the admin interface is only accessible to authorized users
- Future work will secure API endpoints with token-based authentication

### Error Handling
- Network errors display generic error messages to users
- The application assumes stable internet connectivity for all API calls
- No retry logic is currently implemented; failed requests require manual retry

### Data Constraints
- Class names and sections are treated as strings with no format restrictions (for MVP)
- Total seats must be greater than zero
- The system doesn't validate duplicate class names or sections

### Browser Compatibility
- The application assumes ES6+ JavaScript support
- We use modern React hooks (useState, useEffect) without legacy class components
- CSS custom properties (CSS variables) are used for theming; assumes CSS variable support

### Scalability & Performance
- The admin panel loads all classes at once; pagination is not implemented
- We assume the number of classes won't exceed a threshold where performance becomes an issue
- No caching strategy is employed; data freshness takes priority

---
