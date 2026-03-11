import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CartItem as CartItemType } from '../../types';

interface Props {
  item: CartItemType;
  onUpdateQuantity: (menuId: number, delta: number) => void;
  onRemove: (menuId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}
      data-testid={`cart-item-${item.menu_id}`}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{item.menu_name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.price.toLocaleString()}원
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" onClick={() => onUpdateQuantity(item.menu_id, -1)}
          data-testid={`cart-decrease-${item.menu_id}`}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
        <IconButton size="small" onClick={() => onUpdateQuantity(item.menu_id, 1)}
          data-testid={`cart-increase-${item.menu_id}`}>
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onRemove(item.menu_id)}
          data-testid={`cart-remove-${item.menu_id}`}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography sx={{ ml: 1, minWidth: 70, textAlign: 'right', fontWeight: 'bold' }}>
        {(item.price * item.quantity).toLocaleString()}원
      </Typography>
    </Box>
  );
}
