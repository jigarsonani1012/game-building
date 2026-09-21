"use strict";
/* ==================================================================
   NONOGRAM SQUARE — single-file vanilla JS build
   ================================================================== */

/* ---------------- Icons (stroke = currentColor) ---------------- */
const ICONS = {
  back:'<path d="M15 18l-6-6 6-6"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 1 1 3.8 2.6c-.7.3-1 .8-1 1.7"/><circle cx="12" cy="17.2" r=".7" fill="currentColor" stroke="none"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  play:'<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M10 13h2M14 13h2M10 16.5h2"/>',
  pen:'<path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19z"/><path d="M13.5 7l3.5 3.5"/>',
  x:'<path d="M5 5l14 14M19 5L5 19"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  zoomin:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>',
  zoomout:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  restart:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  check:'<path d="M4 12.5l5 5L20 6.5"/>',
  star:'<path class="ic-fill" d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.4l-5.8 3.05 1.1-6.45L2.6 9.35l6.5-.95z"/>',
  flame:'<path d="M12 22c4 0 7-2.8 7-6.8 0-3-1.8-5-3.2-6.6.2 1.6-.7 2.8-1.8 2.8.3-3.2-1.4-5.8-4-7.9.3 3.4-2.4 4.6-3.4 7.4C5.9 12.8 5 14 5 15.2 5 19.2 8 22 12 22z"/>',
  sizeS:'<rect x="5" y="5" width="14" height="14" rx="1.5" stroke-width="1.8"/>',
  sizeM:'<rect x="4" y="4" width="16" height="16" rx="1.5" stroke-width="1.6"/><path d="M12 4v16M4 12h16" stroke-width="1.6"/>',
  sizeL:'<rect x="3.5" y="3.5" width="17" height="17" rx="1.5" stroke-width="1.4"/><path d="M12 3.5v17M3.5 12h17M7.7 3.5v17M16.3 3.5v17M3.5 7.7h17M3.5 16.3h17" stroke-width="1.4"/>',
  classic:'<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/>',
  expert:'<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke-width="1.5"/><path d="M10.2 8.2a2 2 0 1 1 3.1 1.7c-.6.5-1 .9-1 1.8" stroke-width="1.8" stroke-linecap="round"/><circle cx="12.3" cy="14.2" r="0.75" fill="currentColor" stroke="none"/>',
  next:'<path d="M9 18l6-6-6-6"/>',
  heart:'<path class="ic-fill" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  heartCrack:'<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" fill="none" stroke-width="2"/>'
};
function icon(name, cls){return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24">'+ICONS[name]+'</svg>';}

/* ---------------- Seeded RNG ---------------- */
function hashString(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}h=Math.imul(h^(h>>>16),2246822507);h=Math.imul(h^(h>>>13),3266489909);return(h^=h>>>16)>>>0;}
function mulberry32(seed){let a=seed>>>0;return function(){a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),a|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function randInt(rng,min,max){return min+Math.floor(rng()*(max-min+1));}
function pick(rng,arr){return arr[Math.floor(rng()*arr.length)];}

/* ---------------- Solved-art puzzle engine (verified-unique-solution generator) ---------------- */
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

function newGrid(n) { return { n, c: new Uint8Array(n * n) }; }
function painter(g) {
  const n = g.n, last = n - 1;
  const X = t => clamp(Math.round(t * last), 0, last);
  const px = i => i / last;
  const set = (x, y, v) => { if (x >= 0 && y >= 0 && x < n && y < n) g.c[y * n + x] = v; };
  const P = {
    n, g, set,
    rect(x0, y0, x1, y1, v) {
      const a = X(Math.min(x0, x1)), b = X(Math.max(x0, x1));
      const c = X(Math.min(y0, y1)), d = X(Math.max(y0, y1));
      for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) set(x, y, v === undefined ? 1 : v);
    },
    disc(cx, cy, r, v) {
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const dx = px(x) - cx, dy = px(y) - cy;
        if (dx * dx + dy * dy <= r * r) set(x, y, v === undefined ? 1 : v);
      }
    },
    ellipse(cx, cy, rx, ry, v) {
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const dx = (px(x) - cx) / rx, dy = (px(y) - cy) / ry;
        if (dx * dx + dy * dy <= 1) set(x, y, v === undefined ? 1 : v);
      }
    },
    ring(cx, cy, r, th, v) { P.arc(cx, cy, r, 0, Math.PI * 2, th, v); },
    arc(cx, cy, r, a0, a1, th, v) {
      const t = (th || 1) / last / 2;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const dx = px(x) - cx, dy = px(y) - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > r + t || d < r - t) continue;
        let a = Math.atan2(dy, dx);
        while (a < a0) a += Math.PI * 2;
        if (a <= a1 + 1e-9) set(x, y, v === undefined ? 1 : v);
      }
    },
    line(x0, y0, x1, y1, th, v) {
      const ax = X(x0), ay = X(y0), bx = X(x1), by = X(y1);
      const t = Math.max(1, th || 1);
      const minx = Math.min(ax, bx) - t, maxx = Math.max(ax, bx) + t;
      const miny = Math.min(ay, by) - t, maxy = Math.max(ay, by) + t;
      const vx = bx - ax, vy = by - ay;
      const len2 = vx * vx + vy * vy || 1;
      for (let y = Math.max(0, miny); y <= Math.min(last, maxy); y++) {
        for (let x = Math.max(0, minx); x <= Math.min(last, maxx); x++) {
          let tp = ((x - ax) * vx + (y - ay) * vy) / len2;
          tp = clamp(tp, 0, 1);
          const cxp = ax + vx * tp, cyp = ay + vy * tp;
          const dx = x - cxp, dy = y - cyp;
          if (dx * dx + dy * dy <= t * t) set(x, y, v === undefined ? 1 : v);
        }
      }
    },
    poly(pts, v) {
      const xs = pts.map(p => X(p[0])), ys = pts.map(p => X(p[1]));
      const minx = Math.max(0, Math.min.apply(null, xs) - 1), maxx = Math.min(last, Math.max.apply(null, xs) + 1);
      const miny = Math.max(0, Math.min.apply(null, ys) - 1), maxy = Math.min(last, Math.max.apply(null, ys) + 1);
      for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const xi = xs[i], yi = ys[i], xj = xs[j], yj = ys[j];
          if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
        }
        if (inside) set(x, y, v === undefined ? 1 : v);
      }
    },
    fn(test, v) {
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        if (test(px(x), px(y))) set(x, y, v === undefined ? 1 : v);
      }
    },
    clear() { g.c.fill(0); }
  };
  return P;
}

function stampSym(P, x, y, r, fold) {
  const pts = [[x, y], [1 - x, y], [x, 1 - y], [1 - x, 1 - y]];
  if (fold >= 8) pts.push([y, x], [1 - y, x], [y, 1 - x], [1 - y, 1 - x]);
  const seen = new Set();
  pts.forEach(p => {
    const k = p[0].toFixed(3) + ',' + p[1].toFixed(3);
    if (seen.has(k)) return; seen.add(k);
    P.disc(p[0], p[1], r);
  });
}

/* ---------------- recipes (icons) ---------------- */
const ICON_RECIPES = [
  { name: 'Heart', cat: 'i', draw(P) {
    P.fn((u, v) => { const x = (u - .5) * 2.3, y = (.44 - v) * 2.3;
      const a = x * x + y * y - 1; return a * a * a - x * x * y * y * y <= 0; });
  } },
  { name: 'Star', cat: 'i', draw(P) {
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .22 : .48;
      pts.push([.5 + Math.cos(a) * r, .53 + Math.sin(a) * r]); }
    P.poly(pts);
  } },
  { name: 'Smiley', cat: 'i', draw(P) {
    P.disc(.5, .5, .47); P.disc(.33, .38, .075, 0); P.disc(.67, .38, .075, 0);
    P.arc(.5, .5, .29, .35 * Math.PI, .65 * Math.PI, Math.max(1, P.n * .06));
  } },
  { name: 'Cat', cat: 'i', draw(P) {
    P.poly([[.5, .04], [.78, .3], [.9, .16], [.86, .46], [.84, .62], [.5, .9], [.16, .62], [.14, .46], [.1, .16], [.22, .3]]);
    P.disc(.34, .5, .06, 0); P.disc(.66, .5, .06, 0);
    P.poly([[.44, .64], [.56, .64], [.5, .72]]);
    if (P.n >= 15) { P.line(.06, .58, .32, .62, 1); P.line(.94, .58, .68, .62, 1); }
  } },
  { name: 'Fish', cat: 'i', draw(P) {
    P.ellipse(.46, .5, .3, .2); P.poly([[.72, .5], [.95, .3], [.95, .7]]);
    P.disc(.28, .44, .045, 0);
  } },
  { name: 'Butterfly', cat: 'i', draw(P) {
    P.ellipse(.28, .34, .24, .22); P.ellipse(.72, .34, .24, .22);
    P.ellipse(.3, .68, .2, .2); P.ellipse(.7, .68, .2, .2);
    P.rect(.47, .2, .53, .88);
    P.line(.47, .22, .3, .04, 1); P.line(.53, .22, .7, .04, 1);
  } },
  { name: 'Tree', cat: 'i', draw(P) {
    P.rect(.44, .72, .56, .96);
    P.poly([[.5, .02], [.84, .46], [.16, .46]]);
    P.poly([[.5, .26], [.9, .66], [.1, .66]]);
  } },
  { name: 'Flower', cat: 'i', draw(P) {
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3;
      P.disc(.5 + Math.cos(a) * .26, .38 + Math.sin(a) * .26, .17); }
    P.disc(.5, .38, .11);
    P.rect(.47, .55, .53, .96);
  } },
  { name: 'House', cat: 'i', draw(P) {
    P.rect(.18, .44, .82, .92); P.poly([[.5, .06], [.94, .48], [.06, .48]]);
    P.rect(.42, .64, .58, .92, 0); P.rect(.24, .54, .36, .64, 0);
  } },
  { name: 'Car', cat: 'i', draw(P) {
    P.rect(.08, .52, .92, .74); P.poly([[.24, .52], [.34, .28], [.68, .28], [.78, .52]]);
    P.ring(.26, .78, .11, Math.max(1, P.n * .05)); P.ring(.74, .78, .11, Math.max(1, P.n * .05));
  } },
  { name: 'Rocket', cat: 'i', draw(P) {
    P.poly([[.5, .02], [.68, .34], [.68, .72], [.32, .72], [.32, .34]]);
    P.poly([[.32, .5], [.12, .84], [.32, .78]]);
    P.poly([[.68, .5], [.88, .84], [.68, .78]]);
    P.ring(.5, .42, .1, Math.max(1, P.n * .06));
    P.poly([[.42, .76], [.58, .76], [.5, .98]]);
  } },
  { name: 'Key', cat: 'i', draw(P) {
    P.ring(.28, .32, .19, Math.max(1, P.n * .07));
    P.rect(.24, .48, .32, .94); P.rect(.32, .68, .48, .76); P.rect(.32, .86, .44, .92);
  } },
  { name: 'Crown', cat: 'i', draw(P) {
    P.poly([[.08, .3], [.28, .6], [.5, .24], [.72, .6], [.92, .3], [.86, .82], [.14, .82]]);
  } },
  { name: 'Diamond', cat: 'i', draw(P) {
    P.poly([[.5, .06], [.88, .4], [.5, .94], [.12, .4]]);
  } },
  { name: 'Bell', cat: 'i', draw(P) {
    P.fn((u, v) => { const x = (u - .5) * 2.5, y = (.86 - v) * 2.2;
      return x * x + y * y * y * .8 <= 1 && v < .8; });
    P.rect(.14, .8, .86, .9); P.disc(.5, .95, .06);
  } },
  { name: 'Umbrella', cat: 'i', draw(P) {
    P.fn((u, v) => { const x = (u - .5) * 2.3, y = (.5 - v) * 2.1;
      return x * x + y * y <= 1 && v < .52; });
    P.rect(.48, .5, .52, .82); P.arc(.6, .82, .12, 0, Math.PI, Math.max(1, P.n * .06));
  } },
  { name: 'Anchor', cat: 'i', draw(P) {
    P.ring(.5, .16, .12, Math.max(1, P.n * .06));
    P.rect(.47, .28, .53, .78); P.rect(.28, .32, .72, .38);
    P.arc(.5, .56, .34, Math.PI * .18, Math.PI * .82, Math.max(1, P.n * .07));
  } },
  { name: 'Sun', cat: 'i', draw(P) {
    P.disc(.5, .5, .27);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4;
      P.line(.5 + Math.cos(a) * .35, .5 + Math.sin(a) * .35, .5 + Math.cos(a) * .48, .5 + Math.sin(a) * .48, Math.max(1, Math.round(P.n / 9))); }
  } },
  { name: 'Moon', cat: 'i', draw(P) {
    P.disc(.5, .5, .42); P.disc(.74, .4, .34, 0);
  } },
  { name: 'Cloud', cat: 'i', draw(P) {
    P.disc(.3, .48, .2); P.disc(.52, .36, .25); P.disc(.72, .5, .19);
    P.rect(.14, .48, .86, .66);
  } },
  { name: 'Snowman', cat: 'i', draw(P) {
    P.disc(.5, .7, .26); P.disc(.5, .34, .18);
    P.rect(.32, .06, .68, .16);
    P.disc(.44, .3, .035, 0); P.disc(.56, .3, .035, 0);
  } },
  { name: 'Ghost', cat: 'i', draw(P) {
    P.fn((u, v) => { const x = (u - .5) * 2.4, y = (.2 - v) * 2.6;
      return x * x + y * y <= 1 && v < .72; });
    const k = Math.max(2, Math.round(P.n / 5));
    P.rect(.08, .68, .92, .78);
    for (let i = 0; i < k; i++) { const w = .84 / k; P.rect(.08 + i * w, .78, .08 + i * w + w * .55, .9, 0); }
    P.disc(.38, .34, .07, 0); P.disc(.62, .34, .07, 0);
  } },
  { name: 'Gift', cat: 'i', draw(P) {
    P.rect(.1, .36, .9, .92); P.rect(.06, .26, .94, .38);
    P.rect(.44, .26, .56, .92, 0);
  } },
  { name: 'Balloon', cat: 'i', draw(P) {
    P.ellipse(.5, .4, .3, .34); P.poly([[.44, .72], [.56, .72], [.5, .82]]);
    P.arc(.58, .86, .1, 0, Math.PI * 1.4, 1);
  } },
  { name: 'Trophy', cat: 'i', draw(P) {
    P.rect(.26, .06, .74, .26);
    P.poly([[.26, .1], [.06, .34], [.26, .44]]);
    P.poly([[.74, .1], [.94, .34], [.74, .44]]);
    P.poly([[.32, .26], [.68, .26], [.6, .56], [.4, .56]]);
    P.rect(.42, .56, .58, .72); P.rect(.3, .72, .7, .9);
  } },
  { name: 'Mushroom', cat: 'i', draw(P) {
    P.fn((u, v) => { const x = (u - .5) * 2.4, y = (.42 - v) * 2.4;
      return x * x + y * y <= 1 && v < .44; });
    P.rect(.4, .44, .6, .92);
    if (P.n >= 15) { P.disc(.38, .28, .07, 0); P.disc(.6, .34, .05, 0); }
  } },
  { name: 'Cherries', cat: 'i', draw(P) {
    P.disc(.31, .68, .19); P.disc(.69, .72, .19);
    P.line(.31, .5, .5, .12, 1); P.line(.69, .54, .5, .12, 1);
  } },
  { name: 'Light Bulb', cat: 'i', draw(P) {
    P.disc(.5, .38, .3); P.rect(.36, .58, .64, .68);
    P.rect(.38, .68, .62, .78); P.rect(.42, .78, .58, .88);
  } }
];

/* ---------------- recipes (abstract geometric) ---------------- */
const PAT_RECIPES = [
  { name: 'Kaleidoscope', cat: 'p', draw(P, n, R) {
    const k = 4 + Math.floor(R() * 3);
    for (let i = 0; i < k; i++) {
      const x = .06 + R() * .42, y = .06 + R() * .42, r = .05 + R() * .12;
      stampSym(P, x, y, r, 8);
    }
    stampSym(P, .5, .5, .05 + R() * .06, 4);
  } },
  { name: 'Mandala', cat: 'p', draw(P, n, R) {
    const k = 6;
    for (let ring = 0; ring < 3; ring++) {
      const rr = .14 + ring * .15, cnt = k + ring * 2;
      for (let i = 0; i < cnt; i++) {
        const a = (i / cnt) * Math.PI * 2 + ring * .3;
        stampSym(P, .5 + Math.cos(a) * rr * .5, .5 + Math.sin(a) * rr * .5, .045 + R() * .02, 4);
      }
    }
    P.disc(.5, .5, .08);
  } },
  { name: 'Diamonds', cat: 'p', draw(P) {
    P.fn((u, v) => {
      const d = Math.abs(u - .5) + Math.abs(v - .5);
      return Math.floor(d * 9) % 2 === 0;
    });
  } },
  { name: 'Argyle', cat: 'p', draw(P) {
    P.fn((u, v) => {
      const a = (u + v) * 4 % 1, b = ((u - v) + 1) * 4 % 1;
      return (a < .16) || (b < .16);
    });
  } },
  { name: 'Checker', cat: 'p', draw(P, n, R) {
    const b = n < 12 ? 2 : (R() < .5 ? 2 : 3);
    P.fn((u, v) => (Math.floor(u * n / b) + Math.floor(v * n / b)) % 2 === 0);
  } },
  { name: 'Woven', cat: 'p', draw(P, n) {
    const b = Math.max(2, Math.round(n / 5));
    P.fn((u, v) => {
      const x = Math.floor(u * n) % (b * 2), y = Math.floor(v * n) % (b * 2);
      return (x < b && y < b) || (x >= b && y >= b);
    });
  } },
  { name: 'Crosshatch', cat: 'p', draw(P, n, R) {
    const k = 3 + Math.floor(R() * 3);
    for (let i = -1; i <= k + 1; i++) {
      P.line(i / k, 0, i / k + 1, 1, Math.max(1, Math.round(n / 22)));
      P.line(i / k, 1, i / k + 1, 0, Math.max(1, Math.round(n / 22)));
    }
  } },
  { name: 'Waves', cat: 'p', draw(P, n, R) {
    const k = 4 + Math.floor(R() * 3), ph = R() * Math.PI * 2;
    P.fn((u, v) => Math.sin((v * k + Math.sin(u * 6 + ph) * .18) * Math.PI * 2) > .15);
  } },
  { name: 'Snowflake', cat: 'p', draw(P) {
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      P.line(.5, .5, .5 + Math.cos(a) * .46, .5 + Math.sin(a) * .46, Math.max(1, Math.round(P.n / 14)));
      for (let t = .2; t <= .4; t += .13) {
        const bx = .5 + Math.cos(a) * t, by = .5 + Math.sin(a) * t;
        P.line(bx, by, bx + Math.cos(a + .5) * .08, by + Math.sin(a + .5) * .08, Math.max(1, Math.round(P.n / 18)));
        P.line(bx, by, bx + Math.cos(a - .5) * .08, by + Math.sin(a - .5) * .08, Math.max(1, Math.round(P.n / 18)));
      }
    }
    P.disc(.5, .5, .06);
  } },
  { name: 'Rays', cat: 'p', draw(P, n, R) {
    const k = 8 + Math.floor(R() * 5) * 2;
    P.fn((u, v) => {
      const a = Math.atan2(v - .5, u - .5);
      return Math.floor(((a + Math.PI) / (Math.PI * 2)) * k) % 2 === 0 &&
        Math.hypot(u - .5, v - .5) < .47;
    });
  } },
  { name: 'Rings', cat: 'p', draw(P, n, R) {
    const k = 3 + Math.floor(R() * 2);
    for (let i = 0; i < k; i++) P.ring(.5, .5, .12 + i * .13, Math.max(1, Math.round(n / 12)));
  } },
  { name: 'Corners', cat: 'p', draw(P, n) {
    const b = Math.max(2, Math.round(n / 4));
    P.fn((u, v) => {
      const x = Math.floor(u * n / b), y = Math.floor(v * n / b);
      return (x + y) % 2 === 0 ? ((u * n) % b < b / 2) === ((v * n) % b < b / 2)
        : ((u * n) % b < b / 2) !== ((v * n) % b < b / 2);
    });
  } },
  { name: 'Zigzag', cat: 'p', draw(P, n, R) {
    const k = 3 + Math.floor(R() * 3);
    P.fn((u, v) => {
      const z = Math.abs(((u * k * 2) % 2) - 1);
      return v > z / (k * 1.4) + .12 && v < z / (k * 1.4) + .34;
    });
  } },
  { name: 'Pluses', cat: 'p', draw(P, n) {
    const b = Math.max(4, Math.round(n / 4));
    P.fn((u, v) => {
      const x = (u * n) % b, y = (v * n) % b;
      return Math.abs(x - b / 2) < b / 5 || Math.abs(y - b / 2) < b / 5;
    });
  } },
  { name: 'Triangles', cat: 'p', draw(P, n, R) {
    const flip = R() < .5, k = 3.5;
    P.fn((u, v) => {
      const x = ((u * k) % 1), y = ((v * k) % 1);
      const t = flip ? (y > x) : (y > 1 - x);
      return (Math.floor(u * k) + Math.floor(v * k)) % 2 === 0 ? t : !t;
    });
  } },
  { name: 'Squares', cat: 'p', draw(P) {
    for (let r = .48; r > .05; r -= .11) {
      const on = Math.round((.48 - r) * 30) % 2 === 0;
      P.rect(.5 - r, .5 - r, .5 + r, .5 + r, on ? 1 : 0);
    }
  } }
];

function cluesForBuilt(g) {
  const n = g.n, rows = [], cols = [];
  const lineClue = arr => { const out = []; let run = 0; for (let i = 0; i < arr.length; i++) { if (arr[i]) run++; else if (run) { out.push(run); run = 0; } } if (run) out.push(run); return out; };
  for (let y = 0; y < n; y++) { const a = []; for (let x = 0; x < n; x++) a.push(g.c[y * n + x]); rows.push(lineClue(a)); }
  for (let x = 0; x < n; x++) { const a = []; for (let y = 0; y < n; y++) a.push(g.c[y * n + x]); cols.push(lineClue(a)); }
  return { rows, cols };
}
function solveLine(known, clue) {
  const n = known.length, k = clue.length;
  if (!k) { const o = new Array(n); for (let i = 0; i < n; i++) { if (known[i] === 1) return null; o[i] = 2; } return o; }
  const feas = new Array(n + 1);
  for (let i = 0; i <= n; i++) feas[i] = new Uint8Array(k + 1);
  feas[n][k] = 1;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = k; j >= 0; j--) {
      let ok = 0;
      if (known[i] !== 1 && feas[i + 1][j]) ok = 1;
      if (!ok && j < k) {
        const L = clue[j];
        if (i + L <= n) {
          let fits = 1;
          for (let t = i; t < i + L; t++) if (known[t] === 2) { fits = 0; break; }
          if (fits) {
            const after = i + L;
            if (after === n) { if (j === k - 1) ok = 1; }
            else if (known[after] !== 1 && feas[after + 1][j + 1]) ok = 1;
          }
        }
      }
      feas[i][j] = ok;
    }
  }
  if (!feas[0][0]) return null;
  const canF = new Uint8Array(n), canE = new Uint8Array(n);
  const reach = new Array(n + 1);
  for (let i = 0; i <= n; i++) reach[i] = new Uint8Array(k + 1);
  reach[0][0] = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= k; j++) {
      if (!reach[i][j]) continue;
      if (known[i] !== 1 && feas[i + 1][j]) { canE[i] = 1; reach[i + 1][j] = 1; }
      if (j < k) {
        const L = clue[j];
        if (i + L <= n) {
          let fits = 1;
          for (let t = i; t < i + L; t++) if (known[t] === 2) { fits = 0; break; }
          if (fits) {
            const after = i + L;
            let ok = 0;
            if (after === n) { if (j === k - 1) ok = 1; }
            else if (known[after] !== 1 && feas[after + 1][j + 1]) ok = 1;
            if (ok) {
              for (let t = i; t < i + L; t++) canF[t] = 1;
              if (after < n) { canE[after] = 1; reach[after + 1][j + 1] = 1; }
            }
          }
        }
      }
    }
  }
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    if (canF[i] && canE[i]) out[i] = 0;
    else if (canF[i]) out[i] = 1;
    else if (canE[i]) out[i] = 2;
    else return null;
  }
  return out;
}
function solveGrid(rows, cols, n) {
  const st = new Uint8Array(n * n);
  let changed = true, guard = 0;
  while (changed && guard++ < 60) {
    changed = false;
    for (let y = 0; y < n; y++) {
      const kn = new Array(n);
      for (let x = 0; x < n; x++) kn[x] = st[y * n + x];
      const r = solveLine(kn, rows[y]);
      if (!r) return -1;
      for (let x = 0; x < n; x++) if (r[x] && st[y * n + x] !== r[x]) { st[y * n + x] = r[x]; changed = true; }
    }
    for (let x = 0; x < n; x++) {
      const kn = new Array(n);
      for (let y = 0; y < n; y++) kn[y] = st[y * n + x];
      const r = solveLine(kn, cols[x]);
      if (!r) return -1;
      for (let y = 0; y < n; y++) if (r[y] && st[y * n + x] !== r[y]) { st[y * n + x] = r[y]; changed = true; }
    }
    let done = true;
    for (let i = 0; i < n * n; i++) if (!st[i]) { done = false; break; }
    if (done) return 1;
  }
  return 0;
}
function denoiseBuilt(g) {
  if (g.n <= 5) return;
  const n = g.n, c = g.c, out = new Uint8Array(c);
  const th = n >= 20 ? 2 : 1;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const i = y * n + x;
    if (!c[i]) continue;
    let nb = 0;
    if (x > 0 && c[i - 1]) nb++;
    if (x < n - 1 && c[i + 1]) nb++;
    if (y > 0 && c[i - n]) nb++;
    if (y < n - 1 && c[i + n]) nb++;
    if (x > 0 && y > 0 && c[i - n - 1]) nb++;
    if (x < n - 1 && y > 0 && c[i - n + 1]) nb++;
    if (x > 0 && y < n - 1 && c[i + n - 1]) nb++;
    if (x < n - 1 && y < n - 1 && c[i + n + 1]) nb++;
    out[i] = nb >= th ? 1 : 0;
  }
  g.c = out;
}
function mirrorBuilt(g, horiz) {
  const n = g.n, o = newGrid(n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
    o.c[y * n + x] = horiz ? g.c[y * n + (n - 1 - x)] : g.c[(n - 1 - y) * n + x];
  return o;
}
function rotateBuilt(g, q) {
  let cur = g;
  for (let i = 0; i < q; i++) {
    const n = cur.n, o = newGrid(n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) o.c[x * n + (n - 1 - y)] = cur.c[y * n + x];
    cur = o;
  }
  return cur;
}
const BUILT_TRANSFORMS = [g => g, g => mirrorBuilt(g, true), g => mirrorBuilt(g, false), g => rotateBuilt(g, 1), g => rotateBuilt(g, 2),
  g => rotateBuilt(mirrorBuilt(g, true), 1)];
function builtDensity(g) { let s = 0; for (let i = 0; i < g.c.length; i++) s += g.c[i]; return s / g.c.length; }

function buildPuzzle(size, seed) {
  const tries = size <= 5 ? 500 : 200;
  let fallback = null;
  for (let t = 0; t < tries; t++) {
    const rng = mulberry32(hashString(seed + '#' + t));
    const usePattern = rng() < .58;
    const pool = usePattern ? PAT_RECIPES : ICON_RECIPES;
    const rec = pool[Math.floor(rng() * pool.length)];
    const P = painter(newGrid(size));
    rec.draw(P, size, rng);
    let grid = P.g, name = rec.name;
    grid = BUILT_TRANSFORMS[Math.floor(rng() * BUILT_TRANSFORMS.length)](grid);
    denoiseBuilt(grid);
    const d = builtDensity(grid);
    if (d < .2 || d > .82) continue;
    const clues = cluesForBuilt(grid);
    const res = solveGrid(clues.rows, clues.cols, size);
    if (res === 1) return { grid: grid.c, name, size };
    if (res === 0 && !fallback) fallback = { grid: grid.c, name, size };
  }
  if (fallback) return fallback;
  const g = newGrid(size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const r = Math.min(x, y, size - 1 - x, size - 1 - y);
    g.c[y * size + x] = (r % 2 === 0 && r < size / 2) ? 1 : 0;
  }
  return { grid: g.c, name: 'Pattern', size };
}

/* ---------------- Puzzle generation ---------------- */
const SIZES=[5,10,15];
const LEVELS_PER_SIZE=48;

function setPx(g,n,x,y,v){x=Math.round(x);y=Math.round(y);if(x>=0&&x<n&&y>=0&&y<n)g[y*n+x]=v;}
function mirrorV(g,n,x,y,v){setPx(g,n,x,y,v);setPx(g,n,n-1-x,y,v);}
function fillEllipse(g,n,cx,cy,rx,ry,v){for(let y=0;y<n;y++)for(let x=0;x<n;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1)g[y*n+x]=v;}}

function genInvader(rng,n){
  const g=new Uint8Array(n*n),mid=Math.floor(n/2);
  for(let y=0;y<n;y++){
    const t=y/(n-1);let p=t<.18?.12:t<.72?.5+rng()*.22:.5+rng()*.15;
    for(let x=0;x<=mid;x++)if(rng()<p)mirrorV(g,n,x,y);
  }
  const ey=Math.round(n*(.3+rng()*.12)),ex=Math.max(1,Math.round(n*(.16+rng()*.08))),es=n>=10?2:1;
  for(let dy=0;dy<es;dy++)for(let dx=0;dx<es;dx++)mirrorV(g,n,ex+dx,ey+dy,0);
  return g;
}
function genFace(rng,n){
  const g=new Uint8Array(n*n),cx=(n-1)/2,cy=n*.52,ry=n*(.36+rng()*.06),rx=n*(.32+rng()*.08);
  fillEllipse(g,n,cx,cy,rx,ry,1);
  const style=rng();
  if(style<.33){
    const s=n>=10?2:1,earX=Math.round(cx-rx)+1,earY=Math.round(cy-ry)-1;
    for(let k=0;k<s;k++)for(let j=0;j<=k;j++)mirrorV(g,n,earX+k,earY-j,1);
  }else if(style<.66&&n>=10){
    const ax=Math.round((n-1)/2);
    for(let y=Math.max(0,Math.round(cy-ry)-3);y<cy-ry;y++)setPx(g,n,ax,y,1);
    setPx(g,n,ax,Math.max(0,Math.round(cy-ry)-3),1);
  }
  const es=n>=10?2:1,ey=Math.round(n*(.36+rng()*.08)),ex=Math.round(n*(.24+rng()*.08));
  for(let dy=0;dy<es;dy++)for(let dx=0;dx<es;dx++)mirrorV(g,n,ex+dx,ey+dy,0);
  const my=Math.round(n*(.66+rng()*.06)),mouthW=Math.round(n*(.16+rng()*.12)),mx=Math.round((n-1)/2);
  if(rng()<.5){for(let dx=-mouthW;dx<=mouthW;dx++)setPx(g,n,mx+dx,my,0);}
  else{const r=Math.max(1,Math.round(n*.08));fillEllipse(g,n,mx,my,r,r,0);}
  return g;
}
function genBlocks(rng,n){
  const g=new Uint8Array(n*n),count=randInt(rng,4,8);
  for(let i=0;i<count;i++){
    const w=randInt(rng,1,Math.max(1,Math.floor(n/4))),h=randInt(rng,1,Math.max(1,Math.floor(n/4)));
    const x0=randInt(rng,0,Math.floor((n-1)/2)),y0=randInt(rng,0,n-h),v=rng()<.78?1:0;
    for(let y=y0;y<y0+h;y++)for(let dx=0;dx<w;dx++)mirrorV(g,n,x0+dx,y,v);
  }
  const bw=Math.round(n/4);
  for(let y=Math.round(n*.55);y<n-1;y++)for(let x=Math.floor(n/2)-bw;x<=Math.floor(n/2)+bw;x++)setPx(g,n,x,y,1);
  return g;
}
function genGeo(rng,n){
  const g=new Uint8Array(n*n),kind=randInt(rng,0,3),cx=(n-1)/2;
  if(kind===0){
    const flip=rng()<.5,curve=.6+rng()*1.1,baseW=.5+rng()*.42,jitter=rng()<.5;
    for(let y=0;y<n;y++){
      const t=(flip?(n-1-y):y)/(n-1);
      let half=Math.round(Math.pow(1-t,curve)*cx*baseW*2);
      if(jitter&&rng()<.3)half+=rng()<.5?-1:1;
      half=Math.max(0,half);
      for(let x=cx-half;x<=cx+half;x++)setPx(g,n,x,y,1);
    }
  }
  else if(kind===1){
    const skew=.55+rng()*.7,squash=rng()<.5,offset=randInt(rng,-1,1);
    for(let y=0;y<n;y++){
      let d=Math.abs(y-(n-1)/2+offset)*skew;
      if(squash)d*=.7+rng()*.5;
      d=Math.max(0,Math.round(d));
      for(let k=0;k<=d;k++)mirrorV(g,n,Math.round(cx)-k,y,1);
    }
  }
  else if(kind===2){
    const rx=n*(.32+rng()*.16),ry=n*(.32+rng()*.16),stripe=randInt(rng,2,4),offset=randInt(rng,0,stripe-1),horiz=rng()<.5;
    fillEllipse(g,n,cx,cx,rx,ry,1);
    for(let i=0;i<n;i++)if((i+offset)%stripe===0){
      if(horiz)for(let x=0;x<n;x++)setPx(g,n,x,i,0);
      else for(let y=0;y<n;y++)setPx(g,n,i,y,0);
    }
  }
  else{
    const bars=randInt(rng,3,5);
    for(let b=0;b<bars;b++){const y=Math.round(((b+.5)/bars)*n),w=Math.round(n*(.2+rng()*.5));for(let x=cx-w;x<=cx+w;x++)setPx(g,n,x,y+randInt(rng,-1,1),1);}
    fillEllipse(g,n,cx,cx,n*.2,n*.2,1);
  }
  return g;
}
function genQuilt(rng,n){
  const g=new Uint8Array(n*n),mid=Math.floor(n/2);
  for(let y=0;y<n;y++){
    let x=randInt(rng,0,1);
    while(x<=mid){
      if(rng()<.62){const len=randInt(rng,1,Math.max(1,mid-x+1));for(let dx=0;dx<len&&x+dx<=mid;dx++)mirrorV(g,n,x+dx,y);x+=len+randInt(rng,1,2);}
      else x++;
    }
  }
  return g;
}
const GENERATORS=[genInvader,genFace,genBlocks,genGeo,genQuilt];

function cropAndCenter(src,n,rng){
  let minX=n,minY=n,maxX=-1,maxY=-1;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(src[y*n+x]){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
  if(maxX<0)return src;
  const w=maxX-minX+1,h=maxY-minY+1,slX=n-w,slY=n-h;
  const offX=Math.floor(slX/2)+(slX%2===1&&rng()<.5?1:0),offY=Math.floor(slY/2)+(slY%2===1&&rng()<.5?1:0);
  const out=new Uint8Array(n*n);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(src[(minY+y)*n+minX+x])out[(offY+y)*n+offX+x]=1;
  return out;
}
function fillRatio(g){let c=0;for(const v of g)c+=v;return c/g.length;}
function qualityOk(g,n){
  const r=fillRatio(g);if(r<.3||r>.74)return false;
  const keys=new Set();for(let y=0;y<n;y++)keys.add(Array.from(g.slice(y*n,y*n+n)).join(""));
  if(keys.size<Math.ceil(n*.55))return false;
  let runs=0;
  for(let y=0;y<n;y++){let run=0;for(let x=0;x<n;x++){if(g[y*n+x])run++;else if(run){runs++;run=0;}}if(run)runs++;}
  return runs>=n*.9;
}
function computeClues(g,n){
  const runs=line=>{const out=[];let run=0;for(const v of line){if(v)run++;else if(run){out.push(run);run=0;}}if(run)out.push(run);return out.length?out:[0];};
  const rows=[],cols=[];
  for(let y=0;y<n;y++)rows.push(runs(g.slice(y*n,y*n+n)));
  for(let x=0;x<n;x++){const col=[];for(let y=0;y<n;y++)col.push(g[y*n+x]);cols.push(runs(col));}
  return{rows,cols};
}
function hiddenMasks(key,rows,cols){
  const rng=mulberry32(hashString(key+"::hidden"));
  const mask=lines=>lines.map(line=>{
    const m=line.map(num=>{if(num===0)return false;if(line.length===1)return rng()<.3;return rng()<.42;});
    if(line.length>1&&m.every(Boolean))m[randInt(rng,0,m.length-1)]=false;
    return m;
  });
  return{hiddenRows:mask(rows),hiddenCols:mask(cols)};
}
const puzzleCache=new Map();
const seenGridsByTier=new Map();
function gridSignature(g){return g.join("");}
function gridSimilarity(a,b){let same=0;for(let i=0;i<a.length;i++)if(a[i]===b[i])same++;return same/a.length;}
function tooSimilar(grid,seenGrids){for(const g of seenGrids)if(g.length===grid.length&&gridSimilarity(grid,g)>=.86)return true;return false;}
function fallbackGrid(rng,n){
  const shapes=[
    ()=>{const g=new Uint8Array(n*n);fillEllipse(g,n,(n-1)/2,(n-1)/2,n*(.3+rng()*.14),n*(.3+rng()*.14),1);return g;},
    ()=>{const g=new Uint8Array(n*n),pad=Math.max(1,Math.round(n*(.12+rng()*.1)));for(let y=pad;y<n-pad;y++)for(let x=pad;x<n-pad;x++)g[y*n+x]=1;return g;},
    ()=>{const g=new Uint8Array(n*n),cx=(n-1)/2,skew=.6+rng()*.6;for(let y=0;y<n;y++){const d=Math.round(Math.abs(y-cx)*skew);for(let k=0;k<=Math.max(0,Math.round(cx)-d);k++)mirrorV(g,n,Math.round(cx)-k,y,1);}return g;},
    ()=>{const g=new Uint8Array(n*n),rows=randInt(rng,3,5);for(let r=0;r<rows;r++){const y=Math.round(((r+.5)/rows)*n),w=Math.round(n*(.2+rng()*.5)),cx=(n-1)/2;for(let x=cx-w;x<=cx+w;x++)setPx(g,n,x,y,1);}return g;}
  ];
  return pick(rng,shapes)();
}
function parsePattern(flat){const n=5,g=new Uint8Array(n*n);for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(flat[y*n+x]==="#")g[y*n+x]=1;return g;}

function getPuzzle(mode,size,id){
  const key=mode+"-"+size+"-"+id;
  if(puzzleCache.has(key))return puzzleCache.get(key);
  const tierKey=mode+"-"+size;
  let seen=seenGridsByTier.get(tierKey);
  if(!seen){seen={sigs:new Set(),grids:[]};seenGridsByTier.set(tierKey,seen);}
  const isDup=g=>seen.sigs.has(gridSignature(g))||tooSimilar(g,seen.grids);
  let grid;

  /* Level 1 (5x5 Classic #1): Iconic Heart tutorial level */
  if(mode==="classic"&&size===5&&id===0){
    grid=parsePattern(".#.#.##########.###...#..");
  } else {
    /* Primary: verified-unique-solution icon/pattern generator (index.html's engine) */
    const built=buildPuzzle(size,key+"::built");
    if(built&&built.grid&&!isDup(built.grid))grid=built.grid;
    /* Fallback: this file's own procedural generators, all seeded/parametric (no static pixel data) */
    if(!grid){
      const rng=mulberry32(hashString(key+"::art"));let attempt=0;
      do{const raw=pick(rng,GENERATORS)(rng,size);grid=cropAndCenter(raw,size,rng);attempt++;}while((!qualityOk(grid,size)||isDup(grid))&&attempt<120);
      if(!qualityOk(grid,size)||isDup(grid)){
        let fbAttempt=0;
        do{grid=fallbackGrid(rng,size);fbAttempt++;}while(isDup(grid)&&fbAttempt<12);
      }
    }
  }
  seen.sigs.add(gridSignature(grid));
  seen.grids.push(grid);
  const{rows,cols}=computeClues(grid,size);
  const puzzle={key,n:size,grid,rows,cols};
  if(mode==="expert")Object.assign(puzzle,hiddenMasks(key,rows,cols));
  puzzleCache.set(key,puzzle);
  return puzzle;
}
function todayKey(date){date=date||new Date();const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return y+"-"+m+"-"+d;}
function getDailyPuzzle(date){
  date=date||new Date();
  const dayNumber=Math.floor((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-Date.UTC(2024,0,1))/86400000);
  return getPuzzle("daily",10,dayNumber);
}
function lineSolved(cells,sol,n,axis,index){
  for(let t=0;t<n;t++){const i=axis==="row"?index*n+t:t*n+index;if((cells[i]===1)!==(sol[i]===1))return false;}return true;
}

/* ---------------- Big Picture Mosaic Spec & Generators ---------------- */
const BIG_SPECS = [
  { label: "Kaleidoscope", n: 30, blocks: 3, sub: 10 },
  { label: "Mandala", n: 30, blocks: 3, sub: 10 },
  { label: "Snowflake", n: 30, blocks: 3, sub: 10 },
  { label: "Sunburst", n: 45, blocks: 3, sub: 15 },
  { label: "Garden", n: 45, blocks: 3, sub: 15 },
  { label: "Butterfly", n: 45, blocks: 3, sub: 15 }
];

function generateBigArt(idx, n) {
  const g = new Uint8Array(n * n);
  const cx = (n - 1) / 2, cy = (n - 1) / 2;
  const setP = (x, y, v) => {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && x < n && y >= 0 && y < n) g[y * n + x] = (v !== undefined ? v : 1);
  };
  const sym8 = (x, y, v) => {
    setP(cx + x, cy + y, v); setP(cx - x, cy + y, v);
    setP(cx + x, cy - y, v); setP(cx - x, cy - y, v);
    setP(cx + y, cy + x, v); setP(cx - y, cy + x, v);
    setP(cx + y, cy - x, v); setP(cx - y, cy - x, v);
  };
  const sym4 = (x, y, v) => {
    setP(cx + x, cy + y, v); setP(cx - x, cy + y, v);
    setP(cx + x, cy - y, v); setP(cx - x, cy - y, v);
  };
  const symH = (x, y, v) => {
    setP(cx + x, y, v); setP(cx - x, y, v);
  };

  if (idx === 0) {
    // Kaleidoscope (30x30)
    for (let r = 2; r < 14; r += 3) {
      for (let a = 0; a < Math.PI * 2; a += 0.04) {
        if (Math.sin(a * 8) > 0.1) sym4(Math.cos(a) * r, Math.sin(a) * r, 1);
      }
    }
    for (let d = 0; d < 14; d++) {
      sym8(d, d, 1);
      sym8(d, 0, 1);
      if (d > 4) sym8(d, d - 3, 1);
    }
    for (let x = 0; x < 14; x++) {
      for (let y = 0; y < 14; y++) {
        if ((x + y) % 4 === 0 && Math.hypot(x, y) < 13 && Math.hypot(x, y) > 5) sym4(x, y, 1);
      }
    }
    for (let x = 0; x < n; x++) { setP(x, 0, 1); setP(x, n - 1, 1); setP(0, x, 1); setP(n - 1, x, 1); }
  } else if (idx === 1) {
    // Mandala (30x30)
    for (let r = 1; r <= 13; r++) {
      const petals = r % 2 === 0 ? 8 : 12;
      for (let a = 0; a < Math.PI * 2; a += 0.03) {
        if (Math.cos(a * petals) > 0.28) sym4(Math.cos(a) * r, Math.sin(a) * r, 1);
      }
    }
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      for (let d = 2; d < 14; d++) sym4(Math.cos(a) * d, Math.sin(a) * d, 1);
    }
    for (let d = 8; d < 14; d++) {
      sym4(d, 13 - d, 1);
      sym4(d - 1, 13 - d, 1);
    }
  } else if (idx === 2) {
    // Snowflake (30x30)
    for (let d = 0; d < 14; d++) {
      sym8(d, 0, 1);
      sym8(d, d, 1);
      if (d >= 4 && d <= 12 && d % 3 === 0) {
        for (let b = 1; b <= 3; b++) { sym8(d - b, b, 1); sym8(d + b, b, 1); }
      }
      if (d >= 6 && d <= 12 && d % 2 === 0) {
        for (let b = 1; b <= 2; b++) { sym8(d, d - b, 1); sym8(d - b, d, 1); }
      }
    }
    for (let a = 0; a < Math.PI * 2; a += 0.05) {
      const r = 12 + Math.sin(a * 8) * 1.5;
      sym4(Math.cos(a) * r, Math.sin(a) * r, 1);
    }
  } else if (idx === 3) {
    // Sunburst (45x45)
    for (let r = 0; r < 7; r++) {
      for (let a = 0; a < Math.PI * 2; a += 0.05) sym4(Math.cos(a) * r, Math.sin(a) * r, 1);
    }
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
      for (let d = 8; d < 20; d++) {
        const wave = Math.sin(d * 0.8) * 1.2;
        sym4(Math.cos(a) * d + Math.sin(a) * wave, Math.sin(a) * d - Math.cos(a) * wave, 1);
      }
    }
    for (let a = Math.PI / 32; a < Math.PI * 2; a += Math.PI / 16) {
      for (let d = 9; d < 16; d++) sym4(Math.cos(a) * d, Math.sin(a) * d, 1);
    }
    for (let x = 2; x < n - 2; x++) {
      if (x % 2 === 0) { setP(x, 2, 1); setP(x, n - 3, 1); setP(2, x, 1); setP(n - 3, x, 1); }
    }
  } else if (idx === 4) {
    // Garden (45x45)
    for (let a = 0; a < Math.PI * 2; a += 0.02) {
      const r = 9 + Math.sin(a * 6) * 5;
      for (let d = 0; d < r; d++) {
        if (d > 3 && d < r - 1 && (Math.round(d) % 2 === 0)) continue;
        sym4(Math.cos(a) * d, Math.sin(a) * d, 1);
      }
    }
    for (let corner = 0; corner < 4; corner++) {
      const cx2 = corner % 2 === 0 ? 8 : n - 9;
      const cy2 = corner < 2 ? 8 : n - 9;
      for (let a = 0; a < Math.PI * 2; a += 0.04) {
        const r = 4 + Math.sin(a * 4) * 2.5;
        for (let d = 1; d < r; d++) setP(cx2 + Math.cos(a) * d, cy2 + Math.sin(a) * d, 1);
      }
    }
    for (let x = 4; x < n - 4; x++) {
      if (x % 3 !== 0) { setP(x, 1, 1); setP(x, n - 2, 1); setP(1, x, 1); setP(n - 2, x, 1); }
    }
  } else {
    // Butterfly (45x45)
    for (let y = 8; y <= 36; y++) {
      setP(cx, y, 1);
      if (y > 14 && y < 30) { setP(cx - 1, y, 1); setP(cx + 1, y, 1); }
    }
    setP(cx - 2, 7, 1); setP(cx - 4, 6, 1); setP(cx - 5, 4, 1);
    setP(cx + 2, 7, 1); setP(cx + 4, 6, 1); setP(cx + 5, 4, 1);
    for (let t = 0; t < Math.PI; t += 0.02) {
      const r1 = 16 * Math.sin(t);
      const wx1 = Math.cos(t) * r1 * 1.1;
      const wy1 = 18 - Math.sin(t) * r1 * 0.8;
      symH(wx1, wy1, 1);
      if (t > 0.4 && t < 2.7) {
        const innerR = r1 * 0.65;
        symH(Math.cos(t) * innerR * 1.1, 18 - Math.sin(t) * innerR * 0.8, 1);
      }
      const r2 = 13 * Math.sin(t);
      const wx2 = Math.cos(t) * r2 * 0.9;
      const wy2 = 28 + Math.sin(t) * r2 * 0.7;
      symH(wx2, wy2, 1);
      if (t > 0.5 && t < 2.6) {
        const innerR2 = r2 * 0.6;
        symH(Math.cos(t) * innerR2 * 0.9, 28 + Math.sin(t) * innerR2 * 0.7, 1);
      }
    }
    for (let x = 3; x < 14; x++) {
      symH(x, 16 + (x % 3), 1);
      symH(x, 26 + (x % 3), 1);
    }
  }
  return g;
}

const BIG_CACHE = new Map();
function getBig(idx) {
  if (BIG_CACHE.has(idx)) return BIG_CACHE.get(idx);
  const spec = BIG_SPECS[idx], n = spec.n, sub = spec.sub, b = spec.blocks;
  const g = generateBigArt(idx, n);
  const blocks = [];
  for (let by = 0; by < b; by++) {
    for (let bx = 0; bx < b; bx++) {
      const sg = new Uint8Array(sub * sub);
      for (let y = 0; y < sub; y++) {
        for (let x = 0; x < sub; x++) {
          sg[y * sub + x] = g[(by * sub + y) * n + (bx * sub + x)];
        }
      }
      const clues = computeClues(sg, sub);
      blocks.push({ grid: sg, clues });
    }
  }
  const res = { grid: g, blocks, name: spec.label };
  BIG_CACHE.set(idx, res);
  return res;
}

/* ---------------- Storage Controller (Human-Readable Level Names) ---------------- */
const Storage = {
  KEY: "ns_data",
  defaults: {
    settings: { dark: false, sound: true, autoCross: true, highlight: true },
    daily: { month: "", date: "", streak: 0, bestStreak: 0 },
    completed: {
      classic: { "5x5": 0, "10x10": 0, "15x15": 0 },
      expert: { "5x5": 0, "10x10": 0, "15x15": 0 },
      mosaic: {
        classic: {},
        expert: {}
      },
      daily: []
    }
  },

  getAll() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.completed) {
          this._cache = data;
          return data;
        }
      }
    } catch (e) {}

    const legacyRaw = this.readLegacy("nonogram_data", null) || this.readLegacy("ns-data-v1", null);
    if (legacyRaw) {
      const data = {
        settings: Object.assign({}, this.defaults.settings, legacyRaw.settings),
        daily: Object.assign({}, this.defaults.daily, legacyRaw.daily),
        completed: this.migrateCompleted(legacyRaw)
      };
      this.saveAll(data);
      this._cache = data;
      return data;
    }

    const initData = {
      settings: Object.assign({}, this.defaults.settings),
      daily: Object.assign({}, this.defaults.daily),
      completed: {
        classic: { "5x5": 0, "10x10": 0, "15x15": 0 },
        expert: { "5x5": 0, "10x10": 0, "15x15": 0 },
        mosaic: { classic: {}, expert: {} },
        daily: []
      }
    };
    this.saveAll(initData);
    this._cache = initData;
    return initData;
  },

  migrateCompleted(rawObj) {
    const comp = {
      classic: { "5x5": 0, "10x10": 0, "15x15": 0 },
      expert: { "5x5": 0, "10x10": 0, "15x15": 0 },
      mosaic: { classic: {}, expert: {} },
      daily: []
    };

    const toLastNum = (val) => {
      if (typeof val === "number" && isFinite(val)) return Math.max(0, Math.floor(val));
      if (Array.isArray(val)) {
        if (val.length === 0) return 0;
        const nums = val.map(v => {
          if (typeof v === "number" && isFinite(v)) return v;
          if (typeof v === "string") {
            const m = v.match(/\d+/);
            return m ? Number(m[0]) : 0;
          }
          return 0;
        }).filter(v => isFinite(v) && v > 0);
        return nums.length ? Math.max(...nums) : 0;
      }
      if (typeof val === "string") {
        const m = val.match(/\d+/);
        return m ? Number(m[0]) : 0;
      }
      return 0;
    };

    if (rawObj && rawObj.completed) {
      if (rawObj.completed.classic) {
        comp.classic["5x5"] = toLastNum(rawObj.completed.classic["5x5"]);
        comp.classic["10x10"] = toLastNum(rawObj.completed.classic["10x10"]);
        comp.classic["15x15"] = toLastNum(rawObj.completed.classic["15x15"]);
      }
      if (rawObj.completed.expert) {
        comp.expert["5x5"] = toLastNum(rawObj.completed.expert["5x5"]);
        comp.expert["10x10"] = toLastNum(rawObj.completed.expert["10x10"]);
        comp.expert["15x15"] = toLastNum(rawObj.completed.expert["15x15"]);
      }
      if (rawObj.completed.mosaic) {
        ["classic", "expert"].forEach(m => {
          if (rawObj.completed.mosaic[m]) {
            Object.keys(rawObj.completed.mosaic[m]).forEach(label => {
              comp.mosaic[m][label] = toLastNum(rawObj.completed.mosaic[m][label]);
            });
          }
        });
      }
      if (Array.isArray(rawObj.completed.daily)) {
        const curMonth = todayKey().substring(0, 7);
        comp.daily = Array.from(new Set(rawObj.completed.daily)).filter(k => typeof k === "string" && k.startsWith(curMonth));
      }
    }

    // Migrate old flat solved keys if present
    if (rawObj && rawObj.solved && typeof rawObj.solved === "object") {
      const curMonth = todayKey().substring(0, 7);
      Object.keys(rawObj.solved).forEach(key => {
        if (!rawObj.solved[key]) return;
        if (key.startsWith("classic-") || key.startsWith("expert-")) {
          const parts = key.split("-");
          const mode = parts[0], size = parts[1] + "x" + parts[1], id = Number(parts[2]);
          const num = id + 1;
          if (comp[mode] && typeof comp[mode][size] === "number") {
            comp[mode][size] = Math.max(comp[mode][size], num);
          }
        } else if (key.startsWith("mosaic-")) {
          const parts = key.split("-");
          const subMode = parts[1], bigIdx = Number(parts[2]), blockId = Number(parts[3]);
          const spec = BIG_SPECS[bigIdx];
          const label = spec ? spec.label : ("Mosaic " + (bigIdx + 1));
          const num = blockId + 1;
          if (!comp.mosaic[subMode]) comp.mosaic[subMode] = {};
          comp.mosaic[subMode][label] = Math.max(comp.mosaic[subMode][label] || 0, num);
        } else if (key.startsWith("daily-")) {
          const parts = key.split("-");
          if (parts.length >= 3) {
            const dayNum = Number(parts[2]);
            if (isFinite(dayNum)) {
              const d = new Date(Date.UTC(2024, 0, 1) + dayNum * 86400000);
              const dateStr = todayKey(d);
              if (dateStr.startsWith(curMonth) && !comp.daily.includes(dateStr)) comp.daily.push(dateStr);
            }
          }
        }
      });
    }

    return comp;
  },

  readLegacy(k, fallback) {
    try {
      const r = localStorage.getItem(k);
      return r ? Object.assign({}, fallback, JSON.parse(r)) : fallback;
    } catch(e) { return fallback; }
  },

  saveAll(data) {
    this._cache = data;
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {}
  },

  getSettings() { return this.getAll().settings; },
  saveSettings(s) {
    const all = this.getAll();
    all.settings = s;
    this.saveAll(all);
  },

  getCompleted() { return this.getAll().completed; },
  saveCompleted(c) {
    const all = this.getAll();
    all.completed = c;
    this.saveAll(all);
  },

  getDaily() {
    const all = this.getAll();
    const curMonth = todayKey().substring(0, 7);
    const d = all.daily;
    if (!d || d.month !== curMonth) {
      const refreshed = { month: curMonth, date: "", streak: 0, bestStreak: (d && d.bestStreak) || 0 };
      all.daily = refreshed;
      this.saveAll(all);
      return refreshed;
    }
    return d;
  },
  saveDaily(d) {
    const all = this.getAll();
    const curMonth = todayKey().substring(0, 7);
    if (d && !d.month) d.month = curMonth;
    all.daily = d;
    this.saveAll(all);
  },

  // Level queries & mutations (stores last completed number directly)
  isLevelCompleted(mode, size, id) {
    const comp = this.getCompleted();
    const sizeKey = size + "x" + size;
    const num = id + 1;
    const last = comp[mode] && comp[mode][sizeKey];
    if (typeof last === "number") return num <= last;
    if (Array.isArray(last)) return last.includes(num);
    return false;
  },
  isLevelUnlocked(mode, size, id) {
    if (id === 0) return true;
    return this.isLevelCompleted(mode, size, id - 1);
  },
  markLevelCompleted(mode, size, id) {
    const all = this.getAll();
    const sizeKey = size + "x" + size;
    const num = id + 1;
    if (!all.completed[mode]) all.completed[mode] = {};
    const val = all.completed[mode][sizeKey];
    const current = typeof val === "number" ? val : (Array.isArray(val) ? (val.length ? Math.max(...val) : 0) : 0);
    all.completed[mode][sizeKey] = Math.max(current, num);
    this.saveAll(all);
  },

  // Mosaic queries & mutations
  bigDone(subMode, bigIdx) {
    const comp = this.getCompleted();
    const spec = BIG_SPECS[bigIdx];
    const label = spec ? spec.label : ("Mosaic " + (bigIdx + 1));
    const val = comp.mosaic && comp.mosaic[subMode] && comp.mosaic[subMode][label];
    const last = typeof val === "number" ? val : (Array.isArray(val) ? (val.length ? Math.max(...val) : 0) : 0);
    const out = {};
    for (let b = 0; b < 9; b++) {
      if (b + 1 <= last) {
        out[b] = 1;
      }
    }
    return out;
  },
  saveMosaicSection(subMode, bigIdx, blockId) {
    const all = this.getAll();
    const spec = BIG_SPECS[bigIdx];
    const label = spec ? spec.label : ("Mosaic " + (bigIdx + 1));
    const num = blockId + 1;
    if (!all.completed.mosaic) all.completed.mosaic = { classic: {}, expert: {} };
    if (!all.completed.mosaic[subMode]) all.completed.mosaic[subMode] = {};
    const val = all.completed.mosaic[subMode][label];
    const current = typeof val === "number" ? val : (Array.isArray(val) ? (val.length ? Math.max(...val) : 0) : 0);
    all.completed.mosaic[subMode][label] = Math.max(current, num);
    this.saveAll(all);
  },
  removeMosaicSection(subMode, bigIdx, blockId) {
    const all = this.getAll();
    const spec = BIG_SPECS[bigIdx];
    const label = spec ? spec.label : ("Mosaic " + (bigIdx + 1));
    if (all.completed.mosaic && all.completed.mosaic[subMode] && all.completed.mosaic[subMode][label] !== undefined) {
      all.completed.mosaic[subMode][label] = Math.max(0, blockId);
    }
    this.saveAll(all);
  },

  // Daily challenge queries & mutations (Month-Scoped: Auto-prunes past months)
  isDailyCompleted(dateKey) {
    const comp = this.getCompleted();
    const curMonth = todayKey().substring(0, 7);
    return Array.isArray(comp.daily) && dateKey.startsWith(curMonth) && comp.daily.includes(dateKey);
  },
  markDailyCompleted(dateKey) {
    const all = this.getAll();
    const curMonth = todayKey().substring(0, 7);
    if (!Array.isArray(all.completed.daily)) all.completed.daily = [];
    all.completed.daily = all.completed.daily.filter(k => typeof k === "string" && k.startsWith(curMonth));
    if (!all.completed.daily.includes(dateKey)) {
      all.completed.daily.push(dateKey);
    }
    this.saveAll(all);
  },

  // Count total solved
  getSolvedCount(mode, size) {
    const comp = this.getCompleted();
    if (!comp[mode]) return 0;
    if (size) {
      const sizeKey = size + "x" + size;
      const val = comp[mode][sizeKey];
      return typeof val === "number" ? val : (Array.isArray(val) ? val.length : 0);
    }
    let sum = 0;
    Object.values(comp[mode]).forEach(v => {
      sum += typeof v === "number" ? v : (Array.isArray(v) ? v.length : 0);
    });
    return sum;
  },

  isPuzzleCompleted(puzzle, customOpts, dateObj) {
    if (!puzzle) return false;
    if (customOpts && customOpts.subMode) {
      const done = this.bigDone(customOpts.subMode, customOpts.bigIdx);
      return !!done[customOpts.blockId];
    }
    if (dateObj) {
      return this.isDailyCompleted(todayKey(dateObj));
    }
    const parts = puzzle.key.split("-");
    if (parts.length >= 3) {
      return this.isLevelCompleted(parts[0], Number(parts[1]), Number(parts[2]));
    }
    return false;
  },

  markPuzzleCompleted(puzzle, customOpts, dateObj) {
    if (!puzzle) return;
    if (customOpts && customOpts.subMode) {
      this.saveMosaicSection(customOpts.subMode, customOpts.bigIdx, customOpts.blockId);
      return;
    }
    if (dateObj) {
      this.markDailyCompleted(todayKey(dateObj));
      return;
    }
    const parts = puzzle.key.split("-");
    if (parts.length >= 3) {
      this.markLevelCompleted(parts[0], Number(parts[1]), Number(parts[2]));
    }
  },

  hasAnyProgress() {
    const comp = this.getCompleted();
    return this.getSolvedCount("classic") > 0 || this.getSolvedCount("expert") > 0 || (comp.daily && comp.daily.length > 0);
  },

  resetAll() {
    this._cache = null;
    localStorage.removeItem(this.KEY);
    this.saveAll(this.defaults);
    seenTutorialLevel1 = false;
    seenHelpSession = false;
  }
};

// Purge all legacy separate keys
try{
  ["nonogram_data", "ns-data-v1", "ns-settings-v1", "ns-solved-v1", "ns-daily-v1", "ns-saves-v1", "ns-hints-v1", "ns-seen-help-v1", "ns-mosaic-v1"].forEach(k => localStorage.removeItem(k));
}catch(e){}

let seenHelpSession = false;
let seenTutorialLevel1 = false;

const loadSettings = () => Storage.getSettings();
const saveSettings = s => Storage.saveSettings(s);
const loadCompleted = () => Storage.getCompleted();
const loadDaily = () => Storage.getDaily();
const saveDaily = d => Storage.saveDaily(d);
const bigDone = (mode, idx) => Storage.bigDone(mode, idx);
const saveMosaicSection = (mode, idx, blockId) => Storage.saveMosaicSection(mode, idx, blockId);

/* ---------------- Spatial Ambient FM & Pentatonic Audio Engine ---------------- */
const sound = {
  ctx: null,
  master: null,
  reverb: null,
  enabled: true,
  comboIndex: 0,
  lastFillTime: 0,

  // Warm, deeply relaxing C Major Pentatonic scale across 2 octaves
  SCALE: [
    392.00,  // G4
    440.00,  // A4
    523.25,  // C5
    587.33,  // D5
    659.25,  // E5
    783.99,  // G5
    880.00,  // A5
    1046.50, // C6
    1174.66, // D6
    1318.51  // E6
  ],

  ensure() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.master.connect(this.ctx.destination);
      } catch (e) { return null; }
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  // Ultra lightweight marimba pluck with 0 audio thread overhead
  playMarimba(freq, dur = 0.12, vol = 0.22, when = 0, harmonicRatio = 2.76, modIndex = 1.8, pan = 0, sendReverb = false) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    let outputNode = gain;
    if (typeof ctx.createStereoPanner === "function") {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, pan)), now);
      gain.connect(panner);
      outputNode = panner;
    }
    osc.connect(gain);
    outputNode.connect(this.master);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  },

  click() {
    const ctx = this.ensure();
    if (!ctx) return;
    this.playMarimba(960, 0.035, 0.12, 0, 1, 0, 0, false);
  },

  fill(pan = 0) {
    const now = performance.now();
    if (now - this.lastFillTime > 950) {
      this.comboIndex = 0;
    } else {
      this.comboIndex = (this.comboIndex + 1) % this.SCALE.length;
    }
    this.lastFillTime = now;

    const note = this.SCALE[this.comboIndex];
    this.playMarimba(note, 0.14, 0.22, 0, 1, 0, pan, false);
  },

  cross(pan = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.032);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

    let output = gain;
    if (typeof ctx.createStereoPanner === "function") {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, pan)), now);
      gain.connect(panner);
      output = panner;
    }
    output.connect(this.master);

    osc.start(now);
    osc.stop(now + 0.04);
  },

  undo(pan = 0) {
    // Soothing gentle waterdrop swoop
    this.playMarimba(440, 0.11, 0.18, 0, 1.5, 0.6, pan, true);
  },

  lineDone() {
    // Celestial 3-bell chord chime blooming into ambient reverb (G5 -> C6 -> E6)
    this.playMarimba(783.99, 0.42, 0.24, 0, 2.0, 0.6, -0.3, true);
    this.playMarimba(1046.50, 0.50, 0.28, 0.05, 2.0, 0.6, 0.0, true);
    this.playMarimba(1318.51, 0.60, 0.24, 0.11, 1.5, 0.4, 0.3, true);
  },

  error(pan = 0) {
    // Warm, friendly wooden double-bonk (clear & zero harshness)
    this.playMarimba(170, 0.14, 0.25, 0, 1.5, 0.8, pan, false);
    this.playMarimba(130, 0.16, 0.28, 0.04, 1.5, 0.8, pan, false);
  },

  hint() {
    // Sparkling ethereal dream harp ripple (C5 -> E5 -> G5 -> C6 -> E6)
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
      const pan = (i / 4) * 0.8 - 0.4;
      this.playMarimba(f, 0.35, 0.20, i * 0.055, 2.0, 0.5, pan, true);
    });
  },

  denied() {
    // Soft double wooden knock
    this.playMarimba(180, 0.045, 0.16, 0, 1.2, 0.5, 0, false);
    this.playMarimba(140, 0.045, 0.14, 0.055, 1.2, 0.5, 0, false);
  },

  gameOver() {
    // Somber, gentle low marimba descent
    this.playMarimba(392.00, 0.35, 0.22, 0, 1.5, 0.7, -0.2, true);
    this.playMarimba(329.63, 0.38, 0.22, 0.16, 1.5, 0.7, 0.0, true);
    this.playMarimba(261.63, 0.60, 0.26, 0.34, 1.8, 0.8, 0.2, true);
  },

  win() {
    // Heartwarming orchestral music box victory melody + ambient major 9th bloom
    const melody = [
      { f: 523.25, t: 0, d: 0.22, p: -0.3 },    // C5
      { f: 659.25, t: 0.11, d: 0.22, p: -0.1 }, // E5
      { f: 783.99, t: 0.22, d: 0.26, p: 0.1 },  // G5
      { f: 1046.50, t: 0.34, d: 0.45, p: 0.3 }, // C6
      { f: 1174.66, t: 0.45, d: 0.40, p: 0.0 }, // D6
      { f: 1318.51, t: 0.56, d: 0.65, p: 0.2 }  // E6
    ];
    melody.forEach(n => {
      this.playMarimba(n.f, n.d, 0.26, n.t, 2.0, 0.5, n.p, true);
      this.playMarimba(n.f * 2, n.d * 0.6, 0.09, n.t + 0.01, 1.0, 0.1, n.p * 0.5, true);
    });
    // Ambient grand chord bloom
    [261.63, 392.00, 523.25, 659.25, 987.77, 1046.50].forEach((f, idx) => {
      const p = (idx % 2 === 0 ? -1 : 1) * 0.25;
      this.playMarimba(f, 1.4, 0.18, 0.58, 1.5, 0.3, p, true);
    });
  }
};

// Global audio unlocker on first touch or keypress
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    sound.ensure();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
}

/* ---------------- Global state ---------------- */
const G={
  screen:{name:"menu"},
  settings:loadSettings(),
  completed:loadCompleted(),
  daily:loadDaily(),
  cleanup:null,
  refreshTheme:null
};
function applyDark(){
  document.documentElement.classList.toggle("dark",!!G.settings.dark);
  if(typeof G.refreshTheme==="function") G.refreshTheme();
}
function refreshStores(){G.completed=loadCompleted();G.daily=loadDaily();}

/* ---------------- DOM helpers ---------------- */
const app=document.getElementById("app");
const modalRoot=document.getElementById("modals");
function modalOpen(){return modalRoot.children.length>0;}
function closeModal(){modalRoot.innerHTML="";}
function showModal(html){modalRoot.innerHTML='<div class="overlay">'+html+"</div>";}
function fmtTime(sec){const m=Math.floor(sec/60),s=sec%60;return m+":"+String(s).padStart(2,"0");}
function thumbHTML(grid,n){
  let rects = "";
  for(let y = 0; y < n; y++){
    for(let x = 0; x < n; x++){
      if(grid[y * n + x] === 1){
        rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
  }
  return '<svg class="thumb-svg" viewBox="0 0 ' + n + ' ' + n + '" width="100%" height="100%" shape-rendering="crispEdges"><g fill="currentColor">' + rects + '</g></svg>';
}
function drawGridToCanvas(grid,n,canvas,color,bg){
  const size=canvas.width,ctx=canvas.getContext("2d");
  if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,size,size);}
  else{ctx.clearRect(0,0,size,size);}
  const scl=size/n;
  ctx.fillStyle=color||(document.documentElement.classList.contains("dark")?"#e9eff8":"#2f333b");
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    if(grid[y*n+x]===1)ctx.fillRect(Math.floor(x*scl),Math.floor(y*scl),Math.ceil(scl),Math.ceil(scl));
  }
}

/* floating ambient background squares */
function floatsHTML(){
  const isDark=document.documentElement.classList.contains("dark");
  const colors=isDark
    ? ["rgba(56,189,248,.14)","rgba(129,140,248,.12)","rgba(52,211,153,.12)","rgba(168,85,247,.12)","rgba(244,114,182,.10)","rgba(34,211,238,.14)"]
    : ["rgba(45,134,199,.18)","rgba(18,168,128,.15)","rgba(139,124,240,.15)","rgba(245,158,11,.14)","rgba(239,111,142,.14)","rgba(14,165,233,.16)"];
  
  // 12 naturally distributed positions across the whole screen canvas
  const positions=[
    {l:6,  t:10, s:18, dur:14, delay:0,   rx:8,   rot:12},
    {l:28, t:14, s:14, dur:16, delay:1.2, rx:-8,  rot:-15},
    {l:50, t:8,  s:16, dur:15, delay:2.0, rx:6,   rot:8},
    {l:72, t:16, s:18, dur:13, delay:3.5, rx:-6,  rot:-12},
    {l:92, t:12, s:20, dur:16, delay:0.8, rx:10,  rot:15},
    {l:14, t:46, s:18, dur:12, delay:3.1, rx:8,   rot:14},
    {l:86, t:48, s:18, dur:14, delay:1.7, rx:-8,  rot:-20},
    {l:22, t:72, s:16, dur:15, delay:2.2, rx:6,   rot:10},
    {l:78, t:70, s:20, dur:13, delay:1.5, rx:-8,  rot:16},
    {l:8,  t:86, s:20, dur:13, delay:2.5, rx:10,  rot:18},
    {l:48, t:90, s:16, dur:16, delay:0.5, rx:-6,  rot:-10},
    {l:90, t:84, s:22, dur:15, delay:0.8, rx:-10, rot:-10}
  ];

  let h='<div class="floats">';
  positions.forEach((p,i)=>{
    h+='<div class="floaty" style="left:'+p.l+'%;top:'+p.t+'%;width:clamp(10px,'+p.s+'px,3vw);height:clamp(10px,'+p.s+'px,3vw);background:'+colors[i%colors.length]+';--dur:'+p.dur+'s;animation-delay:'+p.delay+'s;--drift-x:'+p.rx+'px;--rot:'+p.rot+'deg"></div>';
  });
  return h+"</div>";
}
function confettiHTML(count){
  count=count||70;const colors=["#2d86c7","#36c8a6","#f5b840","#ef6f8e","#8b7cf0","#4cc3e8"];let h='<div class="confetti-wrap">';
  for(let i=0;i<count;i++){const size=7+((i*29)%9);h+='<div class="confetti-piece" style="left:'+((i*53+5)%100)+'%;width:'+size+'px;height:'+size+'px;background:'+colors[i%colors.length]+';border-radius:'+(i%4===0?"50%":"2px")+';--dur:'+(2.4+((i*17)%20)/10)+'s;--delay:'+(((i*11)%18)/10)+'s;--spin:'+(360+((i*97)%720))+'deg"></div>';}
  return h+"</div>";
}

/* ==================================================================
   MAIN MENU
   ================================================================== */
function renderMenu(){
  if(G.cleanup){G.cleanup();G.cleanup=null;}
  closeModal();
  refreshStores();
  const total=LEVELS_PER_SIZE*SIZES.length;
  const classicDone=Storage.getSolvedCount("classic");
  const expertDone=Storage.getSolvedCount("expert");
  const now=new Date(),dkey=todayKey(now);
  const dailyDone=Storage.isDailyCompleted(dkey)||G.daily.date===dkey;
  const cards=[
    {mode:"daily",border:"#33c79f",iconBg:"#dcf7ef",iconColor:"#12a880",ic:"calendar",title:"DAILY CHALLENGE",sub:dailyDone?"Completed — see you tomorrow!":"New puzzle every day",pct:dailyDone?100:0,extra:G.daily.streak>0?'<span class="streak-badge">'+icon("flame")+" "+G.daily.streak+"</span>":(dailyDone?'<span style="color:#12a880">'+icon("check")+"</span>":""),pc:"#33c79f"},
    {mode:"classic",border:"#2d86c7",iconBg:"#e0f0fa",iconColor:"#1f7fc0",ic:"classic",title:"CLASSIC MODE",sub:"Easy and fun play",pct:classicDone/total*100,extra:classicDone>=total?'<span style="color:#12a880">'+icon("check")+'</span>':"",pc:"#2d86c7"},
    {mode:"expert",border:"#3b4b9e",iconBg:"#e4e8f8",iconColor:"#3b4b9e",ic:"expert",title:"EXPERT MODE",sub:"Hidden hints, big challenge",pct:expertDone/total*100,extra:expertDone>=total?'<span style="color:#12a880">'+icon("check")+'</span>':"",pc:"#3b4b9e"}
  ];
  let cardsHTML="";
  cards.forEach((c,i)=>{
    cardsHTML+=
      '<button class="mode-card press" data-mode="'+c.mode+'" style="border-color:'+c.border+';box-shadow:0 5px 0 '+c.border+'22,0 12px 26px rgba(45,90,130,.10);animation-delay:'+(i*70)+'ms">'+
        '<div class="mode-ic" style="background:'+c.iconBg+';color:'+c.iconColor+'">'+icon(c.ic)+"</div>"+
        '<div class="mode-main"><div class="mode-title">'+c.title+(c.mode==="daily"&&dailyDone?' <span style="color:#12a880">'+icon("check")+"</span>":"")+'</div>'+
        '<div class="mode-sub">'+c.sub+'</div>'+
        '<div class="mode-foot"><div class="prog" style="flex:1;--pc:'+c.pc+'"><i style="width:'+Math.min(100,Math.round(c.pct))+'%;background:'+c.pc+'"></i></div>'+c.extra+'</div></div>'+
      "</button>";
  });
  app.innerHTML=
    '<div class="screen">'+floatsHTML()+
      '<div class="menu-top">'+
        '<button class="icon-btn press" data-act="dark">'+icon(G.settings.dark?"sun":"moon")+'</button>'+
        '<button class="icon-btn press" data-act="help">'+icon("help")+'</button>'+
        '<button class="icon-btn press" data-act="settings">'+icon("gear")+'</button>'+
      "</div>"+
      '<div class="menu-body"><div class="menu-col">'+
        '<div class="menu-brand">'+
          '<div class="brand-title">NONOGRAM SQUARE</div>'+
          '<div class="brand-sub">THE ART OF NUMBER LOGIC</div>'+
        '</div>'+
        cardsHTML+
        '<button class="mosaic-link press" data-act="mosaic">'+
          '<div class="mosaic-link-ic">'+icon("classic")+'</div>'+
          '<div class="mosaic-link-text">'+
            '<b>BIG PICTURE MOSAIC</b>'+
            '<small>6 Giant Masterpieces · 9 Pieces Each</small>'+
          '</div>'+
          '<div class="mosaic-link-arrow">'+icon("next")+'</div>'+
        '</button>'+
        '<button class="quick press" data-act="quick">'+icon("play")+" QUICK START</button>"+
      '</div></div>'+
    "</div>";

  app.querySelector('[data-act="dark"]').onclick=()=>{G.settings.dark=!G.settings.dark;saveSettings(G.settings);applyDark();sound.click();renderMenu();};
  app.querySelector('[data-act="help"]').onclick=()=>{sound.click();showHelp();};
  app.querySelector('[data-act="settings"]').onclick=()=>{sound.click();showSettings();};
  app.querySelector('[data-act="mosaic"]').onclick=()=>{sound.click();G.screen={name:"mosaic"};renderMosaicScreen(0,"classic");};
  app.querySelector('[data-act="quick"]').onclick=quickStart;
  cards.forEach(c=>{app.querySelector('[data-mode="'+c.mode+'"]').onclick=()=>{
    sound.click();
    if(c.mode==="daily"){G.screen={name:"daily"};renderDailyScreen();}
    else G.screen={name:"select",mode:c.mode},renderLevelSelect(c.mode);
  };});
}

function quickStart(){
  sound.click();
  const modes=["classic","expert"];
  for(const mode of modes)for(const size of SIZES)for(let id=0;id<LEVELS_PER_SIZE;id++){
    if(!Storage.isLevelCompleted(mode,size,id)){startGame(mode,size,id);return;}
  }
  startGame("classic",5,0);
}

/* ==================================================================
   DAILY CHALLENGE SCREEN
   ================================================================== */
function renderDailyScreen(){
  if(G.cleanup){G.cleanup();G.cleanup=null;}
  closeModal();
  refreshStores();
  const now=new Date();
  const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  // Today's puzzle info
  const todayPuzzle=getDailyPuzzle(now);
  const isTodaySolved=Storage.isDailyCompleted(todayKey(now));

  // Calendar info
  const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const firstDay=new Date(now.getFullYear(),now.getMonth(),1).getDay();
  const dows=["S","M","T","W","T","F","S"];
  let calHTML=dows.map(w=>`<div class="dow">${w}</div>`).join("");
  for(let i=0;i<firstDay;i++) calHTML+='<div></div>';

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  for(let day=1;day<=dim;day++){
    const dayTime = new Date(now.getFullYear(), now.getMonth(), day).getTime();
    const isFuture = dayTime > todayStart;
    const isPast = dayTime < todayStart;
    const isToday = dayTime === todayStart;
    const targetDate = new Date(now.getFullYear(), now.getMonth(), day);
    const isSolved = Storage.isDailyCompleted(todayKey(targetDate));
    const isLocked = isFuture || (isPast && !isSolved);
    const isPlayable = isToday || isSolved;

    let innerContent = '';
    if(isSolved){
      const puzzle = getDailyPuzzle(targetDate);
      innerContent = '<div class="cal-thumb">' + thumbHTML(puzzle.grid, puzzle.n) + '</div>';
    }
    innerContent += '<span class="day-num">' + day + '</span>';

    const classes = [
      'd',
      'press',
      isSolved ? 'done' : '',
      isToday ? 'today' : '',
      isLocked ? 'future' : ''
    ].filter(Boolean).join(' ');

    calHTML += `<button class="${classes}" data-day="${day}" ${!isPlayable ? 'disabled' : ''} title="${isToday ? 'Today\'s Puzzle' : (isSolved ? 'Solved' : (isPast ? 'Expired' : 'Locked'))}">${innerContent}</button>`;
  }

  app.innerHTML=
    '<div class="screen">'+floatsHTML()+
      '<div class="ls-head">'+
        '<button class="back-link press" data-act="back">'+icon("back")+'</button>'+
        '<span style="font-size:17px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--heading)">DAILY</span>'+
        '<div class="head-tools">'+
          '<button class="icon-btn press" data-act="dark">'+icon(G.settings.dark?"sun":"moon")+'</button>'+
          '<button class="icon-btn press" data-act="help">'+icon("help")+'</button>'+
          '<button class="icon-btn press" data-act="settings">'+icon("gear")+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="daily-wrap">'+
        '<div class="daily-col">'+
          '<div class="day-hero">'+
            '<div class="dh-k">'+dayNames[now.getDay()]+'</div>'+
            '<div class="dh-t">'+monthNames[now.getMonth()]+' '+now.getDate()+'</div>'+
            '<div class="dh-r">'+
              '<span class="dh-tag">'+icon("classic")+' '+todayPuzzle.n+'×'+todayPuzzle.n+'</span>'+
              '<span class="dh-tag">'+icon("flame")+' '+(G.daily.streak||0)+' day'+((G.daily.streak===1)?'':'s')+'</span>'+
              (isTodaySolved?'<span class="dh-tag" style="color:#12a880">'+icon("check")+' Solved</span>':'')+
              '<button class="btn-play-daily press" data-act="play-today">'+
                (isTodaySolved?icon("restart"):icon("play"))+' <span>'+(isTodaySolved?'Replay':'Play')+'</span>'+
              '</button>'+
            '</div>'+
          '</div>'+
          '<div class="sect-k">'+monthNames[now.getMonth()]+' '+now.getFullYear()+'</div>'+
          '<div class="cal">'+calHTML+'</div>'+
          '<p class="daily-subtext">A brand new picture every day. Solve daily puzzles on time to build your streak!</p>'+
        '</div>'+
      '</div>'+
    '</div>';

  // Event handlers
  app.querySelector('[data-act="back"]').onclick=()=>{sound.click();G.screen={name:"menu"};renderMenu();};
  app.querySelector('[data-act="dark"]').onclick=()=>{G.settings.dark=!G.settings.dark;saveSettings(G.settings);applyDark();sound.click();renderDailyScreen();};
  app.querySelector('[data-act="help"]').onclick=()=>{sound.click();showHelp();};
  app.querySelector('[data-act="settings"]').onclick=()=>{sound.click();showSettings();};

  app.querySelector('[data-act="play-today"]').onclick=()=>{
    sound.click();
    const dayNumber=Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(2024,0,1))/86400000);
    startGame("daily",10,dayNumber,now);
  };

  app.querySelectorAll('.cal .d:not([disabled])').forEach(cell=>{
    cell.onclick=()=>{
      const day=Number(cell.dataset.day);
      const targetDate=new Date(now.getFullYear(),now.getMonth(),day);
      const dayNumber=Math.floor((Date.UTC(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate())-Date.UTC(2024,0,1))/86400000);
      sound.click();
      startGame("daily",10,dayNumber,targetDate);
    };
  });
}

/* ==================================================================
   BIG PICTURE MOSAIC SCREEN
   ================================================================== */
function renderMosaicScreen(bigIdx, subMode){
  if(G.cleanup){G.cleanup();G.cleanup=null;}
  closeModal();
  refreshStores();
  bigIdx=bigIdx!=null?bigIdx:0;
  subMode=subMode||"classic";
  G.screen={name:"mosaic",bigIdx,subMode};

  const data=getBig(bigIdx);
  const spec=BIG_SPECS[bigIdx];
  const blocksDone=bigDone(subMode,bigIdx);
  const doneCount=Object.keys(blocksDone).length;
  const isAllFin=doneCount>=9;

  let tabsHTML="";
  BIG_SPECS.forEach((sp,i)=>{
    const d=bigDone(subMode,i);
    const fin=Object.keys(d).length>=9;
    const bgData=getBig(i);
    tabsHTML+=
      '<button class="mosaic-tab press '+(i===bigIdx?"on ":"")+(fin?"fin ":"")+'" data-tab="'+i+'">'+
        thumbHTML(bgData.grid,sp.n)+
      '</button>';
  });

  let cellsHTML="";
  let firstUnsolved=-1;
  for(let i=0;i<9;i++){
    const isDone=!!blocksDone[i];
    if(!isDone&&firstUnsolved<0)firstUnsolved=i;
    const b=data.blocks[i];
    let inner="";
    const isCur=!isDone&&i===firstUnsolved;
    const isLocked=!isDone&&!isCur;
    if(isDone){
      inner='<div class="cal-thumb">'+thumbHTML(b.grid,spec.sub)+'</div><span class="mcell-check">'+icon("check")+'</span>';
    }else if(isCur){
      inner='<span class="q">'+(i+1)+'</span><span class="mcell-play-badge">PLAY</span>';
    }else{
      inner='<span class="q">'+(i+1)+'</span>';
    }
    cellsHTML+=
      '<button class="mcell press '+(isDone?"done ":"")+(isCur?"cur ":"")+(isLocked?"locked ":"")+'" data-block="'+i+'" '+(isLocked?'disabled title="Solve Section '+(i+1)+' first"':'')+'>'+
        inner+
      '</button>';
  }

  app.innerHTML=
    '<div class="screen">'+floatsHTML()+
      '<div class="ls-head">'+
        '<button class="back-link press" data-act="back">'+icon("back")+'<span>Back</span></button>'+
        '<span style="font-size:17px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--heading)">MOSAIC</span>'+
        '<div class="head-tools">'+
          '<button class="icon-btn press" data-act="dark">'+icon(G.settings.dark?"sun":"moon")+'</button>'+
          '<button class="icon-btn press" data-act="help">'+icon("help")+'</button>'+
          '<button class="icon-btn press" data-act="settings">'+icon("gear")+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="mosaic-wrap">'+
        '<div class="mosaic-col">'+
          '<div class="mosaic-seg">'+
            '<button class="press '+(subMode==="classic"?"on":"")+'" data-submode="classic">Classic</button>'+
            '<button class="press '+(subMode==="expert"?"on":"")+'" data-submode="expert">Expert</button>'+
          '</div>'+
          '<div class="mosaic-tabs">'+tabsHTML+'</div>'+
          '<div class="mosaic-meta">'+
            '<b>'+spec.label+'</b>'+
            '<div class="mosaic-meta-right">'+
              '<div class="mosaic-mini-prog"><i style="width:'+Math.round((doneCount/9)*100)+'%"></i></div>'+
              '<span>'+doneCount+' / 9</span>'+
            '</div>'+
          '</div>'+
          '<div class="mosaic-board '+(isAllFin?'all-fin':'')+'">'+cellsHTML+'</div>'+
          '<div class="mosaic-actions">'+
            '<button class="btn-ghost press" style="flex:1" data-act="preview">'+icon("classic")+' <span>Preview</span></button>'+
            '<button class="btn-primary press" style="flex:1.2" data-act="play-next">'+
              icon(isAllFin?"restart":"play")+' <span>'+(isAllFin?"Replay":(doneCount>0?"Continue":"Start"))+'</span>'+
            '</button>'+
            '<!-- <button class="btn-ghost press" style="padding:clamp(5px, 1vh, 8px) clamp(6px, 1vw, 10px);font-size:clamp(10.5px, 1.3vh, 12px);color:#f59e0b;border-color:rgba(245,158,11,.4)" data-act="test-toggle" title="'+(isAllFin?'Reset test for this mosaic':'Instantly solve all 9 parts for testing')+'">'+
              '⚡ <span>'+(isAllFin?'Reset Test':'Test Solve')+'</span>'+
            '</button> -->'+
          '</div>'+
          '<p class="mosaic-subtext">'+
            'Solve all 9 sections to reveal the complete '+spec.n+'×'+spec.n+' masterpiece!'+
          '</p>'+
        '</div>'+
      '</div>'+
    '</div>';

  app.querySelector('[data-act="back"]').onclick=()=>{sound.click();G.screen={name:"menu"};renderMenu();};
  app.querySelector('[data-act="dark"]').onclick=()=>{G.settings.dark=!G.settings.dark;saveSettings(G.settings);applyDark();sound.click();renderMosaicScreen(bigIdx,subMode);};
  app.querySelector('[data-act="help"]').onclick=()=>{sound.click();showHelp();};
  app.querySelector('[data-act="settings"]').onclick=()=>{sound.click();showSettings();};

  app.querySelectorAll('[data-submode]').forEach(b=>{
    b.onclick=()=>{sound.click();renderMosaicScreen(bigIdx,b.dataset.submode);};
  });

  app.querySelectorAll('[data-tab]').forEach(b=>{
    b.onclick=()=>{sound.click();renderMosaicScreen(Number(b.dataset.tab),subMode);};
  });

  app.querySelectorAll('[data-block]').forEach(b=>{
    b.onclick=()=>{
      const blk=Number(b.dataset.block);
      const isDone=!!blocksDone[blk];
      const isCur=!isDone&&blk===firstUnsolved;
      if(!isDone&&!isCur&&firstUnsolved!==-1){
        sound.denied();
        return;
      }
      sound.click();
      startMosaicGame(bigIdx,subMode,blk);
    };
  });

  app.querySelector('[data-act="preview"]').onclick=()=>{
    sound.click();
    showMosaicPreview(bigIdx,subMode);
  };

  const testToggleBtn = app.querySelector('[data-act="test-toggle"]');
  if(testToggleBtn){
    testToggleBtn.onclick=()=>{
      sound.click();
      for(let i=0;i<9;i++){
        if(isAllFin){
          Storage.removeMosaicSection(subMode, bigIdx, i);
        } else {
          Storage.saveMosaicSection(subMode, bigIdx, i);
        }
      }
      refreshStores();
      renderMosaicScreen(bigIdx, subMode);
    };
  }

  app.querySelector('[data-act="play-next"]').onclick=()=>{
    sound.click();
    const nextBlk=firstUnsolved>=0?firstUnsolved:0;
    startMosaicGame(bigIdx,subMode,nextBlk);
  };
}

function showMosaicPreview(bigIdx,subMode){
  const spec=BIG_SPECS[bigIdx];
  const data=getBig(bigIdx);
  const blocksDone=bigDone(subMode,bigIdx);
  const doneCount=Object.keys(blocksDone).length;
  const isFin=doneCount>=9;

  const n=spec.n,sub=spec.sub,b=spec.blocks;
  const composite=new Uint8Array(n*n);
  for(let by=0;by<b;by++){
    for(let bx=0;bx<b;bx++){
      const blk=by*b+bx;
      if(blocksDone[blk]||isFin){
        for(let y=0;y<sub;y++){
          for(let x=0;x<sub;x++){
            composite[(by*sub+y)*n+(bx*sub+x)]=data.blocks[blk].grid[y*sub+x];
          }
        }
      }
    }
  }

  showModal(
    '<div class="modal">'+
      '<h2>'+(isFin?"Masterpiece Complete!":spec.label)+'</h2>'+
      '<div class="full-reveal-art">'+
        thumbHTML(isFin?data.grid:(doneCount>0?composite:data.grid),spec.n)+
      '</div>'+
      '<div class="win-stats" style="margin:8px 0 14px">'+
        '<div class="win-stat">'+icon("classic")+'<p>'+spec.n+'×'+spec.n+'</p></div>'+
        '<div class="win-stat">'+icon("check")+'<p>'+doneCount+'/9</p></div>'+
        '<div class="win-stat">'+icon("expert")+'<p>'+(subMode==="expert"?"Expert":"Classic")+'</p></div>'+
      '</div>'+
      '<div class="modal-actions">'+
        '<button class="btn-primary press" style="flex:1" id="mosaicClose">Close</button>'+
      '</div>'+
    '</div>'
  );
  document.getElementById("mosaicClose").onclick=()=>{sound.click();closeModal();};
}

function startMosaicGame(bigIdx,subMode,blockId){
  const blocksDone=bigDone(subMode,bigIdx);
  let firstUnsolved=-1;
  for(let i=0;i<9;i++){
    if(!blocksDone[i]&&firstUnsolved<0){firstUnsolved=i;break;}
  }
  const isDone=!!blocksDone[blockId];
  const isCur=!isDone&&blockId===firstUnsolved;
  if(!isDone&&!isCur&&firstUnsolved!==-1){
    sound.denied();
    return;
  }
  const spec=BIG_SPECS[bigIdx];
  const data=getBig(bigIdx);
  const b=data.blocks[blockId];
  const customOpts={
    bigIdx,
    subMode,
    blockId,
    grid:b.grid,
    rows:b.clues.rows,
    cols:b.clues.cols
  };
  if(subMode==="expert"){
    const masks=hiddenMasks("mosaic:"+bigIdx+":"+blockId,b.clues.rows,b.clues.cols);
    customOpts.hiddenRows=masks.hiddenRows;
    customOpts.hiddenCols=masks.hiddenCols;
  }
  startGame("mosaic",spec.sub,blockId,null,customOpts);
}

/* ==================================================================
   LEVEL SELECT
   ================================================================== */
function renderLevelSelect(mode, initialTab){
  if(G.cleanup){G.cleanup();G.cleanup=null;}
  closeModal();
  refreshStores();
  let tab=initialTab || (G.screen && G.screen.size) || 5;
  function draw(){
    const tabDefs=[{n:5,label:"SMALL",ic:"sizeS"},{n:10,label:"MEDIUM",ic:"sizeM"},{n:15,label:"LARGE",ic:"sizeL"}];
    let tabsHTML="";
    tabDefs.forEach(t=>{tabsHTML+='<button class="tab press '+ (tab===t.n?"active":"")+'" data-size="'+t.n+'">'+
      '<span style="display:flex;align-items:center;gap:6px">'+icon(t.ic)+" "+t.label+'</span><span class="uline"></span></button>';});
    let tiles="";let firstUnsolved=-1;
    for(let id=0;id<LEVELS_PER_SIZE;id++){
      const isSolved=Storage.isLevelCompleted(mode,tab,id);
      if(!isSolved && firstUnsolved < 0) firstUnsolved = id;
      const isUnlocked=Storage.isLevelUnlocked(mode,tab,id);
      const isNext=!isSolved && isUnlocked && (id===firstUnsolved || id===0);
      const isLocked=!isSolved && !isUnlocked;
      let inner;
      if(isSolved){
        const puzzle=getPuzzle(mode,tab,id);
        inner=thumbHTML(puzzle.grid,puzzle.n);
      } else if(isLocked){
        inner='<div class="q">?</div><span class="lock-ic">'+icon("lock")+'</span><span class="q-locked">'+(id+1)+'</span>';
      } else {
        inner='<div class="q">?</div><span class="q-num">'+(id+1)+'</span>';
      }
      tiles+='<button class="tile press '+(isLocked?"locked ":(isNext?"next ":""))+(isSolved?"solved ":"")+'" data-id="'+id+'" '+(isLocked?'disabled title="Solve Level '+id+' to unlock"':"")+' style="animation-delay:'+Math.min(id,16)*28+'ms">'+
        inner+(isSolved?'<span class="starbadge">'+icon("check")+"</span>":"")+"</button>";
    }
    app.innerHTML=
      '<div class="screen">'+
        '<div class="ls-head">'+
          '<button class="back-link press" data-act="back">'+icon("back")+'<span>'+mode+" Mode</span></button>"+
          '<div class="head-tools">'+
            '<button class="icon-btn press" data-act="dark">'+icon(G.settings.dark?"sun":"moon")+'</button>'+
            '<button class="icon-btn press" data-act="help">'+icon("help")+'</button>'+
            '<button class="icon-btn press" data-act="settings">'+icon("gear")+'</button>'+
          "</div></div>"+
        '<div class="tabs">'+tabsHTML+"</div>"+
        '<div class="levels-wrap"><div class="levels">'+tiles+"</div></div>"+
      "</div>";
    app.querySelector('[data-act="back"]').onclick=()=>{sound.click();G.screen={name:"menu"};renderMenu();};
    app.querySelector('[data-act="dark"]').onclick=()=>{G.settings.dark=!G.settings.dark;saveSettings(G.settings);applyDark();sound.click();draw();};
    app.querySelector('[data-act="help"]').onclick=()=>{sound.click();showHelp();};
    app.querySelector('[data-act="settings"]').onclick=()=>{sound.click();showSettings();};
    app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{sound.click();tab=Number(b.dataset.size);if(G.screen)G.screen.size=tab;draw();});
    app.querySelectorAll(".tile").forEach(b=>b.onclick=()=>{
      const id=Number(b.dataset.id);
      if(!Storage.isLevelUnlocked(mode,tab,id)){sound.denied();return;}
      startGame(mode,tab,id);
    });
  }
  draw();
}

/* ==================================================================
   GAME SCREEN
   ================================================================== */
function startGame(mode,size,id,customDate,customOpts){
  closeModal();
  const dateObj=customDate||(mode==="daily"?new Date():null);
  let puzzle;
  if(mode==="mosaic"&&customOpts){
    puzzle={
      key:"mosaic-"+customOpts.subMode+"-"+customOpts.bigIdx+"-"+customOpts.blockId,
      n:size,
      grid:customOpts.grid,
      rows:customOpts.rows,
      cols:customOpts.cols,
      hiddenRows:customOpts.hiddenRows,
      hiddenCols:customOpts.hiddenCols
    };
  }else if(mode==="daily"){
    puzzle=customDate?getDailyPuzzle(customDate):(id!=null?getPuzzle("daily",10,id):getDailyPuzzle());
  }else{
    puzzle=getPuzzle(mode,size,id);
  }
  const n=puzzle.n,total=n*n;
  G.screen={name:"game",mode,size,id,date:dateObj,customOpts};
  refreshStores();

  let cells=new Array(total).fill(0);
  let tool="pen",mistakes=0,hintsUsed=0,elapsed=0;
  let started=false,won=false,hinted=-1;
  const maxHints=n<=5?2:(n<=10?3:4);
  let hintCount=maxHints;
  let errors=new Set(),activeRow=-1,activeCol=-1,zoom=1;
  const history=[],future=[];
  let stroke=null,dead=false;
  const timeouts=[];
  let canvas=null,ctx=null,curMetrics=null;
  let moveHandler=null,upHandler=null,timerId=0,ro=null;
  let guideIndices=[];
  let lastSound=0;
  let winAnimStart=0;
  const placedAnim=new Map();

  function triggerPop(idx, type){
    if(won) return;
    placedAnim.set(idx, { start: performance.now(), dur: 140, type });
  }

  function getPopScale(t){
    if(t <= 0) return 0.35;
    if(t >= 1) return 1.0;
    if(t < 0.65){
      const p = t / 0.65;
      return 0.35 + 0.73 * (1 - Math.pow(1 - p, 2));
    } else {
      const p = (t - 0.65) / 0.35;
      return 1.08 - 0.08 * p;
    }
  }

  function later(fn,ms){const t=window.setTimeout(()=>{if(!dead)fn();},ms);timeouts.push(t);return t;}
  function cleanup(){
    dead=true;
    G.refreshTheme=null;
    clearInterval(timerId);
    timeouts.forEach(t=>clearTimeout(t));
    placedAnim.clear();
    if(moveHandler&&canvas){canvas.removeEventListener("pointermove",moveHandler);canvas.removeEventListener("pointerup",upHandler);canvas.removeEventListener("pointercancel",upHandler);}
    document.removeEventListener("visibilitychange",onVis);
    document.removeEventListener("keydown",onKey);
    if(ro)ro.disconnect();
  }
  G.cleanup=cleanup;

  function getThemeColors(){
    const isDark=document.documentElement.classList.contains("dark");
    return {
      isDark,
      cell: isDark ? "#141d2e" : "#ffffff",
      clueBg: isDark ? "#101827" : "#eef4f9",
      clue: isDark ? "#cbd5e1" : "#475569",
      clueDone: isDark ? "#3a4a60" : "#94a3b8",
      fill: isDark ? "#e9eff8" : "#2f333b",
      xmark: isDark ? "#64748b" : "#94a3b8",
      lit: isDark ? "rgba(78,163,214,0.18)" : "rgba(45,134,199,0.11)",
      sep: isDark ? "#41506a" : "#93a4b8",
      hair: isDark ? "#29364b" : "#d4dde7",
      border: isDark ? "#334155" : "#d7e0e9",
      hintBorder: isDark ? "#38bdf8" : "#0ea5e9",
      hintBg: isDark ? "rgba(56,189,248,0.3)" : "rgba(14,165,233,0.22)",
      tutGuide: isDark ? "#38bdf8" : "#0ea5e9",
      err: "#ef4444"
    };
  }

  function roundRectPath(context, x, y, w, h, r){
    if(typeof context.roundRect === "function"){
      context.beginPath();
      context.roundRect(x, y, w, h, r);
    } else {
      context.beginPath();
      context.rect(x, y, w, h);
    }
  }

  function lineSolved(state, targetGrid, gridN, type, lineIdx){
    if(type === "row"){
      for(let x = 0; x < gridN; x++){
        const i = lineIdx * gridN + x;
        if(targetGrid[i] === 1 && state[i] !== 1) return false;
      }
      return true;
    } else {
      for(let y = 0; y < gridN; y++){
        const i = y * gridN + lineIdx;
        if(targetGrid[i] === 1 && state[i] !== 1) return false;
      }
      return true;
    }
  }

  /* cached metrics & status */
  let cachedMetrics = null;
  function getBoardMetrics(){
    if(!cachedMetrics) cachedMetrics = metrics();
    return cachedMetrics;
  }

  const rowSolvedCache = new Uint8Array(n);
  const colSolvedCache = new Uint8Array(n);
  function updateSolvedStatus(){
    for(let y = 0; y < n; y++){
      let ok = true;
      for(let x = 0; x < n; x++){
        const i = y * n + x;
        if(puzzle.grid[i] === 1 && cells[i] !== 1){ ok = false; break; }
      }
      rowSolvedCache[y] = ok ? 1 : 0;
    }
    for(let x = 0; x < n; x++){
      let ok = true;
      for(let y = 0; y < n; y++){
        const i = y * n + x;
        if(puzzle.grid[i] === 1 && cells[i] !== 1){ ok = false; break; }
      }
      colSolvedCache[x] = ok ? 1 : 0;
    }
  }

  /* metrics */
  function metrics(){
    const wrap=document.getElementById("boardWrap");
    const maxRowRuns=Math.max.apply(null,puzzle.rows.map(l=>l.length));
    const maxColRuns=Math.max.apply(null,puzzle.cols.map(l=>l.length));
    const hasTwoDigitRow=puzzle.rows.some(r=>r.some(v=>v>=10));
    
    const cs=wrap?window.getComputedStyle(wrap):null;
    const padX=cs?(parseFloat(cs.paddingLeft)||0)+(parseFloat(cs.paddingRight)||0)+6:14;
    const padY=cs?(parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0)+6:14;

    const availW=Math.max(80,(wrap&&wrap.clientWidth>0?wrap.clientWidth:window.innerWidth)-padX);
    const availH=Math.max(80,(wrap&&wrap.clientHeight>0?wrap.clientHeight:(window.innerHeight-140))-padY);

    const charFactor=hasTwoDigitRow?0.7:0.55;
    const kRow=Math.max(0.9,maxRowRuns*charFactor+0.25);
    const kCol=Math.max(0.85,maxColRuns*0.5+0.25);

    let cell=Math.max(8,Math.floor(Math.min(availW/(n+kRow),availH/(n+kCol))*zoom));

    let fontRow,fontCol,minColH,minRowW,colH,rowW,boardW,boardH;
    function calcDims(c){
      fontRow=Math.max(7,Math.min(Math.floor(c*0.44),16));
      fontCol=Math.max(7,Math.min(Math.floor(c*0.44),16));
      minColH=maxColRuns*(fontCol+2)+8;
      minRowW=maxRowRuns*(hasTwoDigitRow?Math.ceil(fontRow*1.5):fontRow)+10;
      colH=Math.max(minColH,Math.floor(c*kCol));
      rowW=Math.max(minRowW,Math.floor(c*kRow));
      boardW=rowW+n*c;
      boardH=colH+n*c;
    }

    calcDims(cell);
    while(cell>8 && (boardW>availW || boardH>availH)){
      cell--;
      calcDims(cell);
    }

    return{cell,rowW,colH,boardW,boardH,fontRow,fontCol};
  }

  let title="";
  if(mode==="daily"){
    title="DAILY · "+dateObj.toLocaleDateString(undefined,{month:"short",day:"numeric"});
  }else if(mode==="mosaic"&&customOpts){
    const spec=BIG_SPECS[customOpts.bigIdx];
    title=spec.label.toUpperCase()+" · PART "+(customOpts.blockId+1)+"/9";
  }else{
    title=mode.toUpperCase()+" · "+size+"×"+size+" · #"+(id+1);
  }

  const isFirstLevel = (mode === "classic" && size === 5 && id === 0);
  const isTutorial = isFirstLevel && !Storage.isLevelCompleted("classic", 5, 0) && !seenTutorialLevel1;
  if(isTutorial) seenTutorialLevel1 = true;
  let tutDismissed = false;

  const hasLives = !isFirstLevel;
  const maxLives = hasLives ? (n <= 5 ? 3 : n <= 10 ? 4 : 5) : Infinity;
  let heartsHTML = "";
  if(hasLives){
    for(let h=1; h<=maxLives; h++){
      heartsHTML += '<span class="heart-slot on" id="gHeart'+h+'">'+icon("heart")+'</span>';
    }
  } else {
    heartsHTML = '<span style="color:#0284c7;font-weight:800;font-size:11px;letter-spacing:0.04em;display:flex;align-items:center;gap:3px">✨ Practice</span>';
  }

  app.innerHTML=
    '<div class="screen no-select">'+
      '<div class="g-head">'+
        '<button class="back-link press" id="gBack" aria-label="Back">'+icon("back")+'<span>Back</span></button>'+
        '<div class="g-head-right">'+
          '<!-- <button class="chip test-chip press" id="gTestWin" title="Complete Level (Test)">⚡ <span>Complete</span></button> -->'+
          '<span class="chip">'+icon("clock")+'<span id="gTime">0:00</span></span>'+
          (hasLives ? '<div class="chip lives-chip" id="gLivesChip" title="'+maxLives+' Lives">'+heartsHTML+'</div>' : '<div class="chip" id="gLivesChip" title="Unlimited Practice Mode">'+heartsHTML+'</div>')+
          '<button class="icon-btn press" id="gHelp" title="Help" style="width:clamp(28px, 4vh, 34px);height:clamp(28px, 4vh, 34px);font-size:clamp(16px, 2.2vh, 19px)">'+icon("help")+'</button>'+
          '<button class="icon-btn press" id="gSet" title="Settings" style="width:clamp(28px, 4vh, 34px);height:clamp(28px, 4vh, 34px);font-size:clamp(16px, 2.2vh, 19px)">'+icon("gear")+'</button>'+
        '</div>'+
      '</div>'+
      '<div class="g-title">'+title+'</div>'+
      (isTutorial ? 
        '<div class="tutorial-banner" id="tutBanner">'+
          '<span class="tut-badge">💡 TUTORIAL</span>'+
          '<span class="tut-msg" id="tutMsg"><b>Tip 1:</b> Clue <b>5</b> means the whole row is filled! Drag across <b>Rows 2 &amp; 3</b>.</span>'+
          '<button class="tut-close" id="tutClose" title="Hide Guide">✕</button>'+
        '</div>' : '') +
      '<div class="board-wrap" id="boardWrap"><canvas id="boardCanvas" class="board-canvas"></canvas></div>'+
      '<div class="toolbar-outer"><div class="toolbar">'+
        '<button class="tbtn press active" id="tPen" title="Pen (P)">'+icon("pen")+'</button>'+
        '<button class="tbtn press" id="tX" title="X mark (X)">'+icon("x")+'</button>'+
        '<span class="tdiv"></span>'+
        '<button class="tbtn press" id="tUndo" title="Undo (Z)" disabled>'+icon("undo")+'</button>'+
        '<button class="tbtn press" id="tRedo" title="Redo (Y)" disabled>'+icon("redo")+'</button>'+
        '<button class="tbtn press" id="tHint" title="Hint" style="color:#0ea5e9">'+icon("bulb")+'<span class="n" id="hintN">'+hintCount+'</span></button>'+
        '<span class="tdiv"></span>'+
        '<button class="tbtn press" id="tRestart" title="Restart" disabled>'+icon("restart")+'</button>'+
      '</div></div>'+
    '</div>';

  canvas = document.getElementById("boardCanvas");
  ctx = canvas ? canvas.getContext("2d") : null;

  function renderBoardCanvas(){
    if(!canvas || !ctx || dead) return;
    const m = getBoardMetrics();
    curMetrics = m;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const targetW = Math.round(m.boardW * dpr);
    const targetH = Math.round(m.boardH * dpr);
    if(canvas.width !== targetW || canvas.height !== targetH){
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = m.boardW + "px";
      canvas.style.height = m.boardH + "px";
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, m.boardW, m.boardH);

    const colors = getThemeColors();
    const cell = m.cell, rowW = m.rowW, colH = m.colH;

    // 1. Clue Banners & Grid Backgrounds
    ctx.fillStyle = colors.clueBg;
    ctx.fillRect(0, 0, m.boardW, colH);
    ctx.fillRect(0, 0, rowW, m.boardH);

    ctx.fillStyle = colors.cell;
    ctx.fillRect(rowW, colH, n * cell, n * cell);

    // 2. Crosshair Highlight
    if(G.settings.highlight && !won && (activeRow >= 0 || activeCol >= 0)){
      ctx.fillStyle = colors.lit;
      if(activeRow >= 0 && activeRow < n){
        ctx.fillRect(rowW, colH + activeRow * cell, n * cell, cell);
        ctx.fillRect(0, colH + activeRow * cell, rowW, cell);
      }
      if(activeCol >= 0 && activeCol < n){
        ctx.fillRect(rowW + activeCol * cell, colH, cell, n * cell);
        ctx.fillRect(rowW + activeCol * cell, 0, cell, colH);
      }
    }

    // 3. Top-Left Corner Preview
    const prevPad = Math.max(3, Math.min(6, Math.floor(Math.min(rowW, colH) * 0.08)));
    const prevSize = Math.min(rowW - prevPad * 2, colH - prevPad * 2);
    if(prevSize >= 8){
      const prevX = Math.round((rowW - prevSize) / 2);
      const prevY = Math.round((colH - prevSize) / 2);
      
      // Preview card background
      ctx.fillStyle = colors.cell;
      roundRectPath(ctx, prevX, prevY, prevSize, prevSize, 2);
      ctx.fill();

      // Preview border
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      roundRectPath(ctx, prevX + 0.5, prevY + 0.5, prevSize - 1, prevSize - 1, 2);
      ctx.stroke();

      // Pixel Art rendering
      const pStep = (prevSize - 2) / n;
      ctx.fillStyle = colors.fill;
      for(let y = 0; y < n; y++){
        for(let x = 0; x < n; x++){
          const idx = y * n + x;
          if(cells[idx] === 1 || (won && puzzle.grid[idx] === 1)){
            const px = Math.floor(prevX + 1 + x * pStep);
            const py = Math.floor(prevY + 1 + y * pStep);
            const pw = Math.ceil(prevX + 1 + (x + 1) * pStep) - px;
            const ph = Math.ceil(prevY + 1 + (y + 1) * pStep) - py;
            ctx.fillRect(px, py, pw, ph);
          }
        }
      }
    }

    // 4. Column Clues
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 " + m.fontCol + 'px "Roboto Mono", monospace';
    for(let x = 0; x < n; x++){
      const line = puzzle.cols[x];
      const solved = !!colSolvedCache[x];
      const colCenterX = rowW + x * cell + cell / 2;
      const count = line.length;
      const lineSpacing = m.fontCol + Math.max(1, Math.floor(m.fontCol * 0.2));
      const startY = colH - 4 - (m.fontCol / 2);

      for(let k = count - 1; k >= 0; k--){
        const numIdx = count - 1 - k;
        const numY = startY - (numIdx * lineSpacing);
        if(numY < m.fontCol / 2) break;
        const isHidden = puzzle.hiddenCols && puzzle.hiddenCols[x][k];
        const text = isHidden ? "?" : String(line[k]);

        ctx.fillStyle = isHidden ? colors.clue : (solved ? colors.clueDone : colors.clue);
        ctx.fillText(text, colCenterX, numY);

        if(solved && !isHidden){
          const textW = ctx.measureText(text).width;
          ctx.strokeStyle = colors.clueDone;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(colCenterX - textW / 2 - 1, numY);
          ctx.lineTo(colCenterX + textW / 2 + 1, numY);
          ctx.stroke();
        }
      }
    }

    // 5. Row Clues
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "600 " + m.fontRow + 'px "Roboto Mono", monospace';
    for(let y = 0; y < n; y++){
      const line = puzzle.rows[y];
      const solved = !!rowSolvedCache[y];
      const rowCenterY = colH + y * cell + cell / 2;
      const count = line.length;
      const spacing = Math.max(3, Math.floor(m.fontRow * 0.35));
      let curX = rowW - 6;

      for(let k = count - 1; k >= 0; k--){
        const isHidden = puzzle.hiddenRows && puzzle.hiddenRows[y][k];
        const text = isHidden ? "?" : String(line[k]);
        const textW = ctx.measureText(text).width;

        ctx.fillStyle = isHidden ? colors.clue : (solved ? colors.clueDone : colors.clue);
        ctx.fillText(text, curX, rowCenterY);

        if(solved && !isHidden){
          ctx.strokeStyle = colors.clueDone;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(curX - textW, rowCenterY);
          ctx.lineTo(curX + 1, rowCenterY);
          ctx.stroke();
        }
        curX -= (textW + spacing);
        if(curX < 2) break;
      }
    }

    const now = performance.now();
    let hasAnim = false;

    // 6. Grid Cells Contents
    const isDark = colors.isDark;
    const cellHalf = cell / 2;
    const xPad = Math.max(3, Math.floor(cell * 0.20));
    const xLineWidth = Math.max(1.8, Math.floor(cell * 0.09));
    const cellRadius = Math.min(1.5, cell * 0.05);

    for(let r = 0; r < n; r++){
      for(let c = 0; c < n; c++){
        const idx = r * n + c;
        const cx = rowW + c * cell;
        const cy = colH + r * cell;
        const val = (won ? puzzle.grid[idx] : cells[idx]);
        const isErr = errors.has(idx);
        const isHint = (hinted === idx);
        const isTut = isTutorial && guideIndices.includes(idx);
        const anim = placedAnim.get(idx);
        let scale = 1;
        let winSheen = 0;

        if(won && winAnimStart > 0){
          const delay = (r + c) * 35;
          const elapsed = (now - winAnimStart) - delay;
          if(elapsed >= 0 && elapsed < 340){
            const p = elapsed / 340;
            scale = 1 + 0.18 * Math.sin(p * Math.PI);
            winSheen = Math.sin(p * Math.PI);
            hasAnim = true;
          } else if(now - winAnimStart < (2 * n * 35 + 400)){
            hasAnim = true;
          }
        } else if(anim && !won){
          const elapsed = now - anim.start;
          if(elapsed < anim.dur){
            scale = getPopScale(elapsed / anim.dur);
            hasAnim = true;
          } else {
            placedAnim.delete(idx);
          }
        }

        if(isTut && !won){
          ctx.fillStyle = colors.hintBg;
          ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2);
          ctx.strokeStyle = colors.tutGuide;
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(cx + 2, cy + 2, cell - 4, cell - 4);
          ctx.setLineDash([]);
        }

        if(isHint){
          const hintPulse = 0.65 + 0.35 * Math.sin(now * 0.009);
          ctx.fillStyle = colors.hintBg;
          ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2);
          ctx.strokeStyle = colors.hintBorder;
          ctx.lineWidth = 2;
          ctx.globalAlpha = hintPulse;
          ctx.strokeRect(cx + 1.5, cy + 1.5, cell - 3, cell - 3);
          ctx.globalAlpha = 1.0;
          hasAnim = true;
        }

        if(val === 1){
          if(scale === 1 && winSheen === 0 && !isErr){
            // Ultra-fast direct fill path
            ctx.fillStyle = colors.fill;
            ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2);
          } else {
            let centerX = cx + cellHalf;
            let centerY = cy + cellHalf;
            if(isErr){
              centerX += Math.sin(now * 0.045) * 2;
              hasAnim = true;
            }
            ctx.save();
            ctx.translate(centerX, centerY);
            if(scale !== 1) ctx.scale(scale, scale);
            if(winSheen > 0){
              ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7";
            } else {
              ctx.fillStyle = isErr ? colors.err : colors.fill;
            }
            roundRectPath(ctx, -cellHalf + 1, -cellHalf + 1, cell - 2, cell - 2, cellRadius);
            ctx.fill();
            ctx.restore();
          }
        } else if(val === 2 && !won){
          if(scale === 1){
            // Ultra-fast direct X mark path
            ctx.strokeStyle = colors.xmark;
            ctx.lineWidth = xLineWidth;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(cx + xPad, cy + xPad);
            ctx.lineTo(cx + cell - xPad, cy + cell - xPad);
            ctx.moveTo(cx + cell - xPad, cy + xPad);
            ctx.lineTo(cx + xPad, cy + cell - xPad);
            ctx.stroke();
          } else {
            const centerX = cx + cellHalf;
            const centerY = cy + cellHalf;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.strokeStyle = colors.xmark;
            ctx.lineWidth = xLineWidth;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(-cellHalf + xPad, -cellHalf + xPad);
            ctx.lineTo(cellHalf - xPad, cellHalf - xPad);
            ctx.moveTo(cellHalf - xPad, -cellHalf + xPad);
            ctx.lineTo(-cellHalf + xPad, cellHalf - xPad);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // 7. Grid Lines
    // Thin hair lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.hair;
    ctx.beginPath();
    for(let x = 1; x < n; x++){
      if(x % 5 !== 0){
        const lx = Math.floor(rowW + x * cell) + 0.5;
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, m.boardH);
      }
    }
    for(let y = 1; y < n; y++){
      if(y % 5 !== 0){
        const ly = Math.floor(colH + y * cell) + 0.5;
        ctx.moveTo(0, ly);
        ctx.lineTo(m.boardW, ly);
      }
    }
    ctx.stroke();

    // Thicker 5-block separator lines
    ctx.lineWidth = 2;
    ctx.strokeStyle = colors.sep;
    ctx.beginPath();
    ctx.moveTo(rowW, 0);
    ctx.lineTo(rowW, m.boardH);
    ctx.moveTo(0, colH);
    ctx.lineTo(m.boardW, colH);

    for(let x = 5; x < n; x += 5){
      const lx = Math.round(rowW + x * cell);
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, m.boardH);
    }
    for(let y = 5; y < n; y += 5){
      const ly = Math.round(colH + y * cell);
      ctx.moveTo(0, ly);
      ctx.lineTo(m.boardW, ly);
    }
    ctx.stroke();

    // Outer border
    ctx.strokeStyle = colors.sep;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, m.boardW - 2, m.boardH - 2);

    ctx.restore();

    if(hasAnim && !dead){
      requestAnimationFrame(renderBoardCanvas);
    }
  }

  G.refreshTheme = renderBoardCanvas;

  function updateTutorial(draft){
    if(!isTutorial) return;
    const tutEl=document.getElementById("tutBanner");
    if(!tutEl || tutDismissed || won){
      if(tutEl && (tutDismissed || won)) tutEl.style.display="none";
      guideIndices = [];
      return;
    }
    const state=draft||cells;
    const row1Done = [5,6,7,8,9].every(i => state[i] === 1);
    const row2Done = [10,11,12,13,14].every(i => state[i] === 1);
    const row0Done = state[1] === 1 && state[3] === 1;
    const row3Done = state[16] === 1 && state[17] === 1 && state[18] === 1;
    const row4Done = state[22] === 1;

    let msg = "";
    guideIndices = [];

    if(!row1Done || !row2Done){
      msg = "<b>Tip 1:</b> Clue <b>5</b> means the whole row is filled! Drag across <b>Rows 2 &amp; 3</b>.";
      if(!row1Done) guideIndices.push(5,6,7,8,9);
      else if(!row2Done) guideIndices.push(10,11,12,13,14);
    } else if(!row0Done){
      msg = "<b>Tip 2:</b> Row 1 has clue <b>1 1</b>. Fill cells 2 and 4 to shape the heart lobes!";
      guideIndices.push(1, 3);
    } else if(!row3Done || !row4Done){
      msg = "<b>Tip 3:</b> Finish the heart tip! Row 4 has clue <b>3</b> and Row 5 has clue <b>1</b>.";
      if(!row3Done) guideIndices.push(16, 17, 18);
      else guideIndices.push(22);
    } else {
      msg = "🎉 <b>Perfect!</b> You completed your first Nonogram: a Heart! ❤️";
    }

    const msgEl=document.getElementById("tutMsg");
    if(msgEl) msgEl.innerHTML = msg;
  }

  function renderAll(){
    updateSolvedStatus();
    updateTutorial();
    renderBoardCanvas();
    const timeEl = document.getElementById("gTime");
    if(timeEl) timeEl.textContent = fmtTime(elapsed);
    if(hasLives){
      const livesLeft = Math.max(0, maxLives - mistakes);
      for(let h=1; h<=maxLives; h++){
        const el = document.getElementById("gHeart"+h);
        if(el){
          const isAlive = h <= livesLeft;
          el.classList.toggle("on", isAlive);
          el.classList.toggle("lost", !isAlive);
        }
      }
    }
    const undoBtn = document.getElementById("tUndo");
    if(undoBtn) undoBtn.disabled = history.length === 0;
    const redoBtn = document.getElementById("tRedo");
    if(redoBtn) redoBtn.disabled = future.length === 0;
    const rstBtn = document.getElementById("tRestart");
    if(rstBtn) rstBtn.disabled = !hasMoves() || won;
    const hintN = document.getElementById("hintN");
    if(hintN) hintN.textContent = hintCount;
    const penBtn = document.getElementById("tPen");
    if(penBtn) penBtn.classList.toggle("active", tool === "pen");
    const xBtn = document.getElementById("tX");
    if(xBtn) xBtn.classList.toggle("active", tool === "x");
  }

  let prevDoneRows = new Set(), prevDoneCols = new Set();
  function autoCross(draft){
    let newLineDone = false;
    for(let y=0;y<n;y++){
      let ok=true;
      for(let x=0;x<n;x++){
        const i=y*n+x;
        if((draft[i]===1)!==(puzzle.grid[i]===1)){ok=false;break;}
      }
      if(ok){
        if(!prevDoneRows.has(y)){ prevDoneRows.add(y); newLineDone = true; }
        if(G.settings.autoCross){
          for(let x=0;x<n;x++){
            if(draft[y*n+x]===0){
              draft[y*n+x]=2;
              triggerPop(y*n+x, "x");
            }
          }
        }
      }
    }
    for(let x=0;x<n;x++){
      let ok=true;
      for(let y=0;y<n;y++){
        const i=y*n+x;
        if((draft[i]===1)!==(puzzle.grid[i]===1)){ok=false;break;}
      }
      if(ok){
        if(!prevDoneCols.has(x)){ prevDoneCols.add(x); newLineDone = true; }
        if(G.settings.autoCross){
          for(let y=0;y<n;y++){
            if(draft[y*n+x]===0){
              draft[y*n+x]=2;
              triggerPop(y*n+x, "x");
            }
          }
        }
      }
    }
    if(newLineDone && !won){
      sound.lineDone();
      if(navigator.vibrate) try{ navigator.vibrate([15, 30, 20]); }catch(e){}
    }
  }

  function checkWin(draft){
    for(let i=0;i<total;i++){if(puzzle.grid[i]===1&&draft[i]!==1)return false;if(puzzle.grid[i]===0&&draft[i]===1)return false;}
    handleWin(draft);return true;
  }
  function handleWin(draftArg){
    const draft=draftArg?draftArg.slice():cells.slice();
    for(let i=0;i<total;i++)if(draft[i]===0)draft[i]=2;
    cells=draft;won=true;started=false;
    winAnimStart=performance.now();
    sound.win();
    if(navigator.vibrate) try{ navigator.vibrate([30, 40, 30, 40, 70]); }catch(e){}
    const stars = !hasLives ? 3 : (mistakes===0&&hintsUsed===0?3:(mistakes<=Math.floor(maxLives/2)&&hintsUsed<=1?2:1));
    const rec={time:elapsed,mistakes,hints:hintsUsed,stars};
    const isFirstTime=!Storage.isPuzzleCompleted(puzzle, customOpts, dateObj);
    Storage.markPuzzleCompleted(puzzle, customOpts, dateObj);
    refreshStores();
    let streakVal;
    if(mode==="daily"){
      const d=loadDaily(),t=todayKey(dateObj),nowKey=todayKey(),curMonth=t.substring(0,7);
      if(t===nowKey){
        if(d.date!==t){
          const yest=new Date();yest.setDate(yest.getDate()-1);
          const isContinuation=d.month===curMonth&&d.date===todayKey(yest);
          const streak=isContinuation?(d.streak+1):1;
          const next={month:curMonth,date:t,streak,bestStreak:Math.max(d.bestStreak||0,streak)};
          saveDaily(next);streakVal=next.streak;
        }else streakVal=d.streak;
      }else{
        streakVal=d.streak;
      }
    }
    renderAll();
    later(()=>showWin(rec,isFirstTime,streakVal),850);
  }

  let cachedCanvasRect = null;
  /* stroke engine */
  function applyCell(idx){
    const st=stroke;if(!st)return;
    const fr=Math.floor(st.lastIdx/n),fc=st.lastIdx%n,tr=Math.floor(idx/n),tc=idx%n;
    const steps=Math.max(Math.abs(tr-fr),Math.abs(tc-fc));const line=[];
    if(steps===0){line.push(idx);}
    else{for(let s=0;s<=steps;s++){const r=Math.round(fr+((tr-fr)*s)/steps),c=Math.round(fc+((tc-fc)*s)/steps);line.push(r*n+c);}}
    st.lastIdx=idx;
    let anyTouched = false;
    let draft = cells;
    for(const k of line){
      if(st.visited.has(k))continue;
      st.visited.add(k);
      const cur=draft[k];
      const col=k%n;
      const pan=((col+0.5)/n)*1.4-0.7;
      if(st.action==="fill"){
        if(cur!==1){
          triggerPop(k, "fill");
          if(puzzle.grid[k]===1){
            if(draft===cells) draft=cells.slice();
            draft[k]=1;anyTouched=true;
            if(navigator.vibrate) try{ navigator.vibrate(10); }catch(e){}
            const now=performance.now();if(now-lastSound>35){sound.fill(pan);lastSound=now;}
          }else{
            if(draft===cells) draft=cells.slice();
            draft[k]=1;anyTouched=true;mistakes++;sound.error(pan);errors.add(k);
            if(hasLives){
              const lostSlot=Math.max(1,Math.min(maxLives,(maxLives+1)-mistakes));
              const hEl=document.getElementById("gHeart"+lostSlot);
              if(hEl){
                hEl.classList.remove("flash");
                void hEl.offsetWidth;
                hEl.classList.add("flash");
                setTimeout(()=>{if(hEl)hEl.classList.remove("flash");},480);
              }
            }
            if(navigator.vibrate)try{navigator.vibrate(40);}catch(err){}
            setTimeout(()=>{if(cells[k]===1)cells[k]=2;errors.delete(k);triggerPop(k, "x");renderAll();},380);
            if(hasLives && mistakes>=maxLives){
              started=false;
              stroke=null;
              setTimeout(()=>{
                if(!won){
                  sound.gameOver();
                  showGameOver();
                }
              },420);
            }
          }
        }
      }else if(st.action==="x"){
        if(cur!==2){triggerPop(k, "x");if(draft===cells) draft=cells.slice();draft[k]=2;anyTouched=true;sound.cross(pan);}
      }else if(st.action==="unx"){
        if(cur===2){if(draft===cells) draft=cells.slice();draft[k]=0;anyTouched=true;sound.cross(pan);}
      }else if(st.action==="erase"){
        if(cur!==0){errors.delete(k);if(draft===cells) draft=cells.slice();draft[k]=0;anyTouched=true;sound.undo(pan);}
      }
    }
    if(anyTouched){
      cells=draft;
      updateSolvedStatus();
      renderBoardCanvas();
    } else {
      renderBoardCanvas();
    }
  }

  function finalizeStroke(){
    const st=stroke;stroke=null;
    cachedCanvasRect=null;
    moveHandler=null;upHandler=null;
    if(!st)return;
    const draft=cells.slice();
    autoCross(draft);
    cells=draft;
    if(st.before.length){history.push({before:st.before,after:draft.slice()});if(history.length>200)history.shift();future.length=0;}
    renderAll();checkWin(draft);
  }

  function getGridPos(e){
    if(!canvas || !curMetrics) return null;
    const rect = (stroke && cachedCanvasRect) ? cachedCanvasRect : canvas.getBoundingClientRect();
    const scaleX = curMetrics.boardW / rect.width;
    const scaleY = curMetrics.boardH / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const c = Math.floor((px - curMetrics.rowW) / curMetrics.cell);
    const r = Math.floor((py - curMetrics.colH) / curMetrics.cell);
    if(c >= 0 && c < n && r >= 0 && r < n){
      return { r, c, idx: r * n + c };
    }
    return null;
  }

  function onBoardDown(e){
    if(won||modalOpen()||mistakes>=maxLives)return;
    if(e.button!==0&&e.button!==2)return;
    cachedCanvasRect = canvas.getBoundingClientRect();
    const pos = getGridPos(e);
    if(!pos){ cachedCanvasRect = null; return; }
    const idx = pos.idx;
    e.preventDefault();
    started=true;

    const forcedX=e.button===2,cur=cells[idx];
    let action;
    if(forcedX||tool==="x"){
      action=(cur===2)?"unx":"x";
    }else{
      action=(cur===1)?"erase":"fill";
    }

    activeRow=pos.r;activeCol=pos.c;
    stroke={action,visited:new Set(),before:cells.slice(),lastIdx:idx};
    applyCell(idx);

    try{canvas.setPointerCapture(e.pointerId);}catch(err){}

    moveHandler=function(ev){
      if(!stroke)return;
      const p = getGridPos(ev);
      if(p){
        activeRow=p.r;activeCol=p.c;
        applyCell(p.idx);
      }
    };
    upHandler=function(ev){
      cachedCanvasRect=null;
      canvas.removeEventListener("pointermove",moveHandler);
      canvas.removeEventListener("pointerup",upHandler);
      canvas.removeEventListener("pointercancel",upHandler);
      try{canvas.releasePointerCapture(e.pointerId);}catch(err){}
      finalizeStroke();
    };
    canvas.addEventListener("pointermove",moveHandler);
    canvas.addEventListener("pointerup",upHandler);
    canvas.addEventListener("pointercancel",upHandler);
  }

  let hoverRaf = false;
  function onBoardHover(e){
    if(stroke || won || !G.settings.highlight) return;
    const pos = getGridPos(e);
    const newR = pos ? pos.r : -1;
    const newC = pos ? pos.c : -1;
    if(newR !== activeRow || newC !== activeCol){
      activeRow = newR;
      activeCol = newC;
      if(!hoverRaf){
        hoverRaf = true;
        requestAnimationFrame(()=>{
          hoverRaf = false;
          if(!dead) renderBoardCanvas();
        });
      }
    }
  }

  function onBoardLeave(){
    if(!stroke && (activeRow !== -1 || activeCol !== -1)){
      activeRow = -1;
      activeCol = -1;
      renderBoardCanvas();
    }
  }

  function undo(){
    if(won||modalOpen()||!history.length)return;
    const entry=history.pop();
    future.push(entry);cells=entry.before.slice();placedAnim.clear();sound.undo();renderAll();
  }
  function redo(){
    if(won||modalOpen()||!future.length)return;const entry=future.pop();if(!entry||!entry.after)return;
    history.push(entry);const draft=entry.after.slice();
    for(let i=0;i<total;i++)if(draft[i]===1&&puzzle.grid[i]!==1)draft[i]=2;
    cells=draft;placedAnim.clear();sound.undo();renderAll();
  }
  function useHint(){
    if(won||modalOpen())return;
    if(hintCount<=0){sound.denied();const b=document.getElementById("tHint");if(b){b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake");}return;}
    started=true;
    const draft=cells.slice(),fillTargets=[],xTargets=[];
    for(let i=0;i<total;i++){if(puzzle.grid[i]===1&&draft[i]!==1)fillTargets.push(i);if(puzzle.grid[i]===0&&draft[i]===0)xTargets.push(i);}
    let target,toX=false;
    if(fillTargets.length){target=fillTargets[Math.floor(Math.random()*fillTargets.length)];draft[target]=1;}
    else if(xTargets.length){target=xTargets[Math.floor(Math.random()*xTargets.length)];draft[target]=2;toX=true;}
    else return;
    const before=cells.slice();autoCross(draft);history.push({before,after:draft.slice()});future.length=0;
    cells=draft;hintCount--;hintsUsed++;sound.hint();
    triggerPop(target, toX ? "x" : "fill");
    hinted=target;later(()=>{if(hinted===target){hinted=-1;renderAll();}},1300);
    if(!toX)lastSound=performance.now();
    renderAll();checkWin(draft);
  }

  function restart(){
    cells=new Array(total).fill(0);history.length=0;future.length=0;placedAnim.clear();
    mistakes=0;hintsUsed=0;elapsed=0;started=false;won=false;errors=new Set();hinted=-1;activeRow=-1;activeCol=-1;
    prevDoneRows.clear();prevDoneCols.clear();
    hintCount=maxHints;
    closeModal();renderAll();
  }

  function hasMoves(){
    return history.length>0 || mistakes>0 || hintsUsed>0 || cells.some(c=>c!==0);
  }
  function doBack(){
    cleanup();G.cleanup=null;
    if(mode==="daily"){G.screen={name:"daily"};renderDailyScreen();}
    else if(mode==="mosaic"&&customOpts){G.screen={name:"mosaic"};renderMosaicScreen(customOpts.bigIdx,customOpts.subMode);}
    else{G.screen={name:"select",mode,size};renderLevelSelect(mode,size);}
  }

  /* wire controls */
  document.getElementById("gBack").onclick=()=>{
    sound.click();
    if(!won && hasMoves()){
      showLeaveConfirm(doBack);
    } else {
      doBack();
    }
  };
  const testWinBtn=document.getElementById("gTestWin");
  if(testWinBtn){
    testWinBtn.onclick=()=>{
      if(won)return;
      const draft=new Uint8Array(total);
      for(let i=0;i<total;i++)draft[i]=puzzle.grid[i]===1?1:2;
      handleWin(draft);
    };
  }
  const tutCloseBtn = document.getElementById("tutClose");
  if(tutCloseBtn){
    tutCloseBtn.onclick=()=>{
      tutDismissed=true;
      sound.click();
      const b=document.getElementById("tutBanner");
      if(b) b.style.display="none";
      guideIndices = [];
      renderBoardCanvas();
    };
  }
  document.getElementById("gHelp").onclick=()=>{sound.click();showHelp();};
  document.getElementById("gSet").onclick=()=>{sound.click();showSettings();};
  document.getElementById("tPen").onclick=()=>{tool="pen";sound.click();renderAll();};
  document.getElementById("tX").onclick=()=>{tool="x";sound.click();renderAll();};
  document.getElementById("tUndo").onclick=undo;
  document.getElementById("tRedo").onclick=redo;
  document.getElementById("tHint").onclick=useHint;
  document.getElementById("tRestart").onclick=()=>{if(!hasMoves()||won)return;sound.click();showRestartConfirm(restart);};

  if(canvas){
    canvas.addEventListener("pointerdown",onBoardDown);
    canvas.addEventListener("pointermove",onBoardHover);
    canvas.addEventListener("pointerleave",onBoardLeave);
    canvas.addEventListener("contextmenu",e=>e.preventDefault());
  }

  let resizeT;
  ro=new ResizeObserver(()=>{
    cachedMetrics = null;
    clearTimeout(resizeT);
    resizeT=setTimeout(()=>{if(!dead)renderAll();},25);
  });
  const wrapEl=document.getElementById("boardWrap");
  if(wrapEl)ro.observe(wrapEl);
  requestAnimationFrame(()=>{if(!dead)renderAll();});

  /* timer */
  timerId=setInterval(()=>{
    if(started&&!won&&!modalOpen()&&!document.hidden){elapsed++;document.getElementById("gTime").textContent=fmtTime(elapsed);}
  },1000);
  document.addEventListener("visibilitychange",onVis);
  function onVis(){}

  /* keyboard */
  document.addEventListener("keydown",onKey);
  function onKey(e){
    if(modalOpen()){if(e.key==="Escape")closeModal();return;}
    const k=e.key.toLowerCase();
    if(k==="z"&&!e.ctrlKey&&!e.metaKey){e.preventDefault();undo();}
    else if(k==="y"&&!e.ctrlKey&&!e.metaKey){e.preventDefault();redo();}
    else if((e.ctrlKey||e.metaKey)&&k==="z"){e.preventDefault();e.shiftKey?redo():undo();}
    else if(k==="x"){tool="x";renderAll();}
    else if(k==="p"){tool="pen";renderAll();}
  }

  renderAll();
  if(!seenHelpSession && !Storage.hasAnyProgress()){seenHelpSession=true;showHelp();}

  /* win modal */
  function hasNextLevel(){
    if(mode==="mosaic"&&customOpts)return customOpts.blockId<8;
    return mode!=="daily"&&(id<LEVELS_PER_SIZE-1||size!==15);
  }
  function showWin(rec,isBest,streakVal){
    let starsHTML="";for(let s=1;s<=3;s++)starsHTML+='<span class="star-ic '+(s<=rec.stars?"on":"")+'" style="animation-delay:'+(250+s*160)+'ms">'+icon("star")+"</span>";
    let winTitle=mode==="daily"?"Daily Complete!":(mode==="mosaic"?"Section Complete!":"Puzzle Complete!");
    let winSub="";
    if(mode==="mosaic"&&customOpts){
      const spec=BIG_SPECS[customOpts.bigIdx];
      const blocksDone=bigDone(customOpts.subMode,customOpts.bigIdx);
      const isFin=Object.keys(blocksDone).length>=9;
      if(isFin){winTitle="Masterpiece Complete!";winSub=spec.label;}
      else{winSub=spec.label+" · Piece "+(customOpts.blockId+1)+"/9";}
    }else if(mode==="daily"){
      winSub=dateObj.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
    }else{
      winSub=mode.toUpperCase()+" · "+size+"×"+size+" · #"+(id+1);
    }
    const body=
      confettiHTML()+
      '<div class="modal win-modal">'+
        '<div class="win-header">'+
          '<h2>'+winTitle+'</h2>'+
          '<div class="win-sub">'+winSub+'</div>'+
        '</div>'+
        '<div class="win-art">'+thumbHTML(puzzle.grid,n)+'</div>'+
        '<div class="stars">'+starsHTML+"</div>"+
        (mode==="daily"&&streakVal>0?'<div class="win-streak">'+icon("flame")+" "+streakVal+" day streak</div>":"")+
        '<div class="win-stats">'+
          '<div class="win-stat" title="Solve Time">'+icon("clock")+"<p>"+fmtTime(rec.time)+"</p></div>"+
          (hasLives ? '<div class="win-stat heart-stat" title="Lives Remaining">'+icon("heart")+"<p>"+Math.max(0, maxLives - rec.mistakes)+"/"+maxLives+"</p></div>" : '<div class="win-stat" title="Intro Level">'+icon("star")+"<p>Tutorial</p></div>")+
          '<div class="win-stat" title="Hints Used">'+icon("bulb")+"<p>"+rec.hints+"</p></div>"+
        "</div>"+
        '<div class="modal-actions">'+
          '<button class="square-btn press" id="wHome" title="Menu">'+icon("home")+'</button>'+
          '<button class="square-btn press" id="wReplay" title="Replay">'+icon("restart")+'</button>'+
          (hasNextLevel()?'<button class="btn-primary press btn-win-next" id="wNext">NEXT '+icon("play")+'</button>':'<button class="btn-primary press btn-win-next" id="wDone">Done</button>')+
        "</div>"+
      "</div>";
    /* note confetti must be outside the modal overlay */
    modalRoot.innerHTML='<div class="overlay" style="background:rgba(30,41,59,.4)">'+body+'</div>';
    document.getElementById("wHome").onclick=()=>{
      closeModal();cleanup();G.cleanup=null;
      if(mode==="daily"){G.screen={name:"daily"};renderDailyScreen();}
      else if(mode==="mosaic"&&customOpts){G.screen={name:"mosaic"};renderMosaicScreen(customOpts.bigIdx,customOpts.subMode);}
      else{G.screen={name:"select",mode,size};renderLevelSelect(mode,size);}
    };
    document.getElementById("wReplay").onclick=()=>{closeModal();restart();};
    const wn=document.getElementById("wNext");
    if(wn)wn.onclick=()=>{closeModal();nextLevel();};
    const wd=document.getElementById("wDone");
    if(wd)wd.onclick=()=>{
      closeModal();cleanup();G.cleanup=null;
      if(mode==="daily"){G.screen={name:"daily"};renderDailyScreen();}
      else if(mode==="mosaic"&&customOpts){G.screen={name:"mosaic"};renderMosaicScreen(customOpts.bigIdx,customOpts.subMode);}
      else{G.screen={name:"menu"};renderMenu();}
    };
  }

  function showGameOver(){
    const body=
      '<div class="modal gameover-modal">'+
        '<div class="gameover-icon">💔</div>'+
        '<h2 class="gameover-title">Out of Lives!</h2>'+
        '<p class="gameover-desc">You made '+maxLives+' mistakes on this puzzle. Nonograms take patience and smart deductions!</p>'+
        '<div class="gameover-tip">'+
          '<b>💡 Pro Tip:</b> Use the <b>X mark</b> tool on squares you know must be empty, and look for rows or columns with large clue numbers first.'+
        '</div>'+
        '<div class="modal-actions">'+
          '<button class="square-btn press" id="goBack" title="Exit Level">'+icon("back")+'</button>'+
          '<button class="btn-primary press" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px" id="goRetry">'+
            icon("restart")+' TRY AGAIN'+
          '</button>'+
        '</div>'+
      '</div>';
    showModal(body);
    document.getElementById("goRetry").onclick=()=>{
      sound.click();
      restart();
    };
    document.getElementById("goBack").onclick=()=>{
      sound.click();
      closeModal();
      doBack();
    };
  }

  function nextLevel(){
    cleanup();G.cleanup=null;
    if(mode==="mosaic"&&customOpts){
      startMosaicGame(customOpts.bigIdx,customOpts.subMode,customOpts.blockId+1);
    }else if(id<LEVELS_PER_SIZE-1){
      startGame(mode,size,id+1);
    }else{
      const idx=SIZES.indexOf(size);
      if(idx>=0&&idx<SIZES.length-1)startGame(mode,SIZES[idx+1],0);
      else{G.screen={name:"select",mode,size};renderLevelSelect(mode,size);}
    }
  }
}

/* ==================================================================
   MODALS — help / settings / restart confirm
   ================================================================== */
function showHelp(){
  showModal(
    '<div class="modal help-modal">'+
      '<div class="help-header">'+
        '<button class="help-close-btn press" id="helpClose" aria-label="Close">'+icon("x")+'</button>'+
        '<div class="hh-badge">'+icon("classic")+' Puzzle Guide</div>'+
        '<h2>HOW TO PLAY</h2>'+
      '</div>'+
      '<div class="help-card">'+
        '<div class="help-card-ic">1</div>'+
        '<div class="help-card-body">'+
          '<div class="help-card-title">Number Clues</div>'+
          '<p class="help-card-desc">Numbers show continuous groups of filled squares. Multiple numbers (e.g. <b>1 1</b>) have at least <b>one empty gap</b> between them.</p>'+
          '<div class="help-demo-wrap">'+
            '<div class="help-demo-row">'+
              '<span class="help-demo-clue" id="helpDemoClue">1 1</span>'+
              '<div class="help-demo-cell" data-idx="0">'+icon("x")+'</div>'+
              '<div class="help-demo-cell fill" data-idx="1"></div>'+
              '<div class="help-demo-cell" data-idx="2">'+icon("x")+'</div>'+
              '<div class="help-demo-cell" data-idx="3"></div>'+
              '<div class="help-demo-cell" data-idx="4">'+icon("x")+'</div>'+
            '</div>'+
            '<div class="help-demo-feedback" id="helpDemoMsg">💡 Tap cells to solve the "1 1" Heart curve row!</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="help-card">'+
        '<div class="help-card-ic">'+icon("pen")+'</div>'+
        '<div class="help-card-body">'+
          '<div class="help-card-title">Pen & Cross Tools</div>'+
          '<p class="help-card-desc">Use both tools together to uncover the picture with pure logic:</p>'+
          '<div class="help-tools-grid">'+
            '<div class="help-tool-pill">'+
              '<span class="ic">'+icon("pen")+'</span>'+
              '<div><b>Pen Tool</b><small>Fills picture blocks</small></div>'+
            '</div>'+
            '<div class="help-tool-pill">'+
              '<span class="ic">'+icon("x")+'</span>'+
              '<div><b>Cross Tool</b><small>Marks empty spaces</small></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="help-card">'+
        '<div class="help-card-ic">'+icon("bulb")+'</div>'+
        '<div class="help-card-body">'+
          '<div class="help-card-title">Expert Clues & Hints</div>'+
          '<p class="help-card-desc">In <b>Expert Mode</b>, hidden <b>"?"</b> clues can be deduced from cross lines. Finished lines automatically strike through. Tap <b>Bulb</b> for hints!</p>'+
        '</div>'+
      '</div>'+
      '<div class="help-keys">'+
        '<span class="help-key"><kbd>P</kbd> Pen</span>'+
        '<span class="help-key"><kbd>X</kbd> Cross</span>'+
        '<span class="help-key"><kbd>Z</kbd> Undo</span>'+
        '<span class="help-key"><kbd>Y</kbd> Redo</span>'+
        '<span class="help-key"><kbd>Right-Click</kbd> Quick X</span>'+
      '</div>'+
      '<button class="btn-primary press" style="margin-top:16px;width:100%" id="helpOk">GOT IT, LET\'S PLAY!</button>'+
    '</div>'
  );

  /* Interactive Demo Logic */
  const demoStates = [2, 1, 2, 0, 2]; // 0: empty, 1: fill, 2: cross
  const demoCells = modalRoot.querySelectorAll(".help-demo-cell");
  const demoClue = document.getElementById("helpDemoClue");
  const demoMsg = document.getElementById("helpDemoMsg");

  function updateDemoUI(){
    demoCells.forEach((c, i)=>{
      const s = demoStates[i];
      c.className = "help-demo-cell" + (s === 1 ? " fill" : "");
      c.innerHTML = s === 2 ? icon("x") : "";
    });
    // Target: [X, 1, X, 1, X] for clue "1 1" (Heart top curve)
    const isTargetSolved = demoStates[1] === 1 && demoStates[3] === 1 && 
                           demoStates[0] !== 1 && demoStates[2] !== 1 && demoStates[4] !== 1;
    if(isTargetSolved){
      if(demoClue) { demoClue.classList.add("solved"); demoClue.innerHTML = "1 1 ✓"; }
      if(demoMsg) { demoMsg.className = "help-demo-feedback success"; demoMsg.innerHTML = "🎉 Perfect! Fill + Gap + Fill shapes the Heart lobes!"; }
    } else {
      if(demoClue) { demoClue.classList.remove("solved"); demoClue.innerHTML = "1 1"; }
      if(demoMsg) { demoMsg.className = "help-demo-feedback"; demoMsg.innerHTML = "💡 Tap cell 4 to complete the \"1 1\" Heart curves!"; }
    }
  }

  demoCells.forEach((cell, idx)=>{
    cell.onclick=()=>{
      demoStates[idx] = (demoStates[idx] + 1) % 3;
      if(demoStates[idx] === 1) sound.fill();
      else if(demoStates[idx] === 2) sound.cross();
      else sound.undo();
      updateDemoUI();
    };
  });

  const closeFn = ()=>{ sound.click(); closeModal(); };
  const okBtn = document.getElementById("helpOk");
  if(okBtn) okBtn.onclick = closeFn;
  const closeBtn = document.getElementById("helpClose");
  if(closeBtn) closeBtn.onclick = closeFn;
}
function showSettings(){
  const rows=[
    {key:"dark",label:"Dark Mode",desc:"Easy on the eyes at night"},
    {key:"sound",label:"Sound Effects",desc:"Clicks, pops and victory chimes"},
    {key:"autoCross",label:"Auto X Marks",desc:"Cross out finished lines automatically"},
    {key:"highlight",label:"Highlight Line",desc:"Shade the row & column you drag on"}
  ];
  let body='<div class="modal"><h2>Settings</h2>';
  rows.forEach(r=>{
    body+='<div class="set-row"><div><b>'+r.label+'</b><small style="display:block">'+r.desc+'</small></div>'+
      '<button class="switch '+(G.settings[r.key]?"on":"")+'" data-key="'+r.key+'"><i></i></button></div>';
  });
  body+='<button class="btn-danger press" id="setReset">Reset All Progress</button>'+
    '<button class="btn-primary press" style="margin-top:12px" id="setClose">Close</button></div>';
  showModal(body);
  modalRoot.querySelectorAll(".switch").forEach(sw=>{
    sw.onclick=()=>{
      const key=sw.dataset.key;G.settings[key]=!G.settings[key];saveSettings(G.settings);
      sw.classList.toggle("on",G.settings[key]);
      if(key==="dark"){applyDark();document.querySelectorAll("[data-act=dark]").forEach(b=>b.innerHTML=icon(G.settings.dark?"sun":"moon"));}
      if(key==="sound")sound.enabled=G.settings.sound;
      sound.click();
    };
  });
  document.getElementById("setClose").onclick=()=>{sound.click();closeModal();};
  document.getElementById("setReset").onclick=()=>{
    sound.click();
    showResetConfirm();
  };
}

function showResetConfirm(){
  showModal(
    '<div class="modal confirm-modal">'+
      '<div class="confirm-icon-wrap danger">'+
        '⚠️'+
      '</div>'+
      '<h2 class="confirm-title" style="color:#ef4444">Reset All Progress?</h2>'+
      '<p class="confirm-desc" style="color:var(--heading);font-weight:600">Are you sure you want to erase all your saved data?</p>'+
      '<div class="confirm-card">'+
        '<div class="row"><span style="color:#ef4444;font-weight:bold">•</span> All solved Classic &amp; Expert levels</div>'+
        '<div class="row"><span style="color:#ef4444;font-weight:bold">•</span> Mosaic masterpiece unlocks</div>'+
        '<div class="row"><span style="color:#ef4444;font-weight:bold">•</span> Daily challenge streaks &amp; calendar history</div>'+
      '</div>'+
      '<p class="confirm-warning">⚠️ This action is permanent and cannot be undone!</p>'+
      '<div class="confirm-actions">'+
        '<button class="btn-ghost press" id="resetCancel">Keep Progress</button>'+
        '<button class="btn-red press" id="resetConfirm">Erase Everything</button>'+
      '</div>'+
    '</div>'
  );
  document.getElementById("resetCancel").onclick=()=>{
    sound.click();
    showSettings();
  };
  document.getElementById("resetConfirm").onclick=()=>{
    sound.click();
    Storage.resetAll();
    G.settings=Object.assign({},Storage.defaults.settings);
    applyDark();
    sound.enabled=true;
    if(G.cleanup){G.cleanup();G.cleanup=null;}
    refreshStores();
    closeModal();
    G.screen={name:"menu"};
    renderMenu();
  };
}
function showRestartConfirm(onConfirm){
  showModal(
    '<div class="modal confirm-modal">'+
      '<div class="confirm-icon-wrap warn">'+
        icon("restart")+
      '</div>'+
      '<h2 class="confirm-title">Restart Puzzle?</h2>'+
      '<p class="confirm-desc">Your current moves and progress on this puzzle will be reset to the beginning.</p>'+
      '<div class="confirm-actions">'+
        '<button class="btn-ghost press" id="rcCancel">Cancel</button>'+
        '<button class="btn-red press" id="rcOk">Restart</button>'+
      '</div>'+
    '</div>'
  );
  document.getElementById("rcCancel").onclick=()=>{sound.click();closeModal();};
  document.getElementById("rcOk").onclick=()=>{sound.click();onConfirm();};
}
function showLeaveConfirm(onLeave){
  showModal(
    '<div class="modal confirm-modal">'+
      '<div class="confirm-icon-wrap info">'+
        icon("back")+
      '</div>'+
      '<h2 class="confirm-title">Leave Puzzle?</h2>'+
      '<p class="confirm-desc">Your unfinished moves on this puzzle will not be saved.</p>'+
      '<div class="confirm-actions">'+
        '<button class="btn-ghost press" id="lcCancel">Keep Playing</button>'+
        '<button class="btn-red press" id="lcOk">Leave</button>'+
      '</div>'+
    '</div>'
  );
  document.getElementById("lcCancel").onclick=()=>{sound.click();closeModal();};
  document.getElementById("lcOk").onclick=()=>{sound.click();closeModal();onLeave();};
}

/* ==================================================================
   BOOT
   ================================================================== */
applyDark();
sound.enabled=G.settings.sound;
renderMenu();
