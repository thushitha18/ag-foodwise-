"use client";
import { createContext, useContext, useState, useEffect } from 'react';

export const CITIES = [
  {
    city: 'Coimbatore',
    latitude: 11.0168,
    longitude: 76.9558,
    areas: [
      'Gandhipuram', 'RS Puram', 'Saibaba Colony', 'Peelamedu', 'Singanallur',
      'Ukkadam', 'Race Course', 'Avinashi Road', 'Kalapatti', 'Saravanampatti',
      'Ganapathy', 'Kuniyamuthur', 'Vadavalli', 'Sundarapuram', 'Town Hall',
      'Brookefields', 'Ramanathapuram', 'Kovaipudur', 'Thudiyalur', 'Podanur',
    ],
  },
  {
    city: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    areas: [
      'Anna Nagar', 'T. Nagar', 'Nungambakkam', 'Adyar', 'Velachery',
      'Mylapore', 'Besant Nagar', 'Perungudi', 'Thiruvanmiyur', 'Guindy',
      'Porur', 'Kodambakkam', 'Chetpet', 'Egmore', 'Royapettah',
      'Teynampet', 'Alwarpet', 'Saidapet', 'Chromepet', 'Tambaram',
    ],
  },
];

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(CITIES[0]); // Coimbatore default

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fw_city');
      if (saved) {
        const found = CITIES.find((c) => c.city === saved);
        if (found) setCurrentCity(found);
      }
    } catch {}
  }, []);

  const setCity = (cityName) => {
    const found = CITIES.find((c) => c.city === cityName);
    if (found) {
      setCurrentCity(found);
      localStorage.setItem('fw_city', cityName);
    }
  };

  return (
    <LocationContext.Provider value={{ currentCity, setCity, cities: CITIES }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
