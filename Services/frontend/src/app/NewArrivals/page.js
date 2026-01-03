"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/products/ProductCard";
import axios from "axios";
import { Toaster } from "react-hot-toast";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching from Product Catalogue Service
                const response = await axios.get("http://127.0.0.1:4000/products");
                // Simulate "New Arrivals" by taking the last 8 items (assuming newer items are appended)
                // If your backend sorts differently, this logic might need adjustment.
                const allProducts = response.data;
                const newArrivals = allProducts.slice(-8).reverse();
                setProducts(newArrivals);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load new arrivals.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toaster />

            {/* Header Section */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        New Arrivals
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Check out the latest additions to our tech collection.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No new products available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.ID} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewArrivals;
