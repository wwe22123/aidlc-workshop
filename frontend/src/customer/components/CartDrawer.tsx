import { Drawer, Box, Typography, Button, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CartItemComponent from './CartItem';
import type { CartItem } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (menuId: number, delta: number) => void;
  onRemove: (menuId: number) => void;
  onClear: () => void;
  onOrder: () => void;
}

export default function CartDrawer({ open, onClose, items, onUpdateQuantity, onRemove, onClear, onOrder }: Props) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} data-testid="cart-drawer"
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">장바구니</Typography>
          <Box>
            {items.length > 0 && (
              <IconButton onClick={onClear} size="small" data-testid="cart-clear">
                <DeleteSweepIcon />
              </IconButton>
            )}
            <IconButton onClick={onClose} data-testid="cart-close"><CloseIcon /></IconButton>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflowY: 'auto', my: 1 }}>
          {items.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>장바구니가 비어있습니다</Typography>
          ) : (
            items.map((item) => (
              <CartItemComponent key={item.menu_id} item={item}
                onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
            ))
          )}
        </Box>
        <Divider />
        <Box sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">총 금액</Typography>
            <Typography variant="h6" color="primary">{total.toLocaleString()}원</Typography>
          </Box>
          <Button variant="contained" fullWidth size="large" disabled={items.length === 0}
            onClick={onOrder} data-testid="cart-order-button">
            주문하기 ({items.length}개)
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
