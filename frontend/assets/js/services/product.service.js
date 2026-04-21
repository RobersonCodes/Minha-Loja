import API_CONFIG from "../config/api.js";
import { getToken } from "../utils/storage.js";

function extractErrorMessage(data, fallbackMessage) {
    return data?.message || data?.error || fallbackMessage;
}

function buildAuthHeaders(includeJson = true) {
    const headers = {};

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    const token = getToken();

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

function buildQueryString(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
}

export async function createProduct(product) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
        method: "POST",
        headers: buildAuthHeaders(true),
        body: JSON.stringify(product)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(result, "Erro ao criar produto."));
    }

    return result;
}

export async function getProducts(params = {}) {
    const queryString = buildQueryString(params);

    const url = queryString
        ? `${API_CONFIG.BASE_URL}/products?${queryString}`
        : `${API_CONFIG.BASE_URL}/products`;

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(result, "Erro ao buscar produtos."));
    }

    return result;
}

export async function getProductsWithParams(customParams = {}) {
    const urlParams = new URLSearchParams(window.location.search);

    const mergedParams = {
        search: customParams.search ?? urlParams.get("search") ?? "",
        category: customParams.category ?? urlParams.get("category") ?? "",
        sort: customParams.sort ?? urlParams.get("sort") ?? "",
        price: customParams.price ?? urlParams.get("price") ?? "",
        page: customParams.page ?? urlParams.get("page") ?? 1,
        limit: customParams.limit ?? urlParams.get("limit") ?? 12
    };

    const queryString = buildQueryString(mergedParams);

    const url = queryString
        ? `${API_CONFIG.BASE_URL}/products?${queryString}`
        : `${API_CONFIG.BASE_URL}/products`;

    console.log("API URL:", url);

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(result, "Erro ao buscar produtos."));
    }

    return result;
}

export async function getProductById(id) {
    const productId = String(id || "").trim();

    if (!productId) {
        throw new Error("ID do produto não informado.");
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/products/${productId}`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(extractErrorMessage(result, "Erro ao buscar produto."));
    }

    if (result?.data) {
        return result.data;
    }

    return result;
}