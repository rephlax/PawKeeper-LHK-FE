import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/App.css";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <SocketProvider>
        <App />
      </SocketProvider>      
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>
);
