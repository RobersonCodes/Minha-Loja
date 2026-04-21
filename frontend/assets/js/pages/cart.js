import { formatPrice } from "../utils/format.js";
import {
    getCart,
    clearCart,
    removeFromCart,
    increaseCartItem,
    decreaseCartItem,
    getCartSubtotal
} from "../utils/cart.js";
import { initCartCount } from "../components/cart-count.js";
import { setElementText } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";

const cartItemsContainer = document.getElementById("cartItems");
const emptyCartState = document.getElementById("emptyCartState");
const cartSummary = document.getElementById("cartSummary");
const cartItemsCount = document.getElementById("cartItemsCount");

const FALLBACK_IMAGE = "https://via.placeholder.com/300x300?text=Minha+Loja";

function getCartItemsTotalCount(cart = []) {
    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );
}

/* resumo */

function renderCartSummary() {

    const subtotal =
        getCartSubtotal();

    const shipping =
        subtotal > 0
            ? 0
            : 0;

    const total =
        subtotal + shipping;

    setElementText(
        "#cartSubtotal",
        formatPrice(subtotal)
    );

    setElementText(
        "#cartShipping",
        shipping === 0
            ? "Grátis"
            : formatPrice(shipping)
    );

    setElementText(
        "#cartTotal",
        formatPrice(total)
    );

}

/* contador */

function renderCartItemsCount(cart = []) {

    const totalItems =
        getCartItemsTotalCount(cart);

    if (cartItemsCount) {

        cartItemsCount.textContent =
            `${totalItems} item(s)`;

    }

}

/* carrinho vazio */

function renderEmptyCart() {

    if (cartItemsContainer) {

        cartItemsContainer.innerHTML = "";

    }

    if (emptyCartState) {

        emptyCartState.style.display = "block";

    }

    if (cartSummary) {

        cartSummary.style.display = "block";

    }

    renderCartItemsCount([]);
    renderCartSummary();

}

/* render */

function renderCartItems() {

    const cart = getCart();

    if (!cart.length) {

        renderEmptyCart();

        return;

    }

    if (emptyCartState) {

        emptyCartState.style.display = "none";

    }

    if (cartSummary) {

        cartSummary.style.display = "block";

    }

    renderCartItemsCount(cart);

    if (cartItemsContainer) {

        cartItemsContainer.innerHTML = cart
            .map(item => {

                const subtotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                return `
                    <article class="cart-item interactive-lift">

                        <div class="cart-item__image-wrapper">

                            <img
                                class="cart-item__image"
                                src="${item.image || FALLBACK_IMAGE}"
                                alt="${item.name || "Produto"}"
                                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                            >

                        </div>

                        <div class="cart-item__content">

                            <span class="cart-item__category">
                                ${item.category || "Sem categoria"}
                            </span>

                            <h3 class="cart-item__title">
                                ${item.name || "Produto sem nome"}
                            </h3>

                            <p class="cart-item__price">
                                ${formatPrice(item.price)}
                            </p>

                            <div class="cart-item__controls">

                                <button
                                    class="qty-btn"
                                    type="button"
                                    data-action="decrease"
                                    data-id="${item.id}"
                                >
                                    −
                                </button>

                                <span class="qty-value">
                                    ${item.quantity}
                                </span>

                                <button
                                    class="qty-btn"
                                    type="button"
                                    data-action="increase"
                                    data-id="${item.id}"
                                >
                                    +
                                </button>

                            </div>

                            <div class="cart-item__footer">

                                <span class="cart-item__subtotal">

                                    Subtotal:

                                    ${formatPrice(subtotal)}

                                </span>

                                <button
                                    class="remove-btn"
                                    type="button"
                                    data-action="remove"
                                    data-id="${item.id}"
                                >

                                    Remover

                                </button>

                            </div>

                        </div>

                    </article>
                `;

            })
            .join("");

    }

    bindCartActions();
    renderCartSummary();
    initCartCount();

}

/* ações */

function bindCartActions() {

    const actionButtons =
        document.querySelectorAll("[data-action]");

    actionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                const productId =
                    button.dataset.id;

                if (action === "increase") {

                    increaseCartItem(productId);

                    showToast({

                        type: "info",

                        title: "Quantidade atualizada",

                        message: "Item adicionado."

                    });

                }

                if (action === "decrease") {

                    decreaseCartItem(productId);

                    showToast({

                        type: "info",

                        title: "Quantidade atualizada",

                        message: "Item removido."

                    });

                }

                if (action === "remove") {

                    removeFromCart(productId);

                    showToast({

                        type: "info",

                        title: "Item removido",

                        message: "Produto removido do carrinho."

                    });

                }

                renderCartItems();

            }

        );

    });

}

/* ações globais */

function bindGlobalActions() {

    document
        .getElementById("clearCartButton")
        ?.addEventListener(

            "click",

            () => {

                const cart =
                    getCart();

                if (!cart.length) {

                    showToast({

                        type: "info",

                        title: "Carrinho vazio",

                        message: "Não há itens para remover."

                    });

                    return;

                }

                clearCart();

                renderCartItems();

                showToast({

                    type: "info",

                    title: "Carrinho limpo",

                    message: "Todos os itens foram removidos."

                });

            }

        );

    document
        .getElementById("checkoutButton")
        ?.addEventListener(

            "click",

            (event) => {

                const cart =
                    getCart();

                if (!cart.length) {

                    event.preventDefault();

                    showToast({

                        type: "error",

                        title: "Carrinho vazio",

                        message: "Adicione produtos antes de continuar."

                    });

                }

            }

        );

}

/* init */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initCartCount();

        bindGlobalActions();

        renderCartItems();

    }

);