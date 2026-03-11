import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import type { Order } from '../../types';

const STATUS_MAP: Record<string, { label: string; color: 'warning' | 'info' | 'success' }> = {
  PENDING: { label: '대기중', color: 'warning' },
  PREPARING: { label: '준비중', color: 'info' },
  COMPLETED: { label: '완료', color: 'success' },
};

interface Props {
  order: Order;
}

export default function OrderHistoryItem({ order }: Props) {
  const status = STATUS_MAP[order.status] || { label: order.status, color: 'warning' as const };

  return (
    <Card sx={{ mb: 2 }} data-testid={`order-history-${order.id}`}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">{order.order_number}</Typography>
          <Chip label={status.label} color={status.color} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {new Date(order.created_at).toLocaleString('ko-KR')}
        </Typography>
        {order.items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">{item.menu_name} × {item.quantity}</Typography>
            <Typography variant="body2">{item.subtotal.toLocaleString()}원</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
          <Typography variant="subtitle1" color="primary">{order.total_amount.toLocaleString()}원</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
