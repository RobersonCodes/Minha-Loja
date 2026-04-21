export function formatPrice(value) {
    const numericValue = Number(value || 0);

    return numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function capitalize(text = "") {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function safeText(value, fallback = "") {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

export function truncateText(text, maxLength = 120) {
    const safe = safeText(text);

    if (safe.length <= maxLength) {
        return safe;
    }

    return `${safe.slice(0, maxLength)}...`;
}