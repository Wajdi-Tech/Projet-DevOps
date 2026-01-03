"use client"
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
const LoginModal = ({ onClose, onSignIn, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef(null);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close the modal when clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate sign-in logic here
    if (email && password) {
  const userCredentials = {
        email,
        password,
      };
      onSignIn(userCredentials); // Pass the control back to the parent component to set isSignedIn
    } else {
      toast.error("Veuillez entrer à la fois l'email et le mot de passe.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center bg-white rounded-lg shadow-md border-2 pb-4 "ref={modalRef}>
        <div className="mt-4 w-96 sm:mx-auto" >
          <form onSubmit={handleSubmit} className="space-y-6 p-10" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">
                Adresse e-mail
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={handleInputChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                 
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500">
                  Mot de passe
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={handleInputChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                 
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="text-sm flex items-center justify-between">
              <a href="#" className="font-semibold text-brand hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold bg-black leading-6 text-white shadow-sm hover:bg-gray-900  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bratext-brand"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-base text-gray-500">
          Vous n'êtes pas encore membre ?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSignupClick(); // Switch to Sign Up modal
            }}
            className="font-semibold leading-6 text-brand text-gray-800 hover:text-gray-600"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginModal;
