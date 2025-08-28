import React, { useState, useEffect } from 'react';

function LocationTracker() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setError(null);
                },
                (err) => {
                    setError(err.message);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div>
            {location ? (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            ) : (
                <p>Fetching location...</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default LocationTracker;