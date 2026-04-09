import { appConfig } from "./config.js";
import { setState, state } from "./state.js";
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
    works,
    events,
    contexts,
    periodColors,
    workTypeLabels
  ] = await Promise.all([
    loadJson(appConfig.dataPaths.composers),
    loadJson(appConfig.dataPaths.works),
    loadJson(appConfig.dataPaths.events),
    loadJson(appConfig.dataPaths.contexts),
    loadJson(appConfig.dataPaths.periodColors),
    loadJson(appConfig.dataPaths.workTypeLabels)
  ]);

  const currentComposer = composers.find(
    (composer) => composer.id === appConfig.defaultComposerId
  ) ?? composers[0];

  setState({
    selectedComposerId: currentComposer?.id ?? null,
    selectedProfileId: currentComposer?.id ?? null,
    selectedWorkId: null,
    selectedEventId: null
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
