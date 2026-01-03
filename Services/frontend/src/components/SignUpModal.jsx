"use client"
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
const SignUpModal = ({ onClose, onSignUp,onLoginClick }) => {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (name === "firstName") setfirstName(value);
    else if (name === "lastName") setlastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstName&&lastName&&email && password && confirmPassword) {
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }

      // Simulate an API call for sign-up (You should replace this with actual sign-up logic)
      const userCredentials = {
        firstName,
        lastName,
        email,
        password,
      };

      // On successful sign-up, call onSignUp
      onSignUp(userCredentials); // Pass the credentials back to the parent component for handling
    } else {
      toast.error("Veuillez remplir tous les champs.");
    }
  };

  return (
    <div className="flex flex-col justify-center bg-white rounded-lg shadow-md border-2 pb-4" ref={modalRef}>
      <div className="mt-4 w-96 sm:mx-auto" >
        <form onSubmit={handleSubmit} className="space-y-6 p-10" method="POST">
            <div className="flex gap-4">
             <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-500">
Prénom
            </label>
            <div className="mt-2">
              <input
                value={firstName}
                onChange={handleInputChange}
                id="firstName"
                name="firstName"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              />
            </div>
          </div>
           <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-500">
Nom
            </label>
            <div className="mt-2">
              <input
                value={lastName}
                onChange={handleInputChange}
                id="lastName"
                name="lastName"
                type="text"
                
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
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
                
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-500">
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
                autoComplete="new-password"
                
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-500">
                Confirmer le mot de passe
              </label>
            </div>
            <div className="mt-2">
              <input
                value={confirmPassword}
                onChange={handleInputChange}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              />
            </div>
          </div>

       

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-base text-gray-500">
        Vous avez déjà un compte ?
        <a href="#" className="font-semibold leading-6 text-brand text-gray-800 hover:text-gray-600" 
         onClick={(e) => {
              e.preventDefault();
              onLoginClick(); // Switch to Sign Up modal
            }}>
          {" "}
          Se connecter
        </a>
      </p>
    </div>
  );
};

export default SignUpModal;
