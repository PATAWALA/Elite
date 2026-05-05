import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar, FaBox, FaShoppingCart, FaSignOutAlt,
  FaShip, FaChartBar, FaUsers,
  FaEdit, FaTrash, FaCog,
  FaUserPlus, FaHome, FaChevronRight,
  FaSave, FaTimes, FaBell, FaUserCircle, FaClock, FaUpload,
  FaWhatsapp, FaShieldAlt, FaBars
} from 'react-icons/fa';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabaseClient';

// -------------------- TYPES --------------------
interface Vehicle {
  id: string; brand: string; model: string; year: number;
  price: number; price_fcfa: number; price_usd: number; price_gnf: number;
  advance_fcfa: number; advance_usd: number; advance_gnf: number;
  category: string; fuel: string; transmission: string; mileage: number;
  available: boolean; featured: boolean; images: string[];
  never_accidented: boolean; description: string; created_at: string;
  _priceRaw?: string; _advanceRaw?: string;
}

interface Product {
  id: string; name: string; category: string; price: number;
  available: boolean; badge: string; image: string;
  description: string; created_at: string;
  _priceRaw?: string; 
}

interface Order {
  id: string; customer_name: string; customer_phone: string;
  customer_email: string; status: string; total_amount: number;
  notes: string; created_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  role?: string;
}

type Tab = 'dashboard' | 'vehicles' | 'products' | 'orders' | 'admins' | 'settings';

const BRAND_SUGGESTIONS = [
  'Toyota', 'Mercedes-Benz', 'BMW', 'Hyundai', 'Honda',
  'Nissan', 'Ford', 'Volkswagen', 'Audi', 'Chevrolet',
  'Kia', 'Mitsubishi', 'Lexus', 'Jeep', 'Land Rover'
];

// -------------------- COMPOSANT --------------------
const AdminDashboardPage = () => {
  const { admin, isAuthenticated, loading: authLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // pour desktop (réduire/étendre)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // pour mobile (overlay)

  // Données
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ vehicles: 0, products: 0, orders: 0, pending: 0, revenue: 0 });
  const [loginTime] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

  // Modals & formulaires
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({});
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [uploadingVehicle, setUploadingVehicle] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // -------- EFFETS --------
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (isAuthenticated) loadAllData();
  }, [isAuthenticated, authLoading, activeTab]);

  useEffect(() => {
    // Fermer le menu mobile quand la taille d'écran dépasse md
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchVehicles(), fetchProducts(), fetchOrders(), fetchStats(), fetchAdmins()]);
    setLoading(false);
  };

  // -------- FETCHS --------
  const fetchStats = async () => {
    const { count: v } = await supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('available', true);
    const { count: p } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('available', true);
    const { count: o } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { data: confirmed } = await supabase.from('orders').select('total_amount').eq('status', 'confirmed');
    const rev = confirmed?.reduce((s: number, o: any) => s + (o.total_amount || 0), 0) || 0;
    setStats({ vehicles: v || 0, products: p || 0, orders: o || 0, pending: pending || 0, revenue: rev });
  };

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    setVehicles(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const fetchAdmins = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (!error && data?.users) {
      setAdmins(data.users.map(u => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at,
        role: u.role || 'admin'
      })));
    }
  };

  // -------- ACTIONS --------
  const handleLogout = async () => { await logout(); navigate('/', { replace: true }); };
  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const statusBadge = (s: string) => {
    const badges: any = {
      pending: { bg: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
      confirmed: { bg: 'bg-green-100 text-green-700', label: 'Confirmée' },
      delivered: { bg: 'bg-blue-100 text-blue-700', label: 'Livrée' },
      cancelled: { bg: 'bg-red-100 text-red-700', label: 'Annulée' },
    };
    const b = badges[s] || badges.pending;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.bg}`}>{b.label}</span>;
  };

  const deleteVehicle = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('vehicles').delete().eq('id', id); fetchVehicles(); fetchStats(); };
  const deleteProduct = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('products').delete().eq('id', id); fetchProducts(); fetchStats(); };
  const toggleVehicleFeatured = async (id: string, featured: boolean) => { await supabase.from('vehicles').update({ featured }).eq('id', id); fetchVehicles(); };

  const uploadImage = async (file: File, bucket: 'vehicles' | 'products'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) { alert('Erreur upload'); return null; }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch { alert('Erreur upload'); return null; }
  };

  const parseMultiPrice = (raw: string) => {
    const fcfa = raw.match(/(\d[\d\s]*)\s*(?:FCFA|fcfa|Fcfa)?/i);
    const usd = raw.match(/(\d[\d\s]*)\s*(?:\$|USD|usd|dollars?)/i);
    const gnf = raw.match(/(\d[\d\s]*)\s*(?:GNF|gnf)/i);
    return {
      price_fcfa: fcfa ? parseInt(fcfa[1].replace(/\s/g, '')) : 0,
      price_usd: usd ? parseInt(usd[1].replace(/\s/g, '')) : 0,
      price_gnf: gnf ? parseInt(gnf[1].replace(/\s/g, '')) : 0,
    };
  };

  // -------- SAUVEGARDE --------
  const saveVehicle = async () => {
    if (!vehicleForm.brand || !vehicleForm.model) return alert('Marque et modèle obligatoires');
    const prices = parseMultiPrice(vehicleForm._priceRaw || '');
    const advances = parseMultiPrice(vehicleForm._advanceRaw || '');
    const data = {
      brand: vehicleForm.brand,
      model: vehicleForm.model,
      year: Number(vehicleForm.year) || new Date().getFullYear(),
      mileage: Number(vehicleForm.mileage) || 0,
      fuel: vehicleForm.fuel || 'Essence',
      transmission: vehicleForm.transmission || 'Automatique',
      category: vehicleForm.category || 'SUV',
      price: prices.price_fcfa || 0,
      price_fcfa: prices.price_fcfa || 0,
      price_usd: prices.price_usd || 0,
      price_gnf: prices.price_gnf || 0,
      advance_fcfa: advances.price_fcfa || 0,
      advance_usd: advances.price_usd || 0,
      advance_gnf: advances.price_gnf || 0,
      never_accidented: vehicleForm.never_accidented || false,
      description: vehicleForm.description || '',
      images: vehicleForm.images || [],
      available: true,
      featured: true,
    };
    if (editingVehicleId) { await supabase.from('vehicles').update(data).eq('id', editingVehicleId); }
    else { await supabase.from('vehicles').insert(data); }
    setEditingVehicleId(null); setVehicleForm({}); fetchVehicles(); fetchStats();
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) return alert('Nom et prix obligatoires');
    const data = { ...productForm, price: Number(productForm.price) };
    if (editingProductId) { await supabase.from('products').update(data).eq('id', editingProductId); }
    else { await supabase.from('products').insert({ ...data, available: true }); }
    setEditingProductId(null); setProductForm({}); fetchProducts(); fetchStats();
  };

  const handlePasswordChange = async () => {
    setPasswordError(''); setPasswordSuccess('');
    if (passwordForm.newPass !== passwordForm.confirm) return setPasswordError('Les mots de passe ne correspondent pas.');
    if (passwordForm.newPass.length < 6) return setPasswordError('6 caractères minimum.');
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass });
    if (error) { setPasswordError(error.message); }
    else { setPasswordSuccess('Mot de passe mis à jour !'); setTimeout(() => { setShowPasswordModal(false); setPasswordForm({ newPass: '', confirm: '' }); setPasswordSuccess(''); }, 1500); }
  };

  const inviteAdmin = async () => {
  if (!adminEmail) return alert('Veuillez entrer un email.');

  try {
    const res = await fetch(
      'https://pvpdcwwufyekltuemlyp.supabase.co/functions/v1/dynamic-action',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'invite',
          email: adminEmail.trim()
        })
      }
    );
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erreur lors de l\'invitation');
    }

    alert(`Invitation envoyée à ${adminEmail}`);
    setAdminEmail('');
    fetchAdmins(); // rafraîchir la liste
  } catch (err: any) {
    alert('Erreur: ' + err.message);
  }
};

  const deleteAdmin = async (userId: string) => {
  if (!confirm('Supprimer cet administrateur ?')) return;

  try {
    const res = await fetch(
      'https://pvpdcwwufyekltuemlyp.supabase.co/functions/v1/dynamic-action',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'delete',
          userId
        })
      }
    );
    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error || 'Erreur lors de la suppression');
    }

    fetchAdmins(); // rafraîchir la liste
  } catch (err: any) {
    alert('Erreur: ' + err.message);
  }
};

  const handleEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm({
      ...v,
      _priceRaw: `${v.price_fcfa || v.price}FCFA${v.price_usd ? ` / ${v.price_usd}$` : ''}${v.price_gnf ? ` / ${v.price_gnf}GNF` : ''}`,
      _advanceRaw: `${v.advance_fcfa || 0}FCFA${v.advance_usd ? ` / ${v.advance_usd}$` : ''}${v.advance_gnf ? ` / ${v.advance_gnf}GNF` : ''}`,
    });
  };
  const handleEditProduct = (p: Product) => { setEditingProductId(p.id); setProductForm(p); };

  // -------- MENU --------
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: FaHome },
    { id: 'vehicles' as Tab, label: 'Véhicules', icon: FaCar, count: vehicles.length },
    { id: 'products' as Tab, label: 'Produits', icon: FaBox, count: products.length },
    { id: 'orders' as Tab, label: 'Commandes', icon: FaShoppingCart, count: orders.length },
    { id: 'admins' as Tab, label: 'Admins', icon: FaUsers, count: admins.length },
    { id: 'settings' as Tab, label: 'Paramètres', icon: FaCog },
  ];

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // ferme le menu mobile après sélection
  };

  // -------- RENDU --------
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay mobile (fond sombre quand menu ouvert) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full md:translate-x-0'}
          ${!mobileMenuOpen && sidebarOpen ? 'md:w-60' : ''}
          ${!mobileMenuOpen && !sidebarOpen ? 'md:w-[70px]' : ''}
        `}
      >
        {/* Entête sidebar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between" style={{ minHeight: '65px' }}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaShip className="text-white text-sm" />
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">Élite Transit</p>
                <p className="text-[10px] text-gray-400">CMA & CGM</p>
              </div>
            )}
          </div>
          {/* Bouton fermeture mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
            onClick={() => setMobileMenuOpen(false)}
            title="Fermer le menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              title={tab.label}
            >
              <tab.icon className="text-base flex-shrink-0" />
              {(sidebarOpen || mobileMenuOpen) && (
                <>
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                      {tab.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Déconnexion */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
            title="Déconnexion"
          >
            <FaSignOutAlt />
            {(sidebarOpen || mobileMenuOpen) && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* NAVBAR */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm" style={{ minHeight: '65px' }}>
          <div className="flex items-center gap-3">
            {/* Bouton hamburger mobile */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 p-2"
              onClick={() => setMobileMenuOpen(true)}
              title="Menu"
            >
              <FaBars className="text-lg" />
            </button>
            {/* Bouton réduire/étendre desktop */}
            <button
              className="hidden md:flex text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Réduire/étendre la sidebar"
            >
              <FaChevronRight className={`transition text-lg ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button className="relative text-gray-400 hover:text-primary-500 transition p-2" title="Notifications">
              <FaBell className="text-lg" />
              {stats.pending > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {stats.pending}
                </span>
              )}
            </button>
            <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
              <FaClock className="text-gray-300" /> {loginTime}
            </span>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-primary-500 text-lg" />
              </div>
              <span className="text-sm text-gray-600 font-medium hidden md:block truncate max-w-[150px]">
                {admin?.email}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENU */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <>
              {/* ---------- DASHBOARD ---------- */}
              {activeTab === 'dashboard' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-6">Dashboard</h1>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                    {[
                      { icon: FaCar, label: 'Véhicules', value: stats.vehicles, color: 'bg-blue-50 text-blue-600' },
                      { icon: FaBox, label: 'Produits', value: stats.products, color: 'bg-green-50 text-green-600' },
                      { icon: FaShoppingCart, label: 'Commandes', value: stats.orders, color: 'bg-purple-50 text-purple-600' },
                      { icon: FaChartBar, label: 'Revenus', value: formatPrice(stats.revenue), color: 'bg-primary-50 text-primary-600' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                        <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                          <s.icon />
                        </div>
                        <p className="text-xl md:text-2xl font-extrabold text-gray-900 break-all">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4">Commandes récentes</h2>
                    {orders.slice(0, 5).length === 0 ? (
                      <p className="text-gray-400 text-sm">Aucune commande</p>
                    ) : orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50 last:border-0 gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{o.customer_name || 'Anonyme'}</p>
                          <p className="text-xs text-gray-400">{o.customer_phone} • {formatDate(o.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-primary-600">{formatPrice(o.total_amount)}</span>
                          {statusBadge(o.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ---------- VÉHICULES ---------- */}
              {activeTab === 'vehicles' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-6">Véhicules ({vehicles.length})</h1>
                  {/* Formulaire */}
                  <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">{editingVehicleId ? 'Modifier' : 'Ajouter un véhicule'}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Marque *</label>
                        <input list="brand-suggestions" placeholder="Marque" value={vehicleForm.brand || ''}
                          onChange={e => setVehicleForm(f => ({ ...f, brand: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                        <datalist id="brand-suggestions">
                          {BRAND_SUGGESTIONS.map(b => <option key={b} value={b} />)}
                        </datalist>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Modèle *</label>
                        <input placeholder="Modèle" value={vehicleForm.model || ''} onChange={e => setVehicleForm(f => ({ ...f, model: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Année</label>
                        <input type="number" placeholder="Année" value={vehicleForm.year || ''} onChange={e => setVehicleForm(f => ({ ...f, year: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Kilométrage</label>
                        <input type="number" placeholder="Km" value={vehicleForm.mileage || ''} onChange={e => setVehicleForm(f => ({ ...f, mileage: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Carburant</label>
                        <select value={vehicleForm.fuel || 'Essence'} onChange={e => setVehicleForm(f => ({ ...f, fuel: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                          <option>Essence</option><option>Diesel</option><option>Hybride</option><option>Électrique</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Transmission</label>
                        <select value={vehicleForm.transmission || 'Automatique'} onChange={e => setVehicleForm(f => ({ ...f, transmission: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                          <option>Automatique</option><option>Manuelle</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                        <select value={vehicleForm.category || 'SUV'} onChange={e => setVehicleForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                          <option>SUV</option><option>Berline</option><option>4x4</option><option>Van</option><option>Citadine</option><option>Coupé</option><option>Pick-up</option>
                        </select>
                      </div>
                    </div>

                    {/* PRIX MULTI-DEVISES */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                      <p className="text-xs font-bold text-gray-700 mb-2">💰 Prix du véhicule</p>
                      <input
                        placeholder="Ex: 900000FCFA / 1605$ / 14100000GNF"
                        value={vehicleForm._priceRaw || ''}
                        onChange={e => {
                          const raw = e.target.value;
                          const prices = parseMultiPrice(raw);
                          setVehicleForm(f => ({ ...f, _priceRaw: raw, ...prices }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      <div className="flex gap-3 mt-2 text-xs flex-wrap">
                        {vehicleForm.price_fcfa ? <span className="text-primary-600 font-medium">{formatPrice(vehicleForm.price_fcfa)}</span> : null}
                        {vehicleForm.price_usd ? <span className="text-blue-600 font-medium">${vehicleForm.price_usd}</span> : null}
                        {vehicleForm.price_gnf ? <span className="text-purple-600 font-medium">{vehicleForm.price_gnf.toLocaleString()} GNF</span> : null}
                      </div>
                    </div>

                    {/* AVANCE */}
                    <div className="bg-green-50 rounded-xl p-4 mb-3 border border-green-100">
                      <p className="text-xs font-bold text-green-700 mb-2">💳 Avance à payer</p>
                      <input
                        placeholder="Ex: 380000FCFA / 500$ / 4400000GNF"
                        value={vehicleForm._advanceRaw || ''}
                        onChange={e => {
                          const raw = e.target.value;
                          const advances = parseMultiPrice(raw);
                          setVehicleForm(f => ({ ...f, _advanceRaw: raw, advance_fcfa: advances.price_fcfa, advance_usd: advances.price_usd, advance_gnf: advances.price_gnf }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      <div className="flex gap-3 mt-2 text-xs flex-wrap">
                        {vehicleForm.advance_fcfa ? <span className="text-green-600 font-medium">{formatPrice(vehicleForm.advance_fcfa)}</span> : null}
                        {vehicleForm.advance_usd ? <span className="text-blue-600 font-medium">${vehicleForm.advance_usd}</span> : null}
                        {vehicleForm.advance_gnf ? <span className="text-purple-600 font-medium">{vehicleForm.advance_gnf.toLocaleString()} GNF</span> : null}
                      </div>
                    </div>

                    {/* CHECKBOX */}
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input type="checkbox" checked={vehicleForm.never_accidented || false} onChange={e => setVehicleForm(f => ({ ...f, never_accidented: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-500" />
                      <span className="text-sm text-gray-700 flex items-center gap-1"><FaShieldAlt className="text-green-500" /> Jamais accidenté</span>
                    </label>

                    {/* UPLOAD IMAGE */}
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo</label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-primary-500 transition flex items-center gap-2">
                          <FaUpload />{uploadingVehicle ? 'Upload...' : 'Choisir une image'}
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingVehicle(true); const url = await uploadImage(file, 'vehicles'); if (url) setVehicleForm(f => ({ ...f, images: [url] })); setUploadingVehicle(false); }} />
                        </label>
                      </div>
                      {vehicleForm.images?.[0] && (
                        <div className="mt-2 relative inline-block">
                          <img src={vehicleForm.images[0]} alt="Aperçu" className="w-32 h-24 object-cover rounded-lg border" />
                          <button onClick={() => setVehicleForm(f => ({ ...f, images: [] }))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" title="Supprimer">×</button>
                        </div>
                      )}
                    </div>

                    <textarea placeholder="Description" value={vehicleForm.description || ''} onChange={e => setVehicleForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3" rows={2} />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={saveVehicle} className="btn-admin-primary flex items-center gap-2" disabled={uploadingVehicle}><FaSave /> {editingVehicleId ? 'Modifier' : 'Ajouter'}</button>
                      {editingVehicleId && <button onClick={() => { setEditingVehicleId(null); setVehicleForm({}); }} className="btn-admin-secondary flex items-center gap-2"><FaTimes /> Annuler</button>}
                    </div>
                  </div>

                  {/* Liste */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead className="bg-gray-50"><tr><th className="p-3 md:p-4 text-left">Véhicule</th><th className="p-3 md:p-4 text-left">Prix</th><th className="p-3 md:p-4 text-left hidden sm:table-cell">Cat.</th><th className="p-3 md:p-4 text-left">Vedette</th><th className="p-3 md:p-4 text-right">Actions</th></tr></thead>
                      <tbody>{vehicles.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucun</td></tr> : vehicles.map(v => (
                        <tr key={v.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="p-3 md:p-4"><div className="flex items-center gap-3"><img src={v.images?.[0] || '/placeholder.jpg'} className="w-12 h-10 rounded-lg object-cover" alt="" /><div><p className="font-semibold text-sm">{v.brand} {v.model}</p><p className="text-xs text-gray-400">{v.year} • {v.fuel}</p></div></div></td>
                          <td className="p-3 md:p-4 font-bold text-primary-600 text-xs md:text-sm">{formatPrice(v.price_fcfa || v.price)}</td>
                          <td className="p-3 md:p-4 text-gray-500 hidden sm:table-cell">{v.category}</td>
                          <td className="p-3 md:p-4"><button onClick={() => toggleVehicleFeatured(v.id, !v.featured)} className={`px-2 py-1 rounded-full text-xs font-semibold ${v.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{v.featured ? '⭐' : '—'}</button></td>
                          <td className="p-3 md:p-4 text-right"><button onClick={() => handleEditVehicle(v)} className="text-blue-500 hover:text-blue-600 mr-3 p-1" title="Modifier"><FaEdit /></button><button onClick={() => deleteVehicle(v.id)} className="text-red-500 hover:text-red-600 p-1" title="Supprimer"><FaTrash /></button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* ---------- PRODUITS ---------- */}
              {activeTab === 'products' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-6">Produits ({products.length})</h1>
                  <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">{editingProductId ? 'Modifier' : 'Ajouter un produit'}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                      <input placeholder="Nom *" value={productForm.name || ''} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      <input 
                        placeholder="Prix (ex: 500000FCFA / 800$)" 
                        value={productForm._priceRaw || ''} 
                        onChange={e => {
                          const raw = e.target.value;
                          const prices = parseMultiPrice(raw);
                          setProductForm(f => ({ ...f, _priceRaw: raw, price: prices.price_fcfa || 0 }));
                        }} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" 
                      />
                      <select value={productForm.category || 'Téléphones'} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                        <option>Téléphones</option><option>Informatique</option><option>TV & Audio</option><option>Électroménager</option><option>Gaming</option><option>Montres</option><option>Maison</option>
                      </select>
                      <input placeholder="Badge" value={productForm.badge || ''} onChange={e => setProductForm(f => ({ ...f, badge: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photo</label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-primary-500 transition flex items-center gap-2">
                          <FaUpload />{uploadingProduct ? 'Upload...' : 'Choisir une image'}
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingProduct(true); const url = await uploadImage(file, 'products'); if (url) setProductForm(f => ({ ...f, image: url })); setUploadingProduct(false); }} />
                        </label>
                      </div>
                      {productForm.image && (
                        <div className="mt-2 relative inline-block">
                          <img src={productForm.image} alt="Aperçu" className="w-32 h-24 object-cover rounded-lg border" />
                          <button onClick={() => setProductForm(f => ({ ...f, image: '' }))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" title="Supprimer">×</button>
                        </div>
                      )}
                    </div>
                    <textarea placeholder="Description" value={productForm.description || ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3" rows={2} />
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={saveProduct} className="btn-admin-primary flex items-center gap-2" disabled={uploadingProduct}><FaSave /> {editingProductId ? 'Modifier' : 'Ajouter'}</button>
                      {editingProductId && <button onClick={() => { setEditingProductId(null); setProductForm({}); }} className="btn-admin-secondary flex items-center gap-2"><FaTimes /> Annuler</button>}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead className="bg-gray-50"><tr><th className="p-3 md:p-4 text-left">Produit</th><th className="p-3 md:p-4 text-left">Prix</th><th className="p-3 md:p-4 text-left hidden sm:table-cell">Cat.</th><th className="p-3 md:p-4 text-left hidden md:table-cell">Badge</th><th className="p-3 md:p-4 text-right">Actions</th></tr></thead>
                      <tbody>{products.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucun</td></tr> : products.map(p => (<tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50"><td className="p-3 md:p-4"><div className="flex items-center gap-3"><img src={p.image || '/placeholder.jpg'} className="w-12 h-10 rounded-lg object-cover" alt="" /><p className="font-semibold text-sm">{p.name}</p></div></td><td className="p-3 md:p-4 font-bold text-primary-600 text-xs md:text-sm">{p.price}</td><td className="p-3 md:p-4 text-gray-500 hidden sm:table-cell">{p.category}</td><td className="p-3 md:p-4 hidden md:table-cell">{p.badge || '—'}</td><td className="p-3 md:p-4 text-right"><button onClick={() => handleEditProduct(p)} className="text-blue-500 hover:text-blue-600 mr-3 p-1" title="Modifier"><FaEdit /></button><button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-600 p-1" title="Supprimer"><FaTrash /></button></td></tr>))}</tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* ---------- COMMANDES ---------- */}
              {activeTab === 'orders' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Commandes ({orders.length})</h1>
                  <p className="text-sm text-gray-500 mb-4 md:mb-6">Gérez les commandes et contactez les clients directement sur WhatsApp</p>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead className="bg-gray-50"><tr><th className="p-3 md:p-4 text-left">Client</th><th className="p-3 md:p-4 text-left hidden sm:table-cell">Contact</th><th className="p-3 md:p-4 text-left hidden md:table-cell">Type</th><th className="p-3 md:p-4 text-left">Montant</th><th className="p-3 md:p-4 text-left">Statut</th><th className="p-3 md:p-4 text-center">Actions</th></tr></thead>
                      <tbody>
                        {orders.length === 0 ? <tr><td colSpan={6} className="p-10 text-center text-gray-400"><FaShoppingCart className="text-3xl mx-auto mb-2 text-gray-300" />Aucune commande</td></tr> : orders.map(o => {
                          const phoneClean = o.customer_phone?.replace(/[^0-9]/g, '') || '';
                          const msgClient = encodeURIComponent(`Bonjour ${o.customer_name || ''}!\n\nVotre commande #${o.id.slice(0, 8)} chez Élite Transit Service a été confirmée ✅\n\n📦 ${o.notes || 'Votre commande'}\n💰 Montant: ${formatPrice(o.total_amount)}\n\n🚢 Livraison estimée: 35 jours depuis le Port de Jebel Ali, Dubai 🇦🇪\n\nNous vous tiendrons informé de l'avancement.`);
                          return (
                            <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                              <td className="p-3 md:p-4"><p className="font-semibold text-gray-900 text-sm">{o.customer_name || 'Client'}</p><p className="text-xs text-gray-400">{formatDate(o.created_at)}</p>{o.notes && <p className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">📝 {o.notes}</p>}</td>
                              <td className="p-3 md:p-4 hidden sm:table-cell"><p className="text-gray-600 text-xs">{o.customer_phone}</p>{o.customer_email && <p className="text-gray-400 text-xs">{o.customer_email}</p>}</td>
                              <td className="p-3 md:p-4 hidden md:table-cell"><span className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">🚗 Véhicule</span></td>
                              <td className="p-3 md:p-4 font-bold text-primary-600 text-xs md:text-sm">{formatPrice(o.total_amount)}</td>
                              <td className="p-3 md:p-4">{statusBadge(o.status)}</td>
                              <td className="p-3 md:p-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                  {o.status === 'pending' && (
                                    <button onClick={async () => { await supabase.from('orders').update({ status: 'confirmed' }).eq('id', o.id); fetchOrders(); fetchStats(); if (phoneClean) window.open(`https://wa.me/${phoneClean}?text=${msgClient}`, '_blank'); }}
                                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition shadow-sm" title="Valider et contacter">✅ Valider & Contacter</button>
                                  )}
                                  {phoneClean && (
                                    <a href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-semibold transition border border-green-200" title="WhatsApp"><FaWhatsapp className="text-xs" /> WhatsApp</a>
                                  )}
                                  <select value={o.status} onChange={async (e) => { await supabase.from('orders').update({ status: e.target.value }).eq('id', o.id); fetchOrders(); fetchStats(); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
                                    <option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="delivered">Livrée</option><option value="cancelled">Annulée</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* ---------- ADMINS ---------- */}
              {activeTab === 'admins' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-6">Administrateurs ({admins.length})</h1>
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">Ajouter un administrateur</h3>
                    <div className="flex flex-col sm:flex-row gap-2 mb-6">
                      <input type="email" placeholder="Email du nouvel admin" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm" />
                      <button onClick={inviteAdmin} className="btn-admin-primary flex items-center gap-2 justify-center"><FaUserPlus /> Inviter</button>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">Administrateurs actuels</h3>
                    <div className="space-y-2">
                      {admins.map(u => (
                        <div key={u.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.email}</p>
                            <p className="text-xs text-gray-400">Ajouté le {new Date(u.created_at).toLocaleDateString()}</p>
                          </div>
                          {u.id !== admin?.id && (
                            <button onClick={() => deleteAdmin(u.id)} className="text-red-500 hover:text-red-600 p-2" title="Supprimer"><FaTrash /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ---------- PARAMÈTRES ---------- */}
              {activeTab === 'settings' && (
                <section>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-6">Paramètres</h1>
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 max-w-lg">
                    <h2 className="font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
                    {passwordError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-3 rounded-lg">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-500 text-sm mb-3 bg-green-50 p-3 rounded-lg">{passwordSuccess}</p>}
                    <div className="space-y-3">
                      <input type="password" placeholder="Nouveau mot de passe" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      <input type="password" placeholder="Confirmer" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                      <button onClick={handlePasswordChange} className="btn-admin-primary w-full flex items-center justify-center gap-2"><FaSave /> Mettre à jour</button>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL PASSWORD (rapide) */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Changer le mot de passe</h2><button onClick={() => setShowPasswordModal(false)} title="Fermer"><FaTimes /></button></div>
            {passwordError && <p className="text-red-500 text-sm mb-3 bg-red-50 p-3 rounded-lg">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-500 text-sm mb-3 bg-green-50 p-3 rounded-lg">{passwordSuccess}</p>}
            <div className="space-y-3">
              <input type="password" placeholder="Nouveau mot de passe" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              <input type="password" placeholder="Confirmer" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              <button onClick={handlePasswordChange} className="w-full btn-admin-primary">Mettre à jour</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;