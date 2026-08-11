const LEVEL_LABELS = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
};

function formatDuration(minutes) {
    if (!minutes) {
        return "Duración flexible";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    }

    if (remainingMinutes === 0) {
        return `${hours} h`;
    }

    return `${hours} h ${remainingMinutes} min`;
}

function formatDate(value) {
    if (!value) {
        return "Reciente";
    }

    return new Intl.DateTimeFormat("es-EC", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getLevelLabel(level) {
    return LEVEL_LABELS[level] ?? level ?? "No especificado";
}

const STATUS_LABELS = {
    draft: "Borrador",
    pending: "Pendiente",
    published: "Publicado",
    rejected: "Rechazado",
};

const STATUS_COLORS = {
    draft: { bg: "#f1f5f9", color: "#475569" },
    pending: { bg: "#fef3c7", color: "#92400e" },
    published: { bg: "#d1fae5", color: "#065f46" },
    rejected: { bg: "#fee2e2", color: "#991b1b" },
};

function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status ?? "Sin estado";
}

function getStatusColor(status) {
    return STATUS_COLORS[status] ?? { bg: "#f1f5f9", color: "#475569" };
}

export { formatDate, formatDuration, getLevelLabel, getStatusLabel, getStatusColor };