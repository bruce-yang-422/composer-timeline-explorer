export const state = {
  selectedComposerId: null,
  selectedProfileId: null,
  selectedWorkId: null,
  selectedChapterIndex: null,
  selectedEventId: null,
  selectedContextId: null,
  selectedType: "all",
  selectedPeriod: "all",
  selectedEra: "all",
  hideEvents: false,
  searchTerm: "",
  timeRange: null
};

const SESSION_STORAGE_KEY = "composer-timeline-explorer:state";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function persistState() {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
}

export function loadPersistedState() {
  if (!canUseSessionStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setState(patch) {
  Object.assign(state, patch);
  persistState();
}
