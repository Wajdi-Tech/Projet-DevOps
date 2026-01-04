"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "../context/AuthContext";
import { FiPackage, FiCalendar, FiClock, FiChevronRight, FiBox, FiTruck, FiCheckCircle, FiLock } from "react-icons/fi";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

import { useConfig } from "../context/ConfigContext";

const OrdersPage = () => {
    const { config } = useConfig();
    const { token, isSignedIn } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isSignedIn || !token) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            // Retry logic for potential networking hiccups on local dev
            const maxRetries = 3;
            let attempt = 0;
            while (attempt < maxRetries) {
                try {
                    // API Call to correct port 5100
                    const response = await axios.get(`${config.orderServiceUrl}/api/my-orders`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    // Correctly accessing response.data.orders and reversing
                    const sortedOrders = (response.data.orders || []).reverse();
                    setOrders(sortedOrders);
                    setError(null);
                    break; // Success
                } catch (err) {
                    attempt++;
                    console.error(`Attempt ${attempt} failed:`, err);
                    if (attempt === maxRetries) {
                        // Only show error if all retries fail
                        setError("Could not retrieve orders. Please try again later.");
                    } else {
                        await new Promise(r => setTimeout(r, 1000)); // Wait 1s before retry
                    }
                }
            }
            setLoading(false);
        };

        fetchOrders();
    }, [isSignedIn, token]);

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6 animate-pulse">
                        <FiLock size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Member Access Only</h1>
                    <p className="text-gray-500 mb-8 max-w-sm text-lg">
                        Please sign in to view your order history and track shipments.
                    </p>
                    <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Return Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-foreground">
            <Navbar />
            <Toaster />

            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
                        <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                        Total Orders: <span className="text-primary font-bold ml-1">{orders.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-white rounded-2xl shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                            <FiPackage size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-red-700 mb-2">Connection Error</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                            <FiBox size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders placed yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                            Your wardrobe is waiting! contentCheck out our new arrivals and make your first purchase.
                        </p>
                        <Link href="/NewArrivals" className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-blue-500/30">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            // Use explicit fallback for total price to avoid crashes
                            <div key={order._id || order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">

                                {/* Status Strip */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">

                                    {/* Left: Order Info */}
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                                ID: {order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
                                            </span>
                                            <span className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full gap-1">
                                                <FiCheckCircle size={10} /> Completed
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 gap-2">
                                            <FiCalendar className="text-gray-400" />
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            }) : 'Date unavailable'}
                                        </div>
                                    </div>

                                    {/* Middle: Product Previews */}
                                    <div className="flex-1 flex items-center">
                                        <div className="flex -space-x-3 hover:space-x-1 transition-all">
                                            {order.products && order.products.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 relative overflow-hidden shadow-sm" title={item.Name}>
                                                    {/* Placeholder image logic */}
                                                    <img
                                                        src="https://via.placeholder.com/100?text=IMG"
                                                        alt={item.Name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#eee'; }}
                                                    />
                                                </div>
                                            ))}
                                            {order.products && order.products.length > 4 && (
                                                <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-10">
                                                    +{order.products.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Actions & Total */}
                                    <div className="flex items-center justify-between lg:justify-end gap-6 min-w-[250px] border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                ${(order.total || order.total_price || 0).toFixed(2)}
                                            </p>
                                        </div>


                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrdersPage;
