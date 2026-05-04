import { createContext, useContext,useState, useEffect } from 'react';
import type {ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    checkSession();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAdmin({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Administrateur',
          role: 'admin'
        });
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setAdmin({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Administrateur',
          role: 'admin'
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setAdmin({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'Administrateur',
          role: 'admin'
        });
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: 'Erreur de connexion' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur inconnue' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth doit être utilisé dans un AdminAuthProvider');
  }
  return context;
};