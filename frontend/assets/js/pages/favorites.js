import { getFavorites, removeFromFavorites, clearFavorites } from "../utils/favorites.js";

import { createProductCard } from "../components/product-card.js";

import { initFavoritesBadge } from "../components/favorites-header.js";
import { initCartBadge } from "../components/cart-header.js";

import { addToCart } from "../utils/cart.js";
import { showToast } from "../utils/toast.js";

/* elementos */

const favoritesGrid = document.getElementById("favoritesGrid");
const favoritesEmptyState = document.getElementById("favoritesEmptyState");

const favoritesCount = document.getElementById("favoritesCount");
const clearFavoritesButton = document.getElementById("clearFavoritesButton");

/* =========================
FAVORITOS
========================= */

function bindFavoriteButtons(scope = document) {

    const buttons = scope.querySelectorAll("[data-favorite-toggle]");

    buttons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const productId = button.dataset.productId;

            removeFromFavorites(productId);

            renderFavorites();
            initFavoritesBadge();

            showToast({

                type: "info",
                title: "Removido dos favoritos",
                message: "Produto removido da sua lista."

            });

        });

    });

}

/* =========================
CARRINHO
========================= */

function bindCartButtons(scope = document) {

    const buttons = scope.querySelectorAll("[data-add-cart]");

    buttons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const product = {

                id: button.dataset.productId,
                name: button.dataset.productName,
                price: Number(button.dataset.productPrice),
                image: button.dataset.productImage,
                category: button.dataset.productCategory,
                description: button.dataset.productDescription,
                quantity: 1

            };

            addToCart(product);

            initCartBadge();

            showToast({

                type: "success",
                title: "Adicionado ao carrinho",
                message: product.name

            });

        });

    });

}

/* =========================
EMPTY STATE
========================= */

function renderEmptyState() {

    favoritesGrid.innerHTML = `

        <div class="empty-state">

            <h3>Você ainda não possui favoritos</h3>

            <p>Explore produtos e clique no coração para salvar.</p>

            <a class="btn btn--primary" href="../products.html">

                Explorar produtos

            </a>

        </div>

    `;

}

/* =========================
RENDER
========================= */

function renderFavorites() {

    const favorites = getFavorites();

    if (favoritesCount) {

        favoritesCount.textContent = `${favorites.length} favorito(s)`;

    }

    if (!favorites.length) {

        renderEmptyState();

        if (favoritesEmptyState) {

            favoritesEmptyState.style.display = "block";

        }

        return;

    }

    if (favoritesEmptyState) {

        favoritesEmptyState.style.display = "none";

    }

    favoritesGrid.innerHTML = favorites

        .map(product => createProductCard(product, { basePath: "." }))

        .join("");

    bindFavoriteButtons(favoritesGrid);

    bindCartButtons(favoritesGrid);

}

/* =========================
LIMPAR
========================= */

function bindClearFavorites() {

    clearFavoritesButton?.addEventListener("click", () => {

        const favorites = getFavorites();

        if (!favorites.length) {

            showToast({

                type: "info",
                title: "Lista vazia",
                message: "Você ainda não possui favoritos."

            });

            return;

        }

        clearFavorites();

        renderFavorites();

        initFavoritesBadge();

        showToast({

            type: "info",
            title: "Favoritos limpos",
            message: "Sua lista foi esvaziada."

        });

    });

}

/* =========================
INIT
========================= */

function initFavoritesPage() {

    initCartBadge();

    initFavoritesBadge();

    bindClearFavorites();

    window.addEventListener("favorites:updated", renderFavorites);

    renderFavorites();

}

document.addEventListener("DOMContentLoaded", initFavoritesPage);