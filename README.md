# Neon Coast Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/ijayhalawa/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/ijayhalawa/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

An offline web app that turns your photo and a caption into GTA-style cover
art — the multi-panel poster look with bold lettering and a sunset or neon
grade — exported as a PNG to share. Made for the make.fun bounty
**Make GTA 6 Cover Art** (`gta6-cover-art-01`).

## What it does

- **Any photo:** load your own photo into any of 4 panels, crop and position
  it with Zoom / Move X / Move Y, or fill every panel with one photo.
  Built-in procedural scenes (Boulevard Sunset, Pier Dusk, Rooftop Lights,
  Neon Street) fill panels when no photo is loaded.
- **The art:** an original poster — a sunset boulevard hero with a
  convertible and two invented characters (Mara Voss and Dante Reyes),
  vignette panels, a big Anton title block and a neon-script subtitle.
- **Fast and easy:** pick a layout (Poster, Grid 2×2, Full bleed, Wide
  story), a grade (Sunset, Neon night, Vice gold, Noir), a size
  (1080×1080, 1080×1350, 1920×1080), and Export PNG.
- **Offline and private:** static files under `app/`, no network request,
  photos never leave your machine.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## How it is built

- `app/index.html`, `app/style.css` — the editor.
- `app/src/scenes.js` — four procedural scenes, drawn from code.
- `app/src/cover.js` — the cover renderer: layouts, grades, hero art.
- `app/src/main.js` — editor wiring and PNG export.
- `app/src/shots.js` — fixed `?shot=` scenes for screenshots.
- `app/fonts/` — Anton and Pacifico, SIL Open Font License (see `OFL.txt`).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — 3–4 shots of the app and the covers it exports.

Everything in this repo is original work. Neon Coast, Mara Voss and Dante
Reyes are invented. No Rockstar Games logo, artwork, character or font is
used anywhere.

## License

MIT — see `LICENSE`. Fonts under `app/fonts/` are under the SIL Open Font
License, Version 1.1 (see `app/fonts/OFL.txt`).
