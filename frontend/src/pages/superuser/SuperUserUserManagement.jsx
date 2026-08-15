import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Container, Typography, Stack, Chip, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch,
    CircularProgress, Alert, IconButton, Tooltip, InputAdornment,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';

import {
    getAllUsers, createUser, updateUser, deleteUser, setUserPassword, getAdminCategories, createCategory, updateCategory, deleteCategory,
} from '../../services/superUserService';

const TEAL_DARK = '#0a2e2b';
const TEAL_MID = '#10423f';
const TEAL = '#0f766e';
const TEAL_LIGHT = '#f0faf8';

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        '&.Mui-focused fieldset': { borderColor: TEAL }
    },
    '& label.Mui-focused': { color: TEAL },
};

const ROLES = [
    { value: 'student', label: 'Estudiante' },
    { value: 'tutor', label: 'Tutor' },
    { value: 'admin', label: 'Administrador' },
];

const ROLE_CHIP = {
    student: { bg: '#dbeafe', color: '#1e40af' },
    tutor: { bg: '#ede9fe', color: '#6d28d9' },
    admin: { bg: '#d1fae5', color: '#065f46' },
};

const EMPTY_FORM = {
    username: '', email: '', first_name: '', last_name: '',
    role: 'student', is_active: true, password: '', password_confirm: '',
};

function SuperUserUserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null = creando
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const [pwDialogOpen, setPwDialogOpen] = useState(false);
    const [pwTarget, setPwTarget] = useState(null);
    const [pwForm, setPwForm] = useState({ new_password: '', new_password_confirm: '' });
    const [pwError, setPwError] = useState('');

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catError, setCatError] = useState('');

    const [catDialogOpen, setCatDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [catForm, setCatForm] = useState({ name: '', description: '' });
    const [catFormError, setCatFormError] = useState('');
    const [catSaving, setCatSaving] = useState(false);
    const [catDeleteTarget, setCatDeleteTarget] = useState(null);
    const [catDeleteError, setCatDeleteError] = useState('');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (roleFilter) params.role = roleFilter;
            if (search) params.search = search;
            const nextUsers = await getAllUsers(params);
            setUsers(nextUsers);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    }, [roleFilter, search]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            void loadUsers();
        }, 300);
        return () => clearTimeout(timeout);
    }, [loadUsers]);

    const refreshCategories = useCallback(() => {
        let isMounted = true;

        setCatLoading(true);
        setCatError('');

        getAdminCategories()
            .then((nextCategories) => {
                if (isMounted) {
                    setCategories(nextCategories);
                }
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) {
                    setCatError('No se pudieron cargar las categorías.');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setCatLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            void refreshCategories();
        }, 0);

        return () => clearTimeout(timeout);
    }, [refreshCategories]);


    const openCreate = () => {
        setEditingUser(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setDialogOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({
            username: user.username, email: user.email,
            first_name: user.first_name || '', last_name: user.last_name || '',
            role: user.role, is_active: user.is_active,
            password: '', password_confirm: '',
        });
        setFormError('');
        setDialogOpen(true);
    };

    const field = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    const handleSave = async () => {
        setFormError('');
        if (!form.username.trim() || !form.email.trim()) {
            setFormError('Usuario y correo son obligatorios.');
            return;
        }
        if (!editingUser && form.password !== form.password_confirm) {
            setFormError('Las contraseñas no coinciden.');
            return;
        }
        setSaving(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, {
                    username: form.username, email: form.email,
                    first_name: form.first_name, last_name: form.last_name,
                    role: form.role, is_active: form.is_active,
                });
            } else {
                await createUser({
                    username: form.username, email: form.email,
                    first_name: form.first_name, last_name: form.last_name,
                    role: form.role, is_active: form.is_active,
                    password: form.password, password_confirm: form.password_confirm,
                });
            }
            setDialogOpen(false);
            loadUsers();
        } catch (err) {
            const data = err.response?.data;
            setFormError(data ? Object.values(data).flat().join(' ') : 'Error al guardar el usuario.');
        } finally {
            setSaving(false);
        }
    };

    const openSetPassword = (user) => {
        setPwTarget(user);
        setPwForm({ new_password: '', new_password_confirm: '' });
        setPwError('');
        setPwDialogOpen(true);
    };

    const handleSetPassword = async () => {
        setPwError('');
        if (pwForm.new_password !== pwForm.new_password_confirm) {
            setPwError('Las contraseñas no coinciden.');
            return;
        }
        if (pwForm.new_password.length < 8) {
            setPwError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        try {
            await setUserPassword(pwTarget.id, pwForm.new_password, pwForm.new_password_confirm);
            setPwDialogOpen(false);
        } catch (err) {
            const data = err.response?.data;
            setPwError(data ? Object.values(data).flat().join(' ') : 'Error al cambiar la contraseña.');
        }
    };

    const handleDelete = async () => {
        setDeleteError('');
        try {
            await deleteUser(deleteTarget.id);
            setDeleteTarget(null);
            loadUsers();
        } catch (err) {
            setDeleteError(err.response?.data?.detail || 'No se pudo eliminar el usuario.');
        }
    };

    const openCreateCategory = () => {
        setEditingCategory(null);
        setCatForm({ name: '', description: '' });
        setCatFormError('');
        setCatDialogOpen(true);
    };

    const openEditCategory = (cat) => {
        setEditingCategory(cat);
        setCatForm({ name: cat.name, description: cat.description || '' });
        setCatFormError('');
        setCatDialogOpen(true);
    };

    const handleSaveCategory = async () => {
        setCatFormError('');
        if (!catForm.name.trim()) {
            setCatFormError('El nombre es obligatorio.');
            return;
        }
        setCatSaving(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, catForm);
            } else {
                await createCategory(catForm);
            }
            setCatDialogOpen(false);
            refreshCategories();
        } catch (err) {
            const data = err.response?.data;
            setCatFormError(data ? Object.values(data).flat().join(' ') : 'Error al guardar la categoría.');
        } finally {
            setCatSaving(false);
        }
    };

    const handleDeleteCategory = async () => {
        setCatDeleteError('');
        try {
            await deleteCategory(catDeleteTarget.id);
            setCatDeleteTarget(null);
            refreshCategories();
        } catch (err) {
            setCatDeleteError(err.response?.data?.detail || 'No se pudo eliminar la categoría.');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', backgroundColor: TEAL_LIGHT, width: '100%',
            overflowX: 'hidden',
        }}>
            <Box sx={{
                background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                pt: { xs: 6, md: 8 }, pb: { xs: 5, md: 7 }, width: '100%',
            }}>
                <Container maxWidth="lg">

                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}
                        sx={{
                            color: 'rgba(255,255,255,0.7)', mb: 3, ml: 1, textTransform: 'none',
                            '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' }
                        }}>
                        Panel de administrador
                    </Button>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,255,255,0.12)',
                            border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AdminPanelSettingsIcon sx={{ fontSize: 26, color: '#fff' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                            Gestión de usuarios
                        </Typography>
                    </Stack>
                    <Typography sx={{ color: 'rgba(255,255,255,0.62)', pl: '64px' }}>
                        Crea, edita, elimina y administra contraseñas de cualquier usuario del sistema.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Paper elevation={0} sx={{
                    border: '1px solid #e2e8f0', borderRadius: 3, p: 2.5, mb: 3,
                    display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center'
                }}>
                    <TextField size="small" placeholder="Buscar por usuario o correo…" value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1, minWidth: 220, ...inputSx }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }} />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Rol</InputLabel>
                        <Select value={roleFilter} label="Rol" onChange={(e) => setRoleFilter(e.target.value)} sx={inputSx}>
                            <MenuItem value="">Todos los roles</MenuItem>
                            {ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
                        sx={{
                            backgroundColor: TEAL, textTransform: 'none', fontWeight: 700, borderRadius: 2,
                            '&:hover': { backgroundColor: TEAL_MID }
                        }}>
                        Nuevo usuario
                    </Button>
                </Paper>

                {error && <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: TEAL }} />
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        {['ID', 'Usuario', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones'].map((h) => (
                                            <TableCell key={h} sx={{
                                                fontWeight: 700, color: TEAL_MID, fontSize: 12,
                                                textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0'
                                            }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((u, idx) => (
                                        <TableRow key={u.id} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                            <TableCell sx={{ color: '#94a3b8' }}>#{u.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                                            <TableCell>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{u.email}</TableCell>
                                            <TableCell>
                                                <Chip label={ROLES.find((r) => r.value === u.role)?.label || u.role} size="small"
                                                    sx={{
                                                        backgroundColor: (ROLE_CHIP[u.role] || {}).bg || '#f1f5f9',
                                                        color: (ROLE_CHIP[u.role] || {}).color || '#475569', fontWeight: 600
                                                    }} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={u.is_active ? 'Activo' : 'Inactivo'} size="small"
                                                    sx={{
                                                        backgroundColor: u.is_active ? '#d1fae5' : '#f1f5f9',
                                                        color: u.is_active ? '#065f46' : '#94a3b8', fontWeight: 600
                                                    }} />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5}>
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" onClick={() => openEdit(u)} sx={{ color: TEAL }}>
                                                            <EditIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cambiar contraseña">
                                                        <IconButton size="small" onClick={() => openSetPassword(u)} sx={{ color: '#b45309' }}>
                                                            <KeyIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small" onClick={() => { setDeleteTarget(u); setDeleteError(''); }} sx={{ color: '#e11d48' }}>
                                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.length === 0 && (
                                        <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>
                                            No se encontraron usuarios.
                                        </TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Container>

            <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <CategoryIcon sx={{ color: TEAL }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, color: TEAL_DARK }}>
                            Categorías de cursos
                        </Typography>
                    </Stack>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateCategory}
                        sx={{
                            ml: 'auto',
                            backgroundColor: TEAL, textTransform: 'none', fontWeight: 700, borderRadius: 2,
                            '&:hover': { backgroundColor: TEAL_MID }
                        }} >
                        Nueva categoría
                    </Button>
                </Stack>

                {catError && <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>{catError}</Alert>}

                {catLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: TEAL }} />
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        {['ID', 'Nombre', 'Descripción', 'Acciones'].map((h) => (
                                            <TableCell key={h} sx={{
                                                fontWeight: 700, color: TEAL_MID, fontSize: 12,
                                                textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0'
                                            }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((cat, idx) => (
                                        <TableRow key={cat.id} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                            <TableCell sx={{ color: '#94a3b8' }}>#{cat.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                                            <TableCell sx={{ color: '#475569' }}>{cat.description || '—'}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5}>
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" onClick={() => openEditCategory(cat)} sx={{ color: TEAL }}>
                                                            <EditIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small" onClick={() => { setCatDeleteTarget(cat); setCatDeleteError(''); }} sx={{ color: '#e11d48' }}>
                                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {categories.length === 0 && (
                                        <TableRow><TableCell colSpan={4} sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>
                                            No hay categorías registradas.
                                        </TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Container>

            {/* ── Dialog: crear/editar categoría ── */}
            <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: TEAL_DARK }}>
                    {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                </DialogTitle>
                <DialogContent>
                    {catFormError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{catFormError}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth size="small" label="Nombre"
                            value={catForm.name} onChange={(e) => setCatForm((p) => ({ ...p, name: e.target.value }))} sx={inputSx} />
                        <TextField fullWidth size="small" label="Descripción" multiline rows={3}
                            value={catForm.description} onChange={(e) => setCatForm((p) => ({ ...p, description: e.target.value }))} sx={inputSx} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setCatDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSaveCategory} disabled={catSaving}
                        sx={{
                            backgroundColor: TEAL, textTransform: 'none', fontWeight: 700,
                            '&:hover': { backgroundColor: TEAL_MID }
                        }}>
                        {catSaving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: confirmar eliminación de categoría ── */}
            <Dialog open={!!catDeleteTarget} onClose={() => setCatDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#b91c1c' }}>Eliminar categoría</DialogTitle>
                <DialogContent>
                    {catDeleteError && <Alert severity="error" sx={{ mb: 2 }}>{catDeleteError}</Alert>}
                    <Typography sx={{ fontSize: 14, color: '#475569' }}>
                        ¿Seguro que quieres eliminar <b>{catDeleteTarget?.name}</b>? Los cursos que la usan quedarán sin categoría asignada.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setCatDeleteTarget(null)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleDeleteCategory}
                        sx={{
                            backgroundColor: '#e11d48', textTransform: 'none', fontWeight: 700,
                            '&:hover': { backgroundColor: '#be123c' }
                        }}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: crear/editar ── */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: TEAL_DARK }}>
                    {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
                </DialogTitle>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{formError}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth size="small" label="Usuario" value={form.username} onChange={field('username')} sx={inputSx} />
                            <TextField fullWidth size="small" label="Correo" value={form.email} onChange={field('email')} sx={inputSx} />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField fullWidth size="small" label="Nombres" value={form.first_name} onChange={field('first_name')} sx={inputSx} />
                            <TextField fullWidth size="small" label="Apellidos" value={form.last_name} onChange={field('last_name')} sx={inputSx} />
                        </Stack>
                        <FormControl fullWidth size="small">
                            <InputLabel>Rol</InputLabel>
                            <Select value={form.role} label="Rol" onChange={field('role')} sx={inputSx}>
                                {ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                                sx={{
                                    '& .Mui-checked .MuiSwitch-thumb': { background: TEAL },
                                    '& .Mui-checked + .MuiSwitch-track': { background: `${TEAL} !important` }
                                }} />}
                            label="Usuario activo" />
                        {!editingUser && (
                            <Stack direction="row" spacing={2}>
                                <TextField fullWidth size="small" type="password" label="Contraseña"
                                    value={form.password} onChange={field('password')} sx={inputSx} />
                                <TextField fullWidth size="small" type="password" label="Confirmar contraseña"
                                    value={form.password_confirm} onChange={field('password_confirm')} sx={inputSx} />
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}
                        sx={{
                            backgroundColor: TEAL, textTransform: 'none', fontWeight: 700,
                            '&:hover': { backgroundColor: TEAL_MID }
                        }}>
                        {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: cambiar contraseña ── */}
            <Dialog open={pwDialogOpen} onClose={() => setPwDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: TEAL_DARK }}>
                    Cambiar contraseña — {pwTarget?.username}
                </DialogTitle>
                <DialogContent>
                    {pwError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{pwError}</Alert>}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField fullWidth size="small" type="password" label="Nueva contraseña"
                            value={pwForm.new_password}
                            onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))} sx={inputSx} />
                        <TextField fullWidth size="small" type="password" label="Confirmar nueva contraseña"
                            value={pwForm.new_password_confirm}
                            onChange={(e) => setPwForm((p) => ({ ...p, new_password_confirm: e.target.value }))} sx={inputSx} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setPwDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSetPassword}
                        sx={{
                            backgroundColor: TEAL, textTransform: 'none', fontWeight: 700,
                            '&:hover': { backgroundColor: TEAL_MID }
                        }}>
                        Cambiar contraseña
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: confirmar eliminación ── */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#b91c1c' }}>Eliminar usuario</DialogTitle>
                <DialogContent>
                    {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
                    <Typography sx={{ fontSize: 14, color: '#475569' }}>
                        ¿Seguro que quieres eliminar a <b>{deleteTarget?.username}</b>? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancelar</Button>
                    <Button variant="contained" onClick={handleDelete}
                        sx={{
                            backgroundColor: '#e11d48', textTransform: 'none', fontWeight: 700,
                            '&:hover': { backgroundColor: '#be123c' }
                        }}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SuperUserUserManagement;