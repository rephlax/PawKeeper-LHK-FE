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
    <div className="h-screen w-full grid grid-cols-5 grid-rows-5">
      {/* Navbar - spans all 5 columns in first row */}
      <Navbar className="col-span-5 bg-gray-100" />
      
      {/* Sidebar - spans 2 columns in rows 2-4 */}
      <aside className="col-span-2 row-span-3 bg-gray-50">
        {/* Sidebar content here*/}
      </aside>

      {/* Main content - spans 3 columns in rows 2-4 */}
      <main className="col-span-3 row-span-3 p-4 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/log-in" element={<LogInPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer - spans all 5 columns in last row */}
      <Footer className="col-span-5 bg-gray-800" />
    </div>
  );
}

export default App;
