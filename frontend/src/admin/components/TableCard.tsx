import { Card, CardActionArea, CardContent, Typography, Chip, Box } from '@mui/material';
import type { Table, Order } from '../../types';

interface Props {
  table: Table;
  orders: Order[];
  isHighlighted: boolean;
  onClick: () => void;
}

export default function TableCard({ table, orders, isHighlighted, onClick }: Props) {
  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <Card
      sx={{
        border: isHighlighted ? '2px solid #f44336' : '1px solid #e0e0e0',
        animation: isHighlighted ? 'pulse 1s ease-in-out 3' : 'none',
        '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      }}
      data-testid={`table-card-${table.table_number}`}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">테이블 {table.table_number}</Typography>
            {table.is_active ? (
              <Chip label="사용중" color="success" size="small" />
            ) : (
              <Chip label="비활성" color="default" size="small" />
            )}
          </Box>
          {orders.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                주문 {orders.length}건 · 총 {totalAmount.toLocaleString()}원
              </Typography>
              {pendingCount > 0 && (
                <Chip label={`대기 ${pendingCount}건`} color="warning" size="small" sx={{ mt: 1 }} />
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">주문 없음</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
