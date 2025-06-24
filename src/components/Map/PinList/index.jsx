import React from 'react'
import { MessageCircle, Edit, Trash2, Star } from 'lucide-react'
import { styles } from './PinList.styles'

const PinList = ({
  pins = [],
  user,
  selectedPin,
  onPinSelect,
  onStartChat,
  onReview,
  onEdit,
  onDelete,
}) => {
  if (pins.length === 0) {
    return (
      <div style={styles.emptyState}>No pet sitters available in this area</div>
    )
  }

  const renderActionButtons = pin => {
    const isOwnPin = pin.user._id === user?._id

    if (isOwnPin) {
      return (
        <>
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit(pin)
            }}
            style={styles.actionButton}
            className='text-cream-600 hover:bg-cream-100'
            title='Edit'
          >
            <Edit size={16} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onDelete(pin._id)
            }}
            style={styles.actionButton}
            className='text-red-500 hover:bg-red-50'
            title='Delete'
          >
            <Trash2 size={16} />
          </button>
        </>
      )
    }

    return (
      <>
        <button
          onClick={e => {
            e.stopPropagation()
            onStartChat(pin.user._id)
          }}
          style={styles.actionButton}
          className='text-cream-600 hover:bg-cream-100'
          title='Chat'
        >
          <MessageCircle size={16} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onReview(pin)
          }}
          style={styles.actionButton}
          className='text-cream-600 hover:bg-cream-100'
          title='Review'
        >
          <Star size={16} />
        </button>
      </>
    )
  }

  return (
    <div style={styles.container}>
      {pins.map(pin => (
        <div
          key={pin._id}
          style={styles.pinItem}
          className={`
            ${
              selectedPin?._id === pin._id
                ? 'bg-cream-100 border-cream-400'
                : 'bg-white border-cream-200 hover:bg-cream-50'
            }
          `}
          onClick={() => onPinSelect(pin)}
        >
          <div style={styles.pinHeader}>
            <div style={styles.pinInfo}>
              <h3 style={styles.pinTitle} className='text-cream-800'>
                {pin.title || 'Pet Sitter'}
              </h3>
              <p style={styles.pinUsername} className='text-cream-600'>
                {pin.user.username}
              </p>
              {pin.rate && (
                <p style={styles.pinRate} className='text-cream-700'>
                  ${pin.rate}/hour
                </p>
              )}
            </div>
            <div style={styles.pinActions}>{renderActionButtons(pin)}</div>
          </div>

          {pin.description && (
            <p style={styles.pinDescription} className='text-cream-700'>
              {pin.description}
            </p>
          )}

          <div style={styles.pinStats} className='text-cream-600'>
            {pin.reviews && pin.reviews.length > 0 && (
              <div style={styles.statItem}>
                <Star size={14} />
                <span>
                  {pin.averageRating || 0} ({pin.reviews.length})
                </span>
              </div>
            )}
            {pin.distance && (
              <div style={styles.statItem}>
                <span>{pin.distance.toFixed(1)} km away</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PinList
