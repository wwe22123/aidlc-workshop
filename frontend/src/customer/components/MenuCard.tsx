import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import type { Menu } from '../../types';

interface Props {
  menu: Menu;
  onAddToCart: (menu: Menu) => void;
}

export default function MenuCard({ menu, onAddToCart }: Props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} data-testid={`menu-card-${menu.id}`}>
      {menu.image_url && (
        <CardMedia component="img" height="160" image={menu.image_url} alt={menu.name} />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>{menu.name}</Typography>
        {menu.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {menu.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="primary">{menu.price.toLocaleString()}원</Typography>
          <Button variant="outlined" size="small" startIcon={<AddShoppingCartIcon />}
            onClick={() => onAddToCart(menu)} data-testid={`menu-add-cart-${menu.id}`}>
            담기
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
