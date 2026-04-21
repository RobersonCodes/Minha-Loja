import { getCartItemsCount } from "../utils/cart.js";

export function updateCartCount() {
    const count = getCartItemsCount();
    const badges = document.querySelectorAll("[data-cart-count]");

    badges.forEach(badge => {
        badge.textContent = String(count);
    });
}

export function initCartCount() {
    updateCartCount();

    window.addEventListener("cart:updated", () => {
        updateCartCount();
    });

    window.addEventListener("storage", () => {
        updateCartCount();
    });
}