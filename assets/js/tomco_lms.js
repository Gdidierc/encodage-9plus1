const STORAGE_KEY = "tomco-lms-state-v1";

const defaultState = {
  stores: [
    {
      id: crypto.randomUUID(),
      name: "Tom&Co Bruxelles Centre",
      city: "Bruxelles",
      manager: "Sophie Martin",
      notes: "Magasin pilote pour les nouveautés produits."
    },
    {
      id: crypto.randomUUID(),
      name: "Tom&Co Liège",
      city: "Liège",
      manager: "Karim El Mansouri",
      notes: "Equipe très dynamique sur l'animalerie."
    }
  ],
  courses: [
    {
      id: crypto.randomUUID(),
      title: "Accueil client & conseil personnalisé",
      category: "Commerce",
      scormVersion: "1.2",
      duration: 35,
      launchUrl: "https://scorm.tomco.eu/accueil-client",
      description:
        "Module centré sur les fondamentaux de l'expérience client Tom&Co, incluant un paquet SCORM 1.2."
    },
    {
      id: crypto.randomUUID(),
      title: "Nutrition des chiens actifs",
      category: "Produits",
      scormVersion: "2004",
      duration: 25,
      launchUrl: "https://scorm.tomco.eu/nutrition-chiens",
      description:
        "Formation SCORM 2004 permettant d'accompagner les clients sportifs dans le choix des aliments."
    }
  ],
  groups: [],
  users: [],
  activity: [],
  preferences: {
    brandColor: "#ff6f3c"
  }
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedState({ ...defaultState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    return mergeDefaults(parsed);
  } catch (error) {
    console.warn("Impossible de lire l'état, réinitialisation", error);
    const seeded = seedState({ ...defaultState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function mergeDefaults(state) {
  return {
    ...defaultState,
    ...state,
    preferences: {
      ...defaultState.preferences,
      ...(state.preferences || {})
    }
  };
}

function seedState(state) {
  const [storeBxl, storeLiege] = state.stores;

  const groupeBxl = {
    id: crypto.randomUUID(),
    name: "Équipe Conseil Bruxelles",
    storeId: storeBxl.id,
    description: "Conseillers spécialisés sur la nutrition et le bien-être.",
    courseIds: [state.courses[0].id, state.courses[1].id]
  };

  const groupeLiège = {
    id: crypto.randomUUID(),
    name: "Vétérinaires Liège",
    storeId: storeLiege.id,
    description: "Veterinary corner du magasin Tom&Co Liège.",
    courseIds: [state.courses[1].id]
  };

  const adminUser = {
    id: crypto.randomUUID(),
    firstName: "Camille",
    lastName: "Durand",
    email: "admin@tomco.eu",
    role: "Administrateur",
    storeId: storeBxl.id,
    groupId: groupeBxl.id,
    password: "admin123"
  };

  const trainer = {
    id: crypto.randomUUID(),
    firstName: "Sarah",
    lastName: "Lefèvre",
    email: "formatrice@tomco.eu",
    role: "Formateur",
    storeId: storeBxl.id,
    groupId: groupeBxl.id,
    password: "welcome1"
  };

  const learner = {
    id: crypto.randomUUID(),
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@tomco.eu",
    role: "Apprenant",
    storeId: storeLiege.id,
    groupId: groupeLiège.id,
    password: "welcome1"
  };

  return {
    ...state,
    groups: [groupeBxl, groupeLiège],
    users: [adminUser, trainer, learner],
    activity: [
      logActivity(
        "Création de la plateforme",
        "Camille Durand a configuré la plateforme LMS",
        new Date().toISOString()
      ),
      logActivity(
        "Assignation",
        "Sarah Lefèvre a assigné Nutrition des chiens actifs au groupe Vétérinaires Liège",
        new Date().toISOString()
      )
    ]
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function logActivity(title, description, date = new Date().toISOString()) {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    date
  };
}

const state = loadState();
let currentUser = null;

const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll(".nav-link");
const viewTitle = document.getElementById("viewTitle");

const courseForm = document.getElementById("courseForm");
const groupForm = document.getElementById("groupForm");
const storeForm = document.getElementById("storeForm");
const userForm = document.getElementById("userForm");

const coursesTable = document.querySelector("#coursesTable tbody");
const groupsTable = document.querySelector("#groupsTable tbody");
const storesTable = document.querySelector("#storesTable tbody");
const usersTable = document.querySelector("#usersTable tbody");

const statCourses = document.getElementById("statCourses");
const statGroups = document.getElementById("statGroups");
const statStores = document.getElementById("statStores");
const statUsers = document.getElementById("statUsers");

const activityFeed = document.getElementById("activityFeed");
const groupProgress = document.getElementById("groupProgress");
const reportAssignments = document.getElementById("reportAssignments");
const reportProgress = document.getElementById("reportProgress");

const toggleButtons = document.querySelectorAll("[data-toggle-form]");
const forms = document.querySelectorAll("[data-form]");
const globalSearch = document.getElementById("globalSearch");
const activeUserChip = document.getElementById("activeUserChip");

const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const resetDemo = document.getElementById("resetDemo");
const settingBrandColor = document.getElementById("settingBrandColor");

const userStoreSelect = document.getElementById("userStore");
const userGroupSelect = document.getElementById("userGroup");
const groupStoreSelect = document.getElementById("groupStore");
const groupCoursesSelect = document.getElementById("groupCourses");

function switchView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.target === id));
  const titles = {
    dashboard: "Tableau de bord",
    courses: "Formations",
    groups: "Groupes",
    stores: "Magasins",
    users: "Utilisateurs",
    reports: "Rapports",
    settings: "Paramètres"
  };
  viewTitle.textContent = titles[id] ?? "";
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    switchView(link.dataset.target);
  });
});

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.toggleForm;
    forms.forEach((form) => {
      form.classList.toggle("active", form.dataset.form === id ? !form.classList.contains("active") : false);
    });
  });
});

function renderStats() {
  statCourses.textContent = state.courses.length;
  statGroups.textContent = state.groups.length;
  statStores.textContent = state.stores.length;
  statUsers.textContent = state.users.length;

  document.getElementById("coursesCount").textContent = state.courses.length;
  document.getElementById("groupsCount").textContent = state.groups.length;
  document.getElementById("storesCount").textContent = state.stores.length;
  document.getElementById("usersCount").textContent = state.users.length;
}

function renderCourses() {
  coursesTable.innerHTML = "";
  state.courses.forEach((course) => {
    const row = document.createElement("tr");
    const assignedGroups = state.groups.filter((g) => g.courseIds?.includes(course.id));
    row.innerHTML = `
      <td>
        <strong>${course.title}</strong><br />
        <span class="muted">${course.description ?? ""}</span>
      </td>
      <td>${course.category ?? ""}</td>
      <td>SCORM ${course.scormVersion}</td>
      <td>${course.duration ? course.duration + " min" : "-"}</td>
      <td>${assignedGroups.length ? assignedGroups.map((g) => g.name).join(", ") : "Aucun"}</td>
    `;
    coursesTable.appendChild(row);
  });
}

function renderGroups() {
  groupsTable.innerHTML = "";
  state.groups.forEach((group) => {
    const row = document.createElement("tr");
    const store = state.stores.find((s) => s.id === group.storeId);
    const learners = state.users.filter((u) => u.groupId === group.id);
    const courseNames = group.courseIds
      .map((courseId) => state.courses.find((c) => c.id === courseId)?.title)
      .filter(Boolean)
      .join(", ");

    row.innerHTML = `
      <td>
        <strong>${group.name}</strong><br />
        <span class="muted">${group.description ?? ""}</span>
      </td>
      <td>${store ? store.name : "-"}</td>
      <td>${courseNames || "Aucune formation"}</td>
      <td>${learners.length}</td>
    `;
    groupsTable.appendChild(row);
  });
}

function renderStores() {
  storesTable.innerHTML = "";
  state.stores.forEach((store) => {
    const row = document.createElement("tr");
    const groups = state.groups.filter((group) => group.storeId === store.id);
    row.innerHTML = `
      <td><strong>${store.name}</strong></td>
      <td>${store.city ?? ""}</td>
      <td>${store.manager ?? ""}</td>
      <td>${groups.map((g) => g.name).join(", ") || "-"}</td>
    `;
    storesTable.appendChild(row);
  });
}

function renderUsers() {
  usersTable.innerHTML = "";
  state.users.forEach((user) => {
    const store = state.stores.find((s) => s.id === user.storeId);
    const group = state.groups.find((g) => g.id === user.groupId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${user.firstName} ${user.lastName}</strong><br />
        <span class="muted">${user.email}</span>
      </td>
      <td>${user.role}</td>
      <td>${store ? store.name : ""}</td>
      <td>${group ? group.name : ""}</td>
    `;
    usersTable.appendChild(row);
  });
}

function renderActivity() {
  activityFeed.innerHTML = "";
  const template = document.getElementById("timelineItemTemplate");
  state.activity
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .forEach((item) => {
      const fragment = template.content.cloneNode(true);
      fragment.querySelector(".timeline-title").textContent = item.title;
      const date = new Date(item.date);
      fragment.querySelector(".timeline-meta").textContent = `${date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })} · ${item.description}`;
      activityFeed.appendChild(fragment);
    });
}

function renderProgress() {
  groupProgress.innerHTML = "";
  const template = document.getElementById("progressItemTemplate");
  state.groups.forEach((group) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".progress-name").textContent = group.name;
    const completion = Math.min(100, Math.round(group.courseIds.length * 32 + Math.random() * 15));
    fragment.querySelector(".progress-value").textContent = `${completion}%`;
    fragment.querySelector(".progress-fill").style.width = `${completion}%`;
    groupProgress.appendChild(fragment);
  });
}

function renderReports() {
  reportAssignments.innerHTML = "";
  state.groups.forEach((group) => {
    const store = state.stores.find((s) => s.id === group.storeId);
    const courses = group.courseIds
      .map((courseId) => state.courses.find((c) => c.id === courseId)?.title)
      .filter(Boolean);
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <strong>${group.name}</strong>
      <span class="muted">${store ? store.name : ""}</span>
      <p>${courses.length ? courses.join(", ") : "Aucune formation assignée"}</p>
    `;
    reportAssignments.appendChild(card);
  });

  reportProgress.innerHTML = "";
  state.users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "report-card";
    const completion = Math.min(100, Math.round(Math.random() * 90));
    const courseCount = state.groups.find((g) => g.id === user.groupId)?.courseIds.length ?? 0;
    card.innerHTML = `
      <strong>${user.firstName} ${user.lastName}</strong>
      <span class="muted">${user.role}</span>
      <p>${courseCount} formation(s) assignée(s) · ${completion}% d'avancement</p>
    `;
    reportProgress.appendChild(card);
  });
}

function updateSelectors() {
  const storeOptions = state.stores
    .map((store) => `<option value="${store.id}">${store.name}</option>`)
    .join("");
  const groupOptions = state.groups
    .map((group) => `<option value="${group.id}">${group.name}</option>`)
    .join("");
  const courseOptions = state.courses
    .map((course) => `<option value="${course.id}">${course.title}</option>`)
    .join("");

  userStoreSelect.innerHTML = `<option value="">Non spécifié</option>${storeOptions}`;
  userGroupSelect.innerHTML = `<option value="">Non spécifié</option>${groupOptions}`;
  groupStoreSelect.innerHTML = `<option value="">Non spécifié</option>${storeOptions}`;
  groupCoursesSelect.innerHTML = courseOptions;
}

function addCourse(event) {
  event.preventDefault();
  const course = {
    id: crypto.randomUUID(),
    title: document.getElementById("courseTitle").value,
    category: document.getElementById("courseCategory").value,
    scormVersion: document.getElementById("courseScorm").value,
    duration: Number(document.getElementById("courseDuration").value) || null,
    launchUrl: document.getElementById("courseLaunchUrl").value,
    description: document.getElementById("courseDescription").value
  };

  state.courses.push(course);
  state.activity.push(
    logActivity(
      "Nouvelle formation",
      `${currentUser.firstName} ${currentUser.lastName} a ajouté ${course.title}`
    )
  );
  saveState(state);
  renderEverything();
  courseForm.reset();
}

function addGroup(event) {
  event.preventDefault();
  const courseIds = Array.from(groupCoursesSelect.selectedOptions).map((option) => option.value);
  const group = {
    id: crypto.randomUUID(),
    name: document.getElementById("groupName").value,
    storeId: document.getElementById("groupStore").value || null,
    description: document.getElementById("groupDescription").value,
    courseIds
  };

  state.groups.push(group);
  state.activity.push(
    logActivity(
      "Nouveau groupe",
      `${currentUser.firstName} ${currentUser.lastName} a créé le groupe ${group.name}`
    )
  );
  saveState(state);
  renderEverything();
  groupForm.reset();
}

function addStore(event) {
  event.preventDefault();
  const store = {
    id: crypto.randomUUID(),
    name: document.getElementById("storeName").value,
    city: document.getElementById("storeCity").value,
    manager: document.getElementById("storeManager").value,
    notes: document.getElementById("storeNotes").value
  };

  state.stores.push(store);
  state.activity.push(
    logActivity(
      "Nouveau magasin",
      `${currentUser.firstName} ${currentUser.lastName} a ajouté ${store.name}`
    )
  );
  saveState(state);
  renderEverything();
  storeForm.reset();
}

function addUser(event) {
  event.preventDefault();
  const user = {
    id: crypto.randomUUID(),
    firstName: document.getElementById("userFirstName").value,
    lastName: document.getElementById("userLastName").value,
    email: document.getElementById("userEmail").value,
    role: document.getElementById("userRole").value,
    password: document.getElementById("userPassword").value,
    storeId: document.getElementById("userStore").value || null,
    groupId: document.getElementById("userGroup").value || null
  };

  state.users.push(user);
  state.activity.push(
    logActivity(
      "Nouvel utilisateur",
      `${currentUser.firstName} ${currentUser.lastName} a créé le profil ${user.firstName} ${user.lastName}`
    )
  );
  saveState(state);
  renderEverything();
  userForm.reset();
}

function handleSearch(event) {
  const term = event.target.value.toLowerCase();
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? "" : "none";
  });
}

function authenticate(email, password) {
  return state.users.find((user) => user.email === email && user.password === password);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const user = authenticate(email, password);
  if (!user) {
    alert("Identifiants invalides. Merci de vérifier vos informations.");
    return;
  }

  currentUser = user;
  activeUserChip.textContent = `${user.firstName} ${user.lastName} · ${user.role}`;
  authScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  renderEverything();
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
});

courseForm.addEventListener("submit", addCourse);
groupForm.addEventListener("submit", addGroup);
storeForm.addEventListener("submit", addStore);
userForm.addEventListener("submit", addUser);

globalSearch.addEventListener("input", handleSearch);

resetDemo.addEventListener("click", (event) => {
  event.preventDefault();
  if (confirm("Confirmer la réinitialisation des données de démonstration ?")) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
});

settingBrandColor.addEventListener("input", (event) => {
  document.documentElement.style.setProperty("--brand", event.target.value);
  document.documentElement.style.setProperty("--brand-dark", event.target.value);
  state.preferences.brandColor = event.target.value;
  saveState(state);
});

function renderEverything() {
  if (currentUser) {
    document.documentElement.style.setProperty("--brand", state.preferences.brandColor);
    document.documentElement.style.setProperty("--brand-dark", state.preferences.brandColor);
  }
  renderStats();
  renderCourses();
  renderGroups();
  renderStores();
  renderUsers();
  renderActivity();
  renderProgress();
  renderReports();
  updateSelectors();
}

updateSelectors();
renderStats();
renderCourses();
renderGroups();
renderStores();
renderUsers();
renderActivity();
renderProgress();
renderReports();
