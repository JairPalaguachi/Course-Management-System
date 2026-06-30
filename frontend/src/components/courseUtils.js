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

export { formatDate, formatDuration, getLevelLabel };