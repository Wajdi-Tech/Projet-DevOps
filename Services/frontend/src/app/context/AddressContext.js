"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AddressContext = createContext();

// Provider Component
export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState({
    address: "",
    city: "",
    zip: "",
  });

  // Load address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Update Address Function
  const saveAddress = (newAddress) => {
    setAddress(newAddress);
    localStorage.setItem("shippingAddress", JSON.stringify(newAddress)); // Save to localStorage
  };

  return (
    <AddressContext.Provider value={{ address, saveAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

// Custom Hook to use Context
export const useAddress = () => {
  return useContext(AddressContext);
};
