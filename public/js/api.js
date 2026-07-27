// Shared API helper used across all pages
const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("pp_token");
}

function getUser() {
  const raw = localStorage.getItem("pp_user");
  return raw ? JSON.parse(raw) : null;
}

function saveSession(userData) {
  const { token, ...user } = userData;
  localStorage.setItem("pp_token", token);
  localStorage.setItem("pp_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("pp_token");
  localStorage.removeItem("pp_user");
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

async function apiRequest(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}

// Populate navbar user info + wire logout button if present on the page
function initNavbar() {
  const user = getUser();
  const nameEl = document.getElementById("nav-user-name");
  if (nameEl && user) nameEl.textContent = user.name;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", initNavbar);
