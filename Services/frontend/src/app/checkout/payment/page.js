"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.js";
import { useAddress } from "../../context/AddressContext.js";
import { useAuth } from "../../context/AuthContext.js";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { FiCheckCircle, FiCreditCard, FiLock, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const PaymentPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { address } = useAddress();
  const { token } = useAuth();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Simple client-side check if user should be here
    if (cart.length === 0) {
      toast("Your cart is empty", { icon: '🛒' });
      // Optionally redirect
      // router.push('/');
    }
  }, [cart]);


  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please fill in all payment details.");
      return;
    }

    setIsProcessing(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderData = {
      products: cart.map((item) => ({
        id: item.ID,
        quantity: item.quantity,
      })),
      shipping_address: address,
      payment_method: "Credit Card",
      total: totalPrice,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5100/api/orders",
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            <FiCheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
          <div className="space-y-3">
            <Link href="/orders" className="block w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/30">
              View My Orders
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1 order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Order Summary
              </h2>
              <ul className="space-y-4 mb-6">
                {cart.map((item) => (
                  <li key={item.ID} className="flex justify-between text-sm">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                        <img src={item.Image || item.ImageURL} alt={item.Name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{item.Name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.Price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-400">VISA</div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-400">MC</div>
                </div>
              </div>

              {/* Shipping Confirmation (Read-only) */}
              <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Shipping To</h3>
                <p className="text-gray-700 text-sm font-medium">{address?.fullName}</p>
                <p className="text-gray-600 text-sm">{address?.street}</p>
                <p className="text-gray-600 text-sm">{address?.city}, {address?.postalCode}, {address?.country}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="16"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                    />
                    <FiCreditCard className="absolute left-3.5 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      maxLength="5"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength="3"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                      />
                      <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 mt-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing
                    ? "bg-gray-400 cursor-wait"
                    : "bg-black hover:bg-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>PAY ${totalPrice.toFixed(2)}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                  <FiLock size={12} />
                  Payments are secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
