import "./App.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    // Debug with different background colors
    <div className="h-screen w-full grid grid-cols-5 grid-rows-5">
      {/* Navbar */}
      <nav className="col-span-5 bg-red-200">
        <Navbar />
      </nav>
      
      {/* Sidebar */}
      <aside className="col-span-2 row-span-3 bg-blue-200">
        Sidebar area
      </aside>

      {/* Main content */}
      <main className="col-span-3 row-span-3 bg-green-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="col-span-5 bg-yellow-200">
        <Footer />
      </footer>
    </div>
  );
}

export default App;