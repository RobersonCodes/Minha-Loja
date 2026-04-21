/* =================================
MAIN JS - INICIALIZAÇÃO GLOBAL
================================= */

import { initCartBadge } from "./components/cart-header.js";
import { getCartItemsCount } from "./utils/cart.js";
import { getFavoritesCount } from "./utils/favorites.js";


function updateHeaderCounters() {

    const cartCount = document.querySelector("[data-cart-count]");

    const favoritesCount = document.querySelector("[data-favorites-count]");


    if (cartCount) {

        cartCount.textContent = getCartItemsCount();

    }


    if (favoritesCount) {

        favoritesCount.textContent = getFavoritesCount();

    }

}


/* escuta alterações no carrinho */
window.addEventListener("cart:updated", updateHeaderCounters);


/* escuta alterações nos favoritos */
window.addEventListener("favorites:updated", updateHeaderCounters);


/* inicialização geral */
document.addEventListener("DOMContentLoaded", () => {

    updateHeaderCounters();

    initCartBadge?.();

    console.log("Minha Loja carregada com sucesso");

});