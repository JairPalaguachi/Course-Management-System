import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, FormControl, Grid, InputLabel,
    MenuItem, Select, Stack, TextField, Typography, CssBaseline,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';

import {
    TEAL_DARK, TEAL_MID, TEAL, TEAL_LIGHT,
    cardSx, sectionTitleSx, inputSx, LEVELS,
    makeSection, normalizeSections, buildSectionsPayload, buildInitialContent,
} from '../../components/CourseEditorHelpers';
import { ProgressSidebar, SectionEditor } from '../../components/CourseEditorParts';
import { getStatusLabel, getStatusColor } from '../../components/courseUtils';
import {
    getAdminCourseDetail, updateAdminCourse, getCategories,
    uploadAdminCourseCover, uploadAdminContentFile,
} from '../../services/courseService';

function AdminCourseEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [hasCover, setHasCover] = useState(false);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('draft');

    const [formData, setFormData] = useState({
        title: '', description: '', category: '', duration: '',
        level: 'beginner', objectives: '', preview_video: '', language: 'Español',
        rejection_reason: '', is_active: true,
    });
    const [sections, setSections] = useState([]);

    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const course = await getAdminCourseDetail(id);
                setFormData({
                    title: course.title || '',
                    description: course.description || '',
                    category: course.category || '',
                    duration: course.duration || '',
                    level: course.level || 'beginner',
                    objectives: course.objectives || '',
                    preview_video: course.preview_video || '',
                    language: course.language || 'Español',
                    rejection_reason: course.rejection_reason || '',
                    is_active: course.is_active ?? true,
                });
                setStatus(course.status || 'draft');
                setSections(normalizeSections(course.sections || []));
                setHasCover(!!course.cover_image);
                if (course.cover_image) setCoverPreview(course.cover_image);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el curso.');
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategories(await getCategories());
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };
        loadCategories();
    }, []);

    const field = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));
    const update = (sid, val) => setSections((p) => p.map((s) => (s.id === sid ? val : s)));
    const remove = (sid) => setSections((p) => p.filter((s) => s.id !== sid));
    const add = () => setSections((p) => [...p, makeSection()]);

    const validate = () => {
        if (!formData.title.trim()) return 'El título es obligatorio.';
        if (!formData.description.trim()) return 'La descripción es obligatoria.';
        if (!formData.category) return 'La categoría es obligatoria.';
        if (!formData.duration || Number(formData.duration) <= 0) return 'La duración debe ser mayor a 0.';
        return '';
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        setLoading(true);

        try {
            const result = await updateAdminCourse(id, {
                title: formData.title,
                description: formData.description,
                category: Number(formData.category),
                duration: Number(formData.duration),
                level: formData.level,
                objectives: formData.objectives,
                preview_video: formData.preview_video,
                language: formData.language,
                initial_content: buildInitialContent(sections) || 'Sin contenido inicial',
                sections_meta: buildSectionsPayload(sections),
                rejection_reason: formData.rejection_reason,
                is_active: formData.is_active,
            });

            if (coverFile) {
                const coverResult = await uploadAdminCourseCover(id, coverFile);
                setCoverPreview(coverResult.cover_url || coverPreview);
            }

            if (result.sections?.length > 0) {
                setSections(normalizeSections(result.sections));
            }
            if (result.status) setStatus(result.status);

            navigate('/admin/dashboard');
        } catch (e) {
            console.error(e);
            if (e.response?.status === 403) setError('No tienes permiso para editar este curso.');
            else if (e.response?.status === 404) setError('Curso no encontrado.');
            else if (e.response?.data) setError(typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data));
            else setError('Error al actualizar el curso.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                <CircularProgress sx={{ color: TEAL }} />
            </Box>
        );
    }

    const statusColor = getStatusColor(status);

    return (
        <>
            <CssBaseline />
            <Box sx={{
                minHeight: '100vh', backgroundColor: TEAL_LIGHT, width: '100vw',
                position: 'relative', left: '50%', right: '50%',
                marginLeft: '-50vw', marginRight: '-50vw', overflowX: 'hidden',
            }}>
                <Box sx={{
                    background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                    pt: { xs: 5, md: 7 }, pb: { xs: 4, md: 6 }, width: '100%',
                }}>
                    <Container maxWidth="lg">
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}
                            sx={{ color: 'rgba(255,255,255,0.65)', textTransform: 'none', mb: 2, px: 0,
                                  '&:hover': { color: '#fff', background: 'transparent' } }}>
                            Regresar
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                                Editar curso (administrador)
                            </Typography>
                            <Chip label={getStatusLabel(status)} size="small"
                                sx={{ backgroundColor: statusColor.bg, color: statusColor.color, fontWeight: 700 }} />
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, mt: 0.5 }}>
                            Como administrador puedes editar toda la información, secciones, archivos y portada.
                        </Typography>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ pt: 3.5, pb: 10 }}>
                    {error && (
                        <Box sx={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 3,
                                    px: 2, py: 1.5, mb: 2.5, color: '#b91c1c', fontSize: 14 }}>
                            {error}
                        </Box>
                    )}
                    {success && (
                        <Box sx={{ background: TEAL_MID, borderRadius: 3, px: 2, py: 1.5, mb: 2.5,
                                    color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: '#5eead4', fontSize: 20 }} />
                            {success}
                        </Box>
                    )}

                    <Grid container spacing={2.5} alignItems="flex-start">
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2.5}>
                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
                                        <Typography sx={sectionTitleSx}>Información básica</Typography>

                                        <TextField fullWidth label="Título del curso *" size="small"
                                            value={formData.title} onChange={field('title')} sx={{ mb: 2, ...inputSx }} />

                                        <TextField fullWidth label="Descripción corta *" size="small" multiline rows={3}
                                            value={formData.description} onChange={field('description')} sx={{ mb: 2, ...inputSx }} />

                                        <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Categoría *</InputLabel>
                                                    <Select value={formData.category} label="Categoría *" onChange={field('category')} sx={inputSx}>
                                                        {categories.map((c) => (
                                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField fullWidth size="small" label="Duración (horas) *" type="number"
                                                    value={formData.duration} onChange={field('duration')}
                                                    inputProps={{ min: 1 }} sx={inputSx} />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Nivel</InputLabel>
                                                    <Select value={formData.level} label="Nivel" onChange={field('level')} sx={inputSx}>
                                                        {LEVELS.map((l) => (
                                                            <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <TextField fullWidth label="Objetivos de aprendizaje" size="small" multiline rows={3}
                                            value={formData.objectives} onChange={field('objectives')} sx={{ mb: 2, ...inputSx }} />

                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12} sm={8}>
                                                <TextField fullWidth size="small" label="Video de presentación (URL)"
                                                    value={formData.preview_video} onChange={field('preview_video')} sx={inputSx} />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Idioma</InputLabel>
                                                    <Select value={formData.language} label="Idioma" onChange={field('language')} sx={inputSx}>
                                                        {['Español', 'Inglés', 'Portugués'].map((l) => (
                                                            <MenuItem key={l} value={l}>{l}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                            <Typography sx={sectionTitleSx}>Secciones del curso</Typography>
                                            <Button size="small" startIcon={<AddIcon />} onClick={add} variant="outlined"
                                                sx={{ textTransform: 'none', borderColor: TEAL, color: TEAL, borderStyle: 'dashed',
                                                      borderRadius: 2, fontWeight: 600, fontSize: 12,
                                                      '&:hover': { background: TEAL_LIGHT, borderColor: TEAL } }}>
                                                Nueva sección
                                            </Button>
                                        </Box>

                                        {sections.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>
                                                <Typography sx={{ fontSize: 14 }}>Este curso aún no tiene secciones.</Typography>
                                            </Box>
                                        )}

                                        {sections.map((s, i) => (
                                            <SectionEditor key={s.id} section={s} index={i}
                                                onChange={(v) => update(s.id, v)}
                                                onRemove={() => remove(s.id)}
                                                uploadFn={uploadAdminContentFile} />
                                        ))}
                                    </CardContent>
                                </Card>

                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Stack spacing={2} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                                <ProgressSidebar formData={formData} hasCover={hasCover} />

                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#64748b', mb: 1.5 }}>
                                            Portada del curso
                                        </Typography>
                                        <input type="file" accept="image/jpeg, image/png, image/webp"
                                            id="admin-cover-upload-input" style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setCoverFile(file);
                                                    setCoverPreview(URL.createObjectURL(file));
                                                    setHasCover(true);
                                                }
                                            }} />
                                        {coverPreview ? (
                                            <>
                                                <Box sx={{ height: 140, borderRadius: 2, overflow: 'hidden', mb: 1,
                                                            backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                                <label htmlFor="admin-cover-upload-input">
                                                    <Button fullWidth size="small" component="span"
                                                        sx={{ color: TEAL, textTransform: 'none', fontSize: 12 }}>
                                                        Cambiar portada
                                                    </Button>
                                                </label>
                                            </>
                                        ) : (
                                            <label htmlFor="admin-cover-upload-input">
                                                <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: 2, py: 3.5, textAlign: 'center',
                                                            cursor: 'pointer', color: '#94a3b8', transition: 'all .15s',
                                                            '&:hover': { borderColor: TEAL, color: TEAL, background: '#f0fdfa' } }}>
                                                    <UploadIcon sx={{ fontSize: 26, display: 'block', mx: 'auto', mb: 0.5 }} />
                                                    <Typography sx={{ fontSize: 13 }}>Clic para subir imagen</Typography>
                                                    <Typography sx={{ fontSize: 11, mt: 0.25 }}>JPG · PNG · 1280×720 px</Typography>
                                                </Box>
                                            </label>
                                        )}
                                    </CardContent>
                                </Card>

                                <Button fullWidth variant="contained" size="large"
                                    startIcon={loading ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : <SaveIcon />}
                                    onClick={handleSubmit} disabled={loading}
                                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: 14,
                                          backgroundColor: TEAL, color: '#fff', boxShadow: '0 4px 14px rgba(15,118,110,0.3)',
                                          '&:hover': { backgroundColor: TEAL_MID, boxShadow: '0 6px 18px rgba(15,118,110,0.38)' },
                                          '&.Mui-disabled': { background: '#e2e8f0', boxShadow: 'none' } }}>
                                    Guardar cambios
                                </Button>

                                <Button fullWidth variant="outlined" size="large"
                                    onClick={() => navigate('/admin/dashboard')} disabled={loading}
                                    sx={{ py: 1.4, borderRadius: 3, fontWeight: 600, textTransform: 'none', fontSize: 13,
                                          borderColor: TEAL, color: TEAL, '&:hover': { background: TEAL_LIGHT } }}>
                                    Cancelar
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default AdminCourseEdit;