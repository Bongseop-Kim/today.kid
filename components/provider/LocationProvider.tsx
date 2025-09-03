import { createContext, useState } from "react";

interface LocationContextType {
  latitude: number;
  longitude: number;
  setLocation: (latitude: number, longitude: number) => void;
}

export const LocationContext = createContext<LocationContextType>({
  latitude: 0,
  longitude: 0,
  setLocation: () => {},
});

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const setLocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <LocationContext.Provider value={{ latitude, longitude, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
