"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Computed values
  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );
const [clientTotalItems, setClientTotalItems] = useState(0);

useEffect(() => {
  setClientTotalItems(totalItems);
}, [totalItems]);
  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.Price * item.quantity, 0),
    [cart]
  );

  // Actions
  const addItem = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.ID === product.ID);
      return existingItem
        ? prevCart.map((item) =>
            item.ID === product.ID ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);
  const addItemQuantity = useCallback((product, quantity) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((item) => item.ID === product.ID);
    const maxAllowed = product.Stock - (existingItem?.quantity || 0);

    // Ensure we don't add more than available stock
    const addQuantity = Math.min(quantity, maxAllowed);

    return existingItem
      ? prevCart.map((item) => 
          item.ID === product.ID 
            ? { ...item, quantity: item.quantity + addQuantity } 
            : item
        )
      : [...prevCart, { ...product, quantity: addQuantity }];
  });
}, []);

  const updateQuantity = useCallback((ID, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ID === ID ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  }, []);

  const removeItem = useCallback((ID) => {
    setCart((prevCart) => prevCart.filter((item) => item.ID !== ID));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const incrementItem = useCallback((ID) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.ID === ID ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementItem = useCallback((ID) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.ID === ID);
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.ID !== ID);
      }
      return prevCart.map((item) =>
        item.ID === ID ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, []);

  // Helpers
  const isInCart = useCallback(
    (ID) => cart.some((item) => item.ID === ID),
    [cart]
  );

  const getItemQuantity = useCallback(
    (ID) => cart.find((item) => item.ID === ID)?.quantity || 0,
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        clientTotalItems,
        cart,
        totalItems,
        totalPrice,
        addItemQuantity,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        incrementItem,
        decrementItem,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
