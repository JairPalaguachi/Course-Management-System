import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, FormControl, Grid, InputLabel,
    MenuItem, Select, Stack, TextField, Typography, CssBaseline,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';


import {
    getCourseDetail,
    updateTutorCourse,
    getCategories,
    uploadCourseCover,
} from '../services/courseService';
import {
    TEAL_DARK, TEAL_MID, TEAL, TEAL_LIGHT,
    cardSx, sectionTitleSx, inputSx, LEVELS,
    makeSection, normalizeSections, buildSectionsPayload, buildInitialContent,
} from '../components/CourseEditorHelpers';
import { ProgressSidebar, SectionEditor, SideLabel } from '../components/CourseEditorParts';
import { getStatusLabel } from '../components/courseUtils';


// ─── Componente principal ─────────────────────────────────────────────────────
function TutorCourseEdit() {
    const navigate = useNavigate();
    const [coverFile, setCoverFile] = useState(null);       
    const [coverPreview, setCoverPreview] = useState(null); 
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', category: '', duration: '',
        level: 'beginner', objectives: '', preview_video: '', language: 'Español',
    });

    const [sections, setSections] = useState([
        {
            id: 1, name: 'Introducción', open: true,
            contents: [
                { id: 1, type: 'video', label: 'Bienvenida al curso' },
                { id: 2, type: 'pdf', label: 'Guía de instalación.pdf' },
            ],
        },
    ]);
    const [hasCover, setHasCover] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [status, setStatus] = useState('draft');

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const course = await getCourseDetail(id);
                setFormData({
                    title: course.title || "",
                    description: course.description || "",
                    category: course.category || "",
                    duration: course.duration || "",
                    level: course.level || "beginner",
                    objectives: course.objectives || "",
                    preview_video: course.preview_video || "",
                    language: course.language || "Español",
                });
                setStatus(course.status || 'draft'); 

                const loadedSections = normalizeSections(course.sections || []);
                if (loadedSections.length > 0) {
                    setSections(loadedSections);
                }

                setHasCover(!!course.cover_image);

                if (course.cover_image) {
                    setCoverPreview(course.cover_image);
                }

            } catch (error) {
                console.error(error);
                setError("No se pudo cargar el curso");
            }
        };

        loadCourse();
    }, [id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
            }
        };
        fetchCategories();
    }, []);




    const field = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));
    const update = (id, val) => setSections((p) => p.map((s) => s.id === id ? val : s));
    const remove = (id) => setSections((p) => p.filter((s) => s.id !== id));
    const add = () => setSections((p) => [...p, makeSection()]);

    const validate = () => {
        if (!formData.title.trim()) return 'El título es obligatorio.';
        if (!formData.description.trim()) return 'La descripción es obligatoria.';
        if (!formData.category) return 'La categoría es obligatoria.';
        if (!formData.duration || Number(formData.duration) <= 0) return 'La duración debe ser mayor a 0.';
        if (sections.length === 0) return 'El curso debe tener al menos una sección.';
        return '';
    };

    const parseBackendError = (error) => {
        let data = error.response?.data;

        // Si no hay respuesta de red
        if (!error.response) return 'Error de conexión con el servidor.';

        // Si la respuesta vino como string (ej. JSON serializado o HTML)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                // Si el servidor respondió con 500 HTML por exceder caracteres o falla de BD
                if (error.response.status === 500) {
                    return 'El texto ingresado excede el límite permitido de caracteres o contiene información inválida.';
                }
                return 'Ocurrió un error en el servidor al procesar la solicitud.';
            }
        }

        // Si Django REST Framework devolvió errores de validación de campos (Status 400)
        if (typeof data === 'object' && data !== null) {
            if (data.detail) return data.detail;
            if (data.message) return data.message;

            const firstKey = Object.keys(data)[0];
            const firstVal = data[firstKey];

            const fieldLabels = {
                title: 'Título',
                description: 'Descripción',
                category: 'Categoría',
                duration: 'Duración',
                level: 'Nivel',
                objectives: 'Objetivos',
            };

            const label = fieldLabels[firstKey] || firstKey;
            const message = Array.isArray(firstVal) ? firstVal[0] : firstVal;

            return `${label}: ${message}`;
        }

        return 'Ocurrió un error inesperado al guardar.';
    };

    const handleSubmit = async (mode = 'draft') => {
        const statusToSend = mode === 'review' ? 'pending' : mode;
        setError("");
        setSuccess("");

        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setLoading(true);

        try {
            const result = await updateTutorCourse(id, {
                title: formData.title,
                description: formData.description,
                category: Number(formData.category),
                duration: Number(formData.duration),
                initial_content: buildInitialContent(sections),
                level: formData.level,
                objectives: formData.objectives,
                preview_video: formData.preview_video,
                language: formData.language,
                sections_meta: buildSectionsPayload(sections),
                status: statusToSend,
            });

            if (coverFile) {
                const coverResult = await uploadCourseCover(id, coverFile);
                setCoverPreview(coverResult.cover_url || coverPreview);
            }

            if (result.course?.sections?.length > 0) {
                setSections(normalizeSections(result.course.sections));
            } else if (result.sections?.length > 0) {
            
                setSections(normalizeSections(result.sections));
            }

            setSuccess(
                mode === 'draft'
                    ? 'Curso guardado como borrador.'
                    : 'Curso enviado a revisión correctamente.'
            );

            navigate('/tutor/courses');

        } catch (e) {
            console.error(e);
            setError(parseBackendError(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CssBaseline />
            {/*
        
      */}
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: TEAL_LIGHT,
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                overflowX: 'hidden',
            }}>

                {/* ── Banner superior — ── */}
                <Box sx={{
                    background: `linear-gradient(145deg, ${TEAL_DARK} 0%, ${TEAL_MID} 55%, ${TEAL} 100%)`,
                    pt: { xs: 5, md: 7 },
                    pb: { xs: 4, md: 6 },
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                }}>
                    {/* círculos decorativos */}
                    <Box sx={{
                        position: 'absolute', top: -60, right: -60, width: 300, height: 300,
                        borderRadius: '50%', background: 'rgba(15,118,110,0.18)', pointerEvents: 'none'
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: -40, left: -40, width: 200, height: 200,
                        borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
                    }} />

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/tutor/courses')}
                            sx={{
                                color: 'rgba(255,255,255,0.65)', textTransform: 'none', mb: 2, px: 0,
                                '&:hover': { color: '#fff', background: 'transparent' }
                            }}
                        >
                            Mis cursos
                        </Button>

                        
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1.5,
                            flexWrap: 'wrap',
                            mb: 0.75
                        }}>
                            <Typography variant="h5"
                                sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', fontSize: { xs: '1.35rem', md: '1.6rem' } }}>
                                Editar curso
                            </Typography>
                            <Chip label={getStatusLabel(status)} size="small"
                                sx={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: 11, border: '1px solid #fcd34d' }} />
                        </Box>

                        
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, textAlign: 'center' }}>
                            Completa la información y organiza las secciones de tu curso.
                        </Typography>
                    </Container>
                </Box>

                {/* ── Contenido principal ── */}
                <Container maxWidth="lg" sx={{ pt: 3.5, pb: 10 }}>

                    {/* Alertas */}
                    {error && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            onClose={() => setError('')}
                            sx={{
                            mb: 3,
                            borderRadius: '10px',
                            backgroundColor: 'rgba(239, 68, 68, 0.06)', // Fondo rosado suave
                            color: '#991b1b',                             // Texto rojo sobrio
                            borderColor: 'rgba(239, 68, 68, 0.25)',     // Borde muy tenue
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            py: 0.5,                                      // Altura más compacta
                            alignItems: 'center',
                            '& .MuiAlert-icon': {
                                color: '#dc2626',                           // Ícono rojizo en sintonía
                                fontSize: '1.25rem',
                            },
                            '& .MuiAlert-action': {
                                pt: 0,                                      // Alineación limpia del botón cerrar
                            }
                            }}
                        >
                            {error}
                        </Alert>
                        )}
                    {success && (
                        <Box sx={{
                            background: TEAL_MID, borderRadius: 3, px: 2, py: 1.5, mb: 2.5,
                            color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1
                        }}>
                            <CheckCircleIcon sx={{ color: '#5eead4', fontSize: 20 }} />
                            {success}
                        </Box>
                    )}

                    <Grid container spacing={2.5} alignItems="flex-start">

                        {/* ── Columna principal ── */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2.5}>

                                {/* Información básica */}
                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
                                        <Typography sx={sectionTitleSx}>
                                            Información básica
                                        </Typography>

                                        <TextField 
                                            fullWidth 
                                            label="Título del curso *" 
                                            size="small"
                                            value={formData.title} 
                                            onChange={field('title')}
                                            placeholder="Ej. Introducción a Python para principiantes"
                                            inputProps={{ maxLength: 200 }} // 👈 Limita el ingreso a 200 caracteres
                                            sx={{ mb: 2, ...inputSx }} 
                                        />

                                        <TextField fullWidth label="Descripción corta *" size="small" multiline rows={3}
                                            value={formData.description} onChange={field('description')}
                                            placeholder="Resume de qué trata el curso en 2-3 oraciones..."
                                            sx={{ mb: 2, ...inputSx }} />

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
                                                            <MenuItem key={l.value} value={l.value}>
                                                                {l.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <TextField fullWidth label="Objetivos de aprendizaje" size="small" multiline rows={3}
                                            value={formData.objectives} onChange={field('objectives')}
                                            placeholder="¿Qué sabrá hacer el estudiante al terminar? Un objetivo por línea."
                                            helperText="Ej: Crear una API REST con Django · Consumir datos con Fetch"
                                            sx={inputSx} />
                                    </CardContent>
                                </Card>

                                {/* Secciones */}
                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            flexWrap: 'wrap', gap: 1, mb: 2
                                        }}>
                                            <Typography sx={sectionTitleSx}>
                                                Secciones del curso
                                            </Typography>
                                            <Button size="small" startIcon={<AddIcon />} onClick={add} variant="outlined"
                                                sx={{
                                                    textTransform: 'none', borderColor: TEAL, color: TEAL,
                                                    borderStyle: 'dashed', borderRadius: 2, fontWeight: 600, fontSize: 12,
                                                    '&:hover': { background: TEAL_LIGHT, borderColor: TEAL }
                                                }}>
                                                Nueva sección
                                            </Button>
                                        </Box>

                                        {sections.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>
                                                <Typography sx={{ fontSize: 14 }}>
                                                    Aún no tienes secciones. Agrega la primera para empezar.
                                                </Typography>
                                            </Box>
                                        )}

                                        {sections.map((s, i) => (
                                            <SectionEditor key={s.id} section={s} index={i}
                                                onChange={(v) => update(s.id, v)}
                                                onRemove={() => remove(s.id)} 
                                                showEvaluation={false}/>
                                        ))}
                                    </CardContent>
                                </Card>

                            </Stack>
                        </Grid>

                        {/* ── Sidebar ── */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>

                                <ProgressSidebar formData={formData} hasCover={hasCover} />

                                {/* Portada */}
                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#64748b', mb: 1.5 }}>
                                            Portada del curso
                                        </Typography>

                                        <input
                                            type="file" accept="image/jpeg, image/png, image/webp"
                                            id="cover-upload-input" style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];

                                                if (file) {
                                                    setCoverFile(file);
                                                    setCoverPreview(URL.createObjectURL(file));
                                                    setHasCover(true);
                                                }
                                            }}
                                        />

                                        {coverPreview ? (
                                            <>
                                                <Box sx={{
                                                    height: 140, borderRadius: 2, overflow: 'hidden', mb: 1,
                                                    backgroundImage: `url(${coverPreview})`,
                                                    backgroundSize: 'cover', backgroundPosition: 'center'
                                                }} />
                                                <label htmlFor="cover-upload-input">
                                                    <Button fullWidth size="small" component="span"
                                                        sx={{ color: '#0f766e', textTransform: 'none', fontSize: 12 }}>
                                                        Cambiar portada
                                                    </Button>
                                                </label>
                                            </>
                                        ) : (
                                            <label htmlFor="cover-upload-input">
                                                <Box sx={{
                                                    border: '2px dashed #cbd5e1', borderRadius: 2, py: 3.5,
                                                    textAlign: 'center', cursor: 'pointer', color: '#94a3b8',
                                                    transition: 'all .15s',
                                                    '&:hover': { borderColor: '#0f766e', color: '#0f766e', background: '#f0fdfa' }
                                                }}>
                                                    <UploadIcon sx={{ fontSize: 26, display: 'block', mx: 'auto', mb: 0.5 }} />
                                                    <Typography sx={{ fontSize: 13 }}>Clic para subir imagen</Typography>
                                                    <Typography sx={{ fontSize: 11, mt: 0.25 }}>JPG · PNG · 1280×720 px</Typography>
                                                </Box>
                                            </label>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Opciones extras */}
                                <Card sx={cardSx}>
                                    <CardContent sx={{ p: 2.5 }}>
                                        <SideLabel text="Opciones" />
                                        <TextField fullWidth size="small" label="Video de presentación (URL)"
                                            value={formData.preview_video} onChange={field('preview_video')}
                                            placeholder="YouTube · Vimeo · MP4" sx={{ mb: 1.5, ...inputSx }} />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Idioma del curso</InputLabel>
                                            <Select value={formData.language} label="Idioma del curso"
                                                onChange={field('language')} sx={inputSx}>
                                                {['Español', 'Inglés', 'Portugués'].map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>

                                {/* Acciones */}
                                {/* 💡 Mensaje recordatorio encuadrado perfectamente */}
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary', 
                                        textAlign: 'center', 
                                        fontStyle: 'italic',
                                        fontWeight: 500,
                                        px: 1, 
                                        lineHeight: 1.4,
                                        display: 'block',
                                        whiteSpace: 'normal', // 👈 Fuerza el salto de línea si el texto es largo
                                        width: '100%'
                                    }}
                                >
                                    Guarda el borrador antes de enviar el curso a revisión.
                                </Typography>
                                <Button fullWidth variant="contained" size="large"
                                    startIcon={loading ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : <SaveIcon />}
                                    onClick={() => handleSubmit('draft')} disabled={loading}
                                    sx={{
                                        py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: 14,
                                        backgroundColor: TEAL, color: '#fff',
                                        boxShadow: '0 4px 14px rgba(15,118,110,0.3)',
                                        '&:hover': { backgroundColor: TEAL_MID, boxShadow: '0 6px 18px rgba(15,118,110,0.38)' },
                                        '&.Mui-disabled': { background: '#e2e8f0', boxShadow: 'none' }
                                    }}>
                                    Guardar borrador
                                </Button>

                                <Button fullWidth variant="outlined" size="large"
                                    startIcon={<SendIcon />}
                                    onClick={() => handleSubmit('review')} disabled={loading}
                                    sx={{
                                        py: 1.4, borderRadius: 3, fontWeight: 600, textTransform: 'none', fontSize: 13,
                                        borderColor: TEAL, color: TEAL,
                                        '&:hover': { background: TEAL_LIGHT, borderColor: TEAL_MID }
                                    }}>
                                    Enviar a revisión
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default TutorCourseEdit;

