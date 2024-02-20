import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const GeoLocationContext = createContext({});

export const GeoLocationProvider = ({ children }) => {
  const [geoLocation, setGeoLocation] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation({
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
      });
    });
  }, []);

  const getGeoLocationForRegister = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocation({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        });
      },
      () => {
        toast(
          "No posees la ubicacion del navegador habilitada, debera especificar su ubicacion una vez registrado!"
        );
      }
    );
  };

  const getGeoLocationForSearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocation({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        });
      },
      () => {
        toast(
          "Debes habilitar tu ubicacion para obtener trabajadores cercanos sin haberse registrado!"
        );
      }
    );
  };

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
      value={{
        geoLocation,
        setGeoLocation,
        getAddressSugestions,
        getGeoLocationForRegister,
        getGeoLocationForSearch,
      }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
};

export default GeoLocationContext;
