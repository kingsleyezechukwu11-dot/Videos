// Screen-records real click-throughs with a visible cursor.
// Usage: node record.js <youtube|trends> <outDir>
// Writes frames/*.jpg (CDP screencast at 2x), frames.json (timestamps) and events.json
// (what happened when, plus element boxes in CSS px) so the edit can zoom onto each click.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const W = 1600, H = 900, DPR = 2;
const flow = process.argv[2];
const out = process.argv[3];
fs.mkdirSync(path.join(out, "frames"), { recursive: true });

const CURSOR = `
(() => {
  const mk = () => {
    if (document.getElementById('__cur')) return;
    const c = document.createElement('div'); c.id='__cur';
    const NS='http://www.w3.org/2000/svg'; const sv=document.createElementNS(NS,'svg');
    sv.setAttribute('width','30'); sv.setAttribute('height','36'); sv.setAttribute('viewBox','0 0 20 24');
    const pa=document.createElementNS(NS,'path'); pa.setAttribute('d','M2 1 L2 19 L7 14.5 L10.5 22 L13.5 20.6 L10 13.3 L17 13.3 Z');
    pa.setAttribute('fill','#111'); pa.setAttribute('stroke','#fff'); pa.setAttribute('stroke-width','1.4'); sv.appendChild(pa); c.appendChild(sv);
    Object.assign(c.style,{position:'fixed',left:'-50px',top:'-50px',zIndex:2147483647,pointerEvents:'none',transition:'transform .08s'});
    document.documentElement.appendChild(c);
    const r = document.createElement('div'); r.id='__rip';
    Object.assign(r.style,{position:'fixed',width:'44px',height:'44px',borderRadius:'50%',border:'3px solid #8b5cf6',zIndex:2147483646,pointerEvents:'none',opacity:0});
    document.documentElement.appendChild(r);
    addEventListener('mousemove', e => { c.style.left = e.clientX - 3 + 'px'; c.style.top = e.clientY - 2 + 'px'; }, true);
    addEventListener('mousedown', e => {
      c.style.transform='scale(.85)';
      r.style.left = e.clientX - 22 + 'px'; r.style.top = e.clientY - 22 + 'px';
      r.animate([{opacity:1, transform:'scale(.4)'},{opacity:0, transform:'scale(1.6)'}],{duration:450});
    }, true);
    addEventListener('mouseup', () => { c.style.transform='scale(1)'; }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk); else mk();
  setInterval(mk, 500);
})();`;

(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, locale: "en-US" });
  await ctx.addInitScript(CURSOR);
  const p = await ctx.newPage();
  let mouse = { x: W / 2, y: H / 2 };
  const events = [];
  let t0 = null;
  const now = () => (t0 === null ? 0 : (Date.now() - t0) / 1000);
  const log = async (name, loc) => {
    const box = loc ? await loc.boundingBox({ timeout: 4000 }).catch(() => null) : null;
    events.push({ t: now(), name, box, mouse: { ...mouse } });
    console.log(now().toFixed(2), name, box ? JSON.stringify(box) : "");
  };
  const glide = async (x, y, ms = 700) => {
    const steps = Math.max(8, Math.round(ms / 16));
    const sx = mouse.x, sy = mouse.y;
    for (let i = 1; i <= steps; i++) {
      const k = i / steps, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      await p.mouse.move(sx + (x - sx) * e, sy + (y - sy) * e);
      await p.waitForTimeout(ms / steps);
    }
    mouse = { x, y };
  };
  const center = async (loc) => {
    const bx = await loc.boundingBox();
    return [bx.x + bx.width / 2, bx.y + bx.height / 2];
  };
  const clickOn = async (loc, name, ms = 800) => {
    const [x, y] = await center(loc);
    await glide(x, y, ms);
    await log(name + ":hover", loc);
    await p.waitForTimeout(250);
    await p.mouse.down(); await p.waitForTimeout(90); await p.mouse.up();
    await log(name + ":click", loc);
  };
  const smoothScroll = async (dy, ms = 1400) => {
    const steps = Math.round(ms / 30);
    for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, dy / steps); await p.waitForTimeout(30); }
  };

  // ---- screencast
  const cdp = await ctx.newCDPSession(p);
  const frames = [];
  let n = 0, rec = false;
  cdp.on("Page.screencastFrame", async (f) => {
    if (rec) {
      const file = `f${String(n++).padStart(5, "0")}.jpg`;
      fs.writeFileSync(path.join(out, "frames", file), Buffer.from(f.data, "base64"));
      frames.push({ file, t: (Date.now() - t0) / 1000 });
    }
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  const startRec = async () => {
    t0 = Date.now(); rec = true;
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 });
    // keep frames flowing even when nothing changes
    await p.mouse.move(mouse.x + 1, mouse.y); await p.mouse.move(mouse.x, mouse.y);
  };

  if (flow === "youtube") {
    await p.goto("https://www.youtube.com/", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(4000);
    await p.mouse.move(mouse.x, mouse.y);
    await startRec();
    await p.waitForTimeout(800);
    const box = p.locator('input[name="search_query"]').first();
    await clickOn(box, "search");
    await p.waitForTimeout(300);
    await log("type:start", box);
    await p.keyboard.type("space mysteries", { delay: 95 });
    await log("type:end", box);
    await p.waitForTimeout(400);
    await p.keyboard.press("Enter");
    await log("enter");
    await p.waitForTimeout(3200);
    const filters = p.getByRole("button", { name: /Search filters|Filters/ }).first();
    await clickOn(filters, "filters", 1000);
    await p.waitForTimeout(1300);
    const year = p.getByText("This year", { exact: true }).first();
    await log("dialog", p.locator("tp-yt-paper-dialog, ytd-search-filter-options-dialog-renderer").first());
    await clickOn(year, "thisyear", 900);
    await p.waitForTimeout(3200);
    await log("results");
    // find the small-channel breakout video and bring it into view
    const target = p.locator("ytd-video-renderer", { hasText: "The 10 Scariest Space Theories Ever" }).first();
    for (let i = 0; i < 14; i++) {
      const bx = await target.boundingBox().catch(() => null);
      if (bx && bx.y > 120 && bx.y < H - 330) break;
      await smoothScroll(bx && bx.y < 120 ? -500 : (bx ? Math.min(1400, bx.y - 260) : 1400), 550);
      await p.waitForTimeout(250);
    }
    await p.waitForTimeout(600);
    const title = target.locator("#video-title").first();
    const [tx, ty] = await center(title);
    await glide(tx, ty + 60, 900);
    await log("video:hover", target);
    await log("video:views", target.locator("#metadata-line").first());
    await p.waitForTimeout(2600);
    const ch = target.locator("#channel-info ytd-channel-name a:visible, ytd-channel-name a:visible").first();
    await clickOn(ch, "channel", 800);
    await p.waitForTimeout(3500);
    await log("channel:page", p.getByText(/subscribers/).first());
    await p.waitForTimeout(2500);
  }

  if (flow === "trends") {
    for (let i = 0; i < 6; i++) {
      await p.goto(i % 2 ? "https://trends.google.com/trends/" : "https://trends.google.com/trends/explore?q=space%20mysteries", { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(6000);
      if (i % 2 === 0 && (await p.getByText("Web Search", { exact: true }).count()) > 0) break;
      console.log("trends not ready:", await p.title());
      await p.waitForTimeout(8000);
    }
    await p.screenshot({ path: path.join(out, "pre.png") });
    for (const sel of ["text=OK, got it", "[aria-label='Close'] >> nth=0"]) await p.locator(sel).first().click({ timeout: 3000 }).catch(() => {});
    await p.locator("text=Classic Explore is expiring soon").locator("xpath=ancestor::*[3]").locator("button, [role=button]").last().click({ timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(1500);
    await p.mouse.move(mouse.x, mouse.y);
    await startRec();
    await p.waitForTimeout(1500);
    await log("chart:web", p.getByText("Interest over time").first());
    const dd = p.getByText("Web Search", { exact: true }).first();
    await clickOn(dd, "dropdown", 1100);
    await p.waitForTimeout(1200);
    const yt = p.getByText("YouTube Search", { exact: true }).last();
    await log("menu", yt);
    await clickOn(yt, "youtube", 900);
    await p.waitForTimeout(800);
    await glide(1300, 760, 900);
    await p.waitForTimeout(3500);
    await log("chart:youtube", p.getByText("Interest over time").first());
    await p.waitForTimeout(2000);
  }

  if (flow === "channel") {
    await p.goto("https://www.youtube.com/@space.dudeYT", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(5000);
    mouse = { x: 1100, y: 700 };
    await p.mouse.move(mouse.x, mouse.y);
    await startRec();
    await p.waitForTimeout(1000);
    const subs = p.getByText(/subscribers/).first();
    await log("subs", subs);
    const [sx, sy] = await center(subs);
    await glide(sx + 40, sy + 26, 1000);
    await p.waitForTimeout(3500);
  }

  rec = false;
  await cdp.send("Page.stopScreencast").catch(() => {});
  fs.writeFileSync(path.join(out, "frames.json"), JSON.stringify(frames));
  fs.writeFileSync(path.join(out, "events.json"), JSON.stringify({ W, H, DPR, events }, null, 1));
  console.log("frames", frames.length, "duration", frames.length ? frames[frames.length - 1].t.toFixed(2) : 0);
  await b.close();
})();
