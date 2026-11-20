// Procedural "photo" scenes for Neon Coast Cover Studio.
// Every scene is drawn from code with a seeded random generator, so the same
// scene always paints the same pixels. These are the app's built-in sample
// photos: original art of an invented city, never a real place or a game asset.

/** A tiny deterministic generator: mulberry32. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fills the rect with a vertical sunset gradient. */
function sunsetSky(ctx, x, y, w, h, top, mid, low) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, low);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

/** Paints a glowing sun disc with a soft halo. */
function sun(ctx, cx, cy, r) {
  const halo = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.6);
  halo.addColorStop(0, 'rgba(255, 214, 130, 0.85)');
  halo.addColorStop(0.4, 'rgba(255, 150, 90, 0.35)');
  halo.addColorStop(1, 'rgba(255, 120, 80, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(cx - r * 2.6, cy - r * 2.6, r * 5.2, r * 5.2);
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

/** A row of dark buildings with a few lit windows. Returns the roofline y. */
function skyline(ctx, x, y, w, h, seed, colour, lit) {
  const rand = rng(seed);
  const base = y + h;
  let bx = x;
  while (bx < x + w) {
    const bw = w * (0.06 + rand() * 0.1);
    const bh = h * (0.25 + rand() * 0.65);
    ctx.fillStyle = colour;
    ctx.fillRect(bx, base - bh, bw, bh);
    if (lit) {
      const cols = Math.max(1, Math.floor(bw / (w * 0.02)));
      const rows = Math.max(1, Math.floor(bh / (h * 0.06)));
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rand() < 0.16) {
            ctx.fillStyle = rand() < 0.7 ? '#ffd27a' : '#7df2ff';
            ctx.fillRect(bx + w * 0.008 + c * (bw / cols), base - bh + h * 0.02 + r * (bh / rows), bw / cols * 0.45, bh / rows * 0.4);
          }
        }
      }
    }
    bx += bw + w * 0.008;
  }
  return base;
}

/** A palm tree silhouette: curved trunk and drooping fronds. */
function palm(ctx, x, y, s, lean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#1c0b2e';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lean * 10, -42, lean * 20, -82);
  ctx.stroke();
  ctx.translate(lean * 20, -82);
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const a = (-Math.PI / 6) + (i * Math.PI / 6) - Math.PI / 2 + 0.45;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(Math.cos(a) * 28, Math.sin(a) * 22 + 6, Math.cos(a) * 42, Math.sin(a) * 34 + 14);
    ctx.stroke();
  }
  ctx.restore();
}

/** Streaky sunset clouds. */
function clouds(ctx, x, y, w, h, seed, colour) {
  const rand = rng(seed);
  ctx.fillStyle = colour;
  for (let i = 0; i < 7; i++) {
    const cy = y + rand() * h * 0.7;
    const cw = w * (0.12 + rand() * 0.25);
    const ch = h * (0.02 + rand() * 0.03);
    ctx.globalAlpha = 0.25 + rand() * 0.3;
    ctx.beginPath();
    ctx.ellipse(x + rand() * w, cy, cw, ch, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Wet-road reflection streaks under a light source. */
function reflections(ctx, x, y, w, h, seed, colour) {
  const rand = rng(seed);
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = colour;
    ctx.globalAlpha = 0.05 + rand() * 0.16;
    const rw = w * (0.02 + rand() * 0.08);
    ctx.fillRect(x + rand() * w, y + rand() * h, rw, h * 0.012);
  }
  ctx.globalAlpha = 1;
}

/** Scene 1: a palm-lined beach boulevard at golden hour. */
export function drawBoulevard(ctx, x, y, w, h) {
  sunsetSky(ctx, x, y, w, h, '#2a1052', '#c33d7e', '#ff9a52');
  sun(ctx, x + w * 0.68, y + h * 0.3, w * 0.11);
  clouds(ctx, x, y + h * 0.05, w, h * 0.4, 11, '#ffb37a');
  skyline(ctx, x, y + h * 0.18, w, h * 0.42, 21, '#3a1560', false);
  skyline(ctx, x, y + h * 0.3, w, h * 0.3, 31, '#241040', true);
  // sea strip
  const sea = ctx.createLinearGradient(0, y + h * 0.6, 0, y + h * 0.68);
  sea.addColorStop(0, '#ff7e5f');
  sea.addColorStop(1, '#7a2d6e');
  ctx.fillStyle = sea;
  ctx.fillRect(x, y + h * 0.6, w, h * 0.08);
  // road
  ctx.fillStyle = '#160a26';
  ctx.fillRect(x, y + h * 0.68, w, h * 0.32);
  ctx.fillStyle = '#ffd27a';
  for (let i = 0; i < 6; i++) ctx.fillRect(x + w * (0.06 + i * 0.17), y + h * 0.83, w * 0.07, h * 0.008);
  reflections(ctx, x, y + h * 0.7, w, h * 0.26, 41, '#ff9a52');
  // one palm behind the car, one at the far right edge: clear of the hero's people
  palm(ctx, x + w * 0.55, y + h * 0.68, w * 0.0006, 1);
  palm(ctx, x + w * 0.93, y + h * 0.7, w * 0.00095, -1);
}

/** Scene 2: a wooden pier over turquoise water at dusk. */
export function drawPier(ctx, x, y, w, h) {
  sunsetSky(ctx, x, y, w, h, '#1d2a6b', '#e2607f', '#ffb36b');
  sun(ctx, x + w * 0.3, y + h * 0.42, w * 0.09);
  clouds(ctx, x, y + h * 0.06, w, h * 0.35, 55, '#ffc08a');
  // water
  const sea = ctx.createLinearGradient(0, y + h * 0.48, 0, y + h);
  sea.addColorStop(0, '#ff8a6a');
  sea.addColorStop(0.4, '#2f7f8f');
  sea.addColorStop(1, '#123a5c');
  ctx.fillStyle = sea;
  ctx.fillRect(x, y + h * 0.48, w, h * 0.52);
  reflections(ctx, x, y + h * 0.5, w, h * 0.45, 66, '#ffd27a');
  // pier: two converging edges, plank bars between them, lamp posts on top
  const topY = y + h * 0.62;
  const topW = w * 0.05;
  const botW = w * 0.22;
  ctx.fillStyle = '#4a2c1c';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.5 - topW / 2, topY);
  ctx.lineTo(x + w * 0.5 + topW / 2, topY);
  ctx.lineTo(x + w * 0.5 + botW / 2, y + h);
  ctx.lineTo(x + w * 0.5 - botW / 2, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b4226';
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    const py = topY + (y + h - topY) * t;
    const pw = topW + (botW - topW) * t;
    ctx.fillRect(x + w * 0.5 - pw / 2, py, pw, Math.max(2, h * 0.008));
  }
  // edge rails + lamp posts
  ctx.strokeStyle = '#3a2113';
  ctx.lineWidth = Math.max(2, w * 0.004);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.5 - topW / 2, topY);
  ctx.lineTo(x + w * 0.5 - botW / 2, y + h);
  ctx.moveTo(x + w * 0.5 + topW / 2, topY);
  ctx.lineTo(x + w * 0.5 + botW / 2, y + h);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const t = 0.15 + i * 0.24;
    const py = topY + (y + h - topY) * t;
    const half = (topW + (botW - topW) * t) / 2;
    const ph = h * (0.02 + t * 0.05);
    ctx.fillStyle = '#3a2113';
    ctx.fillRect(x + w * 0.5 - half - w * 0.006, py - ph, w * 0.008, ph);
    ctx.fillRect(x + w * 0.5 + half - w * 0.002, py - ph, w * 0.008, ph);
    ctx.fillStyle = '#ffd27a';
    ctx.beginPath();
    ctx.arc(x + w * 0.5 - half, py - ph - h * 0.006, w * 0.005, 0, Math.PI * 2);
    ctx.arc(x + w * 0.5 + half, py - ph - h * 0.006, w * 0.005, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Scene 3: a hotel rooftop over a hazy city at dusk. */
export function drawRooftop(ctx, x, y, w, h) {
  sunsetSky(ctx, x, y, w, h, '#160b3a', '#8a2f6d', '#ff8a4d');
  sun(ctx, x + w * 0.5, y + h * 0.38, w * 0.08);
  clouds(ctx, x, y + h * 0.04, w, h * 0.3, 77, '#ff9a6a');
  skyline(ctx, x, y + h * 0.22, w, h * 0.4, 81, '#2c1448', false);
  skyline(ctx, x, y + h * 0.34, w, h * 0.28, 91, '#1a0b30', true);
  // rooftop floor
  ctx.fillStyle = '#12081f';
  ctx.fillRect(x, y + h * 0.62, w, h * 0.38);
  ctx.fillStyle = '#241338';
  ctx.fillRect(x, y + h * 0.62, w, h * 0.02);
  // string lights
  const rand = rng(101);
  ctx.strokeStyle = '#1c0b2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.66);
  ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.78, x + w, y + h * 0.64);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const lx = x + w * t;
    const ly = y + h * (0.66 + Math.sin(t * Math.PI) * 0.1);
    ctx.fillStyle = ['#ffd27a', '#ff5e8a', '#7df2ff'][i % 3];
    ctx.beginPath();
    ctx.arc(lx, ly + h * 0.015, w * 0.006, 0, Math.PI * 2);
    ctx.fill();
  }
  palm(ctx, x + w * 0.06, y + h * 0.66, w * 0.0008, 1);
  palm(ctx, x + w * 0.94, y + h * 0.64, w * 0.0008, -1);
  void rand;
}

/** Scene 4: a neon-lit night street outside a diner, wet pavement. */
export function drawNeonStreet(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#0d0620');
  g.addColorStop(0.6, '#2a0f45');
  g.addColorStop(1, '#12081f');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  skyline(ctx, x, y + h * 0.05, w, h * 0.5, 111, '#160a2c', true);
  // neon signs
  const signs = [
    { sx: 0.06, sy: 0.18, sw: 0.2, sh: 0.1, c: '#ff5e8a', t: 'DINER' },
    { sx: 0.68, sy: 0.12, sw: 0.24, sh: 0.12, c: '#37e6ff', t: 'MOTEL' },
    { sx: 0.36, sy: 0.3, sw: 0.16, sh: 0.08, c: '#ffd27a', t: 'OPEN' },
  ];
  for (const s of signs) {
    ctx.save();
    ctx.shadowColor = s.c;
    ctx.shadowBlur = w * 0.02;
    ctx.strokeStyle = s.c;
    ctx.lineWidth = Math.max(2, w * 0.004);
    ctx.strokeRect(x + w * s.sx, y + h * s.sy, w * s.sw, h * s.sh);
    ctx.fillStyle = s.c;
    ctx.font = `bold ${Math.round(h * 0.045)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.t, x + w * (s.sx + s.sw / 2), y + h * (s.sy + s.sh / 2));
    ctx.restore();
  }
  // wet street
  const road = ctx.createLinearGradient(0, y + h * 0.58, 0, y + h);
  road.addColorStop(0, '#1a0b30');
  road.addColorStop(1, '#05030a');
  ctx.fillStyle = road;
  ctx.fillRect(x, y + h * 0.58, w, h * 0.42);
  reflections(ctx, x, y + h * 0.6, w, h * 0.36, 121, '#ff5e8a');
  reflections(ctx, x, y + h * 0.62, w, h * 0.34, 131, '#37e6ff');
}

/** All built-in scenes, in the order the editor lists them. */
export const SCENES = [
  { id: 'boulevard', name: 'Boulevard Sunset', draw: drawBoulevard },
  { id: 'pier', name: 'Pier Dusk', draw: drawPier },
  { id: 'rooftop', name: 'Rooftop Lights', draw: drawRooftop },
  { id: 'neon', name: 'Neon Street', draw: drawNeonStreet },
];

/** Paints a scene by id into the rect, clipped to it. */
export function drawScene(ctx, id, x, y, w, h) {
  const scene = SCENES.find((s) => s.id === id) ?? SCENES[0];
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  scene.draw(ctx, x, y, w, h);
  ctx.restore();
}
