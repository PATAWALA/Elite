import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../../types/vehicle';
interface ProductFilters {
  category?: string;
  limit?: number;
}

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters?.category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('available', true);

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error: queryError } = await query;

    if (queryError) {
      setError(queryError.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  return { products, loading, error, refetch: fetchProducts };
};