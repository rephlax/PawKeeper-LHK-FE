import "./App.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar - fixed at top */}
      <nav className="h-[60px] bg-red-200 w-full">
        <Navbar />
      </nav>
      
      {/* Middle section container */}
      <div className="flex flex-1 min-h-0"> {/* min-h-0 prevents overflow */}
        {/* Sidebar - between navbar and footer */}
        <aside className="w-[200px] bg-blue-200">
          Sidebar area
        </aside>

        {/* Main content - takes remaining width */}
        <main className="flex-1 bg-green-200">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/log-in" element={<LogInPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer - fixed at bottom */}
      <footer className="h-[60px] bg-yellow-200 w-full">
        <Footer />
      </footer>

      <ChatWidget />
    </div>
  );
}

export default App;