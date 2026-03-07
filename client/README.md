# TrackStack Frontend

A modern issue tracking system frontend built with React + Vite + TailwindCSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (requires backend on port 5000)
npm run dev
```

## Folder Structure

```
client/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx              # Entry point + providers
    ├── App.jsx               # Routes
    ├── api/
    │   └── axios.js          # Axios instance + API helpers
    ├── context/
    │   └── AuthContext.jsx   # JWT auth state
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   └── ProjectView.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ProjectCard.jsx
    │   ├── IssueCard.jsx
    │   ├── IssueModal.jsx
    │   ├── KanbanColumn.jsx
    │   ├── ActivityLog.jsx
    │   ├── ConfirmDialog.jsx
    │   ├── AddMemberModal.jsx
    │   └── CreateProjectModal.jsx
    ├── utils/
    │   └── constants.js
    └── styles/
        └── index.css
```

## Features

- ✅ JWT authentication with auto-attach on all requests
- ✅ Dashboard with project grid, search, create/delete
- ✅ Kanban board with drag & drop (ToDo / InProgress / Done)
- ✅ Issue CRUD with priority levels
- ✅ Assign issues to team members
- ✅ Invite members by email
- ✅ Activity log sidebar
- ✅ Priority filtering
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Loading states & empty states
- ✅ Responsive layout

## Environment

The Vite dev server proxies `/api` → `http://localhost:5000/api`.
No `.env` file needed for local development.
