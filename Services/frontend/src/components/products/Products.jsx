import React from 'react'
import ProductCard from "@/components/products/ProductCard";

const Products = () => {
      const products = [
    { id: 1, name: "Phone Case", price: 20, image: "/images/phone-case.jpg", sale: true, rating: 4.5 },
    { id: 2, name: "Screen Protector", price: 10, image: "/images/screen-protector.jpg", rating: 4.2 },
    { id: 3, name: "Phone Case", price: 20, image: "/images/phone-case.jpg", sale: true, rating: 4.5 },
    { id: 4, name: "Screen Protector", price: 10, image: "/images/screen-protector.jpg", rating: 4.2 },
    { id: 5, name: "Phone Case", price: 20, image: "/images/phone-case.jpg", sale: true, rating: 4.5 },
    { id: 6, name: "Screen Protector", price: 10, image: "/images/screen-protector.jpg", rating: 4.2 },
    { id: 7, name: "Phone Case", price: 20, image: "/images/phone-case.jpg", sale: true, rating: 4.5 },
    { id: 8, name: "Screen Protector", price: 10, image: "/images/screen-protector.jpg", rating: 4.2 },
  ];

  return (
    <div className="flex flex-wrap justify-center p-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}   />
        ))}
    
      </div>
  )
}

export default Products