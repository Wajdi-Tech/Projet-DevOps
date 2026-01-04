"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        authServiceUrl: "http://localhost:5000/api/auth",
        productServiceUrl: "http://localhost:4000/products",
        orderServiceUrl: "http://localhost:5100/api"
    });
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        fetch("/config.json")
            .then((res) => res.json())
            .then((data) => {
                setConfig(data);
                setConfigLoaded(true);
            })
            .catch((err) => {
                console.error("Failed to load config.json", err);
                setConfigLoaded(true); // Proceed with defaults
            });
    }, []);

    return (
        <ConfigContext.Provider value={{ config, configLoaded }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
