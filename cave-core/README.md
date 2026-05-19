# CAVE-CORE Platform

CAVE-CORE is a scalable MERN-stack web application designed for hierarchical organizational management. It features a robust 4-tier organizational hierarchy (Head to District), an advanced Role-Based Access Control (RBAC) system with multi-factor authentication, and an "Ultra-Builder" form engine with automated data aggregation.

## 🚀 Key Features

- **Hierarchical Management:** 4-tier architecture (Head > Region > Zone > District) for robust organizational structuring.
- **Advanced Authentication:** Secure login supporting traditional Email/Password, OTP-based verification, and Google SSO authentication.
- **Ultra-Builder Form Engine:** Custom form builder supporting 2-level nesting and role-based assignments.
- **Gravity Roll-ups:** Automated data aggregation engine where parent offices dynamically sum data from child districts.
- **Modern UI/UX:** A responsive, mobile-first design with premium aesthetics, glassmorphism effects, and a dynamic dark/light mode toggle.
- **Bulk Data Operations:** Seamless bulk import via CSV for both offices and users.

## 🏗️ Architecture & Tech Stack

### Frontend (`/frontend`)
The client-side application is built for high performance and state management using modern tools:
- **Framework:** React 19 via Vite
- **State Management:** Redux Toolkit (`react-redux`)
- **Routing:** React Router DOM v7
- **Network Requests:** Axios
- **Authentication:** Google OAuth (`@react-oauth/google`)

### Backend (`/backend`)
The server provides a robust API to handle complex hierarchy traversals and data aggregation:
- **Environment:** Node.js with Express.js
- **Database:** MongoDB with Mongoose (using ancestor arrays to optimize hierarchy traversals)
- **Security:** JWT (`jsonwebtoken`), `bcryptjs`, Google Auth Library
- **Utilities:** `multer` (file uploads), `csv-parser` (bulk data processing)

## 🔑 Demo Credentials

Once the backend is initialized and seeded, you can log in to the system using the following default administrator credentials:

- **Username / Email:** `admin@cavecore.app`
- **Password:** `Admin@123`

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Database (Local or MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd cave-core/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with necessary environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, Google Client IDs).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd cave-core/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📝 Scripts

- **Frontend:**
  - `npm run dev`: Starts the Vite development server.
  - `npm run build`: Builds the app for production.
  - `npm run deploy`: Deploys the built app to GitHub Pages.
- **Backend:**
  - `npm run dev`: Starts the backend server with watch mode using native Node.js watch feature.
  - `npm start`: Starts the standard Node.js server.

## 🛡️ License

This project is licensed under the ISC License.
