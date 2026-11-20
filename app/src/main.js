// Wires the Neon Coast Cover Studio editor: panels, photos, caption,
// layout, grade and export sizes. A `?shot=` query sets up a fixed scene
// for a screenshot instead (./shots.js).
import { drawCover, GRADES, LAYOUTS } from './cover.js';
import { SCENES } from './scenes.js';
import { runShot } from './shots.js';

const SIZES = {
  square: { label: '1080 x 1080', w: 1080, h: 1080 },
  poster: { label: '1080 x 1350', w: 1080, h: 1350 },
  story: { label: '1920 x 1080', w: 1920, h: 1080 },
};

const state = {
  panels: [
    { kind: 'scene', id: 'boulevard' },
    { kind: 'scene', id: 'pier' },
    { kind: 'scene', id: 'rooftop' },
    { kind: 'scene', id: 'neon' },
  ],
  layout: 'poster',
  grade: 'sunset',
  size: 'poster',
  title: 'Neon Coast',
  subtitle: 'Sunset Heist',
  activePanel: 0,
  onePhoto: false,
};

const preview = document.getElementById('preview');
const status = document.getElementById('status');

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Paints the live preview at a fixed on-screen size. */
function redraw() {
  const size = SIZES[state.size];
  preview.width = size.w;
  preview.height = size.h;
  drawCover(preview, {
    panels: state.panels,
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
  });
  document.getElementById('panelCount').textContent =
    `${state.panels.filter((p) => p.kind === 'photo').length} photo panel(s) loaded`;
}

/** Renders one procedural scene to a data URL, so it behaves like a photo. */
function scenePhoto(id) {
  const off = document.createElement('canvas');
  off.width = 800;
  off.height = 600;
  const ctx = off.getContext('2d');
  const scene = SCENES.find((s) => s.id === id) ?? SCENES[0];
  scene.draw(ctx, 0, 0, 800, 600);
  return new Promise((resolve) => {
    off.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      loadImage(url).then(resolve);
    }, 'image/png');
  });
}

/** Applies a loaded photo to a panel (or to every panel, when linked). */
async function applyPhoto(index, image) {
  const put = (i) => {
    state.panels[i] = { kind: 'photo', image, zoom: 1, ox: 0, oy: 0 };
  };
  if (state.onePhoto) {
    for (let i = 0; i < state.panels.length; i++) put(i);
  } else {
    put(index);
  }
  redraw();
}

/** Builds the panel controls: one card per panel with photo/scene/crop. */
export function buildPanelCards() {
  const host = document.getElementById('panels');
  host.innerHTML = '';
  state.panels.forEach((panel, i) => {
    const card = document.createElement('div');
    card.className = 'panel-card';
    card.dataset.active = String(i === state.activePanel);
    const title = document.createElement('h3');
    title.textContent = `Panel ${i + 1}`;
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.setAttribute('aria-label', `Photo for panel ${i + 1}`);
    file.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      state.activePanel = i;
      applyPhoto(i, await loadImage(URL.createObjectURL(f)));
      buildPanelCards();
    });
    const scene = document.createElement('select');
    scene.setAttribute('aria-label', `Scene for panel ${i + 1}`);
    for (const s of SCENES) {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      scene.appendChild(o);
    }
    scene.value = panel.kind === 'scene' ? panel.id : SCENES[0].id;
    scene.addEventListener('change', async () => {
      state.activePanel = i;
      state.panels[i] = { kind: 'scene', id: scene.value };
      redraw();
      buildPanelCards();
    });
    const sample = document.createElement('button');
    sample.type = 'button';
    sample.textContent = 'Use as photo';
    sample.addEventListener('click', async () => {
      state.activePanel = i;
      applyPhoto(i, await scenePhoto(scene.value));
      buildPanelCards();
    });
    const zoomLabel = document.createElement('label');
    zoomLabel.textContent = 'Zoom';
    const zoom = document.createElement('input');
    zoom.type = 'range';
    zoom.min = '1';
    zoom.max = '3';
    zoom.step = '0.05';
    zoom.value = String(panel.kind === 'photo' ? (panel.zoom ?? 1) : 1);
    zoom.disabled = panel.kind !== 'photo';
    zoom.addEventListener('input', () => {
      if (state.panels[i].kind === 'photo') state.panels[i].zoom = Number(zoom.value);
      redraw();
    });
    const xLabel = document.createElement('label');
    xLabel.textContent = 'Move X';
    const ox = document.createElement('input');
    ox.type = 'range';
    ox.min = '-0.5';
    ox.max = '0.5';
    ox.step = '0.01';
    ox.value = String(panel.kind === 'photo' ? (panel.ox ?? 0) : 0);
    ox.disabled = panel.kind !== 'photo';
    ox.addEventListener('input', () => {
      if (state.panels[i].kind === 'photo') state.panels[i].ox = Number(ox.value);
      redraw();
    });
    const yLabel = document.createElement('label');
    yLabel.textContent = 'Move Y';
    const oy = document.createElement('input');
    oy.type = 'range';
    oy.min = '-0.5';
    oy.max = '0.5';
    oy.step = '0.01';
    oy.value = String(panel.kind === 'photo' ? (panel.oy ?? 0) : 0);
    oy.disabled = panel.kind !== 'photo';
    oy.addEventListener('input', () => {
      if (state.panels[i].kind === 'photo') state.panels[i].oy = Number(oy.value);
      redraw();
    });
    zoomLabel.appendChild(zoom);
    xLabel.appendChild(ox);
    yLabel.appendChild(oy);
    card.append(title, file, scene, sample, zoomLabel, xLabel, yLabel);
    card.addEventListener('click', (e) => {
      if (e.target === card || e.target === title) {
        state.activePanel = i;
        buildPanelCards();
      }
    });
    host.appendChild(card);
  });
}

/** Fills a <select> with options and wires its change event. */
function fillSelect(id, entries, value, onChange) {
  const el = document.getElementById(id);
  for (const [v, label] of entries) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = label;
    el.appendChild(o);
  }
  el.value = value;
  el.addEventListener('change', () => onChange(el.value));
}

fillSelect('layout', LAYOUTS.map((l) => [l, { poster: 'Poster (hero + 3)', grid: 'Grid 2 x 2', bleed: 'Full bleed', story: 'Wide story' }[l]]), state.layout, (v) => { state.layout = v; redraw(); });
fillSelect('grade', GRADES.map((g) => [g, { sunset: 'Sunset', neon: 'Neon night', gold: 'Vice gold', noir: 'Noir' }[g]]), state.grade, (v) => { state.grade = v; redraw(); });
fillSelect('size', Object.entries(SIZES).map(([k, s]) => [k, s.label]), state.size, (v) => { state.size = v; redraw(); });

document.getElementById('title').addEventListener('input', (e) => { state.title = e.target.value; redraw(); });
document.getElementById('subtitle').addEventListener('input', (e) => { state.subtitle = e.target.value; redraw(); });
document.getElementById('onePhoto').addEventListener('change', (e) => { state.onePhoto = e.target.checked; });

document.getElementById('export').addEventListener('click', () => {
  const size = SIZES[state.size];
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, {
    panels: state.panels,
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
  });
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neon-coast-cover-${size.w}x${size.h}.png`;
    a.click();
    status.textContent = `Saved neon-coast-cover-${size.w}x${size.h}.png`;
  }, 'image/png');
});

/** Used by ?shot=selftest: exports and reports the PNG size in the page. */
export async function selfTestExport() {
  const size = SIZES[state.size];
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, {
    panels: state.panels,
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
  });
  const blob = await new Promise((resolve) => off.toBlob(resolve, 'image/png'));
  const el = document.getElementById('selftest');
  el.textContent = `EXPORT OK ${blob.size} bytes ${size.w}x${size.h}`;
  return blob.size;
}

const query = new URLSearchParams(location.search);
const shot = query.get('shot');
buildPanelCards();
// Re-paint once the vendored display fonts arrive, so the live preview
// uses Anton/Pacifico instead of the fallback.
if (document.fonts?.ready) document.fonts.ready.then(() => redraw());
if (shot) {
  await runShot(shot, query, state, redraw, scenePhoto, selfTestExport, buildPanelCards);
} else {
  redraw();
}
