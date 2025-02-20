import { useState, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { useSocket } from './context/SocketContext'
import { useMap } from './context/MapContext'
import HomePage from './pages/HomePage'
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import UserPage from './pages/UserPage'
import NotFoundPage from './pages/NotFoundPage'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import ChatWidget from './components/ChatWidget'
import PrivateRoute from './context/PrivateRoute'
import UpdateUserForm from './components/UpdateUserForm'
import PasswordChange from './components/PasswordChange'
import AddPetForm from './components/AddPetForm'
import UpdatePetForm from './components/UpdatePetForm'
import MapComponent from './components/Map/MapComponent'
import Sidebar from './components/Sidebar'
import MapErrorBoundary from './components/Map/MapErrorBoundary'

function App() {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  const [userPin, setUserPin] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  const [allPins, setAllPins] = useState([])
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [isCreatingReview, setIsCreatingReview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)

  const { user } = useAuth()
  const { socket } = useSocket()
  const { map } = useMap()

  const startChat = useCallback(
    targetUserId => {
      if (socket) {
        socket.emit('start_private_chat', { targetUserId })
      }
    },
    [socket],
  )

  const handlePinSelect = useCallback(pin => {
    setSelectedPin(pin)
    setIsCreatingPin(false)
    setIsCreatingReview(false)
    setIsEditing(false)
    setEditData(null)
  }, [])

  const resetStates = useCallback(() => {
    setIsCreatingPin(false)
    setIsCreatingReview(false)
    setIsEditing(false)
    setEditData(null)
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200'>
      {/* Background Effects */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-cream-300/30 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-cream-400/20 rounded-full blur-3xl animate-pulse'></div>
      </div>

      <div className='sticky top-0 w-full z-50'>
        <Navbar />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex relative z-10'>
        {/* Sidebar */}
        <aside className='w-64 bg-white border-r border-cream-200 shadow-sm'>
          <Sidebar
            isMapPage={isMapPage}
            userPin={userPin}
            selectedPin={selectedPin}
            allPins={allPins}
            onPinSelect={handlePinSelect}
            user={user}
            socket={socket}
            isCreatingPin={isCreatingPin}
            setIsCreatingPin={setIsCreatingPin}
            isCreatingReview={isCreatingReview}
            setIsCreatingReview={setIsCreatingReview}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editData={editData}
            setEditData={setEditData}
            startChat={startChat}
            map={map}
            resetStates={resetStates}
          />
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 bg-cream-50/80 overflow-auto'>
          {location.pathname === '/map' ? (
            <Routes>
              <Route
                path='/map'
                element={
                  <MapErrorBoundary>
                    <MapComponent
                      setUserPin={setUserPin}
                      setAllPins={setAllPins}
                      selectedPin={selectedPin}
                      setSelectedPin={handlePinSelect}
                      setEditData={setEditData}
                    />
                  </MapErrorBoundary>
                }
              />
            </Routes>
          ) : (
            <div className='min-h-full flex items-center justify-center'>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route
                  path='/users/user/:userId'
                  element={
                    <PrivateRoute>
                      <UserPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`/users/update-user/:userId`}
                  element={
                    <PrivateRoute>
                      <UpdateUserForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`/pets/add-pet/:userId`}
                  element={
                    <PrivateRoute>
                      <AddPetForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`/pets/update-pet/:userId/:petId`}
                  element={
                    <PrivateRoute>
                      <UpdatePetForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={`/users/update-user/:userId/password-change`}
                  element={
                    <PrivateRoute>
                      <PasswordChange />
                    </PrivateRoute>
                  }
                />
                <Route path='/sign-up' element={<SignUpPage />} />
                <Route path='/log-in' element={<LogInPage />} />
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className='w-full bg-white border-t border-cream-200 shadow-sm z-10'>
        <Footer />
      </div>

      {/* Chat Widget */}
      <div className='fixed bottom-0 right-0 z-50'>
        <ChatWidget />
      </div>
    </div>
  )
}

export default App
