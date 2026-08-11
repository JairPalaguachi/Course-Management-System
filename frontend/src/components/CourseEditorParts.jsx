import {
    Box, Chip, Divider, FormControl, FormControlLabel, Grid,
    IconButton, InputLabel, LinearProgress, MenuItem, Select,
    Stack, Switch, TextField, Tooltip, Typography, Card, CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QuizIcon from '@mui/icons-material/Quiz';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

import FileUploader from './FileUploader';
import {
    CONTENT_TYPES, CONTENT_COLOR,
    TEAL_DARK, TEAL_MID, TEAL, TEAL_LIGHT,
    cardSx, inputSx,
    makeContent,
} from './CourseEditorHelpers';

const CONTENT_ICON = {
    video: <VideoLibraryIcon />, pdf: <PictureAsPdfIcon />, image: <ImageIcon />, text: <TextSnippetIcon />, quiz: <QuizIcon />,
};

export function SideLabel({ text }) {
    return (
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.6px', textTransform: 'uppercase', mb: 1.5 }}>
            {text}
        </Typography>
    );
}

export function ProgressSidebar({ formData, hasCover }) {
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
                    sx={{ height: 6, borderRadius: 10, backgroundColor: '#e2e8f0', mb: 0.75,
                          '& .MuiLinearProgress-bar': { backgroundColor: TEAL } }}
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

export function SectionEditor({ section, index, onChange, onRemove, uploadFn }) {
    const field = (key) => (e) => onChange({ ...section, [key]: e.target.value });
    const evalField = (key) => (e) => onChange({ ...section, eval: { ...section.eval, [key]: e.target.value } });
    const toggle = () => onChange({ ...section, open: !section.open });
    const addItem = (type) => onChange({ ...section, contents: [...section.contents, makeContent(type)] });
    const removeItem = (id) => onChange({ ...section, contents: section.contents.filter((c) => c.id !== id) });
    const renameItem = (id, val) => onChange({ ...section, contents: section.contents.map((c) => c.id === id ? { ...c, label: val } : c) });

    return (
        <Box sx={{ border: '1.5px solid #e2e8f0', borderRadius: 3, mb: 1.5, overflow: 'hidden' }}>
            <Box onClick={toggle}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.5,
                      background: '#f8fafc', cursor: 'pointer', userSelect: 'none' }}>
                <DragIndicatorIcon sx={{ color: '#cbd5e1', fontSize: 20, flexShrink: 0 }} />
                <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: TEAL, flexShrink: 0,
                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{index + 1}</Typography>
                </Box>
                <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEAL_DARK,
                                   overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

            {section.open && (
                <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderTop: '1px solid #e2e8f0' }}>
                    <TextField fullWidth size="small" label="Nombre de la sección"
                        value={section.name} onChange={field('name')} sx={{ mb: 2, ...inputSx }} />

                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                        Agregar contenido
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                        {CONTENT_TYPES.map(({ type, label, icon, color, bg }) => (
                            <Chip key={type} label={label} icon={icon} size="small" onClick={() => addItem(type)}
                                sx={{ cursor: 'pointer', background: bg, color, border: `1.5px solid ${color}50`,
                                      fontWeight: 600, fontSize: 11.5, '& .MuiChip-icon': { color } }} />
                        ))}
                    </Box>

                    {section.contents.length > 0 && (
                        <Stack spacing={0.5} sx={{ mb: 2 }}>
                            {section.contents.map((c) => (
                                <Box key={c.id}
                                    sx={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, px: 1.5, py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ color: CONTENT_COLOR[c.type], display: 'flex', flexShrink: 0 }}>
                                            {CONTENT_ICON[c.type]}
                                        </Box>
                                        <TextField
                                            size="small" value={c.label} variant="standard"
                                            onChange={(e) => renameItem(c.id, e.target.value)}
                                            sx={{ flex: 1,
                                                  '& .MuiInput-underline:before': { borderColor: 'transparent' },
                                                  '& .MuiInput-underline:hover:before': { borderColor: '#e2e8f0' } }}
                                            inputProps={{ style: { fontSize: 13 } }}
                                        />
                                        <IconButton size="small" onClick={() => removeItem(c.id)}
                                            sx={{ color: '#cbd5e1', '&:hover': { color: '#e11d48' } }}>
                                            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </Box>

                                    {['video', 'pdf', 'image'].includes(c.type) && (
                                        <Box sx={{ mt: 1 }}>
                                            {c.file_url ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                           background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 2, px: 1.5, py: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                                                        <CheckCircleIcon sx={{ fontSize: 16, color: TEAL, flexShrink: 0 }} />
                                                        <Typography noWrap
                                                            sx={{ fontSize: 12, color: TEAL, fontWeight: 600, textDecoration: 'none' }}>
                                                            {c.file_name || (typeof c.file_url === 'string' ? decodeURIComponent(c.file_url.split('/').pop().split('?')[0]) : 'Archivo cargado')}
                                                        </Typography>
                                                    </Box>
                                                    <IconButton size="small"
                                                        onClick={() => onChange({
                                                            ...section,
                                                            contents: section.contents.map((x) =>
                                                                x.id === c.id ? { ...x, file_url: null, file_name: null } : x
                                                            ),
                                                        })}
                                                        sx={{ color: '#cbd5e1', '&:hover': { color: '#e11d48' }, ml: 1, flexShrink: 0 }}>
                                                        <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <FileUploader
                                                    contentId={c.savedId}
                                                    contentType={c.type}
                                                    label={c.label}
                                                    uploadFn={uploadFn}
                                                    onUploaded={({ file_url, file_name }) =>
                                                        onChange({
                                                            ...section,
                                                            contents: section.contents.map((x) =>
                                                                x.id === c.id ? { ...x, file_url, file_name: file_name || null } : x
                                                            ),
                                                        })
                                                    }
                                                />
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    )}

                    <Divider sx={{ mb: 2 }} />

                    <FormControlLabel
                        control={
                            <Switch checked={section.hasEval} size="small"
                                onChange={(e) => onChange({ ...section, hasEval: e.target.checked })}
                                sx={{ '& .Mui-checked .MuiSwitch-thumb': { background: TEAL },
                                      '& .Mui-checked + .MuiSwitch-track': { background: `${TEAL} !important` } }} />
                        }
                        label={<Typography sx={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Incluir evaluación calificada</Typography>}
                    />

                    {section.hasEval && (
                        <Box sx={{ mt: 1.5, p: { xs: 1.5, sm: 2 }, background: TEAL_LIGHT, borderRadius: 2, border: `1px solid #b2ddd8` }}>
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