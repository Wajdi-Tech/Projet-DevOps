"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
    FiCheckCircle,
    FiMapPin,
    FiCreditCard,
    FiLock,
    FiTruck,
    FiShield
} from "react-icons/fi";

import { useConfig } from "../context/ConfigContext";

const CheckoutPage = () => {
    const { config } = useConfig();
    const { cart, totalPrice, clearCart } = useCart();
    const { token, isSignedIn } = useAuth();
    const { address, saveAddress } = useAddress(); // Use global address state
    const router = useRouter();

    // Local state to manage form fields (pre-filled from Context)
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        zip: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Pre-fill address data if available
    useEffect(() => {
        if (address) {
            setFormData(prev => ({
                ...prev,
                ...address
            }));
        }
    }, [address]);

    // Redirect if cart is empty
    useEffect(() => {
        if (!mounted) return;

        // Small delay to allow hydration
        const timer = setTimeout(() => {
            if (cart.length === 0 && !showSuccessModal) {
                toast("Your cart is empty", { icon: '🛒' });
                // router.push('/'); // Optional: redirect
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [cart, showSuccessModal, router, mounted]);

    if (!mounted) return null; // or a loading spinner

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Simple formatting logic
        if (name === "cardNumber") formattedValue = value.replace(/\D/g, '').slice(0, 16);
        if (name === "cvv") formattedValue = value.replace(/\D/g, '').slice(0, 3);
        if (name === "expiry") formattedValue = value.length === 2 && formData.expiry.length === 1 ? value + '/' : value;

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.zip.trim()) newErrors.zip = "ZIP Code is required";
        if (formData.cardNumber.length < 16) newErrors.cardNumber = "Invalid Card Number";
        if (!formData.expiry.trim()) newErrors.expiry = "Expiry required";
        if (formData.cvv.length < 3) newErrors.cvv = "Invalid CVV";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!isSignedIn) {
            toast.error("Please sign in to complete your order.");
            return;
        }

        setIsProcessing(true);

        // Update global address context
        saveAddress({
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            fullName: formData.fullName
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Match backend schema (Order.js & orderRoutes.js)
        // 1. Backend expects 'token' in body
        // 2. Backend expects 'items' (not products) with ID, Name, Price
        // 3. Backend expects 'address' (not shipping_address)
        const orderData = {
            token: token, // Required by backend POST /order
            items: cart.map((item) => ({
                ID: item.ID,
                Name: item.Name, // Required by Schema
                quantity: item.quantity,
                Price: item.Price // Required by Schema
            })),
            address: {
                address: formData.address,
                city: formData.city,
                zip: formData.zip,
                // fullName is not in Order.js schema but harmless to send
            },
            total: totalPrice,
        };

        try {
            // Correct URL: POST /api/order (singular, based on orderRoutes.js)
            const response = await axios.post(
                `${config.orderServiceUrl}/api/order`,
                orderData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 201) {
                clearCart();
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error("Order failed:", error);
            const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (showSuccessModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                    <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500 shadow-sm">
                        <FiCheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Order Confirmed!</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                        Your package is being prepared. We've sent a confirmation email to your inbox.
                    </p>
                    <div className="space-y-3">
                        <Link href="/orders" className="block w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
                            Track My Order
                        </Link>
                        <Link href="/" className="block w-full py-4 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-foreground">
            <Navbar />
            <Toaster position="top-center" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center md:text-left">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: FORMS */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. SHIPPING ADDRESS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                                <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="123 Main St, Apt 4B"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all`}
                                        />
                                        <FiMapPin className="absolute left-3.5 top-3.5 text-gray-400" />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="New York"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.city ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="10001"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.zip ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. PAYMENT METHOD */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2</span>
                                <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            maxLength="16"
                                            placeholder="0000 0000 0000 0000"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.cardNumber ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 font-mono`}
                                        />
                                        <FiCreditCard className="absolute left-3.5 top-3.5 text-gray-400" />
                                    </div>
                                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            maxLength="5"
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.expiry ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-center`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="cvv"
                                                maxLength="3"
                                                placeholder="123"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.cvv ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-center`}
                                            />
                                            <FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map(item => (
                                    <div key={item.ID} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.Image || item.ImageURL}
                                                alt={item.Name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">{item.Name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-gray-900">
                                            ${(item.Price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 mb-8">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium flex items-center gap-1"><FiTruck size={12} /> Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || cart.length === 0}
                                className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>Pay ${totalPrice.toFixed(2)} <FiShield /></>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <FiLock size={10} /> Secure SSL Encryption
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
