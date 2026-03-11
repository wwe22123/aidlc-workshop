import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import type { AdminLoginRequest, TokenResponse } from '../../types';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<AdminLoginRequest>({
    store_identifier: '', username: '', password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof AdminLoginRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<TokenResponse>('/api/auth/admin/login', form);
      // decode store_id from JWT payload
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      login(data.access_token, payload.store_id);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ width: 400, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>관리자 로그인</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }} data-testid="login-error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="매장 식별자" value={form.store_identifier}
              onChange={handleChange('store_identifier')} margin="normal" required
              data-testid="input-store-identifier" />
            <TextField fullWidth label="아이디" value={form.username}
              onChange={handleChange('username')} margin="normal" required
              data-testid="input-username" />
            <TextField fullWidth label="비밀번호" type="password" value={form.password}
              onChange={handleChange('password')} margin="normal" required
              data-testid="input-password" />
            <Button fullWidth type="submit" variant="contained" size="large"
              disabled={loading} sx={{ mt: 2 }} data-testid="btn-login">
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
