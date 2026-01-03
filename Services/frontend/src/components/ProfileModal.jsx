import { useEffect } from 'react';
import {
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  CreditCardIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from "../app/context/AuthContext";

export default function ProfileModal({ onClose }) {
  const { logout, user } = useAuth(); // Assuming 'user' object is available in context

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed top-24 right-4 md:right-12 z-50 w-80 animate-scale-in origin-top-right">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden ring-1 ring-black/5">

          {/* User Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <span className="text-lg font-bold">
                  {/* Initials or fallback icon */}
                  <UserCircleIcon className="w-8 h-8 opacity-80" />
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">My Account</h3>
                <p className="text-xs text-gray-500 font-medium">Welcome back!</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-1.5 hover:bg-gray-100/80 rounded-full transition-colors group"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </div>

            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-all group hover:pl-4 relative overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShoppingBagIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Orders</span>
              <div className='ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold'>NEW</div>
            </Link>

            <Link
              href="#" // Placeholder for wishlist
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-all group hover:pl-4 opacity-50 cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 transition-colors">
                <HeartIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Wishlist</span>
              <span className="ml-auto text-xs text-gray-400">Soon</span>
            </Link>

            <Link
              href="#" // Placeholder for payment methods
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-all group hover:pl-4 opacity-50 cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 transition-colors">
                <CreditCardIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Payments</span>
              <span className="ml-auto text-xs text-gray-400">Soon</span>
            </Link>

          </div>

          {/* Footer Actions */}
          <div className="p-2 border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all group text-sm font-medium"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}