import { setState } from "../core/state.js";
import { setHtml } from "../utils/dom.js";

const ERA_DEFS = [
  { key: "renaissance", label: "文藝復興",  start: 1400, end: 1600 },
  { key: "baroque",     label: "巴洛克",    start: 1600, end: 1750 },
  { key: "classical",   label: "古典",      start: 1750, end: 1820 },
  { key: "romantic",    label: "浪漫",      start: 1820, end: 1900 },
  { key: "modern",      label: "現代",      start: 1900, end: 2100 },
];

function composersForEra(composers, eraKey) {
  if (eraKey === "all") return composers;
  const era = ERA_DEFS.find(e => e.key === eraKey);
  if (!era) return composers;
  return composers.filter(c => c.birth < era.end && (c.death ?? 2100) > era.start);
}

export function renderControlBar(model, rerender) {
  const root = document.querySelector("#control-bar");
  if (!root) return;

  const { selectedEra, selectedComposerId } = model.state;

  const eraOptions = [
    `<option value="all"${selectedEra === "all" ? " selected" : ""}>全部時期</option>`,
    ...ERA_DEFS.map(e =>
      `<option value="${e.key}"${selectedEra === e.key ? " selected" : ""}>${e.label}</option>`
    ),
  ].join("");

  const filteredComposers = composersForEra(model.composers, selectedEra);
  const composerOptions = filteredComposers.map(c =>
    `<option value="${c.id}"${c.id === selectedComposerId ? " selected" : ""}>${c.name}</option>`
  ).join("");

  setHtml(root, `
    <form style="display:flex;gap:0.875rem;align-items:flex-end;flex-wrap:wrap">
      <div class="field-group">
        <label class="field-label" for="era-select">音樂史時期</label>
        <select class="field-control" id="era-select" name="era">${eraOptions}</select>
      </div>
      <div class="field-group">
        <label class="field-label" for="composer-select">音樂家</label>
        <select class="field-control" id="composer-select" name="composer" style="width:260px">${composerOptions}</select>
      </div>
    </form>
  `);

  root.querySelector("#era-select").addEventListener("change", e => {
    const newEra = e.target.value;
    const available = composersForEra(model.composers, newEra);
    const stillValid = available.find(c => c.id === model.state.selectedComposerId);
    const nextComposer = stillValid ?? available[0] ?? null;
    const composerWorks = nextComposer
      ? model.works.filter(w => w.composerId === nextComposer.id)
      : [];
    const defaultWork = composerWorks.find(w => w.media?.youtubeId) ?? composerWorks[0] ?? null;
    setState({
      selectedEra: newEra,
      selectedComposerId: nextComposer?.id ?? null,
      selectedWorkId: defaultWork?.id ?? null,
    });
    rerender();
  });

  root.querySelector("#composer-select").addEventListener("change", e => {
    const newId = e.target.value;
    const composerWorks = model.works.filter(w => w.composerId === newId);
    const defaultWork = composerWorks.find(w => w.media?.youtubeId) ?? composerWorks[0] ?? null;
    setState({ selectedComposerId: newId, selectedWorkId: defaultWork?.id ?? null });
    rerender();
  });
}
