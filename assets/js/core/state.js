export const state = {
  selectedComposerId: null,
  selectedWorkId: null,
  selectedEventId: null,
  selectedContextId: null,
  selectedType: "all",
  selectedPeriod: "all",
  selectedEra: "all",
  hideEvents: false,
  searchTerm: "",
  timeRange: null
};

export function setState(patch) {
  Object.assign(state, patch);
}
