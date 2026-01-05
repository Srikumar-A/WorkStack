# WorkStack

A comprehensive project and task management platform designed to help teams collaborate, organize projects, and track progress through quests (tasks). WorkStack provides tools for managing organizations, teams, projects, and individual tasks with a modern web interface. The app was created as internal tool for my firm.

## 📋 Project Overview

WorkStack is a full-stack web application that enables users to:
- Create and manage organizations
- Form and manage teams within organizations
- Create and track projects with timelines
- Break down projects into quests (tasks) with assignments
- Track user authentication and authorization
- Collaborate with team members
- Monitor progress through Gantt charts and dashboards

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2.7
- **API**: Django REST Framework
- **Database**: SQLite (Development)
- **Authentication**: Token-based authentication (DRF Token)
- **Middleware**: CORS Support (corsheaders)
- **Language**: Python

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Bootstrap 5.3.8, Emotion (CSS-in-JS)
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **State Management**: Redux (implied by store.js)
- **PWA Support**: Vite PWA Plugin
- **Language**: JavaScript (ESM)

## 📁 Project Structure

```
WorkStack/
├── backend/
│   └── workStackBackend/          # Django project root
│       ├── auth_master/           # User authentication & management
│       ├── organization/          # Organization management
│       ├── projects/              # Project management
│       ├── quests/                # Task/Quest management
│       ├── teams/                 # Team management
│       └── workStackBackend/      # Django settings & configuration
│
└── frontend/
    └── workStackFrontend/         # React application root
        ├── src/
        │   ├── app/               # Core app components & routing
        │   ├── components/        # Reusable UI components
        │   │   ├── GanttChart/    # Gantt chart visualization
        │   │   ├── MemberCard/    # Member display component
        │   │   └── Navbar/        # Navigation bar
        │   ├── features/          # Feature-specific pages
        │   │   ├── auth/          # Login & registration
        │   │   ├── Dashboard/     # Main dashboard
        │   │   ├── Organization/  # Organization management
        │   │   ├── Projects/      # Project management
        │   │   ├── Quests/        # Quest/task management
        │   │   ├── Teams/         # Team management
        │   │   └── account/       # User account page
        │   ├── services/          # API service clients
        │   ├── styles/            # Global styles
        │   └── main.jsx           # Entry point
        ├── public/                # Static assets
        └── vite.config.js         # Vite configuration
```

## 🗂️ Backend Architecture

### Apps

1. **auth_master** - User authentication and custom user model
   - Custom User model extending AbstractUser
   - Token-based authentication
   - User-Organization and User-Team relationships

2. **organization** - Organization management
   - Organization creation and management
   - Organization membership
   - Access control for organization members

3. **projects** - Project management
   - Project creation with start/end dates
   - Project assignment to teams
   - Project creator tracking

4. **quests** - Task/Quest management
   - Quest (task) creation within projects
   - Quest status tracking (Pending, In Progress, Completed)
   - Quest assignment to users
   - Quest organization and team associations

5. **teams** - Team management
   - Team creation within organizations
   - Team member management
   - Team-Project and Team-Quest associations

## 🎨 Frontend Architecture

### Key Components

- **Navbar** - Main navigation
- **GanttChart** - Visual project timeline representation
- **MemberCard** - Display member information
- **MemberModal** - Modal for managing team members

### Pages/Features

- **Auth** - Login and registration flows
- **Dashboard** - Overview of user's projects, quests, and teams
- **Organization** - Organization management and member requests
- **Projects** - Create and manage projects, view Gantt charts
- **Quests** - View and manage assigned quests
- **Teams** - Team management and member invitation
- **Account** - User account settings

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (Backend)
- Node.js 18+ (Frontend)
- npm or yarn (Frontend package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/workStackBackend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/workStackFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` - to be deployed soon.

## 📦 Dependencies

### Backend
- Django 5.2.7
- Django REST Framework
- django-cors-headers
- (See requirements.txt or pipenv file for complete list)

### Frontend
- react@19.2.0
- react-dom@19.2.0
- react-router-dom@7.11.0
- axios@1.13.2
- bootstrap@5.3.8
- react-bootstrap@2.10.10
- @emotion/react & @emotion/styled
- vite@7.2.4
- vite-plugin-pwa@1.2.0

## 🔐 Authentication

- Token-based authentication using Django REST Framework
- Each user automatically receives an auth token upon creation
- Tokens used for API requests between frontend and backend

## 📡 API Structure

The backend exposes RESTful APIs for each app:
- `/api/auth/` - Authentication endpoints
- `/api/organizations/` - Organization endpoints
- `/api/projects/` - Project endpoints
- `/api/quests/` - Quest endpoints
- `/api/teams/` - Team endpoints

## 🔄 Key Data Models

### User
- Extends Django's AbstractUser
- Associated with an Organization
- Can be member of multiple Teams
- Can create and be assigned Quests

### Organization
- Container for teams and projects
- Manages organization-level permissions
- Has members with different access levels

### Project
- Belongs to a Team
- Has start and end dates
- Contains multiple Quests
- Created by a User

### Quest
- Belongs to a Project
- Has status (Pending, In Progress, Completed)
- Assigned to a User
- Has deadline
- Created by a User

### Team
- Belongs to an Organization
- Contains multiple Users as members
- Can have Projects and Quests

## 🎯 Features

- ✅ User authentication and authorization
- ✅ Organization management
- ✅ Team creation and member management
- ✅ Project creation with timelines
- ✅ Task (Quest) management with status tracking
- ✅ Gantt chart visualization
- ✅ Dashboard overview
- ✅ Member invitation and requests

## 🛣️ Roadmap (Potential)

- [ ] Messaging channels for teams and projects
- [ ] Real-time collaboration features
- [ ] Advanced reporting and analytics
- [ ] File attachments to quests
- [ ] Notifications system
- [ ] User activity timeline
- [ ] Performance metrics and insights
- [ ] Mobile app

## 📝 License

None

## 👥 Contributors



##  Contact & Support
arivlagansrikumar@gmail.com

---
