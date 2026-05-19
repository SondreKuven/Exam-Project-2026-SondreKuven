import { loginUser, registerUser } from "./utils/api.js";
import { saveUser } from "./utils/authStorage.js";

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}

async function handleRegister(event) {
  event.preventDefault();

  const username = document.querySelector("#register-username").value.trim();
  const email = document.querySelector("#register-email").value.trim();
  const password = document.querySelector("#register-password").value.trim();
  const confirmPassword = document
    .querySelector("#confirm-password")
    .value.trim();

  clearRegisterErrors();

  let isValid = true;

  if (!isValidUsername(username)) {
    showMessage(
      "#register-username-error",
      "Username must be at least 3 characters long and contain only letters, numbers, and underscores."
    );
    isValid = false;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    showMessage("#register-email-error", "Please enter a valid @stud.noroff.no email address.");
    isValid = false;
  }

  if (!isValidPassword(password)) {
    showMessage(
      "#register-password-error",
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
    );
    isValid = false;
  }

  if (password !== confirmPassword) {
    showMessage("#confirm-password-error", "Passwords do not match.");
    isValid = false;
  }

  if (!isValid) return;

  try {
    await registerUser({
      name: username,
      email: email,
      password: password,
    });

    showMessage(
      "#register-success",
      "Registration successful! You can now log in."
    );

    setTimeout(function () {
      window.location.href = "/account/login.html";
    }, 2000);
  } catch (error) {
    showMessage("#register-error", error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value.trim();

  clearMessage("#login-error");

  try {
    const user = await loginUser({
      email: email,
      password: password,
    });

    saveUser(user);

    window.location.href = "/index.html";
  } catch (error) {
    showMessage("#login-error", error.message);
  }
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

function showMessage(selector, message) {
  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  element.textContent = message;
  element.hidden = false;
}

function clearMessage(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  element.textContent = "";
  element.hidden = true;
}

function clearRegisterErrors() {
  clearMessage("#register-username-error");
  clearMessage("#register-email-error");
  clearMessage("#register-password-error");
  clearMessage("#confirm-password-error");
  clearMessage("#register-error");
  clearMessage("#register-success");
}
