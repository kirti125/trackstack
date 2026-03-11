<div align="center">

# 🗂️ TrackStack

### A full-stack, Kanban-style issue tracking system for modern development teams

[![Live Demo](https://img.shields.io/badge/Live%20Demo-trackstack--theta.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://trackstack-theta.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-kirti125%2Ftrackstack-181717?style=for-the-badge&logo=github)](https://github.com/kirti125/trackstack)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## 📌 Overview

**TrackStack** is a full-stack project and issue management platform inspired by tools like Jira and Linear. It lets development teams create projects, assign issues, track their lifecycle through a Kanban board, and maintain a full activity log — all behind a secure, role-based authentication system.

Built as a personal project to demonstrate end-to-end full-stack engineering — from database schema design and REST API development to responsive UI and cloud deployment.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login/signup with bcrypt password hashing and protected API routes
- 👥 **Role-Based Access Control** — Distinct permissions for project owners and members
- 📋 **Project Management** — Create and manage multiple projects with member assignment
- 🐛 **Issue Tracking** — Create, assign, and manage issues with priority levels and status transitions
- 🗂️ **Kanban Board** — Visual drag-and-drop style board with status columns (To Do → In Progress → Done)
- 📝 **Activity Logs** — Full audit trail of every action taken on a project or issue
- 📱 **Responsive UI** — Works seamlessly across desktop and mobile devices

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **MongoDB Atlas** | Cloud-hosted database |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcrypt** | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| **React** | UI component library |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Context API** | Global state management |
| **Axios** | HTTP client for API calls |

### Deployment
| Service | Usage |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Database hosting |

---

## 🏗️ Architecture

```
trackstack/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Context API providers (Auth, Project)
│   │   ├── pages/           # Route-level page components
│   │   └── utils/           # Axios instance, helpers
│   └── package.json
│
└── server/                  # Node.js + Express backend
    ├── controllers/         # Route handler logic
    ├── middleware/          # Auth middleware (JWT verification)
    ├── models/              # Mongoose schemas (User, Project, Issue)
    ├── routes/              # API route definitions
    └── server.js            # Entry point
```

### System Design

```
Client (React/Vite) ──────► Vercel CDN
        │
        │ HTTPS requests (Axios)
        ▼
Server (Express/Node) ────► Render
        │
        │ Mongoose ODM
        ▼
MongoDB Atlas (Cloud DB)
```

**Request Flow:**
1. User logs in → server validates credentials → returns signed JWT
2. Client stores JWT → attaches to every subsequent API request via Axios interceptor
3. Express middleware verifies JWT on protected routes before passing to controller
4. Controllers interact with MongoDB via Mongoose models and return JSON responses

---

## 🔌 API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Create a new user account | ❌ |
| `POST` | `/login` | Login and receive JWT token | ❌ |

### Project Routes — `/api/projects`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Get all projects for current user | ✅ |
| `POST` | `/` | Create a new project | ✅ |
| `GET` | `/:id` | Get project details | ✅ |
| `PUT` | `/:id` | Update project | ✅ Owner |
| `DELETE` | `/:id` | Delete project | ✅ Owner |
| `POST` | `/:id/members` | Add member to project | ✅ Owner |

### Issue Routes — `/api/issues`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/project/:projectId` | Get all issues for a project | ✅ |
| `POST` | `/` | Create a new issue | ✅ |
| `PUT` | `/:id` | Update issue (status, assignee, etc.) | ✅ |
| `DELETE` | `/:id` | Delete an issue | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/kirti125/trackstack.git
cd trackstack
```

### 2. Set up the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### 3. Set up the Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🌐 Live Demo

The application is deployed and accessible at:

**🔗 [https://trackstack-theta.vercel.app](https://trackstack-theta.vercel.app)**

You can register a new account to explore all features, or use the following test credentials:
> *(Add test credentials here if you set up a demo account)*

---

## 📸 Screenshots

> *(Add screenshots of your Kanban board, issue detail view, login page, etc. here for maximum impact)*

---

## 🔮 Future Improvements

- [ ] Drag-and-drop issue cards between Kanban columns
- [ ] Email notifications for issue assignments
- [ ] File attachments on issues
- [ ] Due dates and priority filtering
- [ ] Real-time updates with WebSockets

---

## 👩‍💻 Author

**Kirti Yadav**
B.Tech Information Technology — NIT Kurukshetra

[![LinkedIn](https://img.shields.io/badge/LinkedIn-kirti--ydv-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kirti-ydv/)
[![GitHub](https://img.shields.io/badge/GitHub-kirti125-181717?style=flat-square&logo=github)](https://github.com/kirti125)

---

<div align="center">
  <sub>Built with ❤️ as a full-stack portfolio project</sub>
</div>
