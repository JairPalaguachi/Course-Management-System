import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, Divider, FormControl, FormControlLabel, Grid,
    IconButton, InputLabel, LinearProgress, MenuItem, Select,
    Stack, Switch, TextField, Tooltip, Typography, CssBaseline,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QuizIcon from '@mui/icons-material/Quiz';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import UploadIcon from '@mui/icons-material/Upload';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

import FileUploader from '../components/FileUploader';
import { createTutorCourse, getCategories, uploadCourseCover } from '../services/courseService';

import { useEffect } from 'react';

const TEAL_DARK = '#0a2e2b';
const TEAL_MID = '#10423f';
const TEAL = '#0f766e';
const TEAL_LIGHT = '#f0faf8';


const cardSx = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    boxShadow: 'none',
};

const sectionTitleSx = {
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    mb: 2,
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        '&.Mui-focused fieldset': { borderColor: TEAL },
    },
    '& label.Mui-focused': { color: TEAL },
};


const LEVELS = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
];

const CONTENT_TYPES = [
    { type: 'video', label: 'Video', icon: <VideoLibraryIcon sx={{ fontSize: 15 }} />, color: '#7c3aed', bg: '#ede9fe' },
    { type: 'pdf', label: 'PDF', icon: <PictureAsPdfIcon sx={{ fontSize: 15 }} />, color: '#b45309', bg: '#fffbeb' },
    { type: 'image', label: 'Imagen', icon: <ImageIcon sx={{ fontSize: 15 }} />, color: '#0891b2', bg: '#e0f2fe' },
    { type: 'text', label: 'Texto', icon: <TextSnippetIcon sx={{ fontSize: 15 }} />, color: '#475569', bg: '#f1f5f9' },
    { type: 'quiz', label: 'Evaluación', icon: <QuizIcon sx={{ fontSize: 15 }} />, color: '#059669', bg: '#d1fae5' },
];

const CONTENT_ICON = { video: <VideoLibraryIcon />, pdf: <PictureAsPdfIcon />, image: <ImageIcon />, text: <TextSnippetIcon />, quiz: <QuizIcon /> };
const CONTENT_COLOR = { video: '#7c3aed', pdf: '#b45309', image: '#0891b2', text: '#475569', quiz: '#059669' };

let _sectionId = 2;
let _contentId = 10;

function makeSection() {
    const id = _sectionId++;
    return {
        id,
        name: `Sección ${id - 1}`,
        open: true,
        contents: [],
        hasEval: false,
        eval: { name: '', maxScore: 100, minScore: 60, attempts: '1', instructions: '' },
    };
}

function makeContent(type) {
    const labels = { video: 'Clase grabada', pdf: 'Documento.pdf', image: 'Recurso visual', text: 'Contenido de texto', quiz: 'Quiz de sección' };
    return { id: _contentId++, type, label: labels[type] };
}


function SideLabel({ text }) {
    return (
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.6px', textTransform: 'uppercase', mb: 1.5 }}>
            {text}
        </Typography>
    );
}


function ProgressSidebar({ formData, hasCover }) {
    const checks = {
        title: { done: formData.title.trim().length > 0, label: 'Título añadido' },
        desc: { done: formData.description.trim().length > 0, label: 'Descripción' },
        category: { done: formData.category !== '', label: 'Categoría' },
        duration: { done: Number(formData.duration) > 0, label: 'Duración' },
        cover: { done: hasCover, label: 'Portada del curso' },
    };
    const filled = Object.values(checks).filter((c) => c.done).length;
    const pct = Math.round((filled / Object.keys(checks).length) * 100);

    return (
        <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
                <SideLabel text="Progreso del curso" />
                <LinearProgress
                    variant="determinate" value={pct}
                    sx={{
                        height: 6, borderRadius: 10, backgroundColor: '#e2e8f0', mb: 0.75,
                        '& .MuiLinearProgress-bar': { backgroundColor: TEAL }
                    }}
                />
                <Typography sx={{ fontSize: 11.5, color: '#64748b', textAlign: 'right', mb: 1.5 }}>
                    {pct}% completado
                </Typography>
                <Stack spacing={0.75}>
                    {Object.values(checks).map((c) => (
                        <Box key={c.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {c.done
                                ? <CheckCircleIcon sx={{ fontSize: 15, color: TEAL }} />
                                : <RadioButtonUncheckedIcon sx={{ fontSize: 15, color: '#cbd5e1' }} />}
                            <Typography sx={{ fontSize: 13, color: c.done ? TEAL_MID : '#94a3b8' }}>
                                {c.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}



function SectionEditor({ section, index, onChange, onRemove }) {
    const field = (key) => (e) => onChange({ ...section, [key]: e.target.value });
    const evalField = (key) => (e) => onChange({ ...section, eval: { ...section.eval, [key]: e.target.value } });
    const toggle = () => onChange({ ...section, open: !section.open });
    const addItem = (type) => onChange({ ...section, contents: [...section.contents, makeContent(type)] });
    const removeItem = (id) => onChange({ ...section, contents: section.contents.filter((c) => c.id !== id) });
    const renameItem = (id, val) => onChange({ ...section, contents: section.contents.map((c) => c.id === id ? { ...c, label: val } : c) });

    return (
        <Box sx={{ border: '1.5px solid #e2e8f0', borderRadius: 3, mb: 1.5, overflow: 'hidden' }}>

            {/* cabecera de sección */}
            <Box onClick={toggle}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.5,
                    background: '#f8fafc', cursor: 'pointer', userSelect: 'none'
                }}>
                <DragIndicatorIcon sx={{ color: '#cbd5e1', fontSize: 20, flexShrink: 0 }} />
                <Box sx={{
                    width: 24, height: 24, borderRadius: '6px', background: TEAL, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{index + 1}</Typography>
                </Box>
                <Typography sx={{
                    flex: 1, fontSize: 14, fontWeight: 600, color: TEAL_DARK,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                    {section.name || `Sección ${index + 1}`}
                </Typography>
                <Tooltip title="Eliminar sección">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#e11d48' } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
                {section.open
                    ? <ExpandLessIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    : <ExpandMoreIcon sx={{ color: '#94a3b8', fontSize: 20 }} />}
            </Box>

            {/* cuerpo de sección */}
            {section.open && (
                <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderTop: '1px solid #e2e8f0' }}>

                    <TextField fullWidth size="small" label="Nombre de la sección"
                        value={section.name} onChange={field('name')} sx={{ mb: 2, ...inputSx }} />

                    {/* chips de tipo de contenido */}
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                        Agregar contenido
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                        {CONTENT_TYPES.map(({ type, label, icon, color, bg }) => (
                            <Chip key={type} label={label} icon={icon} size="small" onClick={() => addItem(type)}
                                sx={{
                                    cursor: 'pointer', background: bg, color, border: `1.5px solid ${color}50`,
                                    fontWeight: 600, fontSize: 11.5, '& .MuiChip-icon': { color }
                                }} />
                        ))}
                    </Box>

                    {/* lista de contenidos actualizada con FileUploader */}
                    {section.contents.length > 0 && (
                        <Stack spacing={0.5} sx={{ mb: 2 }}>
                            {section.contents.map((c) => (
                                <Box key={c.id}
                                    sx={{
                                        background: '#f8fafc', border: '1px solid #e2e8f0',
                                        borderRadius: 2, px: 1.5, py: 1
                                    }}>
                                    {/* Fila de nombre + eliminar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ color: CONTENT_COLOR[c.type], display: 'flex', flexShrink: 0 }}>
                                            {CONTENT_ICON[c.type]}
                                        </Box>
                                        <TextField
                                            size="small" value={c.label} variant="standard"
                                            onChange={(e) => renameItem(c.id, e.target.value)}
                                            sx={{
                                                flex: 1,
                                                '& .MuiInput-underline:before': { borderColor: 'transparent' },
                                                '& .MuiInput-underline:hover:before': { borderColor: '#e2e8f0' }
                                            }}
                                            inputProps={{ style: { fontSize: 13 } }}
                                        />
                                        <IconButton size="small" onClick={() => removeItem(c.id)}
                                            sx={{ color: '#cbd5e1', '&:hover': { color: '#e11d48' } }}>
                                            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </Box>

                                    {/* Uploader solo para tipos con archivo */}
                                    {['video', 'pdf', 'image'].includes(c.type) && (
                                        <FileUploader
                                            contentId={c.savedId ?? null}   // null hasta que el curso se guarde
                                            contentType={c.type}
                                            label={c.label}
                                            onUploaded={({ file_url }) =>
                                                onChange({
                                                    ...section,
                                                    contents: section.contents.map((x) =>
                                                        x.id === c.id ? { ...x, file_url } : x
                                                    ),
                                                })
                                            }
                                        />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    )}

                    <Divider sx={{ mb: 2 }} />

                    {/* toggle evaluación */}
                    <FormControlLabel
                        control={
                            <Switch checked={section.hasEval} size="small"
                                onChange={(e) => onChange({ ...section, hasEval: e.target.checked })}
                                sx={{
                                    '& .Mui-checked .MuiSwitch-thumb': { background: TEAL },
                                    '& .Mui-checked + .MuiSwitch-track': { background: `${TEAL} !important` }
                                }} />
                        }
                        label={<Typography sx={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Incluir evaluación calificada</Typography>}
                    />

                    {section.hasEval && (
                        <Box sx={{
                            mt: 1.5, p: { xs: 1.5, sm: 2 }, background: TEAL_LIGHT,
                            borderRadius: 2, border: `1px solid #b2ddd8`
                        }}>
                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth size="small" label="Nombre de la evaluación"
                                        value={section.eval.name} onChange={evalField('name')} sx={inputSx} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField fullWidth size="small" label="Puntaje máx." type="number"
                                        value={section.eval.maxScore} onChange={evalField('maxScore')} sx={inputSx} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField fullWidth size="small" label="Mínimo aprobatorio" type="number"
                                        value={section.eval.minScore} onChange={evalField('minScore')} sx={inputSx} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Intentos</InputLabel>
                                        <Select value={section.eval.attempts} label="Intentos"
                                            onChange={evalField('attempts')} sx={inputSx}>
                                            {['1', '2', '3', 'Ilimitados'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField fullWidth size="small" label="Instrucciones para el estudiante"
                                        value={section.eval.instructions} onChange={evalField('instructions')}
                                        multiline rows={2} sx={inputSx} />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}


// ─── Componente principal ─────────────────────────────────────────────────────
function TutorCourseCreate() {
    const navigate = useNavigate();     
    const [coverPreview, setCoverPreview] = useState(null); 
    const [coverFile, setCoverFile] = useState(null); //  ¡Correcto!

    const [categories, setCategories] = useState([]);

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

    const savedDraft = (() => {
        if (typeof sessionStorage === 'undefined') return null;
        const stored = sessionStorage.getItem('courseDraft');
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    })();

    const [formData, setFormData] = useState(savedDraft?.formData ?? {
        title: '', description: '', category: '', duration: '',
        level: 'beginner', objectives: '', preview_video: '', language: 'Español',
    });

    const [sections, setSections] = useState(savedDraft?.sections ?? [
        {
            id: 1, name: 'Introducción', open: true,
            contents: [
                { id: 1, type: 'video', label: 'Bienvenida al curso' },
                { id: 2, type: 'pdf', label: 'Guía de instalación.pdf' },
            ],
            hasEval: false,
            eval: { name: '', maxScore: 100, minScore: 60, attempts: '1', instructions: '' },
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [savedCourseId, setSavedCourseId] = useState(savedDraft?.savedCourseId ?? null);
    const [shouldSaveDraft, setShouldSaveDraft] = useState(true);


    // 2. Guardar automáticamente cada vez que haya un cambio
    useEffect(() => {
        if (!shouldSaveDraft) return;
        if (formData.title !== '' || sections.length > 0) {
            sessionStorage.setItem('courseDraft', JSON.stringify({
                formData,
                sections,
                savedCourseId
            }));
        }
    }, [formData, sections, savedCourseId, shouldSaveDraft]);

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

    const buildInitialContent = () =>
        sections.map((s, i) => {
            const items = s.contents.map((c) => `  - [${c.type.toUpperCase()}] ${c.label}`).join('\n');
            const evalStr = s.hasEval ? `\n  [EVALUACIÓN] ${s.eval.name || 'Sin nombre'} · máx ${s.eval.maxScore} pts` : '';
            return `Sección ${i + 1}: ${s.name}\n${items}${evalStr}`;
        }).join('\n\n');

    const handleSubmit = async (mode = 'draft') => {
        setError('');
        setSuccess('');
        const err = validate();
        if (err) { setError(err); return; }
        setLoading(true);

        try {
            // 1. Enviamos la petición al backend
            const payload = {
                title: formData.title,
                description: formData.description,
                category: Number(formData.category),
                duration: Number(formData.duration),
                initial_content: buildInitialContent(),
                level: formData.level,
                objectives: formData.objectives,
                preview_video: formData.preview_video,
                language: formData.language,
                sections_meta: sections.map((s) => ({
                    name: s.name,
                    contents: s.contents.map((c) => ({
                        type: c.type,
                        label: c.label,
                    })),
                    evaluation: s.hasEval ? s.eval : null,
                })),
            };

            const result = await createTutorCourse(payload);

            setSavedCourseId(result.course.id);
            // 📸 👇 ¡AQUÍ COLOCAMOS LA SUBIDA DE PORTADA! 👇
            // Si el usuario seleccionó una imagen de portada local y la API nos devolvió el ID del curso...
            if (coverFile && result.course?.id) {
                await uploadCourseCover(result.course.id, coverFile);
            }

            // 2. Mapeo inteligente sin perder el estado de los archivos (file_url)
            const savedSections = result.course?.sections ?? [];

            setSections((prevSections) =>
                prevSections.map((localSec) => {
                    // Buscamos la sección en la DB que coincida por nombre
                    const dbSec = savedSections.find(
                        (ds) => ds.name.trim().toLowerCase() === localSec.name.trim().toLowerCase()
                    );

                    return {
                        ...localSec,
                        id: dbSec?.id ?? localSec.id,
                        contents: localSec.contents.map((localContent) => {
                            // Buscamos el contenido que coincida en tipo y label
                            const dbContent = dbSec?.contents?.find(
                                (dc) => dc.type === localContent.type && dc.label === localContent.label
                            );

                            return {
                                ...localContent, // 👈 Conserva file_url y propiedades visuales locales
                                savedId: dbContent?.id ?? localContent.savedId ?? null,
                                file_url: dbContent?.file_url ?? localContent.file_url ?? null
                            };
                        }),
                    };
                })
            );

            // 3. Mostramos mensaje de éxito correspondiente
            setSuccess(
                mode === 'draft'
                    ? 'Borrador guardado. Ya puedes subir los archivos en las secciones.'
                    : 'Curso enviado a revisión exitosamente.'
            );

            // 4. Limpiar el draft del sessionStorage y desactivar auto-save
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('courseDraft');
            }
            setShouldSaveDraft(false);

            // 5. Redirección condicional (Solo si no es borrador)
            if (mode !== 'draft') {
                setTimeout(() => navigate('/tutor/courses'), 1500);
            }

        } catch (e) {
            console.error("Error al guardar el curso:", e);
            if (e.response?.status === 401) setError('Debes iniciar sesión para crear un curso.');
            else if (e.response?.status === 403) setError('Solo los tutores pueden crear cursos.');
            else if (e.response?.data) setError(JSON.stringify(e.response.data));
            else setError('Ocurrió un error al guardar el curso. Inténtalo nuevamente.');
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
                                Crear nuevo curso
                            </Typography>
                            <Chip label="Borrador" size="small"
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
                        <Box sx={{
                            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 3,
                            px: 2, py: 1.5, mb: 2.5, color: '#b91c1c', fontSize: 14
                        }}>
                            {error}
                        </Box>
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

                                        <TextField fullWidth label="Título del curso *" size="small"
                                            value={formData.title} onChange={field('title')}
                                            placeholder="Ej. Introducción a Python para principiantes"
                                            sx={{ mb: 2, ...inputSx }} />

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
                                                onRemove={() => remove(s.id)} />
                                        ))}
                                    </CardContent>
                                </Card>

                            </Stack>
                        </Grid>

                        {/* ── Sidebar ── */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>

                                <ProgressSidebar formData={formData} hasCover={!!coverPreview} />

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
                                                    setCoverPreview(URL.createObjectURL(file));
                                                    setCoverFile(file);
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

export default TutorCourseCreate;