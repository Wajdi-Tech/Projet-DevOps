"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./products/ProductCard";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import Link from 'next/link';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check for URL search params on mount
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        {!searchQuery && (
          <section className="relative overflow-hidden bg-slate-900 pt-16 pb-32 lg:pt-32 lg:pb-40">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
              {/* Abstract background blobs */}
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl mix-blend-multiply filter animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-500 blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full bg-pink-500 blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 animate-slide-up">
                The Future of <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Tech is Here.</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Shop the latest gadgets, accessories, and smart devices. Premium quality, unbeatable prices, and fast shipping.
              </p>
              <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link href="/NewArrivals" className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1">
                  Shop New Arrivals
                </Link>
                <Link href="/categories" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold rounded-full transition-all">
                  Explore Categories
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Search Bar Container */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-12">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-secondary font-medium">Loading amazing products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-red-50 text-red-600 rounded-full mb-4">⚠️</div>
              <p className="text-red-500 font-medium text-lg">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery ? `Results for "${searchQuery}"` : "Trending Products"}
                </h2>
                {!searchQuery && (
                  <Link href="/categories" className="text-primary font-medium hover:underline">
                    View all categories &rarr;
                  </Link>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-xl text-secondary">No products found matching your search.</p>
                  <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-medium hover:underline">Clear Search</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.ID} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Main;