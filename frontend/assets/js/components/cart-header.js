import { getCartItemsCount } from "../utils/cart.js";

export function updateCartBadges() {
    const count = getCartItemsCount();
    const badgeElements = document.querySelectorAll("[data-cart-count]");

    badgeElements.forEach(element => {
        element.textContent = String(count);
    });
}

export function initCartBadge() {
    updateCartBadges();

    window.addEventListener("cart:updated", updateCartBadges);
    window.addEventListener("storage", updateCartBadges);
}