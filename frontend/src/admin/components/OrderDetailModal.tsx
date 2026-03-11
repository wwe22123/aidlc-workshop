import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  List, ListItem, ListItemText, Chip, Box, IconButton, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmDialog from '../../shared/ConfirmDialog';
import api from '../../api/client';
import type { Table, Order } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  table: Table;
  orders: Order[];
  onStatusChange: (orderId: number, status: string) => void;
  onDelete: (orderId: number) => void;
  onComplete: () => void;
  onViewHistory: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: 'warning' | 'info' | 'success' }> = {
  PENDING: { label: '대기', color: 'warning' },
  PREPARING: { label: '준비중', color: 'info' },
  COMPLETED: { label: '완료', color: 'success' },
};

const NEXT_STATUS: Record<string, string> = {
  PENDING: 'PREPARING',
  PREPARING: 'COMPLETED',
};

export default function OrderDetailModal({
  open, onClose, table, orders, onStatusChange, onDelete, onComplete, onViewHistory,
}: Props) {
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const [loading, setLoading] = useState(false);

  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0);

  const handleStatusChange = async (orderId: number, status: string) => {
    setLoading(true);
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      onStatusChange(orderId, status);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: number) => {
    setLoading(true);
    try {
      await api.delete(`/api/orders/${orderId}`);
      onDelete(orderId);
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post(`/api/tables/${table.id}/complete`);
      onComplete();
    } finally {
      setLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth data-testid="order-detail-modal">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          테이블 {table.table_number} 주문 상세
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {orders.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>현재 주문이 없습니다</Typography>
          ) : (
            orders.map((order) => (
              <Box key={order.id} sx={{ mb: 2, p: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">#{order.order_number}</Typography>
                  <Chip label={STATUS_LABELS[order.status]?.label || order.status}
                    color={STATUS_LABELS[order.status]?.color || 'default'} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.created_at).toLocaleTimeString('ko-KR')}
                </Typography>
                <List dense>
                  {order.items.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemText primary={`${item.menu_name} × ${item.quantity}`}
                        secondary={`${item.subtotal.toLocaleString()}원`} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {order.total_amount.toLocaleString()}원
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {NEXT_STATUS[order.status] && (
                      <Button size="small" variant="contained" disabled={loading}
                        onClick={() => handleStatusChange(order.id, NEXT_STATUS[order.status])}
                        data-testid={`btn-status-${order.id}`}>
                        {NEXT_STATUS[order.status] === 'PREPARING' ? '준비 시작' : '완료'}
                      </Button>
                    )}
                    <Button size="small" color="error" disabled={loading}
                      onClick={() => setConfirmAction({
                        title: '주문 삭제', message: `주문 #${order.order_number}을 삭제하시겠습니까?`,
                        action: () => handleDelete(order.id),
                      })}
                      data-testid={`btn-delete-${order.id}`}>삭제</Button>
                  </Box>
                </Box>
              </Box>
            ))
          )}
          {orders.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" align="right">총 합계: {totalAmount.toLocaleString()}원</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button onClick={onViewHistory} data-testid="btn-view-history">과거 이력</Button>
          <Button variant="contained" color="error" disabled={loading}
            onClick={() => setConfirmAction({
              title: '이용 완료', message: `테이블 ${table.table_number}의 이용을 완료하시겠습니까? 모든 주문이 이력으로 이동됩니다.`,
              action: handleComplete,
            })}
            data-testid="btn-complete-session">이용 완료</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        onConfirm={() => confirmAction?.action()}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
