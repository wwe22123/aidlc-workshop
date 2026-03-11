import { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import api from '../../api/client';

interface Props {
  storeId: number;
  onSuccess: () => void;
}

export default function TableSettingForm({ storeId, onSuccess }: Props) {
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/tables', {
        table_number: Number(tableNumber),
        password,
      }, { params: { store_id: storeId } });
      setTableNumber('');
      setPassword('');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || '테이블 생성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      <TextField label="테이블 번호" type="number" value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)} required
        inputProps={{ min: 1 }} size="small" data-testid="input-table-number" />
      <TextField label="비밀번호" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)} required
        inputProps={{ minLength: 4 }} size="small" data-testid="input-table-password" />
      <Button type="submit" variant="contained" disabled={loading} data-testid="btn-add-table">
        {loading ? '추가 중...' : '테이블 추가'}
      </Button>
    </Box>
  );
}
