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
import UpdateUserForm from "./components/UpdateUserForm";

function App() {
  const {userId} = useContext(AuthContext) 
  return (
    <div className="h-screen flex flex-col relative bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cream-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cream-400/20 rounded-full blur-3xl"></div>
  
      <nav className="h-[80px] backdrop-blur-md bg-cream-background shrink-0 border-b border-cream-accent sticky top-0 z-50">
          <Navbar />
      </nav>
      
      <div className="flex flex-1 relative z-10">
          <aside className="w-64 backdrop-blur-md bg-cream-50/50  
                          border-r border-cream-accent text-cream-text">
              Sidebar area
          </aside>

          <main className="flex-1 backdrop-blur-md bg-cream-50/50 p-6">
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/users/user/:userId" element={<PrivateRoute><UserPage /></PrivateRoute>} />
              <Route path={`/users/update-user/:userId`} element={<PrivateRoute><UpdateUserForm /></PrivateRoute>} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/log-in" element={<LogInPage />} />
              <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </main>
      </div>

      <footer className="h-[40px] backdrop-blur-md bg-cream-50/70 shrink-0 
                        border-t border-cream-accent relative z-10">
          <Footer />
      </footer>

      <div className="relative z-50">
          <ChatWidget />
      </div>
    </div>
  );
}

export default App;