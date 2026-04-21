import { formatPrice } from "../utils/format.js";
import { safeText } from "../utils/utils.js";
import { isFavorite } from "../utils/favorites.js";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=Minha+Loja";

function getDefaultBasePath() {
    const currentPath = window.location.pathname.toLowerCase();

    if (currentPath.includes("/pages/")) {
        return ".";
    }

    return "./pages";
}

function resolveProductLink(product, basePath) {
    const productId = product?.id ?? "";
    const resolvedBasePath = basePath || getDefaultBasePath();

    return `${resolvedBasePath}/product.html?id=${productId}`;
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function calculateOldPrice(price) {
    const numericPrice = Number(price || 0);

    if (!numericPrice) return null;

    return numericPrice * 1.18;
}

function calculateInstallment(price) {
    const numericPrice = Number(price || 0);

    if (!numericPrice) return null;

    return numericPrice / 10;
}

function getBadgeText(product) {
    const badge = safeText(product?.badge, "").trim();

    if (badge) {
        return badge;
    }

    const price = Number(product?.price || 0);
    const rating = Number(product?.rating || 0);
    const reviews = Number(product?.reviews_count || 0);
    const stock = Number(product?.stock || 0);
    const featured = Number(product?.featured || 0);

    if (featured === 1) {
        return "Mais vendido";
    }

    if (stock > 0 && stock <= 5) {
        return "Últimas unidades";
    }

    if (rating >= 4.8 && reviews >= 50) {
        return "Top avaliado";
    }

    if (price >= 1000) {
        return "Premium";
    }

    return "Oferta";
}

function renderStars(ratingValue = 0) {
    const rounded = Math.round(Number(ratingValue || 0));
    const safeRounded = Math.max(0, Math.min(5, rounded));

    return "★".repeat(safeRounded) + "☆".repeat(5 - safeRounded);
}

function getRatingValue(product) {
    const rating = Number(product?.rating || 0);

    if (rating > 0) {
        return rating;
    }

    return 4.5;
}

function getReviewsCount(product) {
    const reviews = Number(product?.reviews_count || 0);

    if (reviews > 0) {
        return reviews;
    }

    return Math.floor(Math.random() * 180) + 24;
}

function getStockMessage(stockValue = 0) {
    const stock = Number(stockValue || 0);

    if (stock <= 0) {
        return "Indisponível";
    }

    if (stock <= 5) {
        return "Últimas unidades";
    }

    if (stock <= 15) {
        return "Estoque limitado";
    }

    return "Disponível";
}

function getStockClass(stockValue = 0) {
    const stock = Number(stockValue || 0);

    if (stock <= 0) {
        return "product-card__stock product-card__stock--danger";
    }

    if (stock <= 5) {
        return "product-card__stock product-card__stock--warning";
    }

    return "product-card__stock product-card__stock--success";
}

export function createProductCard(product, options = {}) {
    const image = safeText(product?.image, "").trim() || FALLBACK_IMAGE;
    const name = safeText(product?.name, "Produto sem nome");
    const category = safeText(product?.category, "Sem categoria");
    const description = safeText(product?.description, "");
    const priceValue = Number(product?.price || 0);

    const price = formatPrice(priceValue);

    const oldPriceValue = product?.old_price
        ? Number(product.old_price)
        : calculateOldPrice(priceValue);

    const oldPrice = oldPriceValue ? formatPrice(oldPriceValue) : null;

    const installmentValue = calculateInstallment(priceValue);
    const installmentText = installmentValue
        ? `ou 10x de ${formatPrice(installmentValue)}`
        : "";

    const ratingValue = getRatingValue(product);
    const reviewsCount = getReviewsCount(product);

    const stockMessage = getStockMessage(product?.stock);
    const stockClass = getStockClass(product?.stock);

    const badgeText = getBadgeText(product);

    const productLink = resolveProductLink(product, options.basePath);

    const favoriteActive = isFavorite(product?.id);
    const favoriteActiveClass = favoriteActive ? "product-card__favorite--active" : "";

    const favoriteButtonLabel = favoriteActive
        ? "Remover dos favoritos"
        : "Adicionar aos favoritos";

    return `
        <article class="product-card">
            <span class="product-card__badge">
                ${escapeHtml(badgeText)}
            </span>

            <button
                class="product-card__favorite ${favoriteActiveClass}"
                type="button"
                data-favorite-toggle
                data-product-id="${product?.id ?? ""}"
                data-product-name="${escapeHtml(name)}"
                data-product-price="${priceValue}"
                data-product-image="${escapeHtml(image)}"
                data-product-category="${escapeHtml(category)}"
                data-product-description="${escapeHtml(description)}"
                aria-label="${escapeHtml(favoriteButtonLabel)}"
                title="${escapeHtml(favoriteButtonLabel)}"
            >
                ♥
            </button>

            <a class="product-card__image-link" href="${productLink}">
                <img
                    class="product-card__image"
                    src="${image}"
                    alt="${escapeHtml(name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >
            </a>

            <div class="product-card__content">
                <span class="product-card__category">
                    ${escapeHtml(category)}
                </span>

                <h3 class="product-card__title" title="${escapeHtml(name)}">
                    <a href="${productLink}">
                        ${escapeHtml(name)}
                    </a>
                </h3>

                <div class="product-card__rating" aria-label="Avaliação do produto">
                    <span class="product-card__stars">
                        ${renderStars(ratingValue)}
                    </span>

                    <span class="product-card__rating-value">
                        ${ratingValue.toFixed(1)}
                    </span>

                    <span class="product-card__reviews">
                        (${reviewsCount} avaliações)
                    </span>
                </div>

                <div class="product-card__pricing">
                    ${oldPrice ? `<span class="product-card__old-price">${oldPrice}</span>` : ""}
                    <p class="product-card__price">${price}</p>
                    ${installmentText ? `<span class="product-card__installments">${installmentText}</span>` : ""}
                </div>

                <div class="${stockClass}">
                    ${stockMessage}
                </div>

                <div class="product-card__actions">
                    <a class="btn btn--secondary" href="${productLink}">
                        Ver detalhes
                    </a>

                    <button
                        class="btn btn--primary"
                        type="button"
                        data-add-cart
                        data-product-id="${product?.id ?? ""}"
                        data-product-name="${escapeHtml(name)}"
                        data-product-price="${priceValue}"
                        data-product-image="${escapeHtml(image)}"
                        data-product-category="${escapeHtml(category)}"
                        data-product-description="${escapeHtml(description)}"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </article>
    `;
}