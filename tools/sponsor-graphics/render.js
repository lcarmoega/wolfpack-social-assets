// Render Pack Alpha sponsor graphics from specs.json -> PNG (1080x1350 feed, 1080x1920 story)
// usage: node render.js <specs.json> <assetsDir> <outDir> [onlyId]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [specsPath, assets, outDir, only] = process.argv.slice(2);
const specs = JSON.parse(fs.readFileSync(specsPath, 'utf8'));
const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
const ANTON = b64(path.join(assets, 'anton.woff2'), 'font/woff2');
const CLUB = b64(path.join(assets, 'club_logo_t.png'), 'image/png');
const ASR = b64(path.join(assets, 'asr_logo_white.png'), 'image/png');

const LOGO_CACHE = {};
function html(s) {
  const lf = s.logo || 'asr_logo_white.png';
  const ASR = LOGO_CACHE[lf] || (LOGO_CACHE[lf] = b64(path.join(assets, lf), 'image/png'));
  const story = s.size === 'story';
  const W = 1080, H = story ? 1920 : 1350;
  const list = (s.list || []).map(t => `<li><span class="tick"></span>${t}</li>`).join('');
  const chips = (s.chips || []).map(t => `<span class="chip">${t}</span>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:Anton;src:url(${ANTON}) format('woff2');}
  :root{--pink:#F81A70;--orange:#FC7A01;--purple:#67058F;--ink:#120610;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;overflow:hidden;background:var(--ink);font-family:Inter,sans-serif;color:#fff}
  .wrap{position:relative;width:100%;height:100%;padding:${story ? '150px 84px 170px' : '72px 84px 64px'};display:flex;flex-direction:column;
    background:
      radial-gradient(900px 700px at 105% -10%, rgba(248,26,112,.55), transparent 60%),
      radial-gradient(800px 800px at -15% 110%, rgba(103,5,143,.75), transparent 60%),
      radial-gradient(600px 500px at 110% 105%, rgba(252,122,1,.35), transparent 60%),
      var(--ink);}
  .slash{position:absolute;left:-200px;width:1600px;height:26px;transform:rotate(-4deg);opacity:.9;
    background:linear-gradient(90deg,transparent,var(--orange) 20%,var(--pink) 60%,transparent)}
  .s1{top:${story ? 380 : 262}px}.s2{top:${story ? 416 : 298}px;height:8px;opacity:.5}
  header{display:flex;align-items:center;gap:26px;position:relative;z-index:2}
  header img{width:${story ? 170 : 150}px;height:auto;filter:drop-shadow(0 6px 18px rgba(0,0,0,.5))}
  .eyebrow{font-family:Anton;letter-spacing:.14em;font-size:${story ? 34 : 30}px;color:var(--orange);line-height:1.2}
  .eyebrow small{display:block;color:#fff;opacity:.75;font-family:Inter;font-weight:600;letter-spacing:.06em;font-size:${story ? 26 : 23}px;margin-top:4px}
  main{flex:1;margin-top:${story ? 130 : 110}px;display:flex;flex-direction:column;justify-content:center;gap:${story ? 54 : 40}px;position:relative;z-index:2}
  h1{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:1.02;font-size:${s.h1size || (story ? 128 : 104)}px;letter-spacing:.005em}
  h1 em{font-style:normal;background:linear-gradient(90deg,var(--orange),var(--pink));-webkit-background-clip:text;color:transparent}
  .big{font-family:Anton;font-size:${story ? 330 : 280}px;line-height:.9;background:linear-gradient(90deg,var(--orange),var(--pink));-webkit-background-clip:text;color:transparent}
  .card{background:#fff;border-radius:34px;padding:${story ? '64px 54px' : '52px 50px'};position:relative;
    box-shadow:0 30px 60px rgba(0,0,0,.45)}
  .card::before{content:"";position:absolute;inset:-6px;border-radius:40px;z-index:-1;background:linear-gradient(120deg,var(--orange),var(--pink),var(--purple))}
  .card img{width:100%;display:block}
  .tag{display:inline-flex;align-self:flex-start;align-items:center;gap:14px;font-family:Anton;letter-spacing:.12em;font-size:${story ? 34 : 30}px;
    padding:14px 26px;border-radius:999px;background:linear-gradient(90deg,var(--orange),var(--pink));color:#fff}
  .body{font-size:${story ? 48 : 38}px;line-height:1.35;font-weight:500;color:#F4ECF6;max-width:${story ? 900 : 900}px}
  .body b{color:#fff;font-weight:800}
  ul{list-style:none;display:grid;gap:${story ? 26 : 20}px}
  li{font-size:${story ? 44 : 38}px;font-weight:700;display:flex;align-items:center;gap:22px}
  .tick{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,var(--orange),var(--pink));flex:none;transform:rotate(45deg)}
  .chips{display:flex;flex-wrap:wrap;gap:16px}
  .chip{font-weight:700;font-size:${story ? 36 : 31}px;padding:12px 26px;border-radius:999px;border:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.06)}
  .mini{background:#fff;border-radius:22px;padding:22px 30px;width:${story ? 620 : 560}px}
  .mini img{width:100%;display:block}
  footer{display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:2;font-family:Anton;letter-spacing:.1em}
  footer .l{font-size:${story ? 32 : 28}px;color:#fff}
  footer .r{font-size:${story ? 30 : 26}px;color:var(--pink)}
  </style></head><body><div class="wrap">
  <div class="slash s1"></div><div class="slash s2"></div>
  <header><img src="${CLUB}"><div class="eyebrow">${s.eyebrow}<small>WOLFPACK COQUÍ VBC · 2026–27 SEASON</small></div></header>
  <main>
    ${s.big ? `<div class="big">${s.big}</div>` : ''}
    <h1>${s.h1}</h1>
    ${s.card === 'full' ? `<div class="card"><img src="${ASR}"></div>` : ''}
    ${s.tag ? `<div class="tag">★ ${s.tag}</div>` : ''}
    ${s.body ? `<p class="body">${s.body}</p>` : ''}
    ${list ? `<ul>${list}</ul>` : ''}
    ${chips ? `<div class="chips">${chips}</div>` : ''}
    ${s.card === 'mini' ? `<div class="mini"><img src="${ASR}"></div>` : ''}
  </main>
  <footer><div class="l">EARNED NOT GIVEN 🐺🐸</div><div class="r">#WOLFPACKSTRONG</div></footer>
  </div></body></html>`;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const s of specs) {
    if (only && s.id !== only) continue;
    const H = s.size === 'story' ? 1920 : 1350;
    const page = await browser.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 1 });
    await page.setContent(html(s), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => {
      const m = document.querySelector('main');
      return m.scrollHeight > m.clientHeight + 2 ? `${m.scrollHeight}>${m.clientHeight}` : '';
    });
    await page.screenshot({ path: path.join(outDir, `${s.id}.png`) });
    console.log(s.id, overflow ? `OVERFLOW ${overflow}` : 'ok');
    await page.close();
  }
  await browser.close();
})();
