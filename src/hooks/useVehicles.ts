import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Vehicle } from '../..//types/vehicle';

interface VehicleFilters {
  location?: string;
  featured?: boolean;
  category?: string;
  limit?: number;
}

export const useVehicles = (filters?: VehicleFilters) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, [filters?.location, filters?.featured, filters?.category]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    
    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('available', true);

    if (filters?.featured) {
      query = query.eq('featured', true);
    }
    if (filters?.location && filters.location !== 'all') {
      query = query.eq('location', filters.location);
    }
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
      setVehicles([]);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  return { vehicles, loading, error, refetch: fetchVehicles };
};