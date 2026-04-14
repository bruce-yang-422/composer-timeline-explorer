import { appConfig } from "./config.js";
import { loadPersistedState, setState, state } from "./state.js";
import { loadJson } from "../utils/fetch-json.js";
import { renderControlBar } from "../components/control-bar.js";
import { renderTimelineView } from "../components/timeline-view.js";
import { renderGanttView } from "../components/gantt-view.js";
import { renderVisualizationView } from "../components/visualization-view.js";
import { renderPreviewPanel } from "../components/preview-panel.js";
import { renderContextPanel } from "../components/context-panel.js";

function normalizeLegacyWorkId(workId, composerId) {
  if (!workId || !composerId) return workId ?? null;
  if (workId.startsWith(`${composerId}-`)) return workId;
  return `${composerId}-${workId}`;
}

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

  const legacySelectedWorkId = normalizeLegacyWorkId(persisted?.selectedWorkId, currentComposer?.id);
  const validSelectedWork = works.find(
    (work) => work.id === persisted?.selectedWorkId && work.composerId === currentComposer?.id
  ) ?? works.find(
    (work) => work.id === legacySelectedWorkId && work.composerId === currentComposer?.id
  ) ?? null;
  const validSelectedEvent = events.find(
    (event) => event.id === persisted?.selectedEventId && event.composerId === currentComposer?.id
  ) ?? null;
  const persistedChapterIndex = Number.isInteger(persisted?.selectedChapterIndex)
    ? persisted.selectedChapterIndex
    : null;
  const mediaSourceCount = validSelectedWork?.media
    ? 1 + (Array.isArray(validSelectedWork.media.alternateRecordings) ? validSelectedWork.media.alternateRecordings.length : 0)
    : 0;
  const persistedMediaSourceIndex = Number.isInteger(persisted?.selectedMediaSourceIndex)
    ? persisted.selectedMediaSourceIndex
    : null;
  const validSelectedMediaSourceIndex = mediaSourceCount
    ? Math.min(Math.max(persistedMediaSourceIndex ?? 0, 0), mediaSourceCount - 1)
    : null;
  const validChapterIndex = validSelectedWork?.media?.chapters?.length
    ? Math.min(Math.max(persistedChapterIndex ?? 0, 0), validSelectedWork.media.chapters.length - 1)
    : null;
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
    selectedChapterIndex: validChapterIndex,
    selectedMediaSourceIndex: validSelectedMediaSourceIndex,
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
    renderPreviewPanel(model, renderApp);
    renderVisualizationView(model, renderApp);
    renderContextPanel(model);
  };

  renderApp();
}
