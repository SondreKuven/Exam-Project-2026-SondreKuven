import { getCart, clearCart } from "./utils/storage.js";

const checkoutForm = document.querySelector("#checkout-form");
const checkoutItemsContainer = document.querySelector("#checkout-items");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutShipping = document.querySelector("#checkout-shipping");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutError = document.querySelector("#checkout-error");
const paymentRadios = document.querySelectorAll("input[name='paymentMethod']");
const cardFields = document.querySelector("#card-fields");
const vippsFields = document.querySelector("#vipps-fields");
const klarnaFields = document.querySelector("#klarna-fields");

const SHIPPING_PRICE = 10;

init();

function init() {
  renderCheckout();
  setupPaymentFields();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
}

function renderCheckout() {
  const cart = getCart();

  if (!checkoutItemsContainer) {
    return;
  }

  checkoutItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = `
            <p class="empty-checkout-message">Your cart is empty.</p>
        `;

    updateTotals(0);
    return;
  }

  for (let i = 0; i < cart.length; i++) {
    checkoutItemsContainer.innerHTML += createCheckoutItemHTML(cart[i]);
  }

  updateTotals(calculateSubtotal(cart));
}

function createCheckoutItemHTML(item) {
  const imageUrl = item.image?.url || "../images/placeholder.jpg";
  const imageAlt = item.image?.alt || item.title;

  return `
        <article class="checkout-item">
            <img src="${imageUrl}" alt="${imageAlt}">

            <div class="checkout-item-info">
                <h2>${item.title}</h2>
                <p>Price: <strong>${formatPrice(item.price)}</strong></p>
            </div>

            <p class="checkout-item-quantity">Qty: <span>${
              item.quantity
            }</span></p>
        </article>
    `;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const cart = getCart();

  if (cart.length === 0) {
    showCheckoutError("Your cart is empty.");
    return;
  }

  if (!checkoutForm.checkValidity()) {
    showCheckoutError("Please fill out the required fields.");
    checkoutForm.reportValidity();
    return;
  }

  clearCart();

  window.location.href = "/success/index.html";
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

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent = formatPrice(subtotal);
  }

  if (checkoutShipping) {
    checkoutShipping.textContent = formatPrice(shipping);
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(total);
  }
}

function showCheckoutError(message) {
  if (!checkoutError) {
    return;
  }

  checkoutError.textContent = message;
  checkoutError.hidden = false;
}

function setupPaymentFields() {
  if (!paymentRadios.length || !cardFields || !vippsFields || !klarnaFields) {
    return;
  }

  for (let i = 0; i < paymentRadios.length; i++) {
    paymentRadios[i].addEventListener("change", handlePaymentChange);
  }

  handlePaymentChange();
}

function handlePaymentChange() {
  const selectedPayment = document.querySelector(
    "input[name='paymentMethod']:checked"
  )?.value;

  cardFields.hidden = true;
  vippsFields.hidden = true;
  klarnaFields.hidden = true;

  setRequiredFields(cardFields, false);
  setRequiredFields(vippsFields, false);
  setRequiredFields(klarnaFields, false);

  if (selectedPayment === "card") {
    cardFields.hidden = false;
    setRequiredFields(cardFields, true);
  }

  if (selectedPayment === "vipps") {
    vippsFields.hidden = false;
    setRequiredFields(vippsFields, true);
  }

  if (selectedPayment === "klarna") {
    klarnaFields.hidden = false;
  }
}

function setRequiredFields(container, isRequired) {
  const inputs = container.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].required = isRequired;
  }
}

function formatPrice(price) {
  return `${price.toFixed(2)} €`;
}
