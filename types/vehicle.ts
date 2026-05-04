export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  
  // Prix
  price: number;
  price_fcfa: number;
  price_usd: number;
  price_gnf: number;
  
  // Avance
  advance_fcfa: number;
  advance_usd: number;
  advance_gnf: number;
  
  mileage: number;
  fuel: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
  transmission: 'Manuelle' | 'Automatique';
  category: 'Berline' | 'SUV' | '4x4' | 'Van' | 'Citadine' | 'Coupé' | 'Pick-up' | 'Utilitaire';
  location: string;
  images: string[];
  available: boolean;
  featured: boolean;
  never_accidented: boolean;
  description: string;
  created_at: string;
}
export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  available: boolean;
  description: string;
  created_at: string;
}

export interface CartItemVehicle {
  type: 'vehicle';
  vehicle: Vehicle;
  quantity: number;
}

export interface CartItemProduct {
  type: 'product';
  product: Product;
  quantity: number;
}

export type CartItem = CartItemVehicle | CartItemProduct;

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  vehicle_id?: string;
  product_id?: string;
  quantity: number;
  price: number;
}