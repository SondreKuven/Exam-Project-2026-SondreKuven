const CART_KEY = "urbanOasisCart";

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  try {
    return JSON.parse(cart);
  } catch (error) {
    console.error("Could not parse cart:", error);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const existingItem = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.discountedPrice || product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart(updatedCart);
}

export function updateCartQuantity(productId, newQuantity) {
  const cart = getCart();
  const item = cart.find(function (cartItem) {
    return cartItem.id === productId;
  });

  if (!item) {
    return;
  }

  item.quantity = newQuantity;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
