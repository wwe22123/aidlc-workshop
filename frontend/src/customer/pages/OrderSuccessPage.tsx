import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber || '';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/menu', { replace: true });
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Card sx={{ width: 400, textAlign: 'center', p: 3 }}>
        <CardContent>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>주문이 완료되었습니다</Typography>
          {orderNumber && (
            <Typography variant="h4" color="primary" sx={{ my: 2 }} data-testid="order-number">
              {orderNumber}
            </Typography>
          )}
          <Typography color="text.secondary">
            {countdown}초 후 메뉴 화면으로 이동합니다
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
