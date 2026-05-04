import { createContext, useContext, useReducer, useEffect } from 'react';
import type {ReactNode } from 'react';
import type { Vehicle, Product, CartItem } from '../types/vehicle';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const emptyCart: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

const CartContext = createContext<{
  cart: CartState;
  addVehicle: (vehicle: Vehicle) => void;
  addProduct: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

const loadCartFromStorage = (): CartState => {
  try {
    const saved = localStorage.getItem('cart');
    if (!saved) return emptyCart;
    
    const parsed = JSON.parse(saved);
    
    // Vérifie que la structure est valide
    if (!parsed.items || !Array.isArray(parsed.items)) return emptyCart;
    
    // Vérifie chaque item
    const validItems = parsed.items.filter((item: any) => {
      if (!item.type) return false;
      if (item.type === 'vehicle') return !!item.vehicle?.price;
      if (item.type === 'product') return !!item.product?.price;
      return false;
    });
    
    const totalItems = validItems.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
    const totalAmount = validItems.reduce((sum: number, item: CartItem) => {
      const price = item.type === 'vehicle' ? item.vehicle.price : item.product.price;
      return sum + (price * (item.quantity || 0));
    }, 0);
    
    return { items: validItems, totalItems, totalAmount };
  } catch (e) {
    console.error('Erreur chargement panier:', e);
    return emptyCart;
  }
};

const calculateTotals = (items: CartItem[]) => {
  return {
    totalItems: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    totalAmount: items.reduce((sum, item) => {
      if (item.type === 'vehicle' && item.vehicle?.price) {
        return sum + (item.vehicle.price * (item.quantity || 0));
      }
      if (item.type === 'product' && item.product?.price) {
        return sum + (item.product.price * (item.quantity || 0));
      }
      return sum;
    }, 0)
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_VEHICLE': {
      const existingIndex = state.items.findIndex(
        item => item.type === 'vehicle' && item.vehicle?.id === action.payload.id
      );
      
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { type: 'vehicle' as const, vehicle: action.payload, quantity: 1 }];
      }
      
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'ADD_PRODUCT': {
      const existingIndex = state.items.findIndex(
        item => item.type === 'product' && item.product?.id === action.payload.id
      );
      
      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { type: 'product' as const, product: action.payload, quantity: 1 }];
      }
      
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => {
        const id = item.type === 'vehicle' ? item.vehicle?.id : item.product?.id;
        return id !== action.payload;
      });
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => {
          const id = item.type === 'vehicle' ? item.vehicle?.id : item.product?.id;
          return id !== action.payload.id;
        });
        const totals = calculateTotals(newItems);
        return { items: newItems, ...totals };
      }
      const newItems = state.items.map(item => {
        const id = item.type === 'vehicle' ? item.vehicle?.id : item.product?.id;
        return id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item;
      });
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case 'CLEAR_CART':
      return emptyCart;

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, null, loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addVehicle = (vehicle: Vehicle) => {
    dispatch({ type: 'ADD_VEHICLE', payload: vehicle });
  };

  const addProduct = (product: Product) => {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addVehicle, addProduct, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};