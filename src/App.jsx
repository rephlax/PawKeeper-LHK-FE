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
    // Main grid container
    <div className="min-h-screen grid grid-cols-[240px_1fr] grid-rows-[auto_1fr_auto]">
      <Navbar className="col-span-2" />
      
      {/* Sidebar */}
      <aside className="bg-gray-100">

      </aside>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer className="col-span-2" />
    </div>
  );
}

export default App;
