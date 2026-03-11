import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, TextField, Typography,
  List, ListItem, ListItemText, Box, Divider, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api/client';
import type { OrderHistory } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  tableId: number;
}

export default function OrderHistoryModal({ open, onClose, tableId }: Props) {
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (dateFilter) params.date = dateFilter;
        const { data } = await api.get<OrderHistory[]>(`/api/tables/${tableId}/history`, { params });
        setHistory(data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [open, tableId, dateFilter]);

  const parseItems = (json: string) => {
    try { return JSON.parse(json) as { menu_name: string; quantity: number; subtotal: number }[]; }
    catch { return []; }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth data-testid="order-history-modal">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        과거 주문 이력
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField type="date" label="날짜 필터" value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
          data-testid="input-date-filter" />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : history.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>이력이 없습니다</Typography>
        ) : (
          history.map((h) => (
            <Box key={h.id} sx={{ mb: 2, p: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">#{h.order_number}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(h.ordered_at).toLocaleString('ko-KR')}
                </Typography>
              </Box>
              <List dense>
                {parseItems(h.items_json).map((item, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText primary={`${item.menu_name} × ${item.quantity}`}
                      secondary={`${item.subtotal.toLocaleString()}원`} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" fontWeight="bold" align="right">
                {h.total_amount.toLocaleString()}원
              </Typography>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}
