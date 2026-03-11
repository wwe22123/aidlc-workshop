import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Paper, Tabs, Tab, Grid, Card,
  CardContent, CardActions, Button, Chip, IconButton, Dialog,
  DialogTitle, DialogContent,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import MenuForm from '../components/MenuForm';
import ConfirmDialog from '../../shared/ConfirmDialog';
import type { Category, Menu } from '../../types';

const DRAWER_WIDTH = 220;

export default function MenuManagePage() {
  const navigate = useNavigate();
  const { isAuthenticated, storeId, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCat, setSelectedCat] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true });
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([
        api.get<Category[]>('/api/categories', { params: { store_id: storeId } }),
        api.get<Menu[]>('/api/menus', { params: { store_id: storeId } }),
      ]);
      setCategories(catRes.data);
      setMenus(menuRes.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [storeId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/menus/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
    } catch { /* ignore */ }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMenu(undefined);
    fetchData();
  };

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  const filteredMenus = selectedCat === 0
    ? menus
    : menus.filter((m) => m.category_id === categories[selectedCat - 1]?.id);

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
            <ListItemButton key={item.path} selected={item.path === '/admin/menus'}
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
            <Typography variant="h6" sx={{ flexGrow: 1 }}>메뉴 관리</Typography>
            <Button color="inherit" startIcon={<AddIcon />}
              onClick={() => { setEditingMenu(undefined); setShowForm(true); }}
              data-testid="btn-add-menu">메뉴 추가</Button>
            <IconButton color="inherit" onClick={handleLogout} data-testid="btn-logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={selectedCat} onChange={(_, v) => setSelectedCat(v)}
              variant="scrollable" scrollButtons="auto">
              <Tab label="전체" data-testid="tab-all" />
              {categories.map((c) => (
                <Tab key={c.id} label={c.name} data-testid={`tab-${c.name}`} />
              ))}
            </Tabs>
          </Paper>

          <Grid container spacing={2}>
            {filteredMenus.map((menu) => (
              <Grid item xs={12} sm={6} md={4} key={menu.id}>
                <Card data-testid={`menu-card-${menu.id}`}>
                  {menu.image_url && (
                    <Box sx={{ height: 140, bgcolor: '#eee', backgroundImage: `url(${menu.image_url})`,
                      backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{menu.name}</Typography>
                      <Chip label={menu.is_available ? '판매중' : '품절'} size="small"
                        color={menu.is_available ? 'success' : 'error'} />
                    </Box>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      {menu.price.toLocaleString()}원
                    </Typography>
                    {menu.description && (
                      <Typography variant="body2" color="text.secondary">{menu.description}</Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => { setEditingMenu(menu); setShowForm(true); }}
                      data-testid={`btn-edit-${menu.id}`}>수정</Button>
                    <Button size="small" color="error" onClick={() => setDeleteTarget(menu)}
                      data-testid={`btn-delete-${menu.id}`}>삭제</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {filteredMenus.length === 0 && !loading && (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              등록된 메뉴가 없습니다
            </Typography>
          )}
        </Box>
      </Box>

      {/* Menu Form Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingMenu ? '메뉴 수정' : '메뉴 추가'}
          <IconButton onClick={() => setShowForm(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {storeId && (
            <MenuForm menu={editingMenu} categories={categories}
              storeId={storeId} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteTarget} title="메뉴 삭제"
        message={`"${deleteTarget?.name}" 메뉴를 삭제하시겠습니까?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </Box>
  );
}
