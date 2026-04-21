/* ================================
UTILS - FUNÇÕES REUTILIZÁVEIS
================================ */

/* formatar preço */
export function formatPrice(value) {

    const number = Number(value || 0);

    return number.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


/* evitar texto undefined ou null */
export function safeText(value, fallback = "") {

    if (value === null || value === undefined) {

        return fallback;

    }

    return String(value);

}


/* limitar tamanho de texto */
export function truncateText(text, maxLength = 120) {

    const safe = safeText(text);

    if (safe.length <= maxLength) {

        return safe;

    }

    return safe.slice(0, maxLength) + "...";

}


/* gerar id aleatório */
export function generateId() {

    return Math.random().toString(36).substring(2, 10);

}


/* debounce (evitar muitas chamadas seguidas) */
export function debounce(fn, delay = 400) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => fn(...args), delay);

    };

}


/* converter para número seguro */
export function toNumber(value) {

    const n = Number(value);

    return isNaN(n) ? 0 : n;

}


/* esperar tempo */
export function sleep(ms = 500) {

    return new Promise(resolve => setTimeout(resolve, ms));

}