"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("usertoken");
        if (storedToken) {
            setToken(storedToken);
            setIsSignedIn(true);
        }
        setLoading(false);
    }, []);

    const login = (newToken) => {
        localStorage.setItem("usertoken", newToken);
        setToken(newToken);
        setIsSignedIn(true);
        toast.success("Connexion réussie !");
    };

    const logout = () => {
        localStorage.removeItem("usertoken");
        setToken(null);
        setIsSignedIn(false);
        toast.success("Déconnexion réussie !");
    };

    return (
        <AuthContext.Provider value={{ token, isSignedIn, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
