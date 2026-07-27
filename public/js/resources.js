requireAuth();

let currentCategory = "";
let completedIds = new Set();

const badgeClassMap = {
  Aptitude: "badge-aptitude",
  Coding: "badge-coding",
  "Core CS": "badge-corecs",
  HR: "badge-hr",
  Communication: "badge-communication",
};

async function loadCompletedIds() {
  try {
    const profile = await apiRequest("/profile/me");
    completedIds = new Set((profile.completedResources || []).map(String));
  } catch (err) {
    console.error(err);
  }
}

async function loadResources() {
  const list = document.getElementById("resource-list");
  list.innerHTML = `<p class="helper-text">Loading...</p>`;

  try {
    const query = currentCategory ? `?category=${encodeURIComponent(currentCategory)}` : "";
    const resources = await apiRequest(`/resources${query}`);

    if (resources.length === 0) {
      list.innerHTML = `<div class="empty-state">No resources found in this category yet.</div>`;
      return;
    }

    list.innerHTML = resources
      .map((r) => {
        const isDone = completedIds.has(String(r.id));
        return `
        <div class="resource-item">
          <div>
            <div class="r-title">
              <span class="badge ${badgeClassMap[r.category] || ""}">${r.category}</span>
              &nbsp; ${r.title}
            </div>
            <div class="r-desc">${r.description || ""} ${r.link ? `· <a href="${r.link}" target="_blank" rel="noopener">Open link ↗</a>` : ""}</div>
          </div>
          <button class="btn ${isDone ? "btn-accent" : "btn-outline"}" data-id="${r.id}">
            ${isDone ? "✓ Completed" : "Mark complete"}
          </button>
        </div>
      `;
      })
      .join("");

    list.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => toggleComplete(btn.dataset.id));
    });
  } catch (err) {
    list.innerHTML = `<div class="empty-state">${err.message}</div>`;
  }
}

async function toggleComplete(id) {
  try {
    const res = await apiRequest(`/resources/${id}/complete`, "PUT");
    if (res.completed) {
      completedIds.add(id);
    } else {
      completedIds.delete(id);
    }
    loadResources();
  } catch (err) {
    alert(err.message);
  }
}

document.getElementById("filter-row").addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentCategory = chip.dataset.cat;
  loadResources();
});

(async function init() {
  await loadCompletedIds();
  await loadResources();
})();
