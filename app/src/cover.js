// The cover renderer for Neon Coast Cover Studio.
// Draws the whole poster on a 2D canvas: a hero scene with an original
// convertible and two original characters, vignette panels, a bold title
// block and a colour grade. Everything is drawn from code, so the same
// inputs always paint the same cover.

import { drawScene, rng } from './scenes.js';

/** Draws a photo (or scene) into a panel rect, cover-fit, with zoom/offset. */
export function drawPanelSource(ctx, source, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (!source || source.kind === 'scene') {
    drawScene(ctx, source?.id ?? 'boulevard', x, y, w, h);
  } else if (source.kind === 'photo' && source.image) {
    const img = source.image;
    const zoom = source.zoom ?? 1;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const pw = img.naturalWidth * scale;
    const ph = img.naturalHeight * scale;
    const dx = x + (w - pw) / 2 + (source.ox ?? 0) * w;
    const dy = y + (h - ph) / 2 + (source.oy ?? 0) * h;
    ctx.drawImage(img, dx, dy, pw, ph);
  } else {
    ctx.fillStyle = '#2b1838';
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

/** A convertible in side profile, facing right, inside the rect. */
function drawCar(ctx, x, y, w, h) {
  const u = w / 100; // unit
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(u, u);
  // shadow
  ctx.fillStyle = 'rgba(10, 4, 20, 0.45)';
  ctx.beginPath();
  ctx.ellipse(50, 96, 46, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.fillStyle = '#e8375f';
  ctx.beginPath();
  ctx.moveTo(4, 78);
  ctx.quadraticCurveTo(6, 66, 20, 63);
  ctx.lineTo(34, 60);
  ctx.quadraticCurveTo(40, 44, 52, 42);
  ctx.lineTo(66, 42);
  ctx.quadraticCurveTo(76, 42, 82, 52);
  ctx.lineTo(94, 60);
  ctx.quadraticCurveTo(98, 62, 98, 70);
  ctx.lineTo(98, 78);
  ctx.quadraticCurveTo(98, 84, 92, 84);
  ctx.lineTo(10, 84);
  ctx.quadraticCurveTo(4, 84, 4, 78);
  ctx.closePath();
  ctx.fill();
  // body highlight
  ctx.fillStyle = '#ff6b8a';
  ctx.beginPath();
  ctx.moveTo(8, 66);
  ctx.quadraticCurveTo(30, 60, 94, 62);
  ctx.lineTo(94, 67);
  ctx.quadraticCurveTo(40, 65, 8, 70);
  ctx.closePath();
  ctx.fill();
  // windshield + cabin
  ctx.fillStyle = '#1b2b4a';
  ctx.beginPath();
  ctx.moveTo(40, 58);
  ctx.quadraticCurveTo(45, 46, 54, 44);
  ctx.lineTo(64, 44);
  ctx.quadraticCurveTo(72, 44, 77, 53);
  ctx.lineTo(78, 58);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(140, 220, 255, 0.5)';
  ctx.beginPath();
  ctx.moveTo(44, 56);
  ctx.quadraticCurveTo(48, 48, 55, 47);
  ctx.lineTo(60, 47);
  ctx.quadraticCurveTo(66, 47, 70, 54);
  ctx.lineTo(71, 56);
  ctx.closePath();
  ctx.fill();
  // seats
  ctx.fillStyle = '#f5e6c8';
  ctx.beginPath();
  ctx.moveTo(48, 58);
  ctx.lineTo(50, 48);
  ctx.lineTo(56, 48);
  ctx.lineTo(56, 58);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(62, 58);
  ctx.lineTo(64, 48);
  ctx.lineTo(70, 48);
  ctx.lineTo(70, 58);
  ctx.closePath();
  ctx.fill();
  // chrome strip
  ctx.fillStyle = '#ffd27a';
  ctx.fillRect(4, 76, 94, 2.4);
  // headlight + taillight
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(95, 68, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff2e4d';
  ctx.fillRect(5, 66, 3, 6);
  // wheels
  for (const wx of [24, 78]) {
    ctx.fillStyle = '#12081f';
    ctx.beginPath();
    ctx.arc(wx, 84, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.arc(wx, 84, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#12081f';
    ctx.beginPath();
    ctx.arc(wx, 84, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Mara Voss: sunglasses, gold hoops, white linen shirt, leaning on the car. */
function drawMara(ctx, x, y, w, h) {
  const u = h / 100;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(u, u);
  ctx.lineCap = 'round';
  // legs
  ctx.strokeStyle = '#8a4b2d';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-6, 62);
  ctx.lineTo(-10, 98);
  ctx.moveTo(6, 62);
  ctx.lineTo(10, 98);
  ctx.stroke();
  // dress
  ctx.fillStyle = '#f2ead8';
  ctx.beginPath();
  ctx.moveTo(-12, 30);
  ctx.quadraticCurveTo(-16, 48, -12, 64);
  ctx.lineTo(12, 64);
  ctx.quadraticCurveTo(16, 48, 12, 30);
  ctx.closePath();
  ctx.fill();
  // shirt open over it
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-13, 28);
  ctx.lineTo(-4, 34);
  ctx.lineTo(-6, 62);
  ctx.lineTo(-13, 62);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(13, 28);
  ctx.lineTo(4, 34);
  ctx.lineTo(6, 62);
  ctx.lineTo(13, 62);
  ctx.closePath();
  ctx.fill();
  // arm resting forward, onto the car to her left
  ctx.strokeStyle = '#c98a5e';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-10, 34);
  ctx.quadraticCurveTo(-26, 40, -34, 52);
  ctx.stroke();
  // neck + head
  ctx.fillStyle = '#c98a5e';
  ctx.fillRect(-4, 20, 8, 10);
  ctx.beginPath();
  ctx.arc(0, 10, 11, 0, Math.PI * 2);
  ctx.fill();
  // hair
  ctx.fillStyle = '#241226';
  ctx.beginPath();
  ctx.arc(0, 6, 12, Math.PI * 0.95, Math.PI * 2.05);
  ctx.quadraticCurveTo(14, 14, 12, 30);
  ctx.lineTo(8, 30);
  ctx.quadraticCurveTo(10, 12, 0, 8);
  ctx.quadraticCurveTo(-12, 12, -12, 28);
  ctx.lineTo(-13, 12);
  ctx.closePath();
  ctx.fill();
  // sunglasses
  ctx.fillStyle = '#12081f';
  ctx.fillRect(-9, 7, 8, 5);
  ctx.fillRect(1, 7, 8, 5);
  ctx.fillRect(-1, 9, 2, 1.5);
  // gold hoops
  ctx.strokeStyle = '#ffd27a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(-11, 16, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(11, 16, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Dante Reyes: open floral shirt, gold chain, standing tall. */
function drawDante(ctx, x, y, w, h) {
  const u = h / 100;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(u, u);
  ctx.lineCap = 'round';
  // legs (dark trousers)
  ctx.strokeStyle = '#1e2a4a';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-5, 60);
  ctx.lineTo(-9, 98);
  ctx.moveTo(5, 60);
  ctx.lineTo(9, 98);
  ctx.stroke();
  // torso: open floral shirt over bare chest
  ctx.fillStyle = '#c98a5e';
  ctx.beginPath();
  ctx.moveTo(-11, 30);
  ctx.lineTo(11, 30);
  ctx.lineTo(10, 62);
  ctx.lineTo(-10, 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2fae8f';
  ctx.beginPath();
  ctx.moveTo(-13, 26);
  ctx.lineTo(-3, 32);
  ctx.lineTo(-6, 62);
  ctx.lineTo(-14, 62);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(13, 26);
  ctx.lineTo(3, 32);
  ctx.lineTo(6, 62);
  ctx.lineTo(14, 62);
  ctx.closePath();
  ctx.fill();
  // flowers on the shirt
  ctx.fillStyle = '#ff5e8a';
  for (const [fx, fy] of [[-10, 40], [9, 46], [-8, 54]]) {
    ctx.beginPath();
    ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  // arms
  ctx.strokeStyle = '#c98a5e';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-12, 32);
  ctx.lineTo(-18, 58);
  ctx.moveTo(12, 32);
  ctx.lineTo(18, 56);
  ctx.stroke();
  // gold chain
  ctx.strokeStyle = '#ffd27a';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 26, 8, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  // neck + head
  ctx.fillStyle = '#c98a5e';
  ctx.fillRect(-4, 18, 8, 10);
  ctx.beginPath();
  ctx.arc(0, 8, 11, 0, Math.PI * 2);
  ctx.fill();
  // short hair + beard
  ctx.fillStyle = '#1c1210';
  ctx.beginPath();
  ctx.arc(0, 4, 11.5, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 12, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#c98a5e';
  ctx.beginPath();
  ctx.arc(0, 9, 8.5, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.fill();
  ctx.restore();
}

/** The hero: background (a loaded photo, or the boulevard scene), convertible,
 *  Mara leaning on it, Dante beside it. */
export function drawHero(ctx, x, y, w, h, bg) {
  if (bg && bg.kind === 'photo') {
    drawPanelSource(ctx, bg, x, y, w, h);
  } else {
    drawScene(ctx, 'boulevard', x, y, w, h);
  }
  // The car drawing spans 100 units wide and about 60 tall (y 40..100);
  // put its wheels on the road near the hero's foot.
  const carW = w * 0.62;
  const carTop = y + h * 0.97 - 0.84 * carW;
  drawCar(ctx, x + w * 0.05, carTop, carW, carW);
  const figH = h * 0.52;
  const feetY = y + h * 0.99;
  drawDante(ctx, x + w * 0.075, feetY - figH, figH * 0.5, figH);
  drawMara(ctx, x + w * 0.70, feetY - figH, figH * 0.5, figH);
}

/** Big title lettering with outline + subtitle in neon script.
 *  `band` paints a dark strip behind the block so the white letters read. */
function drawTitleBlock(ctx, x, y, w, h, title, subtitle, band = true) {
  if (band) {
    ctx.fillStyle = '#160a26';
    ctx.fillRect(x - w * 0.02, y, w * 1.04, h);
  }
  const text = (title || 'NEON COAST').trim().toUpperCase();
  let size = h * 0.62;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const setFont = (s) => { ctx.font = `${s}px Anton, 'Arial Black', sans-serif`; };
  setFont(size);
  while (ctx.measureText(text).width > w * 0.96 && size > 10) {
    size -= 2;
    setFont(size);
  }
  const cy = y + h * 0.34;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#1c0b2e';
  ctx.lineWidth = size * 0.16;
  ctx.strokeText(text, x + w / 2, cy);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x + w / 2, cy);
  // pink underline sweep
  const ug = ctx.createLinearGradient(x + w * 0.12, 0, x + w * 0.88, 0);
  ug.addColorStop(0, '#ff5e8a');
  ug.addColorStop(0.5, '#ffd27a');
  ug.addColorStop(1, '#37e6ff');
  ctx.fillStyle = ug;
  ctx.fillRect(x + w * 0.14, y + h * 0.62, w * 0.72, Math.max(3, h * 0.045));
  // subtitle
  const sub = (subtitle || 'Sunset Heist').trim();
  if (sub) {
    let ss = h * 0.26;
    ctx.font = `${ss}px Pacifico, cursive`;
    while (ctx.measureText(sub).width > w * 0.9 && ss > 8) {
      ss -= 2;
      ctx.font = `${ss}px Pacifico, cursive`;
    }
    ctx.save();
    ctx.shadowColor = '#ff5e8a';
    ctx.shadowBlur = h * 0.12;
    ctx.fillStyle = '#ffe9f2';
    ctx.fillText(sub, x + w / 2, y + h * 0.86);
    ctx.restore();
  }
}

/** Small caps credit line under the title. */
function drawCredit(ctx, x, y, w, h, credit) {
  ctx.font = `bold ${Math.max(9, Math.round(h))}px 'Arial Narrow', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillText(credit, x + w / 2, y + h / 2);
}

/** Colour grades, painted as overlays. */
function applyGrade(ctx, w, h, grade) {
  ctx.save();
  if (grade === 'neon') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(55, 230, 255, 0.14)');
    g.addColorStop(0.5, 'rgba(255, 94, 138, 0.10)');
    g.addColorStop(1, 'rgba(20, 6, 40, 0.22)');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else if (grade === 'gold') {
    ctx.globalCompositeOperation = 'soft-light';
    ctx.fillStyle = 'rgba(255, 180, 60, 0.5)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255, 220, 130, 0.10)');
    g.addColorStop(1, 'rgba(120, 40, 0, 0.16)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else if (grade === 'noir') {
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(10, 10, 16, 0.12)';
    ctx.fillRect(0, 0, w, h);
  } else {
    // sunset (default): warm wash, stronger at the bottom
    const g = ctx.createLinearGradient(0, h * 0.3, 0, h);
    g.addColorStop(0, 'rgba(255, 120, 80, 0)');
    g.addColorStop(1, 'rgba(200, 40, 120, 0.28)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

/** Film grain + vignette, deterministic. */
function finish(ctx, w, h) {
  const rand = rng(20261119);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#ffffff';
  const n = Math.floor((w * h) / 2600);
  for (let i = 0; i < n; i++) {
    ctx.fillRect(rand() * w, rand() * h, 1.6, 1.6);
  }
  ctx.restore();
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(10, 4, 20, 0.30)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

const GRADES = ['sunset', 'neon', 'gold', 'noir'];
const LAYOUTS = ['poster', 'grid', 'bleed', 'story'];
export { GRADES, LAYOUTS };

/**
 * Draws the cover onto `canvas` (its own pixel size is the export size).
 * panels: array of panel sources, in order. layout/grade/title/subtitle as set.
 */
export function drawCover(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const panels = opts.panels ?? [];
  const layout = LAYOUTS.includes(opts.layout) ? opts.layout : 'poster';
  const grade = GRADES.includes(opts.grade) ? opts.grade : 'sunset';
  const gutter = Math.round(Math.min(w, h) * 0.012);
  const panelAt = (i, fallback) => panels[i] ?? { kind: 'scene', id: fallback };

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  if (layout === 'bleed') {
    drawHero(ctx, 0, 0, w, h, panelAt(0, 'boulevard'));
    const bandH = h * 0.2;
    ctx.fillStyle = 'rgba(12, 4, 24, 0.55)';
    ctx.fillRect(0, h - bandH, w, bandH);
    drawTitleBlock(ctx, w * 0.05, h - bandH + bandH * 0.08, w * 0.9, bandH * 0.62, opts.title, opts.subtitle, false);
    drawCredit(ctx, w * 0.05, h - bandH * 0.86, w * 0.9, Math.max(10, bandH * 0.1), 'STARRING MARA VOSS  •  DANTE REYES');
  } else if (layout === 'grid') {
    const half = (w - gutter * 3) / 2;
    const halfH = (h * 0.76 - gutter * 3) / 2;
    const ids = ['boulevard', 'pier', 'rooftop', 'neon'];
    drawPanelSource(ctx, panelAt(0, ids[0]), gutter, gutter, half, halfH);
    drawPanelSource(ctx, panelAt(1, ids[1]), gutter * 2 + half, gutter, half, halfH);
    drawPanelSource(ctx, panelAt(2, ids[2]), gutter, gutter * 2 + halfH, half, halfH);
    drawPanelSource(ctx, panelAt(3, ids[3]), gutter * 2 + half, gutter * 2 + halfH, half, halfH);
    ctx.fillStyle = '#160a26';
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    drawTitleBlock(ctx, w * 0.05, h * 0.795, w * 0.9, h * 0.13, opts.title, opts.subtitle);
    drawCredit(ctx, w * 0.05, h * 0.955, w * 0.9, Math.max(9, h * 0.012), 'FOUR CORNERS OF NEON COAST  •  ONE SUNSET HEIST');
  } else if (layout === 'story' || w > h) {
    // Wide: hero left, two stacked panels right, title band at the bottom.
    const heroW = Math.round(w * 0.6);
    const sideX = heroW + gutter;
    const sideW = w - sideX - gutter;
    const halfH = (h * 0.72 - gutter * 3) / 2;
    drawHero(ctx, gutter, gutter, heroW - gutter, h * 0.72 - gutter, panelAt(0, 'boulevard'));
    drawPanelSource(ctx, panelAt(1, 'pier'), sideX, gutter, sideW, halfH);
    drawPanelSource(ctx, panelAt(2, 'neon'), sideX, gutter * 2 + halfH, sideW, halfH);
    ctx.fillStyle = '#160a26';
    ctx.fillRect(0, h * 0.74, w, h * 0.26);
    drawTitleBlock(ctx, w * 0.04, h * 0.755, w * 0.92, h * 0.15, opts.title, opts.subtitle);
    drawCredit(ctx, w * 0.04, h * 0.945, w * 0.92, Math.max(9, h * 0.014), 'STARRING MARA VOSS  •  DANTE REYES  •  NEON COAST');
  } else {
    // Poster (default): hero on top, title band, three vignettes below.
    const heroH = Math.round(h * 0.52);
    drawHero(ctx, gutter, gutter, w - gutter * 2, heroH - gutter, panelAt(0, 'boulevard'));
    const rowY = heroH + h * 0.18;
    drawTitleBlock(ctx, w * 0.05, heroH + h * 0.012, w * 0.9, h * 0.155, opts.title, opts.subtitle);
    const rowH = h - rowY - gutter;
    const pw = (w - gutter * 4) / 3;
    const ids = ['pier', 'rooftop', 'neon'];
    for (let i = 0; i < 3; i++) {
      drawPanelSource(ctx, panelAt(i + 1, ids[i]), gutter + i * (pw + gutter), rowY, pw, rowH);
    }
  }

  applyGrade(ctx, w, h, grade);
  finish(ctx, w, h);
}
