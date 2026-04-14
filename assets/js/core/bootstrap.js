import { appConfig } from "./config.js";
import { loadPersistedState, setState, state } from "./state.js";
import { loadJson } from "../utils/fetch-json.js";
import { renderControlBar } from "../components/control-bar.js";
import { renderTimelineView } from "../components/timeline-view.js";
import { renderGanttView } from "../components/gantt-view.js";
import { renderVisualizationView } from "../components/visualization-view.js";
import { renderPreviewPanel } from "../components/preview-panel.js";
import { renderContextPanel } from "../components/context-panel.js";

export async function bootstrapApp() {
  const [
    composers,
    contexts,
    periodColors,
    workTypeLabels,
    ...composerData
  ] = await Promise.all([
    loadJson(appConfig.dataPaths.composers),
    loadJson(appConfig.dataPaths.contexts),
    loadJson(appConfig.dataPaths.periodColors),
    loadJson(appConfig.dataPaths.workTypeLabels),
    ...appConfig.composerDataIds.flatMap(id => [
      loadJson(`${appConfig.dataPaths.worksDir}/${id}.json`),
      loadJson(`${appConfig.dataPaths.eventsDir}/${id}.json`)
    ])
  ]);

  const works = composerData.filter((_, i) => i % 2 === 0).flat();
  const events = composerData.filter((_, i) => i % 2 === 1).flat();

  const persisted = loadPersistedState();
  const currentComposer = composers.find(
    (composer) => composer.id === persisted?.selectedComposerId
  ) ?? composers.find(
    (composer) => composer.id === appConfig.defaultComposerId
  ) ?? composers[0];

  const validSelectedWork = works.find(
    (work) => work.id === persisted?.selectedWorkId && work.composerId === currentComposer?.id
  ) ?? null;
  const validSelectedEvent = events.find(
    (event) => event.id === persisted?.selectedEventId && event.composerId === currentComposer?.id
  ) ?? null;
  const showProfile = !validSelectedWork && !validSelectedEvent;

  setState({
    selectedEra: persisted?.selectedEra ?? "all",
    selectedType: persisted?.selectedType ?? "all",
    selectedPeriod: persisted?.selectedPeriod ?? "all",
    hideEvents: persisted?.hideEvents ?? false,
    searchTerm: persisted?.searchTerm ?? "",
    timeRange: persisted?.timeRange ?? null,
    selectedComposerId: currentComposer?.id ?? null,
    selectedProfileId: showProfile ? (currentComposer?.id ?? null) : null,
    selectedWorkId: validSelectedWork?.id ?? null,
    selectedEventId: validSelectedEvent?.id ?? null,
    selectedContextId: persisted?.selectedContextId ?? null
  });

  const model = {
    composers,
    works,
    events,
    contexts,
    mappings: {
      periodColors,
      workTypeLabels
    },
    state
  };

  const renderApp = () => {
    renderControlBar(model, renderApp);
    renderGanttView(model, renderApp);
    renderTimelineView(model, renderApp);
    renderPreviewPanel(model);
    renderVisualizationView(model, renderApp);
    renderContextPanel(model);
  };

  renderApp();
}
