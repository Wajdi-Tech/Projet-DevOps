"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { FaCartPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import axios from "axios";
import Navbar from "@/components/Navbar";

const ProductPage = () => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
 const [product, setProduct] = useState([]);
 const { cart, addItemQuantity } = useCart();
  useEffect(() => {
    console.log(id);
    
    const fetchProduct = async () => {
      try {
        // Adjust the URL to match your backend endpoint
        const response = await axios.get(`http://localhost:4000/products/${id}`);
        setProduct(response.data);
        console.log(response.data);
        
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } 
    };

    fetchProduct();
  }, []); 



  const handleQuantityChange = (type) => {
    setQuantity(prev => {
      if (type === 'inc' && prev < product.Stock) return prev + 1;
      if (type === 'dec' && prev > 1) return prev - 1;
      return prev;
    });

  };

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-100">
            <img
              src={product.ImageURL}
              alt={product.Name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {product.Stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">Out of Stock</span>
              </div>
            )}
          </div>
          {/* Add more thumbnail images here if available */}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-2">
              <span className="hover:text-indigo-600 cursor-pointer">Products</span> / {product.Category}
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">{product.Name}</h1>
            <div className="mt-2 flex items-center space-x-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {product.Category}
              </span>
              {product.Stock > 0 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {product.Stock} in stock
                </span>
              )}
            </div>
          </div>

          <p className="text-2xl font-bold text-gray-900">
            ${product.Price}
            {/* <span className="text-lg text-gray-500 ml-2 line-through">$599.99</span> */}
          </p>

          <p className="text-gray-600 leading-relaxed">{product.Description}</p>

          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity === 1}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 w-16 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  disabled={quantity === product.Stock}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => addItemQuantity({ ...product },quantity)}
                disabled={product.Stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCartPlus className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {product.Stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
         
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Category:</span>
              <span className="text-gray-900">{product.Category}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">
                {new Date(product.UpdatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductPage;