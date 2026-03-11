import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Grid, AppBar, Toolbar, Typography, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import api from '../../api/client';
import type { Category, Menu, CartItem, TableConfig } from '../../types';
import MenuCard from '../components/MenuCard';
import CartDrawer from '../components/CartDrawer';
import Toast from '../../shared/Toast';

const CART_KEY = 'cart_items';

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function MenuPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as const });

  const config: TableConfig | null = (() => {
    try { return JSON.parse(localStorage.getItem('table_config') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    if (!config) { navigate('/login', { replace: true }); return; }
    api.get<Category[]>(`/api/categories?store_id=${config.store_id}`).then((r) => {
      setCategories(r.data);
      if (r.data.length > 0) setSelectedCat(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!config || selectedCat === null) return;
    api.get<Menu[]>(`/api/menus?store_id=${config.store_id}&category_id=${selectedCat}`).then((r) => {
      setMenus(r.data.filter((m) => m.is_available));
    });
  }, [selectedCat]);

  const addToCart = useCallback((menu: Menu) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menu_id === menu.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) => i.menu_id === menu.id ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i);
      } else {
        next = [...prev, { menu_id: menu.id, menu_name: menu.name, price: menu.price, quantity: 1, image_url: menu.image_url }];
      }
      saveCart(next);
      return next;
    });
    setToast({ open: true, message: `${menu.name} 추가됨`, severity: 'success' });
  }, []);

  const updateQuantity = useCallback((menuId: number, delta: number) => {
    setCartItems((prev) => {
      const next = prev.map((i) => i.menu_id === menuId ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, 99)) } : i);
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((menuId: number) => {
    setCartItems((prev) => {
      const next = prev.filter((i) => i.menu_id !== menuId);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCart([]);
  }, []);

  const handleOrder = () => {
    setDrawerOpen(false);
    navigate('/order/confirm');
  };

  const totalCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Box sx={{ pb: 2 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>메뉴</Typography>
          <IconButton color="inherit" onClick={() => navigate('/order/history')} data-testid="menu-history-btn">
            <HistoryIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)} data-testid="menu-cart-btn">
            <Badge badgeContent={totalCount} color="secondary"><ShoppingCartIcon /></Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {categories.length > 0 && (
        <Tabs value={selectedCat} onChange={(_, v) => setSelectedCat(v)} variant="scrollable" scrollButtons="auto" sx={{ px: 1 }}>
          {categories.map((c) => <Tab key={c.id} label={c.name} value={c.id} data-testid={`cat-tab-${c.id}`} />)}
        </Tabs>
      )}

      <Grid container spacing={2} sx={{ p: 2 }}>
        {menus.map((m) => (
          <Grid item xs={6} md={4} key={m.id}>
            <MenuCard menu={m} onAddToCart={addToCart} />
          </Grid>
        ))}
      </Grid>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={cartItems}
        onUpdateQuantity={updateQuantity} onRemove={removeItem} onClear={clearCart} onOrder={handleOrder} />

      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))} />
    </Box>
  );
}
