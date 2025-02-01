# PawKeeper

Pawkeeper is a web application that connects pet owners with pet sitters, allowing users to find and book reliable pet care services globally.

## Key Features

- **Sitter Listings:** Browse through a list of available pet sitters with user ratings and reviews.
- **Booking System:** Schedule and manage pet sitting appointments with real-time notifications.
- **Map Integration:** View sitters near your location using integrated map services.
- **User Authentication:** Secure sign-up and login features with JWT.

## Technologies Used

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB
- **Other Tools:** Mapbox for map integration

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

- **`src/`**: Contains the main source code.
  - **`components/`**: Reusable components used throughout the application.
    - **`Navbar.js`**: The navigation bar, accessible on all pages.
    - **`Footer.js`**: The footer component, featuring links and additional information.
  - **`pages/`**: Top-level pages managed by React Router for different pathways in the app.
    - **`HomePage.js`**: The homepage, serving as the landing page.
    - **`SignUpPage.js`**: The registration page for new users.
    - **`LogInPage.js`**: Allows existing users to log in.
    - **`UserPage.js`**: Displays user profiles and settings options.
    - **`NotFoundPage.js`**: The 404 error page for unavailable routes.
  - **`App.js`**: Main app component that integrates all pages and sets up routing.
  - **`index.js`**: Entry point to the app, responsible for bootstrapping the React application.
- **`public/`**: Contains static files which are served directly, including the main HTML file.
- **`assets/`**: Houses static assets like images and fonts.
- **`styles/`**: Includes CSS or SCSS files for application-wide styling.

This structured approach enables efficient navigation, making development and enhancements more manageable.
