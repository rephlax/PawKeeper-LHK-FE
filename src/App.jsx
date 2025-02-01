import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import PrivateRoute from "./context/PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
 const {userId} = useContext(AuthContext) 
    return (
      <div className="h-screen flex flex-col">
        {/* Navbar */}
        <nav className="h-[60px] bg-red-200 shrink-0">
          <Navbar />
        </nav>
        
        {/* Middle section */}
        <div className="flex flex-1">
          <aside className="w-64 bg-blue-200">
            Sidebar area
          </aside>

          <main className="flex-1 bg-green-200">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path={`/users/user/${userId}`} element={<PrivateRoute><UserPage /></PrivateRoute>} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LogInPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <footer className="h-[60px] bg-yellow-200 shrink-0">
          <Footer />
        </footer>

        {/* Chat Widget */}
        <div className="fixed bottom-16 right-4 z-50">
          <ChatWidget />
        </div>
      </div>
    );
}

export default App;