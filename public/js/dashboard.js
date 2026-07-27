requireAuth();

const CIRC = 2 * Math.PI * 54; // matches r=54 in the SVG ring

async function loadDashboard() {
  try {
    const stats = await apiRequest("/profile/dashboard");

    document.getElementById("stat-resources").textContent = `${stats.resourceProgress}%`;
    document.getElementById("stat-tests").textContent = stats.totalTests;
    document.getElementById("stat-avg").textContent = `${stats.avgScore}%`;
    document.getElementById("stat-completed").textContent = `${stats.completedResources}/${stats.totalResources}`;

    document.getElementById("readiness-num").textContent = stats.readinessScore;
    const offset = CIRC - (stats.readinessScore / 100) * CIRC;
    const ring = document.getElementById("progress-ring");
    ring.setAttribute("stroke-dasharray", CIRC);
    ring.setAttribute("stroke-dashoffset", offset);

    renderRecentResults(stats.recentResults);
  } catch (err) {
    console.error(err);
  }
}

function renderRecentResults(results) {
  const container = document.getElementById("recent-results");
  if (!results || results.length === 0) {
    container.innerHTML = `<div class="empty-state">No mock tests attempted yet. <a href="mock-test.html">Take your first test →</a></div>`;
    return;
  }

  container.innerHTML = results
    .map(
      (r) => `
    <div class="resource-item">
      <div>
        <div class="r-title">${r.category}</div>
        <div class="r-desc">${r.correctAnswers}/${r.totalQuestions} correct · ${new Date(r.createdAt).toLocaleDateString()}</div>
      </div>
      <div class="stat-num mono">${r.scorePercent}%</div>
    </div>
  `
    )
    .join("");
}

loadDashboard();
