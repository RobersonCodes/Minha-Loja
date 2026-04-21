import { getProductsWithParams } from "../services/product.service.js";
import { createProductCard } from "../components/product-card.js";

import { setElementText, showElement, hideElement } from "../utils/dom.js";
import { debounce } from "../utils/utils.js";

import { initCartBadge } from "../components/cart-header.js";
import { initFavoritesBadge } from "../components/favorites-header.js";

import { toggleFavorite } from "../utils/favorites.js";
import { addToCart } from "../utils/cart.js";
import { showToast } from "../utils/toast.js";

/* ELEMENTOS */

const productsGrid = document.getElementById("productsGrid");

const searchInput = document.getElementById("searchInput");
const headerSearchInput = document.getElementById("headerSearchInput");

const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const priceFilter = document.getElementById("priceFilter");

const clearFiltersButton = document.getElementById("clearFiltersButton");
const headerSearchForm = document.getElementById("headerSearchForm");

/* STATE */

let allProducts = [];
let filteredProducts = [];

/* =========================
UTILS
========================= */

function normalizeText(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function getURLParams() {
    return new URLSearchParams(window.location.search);
}

function updateURLParams() {
    const params = new URLSearchParams();

    const searchValue = (searchInput?.value || headerSearchInput?.value || "").trim();
    const categoryValue = categoryFilter?.value || "";
    const sortValue = sortFilter?.value || "";
    const priceValue = priceFilter?.value || "";

    if (searchValue) params.set("search", searchValue);
    if (categoryValue) params.set("category", categoryValue);
    if (sortValue) params.set("sort", sortValue);
    if (priceValue) params.set("price", priceValue);

    const newURL = params.toString()
        ? `${window.location.pathname}?${params}`
        : window.location.pathname;

    window.history.replaceState({}, "", newURL);
}

function syncSearchInputs(value = "") {
    if (searchInput) searchInput.value = value;
    if (headerSearchInput) headerSearchInput.value = value;
}

function getUniqueCategories(products) {
    return [
        ...new Set(
            products
                .map(p => String(p.category || "").trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function populateCategoryFilter(products) {
    if (!categoryFilter) return;

    const categories = getUniqueCategories(products);

    categoryFilter.innerHTML = `
        <option value="">Todas categorias</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;
}

/* =========================
FILTROS
========================= */

function sortProducts(products, sortValue) {

    const sorted = [...products];

    switch (sortValue) {

        case "price-asc":
            sorted.sort((a, b) => Number(a.price) - Number(b.price));
            break;

        case "price-desc":
            sorted.sort((a, b) => Number(b.price) - Number(a.price));
            break;

        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "name-desc":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;

    }

    return sorted;

}

function filterByPrice(products, priceValue) {

    if (!priceValue) return products;

    return products.filter(product => {

        const price = Number(product.price || 0);

        switch (priceValue) {

            case "0-100":
                return price <= 100;

            case "100-300":
                return price >= 100 && price <= 300;

            case "300-1000":
                return price >= 300 && price <= 1000;

            case "1000-plus":
                return price >= 1000;

            default:
                return true;

        }

    });

}

function filterProducts(products) {

    const searchValue = normalizeText(searchInput?.value || headerSearchInput?.value || "");
    const categoryValue = normalizeText(categoryFilter?.value || "");
    const sortValue = sortFilter?.value || "";
    const priceValue = priceFilter?.value || "";

    let result = [...products];

    if (searchValue) {

        result = result.filter(product => {

            const name = normalizeText(product.name);
            const category = normalizeText(product.category);
            const description = normalizeText(product.description);

            return (
                name.includes(searchValue) ||
                category.includes(searchValue) ||
                description.includes(searchValue)
            );

        });

    }

    if (categoryValue) {

        result = result.filter(product =>
            normalizeText(product.category).includes(categoryValue)
        );

    }

    result = filterByPrice(result, priceValue);
    result = sortProducts(result, sortValue);

    return result;

}

/* =========================
FAVORITOS
========================= */

function bindFavoriteButtons(scope = document) {

    const buttons = scope.querySelectorAll("[data-favorite-toggle]");

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
                description: button.dataset.productDescription

            };

            toggleFavorite(product);

            initFavoritesBadge();

            renderProducts(filteredProducts);

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
                title: "Produto adicionado",
                message: product.name

            });

        });

    });

}

/* =========================
RENDER
========================= */

function renderEmptyState() {

    productsGrid.innerHTML = `

        <div class="empty-state">

            <h3>Nenhum produto encontrado</h3>

            <p>Tente ajustar sua busca ou filtros.</p>

        </div>

    `;

}

function renderProducts(products) {

    filteredProducts = products;

    setElementText("#productsCount", `${products.length} produto(s)`);
    setElementText("#topProductsCount", `${products.length} produto(s)`);

    if (!products.length) {

        renderEmptyState();
        return;

    }

    productsGrid.innerHTML = products
        .map(product => createProductCard(product, { basePath: "." }))
        .join("");

    bindFavoriteButtons(productsGrid);
    bindCartButtons(productsGrid);

}

/* =========================
LOAD
========================= */

async function loadProducts() {

    try {

        showElement("#productsLoading");

        const response = await getProductsWithParams();

        allProducts = response.data || [];

        populateCategoryFilter(allProducts);

        applyFilters();

    }

    catch (error) {

        console.error(error);

        showElement("#productsError");

    }

    finally {

        hideElement("#productsLoading");

    }

}

/* =========================
APPLY
========================= */

function applyFilters() {

    updateURLParams();

    const result = filterProducts(allProducts);

    renderProducts(result);

}

const applyFiltersDebounced = debounce(applyFilters, 250);

/* =========================
RESET
========================= */

function resetFilters() {

    syncSearchInputs("");

    if (categoryFilter) categoryFilter.value = "";
    if (sortFilter) sortFilter.value = "";
    if (priceFilter) priceFilter.value = "";

    applyFilters();

}

/* =========================
EVENTOS
========================= */

searchInput?.addEventListener("input", applyFiltersDebounced);
headerSearchInput?.addEventListener("input", applyFiltersDebounced);

categoryFilter?.addEventListener("change", applyFilters);
sortFilter?.addEventListener("change", applyFilters);
priceFilter?.addEventListener("change", applyFilters);

clearFiltersButton?.addEventListener("click", resetFilters);

headerSearchForm?.addEventListener("submit", e => {

    e.preventDefault();

    syncSearchInputs(headerSearchInput?.value);

    applyFilters();

});

window.addEventListener("favorites:updated", () => {

    renderProducts(filterProducts(allProducts));

});

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    initCartBadge();
    initFavoritesBadge();

    loadProducts();

});