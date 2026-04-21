const CART_STORAGE_KEY = "minhaloja_cart";

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart:updated"));
}

export function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);

    if (!cart) return [];

    try {
        const parsedCart = JSON.parse(cart);
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
        return [];
    }
}

export function isCartEmpty() {
    return getCart().length === 0;
}

export function clearCart() {
    saveCart([]);
}

export function getCartItemsCount() {
    return getCart().reduce((total, item) => {
        return total + Number(item.quantity || 0);
    }, 0);
}

export function getCartSubtotal() {
    return getCart().reduce((total, item) => {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        return total + (price * quantity);
    }, 0);
}

export function getCartTotal() {
    return getCartSubtotal();
}

export function addToCart(product) {
    const cart = getCart();
    const productId = String(product.id);

    const existingIndex = cart.findIndex(item => String(item.id) === productId);

    if (existingIndex >= 0) {
        cart[existingIndex].quantity = Number(cart[existingIndex].quantity || 0) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name || "Produto sem nome",
            price: Number(product.price || 0),
            image: product.image || "",
            category: product.category || "Sem categoria",
            description: product.description || "",
            quantity: 1
        });
    }

    saveCart(cart);
}

export function removeFromCart(productId) {
    const normalizedId = String(productId);
    const updatedCart = getCart().filter(item => String(item.id) !== normalizedId);
    saveCart(updatedCart);
}

export function increaseCartItem(productId) {
    const normalizedId = String(productId);
    const cart = getCart();

    const updatedCart = cart.map(item => {
        if (String(item.id) === normalizedId) {
            return {
                ...item,
                quantity: Number(item.quantity || 0) + 1
            };
        }

        return item;
    });

    saveCart(updatedCart);
}

export function decreaseCartItem(productId) {
    const normalizedId = String(productId);
    const cart = getCart();

    const updatedCart = cart
        .map(item => {
            if (String(item.id) === normalizedId) {
                return {
                    ...item,
                    quantity: Number(item.quantity || 0) - 1
                };
            }

            return item;
        })
        .filter(item => Number(item.quantity || 0) > 0);

    saveCart(updatedCart);
}