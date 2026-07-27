requireAuth();

async function loadProfile() {
  try {
    const p = await apiRequest("/profile/me");
    document.getElementById("name").value = p.name || "";
    document.getElementById("email").value = p.email || "";
    document.getElementById("branch").value = p.branch || "";
    document.getElementById("graduationYear").value = p.graduationYear || "";
    document.getElementById("phone").value = p.phone || "";
    document.getElementById("resumeLink").value = p.resumeLink || "";
    document.getElementById("githubLink").value = p.githubLink || "";
    document.getElementById("linkedinLink").value = p.linkedinLink || "";
    document.getElementById("skills").value = (p.skills || []).join(", ");
    document.getElementById("targetCompanies").value = (p.targetCompanies || []).join(", ");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("save-message");

  const payload = {
    name: document.getElementById("name").value.trim(),
    branch: document.getElementById("branch").value.trim(),
    graduationYear: Number(document.getElementById("graduationYear").value) || undefined,
    phone: document.getElementById("phone").value.trim(),
    resumeLink: document.getElementById("resumeLink").value.trim(),
    githubLink: document.getElementById("githubLink").value.trim(),
    linkedinLink: document.getElementById("linkedinLink").value.trim(),
    skills: document.getElementById("skills").value.split(",").map((s) => s.trim()).filter(Boolean),
    targetCompanies: document.getElementById("targetCompanies").value.split(",").map((s) => s.trim()).filter(Boolean),
  };

  try {
    await apiRequest("/profile/me", "PUT", payload);
    msg.textContent = "Profile saved successfully.";
    msg.classList.remove("hidden");
    // reflect updated name in navbar/local session
    const user = getUser();
    if (user) {
      user.name = payload.name;
      localStorage.setItem("pp_user", JSON.stringify(user));
      initNavbar();
    }
    setTimeout(() => msg.classList.add("hidden"), 3000);
  } catch (err) {
    msg.textContent = err.message;
    msg.classList.remove("hidden");
  }
});

loadProfile();
