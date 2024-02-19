import { createContext, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

const GeoLocationContext = createContext({});

export const GeoLocationProvider = ({ children }) => {
  const [geoLocation, setGeoLocation] = useState({});

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      setGeoLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  }, [coords]);

  const getAddressSugestions = async (query) => {
    const baseUrl = "https://nominatim.openstreetmap.org/search";
    const queryParams = `?format=json&q=${encodeURIComponent(query)}&limit=5`; // limitamos a 5 sugerencias

    try {
      const response = await fetch(baseUrl + queryParams, {
        method: "GET",
        headers: {
          "User-Agent": "YourAppName/1.0 (your-email@example.com)",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  return (
    <GeoLocationContext.Provider
      value={{ geoLocation, setGeoLocation, getAddressSugestions }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
};

export default GeoLocationContext;
