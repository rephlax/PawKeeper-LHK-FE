export const createMarkerElement = (type) => {
    const element = document.createElement('div');
    element.style.fontSize = '24px';
    element.innerHTML = type === 'home' ? '🏠' : '🐾';
    return element;
};
  
export const setupAdvancedMarkers = async (map, userLocation, userPin, markers, setMarkers, setSelectedPin) => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return;

    try {
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        // Create home marker
        if (userLocation && !markers.home) {
            const homeMarker = new AdvancedMarkerElement({
                map,
                position: userLocation,
                title: "Your Location",
                content: createMarkerElement('home')
            });

            homeMarker.addListener('click', () => {
                const pos = homeMarker.position;
                console.log('Home marker clicked at:', { lat: pos.lat, lng: pos.lng });
            });

            setMarkers(prev => ({ ...prev, home: homeMarker }));
        }

        // Create pin marker
        if (userPin && !markers.pin) {
            const pinMarker = new AdvancedMarkerElement({
                map,
                position: {
                    lat: userPin.location.coordinates[1],
                    lng: userPin.location.coordinates[0]
                },
                title: userPin.title,
                content: createMarkerElement('pin')
            });

            pinMarker.addListener('click', () => {
                console.log('Pin clicked:', userPin);
                setSelectedPin(userPin);
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
            lng: userPin.location.coordinates[0]
        };
    }
};