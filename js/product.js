import { fetchProductById } from "./utils/api.js";
import { addToCart } from "./utils/storage.js";
import { isLoggedIn } from "./utils/authStorage.js";

const productLayout = document.querySelector("#product-layout");
const loadingMessage = document.querySelector("#product-loading");
const errorMessage = document.querySelector("#product-error");

init();

async function init() {
  try {
    const productId = getProductIdFromUrl();

    if (!productId) {
      throw new Error("No product ID found in URL");
    }

    const product = await fetchProductById(productId);

    renderProduct(product);
  } catch (error) {
    console.error(error);
    showError();
  } finally {
    hideLoading();
  }
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderProduct(product) {
  if (!productLayout) {
    return;
  }

  const imageUrl = product.image?.url || "../images/placeholder.jpg";
  const imageAlt = product.image?.alt || product.title;

  const priceHtml = getPriceHtml(product);
  const ratingHtml = getRatingHtml(product.rating);
  const reviewsAmount = product.reviews ? product.reviews.length : 0;
  const tagsHtml = getTagsHtml(product.tags);

  const addToCartHtml = isLoggedIn()
    ? `
        <button type="button" class="btn add-cart-button" id="add-to-cart-button">Add to cart</button>
        `
    : `
        <p class="login-required-message">
            Please <a href="/account/login.html">login</a> to add this product to your cart.
        </p>
        
        `;

  productLayout.innerHTML = `
        <article class="product-content">
            <div class="product-image-wrapper">
                <img src="${imageUrl}" alt="${imageAlt}">
            </div>

            <div class="product-info">
                <div class="product-title-row">
                    <h1>${product.title}</h1>
                    <button type="button" class="share-button" id="share-button" aria-label="Share product">Share</button>
                </div>
                <div class="product-tags">${tagsHtml}</div>

                <div class="product-price">${priceHtml}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-rating" aria-label="Product rating">${ratingHtml}</div>
                <p class="product-reviews">Reviews (${reviewsAmount})</p>
                ${addToCartHtml}
            </div>
        </article>
    `;

  setupShareButton(product.id);
  if (isLoggedIn()) {
    setupAddToCartButton(product);
  }
}

function getPriceHtml(product) {
  if (product.discountedPrice && product.discountedPrice < product.price) {
    return `
            <p class="current-price">${product.discountedPrice} €</p>
            <p class="original-price">${product.price} €</p>
        `;
  }

  return `<p class="current-price">${product.price} €</p>`;
}

function getRatingHtml(rating) {
  const roundedRating = Math.round(rating || 0);
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    stars += i <= roundedRating ? "&starf;" : "&star;";
  }

  return `<span aria-hidden="true">${stars}</span>`;
}

function getTagsHtml(tags) {
  if (!tags || tags.length === 0) {
    return "";
  }

  let html = "";
  for (let i = 0; i < tags.length; i++) {
    html += `<span>${tags[i]}</span>`;
  }

  return html;
}

function setupShareButton(productId) {
  const shareButton = document.querySelector("#share-button");

  if (!shareButton) {
    return;
  }

  shareButton.addEventListener("click", async function () {
    const shareUrl = `${window.location.origin}/product/index.html?id=${productId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      shareButton.textContent = "Copied!";
    } catch (error) {
      console.error("Could not copy URL:", error);
      shareButton.textContent = "Copy failed";
    }

    setTimeout(function () {
      shareButton.textContent = "Share";
    }, 2000);
  });
}

function setupAddToCartButton(product) {
  const addToCartButton = document.querySelector("#add-to-cart-button");

  if (!addToCartButton) {
    return;
  }

  addToCartButton.addEventListener("click", function () {
    addToCart(product);

    addToCartButton.textContent = "Added!";

    setTimeout(function () {
      addToCartButton.textContent = "Add to cart";
    }, 1500);
  });
}

function hideLoading() {
  if (loadingMessage) {
    loadingMessage.hidden = true;
  }
}

function showError() {
  if (errorMessage) {
    errorMessage.hidden = false;
  }
}
