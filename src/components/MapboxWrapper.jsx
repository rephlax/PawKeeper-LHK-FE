import React from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapboxWrapper = ({ children }) => {
  return (
    <>
      <link
        href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
        rel='stylesheet'
      />
      {children}
    </>
  )
}

export default MapboxWrapper
