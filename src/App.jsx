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
    <div className="h-screen w-full grid grid-cols-[200px_1fr] grid-rows-[60px_1fr_auto]">
      {/* Navbar */}
      <Navbar className="col-span-2 h-full bg-gray-100" />
      
      {/* Sidebar */}
      <aside className="h-full bg-gray-50">
      </aside>

      {/* Main content */}
      <main className="h-full p-4 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer className="col-span-2 bg-gray-800" />
    </div>
  );
}

export default App;
