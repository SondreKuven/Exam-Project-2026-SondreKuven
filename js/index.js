import { fetchAllProducts } from "./utils/api.js";

const productGrid = document.querySelector("#product-grid");
const loadingMessage = document.querySelector("#products-loading");
const errorMessage = document.querySelector("#products-error");
const carouselTrack = document.querySelector("#carousel-track");
const carouselPrev = document.querySelector("#carousel-prev");
const carouselNext = document.querySelector("#carousel-next");

let carouselProducts = [];
let currentSlideIndex = 0;

init();

async function init() {
  try {
    const products = await fetchAllProducts();

    carouselProducts = products.slice(0, 3);

    renderProducts(products.slice(0, 12));
    renderCarouselSlide(carouselProducts[currentSlideIndex]);
    setupCarouselButtons();
  } catch (error) {
    console.error(error);
    showError();
  } finally {
    hideLoading();
  }
}

function renderCarouselSlide(product) {
  if (!carouselTrack) {
    return;
  }

  const imageUrl = product.image?.url || "../images/placeholder.jpg";
  const imageAlt = product.image?.alt || product.title;

  const shortDescription =
    product.description.length > 120
      ? product.description.slice(0, 120) + "..."
      : product.description;

  carouselTrack.innerHTML = `
        <article class="carousel-slide">
            <div class="carousel-text">
                <p class="carousel-label">Featured Product</p>

                <h1>${product.title}</h1>

                <p class="carousel-description">${shortDescription}</p>

                <div class="carousel-actions">
                    <a href="/product/index.html?id=${product.id}" class="btn">
                        View Product
                    </a>
                    
                    <p class="carousel-price">
                        ${product.discountedPrice} €
                    </p>
                </div>
            </div>

            <div class="carousel-visual">
                <img src="${imageUrl}" alt="${imageAlt}">
            </div>
        </article>
    `;
}

function setupCarouselButtons() {
  if (!carouselPrev || !carouselNext) {
    return;
  }

  carouselNext.addEventListener("click", showNextSlide);
  carouselPrev.addEventListener("click", showPreviousSlide);
}

function showNextSlide() {
  currentSlideIndex++;

  if (currentSlideIndex >= carouselProducts.length) {
    currentSlideIndex = 0;
  }

  renderCarouselSlide(carouselProducts[currentSlideIndex]);
}

function showPreviousSlide() {
  currentSlideIndex--;

  if (currentSlideIndex < 0) {
    currentSlideIndex = carouselProducts.length - 1;
  }

  renderCarouselSlide(carouselProducts[currentSlideIndex]);
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    productGrid.innerHTML += createProductCard(products[i]);
  }
}

function createProductCard(product) {
  const imageUrl = product.image?.url || "../images/placeholder.jpg";
  const imageAlt = product.image?.alt || product.title;

  return `
        <article class="product-card">
            <a href="product/index.html?id=${product.id}" class="product-card-image">
                <img src="${imageUrl}" alt="${imageAlt}">
            </a>

            <div class="product-card-content">
                <div class="product-card-info">
                    <h2>${product.title}</h2>
                    <p>${product.discountedPrice} €</p>
                </div>

                <a href="/product/index.html?id=${product.id}" class="btn btn-small">
                    View Product
                </a>
            </div>
        </article>
    `;
}

function hideLoading() {
  loadingMessage.hidden = true;
}

function showError() {
  errorMessage.hidden = false;
}
