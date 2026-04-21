const FAVORITES_STORAGE_KEY = "minhaloja_favorites";

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event("favorites:updated"));
}

export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!favorites) return [];

    try {
        const parsed = JSON.parse(favorites);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function isFavorite(productId) {
    const favorites = getFavorites();

    return favorites.some(item => String(item.id) === String(productId));
}

export function toggleFavorite(product) {
    const favorites = getFavorites();
    const productId = String(product.id);

    const exists = favorites.some(item => String(item.id) === productId);

    if (exists) {
        const updated = favorites.filter(item => String(item.id) !== productId);
        saveFavorites(updated);
        return false;
    }

    favorites.push({
        id: product.id,
        name: product.name || "Produto sem nome",
        price: Number(product.price || 0),
        image: product.image || "",
        category: product.category || "Sem categoria",
        description: product.description || ""
    });

    saveFavorites(favorites);
    return true;
}

export function removeFromFavorites(productId) {
    const favorites = getFavorites();
    const updated = favorites.filter(item => String(item.id) !== String(productId));
    saveFavorites(updated);
}

export function clearFavorites() {
    saveFavorites([]);
}

export function getFavoritesCount() {
    return getFavorites().length;
}