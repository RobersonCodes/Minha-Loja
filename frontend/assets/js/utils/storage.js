const STORAGE_KEYS = {
    TOKEN: "minhaloja_token",
    USER: "minhaloja_user"
};

export function saveToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

export function removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem("role");
}

export function isAuthenticated() {
    return !!getToken();
}