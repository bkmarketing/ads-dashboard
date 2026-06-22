const CONFIG = {
  BACKEND_BASE_URL: "https://adsdash-worker.adsdash.workers.dev",
  DASHBOARD_REFRESH_MS: 180000
};

const STORAGE_KEYS = {
  activeProfileId: "adsdash_active_profile_id",
  logoutRequested: "adsdash_logout_requested",
  sessionToken: "adsdash_session_token"
};
const REFRESH_ACCOUNTS_OPTION_VALUE = "__refresh_accounts__";
const ACCOUNT_PLACEHOLDER_VALUE = "";

const EMPTY_IMAGE_SRC = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const COLORS = ["#a8c441", "#c8e05a", "#7fa832", "#e8f091", "#5a7820"];
const MONTH_NAMES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const WEEKDAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const OBJECTIVE_OPTIONS = [
  { id: "purchase", label: "Compras" },
  { id: "message", label: "WhatsApp" },
  { id: "lead", label: "Leads" }
];

const OBJECTIVE_CONFIGS = {
  purchase: {
    resultLabel: "Compras",
    resultKey: "purchases",
    resultFormatter: value => fmtNum(value),
    costLabel: "Custo por compra",
    costValue: data => `R$ ${fmtMoney(data.cpp)}`,
    metricPrimaryLabel: "ROAS TOTAL",
    metricPrimaryValue: data => Number(data.roas || 0).toFixed(2),
    metricPrimaryDelta: "",
    metricPrimaryColor: "var(--accent)",
    metricPrimaryBar: data => `${Math.min((Number(data.roas || 0) / 5) * 100, 100)}%`,
    metricSecondaryLabel: "Valor de conversao",
    metricSecondaryValue: data => `R$ ${fmtMoney(data.convValue)}`,
    metricSecondaryDelta: "",
    funnelSteps: data => [
      { label: "Impressoes", value: data.impressions },
      { label: "Cliques de links", value: Math.round(data.impressions * ((data.ctr || 0) / 100) || data.impressions * 0.0026) },
      { label: "Adicao de Carrinho", value: data.addToCart },
      { label: "Compras", value: data.purchases }
    ],
    bottomMetrics: data => [
      { label: "Custo Add Carrinho", value: `R$ ${fmtMoney(data.addToCart > 0 ? data.spend / data.addToCart : 0)}` },
      { label: "Custo/Compra", value: `R$ ${fmtMoney(data.cpp)}` },
      { label: "CPM", value: `R$ ${fmtMoney(data.cpm)}` }
    ],
    chartTitle: "Add Carrinho vs Compras",
    chartPrimaryLabel: "Adicao de Carrinho",
    chartPrimaryKey: "addToCart",
    chartSecondaryLabel: "Compras",
    chartSecondaryKey: "purchases",
    donutTitle: "Melhores Anuncios (Conversoes)",
    donutMetricKey: "purchases",
    donutMetricLabel: "Compras",
    tableAssistHeader: "Add Carrinho",
    tableAssistKey: "addToCart",
    tableMainHeader: "Compras",
    tableMainKey: "purchases",
    tableLastHeader: "ROAS",
    tableLastValue: item => `${Number(item.roas || 0).toFixed(2)}x`,
    creativeAssistLabel: "Carrinho",
    creativeAssistKey: "addToCart",
    creativeMainLabel: "Compras",
    creativeMainKey: "purchases",
    creativeExtraLabel: "Cliques",
    creativeExtraKey: "clicks"
  },
  message: {
    resultLabel: "Contatos por mensagem",
    resultKey: "messages",
    resultFormatter: value => fmtNum(value),
    costLabel: "Custo por mensagem",
    costValue: data => `R$ ${fmtMoney(data.cpmessage)}`,
    metricPrimaryLabel: "CLIQUES",
    metricPrimaryValue: data => fmtNum(data.clicks),
    metricPrimaryDelta: "",
    metricPrimaryColor: "var(--text)",
    metricPrimaryBar: () => "0%",
    metricSecondaryLabel: "CTR geral",
    metricSecondaryValue: data => `${Number(data.ctr || 0).toFixed(2)}%`,
    metricSecondaryDelta: "",
    funnelSteps: data => [
      { label: "Impressoes", value: data.impressions },
      { label: "Alcance", value: data.reach },
      { label: "Cliques", value: data.clicks },
      { label: "Mensagens", value: data.messages }
    ],
    bottomMetrics: data => [
      { label: "Custo por clique", value: `R$ ${fmtMoney(data.clicks > 0 ? data.spend / data.clicks : 0)}` },
      { label: "Custo/Resultado", value: `R$ ${fmtMoney(data.cpmessage)}` },
      { label: "CTR", value: `${Number(data.ctr || 0).toFixed(2)}%` }
    ],
    chartTitle: "Cliques vs Mensagens",
    chartPrimaryLabel: "Cliques",
    chartPrimaryKey: "clicks",
    chartSecondaryLabel: "Mensagens",
    chartSecondaryKey: "messages",
    donutTitle: "Melhores Anuncios (Mensagens)",
    donutMetricKey: "messages",
    donutMetricLabel: "Mensagens",
    tableAssistHeader: "Cliques",
    tableAssistKey: "clicks",
    tableMainHeader: "Mensagens",
    tableMainKey: "messages",
    tableLastHeader: "Custo/Resultado",
    tableLastValue: item => `R$ ${fmtMoney(item.cpmessage)}`,
    creativeAssistLabel: "Cliques",
    creativeAssistKey: "clicks",
    creativeMainLabel: "Mensagens",
    creativeMainKey: "messages",
    creativeExtraLabel: "Impressoes",
    creativeExtraKey: "impressions"
  },
  lead: {
    resultLabel: "Leads de formulario",
    resultKey: "leads",
    resultFormatter: value => fmtNum(value),
    costLabel: "Custo por lead",
    costValue: data => `R$ ${fmtMoney(data.cpl)}`,
    metricPrimaryLabel: "CLIQUES",
    metricPrimaryValue: data => fmtNum(data.clicks),
    metricPrimaryDelta: "",
    metricPrimaryColor: "var(--text)",
    metricPrimaryBar: () => "0%",
    metricSecondaryLabel: "CTR geral",
    metricSecondaryValue: data => `${Number(data.ctr || 0).toFixed(2)}%`,
    metricSecondaryDelta: "",
    funnelSteps: data => [
      { label: "Impressoes", value: data.impressions },
      { label: "Alcance", value: data.reach },
      { label: "Cliques", value: data.clicks },
      { label: "Leads", value: data.leads }
    ],
    bottomMetrics: data => [
      { label: "Custo por clique", value: `R$ ${fmtMoney(data.clicks > 0 ? data.spend / data.clicks : 0)}` },
      { label: "Custo/Resultado", value: `R$ ${fmtMoney(data.cpl)}` },
      { label: "CTR", value: `${Number(data.ctr || 0).toFixed(2)}%` }
    ],
    chartTitle: "Cliques vs Leads",
    chartPrimaryLabel: "Cliques",
    chartPrimaryKey: "clicks",
    chartSecondaryLabel: "Leads",
    chartSecondaryKey: "leads",
    donutTitle: "Melhores Anuncios (Leads)",
    donutMetricKey: "leads",
    donutMetricLabel: "Leads",
    tableAssistHeader: "Cliques",
    tableAssistKey: "clicks",
    tableMainHeader: "Leads",
    tableMainKey: "leads",
    tableLastHeader: "Custo/Resultado",
    tableLastValue: item => `R$ ${fmtMoney(item.cpl)}`,
    creativeAssistLabel: "Cliques",
    creativeAssistKey: "clicks",
    creativeMainLabel: "Leads",
    creativeMainKey: "leads",
    creativeExtraLabel: "Impressoes",
    creativeExtraKey: "impressions"
  }
};

function createInitialState() {
  return {
    isAdmin: false,
    isMasterAdmin: false,
    isClientView: false,
    clientName: "",
    adminUser: "",
    adminProfile: { company: "", name: "", phone: "", email: "" },
    isEditingAdminProfile: true,
    profiles: [],
    clients: [],
    adminUsers: [],
    accountBindings: {},
    lastGeneratedInviteToken: "",
    activeProfileId: "",
    editingProfileId: "",
    editingClientId: "",
    adAccounts: [],
    adAccountsDiagnostics: null,
    selectedAccount: "",
    lockedAccountId: "",
    currentShareId: "",
    selectedOverviewMetric: "thruplay",
    selectedObjectiveType: "purchase",
    currentOverviewMetrics: {},
    campaigns: [],
    creatives: [],
    charts: {},
    lastDashboardData: null,
    datePickerBaseMonth: "",
    datePickerSelectionAnchor: "",
    datePickerDraftStart: "",
    datePickerDraftEnd: "",
    lockedObjectiveType: ""
  };
}

let state = createInitialState();
let lastMobileScrollY = 0;
let mobileBannerFrameId = 0;
let dashboardRefreshTimer = null;
let currentLoadRequestId = 0;
let isLoadInProgress = false;
let currentDashboardAbortController = null;
let skipChartAnimationOnNextRender = false;
let chartLibraryPromise = null;
let currentChartRenderRequestId = 0;

function getBackendBaseUrl() {
  return String(CONFIG.BACKEND_BASE_URL || "").replace(/\/+$/, "");
}

function getSavedActiveProfileId() {
  return sessionStorage.getItem(STORAGE_KEYS.activeProfileId) || "";
}

function setSavedActiveProfileId(profileId) {
  if (profileId) {
    sessionStorage.setItem(STORAGE_KEYS.activeProfileId, profileId);
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.activeProfileId);
  }
}

function markLogoutRequested() {
  sessionStorage.setItem(STORAGE_KEYS.logoutRequested, "1");
}

function clearLogoutRequested() {
  sessionStorage.removeItem(STORAGE_KEYS.logoutRequested);
}

function hasLogoutRequested() {
  return sessionStorage.getItem(STORAGE_KEYS.logoutRequested) === "1";
}

function getSavedSessionToken() {
  return sessionStorage.getItem(STORAGE_KEYS.sessionToken) || "";
}

function setSavedSessionToken(token) {
  if (token) {
    sessionStorage.setItem(STORAGE_KEYS.sessionToken, token);
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.sessionToken);
  }
}

async function apiRequest(path, options = {}) {
  const { method = "GET", body } = options;
  const headers = new Headers(options.headers || {});
  const sessionToken = getSavedSessionToken();

  if (options.auth !== false && sessionToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${sessionToken}`);
  }

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    signal: options.signal
  });

  const contentType = response.headers.get("Content-Type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok || (data && data.ok === false)) {
    const error = new Error(data?.error || "Erro ao processar a requisicao.");
    error.status = response.status;
    error.code = data?.code || "";
    throw error;
  }

  return data;
}

async function ensureChartLibrary() {
  if (typeof window.Chart === "function") {
    return window.Chart;
  }

  if (chartLibraryPromise) {
    return chartLibraryPromise;
  }

  chartLibraryPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-chartjs="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Chart), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Nao foi possivel carregar os graficos.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.defer = true;
    script.dataset.chartjs = "true";
    script.onload = () => resolve(window.Chart);
    script.onerror = () => reject(new Error("Nao foi possivel carregar os graficos."));
    document.head.appendChild(script);
  }).catch(error => {
    chartLibraryPromise = null;
    throw error;
  });

  return chartLibraryPromise;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatBR(dateValue) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${dateValue}T12:00:00`));
}

function isDisplayPlaceholder(value) {
  const normalized = String(value || "").trim();
  return !normalized || normalized === "—" || normalized === "â€”" || normalized === "Ã¢â‚¬â€";
}

function parseInputDate(dateValue) {
  if (!dateValue) return null;
  const [year, month, day] = dateValue.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12, 0, 0, 0);
}

function isSameDay(left, right) {
  return Boolean(left && right) && formatDate(left) === formatDate(right);
}

function isDateBetween(target, start, end) {
  if (!target || !start || !end) return false;
  const targetValue = target.getTime();
  return targetValue >= start.getTime() && targetValue <= end.getTime();
}

function getUrlParams() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  if (params.has("id")) {
    return {
      type: "client-share-id",
      shareId: params.get("id") || ""
    };
  }

  if (params.has("a") || params.has("c") || params.has("t")) {
    return { type: "legacy-client-link" };
  }

  return null;
}

function buildClientLinkFromShareId(shareId) {
  return `${window.location.origin}${window.location.pathname}#id=${encodeURIComponent(shareId)}`;
}

async function resolveClientShare(shareId) {
  const data = await apiRequest(`/share/${encodeURIComponent(shareId)}`, { auth: false });
  return data?.data || null;
}

function getPresetRange(preset) {
  const end = new Date();
  end.setHours(12, 0, 0, 0);
  const start = new Date(end);

  if (preset === "today") return { start, end };
  if (preset === "yesterdayToday") {
    start.setDate(end.getDate() - 1);
    return { start, end };
  }
  if (preset === "last30") {
    start.setDate(end.getDate() - 29);
    return { start, end };
  }
  if (preset === "thisMonth") {
    return {
      start: new Date(end.getFullYear(), end.getMonth(), 1, 12, 0, 0, 0),
      end
    };
  }

  start.setDate(end.getDate() - 6);
  return { start, end };
}

function setDateRange(startId, endId, start, end) {
  const startValue = formatDate(start);
  const endValue = formatDate(end);
  document.getElementById(startId).value = startValue;
  document.getElementById(endId).value = endValue;
  state.datePickerSelectionAnchor = "";
  state.datePickerDraftStart = startValue;
  state.datePickerDraftEnd = endValue;
  syncDateRangeDisplay();
  renderDateRangePicker();
}

function applyDatePreset(preset, shouldLoad = false) {
  document.getElementById("range-preset").value = preset;
  if (preset === "custom") {
    if (shouldLoad) loadData();
    return;
  }

  const { start, end } = getPresetRange(preset);
  setDateRange("date-start", "date-end", start, end);
  if (shouldLoad) {
    closeDateRangePicker();
    loadData();
  }
}

function applyShareDatePreset(preset) {
  if (preset === "custom") return;
  const { start, end } = getPresetRange(preset);
  setDateRange("share-date-start", "share-date-end", start, end);
  syncShareDateInputs();
}

function handleManualDateChange() {
  document.getElementById("range-preset").value = "custom";
  state.datePickerSelectionAnchor = "";
  state.datePickerDraftStart = document.getElementById("date-start")?.value || "";
  state.datePickerDraftEnd = document.getElementById("date-end")?.value || "";
  syncDateRangeDisplay();
  renderDateRangePicker();
  loadData();
}

function handleManualShareDateChange() {
  syncShareDateInputs();
  document.getElementById("share-range-preset").value = "custom";
}

function handleShareObjectiveChange(objectiveType) {
  const shareSelect = document.getElementById("share-account-select");
  if (!shareSelect) return;
  const currentValue = shareSelect.value;

  shareSelect.innerHTML = '<option value="">Selecione...</option>';
  state.adAccounts.forEach(account => {
    shareSelect.add(new Option(account.name, account.id));
  });

  if (currentValue && state.adAccounts.some(account => account.id === currentValue)) {
    shareSelect.value = currentValue;
  }
}

function syncShareDateInputs() {
  const today = formatDate(new Date());
  const startInput = document.getElementById("share-date-start");
  const endInput = document.getElementById("share-date-end");
  if (!startInput || !endInput) return;

  startInput.max = today;
  endInput.max = today;

  if (startInput.value && startInput.value > today) {
    startInput.value = today;
  }
  if (endInput.value && endInput.value > today) {
    endInput.value = today;
  }
}

function syncDateRangeDisplay() {
  const start = state.datePickerDraftStart || document.getElementById("date-start")?.value || "";
  const end = state.datePickerDraftEnd || document.getElementById("date-end")?.value || "";
  const rangeLabel = document.getElementById("date-range-label");
  const panelSummary = document.getElementById("date-range-panel-summary");
  const anchor = state.datePickerSelectionAnchor;
  const isMobile = window.innerWidth <= 768;

  const formatCompactDate = value => {
    const parsed = parseInputDate(value);
    if (!parsed) return "--/--";
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  let label = "--/--/----";
  if (start && end) {
    label = isMobile
      ? `${formatCompactDate(start)} a ${formatCompactDate(end)}`
      : `${formatBR(start)} a ${formatBR(end)}`;
  } else if (start) {
    label = isMobile
      ? `${formatCompactDate(start)} a ...`
      : `${formatBR(start)} a ...`;
  }

  if (rangeLabel) rangeLabel.textContent = label;
  if (panelSummary) {
    if (start && end) {
      panelSummary.textContent = `${formatBR(start)} a ${formatBR(end)}`;
    } else if (anchor && start) {
      panelSummary.textContent = `Inicio: ${formatBR(start)} • selecione a data final`;
    } else {
      panelSummary.textContent = "Selecione a data inicial";
    }
  }
}

function toggleDateRangePicker() {
  const picker = document.getElementById("date-range-picker");
  if (!picker) return;

  const willOpen = !picker.classList.contains("open");
  picker.classList.toggle("open");

  if (willOpen) {
    initializeDateRangePicker();
    renderDateRangePicker();
  } else {
    state.datePickerSelectionAnchor = "";
  }
}

function closeDateRangePicker() {
  document.getElementById("date-range-picker")?.classList.remove("open");
  state.datePickerSelectionAnchor = "";
  state.datePickerDraftStart = "";
  state.datePickerDraftEnd = "";
}

function initializeDateRangePicker() {
  const startValue = document.getElementById("date-start")?.value || "";
  const endValue = document.getElementById("date-end")?.value || "";
  const start = parseInputDate(startValue);
  const end = parseInputDate(endValue);
  const base = startOfMonth(start || end || new Date());
  state.datePickerBaseMonth = formatDate(base);
  state.datePickerSelectionAnchor = "";
  state.datePickerDraftStart = startValue;
  state.datePickerDraftEnd = endValue;
  renderDateWeekdays();
}

function renderDateWeekdays() {
  ["date-weekdays-left"].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = WEEKDAY_NAMES.map(day => `<div class="date-weekday">${day}</div>`).join("");
  });

  const rightWeekdays = document.getElementById("date-weekdays-right");
  if (rightWeekdays) rightWeekdays.innerHTML = "";
}

function renderDateRangePicker() {
  const leftBase = parseInputDate(state.datePickerBaseMonth) || startOfMonth(new Date());
  renderDateMonthControls("left", leftBase);
  renderDateMonthGrid("date-grid-left", leftBase);
  const rightMonth = document.getElementById("date-month-right");
  const rightYear = document.getElementById("date-year-right");
  const rightGrid = document.getElementById("date-grid-right");
  const rightWeekdays = document.getElementById("date-weekdays-right");
  if (rightMonth) rightMonth.innerHTML = "";
  if (rightYear) rightYear.innerHTML = "";
  if (rightGrid) rightGrid.innerHTML = "";
  if (rightWeekdays) rightWeekdays.innerHTML = "";
}

function renderDateMonthControls(side, monthDate) {
  const monthSelect = document.getElementById(`date-month-${side}`);
  const yearSelect = document.getElementById(`date-year-${side}`);
  if (!monthSelect || !yearSelect) return;

  monthSelect.innerHTML = MONTH_NAMES.map((month, index) => `
    <option value="${index}" ${index === monthDate.getMonth() ? "selected" : ""}>${month}</option>
  `).join("");

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 3; year <= currentYear + 3; year += 1) {
    years.push(year);
  }

  yearSelect.innerHTML = years.map(year => `
    <option value="${year}" ${year === monthDate.getFullYear() ? "selected" : ""}>${year}</option>
  `).join("");
}

function renderDateMonthGrid(containerId, monthDate) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const rangeStart = parseInputDate(state.datePickerDraftStart);
  const rangeEnd = parseInputDate(state.datePickerDraftEnd);
  const anchorDate = parseInputDate(state.datePickerSelectionAnchor);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12, 0, 0, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

  let html = "";
  for (let index = 0; index < firstWeekday; index += 1) {
    html += '<button type="button" class="date-day muted" disabled></button>';
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day, 12, 0, 0, 0);
    const cellDateString = formatDate(cellDate);
    const classes = ["date-day"];
    const isFutureDate = cellDate.getTime() > today.getTime();

    const inRange = isDateBetween(cellDate, rangeStart, rangeEnd);
    const sameStart = isSameDay(cellDate, rangeStart);
    const sameEnd = isSameDay(cellDate, rangeEnd);
    const singleDay = sameStart && sameEnd;
    const pendingStart = isSameDay(cellDate, anchorDate) && !rangeEnd;

    if (isFutureDate) classes.push("future-disabled");
    if (inRange) classes.push("in-range");
    if (pendingStart) {
      classes.push("pending-start");
    } else if (singleDay) {
      classes.push("single-day");
    } else {
      if (sameStart) classes.push("range-start");
      if (sameEnd) classes.push("range-end");
    }

    if (isFutureDate) {
      html += `<button type="button" class="${classes.join(" ")}" disabled>${day}</button>`;
    } else {
      html += `<button type="button" class="${classes.join(" ")}" onclick="selectDateRangeDay('${cellDateString}')">${day}</button>`;
    }
  }

  container.innerHTML = html;
}

function shiftDateRangeCalendar(direction) {
  const currentBase = parseInputDate(state.datePickerBaseMonth) || startOfMonth(new Date());
  state.datePickerBaseMonth = formatDate(addMonths(currentBase, direction));
  renderDateRangePicker();
}

function updateDateRangeMonth(side) {
  const monthValue = Number(document.getElementById(`date-month-${side}`)?.value || 0);
  const yearValue = Number(document.getElementById(`date-year-${side}`)?.value || new Date().getFullYear());
  const selectedMonth = new Date(yearValue, monthValue, 1, 12, 0, 0, 0);

  if (side === "left") {
    state.datePickerBaseMonth = formatDate(selectedMonth);
  } else {
    state.datePickerBaseMonth = formatDate(addMonths(selectedMonth, -1));
  }

  renderDateRangePicker();
}

function selectDateRangeDay(dateString) {
  const selectedDate = parseInputDate(dateString);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  if (!selectedDate || selectedDate.getTime() > today.getTime()) return;

  const anchor = state.datePickerSelectionAnchor;
  document.getElementById("range-preset").value = "custom";

  if (!anchor) {
    state.datePickerSelectionAnchor = dateString;
    state.datePickerDraftStart = dateString;
    state.datePickerDraftEnd = "";
    syncDateRangeDisplay();
    renderDateRangePicker();
    return;
  }

  const start = anchor <= dateString ? anchor : dateString;
  const end = anchor <= dateString ? dateString : anchor;
  state.datePickerDraftStart = start;
  state.datePickerDraftEnd = end;
  state.datePickerSelectionAnchor = "";
  syncDateRangeDisplay();
  renderDateRangePicker();
}

function applyDateRangeSelection() {
  if (!state.datePickerDraftStart || !state.datePickerDraftEnd) {
    showToast("Selecione a data inicial e a data final.");
    return;
  }

  document.getElementById("date-start").value = state.datePickerDraftStart;
  document.getElementById("date-end").value = state.datePickerDraftEnd;
  syncDateRangeDisplay();
  closeDateRangePicker();
  loadData();
}

function getActiveProfile() {
  return state.profiles.find(profile => profile.id === state.activeProfileId) || null;
}

function setActiveProfileId(profileId) {
  state.activeProfileId = profileId || "";
  setSavedActiveProfileId(state.activeProfileId);
}

function getObjectiveLabel(objectiveType) {
  return OBJECTIVE_OPTIONS.find(option => option.id === objectiveType)?.label || OBJECTIVE_OPTIONS[0].label;
}

function getSelectedObjectiveConfig() {
  return OBJECTIVE_CONFIGS[state.selectedObjectiveType] || OBJECTIVE_CONFIGS.purchase;
}

function getFilteredAccounts() {
  if (!state.isClientView) return state.adAccounts;
  if (state.isClientView && state.lockedAccountId) {
    return state.adAccounts.filter(account => account.id === state.lockedAccountId);
  }

  return state.adAccounts.filter(account => {
    const primaryView = account?.primaryView || "purchase";
    const supportedViews = Array.isArray(account?.supportedViews) && account.supportedViews.length
      ? account.supportedViews
      : [primaryView];
    return primaryView === state.selectedObjectiveType || supportedViews.includes(state.selectedObjectiveType);
  });
}

function updateObjectiveUI() {
  const label = getObjectiveLabel(state.selectedObjectiveType);
  const buttonLabel = document.getElementById("objective-button-label");
  const wrapper = document.getElementById("objective-selector-wrap");

  if (buttonLabel) buttonLabel.textContent = label;
  if (wrapper) {
    wrapper.style.display = state.isClientView && state.lockedObjectiveType ? "none" : "flex";
  }

  document.querySelectorAll("[data-objective-option]").forEach(button => {
    button.classList.toggle("active", button.getAttribute("data-objective-option") === state.selectedObjectiveType);
  });
}

function updateDashboardLabels() {
  const config = getSelectedObjectiveConfig();
  const bottomMetricLabels = config.bottomMetrics({
    spend: 0,
    clicks: 0,
    ctr: 0,
    cpp: 0,
    cpmessage: 0,
    cpl: 0,
    cpm: 0,
    addToCart: 0
  });
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText("kpi-result-label", config.resultLabel);
  setText("kpi-cost-label", config.costLabel);
  setText("metric-primary-label", config.metricPrimaryLabel);
  setText("metric-secondary-label", config.metricSecondaryLabel);
  setText("bm-assist-label", bottomMetricLabels[0]?.label || "");
  setText("bm-result-label", bottomMetricLabels[1]?.label || "");
  setText("bm-last-label", bottomMetricLabels[2]?.label || "");
  setText("line-chart-title", config.chartTitle);
  setText("line-legend-primary", config.chartPrimaryLabel);
  setText("line-legend-secondary", config.chartSecondaryLabel);
  setText("donut-chart-title", config.donutTitle);
  setText("campaign-assist-header", config.tableAssistHeader);
  setText("campaign-main-header", config.tableMainHeader);
  setText("campaign-last-header", config.tableLastHeader);
}

function toggleObjectiveMenu() {
  const menu = document.getElementById("objective-menu");
  if (!menu || (state.isClientView && state.lockedObjectiveType)) return;
  menu.classList.toggle("open");
}

function closeObjectiveMenu() {
  document.getElementById("objective-menu")?.classList.remove("open");
}

function selectObjectiveType(objectiveType, options = {}) {
  const normalizedType = OBJECTIVE_CONFIGS[objectiveType] ? objectiveType : "purchase";
  if (state.isClientView && state.lockedObjectiveType && normalizedType !== state.lockedObjectiveType) {
    showToast("A visualizacao compartilhada esta bloqueada para esse cliente.");
    return;
  }

  const previousType = state.selectedObjectiveType;
  state.selectedObjectiveType = normalizedType;
  updateObjectiveUI();
  closeObjectiveMenu();
  populateAccountSelects();
  populateAccountCards();

  const filteredAccounts = getFilteredAccounts();
  if (state.selectedAccount && filteredAccounts.some(account => account.id === state.selectedAccount)) {
    if (state.lastDashboardData) {
      processDashboardData(state.lastDashboardData);
    }
    return;
  }

  if (previousType !== normalizedType || options.forceReload) {
    selectAccount(filteredAccounts[0]?.id || "");
  }
}

function populateStateFromBootstrap(data) {
  state.isAdmin = true;
  state.isMasterAdmin = Boolean(data?.session?.isMasterAdmin);
  state.adminUser = data?.session?.username || "";
  state.adminProfile = data?.adminProfile || { company: "", name: "", phone: "", email: "" };
  state.profiles = Array.isArray(data?.profiles) ? data.profiles : [];
  state.clients = Array.isArray(data?.clients) ? data.clients : [];
  state.adminUsers = Array.isArray(data?.adminUsers) ? data.adminUsers : [];
  state.accountBindings = data?.accountBindings && typeof data.accountBindings === "object" ? data.accountBindings : {};

  const savedProfileId = getSavedActiveProfileId();
  const validProfileId = state.profiles.some(profile => profile.id === savedProfileId)
    ? savedProfileId
    : (state.profiles[0]?.id || "");
  setActiveProfileId(validProfileId);
}

async function refreshBootstrap() {
  const data = await apiRequest("/bootstrap");
  populateStateFromBootstrap(data);
}

function formatTokenDate(dateString) {
  if (!dateString) return "Token ainda nao cadastrado";
  return `Token atualizado em ${new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(dateString))}`;
}

function formatAccessDate(dateString) {
  if (!dateString) return "--";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(dateString));
}

function getAccessExpiryLabel(admin) {
  if (admin?.accessPermanent) return "Acesso permanente";
  return formatAccessDate(admin?.accessExpiresAt || "");
}

function getAccessCountdownLabel(admin) {
  if (admin?.accessPermanent) return "Permanente";
  if (admin?.accessExpired) return "Expirado";
  const days = Number(admin?.daysRemaining || 0);
  if (days <= 0) return "Expira hoje";
  if (days === 1) return "1 dia";
  return `${days} dias`;
}

function getProfileStatus(profile) {
  if (!profile?.hasToken) return { label: "sem token", className: "warn" };
  if (profile.tokenInvalid) return { label: "atualizar token", className: "warn" };
  return { label: "ativo", className: "ok" };
}

function updateUserAvatarLetter(name = "") {
  const avatar = document.getElementById("user-avatar");
  if (!avatar) return;
  const fallback = state.adminProfile?.name || state.adminUser || "A";
  const source = (name || fallback).trim();
  avatar.textContent = (source.charAt(0) || "A").toUpperCase();
}

function hasSavedAdminProfile() {
  const profile = state.adminProfile || {};
  return Boolean(profile.company || profile.name || profile.phone || profile.email);
}

function updateAdminProfileFormState() {
  const fieldIds = ["profile-company", "profile-display-name", "profile-phone", "profile-email"];
  const fields = fieldIds.map(id => document.getElementById(id)).filter(Boolean);
  const saveButton = document.getElementById("profile-save-btn");
  const editButton = document.getElementById("profile-edit-btn");
  const hasProfile = hasSavedAdminProfile();

  fields.forEach(field => {
    field.disabled = hasProfile && !state.isEditingAdminProfile;
  });

  if (saveButton) {
    saveButton.style.display = state.isEditingAdminProfile || !hasProfile ? "inline-flex" : "none";
  }
  if (editButton) {
    editButton.style.display = hasProfile && !state.isEditingAdminProfile ? "inline-flex" : "none";
  }
}

function loadAdminProfileDetails() {
  const profile = state.adminProfile || { company: "", name: "", phone: "", email: "" };
  document.getElementById("profile-company").value = profile.company || "";
  document.getElementById("profile-display-name").value = profile.name || "";
  document.getElementById("profile-phone").value = profile.phone || "";
  document.getElementById("profile-email").value = profile.email || "";
  updateUserAvatarLetter(profile.name || "");
  state.isEditingAdminProfile = !hasSavedAdminProfile();
  updateAdminProfileFormState();
}

function editAdminProfileDetails() {
  state.isEditingAdminProfile = true;
  updateAdminProfileFormState();
}

async function saveAdminProfileDetails() {
  try {
    const body = {
      company: document.getElementById("profile-company")?.value.trim() || "",
      name: document.getElementById("profile-display-name")?.value.trim() || "",
      phone: document.getElementById("profile-phone")?.value.trim() || "",
      email: document.getElementById("profile-email")?.value.trim() || ""
    };

    const data = await apiRequest("/admin/profile", {
      method: "PUT",
      body
    });

    state.adminProfile = data.adminProfile || body;
    await refreshBootstrap();
    state.isEditingAdminProfile = false;
    loadAdminProfileDetails();
    showToast("Informacoes do perfil salvas.");
  } catch (error) {
    handleApiError(error, "Nao foi possivel salvar o perfil.");
  }
}

function updateProfileAccessUI() {
  const label = document.getElementById("profile-user-label");
  const subtitle = document.getElementById("profile-user-subtitle");
  const accessCard = document.getElementById("admin-access-card");
  const roleBadge = document.getElementById("profile-role-badge");

  if (label) {
    label.textContent = state.isMasterAdmin ? "Administrador principal" : "Sub-admin";
  }
  if (subtitle) {
    subtitle.textContent = state.isMasterAdmin
      ? "Controle total do dashboard e dos convites de acesso."
      : "Acesso administrativo ao dashboard, sem permissao para gerar novos tokens.";
  }
  if (accessCard) {
    accessCard.style.display = "none";
  }
  if (roleBadge) {
    roleBadge.textContent = state.isMasterAdmin ? "admin principal" : "sub-admin";
  }
}

function updateAccountsTabUI() {
  const title = document.querySelector("#content-contas .section-header h2");
  const shareButton = document.getElementById("contas-share-btn");
  const tokenButton = document.getElementById("contas-token-btn");
  const tokenOutput = document.getElementById("contas-token-output");
  const tokenValue = document.getElementById("contas-token-value");

  if (title) {
    title.textContent = state.isMasterAdmin ? "Contas cadastradas por token" : "Contas de Anuncio";
  }
  if (shareButton) {
    shareButton.style.display = state.isMasterAdmin ? "none" : "inline-flex";
  }
  if (tokenButton) {
    tokenButton.style.display = state.isMasterAdmin ? "inline-flex" : "none";
  }
  if (tokenOutput) {
    tokenOutput.classList.toggle("show", Boolean(state.isMasterAdmin && state.lastGeneratedInviteToken));
  }
  if (tokenValue) {
    tokenValue.textContent = state.lastGeneratedInviteToken || "—";
  }
}

function renderProfilesList() {
  const list = document.getElementById("profiles-list");
  if (!list) return;

  if (!state.profiles.length) {
    list.innerHTML = `
      <div class="saved-item">
        <div class="saved-item-main">
          <div class="saved-item-title">Nenhum perfil salvo</div>
          <div class="saved-item-subtitle">Cadastre um perfil Meta com System User Token para conectar suas contas.</div>
        </div>
      </div>
    `;
    return;
  }

  list.innerHTML = state.profiles.map(profile => {
    const status = getProfileStatus(profile);
    return `
      <div class="saved-item ${profile.id === state.activeProfileId ? "active" : ""}">
        <div class="saved-item-main">
          <div class="saved-item-title">${escapeHtml(profile.name)}</div>
          <div class="saved-item-subtitle">${escapeHtml(formatTokenDate(profile.tokenUpdatedAt))}</div>
          <div class="status-chip ${status.className}">${escapeHtml(status.label)}</div>
        </div>
        <div class="saved-item-actions">
          <button class="btn-inline" type="button" onclick="activateProfile('${profile.id}')">Ativar</button>
          <button class="btn-inline" type="button" onclick="editProfile('${profile.id}')">Editar</button>
          <button class="btn-inline" type="button" onclick="deleteProfile('${profile.id}')">Excluir</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderAdminUsersList() {
  const list = document.getElementById("accounts-grid");
  if (!list) return;
  if (!state.isMasterAdmin) return;

  if (!state.adminUsers.length) {
    list.innerHTML = `
      <div class="access-empty-state">
        <div class="saved-item-title">Nenhuma conta cadastrada por token</div>
        <div class="saved-item-subtitle">Gere um token para liberar um novo acesso de 30 dias.</div>
      </div>
    `;
    return;
  }

  list.innerHTML = `
    <div class="access-list">
      <div class="access-row access-row-head">
        <div class="access-cell">Conta</div>
        <div class="access-cell">Token de cadastro</div>
        <div class="access-cell">Acesso ate</div>
        <div class="access-cell">Acoes</div>
      </div>
      ${state.adminUsers.map(admin => `
        <div class="access-row">
          <div class="access-cell access-cell-primary" data-label="Conta">
            <div class="saved-item-title">${escapeHtml(admin.username)}</div>
            <div class="saved-item-subtitle">Criado em ${escapeHtml(formatAccessDate(admin.createdAt))}</div>
          </div>
          <div class="access-cell access-cell-token" data-label="Token de cadastro">
            <span class="access-token-text">${escapeHtml(admin.inviteToken || "Sem token registrado")}</span>
          </div>
          <div class="access-cell access-cell-expiry" data-label="Acesso ate">
            <div class="saved-item-subtitle">${escapeHtml(getAccessExpiryLabel(admin))}</div>
          </div>
          <div class="access-cell access-cell-actions" data-label="Acoes">
            <div class="access-actions-main">
              <div class="access-action-buttons">
                <div class="access-days-control ${admin.accessPermanent ? "is-disabled" : ""}">
                  <span class="access-days-hint">Dias</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value="30"
                    class="access-days-input"
                    id="access-days-${admin.id}"
                    aria-label="Quantidade de dias para ${escapeAttribute(admin.username)}"
                    ${admin.accessPermanent ? "disabled" : ""}
                  >
                  <button class="btn-inline btn-access-add" type="button" onclick="updateAdminUserAccess('${admin.id}', 'add')" ${admin.accessPermanent ? "disabled" : ""}>+</button>
                  <button class="btn-inline btn-access-subtract" type="button" onclick="updateAdminUserAccess('${admin.id}', 'subtract')" ${admin.accessPermanent ? "disabled" : ""}>-</button>
                </div>
                <button class="btn-inline btn-access-permanent" type="button" onclick="grantPermanentAccess('${admin.id}')" ${admin.accessPermanent ? "disabled" : ""}>Access perm.</button>
                <button class="btn-inline" type="button" onclick="deleteAdminUser('${admin.id}')">Excluir</button>
              </div>
            </div>
            <div class="access-actions-secondary">
              <span class="status-chip ${admin.accessExpired ? "warn" : "ok"}">${escapeHtml(getAccessCountdownLabel(admin))}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function updateActiveProfileUI() {
  const profile = getActiveProfile();
  const summary = document.getElementById("share-profile-summary");
  if (summary) {
    summary.textContent = profile
      ? `Vinculado ao perfil ativo: ${profile.name}`
      : "Nenhum perfil Meta ativo";
  }
}

function resetProfileForm() {
  state.editingProfileId = "";
  document.getElementById("profile-name").value = "";
  const tokenField = document.getElementById("profile-system-user-token");
  if (tokenField) tokenField.value = "";
  const businessIdsField = document.getElementById("profile-business-ids");
  if (businessIdsField) businessIdsField.value = "";
}

function editProfile(profileId) {
  const profile = state.profiles.find(item => item.id === profileId);
  if (!profile) return;

  state.editingProfileId = profile.id;
  document.getElementById("profile-name").value = profile.name || "";
  const tokenField = document.getElementById("profile-system-user-token");
  if (tokenField) tokenField.value = "";
  const businessIdsField = document.getElementById("profile-business-ids");
  if (businessIdsField) businessIdsField.value = Array.isArray(profile.businessIds) ? profile.businessIds.join("\n") : "";
  switchTab("perfil");
}

async function saveProfileSettings() {
  try {
    const body = {
      id: state.editingProfileId || "",
      name: document.getElementById("profile-name").value.trim() || "Perfil Meta",
      systemUserToken: document.getElementById("profile-system-user-token")?.value.trim() || "",
      businessIds: document.getElementById("profile-business-ids")?.value.trim() || ""
    };

    const creatingProfile = !state.editingProfileId;
    if (creatingProfile && !body.systemUserToken) {
      showToast("Informe o System User Token para criar o perfil.");
      return;
    }

    const data = await apiRequest("/profiles", {
      method: "POST",
      body
    });

    await refreshBootstrap();
    setActiveProfileId(data.profile?.id || getActiveProfile()?.id || "");
    renderProfilesList();
    updateActiveProfileUI();
    resetProfileForm();
    showToast("Perfil Meta salvo com sucesso!");
    await fetchAdAccounts();
  } catch (error) {
    handleApiError(error, "Nao foi possivel salvar o perfil Meta.");
  }
}

async function activateProfile(profileId) {
  setActiveProfileId(profileId);
  renderProfilesList();
  renderSavedClientsList();
  updateActiveProfileUI();
  await fetchAdAccounts();

  const profile = getActiveProfile();
  if (profile) {
    showToast(`Perfil ativo: ${profile.name}`);
  }
}

async function deleteProfile(profileId) {
  const profile = state.profiles.find(item => item.id === profileId);
  if (!profile) return;
  if (!confirm(`Remover o perfil "${profile.name}"?`)) return;

  try {
    await apiRequest(`/profiles/${encodeURIComponent(profileId)}`, {
      method: "DELETE"
    });
    if (state.activeProfileId === profileId) {
      setActiveProfileId("");
    }
    if (state.editingProfileId === profileId) {
      resetProfileForm();
    }
    await refreshBootstrap();
    renderProfilesList();
    renderSavedClientsList();
    updateActiveProfileUI();
    await fetchAdAccounts();
    showToast("Perfil removido.");
  } catch (error) {
    handleApiError(error, "Nao foi possivel remover o perfil.");
  }
}

function resetClientForm() {
  state.editingClientId = "";
  document.getElementById("share-client-name").value = "";
  document.getElementById("share-url-wrap").style.display = "none";
  document.getElementById("share-objective-select").value = state.selectedObjectiveType;
  handleShareObjectiveChange(state.selectedObjectiveType);
  document.getElementById("share-account-select").value = "";
  applyShareDatePreset("last7");
  document.getElementById("share-range-preset").value = "last7";
  syncShareDateInputs();
  renderSavedClientsList();
}

function editClientPreset(clientId) {
  const client = state.clients.find(item => item.id === clientId);
  if (!client) return;
  const clientObjectiveType = client.objectiveType || "purchase";

  state.editingClientId = client.id;
  document.getElementById("share-client-name").value = client.name || "";
  selectObjectiveType(clientObjectiveType);
  document.getElementById("share-objective-select").value = clientObjectiveType;
  handleShareObjectiveChange(clientObjectiveType);
  document.getElementById("share-account-select").value = client.accountId || "";
  document.getElementById("share-date-start").value = client.dateStart || "";
  document.getElementById("share-date-end").value = client.dateEnd || "";
  document.getElementById("share-range-preset").value = client.rangePreset || "custom";
  document.getElementById("share-url-wrap").style.display = "none";
  syncShareDateInputs();
  renderSavedClientsList();
}

async function saveClientPreset() {
  const activeProfile = getActiveProfile();
  if (!activeProfile) {
    showToast("Crie e ative um perfil Meta antes de salvar clientes.");
    return;
  }

  const body = {
    id: state.editingClientId || "",
    profileId: activeProfile.id,
    name: document.getElementById("share-client-name").value.trim(),
    accountId: document.getElementById("share-account-select").value,
    objectiveType: document.getElementById("share-objective-select").value || state.selectedObjectiveType,
    rangePreset: document.getElementById("share-range-preset").value,
    dateStart: document.getElementById("share-date-start").value,
    dateEnd: document.getElementById("share-date-end").value
  };

  if (!body.name) {
    showToast("Informe o nome do cliente.");
    return;
  }
  if (!body.accountId) {
    showToast("Selecione uma conta de anuncio.");
    return;
  }
  if (body.rangePreset === "custom" && (!body.dateStart || !body.dateEnd)) {
    showToast("Defina a data inicial e final do cliente.");
    return;
  }
  const today = formatDate(new Date());
  if ((body.dateStart && body.dateStart > today) || (body.dateEnd && body.dateEnd > today)) {
    showToast("Nao e permitido selecionar datas futuras.");
    syncShareDateInputs();
    return;
  }

  const wasEditing = Boolean(state.editingClientId);

  try {
    const data = await apiRequest("/clients", {
      method: "POST",
      body
    });

    state.accountBindings = data.accountBindings || state.accountBindings;
    await refreshBootstrap();
    if (wasEditing) {
      state.editingClientId = data.client?.id || body.id;
      renderSavedClientsList();
      showToast("Cliente atualizado com sucesso!");
    } else {
      resetClientForm();
      showToast("Cliente salvo com sucesso! Voce ja pode cadastrar outro.");
    }
  } catch (error) {
    handleApiError(error, "Nao foi possivel salvar o cliente.");
  }
}

async function deleteClientPreset(clientId) {
  const client = state.clients.find(item => item.id === clientId);
  if (!client) return;
  if (!confirm(`Remover o cliente "${client.name}"?`)) return;

  try {
    await apiRequest(`/clients/${encodeURIComponent(clientId)}`, {
      method: "DELETE"
    });
    if (state.editingClientId === clientId) {
      resetClientForm();
    }
    await refreshBootstrap();
    renderSavedClientsList();
    showToast("Cliente removido.");
  } catch (error) {
    handleApiError(error, "Nao foi possivel remover o cliente.");
  }
}

function renderSavedClientsList() {
  const list = document.getElementById("saved-clients-list");
  if (!list) return;

  const activeProfile = getActiveProfile();
  const clients = activeProfile
    ? state.clients.filter(client => client.profileId === activeProfile.id)
    : [];

  if (!clients.length) {
    list.innerHTML = `
      <div class="saved-item">
        <div class="saved-item-main">
          <div class="saved-item-title">Nenhum cliente salvo</div>
          <div class="saved-item-subtitle">Cadastre um cliente para reutilizar conta e periodo padrao.</div>
        </div>
      </div>
    `;
    return;
  }

  list.innerHTML = clients.map(client => `
    <div class="saved-item ${client.id === state.editingClientId ? "active" : ""}">
      <div class="saved-item-main">
        <div class="saved-item-title">${escapeHtml(client.name)}</div>
        <div class="saved-item-subtitle">${escapeHtml(getObjectiveLabel(client.objectiveType || "purchase"))} · ${escapeHtml(client.accountId)} · ${escapeHtml(client.dateStart || "sem inicio")} ate ${escapeHtml(client.dateEnd || "sem fim")}</div>
      </div>
      <div class="saved-item-actions">
        <button class="btn-inline" type="button" onclick="editClientPreset('${client.id}')">Usar</button>
        <button class="btn-inline" type="button" onclick="deleteClientPreset('${client.id}')">Excluir</button>
      </div>
    </div>
  `).join("");
}

async function doLogin() {
  const user = document.getElementById("login-user").value.trim();
  const pass = document.getElementById("login-pass").value;
  const errorBox = document.getElementById("login-error");

  if (!user || !pass) {
    errorBox.textContent = "Informe usuario e senha.";
    errorBox.style.display = "block";
    return;
  }

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { username: user, password: pass }
    });

    setSavedSessionToken(data?.token || "");
    clearLogoutRequested();
    await refreshBootstrap();
    showApp();
  } catch (error) {
    errorBox.textContent = error.message || "Usuario ou senha incorretos.";
    errorBox.style.display = "block";
  }
}

function toggleAuthMode(mode) {
  const login = document.getElementById("admin-login");
  const register = document.getElementById("admin-register");
  const loginError = document.getElementById("login-error");
  const registerError = document.getElementById("register-error");

  if (loginError) loginError.style.display = "none";
  if (registerError) registerError.style.display = "none";

  if (mode === "register") {
    if (login) login.style.display = "none";
    if (register) register.style.display = "block";
    document.getElementById("register-token")?.focus();
    return;
  }

  if (login) login.style.display = "block";
  if (register) register.style.display = "none";
}

function togglePasswordVisibility(inputId = "login-pass", buttonEl = null) {
  const input = document.getElementById(inputId);
  const button = buttonEl || document.getElementById("toggle-password-btn");
  if (!input || !button) return;

  const hidden = input.type === "password";
  input.type = hidden ? "text" : "password";
  button.textContent = hidden ? "ocultar" : "ver";
}

async function registerAdminAccess() {
  const tokenInput = document.getElementById("register-token");
  const userInput = document.getElementById("register-user");
  const passInput = document.getElementById("register-pass");
  const errorBox = document.getElementById("register-error");
  const username = userInput.value.trim();

  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: {
        inviteToken: tokenInput.value.trim(),
        username,
        password: passInput.value
      }
    });

    tokenInput.value = "";
    userInput.value = "";
    passInput.value = "";
    errorBox.style.display = "none";
    document.getElementById("login-user").value = username;
    toggleAuthMode("login");
    showToast("Acesso cadastrado com sucesso.");
  } catch (error) {
    errorBox.textContent = error.message || "Nao foi possivel cadastrar o acesso.";
    errorBox.style.display = "block";
  }
}

async function generateAdminInviteToken() {
  if (!state.isMasterAdmin) return;

  try {
    const data = await apiRequest("/auth/invite", {
      method: "POST",
      body: {}
    });

    state.lastGeneratedInviteToken = data.token || "";
    updateAccountsTabUI();
    showToast("Token de cadastro gerado.");
  } catch (error) {
    handleApiError(error, "Nao foi possivel gerar o token.");
  }
}

function copyAdminInviteToken() {
  const value = state.lastGeneratedInviteToken || document.getElementById("contas-token-value")?.textContent || "";
  if (!value || value === "—" || value === "â€”") {
    showToast("Gere um token primeiro.");
    return;
  }

  navigator.clipboard.writeText(value).then(() => {
    showToast("Token copiado!");
  }).catch(() => {
    showToast("Nao foi possivel copiar o token.");
  });
}

async function deleteAdminUser(adminId) {
  if (!state.isMasterAdmin) return;
  const admin = state.adminUsers.find(item => item.id === adminId);
  if (!admin) return;
  if (!confirm(`Remover o acesso "${admin.username}"?`)) return;

  try {
    await apiRequest(`/auth/subadmins/${encodeURIComponent(adminId)}`, {
      method: "DELETE"
    });
    await refreshBootstrap();
    renderAdminUsersList();
    showToast("Acesso removido.");
  } catch (error) {
    handleApiError(error, "Nao foi possivel remover o acesso.");
  }
}

function getAdminAccessDaysInputValue(adminId) {
  const input = document.getElementById(`access-days-${adminId}`);
  const days = Math.trunc(Number(input?.value || 0));
  if (!Number.isFinite(days) || days <= 0) {
    showToast("Informe uma quantidade valida de dias.");
    if (input) {
      input.focus();
      input.select();
    }
    return 0;
  }

  return days;
}

async function updateAdminUserAccess(adminId, operation) {
  if (!state.isMasterAdmin) return;
  const admin = state.adminUsers.find(item => item.id === adminId);
  if (!admin) return;
  if (admin.accessPermanent) {
    showToast("Esse usuario ja possui acesso permanente.");
    return;
  }

  const days = getAdminAccessDaysInputValue(adminId);
  if (!days) return;

  try {
    await apiRequest(`/auth/subadmins/${encodeURIComponent(adminId)}/access`, {
      method: "POST",
      body: {
        mode: "adjust-days",
        operation,
        days
      }
    });
    await refreshBootstrap();
    renderAdminUsersList();
    showToast(operation === "add"
      ? `${days} dias adicionados para ${admin.username}.`
      : `${days} dias removidos de ${admin.username}.`);
  } catch (error) {
    if (error?.status === 404) {
      showToast("Backend sem a rota nova. Publique o worker atualizado.");
      return;
    }
    handleApiError(error, "Nao foi possivel atualizar o acesso.");
  }
}

async function grantPermanentAccess(adminId) {
  if (!state.isMasterAdmin) return;
  const admin = state.adminUsers.find(item => item.id === adminId);
  if (!admin) return;
  if (admin.accessPermanent) {
    showToast("Esse usuario ja possui acesso permanente.");
    return;
  }
  if (!confirm(`Conceder acesso permanente para "${admin.username}"?`)) return;

  try {
    await apiRequest(`/auth/subadmins/${encodeURIComponent(adminId)}/access`, {
      method: "POST",
      body: {
        mode: "permanent"
      }
    });
    await refreshBootstrap();
    renderAdminUsersList();
    showToast(`Acesso permanente liberado para ${admin.username}.`);
  } catch (error) {
    if (error?.status === 404) {
      showToast("Backend sem a rota nova. Publique o worker atualizado.");
      return;
    }
    handleApiError(error, "Nao foi possivel liberar o acesso permanente.");
  }
}

function stopDashboardAutoRefresh() {
  if (dashboardRefreshTimer) {
    clearInterval(dashboardRefreshTimer);
    dashboardRefreshTimer = null;
  }
}

function startDashboardAutoRefresh() {
  stopDashboardAutoRefresh();
  if (document.hidden) return;
  if (document.getElementById("app")?.style.display !== "block") return;
  if (!state.selectedAccount) return;

  dashboardRefreshTimer = setInterval(() => {
    loadData({ silent: true, source: "auto-refresh" });
  }, CONFIG.DASHBOARD_REFRESH_MS);
}

function restartDashboardAutoRefresh() {
  startDashboardAutoRefresh();
}

function showLoginScreen() {
  document.body.classList.remove("client-view", "client-banner-hidden");
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("client-banner").style.display = "none";
  updateMetaStatus(false);
}

function resetAdminState() {
  stopDashboardAutoRefresh();
  if (currentDashboardAbortController) {
    currentDashboardAbortController.abort();
    currentDashboardAbortController = null;
  }
  if (mobileBannerFrameId) {
    cancelAnimationFrame(mobileBannerFrameId);
    mobileBannerFrameId = 0;
  }
  currentLoadRequestId = 0;
  isLoadInProgress = false;
  state = createInitialState();
  setSavedActiveProfileId("");
}

function resetLoginForm() {
  const loginUser = document.getElementById("login-user");
  const loginPass = document.getElementById("login-pass");
  const loginError = document.getElementById("login-error");
  const registerError = document.getElementById("register-error");

  if (loginUser) loginUser.value = "";
  if (loginPass) loginPass.value = "";
  if (loginError) loginError.style.display = "none";
  if (registerError) registerError.style.display = "none";
  toggleAuthMode("login");
}

function returnToLoginScreen() {
  const app = document.getElementById("app");
  const loginScreen = document.getElementById("login-screen");
  const clientBanner = document.getElementById("client-banner");
  const shareModal = document.getElementById("share-modal");
  const reconnectModal = document.getElementById("reconnect-modal");

  try {
    if (shareModal) shareModal.style.display = "none";
    if (reconnectModal) reconnectModal.style.display = "none";
    resetAdminState();
    try {
      renderEmptyState();
    } catch (error) {
      console.warn("Nao foi possivel limpar o dashboard durante o logout.", error);
    }
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    history.replaceState(null, "", cleanUrl);
    if (window.location.hash) {
      window.location.hash = "";
    }
    resetLoginForm();
  } finally {
    document.body.classList.remove("client-view", "client-banner-hidden");
    if (app) app.style.display = "none";
    if (loginScreen) loginScreen.style.display = "flex";
    if (clientBanner) clientBanner.style.display = "none";
    try {
      updateMetaStatus(false);
    } catch (error) {
      console.warn("Nao foi possivel atualizar o status da Meta durante o logout.", error);
    }
    document.getElementById("login-user")?.focus();
  }
}

async function doLogout(skipConfirm = false) {
  if (!skipConfirm && !confirm("Sair do dashboard?")) return;
  markLogoutRequested();
  returnToLoginScreen();

  try {
    await apiRequest("/auth/logout", {
      method: "POST",
      body: {}
    });
  } catch {
    // A interface ja voltou para o login; ignoramos falhas do backend aqui.
  } finally {
    setSavedSessionToken("");
    window.location.reload();
  }
}

async function restoreSession() {
  if (hasLogoutRequested()) {
    return false;
  }

  try {
    await apiRequest("/auth/session");
    clearLogoutRequested();
    await refreshBootstrap();
    showApp();
    return true;
  } catch (error) {
    setSavedSessionToken("");
    return false;
  }
}

function showApp() {
  document.body.classList.remove("client-view", "client-banner-hidden");
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("client-banner").style.display = "none";
  document.getElementById("app").style.display = "block";
  state.isClientView = false;
  state.lockedObjectiveType = "";

  updateUserAvatarLetter(state.adminProfile?.name || "");
  document.getElementById("share-btn").style.display = state.isAdmin ? "flex" : "none";
  document.getElementById("tab-contas").style.display = state.isAdmin ? "flex" : "none";

  loadAdminProfileDetails();
  renderProfilesList();
  renderSavedClientsList();
  updateAccountsTabUI();
  renderAdminUsersList();
  updateProfileAccessUI();
  updateActiveProfileUI();
  updateObjectiveUI();

  const activeProfile = getActiveProfile();
  updateMetaStatus(Boolean(activeProfile?.hasToken) && !activeProfile?.tokenInvalid);

  if (activeProfile?.tokenInvalid) {
    openReconnectModal(activeProfile);
  }

  fetchAdAccounts();
  restartDashboardAutoRefresh();
}

function showClientView(params) {
  document.body.classList.add("client-view");
  document.body.classList.remove("client-banner-hidden");
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("client-banner").style.display = "flex";
  document.getElementById("share-btn").style.display = "none";
  document.getElementById("tab-contas").style.display = "none";

  state.isClientView = true;
  state.clientName = params.clientName || "Cliente";
  state.currentShareId = params.shareId || "";
  state.selectedAccount = params.accountId || "";
  state.lockedAccountId = params.accountId || "";
  state.selectedObjectiveType = params.objectiveType || "purchase";
  state.lockedObjectiveType = state.selectedObjectiveType;
  lastMobileScrollY = window.scrollY || 0;

  document.getElementById("client-name-banner").textContent = state.clientName;
  document.getElementById("header-client-name").textContent = state.clientName;
  document.getElementById("header-account").textContent = "VISUALIZAÇÃO";

  document.getElementById("range-preset").value = params.rangePreset || "custom";
  updateObjectiveUI();
  updateAccountsTabUI();
  if (params.rangePreset && params.rangePreset !== "custom" && !params.dateStart && !params.dateEnd) {
    applyDatePreset(params.rangePreset);
  } else {
    if (params.dateStart) document.getElementById("date-start").value = params.dateStart;
    if (params.dateEnd) document.getElementById("date-end").value = params.dateEnd;
    syncDateRangeDisplay();
  }

  updateMetaStatus(true);
  fetchAdAccounts();
  restartDashboardAutoRefresh();
}

function updateMetaStatus(connected) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const banner = document.getElementById("connect-banner");

  if (connected) {
    dot.classList.add("connected");
    text.textContent = "Meta vinculada";
    banner.style.display = "none";
  } else {
    dot.classList.remove("connected");
    text.textContent = "Nao vinculada";
    banner.style.display = state.isClientView ? "none" : "block";
  }
}

function openReconnectModal(profile = getActiveProfile()) {
  if (!profile || state.isClientView) return;
  const modal = document.getElementById("reconnect-modal");
  const text = document.getElementById("reconnect-modal-text");
  text.textContent = `O System User Token do perfil "${profile.name}" precisa ser atualizado para voltar a carregar os dados reais.`;
  modal.style.display = "flex";
}

function closeReconnectModal() {
  document.getElementById("reconnect-modal").style.display = "none";
}

function connectMeta() {
  if (state.isClientView) return;
  switchTab("perfil");
  document.getElementById("profile-system-user-token")?.focus();
  showToast("Cadastre ou atualize um System User Token no perfil Meta.");
}

function reconnectMetaToken() {
  closeReconnectModal();
  connectMeta();
}

async function fetchAdAccounts(options = {}) {
  const { forceRefresh = false } = options;
  const activeProfile = getActiveProfile();

  if (state.isClientView && state.currentShareId) {
    try {
      const params = new URLSearchParams({
        shareId: state.currentShareId
      });
      if (forceRefresh) params.set("forceRefresh", "1");
      const data = await apiRequest(`/meta/adaccounts?${params.toString()}`, {
        auth: false
      });
      state.adAccounts = data.accounts || [];
      state.adAccountsDiagnostics = data.diagnostics || null;
      populateAccountSelects();
      populateAccountCards();
      if (state.selectedAccount) {
        selectAccount(state.selectedAccount);
      }
      return;
    } catch (error) {
      handleApiError(error, "Nao foi possivel buscar a conta compartilhada.");
      return;
    }
  }

  if (!activeProfile?.hasToken || activeProfile.tokenInvalid) {
    state.adAccounts = [];
    state.adAccountsDiagnostics = null;
    populateAccountSelects();
    populateAccountCards();
    selectAccount("");
    updateMetaStatus(false);
    return;
  }

  try {
    const params = new URLSearchParams({
      profileId: activeProfile.id
    });
    if (forceRefresh) params.set("forceRefresh", "1");
    const data = await apiRequest(`/meta/adaccounts?${params.toString()}`);
    state.adAccounts = Array.isArray(data.accounts) ? data.accounts.filter(Boolean) : [];
    state.adAccountsDiagnostics = data.diagnostics || null;
    populateAccountSelects();
    populateAccountCards();
    const filteredAccounts = getFilteredAccounts();
    const hasSelected = state.selectedAccount && filteredAccounts.some(account => account.id === state.selectedAccount);
    selectAccount(hasSelected ? state.selectedAccount : "");
    updateMetaStatus(true);
  } catch (error) {
    if (await maybeHandleMetaTokenInvalid(error)) return;
    state.adAccounts = [];
    state.adAccountsDiagnostics = null;
    populateAccountSelects();
    populateAccountCards();
    selectAccount("");
    handleApiError(error, "Nao foi possivel buscar as contas da Meta.");
  }
}

function populateAccountSelects() {
  const accountSelect = document.getElementById("account-select");
  const shareSelect = document.getElementById("share-account-select");
  if (!accountSelect || !shareSelect) return;
  const filteredAccounts = getFilteredAccounts();

  accountSelect.innerHTML = "";
  const placeholderOption = new Option("SELECIONE A CONTA", ACCOUNT_PLACEHOLDER_VALUE);
  placeholderOption.disabled = true;
  placeholderOption.hidden = true;
  accountSelect.add(placeholderOption);
  accountSelect.add(new Option("ATUALIZAR...", REFRESH_ACCOUNTS_OPTION_VALUE));
  shareSelect.innerHTML = '<option value="">Selecione...</option>';

  filteredAccounts.forEach(account => {
    accountSelect.add(new Option(account.name, account.id));
  });

  filteredAccounts.forEach(account => {
    shareSelect.add(new Option(account.name, account.id));
  });

  accountSelect.style.display = state.isClientView ? "none" : "block";
  accountSelect.value = filteredAccounts.some(account => account.id === state.selectedAccount)
    ? state.selectedAccount
    : ACCOUNT_PLACEHOLDER_VALUE;
}

async function refreshAdAccountsFromMeta() {
  if (state.isClientView) return;
  const activeProfile = getActiveProfile();
  const accountSelect = document.getElementById("account-select");

  if (!activeProfile?.hasToken || activeProfile.tokenInvalid) {
    showToast("Cadastre um perfil Meta valido antes de atualizar as contas.");
    if (accountSelect) accountSelect.value = state.selectedAccount || "";
    return;
  }

  try {
    showToast("Atualizando contas da Meta...");
    if (accountSelect) accountSelect.disabled = true;
    await fetchAdAccounts({ forceRefresh: true });
    showToast("Contas atualizadas. Recarregando...");
    window.setTimeout(() => {
      window.location.reload();
    }, 250);
  } catch (error) {
    if (accountSelect) {
      accountSelect.disabled = false;
      accountSelect.value = state.selectedAccount || ACCOUNT_PLACEHOLDER_VALUE;
    }
    handleApiError(error, "Nao foi possivel atualizar as contas da Meta.");
  }
}

function renderAccountsDiagnostics() {
  const diagnosticsWrap = document.getElementById("accounts-diagnostics");
  if (!diagnosticsWrap) return;

  if (state.isMasterAdmin && !state.isClientView) {
    diagnosticsWrap.innerHTML = "";
    return;
  }

  const total = Array.isArray(state.adAccounts) ? state.adAccounts.length : 0;
  const diagnostics = state.adAccountsDiagnostics;
  if (!diagnostics && !total) {
    diagnosticsWrap.innerHTML = "";
    return;
  }

  if (!diagnostics) {
    diagnosticsWrap.innerHTML = `<div class="accounts-diagnostics-box">Contas carregadas no painel: <strong>${fmtNum(total)}</strong></div>`;
    return;
  }

  const sourceCounts = diagnostics.sourceCounts || {};
  const consultedBusinessIds = Array.isArray(diagnostics.consultedBusinessIds) ? diagnostics.consultedBusinessIds : [];
  diagnosticsWrap.innerHTML = `
    <div class="accounts-diagnostics-box">
      Painel: <strong>${fmtNum(total)}</strong> contas.
      <code>me/adaccounts</code>: <strong>${fmtNum(sourceCounts.meAdAccounts || 0)}</strong>.
      Merge unico: <strong>${fmtNum(diagnostics.mergedUniqueCount || total)}</strong>.
      Classificadas: <strong>${fmtNum(diagnostics.classifiedCount || total)}</strong>.
      BMs consultadas: <strong>${fmtNum(consultedBusinessIds.length)}</strong>.
    </div>
  `;
}

function populateAccountCards() {
  const grid = document.getElementById("accounts-grid");
  if (!grid) return;
  renderAccountsDiagnostics();
  if (state.isMasterAdmin && !state.isClientView) {
    renderAdminUsersList();
    return;
  }

  if (!state.adAccounts.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px">Nenhuma conta encontrada</div>`;
    return;
  }

  const filteredAccounts = getFilteredAccounts();
  if (!filteredAccounts.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px">Nenhuma conta encontrada para ${escapeHtml(getObjectiveLabel(state.selectedObjectiveType).toLowerCase())}</div>`;
    return;
  }

  grid.innerHTML = filteredAccounts.map(account => `
    <div class="account-card ${state.selectedAccount === account.id ? "selected" : ""}" onclick="selectAccount('${account.id}')">
      <div class="account-name">${escapeHtml(account.name)}</div>
      <div class="account-id">${escapeHtml(account.account_id || account.id)}</div>
      <div class="account-stats">
        <div class="account-stat">
          R$ ${fmtMoney(parseFloat(account.amount_spent || 0) / 100)}
          <span>Gasto total</span>
        </div>
      </div>
    </div>
  `).join("");
}

async function selectAccount(accountId) {
  if (accountId === REFRESH_ACCOUNTS_OPTION_VALUE) {
    await refreshAdAccountsFromMeta();
    return;
  }

  if (state.isClientView && state.lockedAccountId && accountId !== state.lockedAccountId) {
    document.getElementById("account-select").value = state.lockedAccountId;
    showToast("A conta compartilhada esta bloqueada para o cliente.");
    return;
  }

  const filteredAccounts = getFilteredAccounts();
  if (accountId && !filteredAccounts.some(account => account.id === accountId)) {
    showToast(`Essa conta nao pertence a visualizacao ${getObjectiveLabel(state.selectedObjectiveType).toLowerCase()}.`);
    document.getElementById("account-select").value = state.selectedAccount || "";
    return;
  }

  const boundProfileId = !state.isClientView ? state.accountBindings?.[accountId] : "";
  if (boundProfileId && boundProfileId !== state.activeProfileId) {
    const boundProfile = state.profiles.find(item => item.id === boundProfileId && item.hasToken);
    if (boundProfile) {
      setActiveProfileId(boundProfileId);
      renderProfilesList();
      renderSavedClientsList();
      updateActiveProfileUI();
      fetchAdAccounts();
      return;
    }
  }

  state.selectedAccount = accountId;
  document.getElementById("account-select").value = accountId;

  const account = state.adAccounts.find(item => item.id === accountId);
  if (account) {
    document.getElementById("header-client-name").textContent = state.isClientView ? state.clientName : account.name;
    document.getElementById("header-account").textContent = state.isClientView
      ? "VISUALIZAÇÃO"
      : (account.account_id || account.id);
  }

  populateAccountCards();
  restartDashboardAutoRefresh();
  if (!state.isClientView && accountId) {
    persistAccountBinding(accountId, state.activeProfileId);
  }
  loadData();
}

async function persistAccountBinding(accountId, profileId) {
  if (!accountId || !profileId || state.isClientView) return;
  if (state.accountBindings?.[accountId] === profileId) return;

  try {
    const data = await apiRequest("/account-bindings", {
      method: "POST",
      body: {
        accountId,
        profileId
      }
    });
    state.accountBindings = data.accountBindings || state.accountBindings;
  } catch (error) {
    console.warn("Nao foi possivel persistir o vinculo da conta.", error);
  }
}

async function loadData(options = {}) {
  const { silent = false } = options;
  if (!state.selectedAccount) {
    stopDashboardAutoRefresh();
    renderEmptyState();
    return;
  }

  const activeProfile = getActiveProfile();
  if (!state.isClientView && (!activeProfile?.hasToken || activeProfile.tokenInvalid)) {
    stopDashboardAutoRefresh();
    renderEmptyState();
    return;
  }

  if (silent && isLoadInProgress) return;

  if (currentDashboardAbortController) {
    currentDashboardAbortController.abort();
  }
  const requestController = new AbortController();
  currentDashboardAbortController = requestController;

  const requestId = ++currentLoadRequestId;
  const accountId = state.selectedAccount;
  isLoadInProgress = true;
  skipChartAnimationOnNextRender = silent;

  if (!silent) showLoadingState();

  const dateStart = document.getElementById("date-start").value;
  const dateEnd = document.getElementById("date-end").value;

  try {
    const params = new URLSearchParams({
      accountId,
      dateStart,
      dateEnd
    });

    if (state.isClientView && state.currentShareId) {
      params.set("shareId", state.currentShareId);
    } else if (activeProfile?.id) {
      params.set("profileId", activeProfile.id);
    }

    const data = await apiRequest(`/meta/dashboard?${params.toString()}`, {
      auth: !state.isClientView,
      signal: requestController.signal
    });

    if (requestId !== currentLoadRequestId || accountId !== state.selectedAccount) return;

    processDashboardData(data.dashboard);
    restartDashboardAutoRefresh();
  } catch (error) {
    if (error?.name === "AbortError") return;
    if (!state.isClientView && await maybeHandleMetaTokenInvalid(error)) return;
    showApiError(error.message || "Erro ao buscar dados do dashboard.");
  } finally {
    if (currentDashboardAbortController === requestController) {
      currentDashboardAbortController = null;
    }
    if (requestId === currentLoadRequestId) {
      isLoadInProgress = false;
    }
    if (!silent) skipChartAnimationOnNextRender = false;
  }
}

function processDashboardData(dashboard) {
  if (!dashboard?.overview) {
    state.lastDashboardData = null;
    renderEmptyState();
    return;
  }

  state.lastDashboardData = dashboard;
  updateKPIs(dashboard.overview);
  state.campaigns = Array.isArray(dashboard.campaigns) ? dashboard.campaigns : [];
  state.creatives = Array.isArray(dashboard.creatives) ? dashboard.creatives : [];
  renderCampaignsTable();
  renderCreatives();
  if (document.getElementById("content-geral")?.classList.contains("active")) {
    scheduleDashboardCharts(dashboard);
  }
}

function showLoadingState() {
  const spinner = '<div style="text-align:center;padding:20px"><div class="loading-spinner"></div><div class="loading-text">Buscando dados do Meta...</div></div>';
  ["kpi-impressoes", "kpi-alcance", "kpi-gasto", "kpi-compras", "kpi-cpp"].forEach(id => {
    document.getElementById(id).textContent = "...";
  });
  document.getElementById("funnel-wrap").innerHTML = spinner;
  document.getElementById("campaigns-tbody").innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px"><div class="loading-spinner" style="margin:0 auto"></div></td></tr>';
  document.getElementById("creatives-grid").innerHTML = spinner;
}

function renderEmptyState() {
  state.lastDashboardData = null;
  ["kpi-impressoes", "kpi-alcance", "kpi-gasto", "kpi-compras", "kpi-cpp"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
  ["kpi-impressoes-delta", "kpi-alcance-delta", "kpi-gasto-delta", "kpi-compras-delta", "kpi-cpp-delta"].forEach(id => {
    document.getElementById(id).textContent = "";
  });

  document.getElementById("funnel-wrap").innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:30px 10px;font-family:'IBM Plex Mono',monospace;line-height:1.6">Vincule um perfil Meta para ver o funil</div>`;
  ["bm-cac", "bm-cpp", "bm-cpm", "mm-video", "mm-roas", "mm-conv"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });
  ["mm-roas-delta", "mm-conv-delta"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });
  updateDashboardLabels();

  renderLineChart({});
  document.getElementById("campaigns-tbody").innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:12px">Vincule um perfil Meta para ver as campanhas</td></tr>`;
  document.getElementById("campaigns-badge").textContent = "0 campanhas";
  document.getElementById("creatives-grid").innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px">Vincule um perfil Meta para visualizar os criativos</div>`;
  document.getElementById("creatives-badge").textContent = "0 criativos";
  destroyChart("donut");
  document.getElementById("donut-legend").innerHTML = `<div style="color:var(--text-muted);font-size:11px;font-family:'IBM Plex Mono',monospace">Sem dados</div>`;
  state.campaigns = [];
  state.creatives = [];
}

function showApiError(message) {
  renderEmptyState();
  if (!state.isClientView) updateMetaStatus(false);
  showToast(message || "Erro ao conectar ao backend.");
}

function setElementColor(id, color = "") {
  const element = document.getElementById(id);
  if (element) element.style.color = color;
}

function applyDashboardMetricColors() {
  setElementColor("kpi-gasto", "var(--red)");
  setElementColor("kpi-compras", "var(--blue)");
  setElementColor("kpi-cpp", "var(--red)");

  if (state.selectedObjectiveType === "purchase") {
    setElementColor("mm-roas", "var(--blue)");
    setElementColor("mm-conv", "var(--green)");
  } else {
    setElementColor("mm-roas", "");
    setElementColor("mm-conv", "");
  }
}

async function maybeHandleMetaTokenInvalid(error) {
  if (error?.code !== "META_TOKEN_INVALID") return false;

  try {
    await refreshBootstrap();
  } catch {
    // noop
  }

  renderProfilesList();
  updateActiveProfileUI();
  updateMetaStatus(false);
  renderEmptyState();
  openReconnectModal(getActiveProfile());
  showToast("O System User Token deste perfil precisa ser atualizado.");
  return true;
}

function updateKPIs(data) {
  const config = getSelectedObjectiveConfig();
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  updateDashboardLabels();
  setText("kpi-impressoes", fmtNum(data.impressions));
  setText("kpi-alcance", fmtNum(data.reach));
  setText("kpi-gasto", `R$ ${fmtMoney(data.spend)}`);
  setText("kpi-compras", config.resultFormatter(data[config.resultKey] || 0));
  setText("kpi-cpp", config.costValue(data));

  ["kpi-impressoes-delta", "kpi-alcance-delta", "kpi-gasto-delta", "kpi-compras-delta", "kpi-cpp-delta"].forEach(id => {
    const element = document.getElementById(id);
    if (element && !element.textContent) element.textContent = "";
  });

  renderFunnel(config.funnelSteps(data));

  const bottomMetrics = config.bottomMetrics(data);
  setText("bm-cac", bottomMetrics[0]?.value || "");
  setText("bm-cpp", bottomMetrics[1]?.value || "");
  setText("bm-cpm", bottomMetrics[2]?.value || "");

  state.currentOverviewMetrics = {
    thruplay: data.thruplays,
    video50: data.video50,
    video75: data.video75,
    pageView: data.pageView
  };
  renderOverviewMetricCard();
  setText("mm-roas", config.metricPrimaryValue(data));
  document.getElementById("mm-roas").style.color = config.metricPrimaryColor;
  setText("mm-conv", config.metricSecondaryValue(data));
  applyDashboardMetricColors();
}

function renderOverviewMetricCard() {
  const valueElement = document.getElementById("mm-video");
  const selectElement = document.getElementById("metric-filter-select");
  if (!valueElement || !selectElement) return;

  const metricMap = {
    thruplay: { value: state.currentOverviewMetrics.thruplay },
    video50: { value: state.currentOverviewMetrics.video50 },
    video75: { value: state.currentOverviewMetrics.video75 },
    pageView: { value: state.currentOverviewMetrics.pageView }
  };

  const selectedKey = metricMap[state.selectedOverviewMetric] ? state.selectedOverviewMetric : "thruplay";
  state.selectedOverviewMetric = selectedKey;
  selectElement.value = selectedKey;
  valueElement.textContent = fmtNum(metricMap[selectedKey].value);
}

function updateOverviewMetric(metricKey) {
  state.selectedOverviewMetric = metricKey;
  renderOverviewMetricCard();
}

function renderFunnel(steps) {
  const colors = ["#4a9eff", "#5cb8f0", "#70c8e0", "#85d0c8"];
  const widths = [300, 252, 212, 168];
  const wrap = document.getElementById("funnel-wrap");
  wrap.innerHTML = "";

  steps.forEach((step, index) => {
    const width = widths[index] || Math.max(144, widths[widths.length - 1] - ((index - widths.length + 1) * 24));
    const div = document.createElement("div");
    div.className = "funnel-step";
    div.innerHTML = `
      ${index > 0 ? '<div class="funnel-connector"></div>' : ""}
      <div class="funnel-bar" style="width:${width}px;background:${colors[index]}">
        <div class="f-label">${escapeHtml(step.label)}</div>
        <div class="f-val">${fmtNum(step.value)}</div>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function renderCampaignsTable() {
  const config = getSelectedObjectiveConfig();
  const tbody = document.getElementById("campaigns-tbody");
  document.getElementById("campaigns-badge").textContent = `${state.campaigns.length} campanhas`;

  if (!state.campaigns.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:12px">Sem dados de campanha</td></tr>`;
    return;
  }

  tbody.innerHTML = state.campaigns.map((campaign, index) => `
    <tr>
      <td style="color:var(--text-muted);font-family:'IBM Plex Mono',monospace">${index + 1}.</td>
      <td>${escapeHtml(campaign.name)}</td>
      <td>${fmtNum(campaign.reach)}</td>
      <td>${fmtNum(campaign.impressions)}</td>
      <td class="tag-highlight">${fmtNum(campaign[config.tableAssistKey] || 0)}</td>
      <td class="tag-highlight">${fmtNum(campaign[config.tableMainKey] || 0)}</td>
      <td>R$ ${fmtMoney(campaign.spend)}</td>
      <td style="color:var(--accent);font-weight:700">${config.tableLastValue(campaign)}</td>
    </tr>
  `).join("");
}

function renderCreatives() {
  const config = getSelectedObjectiveConfig();
  const grid = document.getElementById("creatives-grid");
  document.getElementById("creatives-badge").textContent = `${state.creatives.length} criativos`;

  if (!state.creatives.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:13px">Sem criativos para o periodo selecionado</div>`;
    return;
  }

  const placeholders = ["AD", "VT", "RM", "CR", "MX"];
  grid.innerHTML = state.creatives.map((creative, index) => `
    <div class="creative-card" ${(creative.videoSourceUrl || creative.thumbnailUrl) ? `onclick="openCreativePreview('${escapeAttribute(creative.videoSourceUrl || creative.thumbnailUrl)}', '${escapeAttribute(creative.mediaType || "image")}', '${escapeAttribute(creative.name)}')"` : ""}>
      <div class="creative-thumb ${(creative.videoSourceUrl || creative.thumbnailUrl) ? "has-image" : ""} ${creative.mediaType === "video" ? "is-video" : "is-image"}">
        ${creative.mediaType === "video" && creative.videoSourceUrl
          ? `<canvas class="creative-video-canvas" aria-hidden="true"></canvas>
             <video src="${escapeAttribute(creative.videoSourceUrl)}" muted playsinline preload="auto" disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen" onloadedmetadata="handleCreativeVideoMetadata(this)" onseeked="handleCreativeVideoSeeked(this)" onerror="handleCreativeVideoError(this)"></video>
             ${creative.thumbnailUrl
               ? `<img class="creative-video-fallback" src="${escapeAttribute(creative.thumbnailUrl)}" alt="${escapeAttribute(creative.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="handleCreativeImageLoad(this)" onerror="handleCreativeImageError(this)">`
               : ""
             }`
          : creative.thumbnailUrl
            ? `<img src="${escapeAttribute(creative.thumbnailUrl)}" alt="${escapeAttribute(creative.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="handleCreativeImageLoad(this)" onerror="handleCreativeImageError(this)">`
            : ""
        }
        <div class="placeholder-icon">${placeholders[index % placeholders.length]}</div>
      </div>
      <div class="creative-info">
        <div class="creative-name">${escapeHtml(creative.name)}</div>
        <div class="creative-stats">
          <div class="creative-stat"><span>${escapeHtml(config.creativeAssistLabel)}</span><span>${fmtNum(creative[config.creativeAssistKey] || 0)}</span></div>
          <div class="creative-stat"><span>${escapeHtml(config.creativeMainLabel)}</span><span>${fmtNum(creative[config.creativeMainKey] || 0)}</span></div>
          <div class="creative-stat"><span>${escapeHtml(config.creativeExtraLabel)}</span><span>${fmtNum(creative[config.creativeExtraKey] || 0)}</span></div>
          <div class="creative-stat"><span>Gasto</span><span>R$ ${fmtMoney(creative.spend)}</span></div>
        </div>
      </div>
    </div>
  `).join("");
}

function handleCreativeImageLoad(imageElement) {
  imageElement.closest(".creative-thumb")?.classList.add("is-loaded");
}

function handleCreativeImageError(imageElement) {
  const thumb = imageElement.closest(".creative-thumb");
  if (thumb) thumb.classList.remove("is-loaded");
  imageElement.remove();
}

function handleCreativeVideoMetadata(videoElement) {
  const thumb = videoElement.closest(".creative-thumb");
  try {
    const duration = Number(videoElement.duration) || 0;
    const targetFrame = duration > 0 ? Math.min(Math.max(duration * 0.12, 0.35), 1.5) : 0.5;
    videoElement.currentTime = targetFrame;
  } catch {
    if (thumb) thumb.classList.add("is-loaded");
  }
}

function handleCreativeVideoSeeked(videoElement) {
  const thumb = videoElement.closest(".creative-thumb");
  const canvas = thumb?.querySelector(".creative-video-canvas");
  if (thumb && canvas) {
    const frameDrawn = drawCreativeVideoFrame(videoElement, canvas);
    if (frameDrawn) {
      thumb.classList.add("is-loaded");
      thumb.classList.add("video-frame-ready");
      videoElement.style.opacity = "1";
    } else {
      thumb.classList.add("is-loaded");
    }
  } else if (thumb) {
    thumb.classList.add("is-loaded");
  }
  videoElement.pause();
}

function handleCreativeVideoError(videoElement) {
  const thumb = videoElement.closest(".creative-thumb");
  if (thumb) thumb.classList.remove("is-loaded");
  videoElement.remove();
}

function drawCreativeVideoFrame(videoElement, canvasElement) {
  const sourceWidth = Number(videoElement.videoWidth || 0);
  const sourceHeight = Number(videoElement.videoHeight || 0);
  if (!sourceWidth || !sourceHeight || !canvasElement) return false;

  const thumb = canvasElement.closest(".creative-thumb");
  const targetWidth = Math.max(1, Math.round(thumb?.clientWidth || canvasElement.clientWidth || 160));
  const targetHeight = Math.max(1, Math.round(thumb?.clientHeight || canvasElement.clientHeight || 210));
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvasElement.width = Math.round(targetWidth * pixelRatio);
  canvasElement.height = Math.round(targetHeight * pixelRatio);
  canvasElement.style.width = `${targetWidth}px`;
  canvasElement.style.height = `${targetHeight}px`;

  const ctx = canvasElement.getContext("2d");
  if (!ctx) return false;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceAspect > targetAspect) {
    sw = Math.round(sourceHeight * targetAspect);
    sx = Math.round((sourceWidth - sw) / 2);
  } else {
    sh = Math.round(sourceWidth / targetAspect);
    sy = Math.round((sourceHeight - sh) * 0.18);
    sy = Math.max(0, Math.min(sy, sourceHeight - sh));
  }

  ctx.drawImage(videoElement, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  return true;
}

function openCreativePreview(mediaUrl, mediaType = "image", creativeName = "") {
  if (!mediaUrl) return;
  const modal = document.getElementById("creative-preview-modal");
  const image = document.getElementById("creative-preview-image");
  const video = document.getElementById("creative-preview-video");
  const title = document.getElementById("creative-preview-title");
  if (!modal || !image || !video || !title) return;

  if (mediaType === "video") {
    image.style.display = "none";
    video.style.display = "block";
    video.src = mediaUrl;
    video.load();
  } else {
    video.pause();
    video.style.display = "none";
    video.removeAttribute("src");
    image.style.display = "block";
    image.src = mediaUrl;
  }
  image.alt = creativeName || "Criativo";
  video.setAttribute("aria-label", creativeName || "Criativo");
  title.textContent = creativeName || "Preview do criativo";
  modal.style.display = "flex";
}

function closeCreativePreview() {
  const modal = document.getElementById("creative-preview-modal");
  const image = document.getElementById("creative-preview-image");
  const video = document.getElementById("creative-preview-video");
  if (modal) modal.style.display = "none";
  if (image) {
    image.src = EMPTY_IMAGE_SRC;
    image.alt = "";
    image.style.display = "";
  }
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.style.display = "none";
    video.removeAttribute("aria-label");
  }
}

function destroyChart(id) {
  if (state.charts[id]) {
    state.charts[id].destroy();
    delete state.charts[id];
  }
}

function renderLineChart(daily = {}) {
  if (typeof window.Chart !== "function") return;
  const config = getSelectedObjectiveConfig();
  destroyChart("line");
  const canvas = document.getElementById("line-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const animateChart = !skipChartAnimationOnNextRender;
  const labels = daily.labels || [];
  const primaryData = daily[config.chartPrimaryKey] || [];
  const secondaryData = daily[config.chartSecondaryKey] || [];

  state.charts.line = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: config.chartPrimaryLabel, data: primaryData, borderColor: "#a8c441", backgroundColor: "rgba(168,196,65,0.05)", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#a8c441", borderWidth: 2 },
        { label: config.chartSecondaryLabel, data: secondaryData, borderColor: "#ffffff", backgroundColor: "rgba(255,255,255,0.03)", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#ffffff", borderWidth: 2 }
      ]
    },
    options: {
      animation: animateChart ? undefined : false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#555", font: { size: 9 }, maxTicksLimit: 8 },
          grid: { color: "#1a1a1a" },
          border: { display: false }
        },
        y: {
          ticks: { color: "#555", font: { size: 9 } },
          grid: { color: "#1a1a1a" },
          border: { display: false }
        }
      }
    }
  });
}

function renderDonutChart() {
  if (typeof window.Chart !== "function") return;
  const config = getSelectedObjectiveConfig();
  destroyChart("donut");
  const canvas = document.getElementById("donut-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const animateChart = !skipChartAnimationOnNextRender;
  const data = state.creatives
    .filter(creative => Number(creative[config.donutMetricKey] || 0) > 0)
    .sort((a, b) => Number(b[config.donutMetricKey] || 0) - Number(a[config.donutMetricKey] || 0))
    .slice(0, 5);
  const total = data.reduce((sum, creative) => sum + Number(creative[config.donutMetricKey] || 0), 0);

  if (!data.length || total <= 0) {
    document.getElementById("donut-legend").innerHTML = `<div style="color:var(--text-muted);font-size:11px;font-family:'IBM Plex Mono',monospace">Sem dados</div>`;
    return;
  }

  state.charts.donut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map(creative => creative.name),
      datasets: [{
        data: data.map(creative => Number(creative[config.donutMetricKey] || 0)),
        backgroundColor: COLORS,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      animation: animateChart ? undefined : false,
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` ${context.label}: ${context.raw} (${((context.raw / total) * 100).toFixed(1)}%)`
          }
        }
      }
    }
  });

  document.getElementById("donut-legend").innerHTML = data.map((creative, index) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${COLORS[index]}"></div>
      <span class="legend-text">${escapeHtml(creative.name)} · ${((Number(creative[config.donutMetricKey] || 0) / total) * 100).toFixed(1)}%</span>
    </div>
  `).join("");
}

function scheduleDashboardCharts(dashboard) {
  const renderRequestId = ++currentChartRenderRequestId;
  const run = async () => {
    try {
      await ensureChartLibrary();
      if (renderRequestId !== currentChartRenderRequestId) return;
      if (dashboard !== state.lastDashboardData) return;
      renderLineChart(dashboard.daily || {});
      renderDonutChart();
    } catch (error) {
      console.warn("Nao foi possivel carregar os graficos do dashboard.", error);
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => {
      void run();
    }, { timeout: 1200 });
    return;
  }

  window.setTimeout(() => {
    void run();
  }, 0);
}

function switchTab(tab) {
  ["geral", "criativos", "contas", "perfil"].forEach(name => {
    document.getElementById(`tab-${name}`)?.classList.remove("active");
    document.getElementById(`content-${name}`)?.classList.remove("active");
  });
  document.getElementById("user-avatar")?.classList.remove("active");
  document.getElementById(`tab-${tab}`)?.classList.add("active");
  document.getElementById(`content-${tab}`)?.classList.add("active");
  if (tab === "perfil") {
    document.getElementById("user-avatar")?.classList.add("active");
  }
  if (tab === "geral" && state.lastDashboardData) {
    scheduleDashboardCharts(state.lastDashboardData);
  }
}

function openShareModal() {
  document.getElementById("share-modal").style.display = "flex";
  updateActiveProfileUI();
  renderSavedClientsList();
  syncShareDateInputs();

  const select = document.getElementById("share-account-select");
  const objectiveSelect = document.getElementById("share-objective-select");
  if (objectiveSelect) {
    objectiveSelect.value = state.selectedObjectiveType;
    handleShareObjectiveChange(objectiveSelect.value);
  }

  if (!state.editingClientId) {
    resetClientForm();
  }
}

function closeShareModal() {
  document.getElementById("share-modal").style.display = "none";
}

function openProfileModal() {
  if (state.isClientView) return;
  loadAdminProfileDetails();
  renderProfilesList();
  renderAdminUsersList();
  updateProfileAccessUI();
  switchTab("perfil");
}

async function generateClientLink() {
  const activeProfile = getActiveProfile();
  if (!activeProfile?.id) {
    showToast("Ative um perfil Meta antes de gerar o link.");
    return;
  }
  if (!activeProfile.hasToken || activeProfile.tokenInvalid) {
    showToast("Cadastre um System User Token nesse perfil antes de gerar o link.");
    return;
  }

  const clientName = document.getElementById("share-client-name").value.trim() || "Cliente";
  const accountId = document.getElementById("share-account-select").value || "";
  const objectiveType = document.getElementById("share-objective-select").value || state.selectedObjectiveType;
  const rangePreset = document.getElementById("share-range-preset").value || "last7";
  let dateStart = document.getElementById("share-date-start").value;
  let dateEnd = document.getElementById("share-date-end").value;
  const today = formatDate(new Date());
  const shareUrlElement = document.getElementById("share-url");
  const shareWrapElement = document.getElementById("share-url-wrap");

  if (!accountId) {
    showToast("Selecione uma conta de anuncio.");
    return;
  }

  if (rangePreset !== "custom") {
    const { start, end } = getPresetRange(rangePreset);
    dateStart = formatDate(start);
    dateEnd = formatDate(end);
    document.getElementById("share-date-start").value = dateStart;
    document.getElementById("share-date-end").value = dateEnd;
    syncShareDateInputs();
  }

  if (rangePreset === "custom" && (!dateStart || !dateEnd)) {
    showToast("Defina a data inicial e final do cliente.");
    return;
  }
  if ((dateStart && dateStart > today) || (dateEnd && dateEnd > today)) {
    showToast("Nao e permitido selecionar datas futuras.");
    syncShareDateInputs();
    return;
  }

  shareWrapElement.style.display = "block";
  shareUrlElement.textContent = "Gerando link...";

  try {
    await persistAccountBinding(accountId, activeProfile.id);
    const data = await apiRequest("/share", {
      method: "POST",
      body: {
        clientName,
        accountId,
        profileId: activeProfile.id,
        objectiveType,
        rangePreset,
        dateStart,
        dateEnd
      }
    });

    shareUrlElement.textContent = buildClientLinkFromShareId(data.id);
    showToast("Link gerado com sucesso!");
  } catch (error) {
    shareUrlElement.textContent = "Erro ao gerar link.";
    handleApiError(error, "Nao foi possivel gerar o link.");
  }
}

function copyLink() {
  const url = document.getElementById("share-url").textContent;
  if (!url || url === "—") {
    showToast("Gere um link primeiro!");
    return;
  }

  navigator.clipboard.writeText(url).then(() => {
    showToast("Link copiado!");
  }).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Link copiado!");
  });
}

function handleMobileClientBannerVisibility() {
  if (!state.isClientView) return;
  if (mobileBannerFrameId) return;

  mobileBannerFrameId = requestAnimationFrame(() => {
    mobileBannerFrameId = 0;

    if (window.innerWidth > 768) {
      document.body.classList.remove("client-banner-hidden");
      return;
    }

    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    if (currentScrollY <= 8) {
      document.body.classList.remove("client-banner-hidden");
      lastMobileScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastMobileScrollY + 8 && currentScrollY > 40) {
      document.body.classList.add("client-banner-hidden");
    } else if (currentScrollY < lastMobileScrollY - 8) {
      document.body.classList.remove("client-banner-hidden");
    }

    lastMobileScrollY = currentScrollY;
  });
}

function fmtNum(value) {
  return Math.round(Number(value) || 0).toLocaleString("pt-BR");
}

function fmtMoney(value) {
  return parseFloat(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function handleApiError(error, fallbackMessage) {
  if (error?.status === 401 && !state.isClientView) {
    showToast("Sua sessao expirou. Entre novamente.");
    doLogout(true);
    return;
  }
  showToast(error?.message || fallbackMessage);
}

function isDisplayPlaceholder(value) {
  const normalized = String(value || "").trim();
  return !normalized || (normalized.length <= 4 && /^[^A-Za-z0-9]+$/.test(normalized));
}

function copyAdminInviteToken() {
  const value = state.lastGeneratedInviteToken || document.getElementById("contas-token-value")?.textContent || "";
  if (isDisplayPlaceholder(value)) {
    showToast("Gere um token primeiro.");
    return;
  }

  navigator.clipboard.writeText(value).then(() => {
    showToast("Token copiado!");
  }).catch(() => {
    showToast("Nao foi possivel copiar o token.");
  });
}

function copyLink() {
  const url = document.getElementById("share-url").textContent;
  if (isDisplayPlaceholder(url)) {
    showToast("Gere um link primeiro!");
    return;
  }

  navigator.clipboard.writeText(url).then(() => {
    showToast("Link copiado!");
  }).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Link copiado!");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyDatePreset("last7");
  applyShareDatePreset("last7");
  syncDateRangeDisplay();
  updateObjectiveUI();
  updateDashboardLabels();
  loadAdminProfileDetails();
  renderProfilesList();
  renderSavedClientsList();
  renderAdminUsersList();
  updateProfileAccessUI();
  toggleAuthMode("login");

  document.addEventListener("keydown", event => {
    if (event.key !== "Enter" || state.isAdmin || state.isClientView) return;
    if (document.getElementById("admin-register")?.style.display === "block") {
      registerAdminAccess();
    } else {
      doLogin();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopDashboardAutoRefresh();
      return;
    }
    if (document.getElementById("app")?.style.display === "block") {
      restartDashboardAutoRefresh();
      loadData({ silent: true, source: "visibility-resume" });
    }
  });

  const rawHash = window.location.hash;
  if (rawHash.includes("access_token=")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    showToast("O fluxo antigo por login Meta foi desativado. Use System User Token no perfil Meta.");
  }

  const clientParams = getUrlParams();
  if (clientParams?.type === "client-share-id" && clientParams.shareId) {
    try {
      const share = await resolveClientShare(clientParams.shareId);
      if (share) {
        showClientView(share);
        return;
      }
    } catch {
      showToast("Link do cliente invalido ou indisponivel.");
    }
  }

  if (clientParams?.type === "legacy-client-link") {
    showToast("Esse formato antigo de link nao e mais suportado. Gere um novo link seguro.");
  }

  if (await restoreSession()) {
    return;
  }

  showLoginScreen();
});

document.getElementById("share-modal").addEventListener("click", function(event) {
  if (event.target === this) closeShareModal();
});

document.getElementById("reconnect-modal").addEventListener("click", function(event) {
  if (event.target === this) closeReconnectModal();
});

document.getElementById("creative-preview-modal").addEventListener("click", function(event) {
  if (event.target === this) closeCreativePreview();
});

document.getElementById("date-range-picker")?.addEventListener("click", event => {
  event.stopPropagation();
});

document.addEventListener("click", event => {
  const picker = document.getElementById("date-range-picker");
  const objectiveWrap = document.getElementById("objective-selector-wrap");
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  const clickedInsidePicker = picker && (picker.contains(event.target) || path.includes(picker));
  const clickedInsideObjectiveMenu = objectiveWrap && (objectiveWrap.contains(event.target) || path.includes(objectiveWrap));
  if (picker && !clickedInsidePicker) {
    closeDateRangePicker();
  }
  if (objectiveWrap && !clickedInsideObjectiveMenu) {
    closeObjectiveMenu();
  }
});

window.addEventListener("scroll", handleMobileClientBannerVisibility, { passive: true });
window.addEventListener("resize", handleMobileClientBannerVisibility);
