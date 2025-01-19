# Course Generator App

![Course Generator Logo](src/logo.svg)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [Project Structure](#project-structure)
9. [API Endpoints](#api-endpoints)
10. [Security Considerations](#security-considerations)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

The **Course Generator App** is a sophisticated platform designed to help educators and learners create, manage, and track customized courses effortlessly. Leveraging the power of artificial intelligence, the application generates detailed course structures based on user-provided topics and descriptions. Built on the robust MERN (MongoDB, Express.js, React.js, Node.js) stack, it ensures a seamless and responsive user experience.

## Features

- **AI-Powered Course Generation:** Generate comprehensive 6-week course structures tailored to specific topics using the Groq SDK.
- **User Authentication:** Secure registration and login functionality with JWT-based authentication.
- **Profile Management:** Users can view and manage their profiles, including saved courses and progress tracking.
- **Course Viewing:** Detailed views of generated courses with week-by-week breakdowns and learning objectives.
- **Progress Tracking:** Monitor and update course completion statuses.
- **Responsive Design:** Built with React and Tailwind CSS to ensure a seamless experience across devices.
- **Caching Mechanisms:** Implements both client-side (`localStorage`) and server-side (Redis) caching for optimized performance.
- **Robust Error Handling:** Comprehensive error feedback for a smooth user experience.

## Technology Stack

- **Frontend:**
  - **React.js:** Building dynamic and responsive user interfaces.
  - **Tailwind CSS:** Utility-first CSS framework for styling.
  - **React Router:** Client-side routing for SPA navigation.
  - **Axios/Fetch API:** Handling HTTP requests.

- **Backend:**
  - **Node.js & Express.js:** Building RESTful APIs.
  - **JWT:** Secure authentication mechanism.
  - **Groq SDK:** Integrating with AI models for content generation.
  - **Bcrypt:** Password hashing for security.
  - **Cors:** Handling Cross-Origin Resource Sharing.

- **Database:**
  - **MongoDB:** NoSQL database for data storage.

- **Others:**
  - **dotenv:** Managing environment variables.
  - **Mongoose:** Object Data Modeling (ODM) for MongoDB.
  - **Redis:** (Optional) Server-side caching to enhance performance.

## Architecture

The application follows a classic **MERN stack** architecture with additional integrations for AI-driven content generation and caching mechanisms. Below is a high-level overview of the system architecture:

### High-Level Architecture Diagram

```mermaid
graph TD
%% Define the nodes
subgraph User
U[User]
end
subgraph Frontend
F[React Application]
end
subgraph Backend
B[Express Server]
B -->|Handles| BA[Auth Routes]
B -->|Handles| BC[Course Routes]
B -->|Handles| BU[User Routes]
B -->|Handles| BP[Progress Routes]
B -->|Uses| BM[Authentication Middleware]
B -->|Integrates with| LLM[LLM API (Groq SDK)]
B -->|Connects to| DB[MongoDB Database]
B -->|Caches with| CS[Redis Cache]
end
subgraph LLM_Service
L[Groq SDK / External LLM]
end
subgraph Database
DB[MongoDB]
DB -->|Stores| UCol[Users Collection]
DB -->|Stores| CCol[Courses Collection]
DB -->|Stores| PCol[Progress Collection]
end
subgraph Caching
CS[Redis Cache]
end
%% Define the edges
U -->|Interacts with| F
F -->|Sends HTTP Requests| B
B -->|Processes Requests| BA
B -->|Processes Requests| BC
B -->|Processes Requests| BU
B -->|Processes Requests| BP
B -->|Validates| BM
B -->|Generates Courses via| LLM
LLM -->|Returns Data to| B
B -->|Performs CRUD on| DB
B -->|Caches Data in| CS
F -->|Reads/Writes Cache| CS
```

### Database Schema Diagram

```mermaid
erDiagram
USERS {
ObjectId id PK
String username
String email
String password
Array<ObjectId> courses FK "References COURSES.id"
Date createdAt
Date updatedAt
}
COURSES {
ObjectId id PK
ObjectId userId FK "References USERS.id"
String name
String description
Array<Week> weeks
Date lastUpdated
Date createdAt
Date updatedAt
}
PROGRESS {
ObjectId id PK
ObjectId userId FK "References USERS.id"
ObjectId courseId FK "References COURSES.id"
Array<WeekProgress> weekProgress
Date createdAt
Date updatedAt
}
%% Sub-documents
Week {
String title
String description
Array<Topic> topics
Number order
}
Topic {
String title
String description
String content
Array<String> learningObjectives
}
WeekProgress {
ObjectId weekId FK "References COURSES.weeks.id"
Boolean completed
Date lastAccessed
}
%% Relationships
USERS ||--o{ COURSES : owns
USERS ||--o{ PROGRESS : has
COURSES ||--o{ PROGRESS : trackedBy
```

## Installation

### Prerequisites

- **Node.js:** Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **MongoDB:** Install MongoDB locally or use a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Redis (Optional):** For server-side caching, install Redis from [here](https://redis.io/download).

### Clone the Repository

```bash
git clone https://github.com/yourusername/course-generator-app.git
cd course-generator-app
```


### Setup Backend

1. **Navigate to the Backend Directory:**

    ```bash
    cd backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` File:**

    Create a `.env` file in the `backend` directory with the following variables:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    GROQ_API_KEY=your_groq_api_key
    ```

    - Replace `your_mongodb_connection_string` with your MongoDB URI.
    - Replace `your_jwt_secret` and `your_refresh_token_secret` with secure random strings.
    - Replace `your_groq_api_key` with your Groq SDK API key.

4. **Start the Backend Server:**

    ```bash
    npm start
    ```

    The backend server should now be running on `http://localhost:3000`.

### Setup Frontend

1. **Open a New Terminal and Navigate to the Frontend Directory:**

    ```bash
    cd ../src
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the Frontend Server:**

    ```bash
    npm start
    ```

    The frontend application should now be running on `http://localhost:3001` or another available port.

## Configuration

Ensure that both frontend and backend are correctly configured to communicate with each other. Adjust the API endpoints in the frontend (`src/App.js` and other components) if necessary to match the backend server's URL and port.

## Running the Application

1. **Start the Backend Server:**

    ```bash
    cd backend
    npm start
    ```

2. **Start the Frontend Server:**

    Open a new terminal window/tab, navigate to the `src` directory, and run:

    ```bash
    npm start
    ```

3. **Access the Application:**

    Open your browser and navigate to `http://localhost:3001` (or the port specified for the frontend) to interact with the Course Generator App.

## Project Structure

### Backend (`backend/`)

- **models/Course.js:** Defines MongoDB schemas for `User`, `Course`, and `Progress`.
- **middleware/authenticate.js:** Middleware for JWT authentication.
- **routes/auth.js:** Routes for user registration and login.
- **server.js:** Entry point for the Express server.

### Frontend (`src/`)

- **App.js:** Main application component managing routes and authentication state.
- **App.css & index.css:** Styling files using Tailwind CSS.
- **components/**
  - **Auth.js:** Authentication component for login and registration.
  - **NewCourse.js:** Component for generating new courses.
  - **Profile.js:** User profile component displaying saved courses.
  - **CourseView.js:** Component to view detailed course information.
- **index.js:** Entry point for the React application.
- **reportWebVitals.js & setupTests.js:** Utility files for performance monitoring and testing.

## API Endpoints

### Authentication

- **Register User**

    **Endpoint:** `POST /api/auth/register`

    **Body:**

    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```

    **Response:**

    ```json
    {
      "message": "User registered successfully"
    }
    ```

- **Login User**

    **Endpoint:** `POST /api/auth/login`

    **Body:**

    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```

    **Response:**

    ```json
    {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "john@example.com",
        "username": "john_doe"
      }
    }
    ```

### Course Management

- **Generate Course**

    **Endpoint:** `POST /api/generate-course`

    **Headers:**

    ```
    Authorization: Bearer jwt_token_here
    ```

    **Body:**

    ```json
    {
      "name": "Introduction to React",
      "description": "A course on building user interfaces using React.js"
    }
    ```

    **Response:**

    ```json
    {
      "course": {
        // Generated course structure
      }
    }
    ```

- **Add Course to Profile**

    **Endpoint:** `POST /api/courses/select`

    **Headers:**

    ```
    Authorization: Bearer jwt_token_here
    ```

    **Body:**

    ```json
    {
      "courseId": "course_id_here"
    }
    ```

    **Response:**

    ```json
    {
      "message": "Course added to your profile successfully!"
    }
    ```

### User Profile

- **Get User Profile**

    **Endpoint:** `GET /api/user/profile`

    **Headers:**

    ```
    Authorization: Bearer jwt_token_here
    ```

    **Response:**

    ```json
    {
      "user": {
        "id": "user_id",
        "username": "john_doe",
        "email": "john@example.com",
        "courses": [
          // Array of course objects
        ]
      }
    }
    ```

### Progress Tracking

- **Update Progress**

    **Endpoint:** `PUT /api/progress/update`

    **Headers:**

    ```
    Authorization: Bearer jwt_token_here
    ```

    **Body:**

    ```json
    {
      "courseId": "course_id_here",
      "weekId": "week_id_here",
      "completed": true
    }
    ```

    **Response:**

    ```json
    {
      "message": "Progress updated successfully!"
    }
    ```

## Security Considerations

- **JWT Authentication:** Utilizes JWT for secure authentication. Tokens are stored in `localStorage` for client-side access and are included in the `Authorization` header for protected routes.
- **Password Hashing:** User passwords are hashed using `bcrypt` before storage to ensure security.
- **Environment Variables:** Sensitive information such as JWT secrets and database URIs are managed using environment variables and are not exposed in the codebase.
- **CORS:** Configured using the `cors` middleware to control cross-origin requests.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

    Click the "Fork" button at the top right of this page.

2. **Clone Your Fork**

    ```bash
    git clone https://github.com/yourusername/course-generator-app.git
    cd course-generator-app
    ```

3. **Create a Branch**

    ```bash
    git checkout -b feature/YourFeatureName
    ```

4. **Make Your Changes**

5. **Commit Your Changes**

    ```bash
    git commit -m "Add some feature"
    ```

6. **Push to the Branch**

    ```bash
    git push origin feature/YourFeatureName
    ```

7. **Open a Pull Request**

    Go to the original repository and click "New Pull Request."

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq SDK](https://groq.ai/)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Mermaid](https://mermaid-js.github.io/)

---

Feel free to reach out for any queries or support!

- **Contact:** [your.email@example.com](mailto:your.email@example.com)