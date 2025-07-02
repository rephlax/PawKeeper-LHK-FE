import { useState, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { useSocket } from './context/SocketContext'
import { useMap } from './context/MapContext'
import HomePage from './pages/HomePage'
import LogInPage from './pages/LogInPage'
import SignUpPage from './pages/SignUpPage'
import UserPage from './pages/UserPage'
import NotFoundPage from './pages/NotFoundPage'
import Footer from './components/Layout/Footer/index'
import Navbar from './components/Layout/Navbar/index'
import { Routes, Route, useLocation } from 'react-router-dom'
import ChatWidget from './components/Chat/ChatWidget/index'
import PrivateRoute from './context/PrivateRoute'
import UpdateUserForm from './components/User/UpdateUserForm/index'
import PasswordChange from './components/User/PasswordChange'
import AddPetForm from './components/Pet/AddPetForm'
import UpdatePetForm from './components/Pet/UpdatePetForm'
import MapComponent from './components/Map/MapComponent'
import Sidebar from './components/Sidebar/RegularSidebar'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        {/* Sidebar Toggle Arrow for Mobile */}
        {!sidebarOpen && (
          <button
            className='sm:hidden fixed top-1/2 left-0 z-50 bg-cream-500 border border-cream-200 rounded-r-md p-2 shadow-md focus:outline-none transform -translate-y-1/2'
            aria-label='Open sidebar'
            onClick={() => setSidebarOpen(true)}
          >
            {/* Right Arrow Icon */}
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='white'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <aside className='hidden sm:block w-40 md:w-56 lg:w-64 xl:w-72 bg-white border-r border-cream-200 shadow-sm'>
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

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <>
            {/* Sidebar Drawer with smooth transition and transparent overlay */}
            <aside
              className={`fixed top-0 left-0 h-full w-4/5 max-w-xs sm:max-w-sm md:max-w-md bg-white border-r border-cream-200 shadow-lg z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
              style={{ willChange: 'transform' }}
            >
              <button
                className='absolute top-2 right-2 p-2 rounded-md bg-cream-500 hover:bg-cream-600 focus:outline-none'
                aria-label='Close sidebar'
                onClick={() => setSidebarOpen(false)}
              >
                {/* Left Arrow Icon */}
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <button
                className='absolute top-1/2 -right-6 z-50 p-2 rounded-full bg-cream-500 hover:bg-cream-600 shadow-md focus:outline-none transform -translate-y-1/2 sm:hidden'
                aria-label='Close sidebar'
                onClick={() => setSidebarOpen(false)}
              >
                {/* Left Arrow Icon */}
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
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
            {/* Transparent overlay for click-away, but not darkening the background */}
            <div
              className='fixed inset-0 z-40 cursor-pointer'
              style={{ background: 'transparent' }}
              onClick={() => setSidebarOpen(false)}
            ></div>
          </>
        )}

        {/* Main Content Area */}
        <main className='flex-1 bg-cream-50/80 overflow-y-auto max-h-[calc(100vh-8rem)] px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12'>
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
            <div className='w-full min-h-full flex items-center justify-center'>
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
