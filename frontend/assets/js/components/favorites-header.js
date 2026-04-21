import { getFavoritesCount } from "../utils/favorites.js";

export function updateFavoritesBadges() {
    const count = getFavoritesCount();
    const badgeElements = document.querySelectorAll("[data-favorites-count]");

    badgeElements.forEach(element => {
        element.textContent = String(count);
    });
}

export function initFavoritesBadge() {
    updateFavoritesBadges();

    window.addEventListener("favorites:updated", updateFavoritesBadges);
}