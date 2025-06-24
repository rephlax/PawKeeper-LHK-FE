import React from 'react'
import { MapControls } from '../../Map'
import PinList from '../../Map/PinList'
import { sidebarStyles as styles } from './sidebar.styles'

const MapSidebar = ({
  user,
  socket,
  controls,
  pins,
  selectedPin,
  onPinSelect,
  handlers,
  isMapLoaded,
}) => {
  const { isCreatingPin, isCreatingReview } = controls
  const showPinList = !isCreatingPin && !isCreatingReview

  return (
    <div style={styles.container} className='bg-white'>
      <div style={styles.innerContainer}>
        <div style={styles.controlsSection}>
          <MapControls
            user={user}
            socket={socket}
            {...controls}
            userPin={pins.userPin}
            selectedPin={selectedPin}
            map={pins.map}
            isMapLoaded={isMapLoaded}
          />
        </div>

        {showPinList && (
          <div style={styles.listSection} className='bg-cream-50'>
            <div style={styles.listContent}>
              <h2 style={styles.listTitle} className='text-cream-800'>
                Available Pet Sitters
              </h2>
              <PinList
                pins={pins.allPins}
                user={user}
                selectedPin={selectedPin}
                onPinSelect={onPinSelect}
                onStartChat={handlers.startChat}
                onReview={handlers.review}
                onEdit={handlers.edit}
                onDelete={handlers.delete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapSidebar
