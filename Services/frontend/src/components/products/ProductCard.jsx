"use client";
import Link from "next/link";
import { useCart } from "../../app/context/CartContext";
import { toast } from "react-hot-toast";
import { FiShoppingCart, FiEye } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    addItem(product);
    toast.success("Added to cart");
  };

  return (
    <Link
      href={`/products/${product.ID}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-6">
        <img
          src={product.Image || product.ImageURL}
          alt={product.Name}
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick Actions Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Quick view logic could go here, for now just nav
              window.location.href = `/products/${product.ID}`;
            }}
            className="p-3 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            title="View Details"
          >
            <FiEye size={20} />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
            title="Add to Cart"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs font-medium text-secondary mb-1 uppercase tracking-wider">
          {product.Category}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
          {product.Name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
          {product.Description}
        </p>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-xl font-bold text-gray-900">
            ${product.Price}
          </span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
            In Stock
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;