import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import api from '../../api/client';
import type { TableConfig, TableLoginResponse } from '../../types';
import Loading from '../../shared/Loading';

export default function LoginPage() {
  const navigate = useNavigate();
  const [storeIdentifier, setStoreIdentifier] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 자동 로그인 시도
  useEffect(() => {
    const saved = localStorage.getItem('table_config');
    if (saved) {
      const config: TableConfig = JSON.parse(saved);
      api.post<TableLoginResponse>('/api/auth/table/login', {
        store_identifier: config.store_identifier,
        table_number: config.table_number,
        password: config.password,
      })
        .then((res) => {
          const updated: TableConfig = { ...config, ...res.data };
          localStorage.setItem('table_config', JSON.stringify(updated));
          navigate('/menu', { replace: true });
        })
        .catch(() => {
          localStorage.removeItem('table_config');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<TableLoginResponse>('/api/auth/table/login', {
        store_identifier: storeIdentifier,
        table_number: Number(tableNumber),
        password,
      });
      const config: TableConfig = {
        store_identifier: storeIdentifier,
        table_number: Number(tableNumber),
        password,
        table_id: res.data.table_id,
        store_id: res.data.store_id,
      };
      localStorage.setItem('table_config', JSON.stringify(config));
      navigate('/menu', { replace: true });
    } catch {
      setError('로그인에 실패했습니다. 정보를 확인해주세요.');
      setLoading(false);
    }
  };

  if (loading) return <Loading open />;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>테이블 초기 설정</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="매장 식별자" value={storeIdentifier} onChange={(e) => setStoreIdentifier(e.target.value)}
              required data-testid="login-store-identifier" />
            <TextField label="테이블 번호" type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}
              required inputProps={{ min: 1 }} data-testid="login-table-number" />
            <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required inputProps={{ minLength: 4 }} data-testid="login-password" />
            <Button type="submit" variant="contained" size="large" data-testid="login-submit">설정 완료</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
