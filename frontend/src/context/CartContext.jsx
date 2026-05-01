import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const stored = localStorage.getItem('shippingAddress');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((x) => x.product === product._id);
      if (exists) {
        return prev.map((x) =>
          x.product === product._id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setCartItems((prev) =>
      prev.map((x) => (x.product === productId ? { ...x, qty } : x))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((x) => x.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const itemsCount = cartItems.reduce((acc, x) => acc + x.qty, 0);
  const itemsPrice = cartItems.reduce((acc, x) => acc + x.qty * x.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        itemsCount,
        itemsPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
