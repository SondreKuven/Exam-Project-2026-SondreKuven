const BASE_URL = "https://v2.api.noroff.dev";
const ONLINE_SHOP = "/online-shop";

export async function fetchAllProducts() {
  const response = await fetch(`${BASE_URL}${ONLINE_SHOP}`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}${ONLINE_SHOP}/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Registration failed");
  }

  return json.data;
}

export async function loginUser(userData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Login failed");
  }

  return json.data;
}
