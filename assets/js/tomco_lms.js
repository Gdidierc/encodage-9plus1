const STORAGE_KEY = "tomco-lms-state-v1";
const MAX_SCORM_SIZE = 20 * 1024 * 1024; // 20 Mo pour la démonstration

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
        "Module centré sur les fondamentaux de l'expérience client Tom&Co, incluant un paquet SCORM 1.2.",
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Accueillir et découvrir le besoin",
          type: "E-learning",
          duration: 12,
          objective: "Maîtriser les étapes d'une prise de contact réussie.",
          content:
            "Vidéo interactive et cas pratiques sur l'écoute active, les questions ouvertes et la reformulation.",
          order: 1
        },
        {
          id: crypto.randomUUID(),
          title: "Personnaliser la recommandation",
          type: "Video",
          duration: 15,
          objective: "Adapter le conseil en fonction du profil client et de son animal.",
          content:
            "Capsule vidéo + fiche mémo téléchargeable pour présenter les gammes et argumentaires clés.",
          order: 2
        }
      ],
      assessments: [
        {
          id: crypto.randomUUID(),
          title: "Quiz de validation",
          type: "Quiz",
          questionCount: 8,
          passingScore: 80
        }
      ],
      package: {
        name: "accueil-client_scorm.zip",
        size: 5242880,
        type: "application/zip",
        lastModified: new Date().toISOString(),
        dataUrl: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: "Nutrition des chiens actifs",
      category: "Produits",
      scormVersion: "2004",
      duration: 25,
      launchUrl: "https://scorm.tomco.eu/nutrition-chiens",
      description:
        "Formation SCORM 2004 permettant d'accompagner les clients sportifs dans le choix des aliments.",
      modules: [
        {
          id: crypto.randomUUID(),
          title: "Les besoins énergétiques",
          type: "E-learning",
          duration: 10,
          objective: "Comprendre les apports nécessaires aux chiens sportifs.",
          content:
            "Tableaux interactifs et mini-jeux pour associer activités et rations adaptées.",
          order: 1
        },
        {
          id: crypto.randomUUID(),
          title: "Focus sur les gammes Tom&Co",
          type: "Document",
          duration: 8,
          objective: "Mettre en avant les points différenciants de nos produits.",
          content:
            "Guide PDF enrichi, fiches produits et ressources à télécharger pour l'équipe.",
          order: 2
        }
      ],
      assessments: [
        {
          id: crypto.randomUUID(),
          title: "Evaluation situationnelle",
          type: "Evaluation pratique",
          questionCount: 5,
          passingScore: 70
        }
      ],
      package: {
        name: "nutrition-chiens_scorm.zip",
        size: 3670016,
        type: "application/zip",
        lastModified: new Date().toISOString(),
        dataUrl: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

function seededValue(seed, max = 100) {
  let hash = 0;
  const normalizedSeed = String(seed);
  for (let index = 0; index < normalizedSeed.length; index += 1) {
    hash = (hash << 5) - hash + normalizedSeed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % (max + 1);
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) {
    return "-";
  }
  const units = ["octets", "Ko", "Mo", "Go"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatMinutes(minutes) {
  if (!minutes) {
    return "Durée non définie";
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (!hours) {
    return `${minutes} min`;
  }
  return `${hours}h${remaining ? ` ${remaining} min` : ""}`.trim();
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getISOWeek(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
  return { week, year: target.getUTCFullYear() };
}

function computeTrend(key) {
  const variation = seededValue(`${key}-${dashboardRange}-${state.activity.length}`, 18) - 9;
  return variation;
}

function trendLabel(value) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getCourseById(id) {
  return state.courses.find((course) => course.id === id);
}

function ensureCourseSelection() {
  if (!state.courses.length) {
    selectedCourseId = null;
    return;
  }
  if (!selectedCourseId || !state.courses.some((course) => course.id === selectedCourseId)) {
    selectedCourseId = state.courses[0].id;
  }
}

function getActorName() {
  return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Système";
}

const state = loadState();
let currentUser = null;
let selectedCourseId = null;
let selectedModuleId = null;
let editingModuleId = null;
let editingAssessmentId = null;
let dashboardRange = 7;
let dashboardFocus = "global";
let pulseMetric = "engagement";
let reportView = "assignments";
const reportFilters = {
  store: "",
  group: ""
};
let reportPeriod = 30;
let reportSearchTerm = "";

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
const statCoursesTrend = document.getElementById("statCoursesTrend");
const statGroupsTrend = document.getElementById("statGroupsTrend");
const statStoresTrend = document.getElementById("statStoresTrend");
const statUsersTrend = document.getElementById("statUsersTrend");

const activityFeed = document.getElementById("activityFeed");
const groupProgress = document.getElementById("groupProgress");
const dashboardAlerts = document.getElementById("dashboardAlerts");
const topCoursesList = document.getElementById("topCoursesList");
const learnerPulse = document.getElementById("learnerPulse");
const timeHeatmap = document.getElementById("timeHeatmap");
const reportAssignments = document.getElementById("reportAssignments");
const reportProgress = document.getElementById("reportProgress");
const reportAssessments = document.getElementById("reportAssessments");
const reportSummary = document.getElementById("reportSummary");

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

const courseIdInput = document.getElementById("courseId");
const groupIdInput = document.getElementById("groupId");
const storeIdInput = document.getElementById("storeId");
const userIdInput = document.getElementById("userId");
const moduleIdInput = document.getElementById("moduleId");
const assessmentIdInput = document.getElementById("assessmentId");
const moduleTitleInput = document.getElementById("moduleTitle");
const moduleTypeSelect = document.getElementById("moduleType");
const moduleDurationInput = document.getElementById("moduleDuration");
const moduleObjectiveInput = document.getElementById("moduleObjective");
const moduleContentInput = document.getElementById("moduleContent");
const assessmentTitleInput = document.getElementById("assessmentTitle");
const assessmentTypeSelect = document.getElementById("assessmentType");
const assessmentQuestionsInput = document.getElementById("assessmentQuestions");
const assessmentPassingInput = document.getElementById("assessmentPassing");

const courseSubmitBtn = document.getElementById("courseSubmitBtn");
const groupSubmitBtn = document.getElementById("groupSubmitBtn");
const storeSubmitBtn = document.getElementById("storeSubmitBtn");
const userSubmitBtn = document.getElementById("userSubmitBtn");
const moduleSubmitBtn = document.getElementById("moduleSubmitBtn");
const assessmentSubmitBtn = document.getElementById("assessmentSubmitBtn");

const courseCancelBtn = document.getElementById("courseCancelBtn");
const groupCancelBtn = document.getElementById("groupCancelBtn");
const storeCancelBtn = document.getElementById("storeCancelBtn");
const userCancelBtn = document.getElementById("userCancelBtn");
const moduleCancelBtn = document.getElementById("moduleCancelBtn");
const assessmentCancelBtn = document.getElementById("assessmentCancelBtn");

const categoryChart = document.getElementById("categoryChart");
const storeEngagementChart = document.getElementById("storeEngagementChart");
const completionTrendChart = document.getElementById("completionTrend");

const dashboardRangeChips = document.getElementById("dashboardRangeChips");
const dashboardFocusChips = document.getElementById("dashboardFocusChips");
const dashboardGroupFilter = document.getElementById("dashboardGroupFilter");
const dashboardPulseToggle = document.getElementById("dashboardPulseToggle");
const activityRefreshBtn = document.getElementById("activityRefreshBtn");

const coursePackageInput = document.getElementById("coursePackage");
const courseDetailContent = document.getElementById("courseDetailContent");
const courseDetailEmpty = document.getElementById("courseDetailEmpty");
const courseDetailCategory = document.getElementById("courseDetailCategory");
const courseDetailTitle = document.getElementById("courseDetailTitle");
const courseDetailDescription = document.getElementById("courseDetailDescription");
const courseDetailDuration = document.getElementById("courseDetailDuration");
const courseDetailScorm = document.getElementById("courseDetailScorm");
const courseDetailLaunch = document.getElementById("courseDetailLaunch");
const coursePackageInfo = document.getElementById("coursePackageInfo");
const courseAssignments = document.getElementById("courseAssignments");
const coursePreviewBtn = document.getElementById("coursePreviewBtn");
const courseEditBtn = document.getElementById("courseEditBtn");

const moduleForm = document.getElementById("moduleForm");
const modulesList = document.getElementById("modulesList");
const modulePreview = document.getElementById("modulePreview");
const moduleToggleBtn = document.getElementById("moduleToggleBtn");

const assessmentForm = document.getElementById("assessmentForm");
const assessmentsList = document.getElementById("assessmentsList");
const assessmentToggleBtn = document.getElementById("assessmentToggleBtn");

const reportViewTabs = document.getElementById("reportViewTabs");
const reportStoreFilter = document.getElementById("reportStoreFilter");
const reportGroupFilter = document.getElementById("reportGroupFilter");
const reportPeriodFilter = document.getElementById("reportPeriodFilter");
const reportSearchInput = document.getElementById("reportSearch");
const reportPanels = document.querySelectorAll("[data-report-panel]");

const defaultSubmitLabels = {
  course: courseSubmitBtn?.textContent.trim() ?? "",
  group: groupSubmitBtn?.textContent.trim() ?? "",
  store: storeSubmitBtn?.textContent.trim() ?? "",
  user: userSubmitBtn?.textContent.trim() ?? "",
  module: moduleSubmitBtn?.textContent.trim() ?? "",
  assessment: assessmentSubmitBtn?.textContent.trim() ?? ""
};

function setFormActive(id, force) {
  forms.forEach((form) => {
    if (form.dataset.form === id) {
      const shouldActivate =
        typeof force === "boolean" ? force : !form.classList.contains("active");
      form.classList.toggle("active", shouldActivate);
    } else {
      form.classList.remove("active");
    }
  });
}

function scrollToForm(form) {
  if (!form) {
    return;
  }
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetCourseForm(close = false) {
  if (!courseForm) {
    return;
  }
  courseForm.reset();
  if (courseIdInput) {
    courseIdInput.value = "";
  }
  if (coursePackageInput) {
    coursePackageInput.value = "";
  }
  courseForm.classList.remove("is-editing");
  if (courseSubmitBtn) {
    courseSubmitBtn.textContent = defaultSubmitLabels.course;
  }
  courseCancelBtn?.classList.add("hidden");
  if (close) {
    setFormActive("course", false);
  }
}

function resetGroupForm(close = false) {
  if (!groupForm) {
    return;
  }
  groupForm.reset();
  if (groupIdInput) {
    groupIdInput.value = "";
  }
  Array.from(groupCoursesSelect?.options ?? []).forEach((option) => {
    option.selected = false;
  });
  groupForm.classList.remove("is-editing");
  if (groupSubmitBtn) {
    groupSubmitBtn.textContent = defaultSubmitLabels.group;
  }
  groupCancelBtn?.classList.add("hidden");
  if (close) {
    setFormActive("group", false);
  }
}

function resetStoreForm(close = false) {
  if (!storeForm) {
    return;
  }
  storeForm.reset();
  if (storeIdInput) {
    storeIdInput.value = "";
  }
  storeForm.classList.remove("is-editing");
  if (storeSubmitBtn) {
    storeSubmitBtn.textContent = defaultSubmitLabels.store;
  }
  storeCancelBtn?.classList.add("hidden");
  if (close) {
    setFormActive("store", false);
  }
}

function resetUserForm(close = false) {
  if (!userForm) {
    return;
  }
  userForm.reset();
  if (userIdInput) {
    userIdInput.value = "";
  }
  userForm.classList.remove("is-editing");
  if (userSubmitBtn) {
    userSubmitBtn.textContent = defaultSubmitLabels.user;
  }
  userCancelBtn?.classList.add("hidden");
  if (close) {
    setFormActive("user", false);
  }
}

function resetModuleForm(hide = true) {
  if (!moduleForm) {
    return;
  }
  moduleForm.reset();
  if (moduleIdInput) {
    moduleIdInput.value = "";
  }
  moduleForm.classList.remove("is-editing");
  if (moduleSubmitBtn) {
    moduleSubmitBtn.textContent = defaultSubmitLabels.module;
  }
  moduleCancelBtn?.classList.add("hidden");
  if (hide) {
    moduleForm.classList.add("hidden");
  }
  editingModuleId = null;
}

function resetAssessmentForm(hide = true) {
  if (!assessmentForm) {
    return;
  }
  assessmentForm.reset();
  if (assessmentIdInput) {
    assessmentIdInput.value = "";
  }
  assessmentForm.classList.remove("is-editing");
  if (assessmentSubmitBtn) {
    assessmentSubmitBtn.textContent = defaultSubmitLabels.assessment;
  }
  assessmentCancelBtn?.classList.add("hidden");
  if (hide) {
    assessmentForm.classList.add("hidden");
  }
  editingAssessmentId = null;
}

resetCourseForm();
resetGroupForm();
resetStoreForm();
resetUserForm();
resetModuleForm();
resetAssessmentForm();

courseCancelBtn?.addEventListener("click", () => {
  resetCourseForm(true);
});

groupCancelBtn?.addEventListener("click", () => {
  resetGroupForm(true);
});

storeCancelBtn?.addEventListener("click", () => {
  resetStoreForm(true);
});

userCancelBtn?.addEventListener("click", () => {
  resetUserForm(true);
});

moduleCancelBtn?.addEventListener("click", () => {
  resetModuleForm(true);
});

assessmentCancelBtn?.addEventListener("click", () => {
  resetAssessmentForm(true);
});

moduleToggleBtn?.addEventListener("click", () => {
  const shouldOpen = moduleForm?.classList.contains("hidden");
  if (shouldOpen) {
    resetModuleForm(false);
    moduleForm?.classList.remove("hidden");
    moduleCancelBtn?.classList.remove("hidden");
    moduleForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    resetModuleForm(true);
  }
});

assessmentToggleBtn?.addEventListener("click", () => {
  const shouldOpen = assessmentForm?.classList.contains("hidden");
  if (shouldOpen) {
    resetAssessmentForm(false);
    assessmentForm?.classList.remove("hidden");
    assessmentCancelBtn?.classList.remove("hidden");
    assessmentForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    resetAssessmentForm(true);
  }
});

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
    if (!id) {
      return;
    }
    const targetForm = Array.from(forms).find((form) => form.dataset.form === id);
    const shouldActivate = targetForm ? !targetForm.classList.contains("active") : false;
    setFormActive(id, shouldActivate);
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-entity][data-action]");
  if (!button) {
    return;
  }
  const { entity, action, id } = button.dataset;
  if (!entity || !action || !id) {
    return;
  }

  if (action === "edit") {
    switch (entity) {
      case "course":
        startCourseEdit(id);
        break;
      case "group":
        startGroupEdit(id);
        break;
      case "store":
        startStoreEdit(id);
        break;
      case "user":
        startUserEdit(id);
        break;
      default:
        break;
    }
  } else if (action === "delete") {
    switch (entity) {
      case "course":
        deleteCourse(id);
        break;
      case "group":
        deleteGroup(id);
        break;
      case "store":
        deleteStore(id);
        break;
      case "user":
        deleteUser(id);
        break;
      default:
        break;
    }
  }
});

modulesList?.addEventListener("click", (event) => {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const actionButton = event.target.closest("button[data-module-action]");
  if (actionButton) {
    const { action, id } = actionButton.dataset;
    if (!id) {
      return;
    }
    switch (action) {
      case "preview":
        selectedModuleId = id;
        renderModulePreview(course);
        break;
      case "edit":
        startModuleEdit(id);
        break;
      case "delete":
        deleteModule(id);
        break;
      default:
        break;
    }
    return;
  }
  const item = event.target.closest("[data-module-id]");
  if (item?.dataset.moduleId) {
    selectedModuleId = item.dataset.moduleId;
    renderModulePreview(course);
  }
});

assessmentsList?.addEventListener("click", (event) => {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const button = event.target.closest("button[data-assessment-action]");
  if (!button) {
    return;
  }
  const { action, id } = button.dataset;
  if (!id) {
    return;
  }
  if (action === "edit") {
    startAssessmentEdit(id);
  } else if (action === "delete") {
    deleteAssessment(id);
  }
});

function renderStats() {
  statCourses.textContent = state.courses.length;
  statGroups.textContent = state.groups.length;
  statStores.textContent = state.stores.length;
  statUsers.textContent = state.users.length;

  const coursesTrend = computeTrend("courses");
  const groupsTrend = computeTrend("groups");
  const storesTrend = computeTrend("stores");
  const usersTrend = computeTrend("users");

  if (statCoursesTrend) {
    statCoursesTrend.textContent = trendLabel(coursesTrend);
    statCoursesTrend.classList.toggle("negative", coursesTrend < 0);
  }
  if (statGroupsTrend) {
    statGroupsTrend.textContent = trendLabel(groupsTrend);
    statGroupsTrend.classList.toggle("negative", groupsTrend < 0);
  }
  if (statStoresTrend) {
    statStoresTrend.textContent = trendLabel(storesTrend);
    statStoresTrend.classList.toggle("negative", storesTrend < 0);
  }
  if (statUsersTrend) {
    statUsersTrend.textContent = trendLabel(usersTrend);
    statUsersTrend.classList.toggle("negative", usersTrend < 0);
  }

  document.getElementById("coursesCount").textContent = state.courses.length;
  document.getElementById("groupsCount").textContent = state.groups.length;
  document.getElementById("storesCount").textContent = state.stores.length;
  document.getElementById("usersCount").textContent = state.users.length;
}

function renderCourses() {
  ensureCourseSelection();
  coursesTable.innerHTML = "";
  state.courses.forEach((course) => {
    const row = document.createElement("tr");
    row.dataset.courseId = course.id;
    if (course.id === selectedCourseId) {
      row.classList.add("is-selected");
    }
    const assignedGroups = state.groups.filter((g) => g.courseIds?.includes(course.id));
    const modulesCount = course.modules?.length ?? 0;
    const learners = state.users.filter((user) => assignedGroups.some((group) => group.id === user.groupId));
    const updatedLabel = course.updatedAt ? formatDate(course.updatedAt) : "-";

    row.innerHTML = `
      <td>
        <strong>${course.title}</strong><br />
        <span class="muted">${course.description ?? ""}</span><br />
        <span class="muted">${learners.length} apprenant(s) · MàJ ${updatedLabel}</span>
      </td>
      <td>${course.category ?? "Non catégorisé"}</td>
      <td>${modulesCount}</td>
      <td>SCORM ${course.scormVersion}</td>
      <td>${assignedGroups.length ? assignedGroups.map((g) => g.name).join(", ") : "Aucun"}</td>
      <td class="table-actions">
        <button
          class="icon-button"
          data-entity="course"
          data-action="edit"
          data-id="${course.id}"
          aria-label="Modifier ${course.title}"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          class="icon-button danger"
          data-entity="course"
          data-action="delete"
          data-id="${course.id}"
          aria-label="Supprimer ${course.title}"
          title="Supprimer"
        >
          🗑️
        </button>
      </td>
    `;
    coursesTable.appendChild(row);
  });
  renderCourseDetail();
}

function renderCourseDetail() {
  if (!courseDetailContent || !courseDetailEmpty) {
    return;
  }
  ensureCourseSelection();
  const course = selectedCourseId ? getCourseById(selectedCourseId) : null;
  if (!course) {
    courseDetailContent.classList.add("hidden");
    courseDetailEmpty.classList.remove("hidden");
    if (modulePreview) {
      modulePreview.innerHTML = `<p class="muted">Ajoutez une formation pour visualiser ses modules.</p>`;
    }
    return;
  }

  courseDetailEmpty.classList.add("hidden");
  courseDetailContent.classList.remove("hidden");

  if (courseDetailCategory) {
    courseDetailCategory.textContent = course.category ?? "Non catégorisé";
  }
  if (courseDetailTitle) {
    courseDetailTitle.textContent = course.title;
  }
  if (courseDetailDescription) {
    courseDetailDescription.textContent =
      course.description || "Aucune description n'a encore été renseignée.";
  }
  if (courseDetailDuration) {
    courseDetailDuration.textContent = `🕒 ${formatMinutes(course.duration)}`;
  }
  if (courseDetailScorm) {
    courseDetailScorm.textContent = `📦 SCORM ${course.scormVersion}`;
  }
  if (courseDetailLaunch) {
    if (course.launchUrl) {
      courseDetailLaunch.textContent = "Lancer le module";
      courseDetailLaunch.href = course.launchUrl;
      courseDetailLaunch.classList.remove("hidden");
    } else {
      courseDetailLaunch.textContent = "";
      courseDetailLaunch.classList.add("hidden");
    }
  }

  renderCoursePackage(course);
  renderCourseAssignments(course);

  if (!course.modules?.some((module) => module.id === selectedModuleId)) {
    selectedModuleId = course.modules?.[0]?.id ?? null;
  }

  renderModulesList(course);
  renderAssessmentsList(course);
  renderModulePreview(course);
}

function renderCoursePackage(course) {
  if (!coursePackageInfo) {
    return;
  }
  if (!course?.package) {
    coursePackageInfo.innerHTML =
      '<p class="muted">Aucun paquet SCORM importé pour le moment. Ajoutez votre archive .zip via le formulaire ci-contre.</p>';
    return;
  }

  const { name, size, lastModified, dataUrl } = course.package;
  const downloadButton = dataUrl
    ? `<a class="btn ghost" href="${dataUrl}" download="${name}">Télécharger le paquet</a>`
    : '<p class="muted">Fichier disponible uniquement dans cette session.</p>';

  coursePackageInfo.innerHTML = `
    <strong>Fichier chargé : ${name}</strong>
    <span>${formatBytes(size)} · importé le ${formatDate(lastModified)}</span>
    <div class="course-detail__package-actions">${downloadButton}</div>
  `;
}

function renderCourseAssignments(course) {
  if (!courseAssignments) {
    return;
  }
  const assignedGroups = state.groups.filter((group) => group.courseIds?.includes(course.id));
  if (!assignedGroups.length) {
    courseAssignments.innerHTML = '<p class="muted">Aucun groupe assigné pour le moment.</p>';
    return;
  }

  courseAssignments.innerHTML = assignedGroups
    .map((group) => {
      const learners = state.users.filter((user) => user.groupId === group.id).length;
      const store = state.stores.find((item) => item.id === group.storeId);
      return `<span class="tag tag--accent">${group.name} · ${learners} apprenant(s)${
        store ? ` · ${store.name}` : ""
      }</span>`;
    })
    .join("");
}

function renderModulesList(course) {
  if (!modulesList) {
    return;
  }
  modulesList.innerHTML = "";
  if (!course.modules?.length) {
    modulesList.innerHTML = '<li class="entity-list__empty">Aucun module configuré pour le moment.</li>';
    return;
  }

  course.modules
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach((module, index) => {
      const item = document.createElement("li");
      item.className = "entity-list__item";
      item.dataset.moduleId = module.id;
      item.innerHTML = `
        <div>
          <strong>${index + 1}. ${module.title}</strong>
          <div class="entity-list__meta">
            <span>📚 ${module.type}</span>
            <span>🕒 ${module.duration ? module.duration + " min" : "Durée libre"}</span>
          </div>
          <p class="muted">${module.objective || "Objectif pédagogique en cours de rédaction."}</p>
        </div>
        <div class="entity-actions">
          <button class="icon-button" data-module-action="preview" data-id="${module.id}" title="Aperçu">
            👁️
          </button>
          <button class="icon-button" data-module-action="edit" data-id="${module.id}" title="Modifier">
            ✏️
          </button>
          <button class="icon-button danger" data-module-action="delete" data-id="${module.id}" title="Supprimer">
            🗑️
          </button>
        </div>
      `;
      modulesList.appendChild(item);
    });
}

function renderModulePreview(course) {
  if (!modulePreview) {
    return;
  }
  modulePreview.innerHTML = "";
  if (!course.modules?.length) {
    modulePreview.innerHTML =
      "<p class=\"muted\">Ajoutez un module pédagogique pour préparer l'expérience apprenant.</p>";
    return;
  }
  const module = course.modules.find((item) => item.id === selectedModuleId) ?? course.modules[0];
  if (!module) {
    modulePreview.innerHTML =
      "<p class=\"muted\">Sélectionnez un module pour afficher l'aperçu apprenant.</p>";
    return;
  }
  selectedModuleId = module.id;
  modulePreview.innerHTML = `
    <div>
      <h4>${module.title}</h4>
      <p class="muted">${module.objective || "Objectif pédagogique en cours de rédaction."}</p>
      <div class="preview-pane__body">${
        module.content ? module.content : "Renseignez le contenu détaillé, script ou ressources clés du module."
      }</div>
      <div class="preview-pane__meta">
        <span class="tag tag--accent">${module.type}</span>
        <span class="tag">${module.duration ? module.duration + " min" : "Durée flexible"}</span>
      </div>
    </div>
  `;
}

function renderAssessmentsList(course) {
  if (!assessmentsList) {
    return;
  }
  assessmentsList.innerHTML = "";
  if (!course.assessments?.length) {
    assessmentsList.innerHTML =
      "<li class=\"entity-list__empty\">Aucune évaluation n'est encore programmée.</li>";
    return;
  }

  course.assessments.forEach((assessment) => {
    const item = document.createElement("li");
    item.className = "entity-list__item";
    item.dataset.assessmentId = assessment.id;
    item.innerHTML = `
      <div>
        <strong>${assessment.title}</strong>
        <div class="entity-list__meta">
          <span>🧪 ${assessment.type}</span>
          <span>❓ ${assessment.questionCount ?? "?"} question(s)</span>
          <span>🎯 ${assessment.passingScore ?? 0}% requis</span>
        </div>
      </div>
      <div class="entity-actions">
        <button class="icon-button" data-assessment-action="edit" data-id="${assessment.id}" title="Modifier">
          ✏️
        </button>
        <button class="icon-button danger" data-assessment-action="delete" data-id="${assessment.id}" title="Supprimer">
          🗑️
        </button>
      </div>
    `;
    assessmentsList.appendChild(item);
  });
}

function startModuleEdit(moduleId) {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const module = course.modules?.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  moduleForm?.classList.remove("hidden");
  moduleForm?.classList.add("is-editing");
  moduleCancelBtn?.classList.remove("hidden");
  if (moduleSubmitBtn) {
    moduleSubmitBtn.textContent = "Mettre à jour le module";
  }
  editingModuleId = module.id;
  if (moduleIdInput) {
    moduleIdInput.value = module.id;
  }
  if (moduleTitleInput) {
    moduleTitleInput.value = module.title ?? "";
  }
  if (moduleTypeSelect) {
    moduleTypeSelect.value = module.type ?? "E-learning";
  }
  if (moduleDurationInput) {
    moduleDurationInput.value = module.duration ?? "";
  }
  if (moduleObjectiveInput) {
    moduleObjectiveInput.value = module.objective ?? "";
  }
  if (moduleContentInput) {
    moduleContentInput.value = module.content ?? "";
  }
  moduleForm?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteModule(moduleId) {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const module = course.modules?.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }
  if (!confirm(`Supprimer le module "${module.title}" ?`)) {
    return;
  }
  course.modules = (course.modules ?? []).filter((item) => item.id !== moduleId);
  if (selectedModuleId === moduleId) {
    selectedModuleId = course.modules?.[0]?.id ?? null;
  }
  course.updatedAt = new Date().toISOString();
  saveState(state);
  renderCourses();
}

function startAssessmentEdit(assessmentId) {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const assessment = course.assessments?.find((item) => item.id === assessmentId);
  if (!assessment) {
    return;
  }
  assessmentForm?.classList.remove("hidden");
  assessmentForm?.classList.add("is-editing");
  assessmentCancelBtn?.classList.remove("hidden");
  if (assessmentSubmitBtn) {
    assessmentSubmitBtn.textContent = "Mettre à jour l'évaluation";
  }
  editingAssessmentId = assessment.id;
  if (assessmentIdInput) {
    assessmentIdInput.value = assessment.id;
  }
  if (assessmentTitleInput) {
    assessmentTitleInput.value = assessment.title ?? "";
  }
  if (assessmentTypeSelect) {
    assessmentTypeSelect.value = assessment.type ?? "Quiz";
  }
  if (assessmentQuestionsInput) {
    assessmentQuestionsInput.value = assessment.questionCount ?? "";
  }
  if (assessmentPassingInput) {
    assessmentPassingInput.value = assessment.passingScore ?? "";
  }
  assessmentForm?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteAssessment(assessmentId) {
  const course = getCourseById(selectedCourseId);
  if (!course) {
    return;
  }
  const assessment = course.assessments?.find((item) => item.id === assessmentId);
  if (!assessment) {
    return;
  }
  if (!confirm(`Supprimer l'évaluation "${assessment.title}" ?`)) {
    return;
  }
  course.assessments = (course.assessments ?? []).filter((item) => item.id !== assessmentId);
  course.updatedAt = new Date().toISOString();
  saveState(state);
  renderCourses();
}

function renderLearnerPreview(course) {
  if (!modulePreview) {
    return;
  }
  if (!course.modules?.length) {
    modulePreview.innerHTML =
      "<p class=\"muted\">Ajoutez des modules pour afficher le parcours apprenant.</p>";
    return;
  }

  const modulesTimeline = course.modules
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(
      (module, index) => `
        <li>
          <strong>${index + 1}. ${module.title}</strong>
          <span class="muted">${module.type} · ${module.duration ? module.duration + " min" : "Durée flexible"}</span>
        </li>
      `
    )
    .join("");

  const assessmentsSummary = course.assessments?.length
    ? `<div class="preview-pane__meta">
        <span class="tag tag--accent">${course.assessments.length} évaluation(s)</span>
        <span class="tag">Score requis ${
          Math.max(...course.assessments.map((item) => item.passingScore ?? 0))
        }%</span>
      </div>`
    : "";

  modulePreview.innerHTML = `
    <div>
      <h4>Parcours apprenant</h4>
      <ol class="preview-timeline">${modulesTimeline}</ol>
      ${assessmentsSummary}
    </div>
  `;
}

function handleModuleSubmit(event) {
  event.preventDefault();
  const course = getCourseById(selectedCourseId);
  if (!course) {
    alert("Sélectionnez d'abord une formation pour y rattacher le module.");
    return;
  }

  const payload = {
    title: moduleTitleInput?.value.trim() ?? "",
    type: moduleTypeSelect?.value || "E-learning",
    duration: moduleDurationInput?.value ? Number(moduleDurationInput.value) : null,
    objective: moduleObjectiveInput?.value.trim() || "",
    content: moduleContentInput?.value.trim() || ""
  };

  course.modules = course.modules ?? [];

  if (editingModuleId) {
    const index = course.modules.findIndex((item) => item.id === editingModuleId);
    if (index !== -1) {
      course.modules.splice(index, 1, {
        ...course.modules[index],
        ...payload,
        id: editingModuleId
      });
    }
  } else {
    const newModule = {
      id: crypto.randomUUID(),
      order: course.modules.length + 1,
      ...payload
    };
    course.modules.push(newModule);
    selectedModuleId = newModule.id;
  }

  course.updatedAt = new Date().toISOString();
  saveState(state);
  resetModuleForm();
  renderCourses();
}

function handleAssessmentSubmit(event) {
  event.preventDefault();
  const course = getCourseById(selectedCourseId);
  if (!course) {
    alert("Sélectionnez d'abord une formation pour ajouter une évaluation.");
    return;
  }

  const payload = {
    title: assessmentTitleInput?.value.trim() ?? "",
    type: assessmentTypeSelect?.value || "Quiz",
    questionCount: assessmentQuestionsInput?.value
      ? Number(assessmentQuestionsInput.value)
      : null,
    passingScore: assessmentPassingInput?.value
      ? Number(assessmentPassingInput.value)
      : null
  };

  course.assessments = course.assessments ?? [];

  if (editingAssessmentId) {
    const index = course.assessments.findIndex((item) => item.id === editingAssessmentId);
    if (index !== -1) {
      course.assessments.splice(index, 1, {
        ...course.assessments[index],
        ...payload,
        id: editingAssessmentId
      });
    }
  } else {
    const newAssessment = {
      id: crypto.randomUUID(),
      ...payload
    };
    course.assessments.push(newAssessment);
  }

  course.updatedAt = new Date().toISOString();
  saveState(state);
  resetAssessmentForm();
  renderCourses();
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
      <td class="table-actions">
        <button
          class="icon-button"
          data-entity="group"
          data-action="edit"
          data-id="${group.id}"
          aria-label="Modifier ${group.name}"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          class="icon-button danger"
          data-entity="group"
          data-action="delete"
          data-id="${group.id}"
          aria-label="Supprimer ${group.name}"
          title="Supprimer"
        >
          🗑️
        </button>
      </td>
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
      <td class="table-actions">
        <button
          class="icon-button"
          data-entity="store"
          data-action="edit"
          data-id="${store.id}"
          aria-label="Modifier ${store.name}"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          class="icon-button danger"
          data-entity="store"
          data-action="delete"
          data-id="${store.id}"
          aria-label="Supprimer ${store.name}"
          title="Supprimer"
        >
          🗑️
        </button>
      </td>
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
      <td class="table-actions">
        <button
          class="icon-button"
          data-entity="user"
          data-action="edit"
          data-id="${user.id}"
          aria-label="Modifier ${user.firstName} ${user.lastName}"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          class="icon-button danger"
          data-entity="user"
          data-action="delete"
          data-id="${user.id}"
          aria-label="Supprimer ${user.firstName} ${user.lastName}"
          title="Supprimer"
        >
          🗑️
        </button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

function renderActivity() {
  activityFeed.innerHTML = "";
  const template = document.getElementById("timelineItemTemplate");
  const limit = dashboardRange <= 7 ? 5 : dashboardRange <= 30 ? 8 : 10;
  const items = state.activity
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  if (!items.length) {
    activityFeed.innerHTML = "<li class=\"muted\">Aucune activité récente pour cette période.</li>";
    return;
  }

  items.forEach((item) => {
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
  let groups = state.groups;
  if (dashboardGroupFilter?.value) {
    groups = groups.filter((group) => group.id === dashboardGroupFilter.value);
  }

  if (!groups.length) {
    groupProgress.innerHTML = "<p class=\"muted\">Aucun groupe à afficher pour cette sélection.</p>";
    return;
  }

  groups.forEach((group) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".progress-name").textContent = group.name;
    const learners = state.users.filter((user) => user.groupId === group.id).length;
    const assignmentLoad = group.courseIds?.length ?? 0;
    const base = 35 + assignmentLoad * 10 + learners * 4;
    const completion = Math.min(
      100,
      Math.round(base / 2 + seededValue(`${group.id}-${assignmentLoad}-${dashboardRange}`, 28))
    );
    fragment.querySelector(".progress-value").textContent = `${completion}% · ${assignmentLoad} formation(s)`;
    fragment.querySelector(".progress-fill").style.width = `${completion}%`;
    groupProgress.appendChild(fragment);
  });
}

function renderTopCourses() {
  if (!topCoursesList) {
    return;
  }
  topCoursesList.innerHTML = "";
  if (!state.courses.length) {
    topCoursesList.innerHTML = "<li class=\"muted\">Aucune formation disponible.</li>";
    return;
  }

  const ranking = state.courses
    .map((course) => {
      const groups = state.groups.filter((group) => group.courseIds?.includes(course.id));
      const learners = state.users.filter((user) => groups.some((group) => group.id === user.groupId)).length;
      const completion = Math.min(
        100,
        45 + seededValue(`${course.id}-${dashboardRange}-${dashboardFocus}`, 45)
      );
      const activityScore = groups.length * 12 + learners * 3 + completion;
      return { course, learners, groups: groups.length, completion, activityScore };
    })
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 5);

  topCoursesList.innerHTML = ranking
    .map(
      ({ course, learners, groups, completion }) => `
        <li>
          <div>
            <strong>${course.title}</strong>
            <span class="muted">${groups} groupe(s) · ${learners} apprenant(s)</span>
          </div>
          <span class="pulse-chart__value">${completion}%</span>
        </li>
      `
    )
    .join("");
}

function renderLearnerPulse() {
  if (!learnerPulse) {
    return;
  }
  learnerPulse.innerHTML = "";
  const segments =
    dashboardFocus === "stores"
      ? state.stores
      : dashboardFocus === "groups"
      ? state.groups
      : state.courses;

  if (!segments.length) {
    learnerPulse.innerHTML = "<p class=\"muted\">Aucune donnée à afficher.</p>";
    return;
  }

  const sample = segments.slice(0, Math.min(4, segments.length));
  const suffix = pulseMetric === "satisfaction" ? "% de satisfaction" : "% d'engagement";

  learnerPulse.innerHTML = sample
    .map((segment) => {
      const identifier = segment.id || segment.title;
      const value = Math.min(
        100,
        55 + seededValue(`${pulseMetric}-${identifier}-${dashboardRange}`, 40)
      );
      const label = segment.name ?? segment.title;
      return `
        <div class="pulse-chart__item">
          <span class="pulse-chart__label">${label}</span>
          <div class="pulse-chart__bar">
            <div class="pulse-chart__fill" style="width: ${value}%"></div>
          </div>
          <span class="pulse-chart__value">${value}${suffix ? " " + suffix : ""}</span>
        </div>
      `;
    })
    .join("");
}

function renderDashboardAlerts() {
  if (!dashboardAlerts) {
    return;
  }
  dashboardAlerts.innerHTML = "";
  const alerts = [];

  state.groups.forEach((group) => {
    const learners = state.users.filter((user) => user.groupId === group.id).length;
    const completion = Math.min(
      100,
      50 + seededValue(`${group.id}-${dashboardRange}-${pulseMetric}`, 40)
    );
    if (completion < 65) {
      alerts.push({
        priority: completion,
        title: `Relancer ${group.name}`,
        detail: `${completion}% de complétion sur ${learners} apprenant(s)`
      });
    }
  });

  state.courses.forEach((course) => {
    if (!course.modules?.length) {
      alerts.push({
        priority: 40,
        title: `Ajouter des modules à ${course.title}`,
        detail: "Le parcours n'est pas encore structuré."
      });
    } else if (!course.package) {
      alerts.push({
        priority: 55,
        title: `Importer le paquet SCORM pour ${course.title}`,
        detail: "Aucun fichier n'est associé à cette formation."
      });
    }
  });

  const limited = alerts.sort((a, b) => a.priority - b.priority).slice(0, 4);

  if (!limited.length) {
    dashboardAlerts.innerHTML = "<li class=\"muted\">Aucune alerte prioritaire.</li>";
    return;
  }

  dashboardAlerts.innerHTML = limited
    .map((alert) => `
      <li>
        <strong>${alert.title}</strong>
        <span>${alert.detail}</span>
      </li>
    `)
    .join("");
}

function renderTimeHeatmap() {
  if (!timeHeatmap) {
    return;
  }
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const periods = ["Matin", "Après-midi", "Soirée"];

  const rows = periods
    .map((period, rowIndex) => {
      const cells = days
        .map((day, colIndex) => {
          const value = 20 + seededValue(`${period}-${day}-${dashboardRange}-${colIndex}`, 75);
          const hotClass = value > 65 ? " is-hot" : "";
          return `<div class="heatmap__cell${hotClass}" data-value="${value}"></div>`;
        })
        .join("");
      return `
        <div class="heatmap__row">
          <span class="heatmap__label">${period}</span>
          <div class="heatmap__grid">${cells}</div>
        </div>
      `;
    })
    .join("");

  timeHeatmap.innerHTML = `${rows}<div class="heatmap__legend">${days
    .map((day) => `<span>${day}</span>`)
    .join("")}</div>`;
}

function renderReports() {
  if (!reportAssignments || !reportProgress || !reportSummary) {
    return;
  }

  let filteredGroups = state.groups;
  if (reportFilters.store) {
    filteredGroups = filteredGroups.filter((group) => group.storeId === reportFilters.store);
  }
  if (reportFilters.group) {
    filteredGroups = filteredGroups.filter((group) => group.id === reportFilters.group);
  }

  let filteredUsers = state.users;
  if (reportFilters.store) {
    filteredUsers = filteredUsers.filter((user) => user.storeId === reportFilters.store);
  }
  if (reportFilters.group) {
    filteredUsers = filteredUsers.filter((user) => user.groupId === reportFilters.group);
  }

  const activeCourseIds = new Set();
  filteredGroups.forEach((group) => (group.courseIds ?? []).forEach((id) => activeCourseIds.add(id)));

  let filteredCourses = state.courses.filter((course) =>
    activeCourseIds.size ? activeCourseIds.has(course.id) : true
  );

  const term = reportSearchTerm.trim().toLowerCase();
  if (term) {
    filteredGroups = filteredGroups.filter((group) =>
      group.name.toLowerCase().includes(term) ||
      (state.stores.find((store) => store.id === group.storeId)?.name.toLowerCase().includes(term) ?? false)
    );
    filteredUsers = filteredUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
    );
    filteredCourses = filteredCourses.filter((course) =>
      course.title.toLowerCase().includes(term) || (course.category ?? "").toLowerCase().includes(term)
    );
  }

  const assignmentsCount = filteredGroups.reduce(
    (total, group) => total + (group.courseIds?.length ?? 0),
    0
  );
  const completionScores = filteredUsers.map((user) =>
    Math.min(100, 35 + seededValue(`${user.id}-${reportPeriod}`, 65))
  );
  const averageScore = completionScores.length
    ? Math.round(completionScores.reduce((total, value) => total + value, 0) / completionScores.length)
    : 0;

  const summaryItems = [
    {
      label: "Apprenants actifs",
      value: filteredUsers.length,
      trend: computeTrend(`reports-users-${reportPeriod}`)
    },
    {
      label: "Formations assignées",
      value: assignmentsCount,
      trend: computeTrend(`reports-assignments-${reportPeriod}`)
    },
    {
      label: "Score moyen estimé",
      value: `${averageScore}%`,
      trend: averageScore - 70
    }
  ];

  reportSummary.innerHTML = summaryItems
    .map((item) => {
      const trendClass = item.trend < 0 ? "report-summary__trend negative" : "report-summary__trend";
      return `
        <div class="report-summary__row">
          <div>
            <span class="muted">${item.label}</span>
            <strong>${item.value}</strong>
          </div>
          <span class="${trendClass}">${trendLabel(item.trend)}</span>
        </div>
      `;
    })
    .join("");

  if (reportAssignments) {
    reportAssignments.innerHTML = "";
    if (!filteredGroups.length) {
      reportAssignments.innerHTML = "<p class=\"muted\">Aucun groupe correspondant.</p>";
    } else {
      filteredGroups.forEach((group) => {
        const store = state.stores.find((s) => s.id === group.storeId);
        const courses = (group.courseIds ?? [])
          .map((courseId) => state.courses.find((course) => course.id === courseId)?.title)
          .filter(Boolean);
        const completion = Math.min(
          100,
          45 + seededValue(`${group.id}-${reportPeriod}-${reportView}`, 45)
        );
        const card = document.createElement("div");
        card.className = "report-card";
        card.innerHTML = `
          <strong>${group.name}</strong>
          <span class="muted">${store ? store.name : "Sans magasin"}</span>
          <p>${courses.length ? courses.join(", ") : "Aucune formation assignée"}</p>
          <span class="badge">${completion}% de progression</span>
        `;
        reportAssignments.appendChild(card);
      });
    }
  }

  if (reportProgress) {
    reportProgress.innerHTML = "";
    if (!filteredUsers.length) {
      reportProgress.innerHTML = "<p class=\"muted\">Aucun collaborateur ne correspond au filtre.</p>";
    } else {
      filteredUsers.forEach((user) => {
        const completion = Math.min(
          100,
          35 + seededValue(`${user.id}-${reportPeriod}-${reportView}`, 65)
        );
        const courseCount = state.groups.find((group) => group.id === user.groupId)?.courseIds.length ?? 0;
        const card = document.createElement("div");
        card.className = "report-card";
        card.innerHTML = `
          <strong>${user.firstName} ${user.lastName}</strong>
          <span class="muted">${user.role}</span>
          <p>${courseCount} formation(s) assignée(s) · ${completion}% d'avancement estimé</p>
        `;
        reportProgress.appendChild(card);
      });
    }
  }

  if (reportAssessments) {
    reportAssessments.innerHTML = "";
    if (!filteredCourses.length) {
      reportAssessments.innerHTML = "<p class=\"muted\">Aucune formation à analyser.</p>";
    } else {
      filteredCourses.forEach((course) => {
        const assessments = course.assessments ?? [];
        const successRate = assessments.length
          ? Math.min(100, 60 + seededValue(`${course.id}-${reportPeriod}`, 35))
          : null;
        const card = document.createElement("div");
        card.className = "report-card";
        card.innerHTML = `
          <strong>${course.title}</strong>
          <span class="muted">${assessments.length} évaluation(s)</span>
          <p>${
            assessments.length
              ? `Score de réussite estimé : ${successRate}%`
              : "Aucune évaluation programmée"
          }</p>
        `;
        reportAssessments.appendChild(card);
      });
    }
  }

  reportPanels.forEach((panel) => {
    const view = panel.dataset.reportPanel;
    panel.classList.toggle("is-hidden", view && view !== reportView);
  });

  if (reportViewTabs) {
    Array.from(reportViewTabs.querySelectorAll(".chip")).forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.reportView === reportView);
    });
  }
}

function renderCategoryChart() {
  if (!categoryChart) {
    return;
  }
  categoryChart.innerHTML = "";
  if (!state.courses.length) {
    categoryChart.innerHTML = '<p class="muted">Aucune formation enregistrée.</p>';
    return;
  }

  const categories = state.courses.reduce((acc, course) => {
    const key = course.category?.trim() || "Non catégorisé";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, value]) => value));

  entries.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "chart-bar-row";
    row.innerHTML = `
      <span class="chart-bar-label">${label}</span>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" style="width: ${(value / maxValue) * 100}%"></div>
      </div>
      <span class="chart-bar-value">${value}</span>
    `;
    categoryChart.appendChild(row);
  });
}

function renderStoreEngagementChart() {
  if (!storeEngagementChart) {
    return;
  }
  storeEngagementChart.innerHTML = "";
  if (!state.stores.length) {
    storeEngagementChart.innerHTML = '<p class="muted">Aucun magasin enregistré.</p>';
    return;
  }

  state.stores.forEach((store) => {
    const storeGroups = state.groups.filter((group) => group.storeId === store.id);
    const learners = state.users.filter((user) => user.storeId === store.id).length;
    const assignments = storeGroups.reduce(
      (total, group) => total + (group.courseIds?.length ?? 0),
      0
    );
    const completionRate = storeGroups.length
      ? Math.min(
          100,
          25 + seededValue(`${store.id}-${assignments}-${learners}`, 70)
        )
      : seededValue(`${store.id}-baseline`, 35);

    const block = document.createElement("div");
    block.className = "chart-bar-row chart-bar-row--stacked";
    block.innerHTML = `
      <div class="chart-bar-header">
        <span class="chart-bar-label">${store.name}</span>
        <span class="chart-bar-value">${completionRate}%</span>
      </div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" style="width: ${completionRate}%"></div>
      </div>
      <div class="chart-bar-meta muted">${learners} apprenant(s) · ${assignments} formation(s) assignée(s)</div>
    `;
    storeEngagementChart.appendChild(block);
  });
}

function renderCompletionTrend() {
  if (!completionTrendChart) {
    return;
  }

  const now = new Date();
  const labels = [];
  const values = [];
  let summaryLabel = "";

  if (dashboardRange <= 7) {
    const days = Math.max(5, Math.min(7, dashboardRange));
    summaryLabel = `${days} jour${days > 1 ? "s" : ""}`;
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      labels.push(
        date.toLocaleDateString("fr-FR", {
          weekday: "short"
        })
      );
      const seedKey = `${date.toISOString().slice(0, 10)}-${state.users.length}-${state.courses.length}`;
      values.push(35 + seededValue(`${seedKey}-daily`, 55));
    }
  } else if (dashboardRange <= 90) {
    const weeks = Math.max(4, Math.min(8, Math.ceil(dashboardRange / 7)));
    summaryLabel = `${weeks} semaine${weeks > 1 ? "s" : ""}`;
    for (let offset = weeks - 1; offset >= 0; offset -= 1) {
      const start = new Date(now);
      start.setDate(start.getDate() - offset * 7);
      const { week, year } = getISOWeek(start);
      labels.push(`S${String(week).padStart(2, "0")}`);
      const seedKey = `${year}-W${week}-${state.users.length}-${state.courses.length}`;
      values.push(38 + seededValue(`${seedKey}-weekly`, 50));
    }
  } else {
    const months = Math.max(6, Math.min(12, Math.ceil(dashboardRange / 30)));
    summaryLabel = `${months} mois`;
    for (let offset = months - 1; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      labels.push(
        date.toLocaleDateString("fr-FR", {
          month: "short"
        })
      );
      const seedKey = `${date.getFullYear()}-${date.getMonth()}-${state.users.length}-${state.courses.length}`;
      values.push(40 + seededValue(`${seedKey}-monthly`, 45));
    }
  }

  const lastValue = values[values.length - 1] ?? 0;
  const average = values.length
    ? Math.round(values.reduce((total, value) => total + value, 0) / values.length)
    : 0;
  const maxValue = Math.max(100, ...values);
  const gradientId = `${completionTrendChart.id}-gradient`;

  const points = values.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * 100;
    const y = 95 - (value / maxValue) * 80;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  completionTrendChart.innerHTML = `
    <div class="chart-summary">
      <strong>${lastValue}% de complétion</strong>
      <span class="muted">Moyenne ${average}% sur ${summaryLabel}</span>
    </div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="trend-chart-svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--brand)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="var(--brand)" stop-opacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points="0,100 ${points.join(" ")} 100,100" fill="url(#${gradientId})"></polygon>
      <polyline points="${points.join(" ")}" class="trend-line"></polyline>
      ${points
        .map((point) => `<circle cx="${point.split(",")[0]}" cy="${point.split(",")[1]}" r="1.8" class="trend-dot"></circle>`)
        .join("")}
    </svg>
    <div class="chart-legend">
      ${labels.map((label) => `<span>${label}</span>`).join("")}
    </div>
  `;
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

  if (dashboardGroupFilter) {
    const previous = dashboardGroupFilter.value;
    dashboardGroupFilter.innerHTML = `<option value="">Tous les groupes</option>${groupOptions}`;
    dashboardGroupFilter.value = previous && state.groups.some((group) => group.id === previous) ? previous : "";
  }

  if (reportStoreFilter) {
    const previousStore = reportFilters.store;
    reportStoreFilter.innerHTML = `<option value="">Tous les magasins</option>${storeOptions}`;
    if (previousStore && state.stores.some((store) => store.id === previousStore)) {
      reportStoreFilter.value = previousStore;
    } else {
      reportFilters.store = "";
      reportStoreFilter.value = "";
    }
  }

  if (reportGroupFilter) {
    const availableGroups = reportFilters.store
      ? state.groups.filter((group) => group.storeId === reportFilters.store)
      : state.groups;
    const groupList = availableGroups
      .map((group) => `<option value="${group.id}">${group.name}</option>`)
      .join("");
    reportGroupFilter.innerHTML = `<option value="">Tous les groupes</option>${groupList}`;
    if (reportFilters.group && availableGroups.some((group) => group.id === reportFilters.group)) {
      reportGroupFilter.value = reportFilters.group;
    } else {
      reportFilters.group = "";
      reportGroupFilter.value = "";
    }
  }

  if (reportPeriodFilter) {
    reportPeriodFilter.value = String(reportPeriod);
  }
}

function startCourseEdit(id) {
  const course = state.courses.find((item) => item.id === id);
  if (!course) {
    return;
  }
  setFormActive("course", true);
  courseForm.classList.add("is-editing");
  courseCancelBtn?.classList.remove("hidden");
  if (courseIdInput) {
    courseIdInput.value = id;
  }
  document.getElementById("courseTitle").value = course.title ?? "";
  document.getElementById("courseCategory").value = course.category ?? "";
  document.getElementById("courseScorm").value = course.scormVersion ?? "1.2";
  document.getElementById("courseDuration").value = course.duration ?? "";
  document.getElementById("courseLaunchUrl").value = course.launchUrl ?? "";
  document.getElementById("courseDescription").value = course.description ?? "";
  if (courseSubmitBtn) {
    courseSubmitBtn.textContent = "Mettre à jour la formation";
  }
  scrollToForm(courseForm);
}

async function handleCourseSubmit(event) {
  event.preventDefault();
  const titleField = document.getElementById("courseTitle");
  const categoryField = document.getElementById("courseCategory");
  const scormField = document.getElementById("courseScorm");
  const durationField = document.getElementById("courseDuration");
  const launchField = document.getElementById("courseLaunchUrl");
  const descriptionField = document.getElementById("courseDescription");

  const payload = {
    title: titleField?.value.trim() ?? "",
    category: categoryField?.value.trim() || "",
    scormVersion: scormField?.value || "1.2",
    duration: durationField?.value ? Number(durationField.value) : null,
    launchUrl: launchField?.value.trim() || "",
    description: descriptionField?.value.trim() || ""
  };

  const existingId = courseIdInput?.value;
  const file = coursePackageInput?.files?.[0];
  let packagePayload = null;

  if (file) {
    if (file.size > MAX_SCORM_SIZE) {
      alert("Le fichier SCORM dépasse la taille maximale autorisée (20 Mo) pour cette démonstration.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      packagePayload = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
        dataUrl
      };
    } catch (error) {
      console.error("Impossible de lire le fichier SCORM", error);
      alert("Le fichier SCORM n'a pas pu être chargé. Merci de réessayer.");
      return;
    }
  }

  if (existingId) {
    const index = state.courses.findIndex((item) => item.id === existingId);
    if (index !== -1) {
      const previous = state.courses[index];
      const updatedCourse = {
        ...previous,
        ...payload,
        id: existingId,
        modules: previous.modules ?? [],
        assessments: previous.assessments ?? [],
        package: packagePayload ?? previous.package ?? null,
        updatedAt: new Date().toISOString()
      };
      state.courses.splice(index, 1, updatedCourse);
      state.activity.push(
        logActivity(
          "Mise à jour formation",
          `${getActorName()} a mis à jour ${updatedCourse.title}`
        )
      );
    }
  } else {
    const newCourse = {
      id: crypto.randomUUID(),
      ...payload,
      modules: [],
      assessments: [],
      package: packagePayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.courses.push(newCourse);
    selectedCourseId = newCourse.id;
    state.activity.push(
      logActivity("Nouvelle formation", `${getActorName()} a ajouté ${newCourse.title}`)
    );
  }

  if (coursePackageInput) {
    coursePackageInput.value = "";
  }

  saveState(state);
  renderEverything();
  resetCourseForm();
}

function deleteCourse(id) {
  const course = state.courses.find((item) => item.id === id);
  if (!course) {
    return;
  }
  if (!confirm(`Supprimer la formation « ${course.title} » ?`)) {
    return;
  }
  state.courses = state.courses.filter((item) => item.id !== id);
  state.groups.forEach((group) => {
    group.courseIds = (group.courseIds ?? []).filter((courseId) => courseId !== id);
  });
  state.activity.push(
    logActivity("Suppression formation", `${getActorName()} a supprimé ${course.title}`)
  );
  saveState(state);
  if (courseIdInput?.value === id) {
    resetCourseForm(true);
  }
  if (selectedCourseId === id) {
    selectedCourseId = null;
  }
  renderEverything();
}

function startGroupEdit(id) {
  const group = state.groups.find((item) => item.id === id);
  if (!group) {
    return;
  }
  setFormActive("group", true);
  groupForm.classList.add("is-editing");
  groupCancelBtn?.classList.remove("hidden");
  if (groupIdInput) {
    groupIdInput.value = id;
  }
  document.getElementById("groupName").value = group.name ?? "";
  document.getElementById("groupStore").value = group.storeId ?? "";
  document.getElementById("groupDescription").value = group.description ?? "";
  const selectedCourseIds = group.courseIds ?? [];
  Array.from(groupCoursesSelect?.options ?? []).forEach((option) => {
    option.selected = selectedCourseIds.includes(option.value);
  });
  if (groupSubmitBtn) {
    groupSubmitBtn.textContent = "Mettre à jour le groupe";
  }
  scrollToForm(groupForm);
}

function handleGroupSubmit(event) {
  event.preventDefault();
  const nameField = document.getElementById("groupName");
  const storeField = document.getElementById("groupStore");
  const descriptionField = document.getElementById("groupDescription");
  const selectedCourseIds = Array.from(groupCoursesSelect?.selectedOptions ?? []).map(
    (option) => option.value
  );

  const payload = {
    name: nameField?.value.trim() ?? "",
    storeId: storeField?.value || null,
    description: descriptionField?.value.trim() || "",
    courseIds: selectedCourseIds
  };

  const existingId = groupIdInput?.value;

  if (existingId) {
    const index = state.groups.findIndex((item) => item.id === existingId);
    if (index !== -1) {
      const updatedGroup = { ...state.groups[index], ...payload, id: existingId };
      state.groups.splice(index, 1, updatedGroup);
      state.activity.push(
        logActivity("Mise à jour groupe", `${getActorName()} a mis à jour ${updatedGroup.name}`)
      );
    }
  } else {
    const newGroup = { id: crypto.randomUUID(), ...payload };
    state.groups.push(newGroup);
    state.activity.push(
      logActivity("Nouveau groupe", `${getActorName()} a créé le groupe ${newGroup.name}`)
    );
  }

  saveState(state);
  renderEverything();
  resetGroupForm();
}

function deleteGroup(id) {
  const group = state.groups.find((item) => item.id === id);
  if (!group) {
    return;
  }
  if (!confirm(`Supprimer le groupe « ${group.name} » ?`)) {
    return;
  }
  state.groups = state.groups.filter((item) => item.id !== id);
  state.users.forEach((user) => {
    if (user.groupId === id) {
      user.groupId = null;
    }
  });
  state.activity.push(
    logActivity("Suppression groupe", `${getActorName()} a supprimé ${group.name}`)
  );
  saveState(state);
  if (groupIdInput?.value === id) {
    resetGroupForm(true);
  }
  renderEverything();
}

function startStoreEdit(id) {
  const store = state.stores.find((item) => item.id === id);
  if (!store) {
    return;
  }
  setFormActive("store", true);
  storeForm.classList.add("is-editing");
  storeCancelBtn?.classList.remove("hidden");
  if (storeIdInput) {
    storeIdInput.value = id;
  }
  document.getElementById("storeName").value = store.name ?? "";
  document.getElementById("storeCity").value = store.city ?? "";
  document.getElementById("storeManager").value = store.manager ?? "";
  document.getElementById("storeNotes").value = store.notes ?? "";
  if (storeSubmitBtn) {
    storeSubmitBtn.textContent = "Mettre à jour le magasin";
  }
  scrollToForm(storeForm);
}

function handleStoreSubmit(event) {
  event.preventDefault();
  const nameField = document.getElementById("storeName");
  const cityField = document.getElementById("storeCity");
  const managerField = document.getElementById("storeManager");
  const notesField = document.getElementById("storeNotes");

  const payload = {
    name: nameField?.value.trim() ?? "",
    city: cityField?.value.trim() || "",
    manager: managerField?.value.trim() || "",
    notes: notesField?.value.trim() || ""
  };

  const existingId = storeIdInput?.value;

  if (existingId) {
    const index = state.stores.findIndex((item) => item.id === existingId);
    if (index !== -1) {
      const updatedStore = { ...state.stores[index], ...payload, id: existingId };
      state.stores.splice(index, 1, updatedStore);
      state.activity.push(
        logActivity("Mise à jour magasin", `${getActorName()} a mis à jour ${updatedStore.name}`)
      );
    }
  } else {
    const newStore = { id: crypto.randomUUID(), ...payload };
    state.stores.push(newStore);
    state.activity.push(
      logActivity("Nouveau magasin", `${getActorName()} a ajouté ${newStore.name}`)
    );
  }

  saveState(state);
  renderEverything();
  resetStoreForm();
}

function deleteStore(id) {
  const store = state.stores.find((item) => item.id === id);
  if (!store) {
    return;
  }
  if (!confirm(`Supprimer le magasin « ${store.name} » ?`)) {
    return;
  }
  state.stores = state.stores.filter((item) => item.id !== id);
  state.groups.forEach((group) => {
    if (group.storeId === id) {
      group.storeId = null;
    }
  });
  state.users.forEach((user) => {
    if (user.storeId === id) {
      user.storeId = null;
    }
  });
  state.activity.push(
    logActivity("Suppression magasin", `${getActorName()} a supprimé ${store.name}`)
  );
  saveState(state);
  if (storeIdInput?.value === id) {
    resetStoreForm(true);
  }
  renderEverything();
}

function startUserEdit(id) {
  const user = state.users.find((item) => item.id === id);
  if (!user) {
    return;
  }
  setFormActive("user", true);
  userForm.classList.add("is-editing");
  userCancelBtn?.classList.remove("hidden");
  if (userIdInput) {
    userIdInput.value = id;
  }
  document.getElementById("userFirstName").value = user.firstName ?? "";
  document.getElementById("userLastName").value = user.lastName ?? "";
  document.getElementById("userEmail").value = user.email ?? "";
  document.getElementById("userRole").value = user.role ?? "Apprenant";
  document.getElementById("userPassword").value = user.password ?? "";
  document.getElementById("userStore").value = user.storeId ?? "";
  document.getElementById("userGroup").value = user.groupId ?? "";
  if (userSubmitBtn) {
    userSubmitBtn.textContent = "Mettre à jour l'utilisateur";
  }
  scrollToForm(userForm);
}

function handleUserSubmit(event) {
  event.preventDefault();
  const firstNameField = document.getElementById("userFirstName");
  const lastNameField = document.getElementById("userLastName");
  const emailField = document.getElementById("userEmail");
  const roleField = document.getElementById("userRole");
  const passwordField = document.getElementById("userPassword");
  const storeField = document.getElementById("userStore");
  const groupField = document.getElementById("userGroup");

  const payload = {
    firstName: firstNameField?.value.trim() ?? "",
    lastName: lastNameField?.value.trim() ?? "",
    email: emailField?.value.trim() ?? "",
    role: roleField?.value || "Apprenant",
    password: passwordField?.value ?? "",
    storeId: storeField?.value || null,
    groupId: groupField?.value || null
  };

  const existingId = userIdInput?.value;
  const duplicate = state.users.find(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase() && user.id !== existingId
  );
  if (duplicate) {
    alert("Un utilisateur avec cette adresse e-mail existe déjà dans la plateforme.");
    return;
  }

  if (existingId) {
    const index = state.users.findIndex((item) => item.id === existingId);
    if (index !== -1) {
      const updatedUser = { ...state.users[index], ...payload, id: existingId };
      state.users.splice(index, 1, updatedUser);
      state.activity.push(
        logActivity(
          "Mise à jour utilisateur",
          `${getActorName()} a mis à jour ${updatedUser.firstName} ${updatedUser.lastName}`
        )
      );
      if (currentUser?.id === existingId) {
        currentUser = updatedUser;
        activeUserChip.textContent = `${updatedUser.firstName} ${updatedUser.lastName} · ${updatedUser.role}`;
      }
    }
  } else {
    const newUser = { id: crypto.randomUUID(), ...payload };
    state.users.push(newUser);
    state.activity.push(
      logActivity(
        "Nouvel utilisateur",
        `${getActorName()} a créé le profil ${newUser.firstName} ${newUser.lastName}`
      )
    );
  }

  saveState(state);
  renderEverything();
  resetUserForm();
}

function deleteUser(id) {
  const user = state.users.find((item) => item.id === id);
  if (!user) {
    return;
  }
  if (!confirm(`Supprimer le profil ${user.firstName} ${user.lastName} ?`)) {
    return;
  }
  state.users = state.users.filter((item) => item.id !== id);
  state.activity.push(
    logActivity(
      "Suppression utilisateur",
      `${getActorName()} a supprimé ${user.firstName} ${user.lastName}`
    )
  );
  const deletingSelf = currentUser?.id === id;
  saveState(state);
  if (userIdInput?.value === id) {
    resetUserForm(true);
  }
  if (deletingSelf) {
    currentUser = null;
    authScreen.classList.remove("hidden");
    appShell.classList.add("hidden");
  }
  renderEverything();
  if (deletingSelf) {
    alert("Votre compte a été supprimé. Vous êtes déconnecté.");
  }
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

courseForm.addEventListener("submit", (event) => {
  handleCourseSubmit(event);
});
groupForm.addEventListener("submit", handleGroupSubmit);
storeForm.addEventListener("submit", handleStoreSubmit);
userForm.addEventListener("submit", handleUserSubmit);
moduleForm?.addEventListener("submit", handleModuleSubmit);
assessmentForm?.addEventListener("submit", handleAssessmentSubmit);

coursesTable?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-entity][data-action]");
  if (button) {
    return;
  }
  const row = event.target.closest("tr[data-course-id]");
  if (!row) {
    return;
  }
  selectedCourseId = row.dataset.courseId;
  renderCourses();
});

coursePreviewBtn?.addEventListener("click", () => {
  const course = getCourseById(selectedCourseId);
  if (course) {
    renderLearnerPreview(course);
  }
});

courseEditBtn?.addEventListener("click", () => {
  if (selectedCourseId) {
    startCourseEdit(selectedCourseId);
  }
});

globalSearch.addEventListener("input", handleSearch);

dashboardRangeChips?.addEventListener("click", (event) => {
  const chip = event.target.closest("button[data-range]");
  if (!chip) {
    return;
  }
  dashboardRange = Number(chip.dataset.range);
  Array.from(dashboardRangeChips.querySelectorAll(".chip")).forEach((button) => {
    button.classList.toggle("active", button === chip);
  });
  renderEverything();
});

dashboardFocusChips?.addEventListener("click", (event) => {
  const chip = event.target.closest("button[data-focus]");
  if (!chip) {
    return;
  }
  dashboardFocus = chip.dataset.focus || "global";
  Array.from(dashboardFocusChips.querySelectorAll(".chip")).forEach((button) => {
    button.classList.toggle("active", button === chip);
  });
  renderEverything();
});

dashboardPulseToggle?.addEventListener("click", (event) => {
  const chip = event.target.closest("button[data-pulse]");
  if (!chip) {
    return;
  }
  pulseMetric = chip.dataset.pulse || "engagement";
  Array.from(dashboardPulseToggle.querySelectorAll(".chip")).forEach((button) => {
    button.classList.toggle("active", button === chip);
  });
  renderLearnerPulse();
});

dashboardGroupFilter?.addEventListener("change", () => {
  renderProgress();
});

activityRefreshBtn?.addEventListener("click", () => {
  state.activity.unshift(
    logActivity("Actualisation", `${getActorName()} a actualisé le tableau de bord`, new Date().toISOString())
  );
  state.activity = state.activity.slice(0, 30);
  saveState(state);
  renderActivity();
  renderDashboardAlerts();
});

reportViewTabs?.addEventListener("click", (event) => {
  const chip = event.target.closest("button[data-report-view]");
  if (!chip) {
    return;
  }
  reportView = chip.dataset.reportView || "assignments";
  renderReports();
});

reportStoreFilter?.addEventListener("change", (event) => {
  reportFilters.store = event.target.value;
  reportFilters.group = "";
  updateSelectors();
  renderReports();
});

reportGroupFilter?.addEventListener("change", (event) => {
  reportFilters.group = event.target.value;
  renderReports();
});

reportPeriodFilter?.addEventListener("change", (event) => {
  reportPeriod = Number(event.target.value) || 30;
  renderReports();
});

reportSearchInput?.addEventListener("input", (event) => {
  reportSearchTerm = event.target.value;
  renderReports();
});

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
  document.documentElement.style.setProperty("--brand", state.preferences.brandColor);
  document.documentElement.style.setProperty("--brand-dark", state.preferences.brandColor);
  ensureCourseSelection();
  renderStats();
  updateSelectors();
  renderCourses();
  renderGroups();
  renderStores();
  renderUsers();
  renderActivity();
  renderProgress();
  renderTopCourses();
  renderLearnerPulse();
  renderDashboardAlerts();
  renderTimeHeatmap();
  renderReports();
  renderCategoryChart();
  renderStoreEngagementChart();
  renderCompletionTrend();
}

renderEverything();
