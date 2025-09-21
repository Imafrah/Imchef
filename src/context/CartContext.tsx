import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'noodles' | 'sauces';
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: state.total + action.product.price,
          itemCount: state.itemCount + 1,
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
        total: state.total + action.product.price,
        itemCount: state.itemCount + 1,
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.productId);
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
        itemCount: state.itemCount - itemToRemove.quantity,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.productId);
      if (!item) return state;
      
      const quantityDiff = action.quantity - item.quantity;
      
      if (action.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', productId: action.productId });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff,
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};