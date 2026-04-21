import { getToken } from "./storage.js";

export function requireAuth() {
    const token = getToken();

    if (!token) {
        window.location.href = "admin.html";
    }
}

export function logout() {
    localStorage.removeItem("minhaloja_token");
    window.location.reload();
}