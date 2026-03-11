import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/client';
import type { Order, TableConfig } from '../../types';
import OrderHistoryItem from '../components/OrderHistoryItem';
import Loading from '../../shared/Loading';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const config: TableConfig | null = (() => {
    try { return JSON.parse(localStorage.getItem('table_config') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    if (!config) { navigate('/login', { replace: true }); return; }
    api.get<Order[]>(`/api/orders?table_id=${config.table_id}`)
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => navigate('/menu')} data-testid="history-back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">주문 내역</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {orders.length === 0 && !loading && (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>주문 내역이 없습니다</Typography>
        )}
        {orders.map((order) => <OrderHistoryItem key={order.id} order={order} />)}
      </Box>
      <Loading open={loading} />
    </Box>
  );
}
