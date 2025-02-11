import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places', 'marker'];

const GoogleMapsWrapper = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      mapIds={[import.meta.env.VITE_GOOGLE_MAPS_ID]}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;