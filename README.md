# FIDO Spark ✨

**Ignite Your Journey - An interactive onboarding web app for new hires at FIDO.**

FIDO Spark is designed to provide a welcoming, engaging, and informative onboarding experience for new employees at FIDO. It aims to help new hires quickly get acquainted with the company culture, essential knowledge, and their new roles through interactive learning modules, quizzes, and personalized content.

## 🚀 Key Features

*   **Interactive Learning Modules:** Structured content to guide new hires through essential information. (Content sourced from `src/data/learningData.js` and `src/data/departmentalLearningData.js`)
*   **Engaging Quizzes:** Test understanding and reinforce learning. (Quiz content from `src/data/quizData.js`)
*   **Personalized Onboarding Paths:** Delivers tailored content, potentially based on department or role. (Data from `src/data/tailoredContentData.js`)
*   **User Authentication:** Separate login flows for regular users and administrators. User state managed via `localStorage`.
*   **Admin Dashboard:** A dedicated view for administrators. (Currently allows login and view navigation; further functionalities can be expanded).
*   **User Scores & Progress:** Allows users to see their progress or scores (details in `UserScoresView.jsx`).
*   **Rich User Interface:** Modern and dynamic UI built with React, styled with Tailwind CSS, and enhanced with animations from Framer Motion, including custom cursors and animated backgrounds.
*   **Multiple Views:**
    *   Login / Admin Login
    *   Welcome Message
    *   Home Dashboard
    *   Learning Mode (sections overview and content display)
    *   Quiz View
    *   Game View (currently a placeholder)
    *   User Scores
    *   Admin Dashboard

## 🛠️ Tech Stack

*   **Frontend:** React (v18.2.0), Vite
*   **Styling:** Tailwind CSS (v3.3.3), PostCSS, plain CSS (`App.css`, `index.css`)
*   **Animations:** Framer Motion (v12.11.3)
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Routing/View Management:** Custom logic within `App.jsx`
*   **Linting:** ESLint (v8.45.0)
*   **Development Tools:** `@vitejs/plugin-react`
*   **Data Management:** Static JavaScript files in `src/data` for learning content, quizzes, etc.

## 📂 Project Structure

```
fido-spark/
├── public/               # Static assets (e.g., favicon, images)
├── src/
│   ├── assets/           # Project-specific static assets like images, svgs
│   ├── components/       # Reusable React components (e.g., LearningMode, QuizView, AdminDashboard)
│   ├── data/             # Static data for quizzes, learning modules, etc.
│   ├── App.jsx           # Main application component, handles routing and core logic
│   ├── main.jsx          # Entry point of the React application
│   ├── index.css         # Global styles and TailwindCSS base/component styles
│   └── App.css           # Specific styles for App.jsx
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── eslint.config.js      # ESLint configuration
├── index.html            # Main HTML entry point for Vite
├── package.json          # Project metadata, dependencies, and scripts
├── postcss.config.js     # PostCSS configuration (often used with Tailwind CSS)
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## ⚙️ Getting Started

### Prerequisites

*   Node.js (v16+ recommended)
*   npm (v8+) or yarn (v1.22+)

### Installation

1.  Clone the repository (if applicable).
2.  Navigate to the project directory:
    ```bash
    cd fido-spark
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Running the Application

*   **Development Server:** To run the app in development mode with hot reloading:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173` (or the port specified by Vite).

*   **Production Build:** To create an optimized production build:
    ```bash
    npm run build
    ```
    or
    ```bash
    yarn build
    ```
    The build artifacts will be in the `dist/` directory.

*   **Preview Production Build:** To serve the production build locally:
    ```bash
    npm run preview
    ```
    or
    ```bash
    yarn preview
    ```

*   **Linting:** To check for code quality and style issues:
    ```bash
    npm run lint
    ```
    or
    ```bash
    yarn lint
    ```

## 🔑 Login Information

*   **Regular User:**
    *   On the main login screen, enter any name and click "Login / Start".
*   **Admin User:**
    *   On the main login screen, click the "⚙️ Admin Access" button.
    *   **Username:** `admin`
    *   **Password:** `password123`
    *   **Note:** These are hardcoded credentials for development purposes. For a production environment, these should be replaced with a secure authentication system.

## 📜 Available Scripts

The `package.json` defines the following scripts:

*   `"dev"`: Starts the Vite development server.
*   `"build"`: Builds the application for production.
*   `"lint"`: Runs ESLint to analyze the code for potential errors and style issues.
*   `"preview"`: Serves the production build locally for previewing.

## 💡 Future Enhancements & To-Do

*   **Game Module:** Implement the interactive game planned in `GameView.jsx`.
*   **Full Admin Capabilities:** Expand the Admin Dashboard with features like content management (learning modules, quizzes), user management, and analytics.
*   **Database Integration:** Replace `localStorage` and static data files with a robust backend and database for persistent storage of user data, progress, and scores.
*   **API Integration:** Fetch onboarding content, user data, etc., from a dedicated API.
*   **Advanced Personalization:** Enhance content tailoring based on user roles, departments, or pre-assessment results.
*   **Accessibility (a11y):** Conduct a thorough accessibility audit and implement improvements to ensure the app is usable by people with disabilities.
*   **Comprehensive Testing:** Add unit, integration, and end-to-end tests.
*   **Deployment Strategy:** Define and document the deployment process.

---

This README provides a comprehensive overview of the FIDO Spark project. If you have any questions or suggestions, feel free to contribute!
