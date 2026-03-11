import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Grid, Chip, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import TableCard from '../components/TableCard';
import OrderDetailModal from '../components/OrderDetailModal';
import OrderHistoryModal from '../components/OrderHistoryModal';
import type { Table, Order } from '../../types';

const DRAWER_WIDTH = 220;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, storeId, logout } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [orderMap, setOrderMap] = useState<Map<number, Order[]>>(new Map());
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [highlightedTables, setHighlightedTables] = useState<Set<number>>(new Set());
  const [sseConnected, setSseConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true });
  }, [isAuthenticated, navigate]);

  // Fetch tables & orders
  const fetchData = useCallback(async () => {
    if (!storeId) return;
    try {
      const [tablesRes] = await Promise.all([
        api.get<Table[]>('/api/tables', { params: { store_id: storeId } }),
      ]);
      setTables(tablesRes.data);

      // Fetch all active orders for the store
      const map = new Map<number, Order[]>();
      try {
        const { data: allOrders } = await api.get<Order[]>('/api/orders', {
          params: { store_id: storeId },
        });
        for (const order of allOrders) {
          const existing = map.get(order.table_id) || [];
          existing.push(order);
          map.set(order.table_id, existing);
        }
      } catch { /* ignore */ }
      setOrderMap(map);
    } catch { /* ignore */ }
  }, [storeId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // SSE connection
  useEffect(() => {
    if (!storeId) return;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const es = new EventSource(`${baseUrl}/api/sse/orders?store_id=${storeId}`);
    eventSourceRef.current = es;

    es.onopen = () => setSseConnected(true);
    es.onerror = () => setSseConnected(false);

    es.addEventListener('order_created', () => fetchData());
    es.addEventListener('order_updated', () => fetchData());
    es.addEventListener('order_deleted', () => fetchData());
    es.addEventListener('session_completed', () => fetchData());

    // Highlight on new order
    es.addEventListener('order_created', (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.table_id) {
          setHighlightedTables((prev) => new Set(prev).add(d.table_id));
          setTimeout(() => setHighlightedTables((prev) => {
            const next = new Set(prev);
            next.delete(d.table_id);
            return next;
          }), 3000);
        }
      } catch { /* ignore */ }
    });

    return () => { es.close(); eventSourceRef.current = null; };
  }, [storeId, fetchData]);

  const handleStatusChange = (orderId: number, status: string) => {
    setOrderMap((prev) => {
      const next = new Map(prev);
      for (const [tid, orders] of next) {
        next.set(tid, orders.map((o) => o.id === orderId ? { ...o, status: status as Order['status'] } : o));
      }
      return next;
    });
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrderMap((prev) => {
      const next = new Map(prev);
      for (const [tid, orders] of next) {
        const filtered = orders.filter((o) => o.id !== orderId);
        if (filtered.length === 0) next.delete(tid);
        else next.set(tid, filtered);
      }
      return next;
    });
  };

  const handleCompleteSession = () => {
    if (selectedTable) {
      setOrderMap((prev) => { const n = new Map(prev); n.delete(selectedTable.id); return n; });
      setTables((prev) => prev.map((t) => t.id === selectedTable.id ? { ...t, is_active: false } : t));
      setSelectedTable(null);
    }
    fetchData();
  };

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  const navItems = [
    { label: '대시보드', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { label: '테이블 관리', icon: <TableBarIcon />, path: '/admin/tables' },
    { label: '메뉴 관리', icon: <RestaurantMenuIcon />, path: '/admin/menus' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH, flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}>
        <Toolbar>
          <Typography variant="h6" noWrap>테이블오더</Typography>
        </Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} selected={item.path === '/admin/dashboard'}
              onClick={() => navigate(item.path)} data-testid={`nav-${item.label}`}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ ml: `${DRAWER_WIDTH}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>대시보드</Typography>
            <Chip label={sseConnected ? '실시간 연결' : '연결 끊김'}
              color={sseConnected ? 'success' : 'error'} size="small" sx={{ mr: 2 }} />
            <IconButton color="inherit" onClick={handleLogout} data-testid="btn-logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {tables.map((table) => (
              <Grid item xs={6} sm={4} md={3} key={table.id}>
                <TableCard table={table} orders={orderMap.get(table.id) || []}
                  isHighlighted={highlightedTables.has(table.id)}
                  onClick={() => setSelectedTable(table)} />
              </Grid>
            ))}
          </Grid>
          {tables.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 8 }}>
              등록된 테이블이 없습니다. 테이블 관리에서 추가해주세요.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Modals */}
      {selectedTable && !showHistory && (
        <OrderDetailModal open={!!selectedTable} onClose={() => setSelectedTable(null)}
          table={selectedTable} orders={orderMap.get(selectedTable.id) || []}
          onStatusChange={handleStatusChange} onDelete={handleDeleteOrder}
          onComplete={handleCompleteSession} onViewHistory={() => setShowHistory(true)} />
      )}
      {selectedTable && showHistory && (
        <OrderHistoryModal open={showHistory}
          onClose={() => setShowHistory(false)} tableId={selectedTable.id} />
      )}
    </Box>
  );
}
