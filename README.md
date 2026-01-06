# PawKeeper

Pawkeeper is a web application that connects pet owners with pet sitters, allowing users to find and book reliable pet care services globally.

**Backend Repository:** [Backend Repository](https://github.com/rephlax/PawKeeper-LHK-BE)

## Key Features

- **Sitter Listings:** Browse through a list of available pet sitters with user ratings and reviews.
- **Booking System:** Schedule and manage pet sitting appointments with real-time notifications.
- **Map Integration:** View sitters near your location using integrated map services.
- **User Authentication:** Secure sign-up and login features with JWT.

## Technologies Used

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB
- **Other Tools:** Mapbox for map integration Swagger for API documentation

## Setup Instructions

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository

Clone the repository to your local machine using HTTPS, SSH, or GitHub CLI:

```bash
git clone https://github.com/rephlax/PawKeeper-LHK-FE.git
```

### 2. Navigate to the Project Directory

Use the terminal to move into the project directory:

```bash
cd PawKeeper-LHK-FE
```

### 3. Install Dependencies

Once in the project directory, install the necessary dependencies with npm:

```bash
npm install
```

### 4. Run the Development Server

Start the development server to interact with the application locally:

```bash
npm run dev
```

By default, the application will be available at <http://localhost:5173>. Open this URL in your web browser to explore and interact with the app.

## Project Structure

This project is organized into several key directories, making it modular and easy to navigate:

```text
PawKeeper-LHK-FE/
├── src/
│   ├── assets/              # Static assets (images, logos)
│   │   ├── defaultPet.png
│   │   ├── defaultUser.png
│   │   └── logo.png
│   ├── components/          # Reusable React components
│   │   ├── Chat/           # Chat-related components
│   │   │   ├── ActiveChats/
│   │   │   ├── ChatInvitations/
│   │   │   ├── ChatWidget/
│   │   │   ├── CreateRoomModal/
│   │   │   ├── MessageInput/
│   │   │   ├── Messages/
│   │   │   ├── RoomList/
│   │   │   └── UserList/
│   │   ├── Common/         # Shared/common components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── LanguageSwitcher/
│   │   │   ├── Loading/
│   │   │   ├── FormStyles.js
│   │   │   └── index.js
│   │   ├── Layout/         # Layout components
│   │   │   ├── Footer/
│   │   │   ├── MainLayout/
│   │   │   ├── Navbar/
│   │   │   ├── PageWrapper/
│   │   │   └── index.js
│   │   ├── Map/            # Map-related components
│   │   │   ├── MapComponent/
│   │   │   ├── MapControls/
│   │   │   ├── MapErrorBoundary/
│   │   │   ├── PinList/
│   │   │   ├── utils/      # Map utility functions
│   │   │   └── index.js
│   │   ├── Pet/            # Pet-related components
│   │   │   ├── AddPetForm/
│   │   │   ├── UpdatePetForm/
│   │   │   └── index.js
│   │   ├── Sidebar/        # Sidebar components
│   │   │   ├── components/ # Sidebar sub-components
│   │   │   ├── hooks/      # Sidebar-specific hooks
│   │   │   ├── MapSidebar.jsx
│   │   │   ├── RegularSidebar.jsx
│   │   │   ├── SidebarContainer.jsx
│   │   │   └── sidebar.styles.js
│   │   └── User/           # User-related components
│   │       ├── PasswordChange/
│   │       ├── UpdateUserForm/
│   │       └── index.js
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   ├── MapContext.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useMapbox.js
│   ├── locales/            # Internationalization files
│   │   ├── en.json
│   │   ├── pt.json
│   │   └── uk.json
│   ├── pages/              # Top-level page components
│   │   ├── HomePage.jsx
│   │   ├── LogInPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── UserPage.jsx
│   ├── styles/             # Global CSS styles
│   │   ├── App.css
│   │   ├── index.css
│   │   └── mapbox.css
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Application entry point
├── public/                 # Static public files
│   └── _redirects          # Netlify redirects configuration
├── dist/                   # Build output directory
├── node_modules/           # Dependencies
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies and scripts
├── netlify.toml            # Netlify deployment configuration
└── README.md               # Project documentation
```

### Key Directories

- **`src/components/`**: Organized by feature domain (Chat, Map, Pet, User) with shared components in Common and Layout
- **`src/context/`**: React Context providers for global state management (Auth, Chat, Map, Socket)
- **`src/hooks/`**: Custom React hooks for reusable logic
- **`src/locales/`**: Translation files for internationalization (English, Portuguese, Ukrainian)
- **`src/pages/`**: Top-level page components managed by React Router
- **`src/styles/`**: Global CSS stylesheets

This structured approach enables efficient navigation and makes development and enhancements more manageable.
