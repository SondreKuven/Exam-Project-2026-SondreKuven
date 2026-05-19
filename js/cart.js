import { getCart, removeFromCart, updateCartQuantity, clearCart } from "./utils/storage.js";

const cartItemsContainer = document.querySelector("#cart-items");
const emptyCartMessage = document.querySelector("#empty-cart-message");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartShipping = document.querySelector("#cart-shipping");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart-button");

const SHIPPING_PRICE = 10;

init();

function init() {
    renderCart();
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", handleCartButtonClick);
    }

    if (clearCartButton) {
        clearCartButton.addEventListener("click", handleClearCart);
    }
}

function renderCart() {
    const cart = getCart();

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        showEmptyCart();
        updateTotals(0);
        return;
    }

    hideEmptyCart();

    for (let i = 0; i < cart.length; i++) {
        cartItemsContainer.innerHTML += createCartItemHTML(cart[i]);
    }

    updateTotals(calculateSubtotal(cart));
}

function createCartItemHTML(item) {
    const imageUrl = item.image?.url || "../images/placeholder.jpg";
    const imageAlt = item.image?.alt || item.title;
    const itemTotal = item.price * item.quantity;

    return `
        <article class="cart-item">
            <img src="${imageUrl}" alt="${imageAlt}" class="cart-item-image">

            <div class="cart-item-info">
                <h2>${item.title}</h2>
                <p>Price: <strong>${formatPrice(item.price)}</strong></p>
                <p>Item total: <strong>${formatPrice(itemTotal)}</strong></p>
            </div>

            <div class="cart-item-quantity">
                <span>Qty:</span>
                <button type="button" class="quantity-button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
                <span class="quantity-number">${item.quantity}</span>
                <button type="button" class="quantity-button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">&plus;</button>
            </div>

            <button type="button" class="remove-item-button" data-action="remove" data-id="${item.id}" aria-label="Remove item from cart">
                <img src="../icons/CloseButton.svg" alt="">
            </button>
        </article>          
    `;
}

function handleCartButtonClick(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const productId = button.dataset.id;
    const cart = getCart();

    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    if (action === "decrease") {
        updateCartQuantity(productId, item.quantity - 1);
    } 
    
    if (action === "increase") {
        updateCartQuantity(productId, item.quantity + 1);
    } 
    
    if (action === "remove") {
        removeFromCart(productId);
    }

    renderCart();
}

function handleClearCart() {
    clearCart();
    renderCart();
}

function calculateSubtotal(cart) {
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }

    return subtotal;
}

function updateTotals(subtotal) {
    const shipping = subtotal > 0 ? SHIPPING_PRICE : 0;
    const total = subtotal + shipping;

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    if (cartShipping) {
        cartShipping.textContent = formatPrice(shipping);
    }

    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }
}

function formatPrice(price) {
    return `${price.toFixed(2)} €`;
}

function showEmptyCart () {
    if (emptyCartMessage) {
        emptyCartMessage.hidden = false;
    }

    if (clearCartButton) {
        clearCartButton.hidden = true;
    }
}

function hideEmptyCart() {
    if (emptyCartMessage) {
        emptyCartMessage.hidden = true;
    }

    if (clearCartButton) {
        clearCartButton.hidden = false;
    }
}