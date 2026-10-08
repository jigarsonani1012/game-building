import * as THREE from "three";

const THEMES = [
  {
    top: "#6d80f5",
    bottom: "#97aaff",
    safe: "#32d77a",
    dark: "#262930",
    pole: "#edf1f5",
  },
  {
    top: "#ffe6ef",
    bottom: "#ffb8c6",
    safe: "#ff4d6d",
    dark: "#282034",
    pole: "#fff8fb",
  },
  {
    top: "#dff5ff",
    bottom: "#9bd9ff",
    safe: "#218fff",
    dark: "#172334",
    pole: "#f3fbff",
  },
  {
    top: "#f0e4ff",
    bottom: "#c9adff",
    safe: "#8b4dff",
    dark: "#20172d",
    pole: "#fbf6ff",
  },
  {
    top: "#fff0dc",
    bottom: "#ffc28c",
    safe: "#ff8c21",
    dark: "#2b1d15",
    pole: "#fff9ef",
  },
  {
    top: "#e0fff5",
    bottom: "#a6f0dd",
    safe: "#13c6a0",
    dark: "#152821",
    pole: "#effffb",
  },
  {
    top: "#ffe5f8",
    bottom: "#ffb3e9",
    safe: "#f83bb7",
    dark: "#2d162b",
    pole: "#fff4fc",
  },
  {
    top: "#fffddd",
    bottom: "#fff08f",
    safe: "#f9c500",
    dark: "#292417",
    pole: "#fffef0",
  },
  {
    top: "#dcfce7",
    bottom: "#86efac",
    safe: "#22c55e",
    dark: "#142e1d",
    pole: "#f0fdf4",
  },
  {
    top: "#e0e7ff",
    bottom: "#a5b4fc",
    safe: "#6366f1",
    dark: "#1e1b4b",
    pole: "#eef2ff",
  },
  {
    top: "#fee2e2",
    bottom: "#fca5a5",
    safe: "#ef4444",
    dark: "#450a0a",
    pole: "#fef2f2",
  },
  {
    top: "#cffafe",
    bottom: "#67e8f9",
    safe: "#06b6d4",
    dark: "#083344",
    pole: "#ecfeff",
  },
  {
    top: "#fae8ff",
    bottom: "#f0abfc",
    safe: "#d946ef",
    dark: "#3b0764",
    pole: "#fdf4ff",
  },
  {
    top: "#fef9c3",
    bottom: "#fde047",
    safe: "#eab308",
    dark: "#362b03",
    pole: "#fefce8",
  },
];
const SKINS = [
  {
    id: "classic",
    name: "White",
    color: "#fff",
    price: 0,
    rough: 0.28,
    metal: 0.08,
  },
  {
    id: "ember",
    name: "Ember",
    color: "#ff722f",
    glow: "#ff3300",
    price: 120,
    rough: 0.42,
  },
  {
    id: "neon",
    name: "Neon",
    color: "#37f5ff",
    glow: "#00b7ff",
    price: 190,
    rough: 0.28,
  },
  {
    id: "gold",
    name: "Gold",
    color: "#ffd13e",
    price: 280,
    rough: 0.2,
    metal: 0.92,
  },
  {
    id: "toxic",
    name: "Toxic",
    color: "#79fa3f",
    glow: "#2eff00",
    price: 350,
    rough: 0.38,
  },
  {
    id: "bubble",
    name: "Bubble",
    color: "#ff75d8",
    glow: "#ff2eae",
    price: 420,
    rough: 0.3,
  },
  {
    id: "obsidian",
    name: "Obsidian",
    color: "#1e202b",
    glow: "#7d41ff",
    price: 530,
    rough: 0.15,
    metal: 0.72,
  },
  {
    id: "chrome",
    name: "Black",
    color: "#0a0a0d",
    glow: "#000000",
    price: 670,
    rough: 0.22,
    metal: 0.15,
  },
  {
    id: "prism",
    name: "Prism",
    color: "#ff3c8e",
    glow: "#ff2a81",
    price: 900,
    rough: 0.25,
    rainbow: true,
  },
];
const SAVE_KEY = "stack-fall-data",
  OLD_SAVE_KEY = "stack-fall-single-html-v2",
  DEFAULT_SAVE = {
    level: 1,
    best: 0,
    coins: 0,
    skin: "classic",
    owned: ["classic"],
    sound: true,
    vibration: true,
  };
let save;
try {
  const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(OLD_SAVE_KEY) || "{}";
  save = {
    ...DEFAULT_SAVE,
    ...JSON.parse(raw),
  };
  save.owned = Array.isArray(save.owned) ? save.owned : ["classic"];
} catch {
  save = { ...DEFAULT_SAVE };
}
const store = () => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {}
};
const GAME = {
    segments: 12,
    inner: 0.45,
    outer: 1.65,
    height: 0.34,
    spacing: 0.40,
    ballR: 0.30,
    ballZ: 1.18,
    gravity: 40,
    bounceH: 0.75,
    maxDebris: 250,
  },
  SEG = (Math.PI * 2) / GAME.segments,
  TWO_PI = Math.PI * 2,
  mod = (v, b) => ((v % b) + b) % b,
  clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp = (a, b, t) => a + (b - a) * t;
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function safeRun(arr) {
  if (arr.every((x) => !x)) return GAME.segments;
  let best = 0,
    run = 0;
  for (let i = 0; i < GAME.segments * 2; i++) {
    if (!arr[i % GAME.segments]) {
      run++;
      best = Math.max(best, run);
    } else run = 0;
  }
  return Math.min(best, GAME.segments);
}
function mask(type, offset, width) {
  const m = Array(GAME.segments).fill(false);
  if (type === "arc")
    for (let i = 0; i < width; i++)
      m[mod(offset + i, GAME.segments)] = true;
  if (type === "split")
    for (let i = 0; i < Math.max(1, Math.round(width / 2)); i++) {
      m[mod(offset + i, GAME.segments)] = true;
      m[mod(offset + i + GAME.segments / 2, GAME.segments)] = true;
    }
  if (type === "triple") {
    const p = Math.max(1, Math.round(width / 3));
    for (let g = 0; g < 3; g++)
      for (let i = 0; i < p; i++)
        m[mod(offset + i + (g * GAME.segments) / 3, GAME.segments)] =
          true;
  }
  if (type === "stripes")
    for (let i = 0; i < GAME.segments; i += 3)
      m[mod(offset + i, GAME.segments)] = true;
  return m;
}
function createLevel(level) {
  const r = rng(level * 7919 + 13),
    count = Math.min(96 + Math.floor(level * 22), 700),
    rows = [],
    safe = () => rows.push({ deadly: Array(GAME.segments).fill(false) }),
    chance = clamp(0.70 + level * 0.012, 0.70, 0.95),
    minSafe = level < 4 ? 6 : level < 14 ? 5 : 3;

  // Starting safe landing zone
  for (let i = 0; i < (level < 4 ? 5 : 3); i++) safe();

  // Generate coherent helical sections matching classic Stack Fall
  let currentOffset = Math.floor(r() * GAME.segments);
  while (rows.length < count - 2) {
    const types = ["arc", "arc"];
    if (level >= 3) types.push("arc");
    if (level >= 6) types.push("split");
    if (level >= 14) types.push("triple");

    const type = types[Math.floor(r() * types.length)];
    // Deadly width aligns with whole lobes (6 segments = 2 lobes, 8-9 segments = 3 lobes)
    let width = 6;
    if (level >= 3) width = r() < 0.5 ? 6 : 8;
    if (level >= 8) width = r() < 0.4 ? 6 : r() < 0.7 ? 8 : 9;

    const hostile = r() < chance,
      sectionLength = Math.min(
        24 + Math.floor(r() * 32),
        count - 2 - rows.length
      );

    for (let n = 0; n < sectionLength; n++) {
      if (!hostile) {
        safe();
        continue;
      }
      const deadly = mask(type, currentOffset, width);
      while (safeRun(deadly) < minSafe) {
        const last = deadly.lastIndexOf(true);
        if (last < 0) break;
        deadly[last] = false;
      }
      rows.push({ deadly });
    }

    // Between long sections: 1-floor safe breather
    if (r() < 0.5 && rows.length < count - 2) {
      safe();
    }
    currentOffset = mod(currentOffset + (r() < 0.5 ? 3 : -3), GAME.segments);
  }
  safe();

  const shapes = [
    "circle",
    "hexagon",
    "clover",
    "square",
    "flower5",
    "star",
    "triangle",
    "gear",
    "octagon",
    "turbine",
    "sunburst",
    "cross",
    "triwing",
    "diamond",
    "wave",
    "notched",
  ];
  return {
    level,
    rows,
    twist: 0,
    rotation:
      (1.05 + Math.min(0.45, level * 0.02)) * (r() < 0.5 ? -1 : 1),
    motion: "constant",
    shape: shapes[(level - 1) % shapes.length],
  };
}
class Sound {
  constructor() {
    this.context = null;
    this.enabled = true;
  }
  unlock() {
    if (!this.enabled) return;
    if (!this.context) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      this.context = new C();
    }
    if (this.context.state === "suspended")
      this.context.resume().catch(() => {});
  }
  tone(f, d, t = "sine", v = 0.18, to = 0) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context) return;
    const n = this.context.currentTime,
      o = this.context.createOscillator(),
      g = this.context.createGain();
    o.type = t;
    o.frequency.setValueAtTime(f, n);
    if (to) o.frequency.exponentialRampToValueAtTime(to, n + d);
    g.gain.setValueAtTime(v, n);
    g.gain.exponentialRampToValueAtTime(0.0001, n + d);
    o.connect(g).connect(this.context.destination);
    o.start(n);
    o.stop(n + d + 0.02);
  }
  bounce() {
    this.tone(300, 0.08, "sine", 0.12, 180);
  }
  warn() {
    this.tone(140, 0.16, "triangle", 0.24, 75);
  }
  break(c) {
    const p = 220 * Math.pow(1.055, Math.min(c, 24));
    this.tone(p, 0.11, "triangle", 0.18, p * 1.6);
  }
  fever() {
    this.tone(180, 0.42, "sawtooth", 0.2, 820);
  }
  death() {
    this.tone(180, 0.45, "sawtooth", 0.24, 42);
  }
  win() {
    [523, 659, 784, 1047].forEach((n, i) =>
      setTimeout(() => this.tone(n, 0.28, "triangle", 0.18), i * 85),
    );
  }
  tap() {
    this.tone(680, 0.045, "sine", 0.09, 520);
  }
  reward() {
    this.tone(1050, 0.12, "sine", 0.12, 1600);
  }
}
const sound = new Sound(),
  vibrate = (p) => {
    if (save.vibration && navigator.vibrate) navigator.vibrate(p);
  };
const $ = (s) => document.querySelector(s),
  dom = {
    app: $("#app"),
    world: $("#world"),
    hud: $("#hud"),
    pauseBtn: $("#pauseBtn"),
    score: $("#score"),
    progress: $("#progressFill"),
    fever: $("#feverFill"),
    feverLabel: $("#feverLabel"),
    flameMark: $("#feverGauge .flame-mark"),
    levelNow: $("#levelNow"),
    levelNext: $("#levelNext"),
    coin: $("#coinValue"),
    home: $("#homeScreen"),
    best: $("#bestHome"),
    homeLevel: $("#homeLevel"),
    ready: $("#readyHint"),
    readyLevel: $("#readyLevel"),
    modal: $("#modalLayer"),
    sheet: $("#sheetLayer"),
    combo: $("#comboLayer"),
    flash: $("#flash"),
    error: $("#webglError"),
  };
const icon = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.7v14.6a1 1 0 0 0 1.5.86l12-7.3a1 1 0 0 0 0-1.72l-12-7.3A1 1 0 0 0 7 4.7Z"/></svg>',
  replay:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
  soundOn:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  soundOff:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  vibeOn:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M1 9l2 3-2 3"/><path d="M23 9l-2 3 2 3"/></svg>',
  vibeOff:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
};
function gem(size = 18) {
  return `<svg class="gem" style="width:${size}px;height:${size}px" viewBox="0 0 24 24"><defs><linearGradient id="modalGem" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9dfcff"/><stop offset=".55" stop-color="#20a7ff"/><stop offset="1" stop-color="#6e50eb"/></linearGradient></defs><path fill="url(#modalGem)" d="m6 3h12l4 6-10 12L2 9z"/><path fill="none" stroke="rgba(255,255,255,.75)" d="M2 9h20M6 3l6 18m6-18-6 18M6 3l3 6m9-6-3 6"/></svg>`;
}
function accent(t) {
  document.documentElement.style.setProperty("--accent", t.safe);
  document.documentElement.style.setProperty(
    "--accent-dark",
    new THREE.Color(t.safe).multiplyScalar(0.84).getStyle(),
  );
  document.documentElement.style.setProperty("--top", t.top);
  document.documentElement.style.setProperty("--bottom", t.bottom);
}
function persistent() {
  dom.coin.textContent = save.coins;
  dom.best.textContent = save.best;
  dom.homeLevel.textContent = save.level;
}
function closeModal() {
  dom.modal.classList.add("hidden");
  dom.modal.innerHTML = "";
}
function closeSheet() {
  dom.sheet.classList.add("hidden");
  dom.sheet.innerHTML = "";
}
function scoreBump() {
  dom.score.classList.remove("score-bump");
  void dom.score.offsetWidth;
  dom.score.classList.add("score-bump");
}
function pop(text, hot = false) {
  const el = document.createElement("div");
  el.className = `combo ${hot ? "hot" : ""}`;
  el.textContent = text;
  el.style.left = `${innerWidth * 0.58}px`;
  el.style.top = `${innerHeight * 0.53}px`;
  dom.combo.append(el);
  setTimeout(() => el.remove(), 800);
}
class Engine {
  constructor(container, cb) {
    this.container = container;
    this.cb = cb;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.8));
    this.renderer.setClearColor(0, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    container.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 80);
    this.scene.add(this.camera);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x485264, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(4, 9, 7);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-5, 2, -3);
    this.scene.add(fill);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    this.tower = new THREE.Group();
    this.scene.add(this.tower);
    this.safeMat = new THREE.MeshStandardMaterial({
      color: "#ff4d6d",
      roughness: 0.54,
      metalness: 0.02,
    });
    this.darkMat = new THREE.MeshStandardMaterial({
      color: "#282034",
      roughness: 0.74,
      metalness: 0.03,
    });
    this.poleMat = new THREE.MeshStandardMaterial({
      color: "#e6e9ee",
      roughness: 0.65,
      metalness: 0.02,
    });
    this.baseMat = new THREE.MeshStandardMaterial({
      color: "#e6e9ee",
      roughness: 0.62,
      metalness: 0.02,
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: "#ff4d6d",
      roughness: 0.54,
    });
    this.pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
      this.poleMat,
    );
    this.tower.add(this.pole);
    this.base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.2, 0.6, 48),
      this.baseMat,
    );
    this.tower.add(this.base);
    this.baseRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.38, 1.38, 0.08, 48),
      this.accentMat,
    );
    this.tower.add(this.baseRing);
    this.ballMat = new THREE.MeshStandardMaterial({
      color: "#fff",
      roughness: 0.3,
      metalness: 0.08,
    });
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(GAME.ballR, 32, 24),
      this.ballMat,
    );
    this.scene.add(this.ball);
    this.glowTex = this.texture();
    this.splatterTexs = this.splatterTextures();
    this.splatterGeo = new THREE.PlaneGeometry(0.72, 0.72);
    this.splatterAnim = [];
    this.glowMat = new THREE.SpriteMaterial({
      map: this.glowTex,
      color: "#ff5500",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.glow = new THREE.Sprite(this.glowMat);
    this.glow.scale.setScalar(2);
    this.scene.add(this.glow);

    this.ringMat = new THREE.MeshBasicMaterial({
      color: "#ffbb11",
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.024, 12, 48),
      this.ringMat,
    );
    this.ring.visible = false;
    this.scene.add(this.ring);

    this.ringMat2 = new THREE.MeshBasicMaterial({
      color: "#ff3700",
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.58, 0.018, 12, 48),
      this.ringMat2,
    );
    this.ring2.visible = false;
    this.scene.add(this.ring2);
    this.sprites = [];
    this.particles = [];
    this.debris = [];
    this.pool = [];
    this.wedges = [];
    this.debrisGeo = [];
    for (let i = 0; i < 110; i++) {
      const m = new THREE.SpriteMaterial({
          map: this.glowTex,
          color: "#fff",
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
        s = new THREE.Sprite(m);
      s.visible = false;
      this.scene.add(s);
      this.sprites.push(s);
    }
    this.phase = "ready";
    this.hold = false;
    this.holdAllowed = true;
    this.hue = 0;
    this.currentSkin = SKINS.find((s) => s.id === save.skin) || SKINS[0];
    this.last = performance.now();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.load(save.level);
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }
  texture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d"),
      g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.42, "rgba(255,255,255,.58)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  splatterTextures() {
    const makeCanvas = (drawFn) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      drawFn(ctx);
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    return [
      // Variation 1: Starburst splash with organic tentacles and fine droplets
      makeCanvas((ctx) => {
        const cx = 128, cy = 128;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fill();
        const tentacles = [
          { a: 0.25, len: 94, w: 18 },
          { a: 1.15, len: 106, w: 22 },
          { a: 1.95, len: 86, w: 16 },
          { a: 2.85, len: 112, w: 20 },
          { a: 3.75, len: 96, w: 17 },
          { a: 4.65, len: 108, w: 24 },
          { a: 5.55, len: 88, w: 19 },
        ];
        tentacles.forEach((t) => {
          const ex = cx + Math.cos(t.a) * t.len;
          const ey = cy + Math.sin(t.a) * t.len;
          const perp = t.a + Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(perp) * t.w, cy + Math.sin(perp) * t.w);
          ctx.quadraticCurveTo(
            cx + Math.cos(t.a) * (t.len * 0.5) + Math.cos(perp) * (t.w * 0.4),
            cy + Math.sin(t.a) * (t.len * 0.5) + Math.sin(perp) * (t.w * 0.4),
            ex,
            ey
          );
          ctx.arc(ex, ey, t.w * 0.4, t.a, t.a + Math.PI);
          ctx.quadraticCurveTo(
            cx + Math.cos(t.a) * (t.len * 0.5) - Math.cos(perp) * (t.w * 0.4),
            cy + Math.sin(t.a) * (t.len * 0.5) - Math.sin(perp) * (t.w * 0.4),
            cx - Math.cos(perp) * t.w,
            cy - Math.sin(perp) * t.w
          );
          ctx.closePath();
          ctx.fill();

          const tipX = cx + Math.cos(t.a) * (t.len + 16);
          const tipY = cy + Math.sin(t.a) * (t.len + 16);
          ctx.beginPath();
          ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
          ctx.fill();
        });

        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2 + 0.15;
          const dist = 58 + (i % 3) * 22;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, 3.5 + (i % 3) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }),

      // Variation 2: Organic liquid puddle splash
      makeCanvas((ctx) => {
        const cx = 128, cy = 128;
        ctx.beginPath();
        const steps = 32;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const r = 54 + Math.sin(a * 4) * 22 + Math.cos(a * 7) * 12 + Math.sin(a * 11) * 8;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        const satellites = [
          { x: 45, y: 50, r: 12 },
          { x: 210, y: 75, r: 14 },
          { x: 195, y: 190, r: 16 },
          { x: 65, y: 200, r: 11 },
          { x: 130, y: 225, r: 13 },
          { x: 125, y: 28, r: 15 },
        ];
        satellites.forEach((s) => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * Math.PI * 2;
          const d = 45 + (i % 4) * 20;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3 + (i % 3) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }),

      // Variation 3: Heavy dynamic impact splatter with teardrops
      makeCanvas((ctx) => {
        const cx = 128, cy = 128;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 46, 36, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2 + 0.12;
          const len = 68 + (i % 3) * 24;
          const x = cx + Math.cos(a) * len;
          const y = cy + Math.sin(a) * len;
          ctx.beginPath();
          ctx.arc(x, y, 7 + (i % 3) * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.strokeStyle = "#ffffff";
          ctx.moveTo(cx + Math.cos(a) * 32, cy + Math.sin(a) * 32);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        for (let i = 0; i < 18; i++) {
          const a = (i / 18) * Math.PI * 2;
          const d = 60 + (i % 3) * 25;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3 + (i % 2) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }),

      // Variation 4: Multi-blob impact burst
      makeCanvas((ctx) => {
        const cx = 128, cy = 128;
        const blobs = [
          { x: cx - 14, y: cy - 8, r: 38 },
          { x: cx + 18, y: cy + 14, r: 34 },
          { x: cx - 18, y: cy + 22, r: 26 },
          { x: cx + 24, y: cy - 18, r: 28 },
        ];
        blobs.forEach((b) => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });

        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * Math.PI * 2;
          const dist = 72 + (i % 3) * 22;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 4.5 + (i % 3) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }),
    ];
  }
  radius(a, type) {
    if (type === "clover")
      return GAME.outer * (1 + 0.22 * Math.cos(a * 4) - 0.04 * Math.cos(a * 8));
    if (type === "flower5")
      return GAME.outer * (1 + 0.20 * Math.cos(a * 5) - 0.04 * Math.cos(a * 10));
    if (type === "hexagon") {
      const angle = mod(a, Math.PI / 3) - Math.PI / 6;
      return (GAME.outer * 0.95) / Math.cos(angle);
    }
    if (type === "square") {
      const angle = mod(a, Math.PI / 2) - Math.PI / 4;
      return (GAME.outer * 0.96) / Math.cos(angle);
    }
    if (type === "triangle") {
      const angle = mod(a, (Math.PI * 2) / 3) - Math.PI / 3;
      return (GAME.outer * 0.92) / Math.cos(angle);
    }
    if (type === "star")
      return GAME.outer * (1 + 0.22 * Math.sin(a * 5));
    if (type === "gear")
      return GAME.outer * (1 + 0.16 * Math.sin(a * 8));
    if (type === "octagon") {
      const angle = mod(a, Math.PI / 4) - Math.PI / 8;
      return (GAME.outer * 0.98) / Math.cos(angle);
    }
    if (type === "turbine")
      return GAME.outer * (1 + 0.18 * Math.sin(a * 6 + Math.cos(a * 3)));
    if (type === "sunburst")
      return GAME.outer * (1 + 0.22 * Math.sin(a * 10));
    if (type === "cross") {
      return GAME.outer * (0.86 + 0.22 * Math.pow(Math.cos(a * 2), 4));
    }
    if (type === "triwing")
      return GAME.outer * (1 + 0.26 * Math.sin(a * 3));
    if (type === "diamond") {
      const angle = mod(a + Math.PI / 4, Math.PI / 2) - Math.PI / 4;
      return (GAME.outer * 0.96) / Math.cos(angle);
    }
    if (type === "wave")
      return GAME.outer * (1 + 0.14 * Math.sin(a * 6));
    if (type === "notched")
      return GAME.outer * (1 + 0.12 * Math.sign(Math.sin(a * 8)) * 0.7);
    return GAME.outer;
  }
  center(i) {
    const a = (i + 0.5) * SEG,
      r = (GAME.inner + GAME.outer) / 2;
    return new THREE.Vector3(Math.cos(a) * r, 0, -Math.sin(a) * r);
  }
  wedge(i, type) {
    const gap = 0.005,
      start = i * SEG + gap,
      end = (i + 1) * SEG - gap,
      steps = 24,
      sh = new THREE.Shape();
    for (let p = 0; p <= steps; p++) {
      const a = start + ((end - start) * p) / steps,
        r = this.radius(a, type);
      if (!p) sh.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else sh.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    for (let p = steps; p >= 0; p--) {
      const a = start + ((end - start) * p) / steps;
      sh.lineTo(Math.cos(a) * GAME.inner, Math.sin(a) * GAME.inner);
    }
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, {
      depth: GAME.height - 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 12,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -GAME.height / 2 + 0.02, 0);
    return geo;
  }
  geometries(type) {
    this.wedges.forEach((g) => g.dispose());
    this.debrisGeo.forEach((g) => g.dispose());
    this.wedges = [];
    this.debrisGeo = [];
    for (let i = 0; i < GAME.segments; i++) {
      this.wedges.push(this.wedge(i, type));
      const g = this.wedge(i, type),
        c = this.center(i);
      g.translate(-c.x, 0, -c.z);
      this.debrisGeo.push(g);
    }
  }
  clear() {
    this.platforms?.forEach((p) => this.tower.remove(p.group));
    for (const d of this.debris) {
      d.mesh.visible = false;
      this.pool.push(d.mesh);
    }
    this.debris = [];
    for (const p of this.particles) p.object.visible = false;
    this.particles = [];
  }
  themeSet() {
    const t = this.theme;
    this.safeMat.color.set(t.safe);
    this.darkMat.color.set(t.dark);
    const poleColor = new THREE.Color(t.pole).multiplyScalar(0.94);
    this.poleMat.color.copy(poleColor);
    this.baseMat.color.copy(poleColor);
    this.accentMat.color.set(t.safe);
    this.scene.fog = new THREE.Fog(new THREE.Color(t.bottom), 12, 32);
    accent(t);
  }
  build() {
    this.clear();
    this.platforms = [];
    const stepAngle = (this.data.twist ?? 0) * Math.sign(this.data.rotation || 1);
    this.data.rows.forEach((row, i) => {
      const y = -i * GAME.spacing,
        twistAngle = i * stepAngle,
        group = new THREE.Group(),
        darkMeshes = [],
        safeMeshes = [];
      group.position.y = y;
      group.rotation.y = twistAngle;
      row.deadly.forEach((dark, k) => {
        const m = new THREE.Mesh(
          this.wedges[k],
          dark ? this.darkMat : this.safeMat,
        );
        group.add(m);
        if (dark) darkMeshes.push(m);
        else safeMeshes.push(m);
      });
      this.tower.add(group);
      this.platforms.push({
        row,
        y,
        top: y + GAME.height / 2,
        group,
        darkMeshes,
        safeMeshes,
        gone: false,
        twistAngle,
        warned: false,
        warnScale: 1,
      });
    });
    this.baseTop = -this.platforms.length * GAME.spacing - 0.1;
    const top = 6,
      h = top - this.baseTop + 0.3;
    this.pole.scale.set(1, h, 1);
    this.pole.position.y = top - h / 2;
    this.base.position.y = this.baseTop - 0.3;
    this.baseRing.position.y = this.baseTop + 0.04;
  }
  load(level) {
    this.level = level;
    this.data = createLevel(level);
    this.theme = THEMES[(level - 1) % THEMES.length];
    this.geometries(this.data.shape);
    this.themeSet();
    this.build();
    this.reset();
    this.phase = "ready";
    this.cb.hud(this.snapshot());
  }
  reset() {
    this.current = 0;
    this.theta = 0;
    this.time = 0;
    this.score = 0;
    this.combo = 0;
    this.fever = 0;
    this.feverActive = false;
    this.feverTime = 0;
    this.warnCooldown = 0;
    this.hold = false;
    this.holdAllowed = true;
    this.holdTime = 0;
    this.ball.visible = true;
    this.ball.scale.setScalar(1);
    this.ballY = this.platforms[0].top + GAME.ballR + 1.15;
    this.vy = 0;
    this.camTarget = this.platforms[0].top;
    this.camY = this.camTarget;
    this.shake = 0;
    this.glowMat.opacity = 0;
    this.ring.visible = false;
    if (this.ring2) this.ring2.visible = false;
    this.applySkin();
    this.cameraUpdate(0, true);
  }
  skin(s) {
    this.currentSkin = s;
    this.applySkin();
  }
  applySkin() {
    const s = this.currentSkin || SKINS[0];
    if (s.rainbow || s.id === "prism") {
      this.hue = 0;
      this.ballMat.color.setHSL(0, 0.95, 0.52);
      this.ballMat.emissive.setHSL(0, 0.95, 0.3);
      this.ballMat.emissiveIntensity = 0.55;
      this.ballMat.roughness = 0.22;
      this.ballMat.metalness = 0.18;
    } else {
      this.ballMat.color.set(s.color);
      this.ballMat.emissive.set(s.glow || "#000000");
      this.ballMat.emissiveIntensity = s.glow ? 0.38 : 0;
      this.ballMat.roughness = s.rough ?? 0.4;
      this.ballMat.metalness = s.metal ?? 0.06;
    }
    this.ballMat.needsUpdate = true;
  }
  start() {
    if (this.phase !== "ready") return;
    this.phase = "playing";
    this.cb.hud(this.snapshot());
  }
  holdSet(v) {
    if (v && !this.holdAllowed) return;
    if (v && !this.hold) this.holdTime = 0;
    if (!v) this.holdAllowed = true;
    this.hold = v;
  }
  pause() {
    if (this.phase !== "playing" && this.phase !== "ready") return;
    this.beforePause = this.phase;
    this.phase = "paused";
    this.hold = false;
    this.cb.hud(this.snapshot());
  }
  resume() {
    if (this.phase !== "paused") return;
    this.phase = this.beforePause;
    this.holdAllowed = false;
    this.hold = false;
    this.last = performance.now();
    this.cb.hud(this.snapshot());
  }
  restart() {
    this.load(this.level);
  }
  next() {
    this.load(this.level + 1);
  }
  revive() {
    if (this.phase !== "dead") return;
    const p = this.platforms[this.current];
    if (p && !p.gone) this.destroy(p, true);
    this.current = Math.min(this.current + 1, this.platforms.length);
    const next = this.platforms[this.current],
      top = next ? next.top : this.baseTop;
    this.ball.visible = true;
    this.ballY = top + GAME.ballR + 1.35;
    this.vy = 0;
    this.combo = 0;
    this.fever = 0;
    this.feverActive = false;
    this.holdAllowed = false;
    this.hold = false;
    this.camTarget = top;
    this.phase = "playing";
    this.applySkin();
    this.cb.hud(this.snapshot());
  }
  segment(p) {
    const twist = p ? (p.twistAngle || 0) : 0;
    return (
      Math.floor(mod(-Math.PI / 2 - this.theta - twist, TWO_PI) / SEG) %
      GAME.segments
    );
  }
  addSplatter(p) {
    if (!p || !p.group) return;
    if (!p.splatters) p.splatters = [];
    if (p.splatters.length >= 24) {
      const old = p.splatters.shift();
      p.group.remove(old);
      if (old.material) old.material.dispose();
    }

    let col;
    if (this.feverActive) {
      col = new THREE.Color("#ff6000");
    } else if (this.currentSkin?.rainbow || this.currentSkin?.id === "prism") {
      col = new THREE.Color().setHSL(this.hue || 0, 1.0, 0.58);
    } else if (this.currentSkin?.id === "obsidian") {
      col = new THREE.Color("#8f4dff");
    } else if (this.currentSkin?.id === "bubble") {
      col = new THREE.Color("#ff3dbb");
    } else if (this.currentSkin?.id === "neon") {
      col = new THREE.Color("#00d4ff");
    } else if (this.currentSkin?.id === "toxic") {
      col = new THREE.Color("#44ff11");
    } else if (this.currentSkin?.id === "ember") {
      col = new THREE.Color("#ff6200");
    } else if (this.currentSkin?.id === "gold") {
      col = new THREE.Color("#ffd13e");
    } else if (this.currentSkin?.id === "chrome") {
      col = new THREE.Color("#111116");
    } else if (this.currentSkin?.color) {
      col = new THREE.Color(this.currentSkin.color);
    } else {
      col = this.ballMat.color.clone();
    }

    const tex = this.splatterTexs ? this.splatterTexs[Math.floor(Math.random() * this.splatterTexs.length)] : this.glowTex;
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      color: col,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });

    const mesh = new THREE.Mesh(this.splatterGeo, mat);
    const twist = p.twistAngle || 0;
    const towerAngle = mod(-Math.PI / 2 - this.theta - twist, TWO_PI);
    const maxShapeRadius = this.radius(towerAngle, this.data?.shape || 'circle');
    const availableSpan = maxShapeRadius - GAME.inner;
    const s = clamp(0.85 + Math.random() * 0.22, 0.55, (availableSpan * 0.44) / 0.36);
    const halfSize = s * 0.36;
    const placeR = clamp(GAME.ballZ, GAME.inner + halfSize + 0.05, maxShapeRadius - halfSize - 0.05);
    const localX = placeR * Math.sin(-this.theta - twist);
    const localZ = placeR * Math.cos(-this.theta - twist);
    mesh.position.set(localX, GAME.height / 2 + 0.0035, localZ);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.random() * Math.PI * 2;
    mesh.scale.set(s * 0.35, s * 0.35, 1);

    p.group.add(mesh);
    p.splatters.push(mesh);
    this.splatterAnim.push({ mesh, scale: s, time: 0 });
  }
  bounce(p) {
    this.vy = Math.sqrt(2 * GAME.gravity * GAME.bounceH);
    this.combo = 0;
    this.holdTime = 0;
    this.squash = 1.35;
    if (!this.feverActive) {
      this.fever = Math.max(0, this.fever - 0.35);
    }
    if (this.phase === "playing") sound.bounce();
    if (p) this.addSplatter(p);
  }
  ballUpdate(dt) {
    if (this.warnCooldown > 0) this.warnCooldown -= dt;
    const sm = this.phase === "playing" && this.hold && this.warnCooldown <= 0;
    this.vy -= GAME.gravity * dt;
    if (sm) {
      this.holdTime += dt;
      const target = this.feverActive
        ? 12.5
        : 7.8 + Math.min(1, this.holdTime / 0.5) * 3.0;
      this.vy = Math.min(this.vy, -target);
    }
    this.ballY += this.vy * dt;
    let guard = 0;
    while (guard++ < 20) {
      const p = this.platforms[this.current],
        bottom = this.ballY - GAME.ballR;
      if (p && bottom <= p.top && this.vy < 0) {
        if (this.phase === "playing" && this.hold && this.warnCooldown <= 0) {
          const segment = this.segment(p);
          if (this.feverActive || !p.row.deadly[segment]) {
            this.break(p);
            continue;
          }
          // Landed on deadly dark segment
          if (!p.warned) {
            p.warned = true;
            p.warnTime = 0;
            this.warnCooldown = 0.42;
            sound.warn();
            vibrate([35, 45]);
            this.shake = 0.55;
            this.ballY = p.top + GAME.ballR;
            this.bounce(p);
            this.sparks(this.ball.position, 0xff3344, 14, 3.8);
            break;
          } else {
            this.die();
            return;
          }
        }
        this.ballY = p.top + GAME.ballR;
        this.bounce(p);
      } else if (!p && bottom <= this.baseTop && this.vy < 0) {
        this.ballY = this.baseTop + GAME.ballR;
        if (this.phase === "playing") {
          this.win();
          return;
        }
        this.bounce(null);
      }
      break;
    }
    this.ball.position.set(0, this.ballY, GAME.ballZ);
  }
  break(p) {
    this.destroy(p, false);
    this.current++;
    this.combo++;
    this.score += this.feverActive ? 2 : 1;
    if (!this.feverActive) {
      this.fever = Math.min(1, this.fever + 0.038);
      if (this.fever >= 1) this.fire();
    }
    this.camTarget = this.platforms[this.current]
      ? this.platforms[this.current].top
      : this.baseTop;
    sound.break(this.combo);
    vibrate(this.feverActive ? 8 : 11);
    if (this.combo > 1)
      this.cb.combo(
        this.feverActive
          ? this.combo % 3 === 0
            ? "UNSTOPPABLE"
            : `x${this.combo}`
          : this.combo >= 9
            ? `x${this.combo} GREAT`
            : `x${this.combo}`,
        this.feverActive,
      );
    this.sparks(
      this.ball.position,
      this.feverActive
        ? 0xffa01f
        : new THREE.Color(this.theme.safe).getHex(),
      this.feverActive ? 7 : 3,
      this.feverActive ? 4.5 : 2.6,
    );
  }
  fire() {
    this.feverActive = true;
    this.feverDuration = 1.35;
    this.feverTime = this.feverDuration;
    this.fever = 1;
    this.ballMat.color.set("#ff3b00");
    this.ballMat.emissive.set("#ff8800");
    this.ballMat.emissiveIntensity = 0.85;
    this.ballMat.roughness = 0.18;
    sound.fever();
    vibrate([18, 25, 38]);
    this.cb.fever();
    this.sparks(this.ball.position, 0xff9900, 28, 4.8);
  }
  destroy(p, silent) {
    if (p.gone) return;
    p.gone = true;
    p.group.visible = false;
    if (silent) return;
    const curRot = this.theta + (p.twistAngle || 0);
    for (let i = 0; i < GAME.segments; i++) {
      if (this.debris.length >= GAME.maxDebris) {
        const old = this.debris.shift();
        old.mesh.visible = false;
        this.pool.push(old.mesh);
      }
      let mesh = this.pool.pop();
      if (!mesh) {
        mesh = new THREE.Mesh(this.debrisGeo[i], this.safeMat);
        this.scene.add(mesh);
      }
      mesh.geometry = this.debrisGeo[i];
      mesh.material = p.row.deadly[i] ? this.darkMat : this.safeMat;
      const c = this.center(i).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        curRot,
      );
      mesh.position.set(c.x, p.y, c.z);
      mesh.rotation.set(0, curRot, 0);
      mesh.scale.setScalar(1);
      mesh.visible = true;
      const a = (i + 0.5) * SEG + curRot,
        x = Math.cos(a),
        z = -Math.sin(a);
      
      // Part pieces cleanly to left and right in a wide V-shape (\/) leaving the center wide open
      const dirX = x < 0 ? -1 : (x > 0 ? 1 : (i % 2 === 0 ? 1 : -1));
      const sideSpeed = (Math.max(Math.abs(x), 0.85) * 8.8) + (Math.random() * 4.8);
      const front = Math.max(0, z);
      
      const velocity = new THREE.Vector3(
          dirX * sideSpeed,
          7.2 + Math.random() * 4.2 + front * 2.6,
          z * (4.2 + Math.random() * 2.8),
        ),
        spin = new THREE.Vector3(
          -z * (3.8 + Math.random() * 4.5),
          -dirX * (3.5 + Math.random() * 4.0),
          x * (3.8 + Math.random() * 4.5),
        ),
        life = 0.44 + Math.random() * 0.18;
      this.debris.push({ mesh, velocity, spin, life, maxLife: life });
    }
  }
  die() {
    this.phase = "dead";
    this.hold = false;
    this.ball.visible = false;
    this.feverActive = false;
    this.ring.visible = false;
    if (this.ring2) this.ring2.visible = false;
    this.glowMat.opacity = 0;
    this.shake = 1;
    sound.death();
    vibrate([50, 35, 80]);
    this.sparks(
      this.ball.position,
      new THREE.Color((this.currentSkin || SKINS[0]).color).getHex(),
      20,
      5.5,
    );
    this.cb.dead({ score: this.score, broken: this.current });
    this.cb.hud(this.snapshot());
  }
  win() {
    this.phase = "won";
    this.hold = false;
    this.feverActive = false;
    this.applySkin();
    this.vy = Math.sqrt(2 * GAME.gravity * 1.1);
    this.shake = 0.3;
    sound.win();
    vibrate([25, 32, 25, 32, 65]);
    this.sparks(
      new THREE.Vector3(0, this.baseTop + 0.8, 0),
      new THREE.Color(this.theme.safe).getHex(),
      56,
      7,
    );
    this.cb.win({ score: this.score, broken: this.current });
    this.cb.hud(this.snapshot());
  }
  sparks(pos, color, count, power) {
    for (let i = 0; i < count; i++) {
      const s = this.sprites.find((x) => !x.visible);
      if (!s) return;
      s.visible = true;
      s.position.copy(pos);
      s.position.x += (Math.random() - 0.5) * 0.10;
      s.position.z += (Math.random() - 0.5) * 0.10;
      const size = 0.05 + Math.random() * 0.05;
      s.scale.setScalar(size);
      s.material.color.setHex(color);
      s.material.opacity = 1;
      const life = 0.22 + Math.random() * 0.18;
      this.particles.push({
        object: s,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * power * 2.2,
          (Math.random() * 0.6 + 0.4) * power * 2.0,
          (Math.random() - 0.5) * power * 2.2,
        ),
        life,
        maxLife: life,
        size,
        gravity: 12,
      });
    }
  }
  particlesUpdate(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.object.visible = false;
        this.particles.splice(i, 1);
        continue;
      }
      p.velocity.y -= p.gravity * dt;
      p.object.position.addScaledVector(p.velocity, dt);
      const r = p.life / p.maxLife;
      p.object.material.opacity = Math.min(1, r * 2.0);
      p.object.scale.setScalar(p.size * Math.max(0.1, r));
    }
  }
  debrisUpdate(dt) {
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      if (d.life <= 0) {
        d.mesh.visible = false;
        this.pool.push(d.mesh);
        this.debris.splice(i, 1);
        continue;
      }
      /* no gravity: pieces keep floating upward and parting in a fast V-shape */
      d.mesh.position.addScaledVector(d.velocity, dt);
      d.mesh.rotation.x += d.spin.x * dt;
      d.mesh.rotation.y += d.spin.y * dt;
      d.mesh.rotation.z += d.spin.z * dt;
      const r = d.life / d.maxLife;
      d.mesh.scale.setScalar(r < 0.40 ? Math.max(0.001, Math.pow(r / 0.40, 1.1)) : 1);
    }
  }
  effects(dt) {
    this.squash = Math.max(0, (this.squash || 0) - dt * 6);
    const falling = clamp(-this.vy / 55, 0, 0.34);
    this.ball.scale.set(
      1 - falling * 0.38 + this.squash * 0.24,
      1 + falling - this.squash * 0.34,
      1 - falling * 0.38 + this.squash * 0.24,
    );
    this.ball.rotation.x -= this.vy * dt * 0.4;
    for (let i = (this.splatterAnim?.length || 0) - 1; i >= 0; i--) {
      const sa = this.splatterAnim[i];
      sa.time += dt;
      const t = Math.min(1, sa.time / 0.12);
      const pop = Math.sin(t * Math.PI * 0.5) * 1.15;
      const curScale = sa.scale * pop;
      sa.mesh.scale.set(curScale, curScale, 1);
      if (t >= 1) {
        sa.mesh.scale.set(sa.scale, sa.scale, 1);
        this.splatterAnim.splice(i, 1);
      }
    }
    if (this.platforms) {
      this.platforms.forEach((p) => {
        if (p.gone || !p.group) return;
        if (p.warnTime !== undefined && p.warnTime < 0.38) {
          p.warnTime += dt;
          const t = Math.min(1, p.warnTime / 0.38);
          const pop = Math.sin(t * Math.PI) * 0.25;
          const s = 1.0 + pop;
          p.group.scale.set(s, 1.0, s);
          if (t >= 1) {
            p.group.scale.set(1.0, 1.0, 1.0);
          }
        }
      });
    }
    if ((this.currentSkin?.rainbow || this.currentSkin?.id === "prism") && !this.feverActive) {
      this.hue = ((this.hue || 0) + dt * 0.45) % 1;
      this.ballMat.color.setHSL(this.hue, 1.0, 0.58);
      this.ballMat.emissive.setHSL(this.hue, 1.0, 0.42);
      this.ballMat.emissiveIntensity = 0.85;
    }
    const show =
      this.feverActive &&
      (this.phase === "playing" || this.phase === "paused");
    this.ring.visible = show;
    if (this.ring2) this.ring2.visible = show;
    if (show) {
      const s1 = 1.05 + Math.sin(this.time * 16) * 0.08;
      this.ring.scale.setScalar(s1);
      this.ring.position.copy(this.ball.position);
      this.ring.rotation.x = Math.PI / 2 + Math.sin(this.time * 4) * 0.22;
      this.ring.rotation.y = Math.cos(this.time * 4) * 0.22;
      this.ring.rotation.z += dt * 6.5;

      const s2 = 1.08 + Math.cos(this.time * 16) * 0.08;
      this.ring2.scale.setScalar(s2);
      this.ring2.position.copy(this.ball.position);
      this.ring2.rotation.x = Math.PI / 2 + Math.cos(this.time * 4.5) * -0.28;
      this.ring2.rotation.y = Math.sin(this.time * 4.5) * 0.28;
      this.ring2.rotation.z -= dt * 7.5;

      // Alive pulsing fireball material
      const pulse = 0.72 + Math.sin(this.time * 22) * 0.25;
      this.ballMat.color.set("#ff3d00");
      this.ballMat.emissive.set("#ffa200");
      this.ballMat.emissiveIntensity = pulse;

      // Spawn dancing fiery embers floating upwards from the ball
      if (this.phase === "playing") {
        this.feverEmberTime = (this.feverEmberTime || 0) + dt;
        if (this.feverEmberTime > 0.035) {
          this.feverEmberTime = 0;
          this.sparks(
            new THREE.Vector3(
              this.ball.position.x + (Math.random() - 0.5) * 0.26,
              this.ball.position.y - 0.12 + (Math.random() - 0.5) * 0.18,
              this.ball.position.z + (Math.random() - 0.5) * 0.26,
            ),
            Math.random() < 0.65 ? 0xff7b00 : 0xffd000,
            2,
            1.6,
          );
        }
      }
    }
    const o = this.feverActive ? 0.45 : 0;
    this.glowMat.opacity = lerp(this.glowMat.opacity, o, dt * 10);
    this.glow.position.copy(this.ball.position);
    this.glow.position.z += 0.35;
    this.glow.scale.setScalar(
      this.feverActive ? 1.8 + Math.sin(this.time * 14) * 0.15 : 1.4,
    );
  }
  cameraUpdate(dt, snap = false) {
    const followSpeed = this.hold ? 18 : 14;
    this.camY = snap
      ? this.camTarget
      : lerp(this.camY, this.camTarget, Math.min(1, dt * followSpeed));
    this.shake = Math.max(0, this.shake - dt * 2.2);
    const x = (Math.random() - 0.5) * this.shake * 0.3,
      y = (Math.random() - 0.5) * this.shake * 0.3;
    this.camera.position.set(x, this.camY + 2.35 + y, 6.7);
    this.camera.lookAt(0, this.camY - 0.1, 0.45);
  }
  snapshot() {
    return {
      level: this.level,
      score: this.score,
      progress: this.current / this.platforms.length,
      fever: this.fever,
      feverActive: this.feverActive,
      phase: this.phase,
      broken: this.current,
      total: this.platforms.length,
    };
  }
  resize() {
    const w = Math.max(1, this.container.clientWidth),
      h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const isPortrait = h > w;
    this.camera.fov = isPortrait ? 52 : 44;
    this.camera.updateProjectionMatrix();
  }
  loop(now) {
    requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    if (this.phase !== "paused") {
      this.time += dt;
      let s = this.data.rotation;
      if (this.phase === "dead" || this.phase === "won") s *= 0.35;
      else if (this.phase === "playing" && this.hold) s = 0;
      this.theta += s * dt;
      this.tower.rotation.y = this.theta;
      if (this.phase === "ready" || this.phase === "playing")
        this.ballUpdate(dt);
      if (this.phase === "won") {
        this.vy -= GAME.gravity * dt;
        this.ballY += this.vy * dt;
        if (this.ballY - GAME.ballR <= this.baseTop && this.vy < 0) {
          this.ballY = this.baseTop + GAME.ballR;
          this.vy = Math.sqrt(2 * GAME.gravity * 0.7);
          this.squash = 1;
        }
        this.ball.position.y = this.ballY;
      }
      if (this.phase === "playing") {
        if (this.feverActive) {
          this.feverTime -= dt;
          this.fever = Math.max(0, this.feverTime / (this.feverDuration || 1.3));
          if (this.feverTime <= 0) {
            this.feverActive = false;
            this.fever = 0;
            this.applySkin();
          }
        } else {
          if (!this.hold) this.fever = Math.max(0, this.fever - 2.5 * dt);
        }
      }
      this.effects(dt);
      this.particlesUpdate(dt);
      this.debrisUpdate(dt);
      this.cameraUpdate(dt);
      this.cb.hud(this.snapshot());
    }
    this.renderer.render(this.scene, this.camera);
  }
}
let game,
  active = "home",
  reviveUsed = false,
  credited = 0,
  result = { score: 0, broken: 0, coins: 0 },
  reviveInterval;
function hud(s) {
  dom.levelNow.textContent = s.level;
  dom.levelNext.textContent = s.level + 1;
  dom.progress.style.width = `${Math.round(s.progress * 100)}%`;
  dom.fever.style.height = `${Math.round(s.fever * 100)}%`;
  dom.feverLabel.classList.toggle("hidden", !s.feverActive);
  if (dom.flameMark) {
    dom.flameMark.classList.toggle("active", Boolean(s.feverActive || s.fever >= 0.98));
  }
  if (dom.score.textContent !== String(s.score)) {
    dom.score.textContent = s.score;
    scoreBump();
  }
}
function page(next) {
  active = next;
  dom.home.classList.toggle("hidden", next !== "home");
  dom.ready.classList.toggle("hidden", next !== "ready");
  dom.hud.classList.toggle("hidden", next === "home");
  if (dom.pauseBtn) {
    dom.pauseBtn.classList.toggle("hidden", next !== "playing");
  }
  if (next === "ready") dom.readyLevel.textContent = game.level;
}
function start() {
  closeSheet();
  closeModal();
  sound.unlock();
  if (game) {
    game.holdAllowed = true;
    game.start();
  }
  if (active === "home" || active === "ready") {
    reviveUsed = false;
    credited = 0;
    page("playing");
  }
}
function home() {
  clearInterval(reviveInterval);
  closeModal();
  closeSheet();
  sound.tap();
  game.load(save.level);
  page("home");
  persistent();
}
function restart() {
  clearInterval(reviveInterval);
  closeModal();
  sound.tap();
  game.restart();
  page("ready");
}
function next() {
  closeModal();
  sound.tap();
  game.next();
  page("ready");
  persistent();
}
function pause() {
  if (active !== "playing") return;
  sound.tap();
  game.pause();
  page("paused");
  pauseModal();
}
function resume() {
  closeModal();
  sound.tap();
  game.resume();
  page("playing");
}
function death(data) {
  const fresh = Math.max(0, data.broken - credited);
  credited = data.broken;
  const coins = Math.floor(fresh / 4);
  result = { ...data, coins };
  save.best = Math.max(save.best, data.score);
  save.coins += coins;
  store();
  persistent();
  page("dead");
  gameOver();
}
function victory(data) {
  const fresh = Math.max(0, data.broken - credited);
  credited = 0;
  const coins = 10 + game.level * 2 + Math.floor(fresh / 4);
  result = { ...data, coins };
  save.best = Math.max(save.best, data.score);
  save.coins += coins;
  save.level = Math.max(save.level, game.level + 1);
  store();
  persistent();
  page("won");
  winModal();
}
function fever() {
  dom.flash.classList.remove("fire");
  void dom.flash.offsetWidth;
  dom.flash.classList.add("fire");
}
function gameOver() {
  clearInterval(reviveInterval);
  dom.modal.innerHTML = `<div class="modal-backdrop"><div class="panel"><div class="panel-kicker">Level ${game.level}</div><h2>Game over</h2><div class="stat-row"><div class="stat"><b>Score</b><strong>${result.score}</strong></div><div class="stat reward"><b>Best</b><strong style="color:var(--accent)">${save.best}</strong></div></div>${result.coins ? `<p style="display:flex;justify-content:center;align-items:center;gap:4px;margin:-5px 0 15px">${gem(16)} +${result.coins} gems</p>` : ""}<button id="retryBtn" class="primary-btn interactive">${icon.replay} Try again</button><div class="mini-actions"><button id="homeBtn" class="mini-action interactive" aria-label="Home">${icon.home}</button></div></div></div>`;
  dom.modal.classList.remove("hidden");
  $("#retryBtn")?.addEventListener("click", restart);
  $("#homeBtn")?.addEventListener("click", home);
}
function winModal() {
  dom.modal.innerHTML = `<div class="modal-backdrop"><div class="panel"><div class="panel-kicker">Level ${game.level}</div><h2>Complete</h2><div class="stars">★ ★ ★</div><div class="stat-row"><div class="stat"><b>Score</b><strong>${result.score}</strong></div><div class="stat reward"><b>Reward</b><strong>${gem(20)} ${result.coins}</strong></div></div><button id="nextBtn" class="primary-btn interactive">${icon.play} Next level</button><div class="mini-actions"><button id="homeBtn" class="mini-action interactive" aria-label="Home">${icon.home}</button></div></div></div>`;
  dom.modal.classList.remove("hidden");
  $("#nextBtn").addEventListener("click", next);
  $("#homeBtn").addEventListener("click", home);
}
function pauseModal() {
  dom.modal.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel">
        <h2>Paused</h2>
        <div class="pause-toggle-row">
          <button id="pauseSound" class="pause-toggle interactive ${save.sound ? "active" : ""}" aria-label="Toggle sound">
            ${save.sound ? icon.soundOn : icon.soundOff}
            <span>Sound: <b>${save.sound ? "ON" : "OFF"}</b></span>
          </button>
          <button id="pauseVibe" class="pause-toggle interactive ${save.vibration ? "active" : ""}" aria-label="Toggle vibration">
            ${save.vibration ? icon.vibeOn : icon.vibeOff}
            <span>Vibration: <b>${save.vibration ? "ON" : "OFF"}</b></span>
          </button>
        </div>
        <button id="resumeBtn" class="primary-btn interactive">${icon.play} Resume</button>
        <div class="mini-actions" style="margin-top:18px">
          <button id="restartBtn" class="mini-action interactive" aria-label="Restart" title="Restart">${icon.replay}</button>
          <button id="homeBtn" class="mini-action interactive" aria-label="Home" title="Home">${icon.home}</button>
        </div>
      </div>
    </div>`;
  dom.modal.classList.remove("hidden");
  $("#resumeBtn").addEventListener("click", resume);
  $("#restartBtn").addEventListener("click", restart);
  $("#homeBtn").addEventListener("click", home);
  $("#pauseSound").addEventListener("click", toggleSound);
  $("#pauseVibe").addEventListener("click", toggleVibe);
}
const gradient = (s) => {
  if (s.rainbow || s.id === "prism")
    return "conic-gradient(from 180deg at 50% 50%, #ff3d79, #ff8c22, #ffe447, #43ed70, #28bcff, #7c55ff, #ff3d79)";
  if (s.id === "classic")
    return "radial-gradient(circle at 35% 28%, #ffffff 0%, #f0f3f8 42%, #b5c2d4 78%, #6a798e 100%)";
  if (s.id === "ember")
    return "radial-gradient(circle at 35% 28%, #fff4e0 0%, #ff7b2b 40%, #e03b00 78%, #781700 100%)";
  if (s.id === "neon")
    return "radial-gradient(circle at 35% 28%, #e0ffff 0%, #00e1ff 38%, #0088e8 75%, #00367a 100%)";
  if (s.id === "gold")
    return "radial-gradient(circle at 35% 28%, #fffde6 0%, #ffdb4d 38%, #d8980a 75%, #6a4400 100%)";
  if (s.id === "toxic")
    return "radial-gradient(circle at 35% 28%, #f0ffe0 0%, #68fa28 38%, #20b800 75%, #0d5400 100%)";
  if (s.id === "bubble")
    return "radial-gradient(circle at 35% 28%, #ffe8f8 0%, #ff52be 38%, #d8168e 75%, #680544 100%)";
  if (s.id === "obsidian")
    return "radial-gradient(circle at 35% 28%, #d8b8ff 0%, #6f38d4 38%, #2d145c 75%, #0e0520 100%)";
  if (s.id === "chrome")
    return "radial-gradient(circle at 35% 28%, #6a6c78 0%, #292a34 42%, #111218 78%, #030306 100%)";
  const glow = s.glow || s.color;
  return `radial-gradient(circle at 35% 28%, #ffffff 0%, ${glow} 38%, ${s.color} 72%, rgba(18,20,28,0.85) 100%)`;
};
function updateShopCards() {
  const walletEl = dom.sheet.querySelector("#sheetWallet b");
  if (walletEl) walletEl.innerHTML = `${gem(18)} ${save.coins}`;
  dom.sheet.querySelectorAll("[data-skin]").forEach((b) => {
    const s = SKINS.find((x) => x.id === b.dataset.skin);
    if (!s) return;
    const owned = save.owned.includes(s.id),
      selected = save.skin === s.id,
      afford = save.coins >= s.price;
    b.className = `skin-card interactive ${selected ? "selected" : ""}`;
    b.disabled = !owned && !afford;
    const costEl = b.querySelector(".skin-cost");
    if (costEl) {
      costEl.innerHTML = owned
        ? (selected ? "Equipped" : "Owned")
        : `${gem(11)} ${s.price}`;
    }
  });
}
function shop() {
  sound.tap();
  const cards = SKINS.map((s) => {
    const owned = save.owned.includes(s.id),
      selected = save.skin === s.id,
      afford = save.coins >= s.price;
    return `<button data-skin="${s.id}" class="skin-card interactive ${selected ? "selected" : ""}" ${!owned && !afford ? "disabled" : ""}><span class="skin-orb" style="background:${gradient(s)}"></span><b>${s.name}</b><span class="skin-cost">${owned ? (selected ? "Equipped" : "Owned") : `${gem(11)} ${s.price}`}</span></button>`;
  }).join("");
  dom.sheet.innerHTML = `<div class="sheet-layer"><section class="sheet"><div class="sheet-head"><h2 class="sheet-title">Ball skins</h2><button id="closeSheet" class="sheet-close interactive" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div id="sheetWallet" class="wallet"><span>Your gems</span><b>${gem(18)} ${save.coins}</b></div><div class="skin-grid">${cards}</div><p class="sheet-note">Earn gems by smashing floors and completing levels.</p></section></div>`;
  dom.sheet.classList.remove("hidden");
  $("#closeSheet").addEventListener("click", closeSheet);
  dom.sheet.querySelectorAll("[data-skin]").forEach((b) =>
    b.addEventListener("click", () => {
      const s = SKINS.find((x) => x.id === b.dataset.skin);
      if (!s) return;
      if (!save.owned.includes(s.id)) {
        if (save.coins < s.price) return;
        save.coins -= s.price;
        save.owned.push(s.id);
        sound.reward();
      } else sound.tap();
      save.skin = s.id;
      game.skin(s);
      store();
      persistent();
      updateShopCards();
    }),
  );
}
function toggleSound() {
  save.sound = !save.sound;
  sound.enabled = save.sound;
  if (save.sound) sound.tap();
  store();
  const soundBtn = $("#pauseSound");
  if (soundBtn) {
    soundBtn.className = `pause-toggle interactive ${save.sound ? "active" : ""}`;
    soundBtn.innerHTML = `${save.sound ? icon.soundOn : icon.soundOff}<span>Sound: <b>${save.sound ? "ON" : "OFF"}</b></span>`;
  }
  const soundSwitch = $("#soundSwitch");
  if (soundSwitch) {
    soundSwitch.className = `switch interactive ${save.sound ? "on" : ""}`;
  }
}
function toggleVibe() {
  save.vibration = !save.vibration;
  if (save.vibration) vibrate(16);
  store();
  const vibeBtn = $("#pauseVibe");
  if (vibeBtn) {
    vibeBtn.className = `pause-toggle interactive ${save.vibration ? "active" : ""}`;
    vibeBtn.innerHTML = `${save.vibration ? icon.vibeOn : icon.vibeOff}<span>Vibration: <b>${save.vibration ? "ON" : "OFF"}</b></span>`;
  }
  const vibeSwitch = $("#vibeSwitch");
  if (vibeSwitch) {
    vibeSwitch.className = `switch interactive ${save.vibration ? "on" : ""}`;
  }
}
function confirmResetModal() {
  sound.tap();
  dom.modal.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel" style="max-width:340px">
        <div class="panel-kicker" style="color:#ef4444">Warning</div>
        <h2 style="font-size:24px;margin:8px 0 6px">Reset Progress?</h2>
        <p style="font-size:13px;color:var(--muted);margin-bottom:20px">All unlocked skins, gems, and high scores will be permanently reset to level 1.</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button id="confirmResetBtn" class="primary-btn interactive" style="background:linear-gradient(180deg,#ef4444,#dc2626);box-shadow:0 6px 16px rgba(239,68,68,0.3)">Reset Everything</button>
          <button id="cancelResetBtn" class="secondary-link interactive" style="margin-top:4px">Cancel</button>
        </div>
      </div>
    </div>`;
  dom.modal.classList.remove("hidden");
  $("#confirmResetBtn")?.addEventListener("click", () => {
    sound.tap();
    save = { ...DEFAULT_SAVE };
    store();
    game.skin(SKINS[0]);
    game.load(1);
    closeModal();
    closeSheet();
    persistent();
    page("home");
  });
  $("#cancelResetBtn")?.addEventListener("click", () => {
    sound.tap();
    closeModal();
  });
}
function settings() {
  sound.tap();
  dom.sheet.innerHTML = `<div class="sheet-layer"><section class="sheet"><div class="sheet-head"><h2 class="sheet-title">Settings</h2><button id="closeSheet" class="sheet-close interactive" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="setting-row"><span>Sound</span><button id="soundSwitch" class="switch interactive ${save.sound ? "on" : ""}" aria-label="Toggle sound"></button></div><div class="setting-row"><span>Vibration</span><button id="vibeSwitch" class="switch interactive ${save.vibration ? "on" : ""}" aria-label="Toggle vibration"></button></div><div class="stats-grid"><div class="small-stat"><b>Level</b><strong>${save.level}</strong></div><div class="small-stat"><b>Best</b><strong>${save.best}</strong></div><div class="small-stat"><b>Smashed</b><strong>${save.smashed}</strong></div></div><div class="how"><b>How to play</b>Hold to smash through coloured floors. Release before a dark section. Keep smashing to fill Fever and break everything for a short time.</div><button id="resetBtn" class="reset-btn interactive">Reset progress</button></section></div>`;
  dom.sheet.classList.remove("hidden");
  $("#closeSheet").addEventListener("click", closeSheet);
  $("#soundSwitch").addEventListener("click", toggleSound);
  $("#vibeSwitch").addEventListener("click", toggleVibe);
  $("#resetBtn").addEventListener("click", confirmResetModal);
}
try {
  game = new Engine(dom.world, {
    hud,
    combo: pop,
    dead: death,
    win: victory,
    fever,
  });
  game.skin(SKINS.find((s) => s.id === save.skin) || SKINS[0]);
} catch (err) {
  console.error(err);
  dom.error.classList.remove("hidden");
}
persistent();
page("home");
$("#pauseBtn").addEventListener("click", pause);
$("#shopBtn").addEventListener("click", shop);
$("#settingsBtn").addEventListener("click", settings);
$("#readyHomeBtn").addEventListener("click", home);
const isModalOpen = () =>
  !dom.modal.classList.contains("hidden") ||
  !dom.sheet.classList.contains("hidden");
const isUI = (t) =>
  Boolean(
    t.closest(
      "button, .sheet, .panel, .sheet-layer, .modal-backdrop, #modalLayer, #sheetLayer",
    ),
  );
dom.app.addEventListener("pointerdown", (e) => {
  if (isModalOpen() || isUI(e.target) || !game) return;
  game.holdAllowed = true;
  if (active === "home" || active === "ready") {
    start();
    game.holdSet(true);
  } else if (active === "playing") {
    game.holdSet(true);
  }
});
const release = () => game?.holdSet(false);
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
window.addEventListener("blur", release);
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (["Space", "ArrowDown", "Enter"].includes(e.code)) {
    e.preventDefault();
    if (active === "home" || active === "ready") start();
    if (active === "playing") game.holdSet(true);
  }
  if ((e.code === "Escape" || e.code === "KeyP") && active === "playing")
    pause();
  else if (
    (e.code === "Escape" || e.code === "KeyP") &&
    active === "paused"
  )
    resume();
});
window.addEventListener("keyup", (e) => {
  if (["Space", "ArrowDown", "Enter"].includes(e.code)) release();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && active === "playing") pause();
});
