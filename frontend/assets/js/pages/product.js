import { getProductById, getProducts } from "../services/product.service.js";
import { addToCart } from "../utils/cart.js";
import { toggleFavorite, isFavorite } from "../utils/favorites.js";
import { formatPrice } from "../utils/format.js";

import { initCartBadge } from "../components/cart-header.js";
import { initFavoritesBadge } from "../components/favorites-header.js";
import { createProductCard } from "../components/product-card.js";

import { showElement, hideElement } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";

/* elementos */

const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productName");
const categoryEl = document.getElementById("productCategory");

const priceEl = document.getElementById("productPrice");
const oldPriceEl = document.getElementById("productOldPrice");
const discountBadgeEl = document.getElementById("productDiscountBadge");

const descriptionEl = document.getElementById("productDescription");

const ratingStarsEl = document.getElementById("productRatingStars");
const ratingValueEl = document.getElementById("productRating");
const reviewsEl = document.getElementById("productReviews");
const stockEl = document.getElementById("productStock");

const breadcrumbCurrentEl = document.getElementById("breadcrumbCurrent");

const addToCartButton = document.getElementById("addToCartButton");
const favoriteButton = document.getElementById("favoriteButton");

const recommendedContainer = document.getElementById("recommendedProducts");
const thumbsContainer = document.getElementById("productThumbs");

const FALLBACK_IMAGE = "https://via.placeholder.com/800x800?text=Minha+Loja";

let currentProduct = null;

/* util */

function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function renderStars(value = 0) {
    const rounded = Math.round(Number(value || 0));
    const safeRounded = Math.max(0, Math.min(5, rounded));

    return "★".repeat(safeRounded) + "☆".repeat(5 - safeRounded);
}

function generateSales() {
    return Math.floor(Math.random() * 400) + 20;
}

function calculateDiscount(oldPrice, price) {
    const oldPriceNumber = Number(oldPrice || 0);
    const priceNumber = Number(price || 0);

    if (!oldPriceNumber || !priceNumber || oldPriceNumber <= priceNumber) {
        return null;
    }

    const discount = Math.round(
        ((oldPriceNumber - priceNumber) / oldPriceNumber) * 100
    );

    return discount > 0 ? discount : null;
}

/* galeria */

function buildGalleryImages(product) {
    const image = product?.image || FALLBACK_IMAGE;
    return [image, image, image, image];
}

function renderThumbs(images = []) {
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = images
        .map((image, index) => `
            <button
                class="product-gallery__thumb ${index === 0 ? "is-active" : ""}"
                type="button"
                data-thumb-image="${image}"
                aria-label="Ver imagem ${index + 1}"
            >
                <img
                    src="${image}"
                    alt="Miniatura ${index + 1}"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >
            </button>
        `)
        .join("");

    const buttons = thumbsContainer.querySelectorAll("[data-thumb-image]");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const image = button.getAttribute("data-thumb-image");

            if (imageEl) {
                imageEl.src = image || FALLBACK_IMAGE;
            }

            buttons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
        });
    });
}

/* favorito */

function updateFavoriteButton() {
    if (!favoriteButton || !currentProduct) return;

    const active = isFavorite(currentProduct.id);

    favoriteButton.textContent = active
        ? "Remover dos favoritos ♥"
        : "Salvar nos favoritos ♡";
}

/* feedback botão */

function showSuccess(button, text) {
    if (!button) return;

    const original = button.textContent;

    button.textContent = text;
    button.disabled = true;
    button.style.transform = "scale(.96)";
    button.style.opacity = ".85";

    setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
        button.style.transform = "";
        button.style.opacity = "";
    }, 1400);
}

/* render produto */

function renderProduct(product) {
    currentProduct = product;

    const image = product?.image || FALLBACK_IMAGE;
    const rating = Number(product?.rating || 4.5);
    const reviewsCount = Number(product?.reviews_count || generateSales());
    const stock = Number(product?.stock || 0);

    if (imageEl) {
        imageEl.src = image;
        imageEl.onerror = () => {
            imageEl.src = FALLBACK_IMAGE;
        };
    }

    if (titleEl) {
        titleEl.textContent = product?.name || "Produto";
    }

    if (categoryEl) {
        categoryEl.textContent = product?.category || "Sem categoria";
    }

    if (descriptionEl) {
        descriptionEl.textContent =
            product?.description || "Produto premium disponível no catálogo.";
    }

    if (priceEl) {
        priceEl.textContent = formatPrice(product?.price);
    }

    if (oldPriceEl && discountBadgeEl) {
        const hasOldPrice = Number(product?.old_price || 0) > 0;

        if (hasOldPrice) {
            oldPriceEl.textContent = formatPrice(product.old_price);
            oldPriceEl.classList.remove("hidden");

            const discount = calculateDiscount(product.old_price, product.price);

            if (discount) {
                discountBadgeEl.textContent = `${discount}% OFF`;
                discountBadgeEl.classList.remove("hidden");
            } else {
                discountBadgeEl.classList.add("hidden");
            }
        } else {
            oldPriceEl.classList.add("hidden");
            discountBadgeEl.classList.add("hidden");
        }
    }

    if (ratingStarsEl) {
        ratingStarsEl.textContent = renderStars(rating);
    }

    if (ratingValueEl) {
        ratingValueEl.textContent = rating.toFixed(1);
    }

    if (reviewsEl) {
        reviewsEl.textContent = `(${reviewsCount} avaliações)`;
    }

    if (stockEl) {
        if (stock <= 0) {
            stockEl.textContent = "Indisponível";
            stockEl.style.color = "#b91c1c";
        } else if (stock <= 5) {
            stockEl.textContent = "Últimas unidades";
            stockEl.style.color = "#d97706";
        } else {
            stockEl.textContent = "Em estoque";
            stockEl.style.color = "#007600";
        }
    }

    if (breadcrumbCurrentEl) {
        breadcrumbCurrentEl.textContent = product?.name || "Produto";
    }

    renderThumbs(buildGalleryImages(product));
    updateFavoriteButton();
}

/* eventos */

function bindActions() {
    if (addToCartButton) {
        addToCartButton.addEventListener("click", () => {
            if (!currentProduct) return;

            addToCart({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                image: currentProduct.image,
                category: currentProduct.category,
                description: currentProduct.description,
                quantity: 1
            });

            initCartBadge();

            showSuccess(addToCartButton, "Adicionado ✓");

            showToast({
                type: "success",
                title: "Produto adicionado",
                message: currentProduct.name
            });
        });
    }

    if (favoriteButton) {
        favoriteButton.addEventListener("click", () => {
            if (!currentProduct) return;

            toggleFavorite({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                image: currentProduct.image,
                category: currentProduct.category,
                description: currentProduct.description
            });

            updateFavoriteButton();
            initFavoritesBadge();

            showSuccess(favoriteButton, "Atualizado ♥");

            const active = isFavorite(currentProduct.id);

            showToast({
                type: "info",
                title: active
                    ? "Adicionado aos favoritos"
                    : "Removido dos favoritos",
                message: currentProduct.name
            });
        });
    }
}

/* recomendados */

async function loadRecommended() {
    if (!currentProduct || !recommendedContainer) return;

    try {
        recommendedContainer.innerHTML = `
            <div class="loading-state" style="display:block; grid-column:1 / -1;">
                <div class="loading-state__spinner"></div>
                <p>Carregando recomendados...</p>
            </div>
        `;

        const response = await getProducts({
            limit: 12,
            category: currentProduct.category
        });

        const products = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
                ? response
                : [];

        const filtered = products
            .filter((product) => String(product.id) !== String(currentProduct.id))
            .slice(0, 4);

        if (!filtered.length) {
            recommendedContainer.innerHTML = `
                <div class="empty-state" style="display:block;">
                    <h3>Nenhum recomendado encontrado</h3>
                    <p>Adicione mais produtos nesta categoria para enriquecer a vitrine.</p>
                </div>
            `;
            return;
        }

        recommendedContainer.innerHTML = filtered
            .map((product) => createProductCard(product, { basePath: "./" }))
            .join("");
    } catch (error) {
        console.error("Erro ao carregar recomendados:", error);

        recommendedContainer.innerHTML = `
            <div class="error-box" style="display:block;">
                <strong>Erro ao carregar recomendados.</strong>
                <p>Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

/* carregar */

async function loadProduct() {
    try {
        hideElement("#productError");
        hideElement("#productEmpty");
        hideElement("#productContent");
        showElement("#productLoading");

        const id = getProductId();

        if (!id) {
            throw new Error("Produto não informado.");
        }

        const product = await getProductById(id);

        if (!product || !product.id) {
            hideElement("#productLoading");
            showElement("#productEmpty");
            return;
        }

        renderProduct(product);
        bindActions();

        hideElement("#productLoading");
        showElement("#productContent", "grid");

        await loadRecommended();
    } catch (error) {
        console.error(error);

        hideElement("#productLoading");
        hideElement("#productContent");

        showToast({
            type: "error",
            title: "Erro ao carregar",
            message: "Produto não encontrado"
        });

        showElement("#productError");
    }
}

/* iniciar */

document.addEventListener("DOMContentLoaded", () => {
    initCartBadge();
    initFavoritesBadge();
    loadProduct();
});