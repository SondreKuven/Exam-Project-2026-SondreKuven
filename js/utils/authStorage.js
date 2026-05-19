const TOKEN_KEY = "urbanOasisToken";
const USER_KEY = "urbanOasisUser";

export function saveUser(user) {
  localStorage.setItem(TOKEN_KEY, user.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
