import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Paper, Table as MuiTable, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import TableSettingForm from '../components/TableSettingForm';
import type { Table } from '../../types';

const DRAWER_WIDTH = 220;

export default function TableManagePage() {
  const navigate = useNavigate();
  const { isAuthenticated, storeId, logout } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true });
  }, [isAuthenticated, navigate]);

  const fetchTables = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data } = await api.get<Table[]>('/api/tables', { params: { store_id: storeId } });
      setTables(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTables(); }, [storeId]);

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  const navItems = [
    { label: '대시보드', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { label: '테이블 관리', icon: <TableBarIcon />, path: '/admin/tables' },
    { label: '메뉴 관리', icon: <RestaurantMenuIcon />, path: '/admin/menus' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH, flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}>
        <Toolbar><Typography variant="h6" noWrap>테이블오더</Typography></Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} selected={item.path === '/admin/tables'}
              onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>테이블 관리</Typography>
            <IconButton color="inherit" onClick={handleLogout} data-testid="btn-logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>새 테이블 추가</Typography>
            {storeId && <TableSettingForm storeId={storeId} onSuccess={fetchTables} />}
          </Paper>

          <TableContainer component={Paper}>
            <MuiTable>
              <TableHead>
                <TableRow>
                  <TableCell>테이블 번호</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>생성일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables.map((t) => (
                  <TableRow key={t.id} data-testid={`table-row-${t.table_number}`}>
                    <TableCell>{t.table_number}</TableCell>
                    <TableCell>
                      <Chip label={t.is_active ? '사용중' : '비활성'} size="small"
                        color={t.is_active ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>{new Date(t.created_at).toLocaleDateString('ko-KR')}</TableCell>
                  </TableRow>
                ))}
                {tables.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">등록된 테이블이 없습니다</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
