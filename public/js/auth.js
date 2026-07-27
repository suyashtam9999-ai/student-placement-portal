// Handles login.html and register.html form submissions

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("form-error");
    errorEl.classList.add("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      saveSession(data);
      window.location.href = "dashboard.html";
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("form-error");
    errorEl.classList.add("hidden");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const branch = document.getElementById("branch").value.trim();
    const graduationYear = document.getElementById("graduationYear").value;
    const password = document.getElementById("password").value;

    try {
      const data = await apiRequest("/auth/register", "POST", {
        name,
        email,
        branch,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        password,
      });
      saveSession(data);
      window.location.href = "dashboard.html";
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });
}

// If already logged in, skip login/register pages
if ((loginForm || registerForm) && getToken()) {
  window.location.href = "dashboard.html";
}
