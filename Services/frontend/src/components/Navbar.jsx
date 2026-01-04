"use client";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import axios from "axios";
import { useCart } from "../app/context/CartContext";
import { useAuth } from "../app/context/AuthContext";
import ProfileModal from "./ProfileModal";

const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:5000/api/auth";

const Navbar = () => {
  const { clientTotalItems } = useCart();
  const { isSignedIn, token, login } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Login modal
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profile dropdown
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleProfileMenu = () => {
    if (isSignedIn) {
      setIsProfileMenuOpen(true);
    } else {
      setIsProfileOpen(true);
    }
  };

  const toggleSignup = () => {
    setIsProfileOpen(false);
    setIsSignUpOpen(!isSignUpOpen);
  };

  const toggleLogin = () => {
    setIsSignUpOpen(false);
    setIsProfileOpen(!isProfileOpen);
  };



  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "New Arrivals", href: "/NewArrivals" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? "glass shadow-sm py-4" : "bg-white/50 backdrop-blur-md py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
                  T
                </div>
                TechHub
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-secondary"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search Trigger (Mock) */}
              <button className="text-secondary hover:text-foreground transition-colors">
                <FiSearch size={20} />
              </button>

              {/* Cart */}
              <button
                className="relative text-secondary hover:text-foreground transition-colors"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <FiShoppingCart size={20} />
                {clientTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                    {clientTotalItems}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-border">
                  <FaUser className="text-sm" />
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="mr-4 relative text-secondary"
              >
                <FiShoppingCart size={24} />
                {clientTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {clientTotalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-border shadow-lg animate-fade-in">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-secondary hover:bg-accent hover:text-foreground"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    toggleProfileMenu();
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-accent"
                >
                  <FaUser className="mr-3" />
                  {isSignedIn ? "My Account" : "Log In"}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacing for fixed navbar */}
      <div className="h-20" />

      {/* Modals */}
      {isCartOpen && <Cart closeCart={() => setIsCartOpen(false)} toggleLogin={toggleLogin} />}

      <AuthModal
        isOpen={isProfileOpen || isSignUpOpen} // Open if either "Login" or "Signup" was triggered
        onClose={() => {
          setIsProfileOpen(false);
          setIsSignUpOpen(false);
        }}
        initialMode={isSignUpOpen ? 'signup' : 'login'}
      />

      {isProfileMenuOpen && isSignedIn && (
        <ProfileModal onClose={() => setIsProfileMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
