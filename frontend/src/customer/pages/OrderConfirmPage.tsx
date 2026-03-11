import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api/client';
import type { CartItem, TableConfig, Order } from '../../types';
import Loading from '../../shared/Loading';
import Toast from '../../shared/Toast';

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'error' as const });

  const config: TableConfig | null = (() => {
    try { return JSON.parse(localStorage.getItem('table_config') || 'null'); } catch { return null; }
  })();
  const items: CartItem[] = (() => {
    try { return JSON.parse(localStorage.getItem('cart_items') || '[]'); } catch { return []; }
  })();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleConfirm = async () => {
    if (!config || items.length === 0) return;
    setLoading(true);
    try {
      const res = await api.post<Order>('/api/orders', {
        store_id: config.store_id,
        table_id: config.table_id,
        items: items.map((i) => ({ menu_id: i.menu_id, quantity: i.quantity })),
      });
      localStorage.removeItem('cart_items');
      navigate('/order/success', { state: { orderNumber: res.data.order_number }, replace: true });
    } catch {
      setToast({ open: true, message: '주문에 실패했습니다. 다시 시도해주세요.', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => navigate(-1)} data-testid="confirm-back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">주문 확인</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>주문 내역</Typography>
            <List disablePadding>
              {items.map((item) => (
                <ListItem key={item.menu_id} sx={{ px: 0 }}>
                  <ListItemText primary={item.menu_name} secondary={`${item.quantity}개 × ${item.price.toLocaleString()}원`} />
                  <Typography>{(item.price * item.quantity).toLocaleString()}원</Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">총 금액</Typography>
              <Typography variant="h6" color="primary">{total.toLocaleString()}원</Typography>
            </Box>
          </CardContent>
        </Card>
        <Button variant="contained" fullWidth size="large" sx={{ mt: 3 }}
          onClick={handleConfirm} disabled={items.length === 0} data-testid="confirm-order-button">
          주문 확정
        </Button>
      </Box>
      <Loading open={loading} />
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))} />
    </Box>
  );
}
