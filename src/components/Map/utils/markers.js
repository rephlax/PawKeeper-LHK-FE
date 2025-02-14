export const createMarkerElement = (type, isUserLocation = false) => {
  const element = document.createElement('div');
  element.style.fontSize = '24px';
  element.innerHTML = isUserLocation ? '🏠' : '🐾';
  return element;
};

export const setupAdvancedMarkers = async (
  map,
  userLocation,
  userPin,
  markers,
  setMarkers,
  setSelectedPin,
  currentUser
) => {
  if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

  try {
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

    // Home marker creaation at their own location.
    if (userLocation && !markers.home) {
      const homeMarker = new AdvancedMarkerElement({
        map,
        position: userLocation,
        title: currentUser?.sitter ? 'Your Sitter Location' : 'Your Location',
        content: createMarkerElement('home', true),
      });

      homeMarker.addListener('click', () => {
        console.log('Home location clicked');
        // If user is a sitter, show their pin or that they need to register through the form.
        if (currentUser?.sitter) {
          setSelectedPin({
            user: currentUser._id,
            location: {
              coordinates: [userLocation.lng, userLocation.lat],
            },
            ...userPin,
          });
        }
      });

      setMarkers(prev => ({ ...prev, home: homeMarker }));
    }

    // Section to create pin marker for sitter
    if (userPin && currentUser?.sitter) {
      const pinMarker = new AdvancedMarkerElement({
        map,
        position: {
          lat: userPin.location.coordinates[1],
          lng: userPin.location.coordinates[0],
        },
        title: userPin.title,
        content: createMarkerElement('pin', false),
      });

      pinMarker.addListener('click', () => {
        console.log('Sitter pin clicked:', userPin);
        setSelectedPin({
          ...userPin,
          user: currentUser._id,
        });
      });

      setMarkers(prev => ({ ...prev, pin: pinMarker }));
    }
  } catch (error) {
    console.error('Error setting up markers:', error);
  }
};

export const updateMarkerPositions = (markers, userLocation, userPin) => {
  if (markers.home && userLocation) {
    markers.home.position = userLocation;
  }
  if (markers.pin && userPin) {
    markers.pin.position = {
      lat: userPin.location.coordinates[1],
      lng: userPin.location.coordinates[0],
    };
  }
};
