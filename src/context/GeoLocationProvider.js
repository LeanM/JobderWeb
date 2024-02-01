import { createContext, useEffect, useState } from "react";

const GeoLocationContext = createContext({});

export const GeoLocationProvider = ({ children }) => {
  const [geoLocation, setGeoLocation] = useState({});

  return (
    <GeoLocationContext.Provider value={{ geoLocation, setGeoLocation }}>
      {children}
    </GeoLocationContext.Provider>
  );
};

export default GeoLocationContext;
