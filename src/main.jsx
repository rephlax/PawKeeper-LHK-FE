import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './styles/App.css'
import { AuthWrapper } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { ChatProvider } from './context/ChatContext'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import ptTranslations from './locales/pt.json'
import ukTranslations from './locales/uk.json'
import { MapProvider } from './context/MapContext.jsx'
import './styles/mapbox.css'
import 'mapbox-gl/dist/mapbox-gl.css'

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    pt: { translation: ptTranslations },
    uk: { translation: ukTranslations },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React already does escaping
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <MapProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </MapProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
