export const TEAL_DARK = '#0a2e2b';
export const TEAL_MID = '#10423f';
export const TEAL = '#0f766e';
export const TEAL_LIGHT = '#f0faf8';

export const cardSx = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    boxShadow: 'none',
};

export const sectionTitleSx = {
    fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.6px',
    textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 0.8, mb: 2,
};

export const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px', backgroundColor: '#fff',
        '&.Mui-focused fieldset': { borderColor: TEAL },
    },
    '& label.Mui-focused': { color: TEAL },
};

export const LEVELS = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
];

export const CONTENT_TYPES = [
    { type: 'video', label: 'Video', icon: 'video', color: '#7c3aed', bg: '#ede9fe' },
    { type: 'pdf', label: 'PDF', icon: 'pdf', color: '#b45309', bg: '#fffbeb' },
    { type: 'image', label: 'Imagen', icon: 'image', color: '#0891b2', bg: '#e0f2fe' },
    { type: 'text', label: 'Texto', icon: 'text', color: '#475569', bg: '#f1f5f9' },
];

export const CONTENT_COLOR = {
    video: '#7c3aed',
    pdf: '#b45309',
    image: '#0891b2',
    text: '#475569',
};

let _contentId = 10;

export const makeSection = () => ({
    id: Date.now(),
    name: 'Sección nueva',
    open: true,
    contents: [],
    hasEval: false,
    eval: { name: '', maxScore: 100, minScore: 60, attempts: '1', instructions: '' },
});

export function makeContent(type) {
    const labels = {
        video: 'Clase grabada',
        pdf: 'Documento.pdf',
        image: 'Recurso visual',
        text: 'Contenido de texto',
    };
    return { id: _contentId++, type, label: labels[type] };
}

export function normalizeSections(courseSections = []) {
    return courseSections.map((section, index) => ({
        id: section.id ? `saved-section-${section.id}` : `section-${index}`,
        savedId: section.id ?? null,
        name: section.name || `Seccion ${index + 1}`,
        open: false,
        contents: (section.contents || []).map((content, contentIndex) => ({
            id: content.id ? `saved-content-${content.id}` : `content-${index}-${contentIndex}`,
            savedId: content.id ?? null,
            type: content.type,
            label: content.label || '',
            body: content.body || '',
            file_url: content.file_url || content.file || null,
        })),
        hasEval: Boolean(section.evaluation),
        eval: {
            name: section.evaluation?.name || '',
            maxScore: section.evaluation?.max_score ?? 100,
            minScore: section.evaluation?.min_score ?? 60,
            attempts: section.evaluation?.attempts || '1',
            instructions: section.evaluation?.instructions || '',
        },
    }));
}

export function buildSectionsPayload(sections) {
    return sections.map((section) => ({
        id: section.savedId || undefined,
        name: section.name,
        contents: section.contents.map((content) => ({
            id: content.savedId || undefined,
            type: content.type,
            label: content.label,
            body: content.body || '',
        })),
        evaluation: section.hasEval ? {
            name: section.eval.name,
            max_score: Number(section.eval.maxScore) || 100,
            min_score: Number(section.eval.minScore) || 0,
            attempts: section.eval.attempts || '1',
            instructions: section.eval.instructions || '',
        } : null,
    }));
}

export function buildInitialContent(sections) {
    return sections.map((section, index) => {
        const items = section.contents
            .map((content) => `  - [${content.type.toUpperCase()}] ${content.label}`)
            .join('\n');
        const evalText = section.hasEval
            ? `\n  [EVALUACION] ${section.eval.name || 'Sin nombre'} - max ${section.eval.maxScore} pts`
            : '';
        return `Seccion ${index + 1}: ${section.name}\n${items}${evalText}`;
    }).join('\n\n');
}
