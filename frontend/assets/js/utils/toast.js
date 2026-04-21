function getToastContainer() {
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    return container;
}

function getToastIcon(type) {
    switch (type) {
        case "success":
            return "✓";
        case "error":
            return "!";
        case "info":
        default:
            return "i";
    }
}

export function showToast({
    type = "info",
    title = "Aviso",
    message = "",
    duration = 2600
} = {}) {
    const container = getToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;

    toast.innerHTML = `
        <span class="toast__icon">${getToastIcon(type)}</span>

        <div class="toast__content">
            <p class="toast__title">${title}</p>
            <p class="toast__message">${message}</p>
        </div>

        <button
            class="toast__close"
            type="button"
            aria-label="Fechar notificação"
        >
            ×
        </button>
    `;

    let removed = false;

    function removeToast() {
        if (removed) return;
        removed = true;

        toast.classList.add("toast--leaving");

        window.setTimeout(() => {
            toast.remove();
        }, 220);
    }

    const closeButton = toast.querySelector(".toast__close");
    closeButton?.addEventListener("click", removeToast);

    container.appendChild(toast);

    if (duration > 0) {
        window.setTimeout(removeToast, duration);
    }

    return {
        element: toast,
        close: removeToast
    };
}