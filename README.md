# School Admission System

A full-stack school admission application for managing class capacity, student seat holds, and admissions workflow. The system supports a student-facing flow for placing temporary holds on classes and an admin-facing flow for creating and managing class inventory.

## Overview

This project combines:

- A .NET 8 ASP.NET Core Web API for enrollment logic and data management
- A React + Vite frontend for the student and admin experience
- PostgreSQL for persistent data storage
- Docker Compose for local development setup

The application is designed around a seat-hold model where a student can reserve a place in a class for a limited time, confirm the admission, or cancel the request before expiry. Administrators can create, update, and remove class entries and monitor seat capacity.

## Features

### Student-facing experience
- Enter a 17-digit student ID to access the system
- View available classes and seat availability
- Create a hold on a class
- View personal holds
- Confirm or cancel a hold
- Automatic hold expiration logic for stale admissions

### Admin experience
- Create new classes
- Update class details and capacity
- Delete classes
- Review available seats and hold counts

### Backend capabilities
- ASP.NET Core REST API with Swagger documentation
- Entity Framework Core with PostgreSQL
- Validation for hold creation and confirmation rules
- Background service for expiring inactive holds
- CORS support for React frontend development

## Tech Stack

- Backend: .NET 8 / ASP.NET Core
- Database: PostgreSQL 16
- ORM: Entity Framework Core
- Frontend: React 18, Vite, Axios, Zustand
- API docs: Swagger / Swashbuckle
- Containerization: Docker Compose

## Project Structure

```text
SchoolAdmissionSystem/
├── SchoolAdmissionSystem.API/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json (create locally)
│   ├── docker-compose.yml
│   └── SchoolAdmissionSystem.API.csproj
├── schooladmissionsystem.frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── docker-compose.yml
│   └── public/
├── docker-compose.yml
├── AI Usage.md
├── Project Assumptions.md
├── README.md
└── SchoolAdmissionSystem.slnx
```

## Prerequisites

Before running the project locally, make sure you have:

- .NET 8 SDK
- Node.js 18+ and npm
- PostgreSQL 16 or Docker Desktop
- Git

## Running the Project

### Option 1: Run with Docker Compose

From the project root:

```bash
docker compose build --no-cache
docker compose up -d
```

This rebuilds the images without using the build cache, then starts the services in the background:

- PostgreSQL database
- Backend API
- Frontend application

The frontend is typically available at:

- http://localhost:5173

The backend API is typically available at:

- http://localhost:8080

Swagger UI is available at:

- http://localhost:8080/swagger

### Option 2: Run backend and frontend separately

#### 1) Backend

```bash
cd SchoolAdmissionSystem.API
# Restore dependencies
 dotnet restore

# Run the API
 dotnet run
```

The API will run using the configured connection string and expose Swagger in development mode.

#### 2) Frontend

```bash
cd schooladmissionsystem.frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

- http://localhost:5173

## Configuration

### Backend appsettings.json

Create `SchoolAdmissionSystem.API/appsettings.json` with the following configuration. Replace `your_db_name` and `your_password` with your local PostgreSQL database name and password.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=your_db_name;Username=postgres;Password=your_password;Command Timeout=600;"
  },
  "HoldSettings": {
    "HoldDurationSeconds": 600
  }
}
```

When running the API directly on your machine, `Host=localhost` points to your local PostgreSQL instance. Docker Compose supplies its own connection string and database host for the containerized API.

### Frontend API base URL

The frontend uses the `VITE_API_BASE_URL` environment variable if provided. Otherwise it defaults to:

```text
http://localhost:5000/api
```

If you run the backend on a different port, update the value accordingly.

## API Overview

The project exposes a REST API under the `/api` route.

### Class endpoints

- `GET /api/classes` - Get all classes
- `GET /api/classes/{classId}` - Get a specific class
- `POST /api/classes` - Create a class
- `PUT /api/classes/{classId}` - Update a class
- `DELETE /api/classes/{classId}` - Delete a class

### Hold endpoints

Student-scoped routes require an `X-Student-Id` header with a 17-digit numeric student ID.

- `POST /api/classes/{classId}/holds` - Create a hold for a student
- `GET /api/holds/me` - Get all holds for the current student
- `GET /api/holds/{holdId}` - Get hold details
- `POST /api/holds/{holdId}/confirm` - Confirm an active hold
- `DELETE /api/holds/{holdId}` - Cancel a hold

## Data Model Highlights

### Class
- `Id`
- `Name`
- `Section`
- `TotalSeats`
- `CreatedAt`
- `UpdatedAt`

### Hold
- `Id`
- `ClassId`
- `StudentId`
- `Status` (`Held`, `Confirmed`, `Expired`, `Cancelled`)
- `CreatedAt`
- `ExpiresAt`
- `UpdatedAt`

The model includes seat calculations such as held seats, confirmed seats, and available seats.

## Notes and Assumptions

This project currently assumes:

- No authentication or authorization layer is enforced in the app
- Student access is determined by the `X-Student-Id` header in demo/testing scenarios
- Admin functionality is intended for internal use or a controlled environment
- Hold expiry is managed automatically by a background service

For deeper project assumptions and implementation notes, see:

- [Project Assumptions.md](./Project%20Assumptions.md)

## Development Notes

- The backend uses EF Core migrations automatically on startup.
- Swagger is enabled in development mode.
- CORS is configured to allow common local frontend ports such as 3000, 5173, and debug ports.

