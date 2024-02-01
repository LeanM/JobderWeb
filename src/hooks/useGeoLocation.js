import { useContext } from "react";
import GeoLocationContext from "../context/GeoLocationProvider";

const useGeoLocation = () => {
  return useContext(GeoLocationContext);
};

export default useGeoLocation;
