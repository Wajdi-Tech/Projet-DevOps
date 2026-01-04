"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { toast, Toaster } from "react-hot-toast";
import { FiShoppingCart, FiCheck, FiTruck, FiShield, FiRotateCcw } from "react-icons/fi";
import { useConfig } from "@/app/context/ConfigContext";

const ProductDetails = () => {
    const { id } = useParams();
    const { config, configLoaded } = useConfig();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (!configLoaded) return;
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${config.productServiceUrl}/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, config, configLoaded]);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product);
        toast.success(`${product.Name} added to cart!`);
        setTimeout(() => setIsAdding(false), 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">😢</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Back to Shop
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <Toaster />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Image Gallery Section */}
                        <div className="p-8 lg:p-12 bg-gray-50 flex items-center justify-center">
                            <div className="relative group w-full max-w-md aspect-square bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.Image || product.ImageURL}
                                    alt={product.Name}
                                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                    {product.Category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                {product.Name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-3xl font-bold text-primary">
                                    ${product.Price}
                                </div>
                                {product.Stock > 0 ? (
                                    <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        In Stock
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                        Out of Stock
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                {product.Description}
                            </p>

                            <div className="border-t border-gray-100 pt-8 mt-auto">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.Stock <= 0 || isAdding}
                                    className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white transition-all transform hover:-translate-y-1 shadow-lg ${product.Stock <= 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : isAdding
                                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                                            : 'bg-primary hover:bg-primary-dark shadow-blue-500/30'
                                        }`}
                                >
                                    {isAdding ? (
                                        <>
                                            <FiCheck size={24} /> Added
                                        </>
                                    ) : (
                                        <>
                                            <FiShoppingCart size={24} /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary mb-2">
                                        <FiTruck size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900">Fast Shipping</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary mb-2">
                                        <FiShield size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900">Secure Payment</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary mb-2">
                                        <FiRotateCcw size={20} />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
