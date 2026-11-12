# Sponsor graphics renderer

Renders Wolfpack Coquí sponsor graphics in club colors (feed 1080x1350, story 1080x1920) from a JSON spec list.

## Setup (fresh session)
```bash
cd tools/sponsor-graphics
npm pack @fontsource/anton@5.0.8 && tar xzf fontsource-anton-*.tgz && cp package/files/anton-latin-400-normal.woff2 assets/anton.woff2
# put the sponsor logo (on white, PNG) in assets/, e.g. from ../../sponsors/<slug>/logo/<slug>-logo.png
```
Requires Node + Playwright (preinstalled in Claude cloud sessions).

## Render
```bash
node render.js specs.json assets out            # all
node render.js specs.json assets out <id>       # one
```
Convert to JPEG (q93) before uploading: Instagram needs JPEG.

## Spec fields
`id`, `size` (feed|story), `logo` (file in assets/, default asr_logo_white.png), `eyebrow`, `h1` (HTML, `<em>` = gradient accent, `<br>`), `h1size` (px, optional), `card` (full|mini sponsor logo card), `body`, `list` [], `chips` [], `tag`, `big`.
The script prints OVERFLOW if content doesn't fit; shorten text.

## Publishing
Push JPEGs to `sponsors/<slug>/`, pull into Postiz with uploadFromUrlTool (raw.githubusercontent.com URL), schedule with integrationSchedulePostTool. See the project doc `claude/sponsor-playbook.md`.
