import API_CONFIG from "../config/api.js";

function extractErrorMessage(data, fallbackMessage) {
    return data?.message || data?.error || fallbackMessage;
}

function normalizeOrdersResponse(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.orders)) return data.orders;
    return [];
}

export async function createOrder(orderPayload) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Erro ao criar pedido."));
    }

    return data;
}

export async function getOrders() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Erro ao carregar pedidos."));
    }

    return normalizeOrdersResponse(data);
}

export async function updateOrderStatus(orderId, status) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(data, "Erro ao atualizar status do pedido."));
    }

    return data;
}