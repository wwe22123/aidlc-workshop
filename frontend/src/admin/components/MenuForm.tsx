import { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Alert, Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../api/client';
import type { Menu, Category } from '../../types';

interface Props {
  menu?: Menu;
  categories: Category[];
  storeId: number;
  onSuccess: () => void;
}

export default function MenuForm({ menu, categories, storeId, onSuccess }: Props) {
  const isEdit = !!menu;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setPrice(String(menu.price));
      setDescription(menu.description || '');
      setCategoryId(String(menu.category_id));
      setImageUrl(menu.image_url || '');
    } else {
      setName(''); setPrice(''); setDescription('');
      setCategoryId(categories.length > 0 ? String(categories[0].id) : '');
      setImageUrl('');
    }
  }, [menu, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post<{ image_url: string }>('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(data.image_url);
    } catch (err: any) {
      setError(err.response?.data?.detail || '이미지 업로드 실패');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        category_id: Number(categoryId),
        name,
        price: Number(price),
        description: description || undefined,
        image_url: imageUrl || undefined,
      };
      if (isEdit && menu) {
        await api.put(`/api/menus/${menu.id}`, payload);
      } else {
        await api.post('/api/menus', payload, { params: { store_id: storeId } });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || '저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField select label="카테고리" value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)} required data-testid="select-category">
        {categories.map((c) => (
          <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
        ))}
      </TextField>
      <TextField label="메뉴명" value={name} onChange={(e) => setName(e.target.value)}
        required data-testid="input-menu-name" />
      <TextField label="가격" type="number" value={price}
        onChange={(e) => setPrice(e.target.value)} required
        inputProps={{ min: 1 }} data-testid="input-menu-price" />
      <TextField label="설명" value={description} onChange={(e) => setDescription(e.target.value)}
        multiline rows={2} data-testid="input-menu-description" />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}
          data-testid="btn-upload-image">
          이미지 업로드
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>
        {imageUrl && (
          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
            {imageUrl}
          </Typography>
        )}
      </Box>

      <Button type="submit" variant="contained" disabled={loading} data-testid="btn-save-menu">
        {loading ? '저장 중...' : isEdit ? '수정' : '추가'}
      </Button>
    </Box>
  );
}
