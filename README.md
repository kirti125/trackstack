# TrackStack

TrackStack is a full-stack issue tracking and project management application designed for software development teams. It provides a centralized platform where users can create projects, manage issues, assign tasks, and track progress using a Kanban-style workflow.

The project was built to demonstrate end-to-end full-stack development, including backend API design, database modeling, authentication, frontend state management, and cloud deployment.

---

## Live Application

Live Demo:  
https://trackstack-theta.vercel.app

Source Code:  
https://github.com/kirti125/trackstack

---

## Overview

TrackStack allows development teams to organize work efficiently through projects and issues. Each project contains multiple issues that can be assigned to team members and moved through different stages of completion.

The system includes authentication, role-based access control, activity logging, and a responsive interface that works across different screen sizes.

---

## Features

Authentication and Security
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

Project Management
- Create and manage projects
- Add members to projects
- Owner-level project controls

Issue Tracking
- Create, update, and delete issues
- Assign issues to project members
- Track issue priority and status

Workflow Management
- Kanban-style issue organization
- Status transitions such as To Do, In Progress, and Done

Activity Logging
- Maintains a record of actions performed on issues and projects

Responsive Interface
- Works across desktop and mobile devices

---

## Technology Stack

Backend
- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- JSON Web Tokens (JWT)
- bcrypt

Frontend
- React
- Vite
- Tailwind CSS
- Context API for global state management
- Axios for API communication

Deployment
- Vercel for frontend hosting
- Render for backend hosting
- MongoDB Atlas for database hosting

---

## System Architecture

The application follows a typical three-tier architecture consisting of a client application, a backend API server, and a cloud-hosted database.

Client Layer  
The frontend is built with React and served using Vite. It communicates with the backend through HTTP requests using Axios.

Server Layer  
The backend is built with Node.js and Express. It exposes REST APIs that handle authentication, project management, and issue tracking.

Database Layer  
MongoDB Atlas stores users, projects, and issue data. The backend interacts with the database through Mongoose models.

---

## Project Structure

```
trackstack/
  client/
    src/
      components/
      context/
      pages/
      utils/
    package.json

  server/
    controllers/
    middleware/
    models/
    routes/
    server.js
```

Client Directory  
Contains the React frontend application.

Server Directory  
Contains the Express backend, API routes, database models, and authentication middleware.

---

## API Overview

Authentication Routes  
POST /api/auth/register  
Creates a new user account.

POST /api/auth/login  
Authenticates a user and returns a JWT token.

Project Routes  
GET /api/projects  
Returns all projects for the authenticated user.

POST /api/projects  
Creates a new project.

GET /api/projects/:id  
Returns details of a specific project.

PUT /api/projects/:id  
Updates project information.

DELETE /api/projects/:id  
Deletes a project.

POST /api/projects/:id/members  
Adds a member to a project.

Issue Routes  
GET /api/issues/project/:projectId  
Returns all issues for a specific project.

POST /api/issues  
Creates a new issue.

PUT /api/issues/:id  
Updates issue properties such as status or assignee.

DELETE /api/issues/:id  
Deletes an issue.

---

## Local Development Setup

Prerequisites
- Node.js version 18 or higher
- MongoDB Atlas account or local MongoDB instance
- Git

Clone the repository

```
git clone https://github.com/kirti125/trackstack.git
cd trackstack
```

Backend Setup

```
cd server
npm install
```

Create a `.env` file inside the server directory.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server

```
npm run dev
```

Frontend Setup

```
cd ../client
npm install
```

Create a `.env` file inside the client directory.

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server

```
npm run dev
```

The application will run at:

http://localhost:5173

---

## Author

Kirti Yadav  
B.Tech Information Technology  
National Institute of Technology Kurukshetra

GitHub: https://github.com/kirti125  
LinkedIn: https://www.linkedin.com/in/kirti-ydv/
