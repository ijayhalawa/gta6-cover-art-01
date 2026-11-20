// Fixed scenes for screenshots. `?shot=cover` paints the cover full-frame;
// `?shot=editor` shows the editor with a sample photo loaded into panel 1;
// `?shot=selftest` exports a PNG and reports its size in the page.
// window.__shotReady is set once the scene has painted.
export async function runShot(shot, query, state, redraw, scenePhoto, selfTestExport, rebuildPanels) {
  const caption = query.get('caption') ?? 'Neon Coast';
  const subtitle = query.get('subtitle') ?? 'Sunset Heist';
  const layout = query.get('layout') ?? 'poster';
  const grade = query.get('grade') ?? 'sunset';
  const size = query.get('size') ?? 'poster';

  // Lettering must use the vendored fonts, not the fallback: wait for them.
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
  } catch { /* fall back to system fonts */ }

  state.title = caption;
  state.subtitle = subtitle;
  state.layout = layout;
  state.grade = grade;
  state.size = size;

  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    document.getElementById('layout').value = layout;
    document.getElementById('grade').value = grade;
    document.getElementById('size').value = size;
    document.getElementById('title').value = caption;
    document.getElementById('subtitle').value = subtitle;
    redraw();
  } else if (shot === 'editor') {
    const photo = await scenePhoto(query.get('photo') ?? 'boulevard');
    state.panels[0] = { kind: 'photo', image: photo, zoom: 1, ox: 0, oy: 0 };
    state.activePanel = 0;
    document.getElementById('layout').value = layout;
    document.getElementById('grade').value = grade;
    document.getElementById('size').value = size;
    document.getElementById('title').value = caption;
    document.getElementById('subtitle').value = subtitle;
    if (typeof rebuildPanels === 'function') rebuildPanels();
    redraw();
  } else if (shot === 'selftest') {
    document.body.classList.add('shot-cover');
    redraw();
    await selfTestExport();
  }
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
