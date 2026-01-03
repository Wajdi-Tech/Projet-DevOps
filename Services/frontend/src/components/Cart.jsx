"use client";
import React from "react";
import { useCart } from "../app/context/CartContext";
import { FiX, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import Link from 'next/link';

const Cart = ({ closeCart, toggleLogin }) => {
  const { cart, removeItem, clearCart, incrementItem, decrementItem, totalPrice } = useCart();

  const handleCheckout = () => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      closeCart();
      toggleLogin();
    } else {
      window.location.href = "/checkout";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="flex flex-col h-full bg-white shadow-2xl animate-slide-in-right">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Your Cart ({cart.length})</h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <FiX size={40} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-xs">Looks like you haven't added any items to your cart yet.</p>
                  <Link href="/checkout" onClick={closeCart} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.ID} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 animate-fade-in relative group">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.ImageURL || item.Image} // Handle potential inconsistency in property name from backend/context
                          alt={item.Name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 pr-6">{item.Name}</h3>
                            <button
                              onClick={() => removeItem(item.ID)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Remove item"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{item.Category}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => item.quantity > 1 && decrementItem(item.ID)}
                              disabled={item.quantity <= 1}
                              className={`p-1.5 rounded-md transition-colors ${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => incrementItem(item.ID)}
                              className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <p className="font-bold text-primary">${(item.Price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 bg-white p-6 shadow-lg z-20">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base text-gray-600">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base text-gray-600">
                    <p>Shipping</p>
                    <p className="text-green-600 font-medium">Free</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-4">
                    <p>Total</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-red-500 font-medium transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
