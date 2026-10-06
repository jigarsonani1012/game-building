(function () {
'use strict';
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let gameplayRng = Math.random;
function gameRandom() { return gameplayRng(); }

/* ---------------- icons ---------------- */
const STAR = '<svg viewBox="0 0 48 48"><path class="f" d="M24 3.5l6.1 12.9 14.1 1.8-10.4 9.8 2.7 14L24 35.1 11.5 42l2.7-14L3.8 18.2l14.1-1.8z" stroke="#4a2a10" stroke-width="3.4" stroke-linejoin="round"/></svg>';
const I = {
  pause: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.6" fill="#fff" stroke="#8a4f00" stroke-width="1.4"/><rect x="14" y="4" width="5" height="16" rx="1.6" fill="#fff" stroke="#8a4f00" stroke-width="1.4"/></svg>',
  restart: '<svg viewBox="0 0 24 24"><path d="M12 3.5A8.5 8.5 0 1 0 19.8 8l2.7-.8L16.5 2 13 8.2l2.6 1.2A4.8 4.8 0 1 1 12 7.2Z" fill="#fff" stroke="#103e72" stroke-width="1.4" stroke-linejoin="round"/><path d="M5.5 12A6.5 6.5 0 0 1 9.5 6.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5l13 7.5-13 7.5z" fill="#fff" stroke="#1f6a12" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M5 4.5l10 7.5-10 7.5z" fill="#fff" stroke="#1f6a12" stroke-width="1.4" stroke-linejoin="round"/><rect x="16" y="4.5" width="3.4" height="15" rx="1" fill="#fff" stroke="#1f6a12" stroke-width="1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><g fill="#fff" stroke="#8a4f00" stroke-width="1.2"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></g></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#8a4f00" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" stroke="#8a4f00" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  musicOn: '<svg viewBox="0 0 24 24"><path d="M9 17V5l11-2v12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="#fff" stroke="#8a4f00" stroke-width="1.2"/><circle cx="17.5" cy="15.5" r="3" fill="#fff" stroke="#8a4f00" stroke-width="1.2"/></svg>',
  musicOff: '<svg viewBox="0 0 24 24"><path d="M9 17V5l11-2v12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" opacity=".55"/><circle cx="6.5" cy="17.5" r="3" fill="#fff" opacity=".55"/><circle cx="17.5" cy="15.5" r="3" fill="#fff" opacity=".55"/><path d="M3 3l18 18" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  lock: '<svg class="lk" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.4" fill="#fff" stroke="#5a544c" stroke-width="1.4"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="12" cy="15.4" r="1.7" fill="#5a544c"/></svg>',
  hand: '<svg viewBox="0 0 64 80"><path d="M22 9c0-5.2 8.2-5.2 8.2 0v25.5l1.4-.4c.4-4.6 7.8-4.6 8.2.2l.1 1.6c.9-4.1 7.6-3.9 8 .6l.1 2.1c1.2-3.5 7.4-3 7.4 1.4v15.8C55.4 69 48.2 76 38 76h-3.4c-7.4 0-11.4-3.2-15.6-9.3L7.6 50.2c-2.8-4.2 2.4-8.6 6.2-5l8.2 7.8z" fill="#fff" stroke="#2a1d10" stroke-width="3.2" stroke-linejoin="round"/></svg>',
  inspect: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15 15l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="10.5" cy="10.5" r="2.2" fill="#fff"/></svg>'
};
$('bPause').innerHTML = I.pause; $('bRestart').innerHTML = I.restart; $('bInspect').innerHTML = I.inspect;
$('bPLevels').innerHTML = I.menu; $('bPRestart').innerHTML = I.restart; $('bResume').innerHTML = I.play;
$('bWLevels').innerHTML = I.menu; $('bWReplay').innerHTML = I.restart; $('bWNext').innerHTML = I.next;
$('bFLevels').innerHTML = I.menu; $('bFRetry').innerHTML = I.restart;
$('bPvMenu').innerHTML = I.menu; $('bPvAgain').innerHTML = I.restart;
$('bLvBack').innerHTML = I.back; $('hand').innerHTML = I.hand;
['hs1', 'hs2', 'hs3'].forEach((id) => { $(id).innerHTML = STAR; });
[...$('winStars').children].forEach((s) => { s.innerHTML = STAR; });

/* ---------------- save ---------------- */
const SAVE_KEY = 'slingshot-fortress';
const save = { unlocked: 1, endlessUnlocked: 1, stars: {}, best: {}, coins: 0, sling: 'classic', owned: ['classic'], sound: true, music: true, seen: {}, seenTap: {}, fails: {}, chapterRewards: {}, daily: { date: '', best: 0, stars: 0, claimed: false, clears: 0, lastClear: '' } };
try {
  const stored = localStorage.getItem(SAVE_KEY) || localStorage.getItem('slingshot-fortress-save');
  if (stored) Object.assign(save, JSON.parse(stored));
} catch (e) { /* storage unavailable */ }
save.endlessUnlocked = Math.max(1, save.endlessUnlocked || 1);
save.seenTap = save.seenTap || {}; save.fails = save.fails || {}; if (typeof save.music !== 'boolean') save.music = true;
save.chapterRewards = save.chapterRewards || {};
save.daily = Object.assign({ date: '', best: 0, stars: 0, claimed: false, clears: 0, lastClear: '' }, save.daily || {});
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* storage unavailable */ } }

/* ---------------- audio (procedural) ---------------- */
const audio = {
  ctx: null, out: null, nb: null, last: {},
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try {
      this.ctx = new AC(); this.out = this.ctx.createGain(); this.out.gain.value = 0.6; this.out.connect(this.ctx.destination);
      const n = Math.floor(this.ctx.sampleRate * 1.2); this.nb = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = this.nb.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { this.ctx = null; }
  },
  ok(key, gap) { if (!this.ctx || !save.sound) return false; if (key) { const t = performance.now(); if (this.last[key] && t - this.last[key] < (gap || 60)) return false; this.last[key] = t; } return true; },
  tone(f, dur, o) {
    o = o || {}; const c = this.ctx, t = c.currentTime + (o.when || 0);
    const os = c.createOscillator(), g = c.createGain(); os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t);
    if (o.to) os.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.a || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    os.connect(g); g.connect(this.out); os.start(t); os.stop(t + dur + 0.05);
  },
  noise(dur, o) {
    o = o || {}; const c = this.ctx, t = c.currentTime + (o.when || 0);
    const s = c.createBufferSource(); s.buffer = this.nb; s.playbackRate.value = o.rate || 1;
    const f = c.createBiquadFilter(); f.type = o.type || 'lowpass'; f.frequency.setValueAtTime(o.freq || 1200, t); if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur); f.Q.value = o.q || 0.8;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.a || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  },
  stretch(p) { if (!this.ok('stretch', 90)) return; this.noise(0.09, { type: 'bandpass', freq: 500 + p * 1400, q: 6, vol: 0.12 }); this.tone(160 + p * 260, 0.08, { type: 'sawtooth', vol: 0.03 }); },
  launch() { if (!this.ok()) return; this.noise(0.35, { type: 'bandpass', freq: 600, to: 2600, q: 1.2, vol: 0.22 }); this.tone(120, 0.12, { type: 'triangle', vol: 0.25, to: 60 }); },
  hit(mat, E) {
    if (!this.ok('hit' + mat, 55)) return; const v = clamp(0.05 + E * 0.012, 0.05, 0.32);
    if (mat === 'stone') { this.tone(420 + Math.random() * 120, 0.09, { type: 'triangle', vol: v }); this.noise(0.07, { type: 'highpass', freq: 1800, vol: v * 0.7 }); }
    else if (mat === 'ice') { this.tone(1600 + Math.random() * 500, 0.14, { type: 'sine', vol: v * 0.7 }); this.noise(0.08, { type: 'highpass', freq: 3500, vol: v * 0.6 }); }
    else if (mat === 'enemy') { this.tone(520, 0.12, { type: 'sine', vol: v, to: 780 }); }
    else { this.tone(170 + Math.random() * 50, 0.12, { type: 'triangle', vol: v * 1.3, to: 110 }); this.noise(0.08, { freq: 700, vol: v * 0.8 }); }
  },
  brk(mat) {
    if (!this.ok('brk' + mat, 45)) return;
    if (mat === 'ice') { this.noise(0.4, { type: 'highpass', freq: 2500, vol: 0.28 }); for (let k = 0; k < 4; k++) this.tone(1800 + Math.random() * 1800, 0.18, { vol: 0.06, when: k * 0.03 }); }
    else if (mat === 'stone') { this.noise(0.35, { freq: 900, to: 300, vol: 0.34 }); this.tone(140, 0.2, { type: 'triangle', vol: 0.2, to: 70 }); }
    else { this.noise(0.3, { type: 'bandpass', freq: 900, to: 400, q: 1.5, vol: 0.32 }); this.tone(210, 0.15, { type: 'square', vol: 0.05, to: 90 }); }
  },
  boom() { if (!this.ok('boom', 90)) return; this.noise(1.1, { freq: 1400, to: 90, vol: 0.6, a: 0.005 }); this.tone(70, 0.6, { type: 'sine', vol: 0.5, to: 30 }); },
  pop() { if (!this.ok('pop', 40)) return; this.tone(380, 0.16, { type: 'square', vol: 0.08, to: 1300 }); this.noise(0.12, { type: 'bandpass', freq: 2000, vol: 0.2, when: 0.1 }); this.tone(900, 0.1, { vol: 0.15, when: 0.12, to: 300 }); },
  balloon() { if (!this.ok('bal', 40)) return; this.noise(0.12, { type: 'highpass', freq: 1500, vol: 0.4 }); this.tone(300, 0.08, { vol: 0.12, to: 120 }); },
  chime() { if (!this.ok('chime', 60)) return; [1318, 1760, 2093].forEach((f, k) => this.tone(f, 0.22, { type: 'triangle', vol: 0.09, when: k * 0.06 })); },
  ability() { if (!this.ok()) return; this.tone(600, 0.15, { type: 'square', vol: 0.06, to: 1400 }); this.noise(0.2, { type: 'bandpass', freq: 3000, vol: 0.12 }); },
  missile() { if (!this.ok()) return; this.noise(0.9, { type: 'bandpass', freq: 800, to: 2400, q: 0.8, vol: 0.3 }); },
  star(k) { if (!this.ok()) return; this.tone([880, 1175, 1568][k], 0.3, { type: 'triangle', vol: 0.16 }); this.tone([1760, 2349, 3136][k], 0.25, { vol: 0.05, when: 0.02 }); },
  bonus() { if (!this.ok('bonus', 50)) return; this.tone(988, 0.12, { type: 'square', vol: 0.06 }); this.tone(1319, 0.14, { type: 'square', vol: 0.06, when: 0.07 }); },
  win() { if (!this.ok()) return; [523, 659, 784, 1047].forEach((f, k) => this.tone(f, 0.28, { type: 'square', vol: 0.06, when: k * 0.11 })); [1047, 1319, 1568].forEach((f) => this.tone(f, 0.8, { type: 'triangle', vol: 0.1, when: 0.46 })); },
  fail() { if (!this.ok()) return; [392, 349, 311, 262].forEach((f, k) => this.tone(f, 0.32, { type: 'triangle', vol: 0.16, when: k * 0.17 })); },
  click() { if (!this.ok()) return; this.tone(700, 0.05, { type: 'square', vol: 0.05 }); },
  /* light procedural background music (its own on/off switch) */
  mg: null, mt: 0, ms: 0, key: 0,
  startMusic() {
    if (!this.ctx || this.mg) return;
    this.mg = this.ctx.createGain(); this.mg.gain.value = save.music ? 1 : 0.0001; this.mg.connect(this.out);
    this.mt = this.ctx.currentTime + 0.15; this.ms = 0;
  },
  setMusic(on) { if (this.mg) this.mg.gain.setTargetAtTime(on ? 1 : 0.0001, this.ctx.currentTime, 0.25); },
  mnote(f, t, dur, type, vol) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.mg); o.start(t); o.stop(t + dur + 0.05);
  },
  tickMusic() {
    if (!this.ctx || !this.mg) return;
    const now = this.ctx.currentTime;
    if (!save.music || this.ctx.state !== 'running') { this.mt = now + 0.05; return; }
    const e8 = 60 / 100 / 2;
    if (this.mt < now) this.mt = now + 0.05;
    while (this.mt < now + 0.3) { this.mstep(this.ms++, this.mt); this.mt += e8; }
  },
  mstep(s, t) {
    const PROG = [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]];
    const bar = Math.floor(s / 8) % 4, pos = s % 8, ch = PROG[bar], root = 261.63 * Math.pow(2, this.key / 12);
    const f = (semi, oct) => root * Math.pow(2, semi / 12 + (oct || 0));
    if (pos === 0 || pos === 4) this.mnote(f(ch[0], -2), t, 0.5, 'sine', 0.09);
    if (pos === 2 || pos === 6) this.mnote(f(ch[0], -1), t, 0.12, 'triangle', 0.022);
    const ARP = [0, 1, 2, 1, 2, 0, 1, 2], alt = Math.floor(s / 32) % 2;
    if (!(alt && (pos === 3 || pos === 7))) this.mnote(f(ch[ARP[pos]], alt && pos === 5 ? 1 : 0), t, 0.22, 'triangle', 0.032);
    if (s % 16 === 0) this.mnote(f(ch[2], 1), t + 0.01, 0.7, 'sine', 0.016);
  },
  load() { if (!this.ok('load', 80)) return; this.tone(300, 0.08, { type: 'triangle', vol: 0.12, to: 520 }); }
};

/* ---------------- boot ---------------- */
function setLoad(p, m) { $('ldFill').style.width = Math.round(p * 100) + '%'; if (m !== undefined) $('ldMsg').textContent = m; }
function boot() {
  setLoad(0.4);
  if (window.planck) { start(); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/planck@1.0.0/dist/planck.min.js';
  s.onload = () => (window.planck ? start() : setLoad(0.4, 'Could not load the physics engine. Please reload.'));
  s.onerror = () => setLoad(0.4, 'Could not load the physics engine. Check your connection and reload.');
  document.head.appendChild(s);
}

function start() {
const pl = window.planck, Vec2 = pl.Vec2;
setLoad(0.7);

/* =====================================================================
   CONSTANTS & DATA
   ===================================================================== */
const STEP = 1 / 60, MAXPULL = 1.75, LAUNCH_K = 12.8, REST_Y = 2.3, MOUND_H = 0.5;
const MAX_PHYSICS_STEPS = 8;
const MAT = {
  wood:  { density: 0.7, friction: 0.75, rest: 0.05, hp: 55,  resist: 1.0, pts: 300, chip: ['#dca062', '#a8692f', '#7a4a22'] },
  stone: { density: 2.2, friction: 0.85, rest: 0.02, hp: 130, resist: 0.4, pts: 400, chip: ['#b4bcc5', '#8a939c', '#5f6770'] },
  ice:   { density: 0.85, friction: 0.22, rest: 0.1, hp: 30,  resist: 1.5, pts: 300, chip: ['#eefaff', '#b6e4fb', '#7cc2ea'] }
};
const PROJ = {
  rock:     { name: 'STONE', r: 0.3, density: 6, rest: 0.25, vs: { wood: 1, stone: 1, ice: 1 }, desc: 'A trusty stone. Aim for weak spots!' },
  bomb:     { name: 'BOMB', r: 0.36, density: 5, rest: 0.2, vs: { wood: 0.8, stone: 0.8, ice: 1 }, desc: 'Tap while flying to EXPLODE!', hint: 'TAP TO EXPLODE!' },
  shuriken: { name: 'ICE SHURIKEN', r: 0.25, density: 5.5, rest: 0.1, vs: { wood: 1.6, stone: 0.45, ice: 2.2 }, desc: 'Tap while flying to SPLIT into 3! Slices wood and ice.', hint: 'TAP TO SPLIT!' },
  missile:  { name: 'MISSILE', r: 0.27, density: 6, rest: 0.1, vs: { wood: 1.3, stone: 1.3, ice: 1.3 }, desc: 'Tap while flying to BOOST straight ahead. Reach far targets!', hint: 'TAP TO BOOST!' },
  mini:     { name: 'SHARD', r: 0.2, density: 5, rest: 0.1, vs: { wood: 1.6, stone: 0.45, ice: 2.2 } }
};
const SLINGS = [
  { id: 'classic', name: 'CLASSIC', price: 0, desc: 'Reliable all-rounder.', bonus: {}, wood: '#8a5328', dark: '#4e2c12', band: '#6b1f1a' },
  { id: 'oak', name: 'OAK', price: 150, desc: '+60% damage to WOOD.', bonus: { wood: 1.6 }, wood: '#c99552', dark: '#6e4a1c', band: '#2e6b1a' },
  { id: 'frost', name: 'FROST', price: 250, desc: '+60% damage to ICE.', bonus: { ice: 1.6 }, wood: '#8fd4f2', dark: '#3a7fa8', band: '#1d5d8a' },
  { id: 'granite', name: 'GRANITE', price: 300, desc: '+60% damage to STONE.', bonus: { stone: 1.6 }, wood: '#9aa2ab', dark: '#4f565e', band: '#3a3a3a' },
  { id: 'royal', name: 'ROYAL', price: 800, desc: '+30% damage to EVERYTHING.', bonus: { wood: 1.3, stone: 1.3, ice: 1.3 }, wood: '#f2c230', dark: '#9a6a00', band: '#b3122a' }
];
const THEMES = [
  { name: 'FOREST', sky: ['#5cbcf5', '#c9efff'], far: '#9fcfd8', farSnow: null, mid: '#6fbf5a', midDark: '#4f9e41', grass: '#61b83d', grassDark: '#3f8a28', dirt: '#8a5a33', dirtDark: '#5e3a1e', deco: 'tree' },
  { name: 'CANYON', sky: ['#ff9f5a', '#ffe3b0'], far: '#e9a878', farSnow: null, mid: '#d98a4e', midDark: '#b86d36', grass: '#e9c47a', grassDark: '#c99b4e', dirt: '#c07a44', dirtDark: '#8e5226', deco: 'cactus' },
  { name: 'TUNDRA', sky: ['#8fcff7', '#effaff'], far: '#c5dff0', farSnow: '#ffffff', mid: '#a9cfe6', midDark: '#86b3d0', grass: '#f5fbff', grassDark: '#cfe6f5', dirt: '#8aaec6', dirtDark: '#5f87a3', deco: 'pine' },
  { name: 'VOLCANO', sky: ['#1c0505', '#6b1208', '#e64a19', '#ff9a3c'], far: '#3a130f', farSnow: '#ff6a2a', mid: '#280c09', midDark: '#140403', grass: '#4a1410', grassDark: '#ff5722', dirt: '#240806', dirtDark: '#0e0302', deco: 'volcano' }
];

/* =====================================================================
   LEVELS (64 Handcrafted Campaign Milestones & 16-Archetype Endless Engine)
   ===================================================================== */
const LEVELS = [
  /* ===================================================================
     🌲 REALM 1: FOREST (Levels 1 - 16) · Oak Timber & Verdant Ridges
     =================================================================== */
  // Level 1: First Shot - Basic wooden tower
  { w: 0, ammo: ['rock', 'rock', 'rock'], build(b) { b.fort(15, 0, [{ w: 2.4, h: 1.3, in: 'e' }], 'e'); } },
  // Level 2: Double Perch - Two wooden towers & cake reward
  { w: 0, ammo: ['rock', 'rock', 'rock'], build(b) { b.fort(13.5, 0, [{ w: 2.2, h: 1.3, in: 'e' }]); b.fort(17.5, 0, [{ w: 2.2, h: 1.3, in: 'cake' }, { w: 2.2, h: 1.2, in: 'e' }]); } },
  // Level 3: TNT Chain Reaction
  { w: 0, ammo: ['rock', 'bomb', 'rock'], build(b) { b.fort(16, 0, [{ w: 3.4, h: 1.3, in: ['e', 'tnt', 'e'], mid: true, mat: 'wood' }, { w: 2.4, h: 1.2, in: 'e' }], 'gem'); } },
  // Level 4: Raised Ridge - Stone foundation on elevated terrain
  { w: 0, ammo: ['rock', 'rock', 'bomb'], build(b) { b.ground(14, 20, 1.4); b.fort(16, 1.4, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone', beam: 'wood' }]); b.fort(18.8, 1.4, [{ w: 2, h: 1.3, in: 'e' }, { w: 2, h: 1.1, in: 'cake' }]); } },
  // Level 5: Pyramid of Oak
  { w: 0, ammo: ['bomb', 'rock', 'rock', 'rock'], build(b) { b.pyramid('wood', 16.5, 0, 5, 0.75, ['e', 'e', 'e']); b.item('cake', 16.5, 3.75); } },
  // Level 6: Ice Shuriken Slice - Fragile ice pillars
  { w: 0, ammo: ['bomb', 'rock', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2, h: 1.3, in: 'e', mat: 'ice' }, { w: 2, h: 1.2, in: 'e', mat: 'ice' }]); b.fort(17.5, 0, [{ w: 2, h: 1.3, in: 'gem', mat: 'ice' }, { w: 2, h: 1.2, in: 'e', mat: 'ice' }], 'e'); } },
  // Level 7: Airborne Balloon Nest
  { w: 0, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.4, h: 1.3, in: 'e' }]); b.balloonPlat(19, 5.6, 2.4, 'wood', 1.6, ['e']); b.fort(19, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }]); } },
  // Level 8: Woodland Bastion - Wide 3-tier fort
  { w: 0, ammo: ['rock', 'bomb', 'bomb', 'rock'], build(b) { b.ground(13.5, 21.5, 0.8); b.fort(17.5, 0.8, [{ w: 4.6, h: 1.3, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 3.4, h: 1.3, in: ['e', 'gem'], mid: true }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'cake'); } },
  // Level 9: Twin Treehouses - Two high watchtowers connected by crossbeam
  { w: 0, ammo: ['bomb', 'bomb', 'rock'], build(b) { const t1 = b.fort(14, 0, [{ w: 2.0, h: 1.5, in: 'e', mat: 'wood' }, { w: 2.0, h: 1.3, in: 'tnt', mat: 'wood' }]); const t2 = b.fort(20, 0, [{ w: 2.0, h: 1.5, in: 'h', mat: 'wood' }, { w: 2.0, h: 1.3, in: 'cake', mat: 'ice' }]); const by = Math.min(t1, t2) - 0.15; b.beam('wood', 13.5, 20.5, by, 0.3); b.enemy(17, by + 0.3); b.item('gem', 17, by + 1.1); } },
  // Level 10: Timber Viaduct - High bridge with rolling boulder
  { w: 0, ammo: ['missile', 'rock', 'bomb'], build(b) { b.ground(13, 21, 1.0); b.col('stone', 14.5, 1.0, 2.8, 0.5); b.col('stone', 19.5, 1.0, 2.8, 0.5); b.beam('wood', 13.8, 20.2, 3.8, 0.35); b.enemy(17, 3.8 + 0.35, true); b.boulder(15.2, 4.15, 0.5); b.fort(17, 1.0, [{ w: 2.4, h: 1.3, in: ['e', 'tnt'], mid: true, mat: 'wood' }], 'cake'); } },
  // Level 11: Rolling Oak Run - Angled boulder atop roof
  { w: 0, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.2, in: 'tnt', mat: 'wood' }]); b.fort(19.5, 0, [{ w: 3.0, h: 1.3, in: ['e', 'cake'], mid: true, mat: 'wood' }]); b.boulder(14, 2.6, 0.55); } },
  // Level 12: Triple Canopy Nests - Staggered balloon platforms
  { w: 0, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.balloonPlat(14, 4.8, 2.0, 'wood', 1.3, ['e']); b.balloonPlat(18, 6.2, 2.2, 'wood', 1.4, ['h', 'gem']); b.balloonPlat(22, 5.0, 2.0, 'ice', 1.3, ['e']); b.fort(18, 0, [{ w: 2.6, h: 1.2, in: 'tnt', mat: 'wood' }], 'cake'); } },
  // Level 13: Oak Citadel - Multi-room fortress
  { w: 0, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(13.5, 22.5, 0.6); b.fort(18, 0.6, [{ w: 5.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 3.6, h: 1.3, in: ['e', 'cake'], mid: true, mat: 'wood' }, { w: 2.0, h: 1.2, in: 'e', mat: 'ice' }], 'gem'); } },
  // Level 14: Drawbridge Keep - Twin towers with raised bridge
  { w: 0, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(12.5, 16, 1.2); b.fort(14.25, 1.2, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]); b.ground(19, 23.5, 2.2); b.fort(21.25, 2.2, [{ w: 2.4, h: 1.4, in: ['e', 'tnt'], mid: true, mat: 'wood' }, { w: 2.0, h: 1.2, in: 'h' }], 'cake'); } },
  // Level 15: Glacier Ridge - Ice & wood on high ridge
  { w: 0, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(14, 21, 1.6); b.fort(17.5, 1.6, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'wood' }], 'h'); b.boulder(20.5, 1.6, 0.55); } },
  // Level 16: FOREST BOSS KEEP - Chapter 1 Climax Fortress
  { w: 0, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'h', mat: 'wood' }], 'cake'); b.fort(20.5, 0.6, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'wood' }], 'e'); b.boulder(18.5, 0.6, 0.6); b.boulder(22.5, 0.6, 0.6); } },

  /* ===================================================================
     🏜️ REALM 2: CANYON (Levels 17 - 32) · Red Sandstone & Desert Mesas
     =================================================================== */
  // Level 17: Desert Ridge
  { w: 1, ammo: ['rock', 'bomb', 'rock'], build(b) { b.ground(14, 19, 1); b.fort(16.5, 1, [{ w: 3.6, h: 1.3, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone' }]); b.boulder(19.6, 0, 0.55); } },
  // Level 18: Chasm Jump
  { w: 1, ammo: ['missile', 'rock', 'missile'], build(b) { b.ground(11, 14, 1.2); b.fort(12.5, 1.2, [{ w: 2, h: 1.2, in: 'e' }]); b.ground(24, 29, 3.2); b.fort(26.5, 3.2, [{ w: 2.6, h: 1.3, in: 'h', mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.1, in: 'gem' }], 'e'); } },
  // Level 19: Terracotta Arch
  { w: 1, ammo: ['bomb', 'bomb', 'rock'], build(b) { const t1 = b.fort(14, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'stone' }, { w: 1.8, h: 1.4, in: 'cake' }]); b.fort(20, 0, [{ w: 1.8, h: 1.6, in: 'e', mat: 'stone' }, { w: 1.8, h: 1.4, in: 'tnt' }]); b.beam('wood', 13.1, 20.9, t1); b.enemy(17, t1 + 0.3, true); b.enemy(15.8, t1 + 0.3); } },
  // Level 20: Desert Zeppelins
  { w: 1, ammo: ['rock', 'missile', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.balloonPlat(18, 5.2, 2.2, 'wood', 1.4, ['e']); b.balloonPlat(22.5, 6.4, 2.2, 'ice', 1.6, ['e', 'gem']); } },
  // Level 21: Sandstone Bunker
  { w: 1, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.ground(14, 22, 0.6); b.fort(18, 0.6, [{ w: 5, h: 1.4, in: ['e', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.3, in: ['cake', 'e'], mid: true, mat: 'wood' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'e'); } },
  // Level 22: Triple Dynamite Pillars
  { w: 1, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.fort(14.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }, { w: 2.2, h: 1.2, in: 'e', mat: 'stone' }]); b.fort(18, 0, [{ w: 2.2, h: 1.2, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.2, in: 'tnt' }]); b.fort(21.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt' }, { w: 2.2, h: 1.2, in: 'e', mat: 'stone' }], 'gem'); } },
  // Level 23: Ascending Mesas
  { w: 1, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(13, 16, 1); b.fort(14.5, 1, [{ w: 2, h: 1.3, in: 'e' }]); b.ground(18, 21.5, 2.2); b.fort(19.75, 2.2, [{ w: 2.2, h: 1.3, in: 'h', mat: 'ice' }, { w: 2.2, h: 1.1, in: 'cake', mat: 'ice' }]); b.ground(23.5, 27, 3.4); b.fort(25.25, 3.4, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); } },
  // Level 24: Redrock Fortress
  { w: 1, ammo: ['rock', 'bomb', 'missile', 'bomb'], build(b) { b.ground(13, 25, 0.5); b.fort(16, 0.5, [{ w: 3.4, h: 1.4, in: ['h', 'e'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'tnt' }], 'e'); b.fort(22, 0.5, [{ w: 3.4, h: 1.4, in: ['e', 'gem'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'wood' }], 'cake'); b.boulder(19, 0.5, 0.5); } },
  // Level 25: Quarry Vault - Heavy sandstone bunker with narrow slit
  { w: 1, ammo: ['bomb', 'missile', 'rock'], build(b) { b.ground(14, 21, 1.2); b.fort(17.5, 1.2, [{ w: 4.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'stone' }], 'h'); b.boulder(20.5, 1.2, 0.6); } },
  // Level 26: Grand Viaduct - High sandstone aqueduct
  { w: 1, ammo: ['missile', 'bomb', 'rock', 'bomb'], build(b) { b.col('stone', 14, 0, 3.4, 0.6); b.col('stone', 19, 0, 3.4, 0.6); b.col('stone', 24, 0, 3.4, 0.6); b.beam('stone', 13.2, 24.8, 3.4, 0.4); b.enemy(16.5, 3.8, true); b.enemy(21.5, 3.8, true); b.boulder(14, 3.8, 0.55); b.fort(19, 0, [{ w: 2.4, h: 1.3, in: ['tnt', 'h'], mid: true, mat: 'wood' }], 'cake'); } },
  // Level 27: Sandstone Ziggurat - 5-level stepped pyramid
  { w: 1, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.pyramid('stone', 17.5, 0, 5, 0.78, ['h', 'tnt', 'h']); b.enemy(17.5, 4.0, true); b.item('gem', 17.5, 4.6); b.boulder(14.2, 0, 0.55); b.boulder(20.8, 0, 0.55); } },
  // Level 28: Twin Mesa Towers - Two high altitude sniper perches
  { w: 1, ammo: ['missile', 'missile', 'bomb', 'rock'], build(b) { b.ground(13, 17, 2.4); b.fort(15, 2.4, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.0, h: 1.2, in: 'cake' }], 'h'); b.ground(21, 26, 3.6); b.fort(23.5, 3.6, [{ w: 2.4, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 29: Gondola Aerial Trap - Floating platform over TNT
  { w: 1, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.balloonPlat(15, 6.0, 2.4, 'stone', 1.5, ['h']); b.balloonPlat(21, 6.8, 2.4, 'wood', 1.6, ['h', 'tnt']); b.fort(21, 0, [{ w: 3.4, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 30: Terracotta Colosseum - 3-tier castle
  { w: 1, ammo: ['bomb', 'bomb', 'missile', 'rock'], build(b) { b.ground(13.5, 24.5, 0.6); b.fort(19, 0.6, [{ w: 5.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'cake'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }], 'gem'); b.boulder(16.5, 0.6, 0.55); b.boulder(21.5, 0.6, 0.55); } },
  // Level 31: Canyon Snipers - Staggered long range redoubt
  { w: 1, ammo: ['missile', 'bomb', 'missile', 'rock'], build(b) { b.ground(12.5, 16.5, 1.4); b.fort(14.5, 1.4, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(18, 22.5, 2.8); b.fort(20.25, 2.8, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.1, in: 'gem' }]); b.ground(24, 28.5, 4.0); b.fort(26.25, 4.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 32: CANYON CITADEL BOSS - Chapter 2 Climax Fortress
  { w: 1, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); b.fort(20.5, 0.6, [{ w: 5.2, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.8, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.2, in: 'h' }], 'e'); b.boulder(18.5, 0.6, 0.65); b.boulder(22.5, 0.6, 0.65); } },

  /* ===================================================================
     ❄️ REALM 3: TUNDRA (Levels 33 - 48) · Nordic Slate & Sapphire Glaciers
     =================================================================== */
  // Level 33: Frozen Foundation
  { w: 2, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.fort(15, 0, [{ w: 3.6, h: 1.4, in: ['h', 'e'], mid: true, mat: 'ice' }, { w: 2.4, h: 1.3, in: 'gem', mat: 'ice' }], 'e'); b.fort(19.6, 0, [{ w: 2, h: 1.4, in: 'h', mat: 'ice' }]); } },
  // Level 34: Avalanche Slope
  { w: 2, ammo: ['rock', 'bomb', 'bomb'], build(b) { b.ground(14, 17.5, 3); b.boulder(16.9, 3, 0.6); b.boulder(15.5, 3, 0.5); b.fort(19.5, 0, [{ w: 2.8, h: 1.3, in: ['h', 'e'], mid: true, mat: 'ice' }]); b.fort(23, 0, [{ w: 2, h: 1.3, in: 'h', mat: 'wood' }], 'cake'); } },
  // Level 35: Permafrost Spire
  { w: 2, ammo: ['missile', 'bomb', 'rock'], build(b) { b.fort(17, 0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone', beam: 'ice' }, { w: 2.4, h: 1.3, in: 'tnt', mat: 'ice' }, { w: 2.4, h: 1.3, in: 'h', mat: 'ice' }, { w: 2.4, h: 1.2, in: 'gem', mat: 'ice' }], 'h'); } },
  // Level 36: Arctic Balloon Fleet
  { w: 2, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.balloonPlat(15.5, 5.2, 2.2, 'ice', 1.4, ['h']); b.balloonPlat(19.5, 6.6, 2.2, 'wood', 1.5, ['e', 'cake']); b.balloonPlat(23.5, 5.4, 2.2, 'ice', 1.4, ['h']); b.fort(19.5, 0, [{ w: 2.2, h: 1.2, in: 'tnt', mat: 'ice' }]); } },
  // Level 37: Glacial Step
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(13, 0, [{ w: 2, h: 1.3, in: 'h', mat: 'ice' }]); b.ground(18.5, 21.5, 1.6); b.fort(20, 1.6, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone', beam: 'ice' }, { w: 2.2, h: 1.1, in: 'gem', mat: 'ice' }]); b.fort(27, 0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'ice' }]); } },
  // Level 38: Ice Palace
  { w: 2, ammo: ['rock', 'rock', 'bomb'], build(b) { b.ground(14, 23, 0.7); b.fort(18.5, 0.7, [{ w: 5.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'gem', mat: 'ice' }], 'e'); } },
  // Level 39: Subzero Zeppelin
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(14.5, 0, [{ w: 2.2, h: 1.3, in: 'tnt', mat: 'ice' }, { w: 2.2, h: 1.2, in: 'h', mat: 'ice' }]); b.balloonPlat(19, 6, 2.4, 'stone', 1.5, ['e', 'tnt']); b.fort(23.5, 0, [{ w: 2.2, h: 1.3, in: 'e', mat: 'stone' }, { w: 2.2, h: 1.2, in: 'cake', mat: 'ice' }], 'h'); } },
  // Level 40: Frostbite Bastion
  { w: 2, ammo: ['rock', 'bomb', 'bomb', 'missile'], build(b) { b.ground(13, 27, 0.6); b.fort(16, 0.6, [{ w: 3.4, h: 1.4, in: ['e', 'tnt'], mid: true, mat: 'stone', beam: 'ice' }, { w: 2.2, h: 1.3, in: 'h', mat: 'ice' }], 'gem'); b.fort(21, 0.6, [{ w: 4.2, h: 1.5, in: ['h', 'h', 'tnt'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.4, in: ['e', 'cake'], mid: true, mat: 'wood' }, { w: 2.2, h: 1.2, in: 'e', mat: 'ice' }], 'h'); b.fort(25.5, 0.6, [{ w: 2, h: 1.4, in: 'h', mat: 'ice' }]); } },
  // Level 41: Sapphire Ziggurat - Solid ice pyramid
  { w: 2, ammo: ['bomb', 'bomb', 'missile'], build(b) { b.pyramid('ice', 17.5, 0, 5, 0.8, ['h', 'tnt', 'h']); b.enemy(17.5, 4.2, true); b.item('gem', 17.5, 4.8); b.fort(13, 0, [{ w: 2.0, h: 1.3, in: 'h', mat: 'stone' }]); b.fort(22, 0, [{ w: 2.0, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 42: Frozen Aqueduct
  { w: 2, ammo: ['missile', 'bomb', 'rock', 'bomb'], build(b) { b.col('ice', 14, 0, 3.6, 0.5); b.col('stone', 19, 0, 3.6, 0.6); b.col('ice', 24, 0, 3.6, 0.5); b.beam('stone', 13.2, 24.8, 3.6, 0.4); b.boulder(16.5, 4.0, 0.6); b.boulder(21.5, 4.0, 0.6); b.enemy(19, 4.0, true); b.fort(19, 0, [{ w: 2.6, h: 1.3, in: ['tnt', 'h'], mid: true, mat: 'ice' }], 'cake'); } },
  // Level 43: Glacier Vault
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.ground(14, 21, 1.0); b.fort(17.5, 1.0, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'gem'); b.boulder(20.5, 1.0, 0.55); } },
  // Level 44: Twin Ice Spires
  { w: 2, ammo: ['bomb', 'bomb', 'bomb', 'missile'], build(b) { b.fort(14, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'ice' }, { w: 1.8, h: 1.4, in: 'tnt', mat: 'ice' }, { w: 1.8, h: 1.2, in: 'h', mat: 'ice' }]); b.fort(21, 0, [{ w: 1.8, h: 1.6, in: 'h', mat: 'ice' }, { w: 1.8, h: 1.4, in: 'gem', mat: 'ice' }, { w: 1.8, h: 1.2, in: 'h', mat: 'ice' }]); b.balloonPlat(17.5, 6.2, 2.2, 'ice', 1.4, ['h', 'cake']); } },
  // Level 45: Snowy Crags - 3 tiered slate pillboxes
  { w: 2, ammo: ['missile', 'bomb', 'bomb', 'rock'], build(b) { b.ground(12, 16, 1.2); b.fort(14, 1.2, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(17.5, 22, 2.6); b.fort(19.75, 2.6, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice' }, { w: 2.0, h: 1.1, in: 'gem' }]); b.ground(23.5, 28, 4.0); b.fort(25.75, 4.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 46: Permafrost Pendulum
  { w: 2, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.balloonPlat(15, 6.2, 2.4, 'ice', 1.5, ['h', 'tnt']); b.balloonPlat(21, 6.6, 2.4, 'stone', 1.6, ['h', 'gem']); b.fort(18, 0, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'ice' }], 'cake'); } },
  // Level 47: Blizzard Fortress
  { w: 2, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.ground(13.5, 25.5, 0.8); b.fort(16, 0.8, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.2, h: 1.2, in: 'h', mat: 'stone' }], 'cake'); b.fort(21, 0.8, [{ w: 4.6, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'ice', beam: 'stone' }], 'gem'); b.boulder(18.5, 0.8, 0.6); } },
  // Level 48: TUNDRA FROST CITADEL BOSS - Chapter 3 Climax Fortress
  { w: 2, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 27, 0.6); b.fort(15, 0.6, [{ w: 3.0, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'ice' }], 'cake'); b.fort(20, 0.6, [{ w: 5.4, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.8, h: 1.4, in: ['h', 'h'], mid: true, mat: 'ice', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(25, 0.6, [{ w: 3.0, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'ice' }, { w: 2.2, h: 1.2, in: 'h', mat: 'stone' }], 'e'); b.balloonPlat(20, 7.0, 2.4, 'ice', 1.5, ['h', 'gem']); b.boulder(17.5, 0.6, 0.65); b.boulder(22.5, 0.6, 0.65); } },

  /* ===================================================================
     🌋 REALM 4: VOLCANO (Levels 49 - 64) · Basalt Magma Rock & Obsidian Citadel
     =================================================================== */
  // Level 49: Magma Ridge
  { w: 3, ammo: ['bomb', 'rock', 'missile'], build(b) { b.ground(14, 21, 1.2); b.fort(17.5, 1.2, [{ w: 3.8, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'cake', mat: 'wood' }], 'h'); b.boulder(20.5, 1.2, 0.6); } },
  // Level 50: Molten Chasm
  { w: 3, ammo: ['missile', 'bomb', 'rock'], build(b) { b.ground(12, 16, 1.5); b.fort(14, 1.5, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }]); b.ground(21, 28, 2.8); b.fort(24.5, 2.8, [{ w: 4.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.6, h: 1.2, in: 'gem' }], 'h'); } },
  // Level 51: Basalt Bridge
  { w: 3, ammo: ['bomb', 'bomb', 'missile'], build(b) { const t1 = b.fort(14.5, 0, [{ w: 2.2, h: 1.6, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'tnt' }]); const t2 = b.fort(22.5, 0, [{ w: 2.2, h: 1.6, in: 'h', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'cake' }]); b.beam('stone', 13.5, 23.5, Math.min(t1, t2), 0.35); b.enemy(18.5, Math.min(t1, t2) + 0.35, true); b.item('gem', 18.5, Math.min(t1, t2) + 1.2); } },
  // Level 52: Flying Ash Armada
  { w: 3, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.balloonPlat(15, 5.8, 2.4, 'stone', 1.5, ['h']); b.balloonPlat(20, 6.8, 2.4, 'wood', 1.6, ['h', 'tnt']); b.balloonPlat(25, 5.4, 2.2, 'ice', 1.4, ['gem']); b.fort(20, 0, [{ w: 3.4, h: 1.3, in: ['h', 'h'], mid: true, mat: 'stone' }], 'cake'); } },
  // Level 53: Pyramid of Ash
  { w: 3, ammo: ['bomb', 'bomb', 'rock'], build(b) { b.pyramid('stone', 17.5, 0, 5, 0.8, ['h', 'tnt', 'h']); b.enemy(17.5, 4.2, true); b.item('gem', 17.5, 4.8); b.boulder(14.5, 0, 0.55); b.boulder(20.5, 0, 0.55); } },
  // Level 54: Caldera Steps
  { w: 3, ammo: ['missile', 'bomb', 'bomb'], build(b) { b.ground(13, 16.5, 1.8); b.fort(14.75, 1.8, [{ w: 2.2, h: 1.3, in: 'h', mat: 'wood' }]); b.ground(18.5, 22.5, 3.2); b.fort(20.5, 3.2, [{ w: 2.4, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'gem' }]); b.ground(24.5, 28.5, 1.0); b.fort(26.5, 1.0, [{ w: 2.4, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.2, in: 'cake', mat: 'wood' }], 'h'); } },
  // Level 55: Magma Forge
  { w: 3, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.fort(14, 0, [{ w: 2.6, h: 1.4, in: ['tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.3, in: 'h', mat: 'stone' }]); b.balloonPlat(19.5, 6.2, 2.6, 'stone', 1.6, ['h', 'tnt']); b.fort(25, 0, [{ w: 2.6, h: 1.4, in: 'h', mat: 'stone' }, { w: 2.6, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'wood' }], 'cake'); b.boulder(19.5, 0, 0.7); } },
  // Level 56: Obsidian Colosseum
  { w: 3, ammo: ['rock', 'bomb', 'bomb', 'missile'], build(b) { b.ground(13, 27, 0.6); b.fort(15.5, 0.6, [{ w: 3.2, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone', beam: 'wood' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(20.5, 0.6, [{ w: 4.8, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.6, h: 1.4, in: ['h', 'cake'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'wood' }], 'gem'); b.fort(25.5, 0.6, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.2, in: 'cake' }], 'e'); b.boulder(18.5, 0.6, 0.6); b.boulder(22.5, 0.6, 0.6); } },
  // Level 57: Magma Vault - Heavy basalt bunker
  { w: 3, ammo: ['bomb', 'missile', 'bomb'], build(b) { b.ground(14, 21.5, 1.4); b.fort(17.75, 1.4, [{ w: 5.0, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.4, h: 1.3, in: ['h', 'gem'], mid: true, mat: 'stone' }], 'h'); b.boulder(14.8, 1.4, 0.65); b.boulder(20.6, 1.4, 0.65); } },
  // Level 58: Twin Basalt Spires
  { w: 3, ammo: ['missile', 'bomb', 'missile', 'rock'], build(b) { b.col('stone', 14.5, 0, 4.2, 0.65); b.col('stone', 21.5, 0, 4.2, 0.65); b.beam('stone', 13.6, 22.4, 4.2, 0.4); b.enemy(14.5, 4.6, true); b.enemy(21.5, 4.6, true); b.enemy(18, 4.6, true); b.boulder(18, 5.2, 0.6); b.fort(18, 0, [{ w: 2.8, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }], 'cake'); } },
  // Level 59: Caldera Viaduct
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.ground(13, 16.5, 1.0); b.col('stone', 14.75, 1.0, 3.2, 0.6); b.ground(21.5, 25, 1.0); b.col('stone', 23.25, 1.0, 3.2, 0.6); b.beam('stone', 14, 24, 4.2, 0.4); b.enemy(19, 4.6, true); b.boulder(16.5, 4.6, 0.55); b.boulder(21.5, 4.6, 0.55); b.fort(19, 0, [{ w: 3.2, h: 1.3, in: ['h', 'tnt'], mid: true, mat: 'stone' }], 'gem'); } },
  // Level 60: Obsidian Spire
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'rock'], build(b) { b.fort(17, 0, [{ w: 2.6, h: 1.5, in: 'h', mat: 'stone' }, { w: 2.4, h: 1.4, in: 'tnt', mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: 'ice' }], 'gem'); b.balloonPlat(13, 5.2, 2.0, 'stone', 1.4, ['h']); b.balloonPlat(21, 5.2, 2.0, 'stone', 1.4, ['h', 'cake']); } },
  // Level 61: Volcanic Trench
  { w: 3, ammo: ['bomb', 'bomb', 'missile', 'bomb'], build(b) { b.ground(13, 26, 0.8); b.fort(16, 0.8, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.2, in: 'h', mat: 'stone' }], 'cake'); b.fort(22.5, 0.8, [{ w: 4.2, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.6, h: 1.2, in: 'gem', mat: 'stone' }], 'h'); b.boulder(19.2, 0.8, 0.7); } },
  // Level 62: Ash Catapult
  { w: 3, ammo: ['missile', 'bomb', 'missile', 'bomb'], build(b) { b.ground(12.5, 17, 1.8); b.fort(14.75, 1.8, [{ w: 2.4, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }], 'h'); b.ground(19, 24, 3.4); b.fort(21.5, 3.4, [{ w: 3.2, h: 1.4, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }], 'gem'); b.ground(25.5, 29, 2.0); b.fort(27.25, 2.0, [{ w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); } },
  // Level 63: Molten Redoubt
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13.5, 26.5, 0.6); b.fort(16, 0.6, [{ w: 3.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 2.2, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(21.5, 0.6, [{ w: 4.8, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.2, h: 1.3, in: ['h', 'cake'], mid: true, mat: 'stone' }], 'h'); b.balloonPlat(21.5, 6.8, 2.4, 'stone', 1.5, ['h', 'gem']); b.boulder(18.5, 0.6, 0.65); } },
  // Level 64: THE VOLCANIC MEGA-CITADEL (FINAL CAMPAIGN BOSS)
  { w: 3, ammo: ['bomb', 'missile', 'bomb', 'bomb'], build(b) { b.ground(13, 28, 0.7); b.fort(15.5, 0.7, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'cake'); b.fort(20.5, 0.7, [{ w: 5.6, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 4.2, h: 1.5, in: ['h', 'h'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.8, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.fort(25.5, 0.7, [{ w: 3.6, h: 1.5, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.4, h: 1.3, in: 'h', mat: 'stone' }], 'gem'); b.balloonPlat(15.5, 6.8, 2.2, 'stone', 1.5, ['h']); b.balloonPlat(25.5, 6.8, 2.2, 'stone', 1.5, ['h']); b.boulder(18, 0.7, 0.7); b.boulder(23, 0.7, 0.7); } }
];

function obstaclesNow() {
  const list = [];
  for (const t of terrain) list.push((x, y) => x >= t.x0 && x <= t.x1 && y <= t.h);
  for (const e of ents) {
    if (e.kind !== 'block' && e.kind !== 'tnt' && e.kind !== 'item') continue;
    const p = e.body.getPosition(), a = e.body.getAngle(), c = Math.cos(a), s = Math.sin(a);
    if (e.round) list.push((x, y) => (x - p.x) ** 2 + (y - p.y) ** 2 <= e.r * e.r);
    else list.push((x, y) => {
      const dx = x - p.x, dy = y - p.y;
      return Math.abs(dx * c + dy * s) <= e.w / 2 && Math.abs(-dx * s + dy * c) <= e.h / 2;
    });
  }
  return list;
}
function shotClear(target, side = 0) {
  const obs = obstaclesNow();
  const tp = target.body.getPosition(), tr = target.r + 0.3;
  const dir = side ? -1 : 1, { x: restX, y: restY } = restPos(side), h = 1 / 30;
  for (let deg = 6; deg <= 84; deg += 6) {
    for (const m of [0.5, 0.85, 1.2, 1.5, 1.75]) {
      const th = deg * Math.PI / 180, ux = Math.cos(th) * dir, uy = Math.sin(th);
      let x = restX - ux * m, y = restY - uy * m;
      if (y < 0.75) continue;
      let vx = ux * m * LAUNCH_K, vy = uy * m * LAUNCH_K;
      for (let k = 0; k < 150; k++) {
        vy -= 10 * h;
        x += vx * h; y += vy * h;
        if (y < 0) break;
        if ((x - tp.x) ** 2 + (y - tp.y) ** 2 < tr * tr) return true;
        if (obs.some(o => o(x, y))) break;
      }
    }
  }
  return false;
}
function dropEnemy(e) {
  world.destroyBody(e.body);
  ents = ents.filter(x => x !== e);
}
function perchCandidates() {
  const structure = [], ground = [];
  for (const e of ents) {
    if (e.kind !== 'block' || e.round || Math.abs(e.body.getAngle()) > 0.1 || e.w < 0.6) continue;
    const p = e.body.getPosition(), top = p.y + e.h / 2;
    for (const f of [0.3, 0.7]) structure.push({ x: p.x - e.w / 2 + e.w * f, y: top });
  }
  for (const t of terrain) {
    if (t.h < 0.5 || t.x0 < 7) continue;
    const w = t.x1 - t.x0;
    if (w >= 1.2) for (const f of [0.3, 0.7]) structure.push({ x: t.x0 + w * f, y: t.h });
    for (const x of [t.x0 - 1.4, t.x1 + 1.4]) ground.push({ x, y: 0.05 });
  }
  return { structure, ground };
}
function pickPerch(perches, rng) {
  const pool = perches.structure.length && (rng() < 0.92 || !perches.ground.length) ? perches.structure : perches.ground;
  return pool.length ? pool[Math.floor(rng() * pool.length)] : null;
}
function pruneUnreachable() {
  const kept = [];
  for (const e of ents.filter(x => x.kind === 'enemy')) {
    const p = e.body.getPosition();
    const crowded = kept.some(o => Math.hypot(o.body.getPosition().x - p.x, o.body.getPosition().y - p.y) < 1.1);
    if (p.y < 0 || crowded || !shotClear(e)) dropEnemy(e);
    else kept.push(e);
  }
}
let procAttempt = 0;

/* ---------------- 16-Archetype Infinite Procedural Siege Engine ---------------- */
function generateProceduralLevel(idx) {
  const seed = stringSeed('fortress-proc-' + (idx + 1));
  let rng = mulberry32(seed);
  const worldIndex = (Math.floor(idx / 16)) % 4;
  const archetype = idx % 16;
  const endlessNum = idx >= 64 ? (idx - 63) : 1;
  const difficulty = idx >= 64 ? (1 + Math.floor(endlessNum / 3)) : (1 + Math.max(0, Math.floor((idx - 28) / 4)));
  const enemyCount = clamp(3 + Math.floor(difficulty * 0.45), 3, 10);
  const tough = clamp(0.2 + (difficulty - 1) / 14, 0.2, 0.95);
  const pick = () => (rng() < tough ? 'h' : 'e');

  const ammo = ['rock'];
  if (archetype === 0) ammo.push('bomb', 'rock', 'bomb');
  else if (archetype === 1) ammo.push('bomb', 'bomb', 'rock');
  else if (archetype === 2) ammo.push('bomb', 'missile', 'bomb');
  else if (archetype === 3) ammo.push('bomb', 'bomb', 'rock');
  else if (archetype === 4) ammo.push('rock', 'missile', 'bomb');
  else if (archetype === 5) ammo.push('missile', 'bomb', 'rock');
  else if (archetype === 6) ammo.push('bomb', 'bomb', 'missile', 'rock');
  else if (archetype === 7) ammo.push('rock', 'bomb', 'rock', 'bomb');
  else if (archetype === 8) ammo.push('bomb', 'missile', 'bomb');
  else if (archetype === 9) ammo.push('rock', 'bomb', 'rock', 'missile');
  else if (archetype === 10) ammo.push('bomb', 'bomb', 'missile');
  else if (archetype === 11) ammo.push('missile', 'bomb', 'bomb', 'rock');
  else if (archetype === 12) ammo.push('bomb', 'missile', 'bomb', 'bomb');
  else if (archetype === 13) ammo.push('bomb', 'bomb', 'missile', 'bomb');
  else if (archetype === 14) ammo.push('missile', 'missile', 'bomb', 'rock');
  else ammo.push('bomb', 'missile', 'bomb', 'bomb', 'rock');

  if (difficulty >= 3 && ammo.length < 4) ammo.push('rock');
  if (difficulty >= 6 && ammo.length < 4) ammo.push('bomb');
  if (difficulty >= 10 && ammo.length < 4) ammo.push('missile');

  return {
    w: worldIndex,
    procedural: true,
    levelNum: idx + 1,
    ammo: ammo.slice(0, 4),
    build(b) {
      rng = mulberry32(seed + procAttempt * 7919);
      const matMain = worldIndex === 2 ? 'ice' : worldIndex === 1 ? 'stone' : worldIndex === 3 ? 'stone' : 'wood';
      const matAlt = worldIndex === 2 ? 'stone' : worldIndex === 1 ? 'wood' : worldIndex === 3 ? 'ice' : 'stone';
      const center = 16.5 + (rng() - 0.5) * 2.2;
      let left = enemyCount;
      const jit = () => (rng() - 0.5) * 0.25;

      if (archetype === 0) {
        // Twin Citadel & High Drawbridge
        const h1 = b.fort(center - 3.2, 0, [{ w: 2.2 + jit(), h: 1.4, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'tnt', mat: matAlt }], pick());
        const h2 = b.fort(center + 3.2, 0, [{ w: 2.2 + jit(), h: 1.4, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'cake', mat: matAlt }], pick());
        const bridgeY = Math.min(h1, h2);
        b.beam(matMain, center - 3.2, center + 3.2, bridgeY, 0.35);
        b.enemy(center, bridgeY + 0.35, true);
        b.item('gem', center, bridgeY + 1.15);
      } else if (archetype === 1) {
        // Terraced Mountain Redoubt with Rolling Boulder
        b.ground(center - 4.0, center + 4.0, 1.0);
        b.fort(center, 1.0, [
          { w: 4.8 + jit(), h: 1.5, in: [pick(), 'tnt', pick()], mid: true, mat: 'stone' },
          { w: 3.4, h: 1.3, in: [pick(), 'cake'], mid: true, mat: matMain },
          { w: 2.2, h: 1.2, in: 'h', mat: matAlt }
        ], pick());
        b.boulder(center + 2.2, 1.0, 0.5);
        b.boulder(center - 2.2, 1.0, 0.5);
      } else if (archetype === 2) {
        // Airborne Zeppelin Bastions
        b.fort(center, 0, [{ w: 3.4, h: 1.4, in: [pick(), 'tnt'], mid: true, mat: matMain }], pick());
        b.balloonPlat(center - 3.0, 5.8, 2.2, matAlt, 1.4, [pick()]);
        b.balloonPlat(center + 3.0, 6.4, 2.2, matMain, 1.5, [pick(), 'gem']);
      } else if (archetype === 3) {
        // Ziggurat of Peril
        b.pyramid(matMain, center, 0, 5, 0.78, [pick(), 'tnt', pick()]);
        b.item('cake', center, 3.9);
        b.enemy(center, 4.3, true);
      } else if (archetype === 4) {
        // High Guard Columns & Heavy Spanning Truss
        b.ground(center - 1.8, center + 1.8, 1.8);
        const colTop = b.col('stone', center, 1.8, 3.2, 0.65);
        b.beam(matMain, center - 3.6, center + 3.6, colTop, 0.35);
        const beamTop = colTop + 0.35;
        b.enemy(center - 2.4, beamTop, rng() < tough);
        b.enemy(center + 2.4, beamTop, rng() < tough);
        b.enemy(center, beamTop, true);
        b.boulder(center - 3.0, beamTop, 0.45);
        b.boulder(center + 3.0, beamTop, 0.45);
      } else if (archetype === 5) {
        // Pillbox Bunker & Satellite Watchtower
        b.fort(center, 0, [
          { w: 4.4, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone', beam: 'wood' },
          { w: 3.0, h: 1.3, in: 'cake', mat: 'ice', beam: 'ice' }
        ], 'gem');
        b.fort(center + 4.5, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }]);
      } else if (archetype === 6) {
        // Triple Bastion Colosseum
        b.fort(center - 3.6, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }], pick());
        b.fort(center, 0, [{ w: 2.6, h: 1.4, in: ['tnt', pick()], mid: true, mat: 'stone' }], 'h');
        b.fort(center + 3.6, 0, [{ w: 2.2, h: 1.3, in: pick(), mat: matAlt }], 'cake');
      } else if (archetype === 7) {
        // Ascending Triple Staircase Plateau
        b.ground(center - 8.5, center - 5.0, 0.8);
        b.fort(center - 6.75, 0.8, [{ w: 2.2, h: 1.3, in: pick(), mat: matMain }]);
        b.ground(center - 2.8, center + 1.2, 2.0);
        b.fort(center - 0.8, 2.0, [{ w: 2.4, h: 1.4, in: [pick(), 'tnt'], mid: true, mat: matAlt }], pick());
        b.ground(center + 3.2, center + 7.5, 3.4);
        b.fort(center + 5.35, 3.4, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }], 'gem');
      } else if (archetype === 8) {
        // Twin Pyramids Flanking Boulder Chasm
        b.pyramid(matMain, center - 3.8, 0, 3, 0.72, [pick()]);
        b.pyramid(matAlt, center + 3.8, 0, 3, 0.72, [pick()]);
        b.boulder(center - 0.7, 0, 0.55);
        b.boulder(center + 0.7, 0, 0.55);
        b.item('cake', center, 1.2);
      } else if (archetype === 9) {
        // 4-Floor Skyscraper Spire
        b.fort(center, 0, [
          { w: 3.2, h: 1.4, in: pick(), mat: matMain },
          { w: 2.6, h: 1.3, in: 'tnt', mat: matAlt },
          { w: 2.0, h: 1.2, in: pick(), mat: matMain },
          { w: 1.6, h: 1.1, in: 'gem', mat: matAlt }
        ], 'h');
        b.boulder(center - 2.6, 0, 0.5);
        b.boulder(center + 2.6, 0, 0.5);
      } else if (archetype === 10) {
        // 3-Step Balloon Armada Climbing in Altitude
        b.balloonPlat(center - 3.6, 5.0, 2.0, matMain, 1.3, [pick()]);
        b.balloonPlat(center, 6.2, 2.2, matAlt, 1.4, [pick(), 'tnt']);
        b.balloonPlat(center + 3.6, 7.4, 2.0, matMain, 1.5, [pick(), 'gem']);
      } else if (archetype === 11) {
        // Wide Bridge with Centered Command Post
        const t1 = b.fort(center - 3.8, 0, [{ w: 2.2, h: 1.5, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: pick(), mat: matAlt }]);
        const t2 = b.fort(center + 3.8, 0, [{ w: 2.2, h: 1.5, in: pick(), mat: matMain }, { w: 2.2, h: 1.3, in: 'cake', mat: matAlt }]);
        const bridgeY = Math.min(t1, t2);
        b.beam('stone', center - 3.8, center + 3.8, bridgeY, 0.38);
        b.enemy(center, bridgeY + 0.38, true);
      } else if (archetype === 12) {
        // Honeycomb Labyrinth Citadel
        b.ground(center - 4.2, center + 4.2, 0.7);
        b.fort(center, 0.7, [
          { w: 5.2, h: 1.5, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' },
          { w: 3.8, h: 1.4, in: ['h', 'cake'], mid: true, mat: matMain, beam: 'stone' },
          { w: 2.4, h: 1.2, in: 'gem', mat: matAlt }
        ], 'h');
        b.boulder(center - 2.8, 0.7, 0.5);
        b.boulder(center + 2.8, 0.7, 0.5);
      } else if (archetype === 13) {
        // Suspended Pendulum Trap over Basalt Base
        b.fort(center - 3.2, 0, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]);
        b.fort(center + 3.2, 0, [{ w: 2.2, h: 1.4, in: 'h', mat: 'stone' }]);
        b.balloonPlat(center, 6.4, 2.4, matMain, 1.5, ['h', 'tnt']);
        b.item('gem', center, 0.4);
      } else if (archetype === 14) {
        // High Altitude Sniper Fortress & Boulder Launchpad
        b.ground(center - 4.5, center + 4.5, 2.4);
        b.fort(center, 2.4, [
          { w: 4.6, h: 1.5, in: ['h', 'tnt', 'h'], mat: 'stone' },
          { w: 2.8, h: 1.3, in: 'cake', mat: matMain }
        ], 'gem');
        b.boulder(center - 3.0, 2.4, 0.55);
        b.boulder(center + 3.0, 2.4, 0.55);
      } else {
        // The Boss Megafortress - Supreme 3-Tower Bastion
        b.ground(center - 5.5, center + 5.5, 0.8);
        b.fort(center - 3.6, 0.8, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: matAlt }], 'cake');
        b.fort(center, 0.8, [{ w: 4.8, h: 1.6, in: ['h', 'tnt', 'h'], mid: true, mat: 'stone' }, { w: 3.4, h: 1.4, in: ['h', 'gem'], mid: true, mat: 'stone', beam: 'stone' }, { w: 2.2, h: 1.2, in: 'h', mat: matMain }], 'gem');
        b.fort(center + 3.6, 0.8, [{ w: 2.6, h: 1.4, in: ['h', 'tnt'], mid: true, mat: 'stone' }, { w: 2.0, h: 1.2, in: 'h', mat: matAlt }], 'h');
        b.boulder(center - 1.8, 0.8, 0.55);
        b.boulder(center + 1.8, 0.8, 0.55);
      }
    }
  };
}

function getLevel(idx) {
  if (idx < LEVELS.length) return LEVELS[idx];
  return generateProceduralLevel(idx);
}

const TUT = { 1: 'DRAG BACK & RELEASE!' };

/* =====================================================================
   CANVAS
   ===================================================================== */
const cv = $('c'); let ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.25);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  fitCamera(true);
  buildVignette();
  if (typeof checkRotate === 'function') checkRotate();
}

/* ---------------- procedural material patterns ---------------- */
const PX = 64;
function makePat(draw) { const c = document.createElement('canvas'); c.width = c.height = 128; draw(c.getContext('2d'), 128); return ctx.createPattern(c, 'repeat'); }

function getThemeIndex() {
  if (typeof G !== 'undefined' && G && G.theme) {
    const idx = THEMES.indexOf(G.theme);
    if (idx >= 0) return idx;
  }
  if (typeof G !== 'undefined' && typeof G.levelIdx === 'number' && G.levelIdx < 64) {
    return Math.floor(G.levelIdx / 16);
  }
  return 0;
}

const THEME_OUTL = [
  { wood: '#6b3d17', stone: '#4c535b', ice: '#4d98c2' }, // 0: Forest
  { wood: '#6d2e0a', stone: '#5c2410', ice: '#8c4e20' }, // 1: Canyon
  { wood: '#4a3e35', stone: '#344757', ice: '#18749e' }, // 2: Tundra
  { wood: '#3c1812', stone: '#240a08', ice: '#421622' }  // 3: Volcano
];

const THEME_PAT = [
  // 0: FOREST (Lush golden-oak timber, mossy cobblestone, turquoise glacier)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(7); g.fillStyle = '#c98a4b'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(122,74,34,.35)' : 'rgba(240,190,120,.35)';
        g.lineWidth = 1 + r() * 1.6; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.5);
        g.stroke();
      }
      for (let k = 0; k < 2; k++) {
        const x = r() * s, y = r() * s;
        g.strokeStyle = 'rgba(100,55,20,.55)'; g.lineWidth = 1.5;
        g.beginPath(); g.ellipse(x, y, 5, 2.5, 0, 0, 6.28); g.stroke();
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(11); g.fillStyle = '#9aa4ae'; g.fillRect(0, 0, s, s);
      for (let k = 0; k < 40; k++) {
        const x = r() * s, y = r() * s, rr = 4 + r() * 14;
        g.fillStyle = r() < 0.4 ? 'rgba(255,255,255,.08)' : r() < 0.8 ? 'rgba(40,50,60,.09)' : 'rgba(90,140,50,.14)';
        g.beginPath(); g.arc(x, y, rr, 0, 6.28); g.fill();
      }
      for (let k = 0; k < 150; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(60,66,74,.35)' : 'rgba(230,236,240,.35)';
        g.fillRect(r() * s, r() * s, 1.5, 1.5);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#dff6ff'); gr.addColorStop(0.5, '#aee2fa'); gr.addColorStop(1, '#c9eefe');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
      g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.2;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48 + 12, s); g.lineTo(k * 48 + 12 + s, 0); g.stroke(); }
    })
  },

  // 1: CANYON (Sunbaked desert cedar, terracotta red sandstone, sun-glassed amber quartz)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(19); g.fillStyle = '#d68344'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 4.5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(145,55,18,.42)' : 'rgba(255,185,120,.38)';
        g.lineWidth = 1 + r() * 1.7; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.06 + y) * 1.8);
        g.stroke();
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(23); g.fillStyle = '#b85c36'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 4 + r() * 6) {
        g.fillStyle = r() < 0.5 ? 'rgba(240,140,90,.22)' : 'rgba(100,35,15,.28)';
        g.fillRect(0, y, s, 2 + r() * 4);
      }
      for (let k = 0; k < 120; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(75,25,10,.35)' : 'rgba(255,200,160,.28)';
        g.fillRect(r() * s, r() * s, 1.6, 1.6);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#fffae8'); gr.addColorStop(0.5, '#f7cca0'); gr.addColorStop(1, '#e89e68');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2.8;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
    })
  },

  // 2: TUNDRA (Frosted Nordic birch, frostbitten slate, deep sapphire ice)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(31); g.fillStyle = '#c5b7a5'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3 + r() * 5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(80,68,58,.36)' : 'rgba(245,238,228,.48)';
        g.lineWidth = 1 + r() * 1.5; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.2);
        g.stroke();
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(41); g.fillStyle = '#7a91a6'; g.fillRect(0, 0, s, s);
      for (let k = 0; k < 35; k++) {
        const x = r() * s, y = r() * s, rr = 4 + r() * 12;
        g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,.22)' : 'rgba(30,48,65,.2)';
        g.beginPath(); g.arc(x, y, rr, 0, 6.28); g.fill();
      }
      for (let k = 0; k < 140; k++) {
        g.fillStyle = r() < 0.5 ? 'rgba(35,50,65,.35)' : 'rgba(255,255,255,.55)';
        g.fillRect(r() * s, r() * s, 1.5, 1.5);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#d2f3ff'); gr.addColorStop(0.45, '#56bdf0'); gr.addColorStop(1, '#238ac9');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 3.2;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
    })
  },

  // 3: VOLCANO (Clean charred timber, basalt rock with subtle warm grain, dark obsidian)
  {
    wood: makePat((g, s) => {
      const r = mulberry32(53);
      g.fillStyle = '#281c1a'; g.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 4 + r() * 5) {
        g.strokeStyle = r() < 0.5 ? 'rgba(15,8,7,.6)' : 'rgba(230,90,30,.4)';
        g.lineWidth = 1 + r() * 1.4; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= s; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 1.4);
        g.stroke();
      }
      for (let k = 0; k < 40; k++) {
        g.fillStyle = r() < 0.4 ? 'rgba(230,95,30,.5)' : 'rgba(12,6,5,.5)';
        g.fillRect(r() * s, r() * s, 1.5, 1.5);
      }
    }),
    stone: makePat((g, s) => {
      const r = mulberry32(67);
      g.fillStyle = '#1e1616'; g.fillRect(0, 0, s, s);
      for (let k = 0; k < 30; k++) {
        const x = r() * s, y = r() * s, rr = 5 + r() * 12;
        g.fillStyle = r() < 0.4 ? 'rgba(200,50,15,.18)' : 'rgba(10,5,5,.4)';
        g.beginPath(); g.arc(x, y, rr, 0, 6.28); g.fill();
      }
      for (let k = 0; k < 5; k++) {
        let px = r() * s, py = r() * s;
        g.strokeStyle = r() < 0.5 ? 'rgba(255,100,25,.65)' : 'rgba(255,180,50,.55)';
        g.lineWidth = 1.2 + r() * 0.6;
        g.beginPath(); g.moveTo(px, py);
        for (let j = 0; j < 3; j++) { px += (r() - 0.5) * 26; py += (r() - 0.5) * 26; g.lineTo(px, py); }
        g.stroke();
      }
      for (let k = 0; k < 80; k++) {
        g.fillStyle = r() < 0.35 ? 'rgba(230,120,30,.45)' : 'rgba(10,5,5,.5)';
        g.fillRect(r() * s, r() * s, 1.5, 1.5);
      }
    }),
    ice: makePat((g, s) => {
      const gr = g.createLinearGradient(0, 0, s, s);
      gr.addColorStop(0, '#42161c'); gr.addColorStop(0.5, '#221226'); gr.addColorStop(1, '#0e0b16');
      g.fillStyle = gr; g.fillRect(0, 0, s, s);
      g.strokeStyle = 'rgba(255,120,45,.65)'; g.lineWidth = 2.2;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48, s); g.lineTo(k * 48 + s, 0); g.stroke(); }
      g.strokeStyle = 'rgba(255,200,80,.4)'; g.lineWidth = 1.1;
      for (let k = -2; k < 4; k++) { g.beginPath(); g.moveTo(k * 48 + 14, s); g.lineTo(k * 48 + 14 + s, 0); g.stroke(); }
    })
  }
];

const PAT = THEME_PAT[0];
const OUTL = THEME_OUTL[0];
function getOutl(mat) {
  const tIdx = getThemeIndex();
  return (THEME_OUTL[tIdx] && THEME_OUTL[tIdx][mat]) || THEME_OUTL[0][mat] || '#4c535b';
}

const _m = (typeof DOMMatrix !== 'undefined') ? new DOMMatrix() : null;
function patFor(mat, off) {
  const tIdx = getThemeIndex();
  const p = (THEME_PAT[tIdx] && THEME_PAT[tIdx][mat]) || THEME_PAT[0][mat] || THEME_PAT[0].wood;
  if (_m && p.setTransform) { const s = ppm / PX; p.setTransform(_m.translate(off * 37 % 128, off * 53 % 128).scale(s, s)); }
  return p;
}

/* =====================================================================
   WORLD / GAME STATE
   ===================================================================== */
let world = null, ents = [], terrain = [], parts = [], pops = [], trail = [], lastTrail = [], trailKind = 'rock', lastTrailKind = 'rock';
let ppm = 40, camL = -4, camTarget = -4, groundY = 0, shake = 0, fitsAll = true, userPan = 0;
const G = {
  mode: 'menu', state: 'menu', level: 0, levelIdx: 0, theme: THEMES[0], ammo: [], loaded: null, loadT: 1, proj: null, extras: [],
  score: 0, stars: [0, 0, 0], starsLit: 0, time: 0, stateT: 0, damageOn: false, maxX: 20, maxY: 6, aim: null, pouch: { x: 0, y: REST_Y }, pouchV: { x: 0, y: 0 },
  sling: [{ x: 0 }], moundH: MOUND_H, arenaW: 34, turn: 0, timeScale: 1, tsTarget: 1, realT: 0, slowEnd: 0, tapTut: null, pred: null, kb: null, pvpLeft: [0, 0], items: 0, rngDeco: 1, paused: false, lastPull: 0, pan: null, tut: false,
  dailyConfig: null, dailyNewBest: false, dailyReward: 0, dailyDay: '', impactCool: 0
};
let acc = 0, queue = { slow: [], expl: [] };
let lastImpactVibe = 0;

function aliveEnemies(team) { let n = 0; for (const e of ents) if (e.kind === 'enemy' && !e.dead && (team === undefined || e.team === team)) n++; return n; }

/* ---------------- construction kit ---------------- */
function kit() {
  const b = {
    ground(x0, x1, h) {
      const body = world.createBody({ type: 'static', position: Vec2((x0 + x1) / 2, h / 2) });
      body.createFixture(pl.Box((x1 - x0) / 2, h / 2), { friction: 0.9 });
      const t = { kind: 'terrain', x0: x0, x1: x1, h: h, body: body }; body.setUserData(t); terrain.push(t); return h;
    },
    box(mat, cx, y0, w, h, ang) {
      const m = MAT[mat];
      const body = world.createBody({ type: 'dynamic', position: Vec2(cx, y0 + h / 2), angle: ang || 0 });
      body.createFixture(pl.Box(w / 2, h / 2), { density: m.density, friction: m.friction, restitution: m.rest });
      const hp = m.hp * clamp(Math.sqrt((w * h) / 0.54), 0.6, 2.2);
      const e = { kind: 'block', mat: mat, w: w, h: h, hp: hp, maxHp: hp, body: body, seed: (Math.random() * 1e6) | 0, pts: m.pts };
      body.setUserData(e); ents.push(e); return y0 + h;
    },
    col(mat, x, y0, h, w) { return b.box(mat, x, y0, w || 0.3, h); },
    beam(mat, x0, x1, y0, h) { return b.box(mat, (x0 + x1) / 2, y0, x1 - x0, h || 0.3); },
    enemy(x, y0, helmet, r) {
      r = r || (helmet ? 0.36 : 0.34);
      const body = world.createBody({ type: 'dynamic', position: Vec2(x, y0 + r), angularDamping: 2.5 });
      body.createFixture(pl.Circle(r * 0.9), { density: 0.8, friction: 0.7, restitution: 0.2 });
      // Small overlapping face/ear fixtures keep the soft creature silhouette physical.
      body.createFixture(pl.Circle(r * 0.34, Vec2(0, -r * 0.34)), { density: 0.8, friction: 0.7, restitution: 0.2 });
      for (const side of [-1, 1]) body.createFixture(pl.Circle(r * 0.22, Vec2(side * r * 0.62, r * 0.6)), { density: 0.55, friction: 0.65, restitution: 0.15 });
      const e = { kind: 'enemy', r: r, hp: helmet ? 20 : 6, maxHp: helmet ? 20 : 6, helmet: !!helmet, body: body, blink: Math.random() * 4, team: 0, hurt: 0, bob: Math.random() * 6 };
      body.setUserData(e); ents.push(e); return y0 + 2 * r;
    },
    tnt(x, y0) {
      const s = 0.7, body = world.createBody({ type: 'dynamic', position: Vec2(x, y0 + s / 2) });
      body.createFixture(pl.Box(s / 2, s / 2), { density: 0.8, friction: 0.7, restitution: 0.05 });
      const e = { kind: 'tnt', w: s, h: s, hp: 6, maxHp: 6, body: body }; body.setUserData(e); ents.push(e); return y0 + s;
    },
    item(type, x, y0) {
      const w = type === 'cake' ? 0.62 : 0.5, h = type === 'cake' ? 0.46 : 0.5;
      const body = world.createBody({ type: 'dynamic', position: Vec2(x, y0 + h / 2) });
      body.createFixture(pl.Box(w / 2, h / 2), { density: 0.5, friction: 0.7, restitution: 0.1 });
      const e = { kind: 'item', type: type, w: w, h: h, hp: 3, maxHp: 3, body: body, tw: Math.random() * 6 }; body.setUserData(e); ents.push(e); return y0 + h;
    },
    boulder(x, y0, r) {
      const body = world.createBody({ type: 'dynamic', position: Vec2(x, y0 + r), angularDamping: 0.3 });
      body.createFixture(pl.Circle(r), { density: 2.2, friction: 0.8, restitution: 0.05 });
      const hp = 200 * r;
      const e = { kind: 'block', mat: 'stone', round: true, r: r, w: 2 * r, h: 2 * r, hp: hp, maxHp: hp, body: body, seed: (Math.random() * 1e6) | 0, pts: 400 };
      body.setUserData(e); ents.push(e); return y0 + 2 * r;
    },
    place(what, x, y, width) {
      if (Array.isArray(what)) { const n = what.length, span = Math.max(0, width - 1.1); what.forEach((w, k) => b.place(w, x - span / 2 + (n > 1 ? (span * k) / (n - 1) : span / 2), y)); return; }
      if (what === 'e') b.enemy(x, y); else if (what === 'h') b.enemy(x, y, true);
      else if (what === 'tnt') b.tnt(x, y); else if (what === 'cake' || what === 'gem') b.item(what, x, y);
    },
    fort(x, y0, floors, top) {
      let y = y0;
      for (const f of floors) {
        const m = f.mat || 'wood', bm = f.beam || m;
        b.col(m, x - f.w / 2 + 0.15, y, f.h); b.col(m, x + f.w / 2 - 0.15, y, f.h);
        if (f.mid && Array.isArray(f.in) && f.in.length > 1) {
          const n = f.in.length, inner = f.w - 0.3, cell = inner / n;
          for (let k = 1; k < n; k++) b.col(m, x - inner / 2 + cell * k, y, f.h, 0.24);
          f.in.forEach((w, k) => b.place(w, x - inner / 2 + cell * (k + 0.5), y));
        } else if (f.in) b.place(f.in, x, y, f.w - 0.3);
        y = b.beam(bm, x - f.w / 2, x + f.w / 2, y + f.h);
      }
      if (top) b.place(top, x, y, 1);
      return y;
    },
    pyramid(mat, x, y0, n, s, inside) {
      let k = 0;
      for (let row = 0; row < n; row++) {
        const cnt = n - row, x0 = x - ((cnt - 1) * s) / 2;
        for (let i = 0; i < cnt; i++) {
          const cx = x0 + i * s;
          if (row === 0 && inside && i % 2 === 1 && k < inside.length) { b.place(inside[k++], cx, y0); continue; }
          b.box(mat, cx, y0 + row * s, s * 0.98, s * 0.98);
        }
      }
      return y0 + n * s;
    },
    balloonPlat(x, y, w, mat, rope, stuff) {
      const m = MAT[mat], ph = 0.3, py = y - rope - 0.45;
      const plat = world.createBody({ type: 'dynamic', position: Vec2(x, py), angularDamping: 1.5 });
      plat.createFixture(pl.Box(w / 2, ph / 2), { density: m.density, friction: 0.9, restitution: 0.02 });
      const hp = m.hp * clamp(Math.sqrt((w * ph) / 0.54), 0.6, 2.2);
      const pe = { kind: 'block', mat: mat, w: w, h: ph, hp: hp, maxHp: hp, body: plat, seed: (Math.random() * 1e6) | 0, pts: m.pts };
      plat.setUserData(pe); ents.push(pe);
      const colors = ['#ef4b4b', '#3a8bf5', '#ffcc1f', '#9b59f0', '#35c46a'];
      for (const s of [-1, 1]) {
        const bx = x + s * (w / 2 - 0.25);
        const bal = world.createBody({ type: 'dynamic', position: Vec2(bx, y), gravityScale: 0, linearDamping: 3, angularDamping: 6, fixedRotation: true });
        bal.createFixture(pl.Circle(0.42), { density: 0.1, friction: 0.2, restitution: 0.3 });
        const be = { kind: 'balloon', r: 0.42, body: bal, anchor: { x: bx, y: y }, color: colors[(Math.random() * colors.length) | 0], plat: plat, off: s * (w / 2 - 0.25), hp: 1 };
        bal.setUserData(be); ents.push(be);
        world.createJoint(pl.RopeJoint({ maxLength: rope, localAnchorA: Vec2(0, -0.42), localAnchorB: Vec2(s * (w / 2 - 0.25), ph / 2), collideConnected: false }, bal, plat));
      }
      if (stuff) b.place(stuff, x, py + ph / 2, w - 0.4);
      return py + ph / 2;
    }
  };
  return b;
}

/* ---------------- world creation ---------------- */
function newWorld() {
  world = new pl.World({ gravity: Vec2(0, -10) });
  ents = []; terrain = []; parts = []; pops = []; trail = []; lastTrail = []; queue = { slow: [], expl: [] };
  G.ammoBonusTotal = 0;
  const g = world.createBody({ type: 'static', position: Vec2(20, -5) });
  g.createFixture(pl.Box(140, 5), { friction: 0.9 });
  g.setUserData({ kind: 'ground' });
  world.on('begin-contact', onBegin);
  world.on('pre-solve', (c) => {
    if (c._pass) { c.setEnabled(false); return; }
    const ea = c.getFixtureA().getBody().getUserData(), eb = c.getFixtureB().getBody().getUserData();
    if ((ea && ea.dead) || (eb && eb.dead)) c.setEnabled(false);
  });
}
function mound(x, h) {
  h = h || MOUND_H; G.moundH = h;
  const body = world.createBody({ type: 'static', position: Vec2(x, h / 2) });
  body.createFixture(pl.Box(1.3, h / 2), { friction: 0.9 });
  const t = { kind: 'terrain', x0: x - 1.3, x1: x + 1.3, h: h, body: body, mound: true }; body.setUserData(t); terrain.push(t);
}
function computeExtents() {
  let mx = 10, my = 5;
  for (const e of ents) {
    const p = e.body.getPosition(), ext = (e.w || 2 * (e.r || 0.3)) / 2 + 0.3;
    mx = Math.max(mx, p.x + ext); my = Math.max(my, p.y + (e.h || 2 * (e.r || 0.3)) / 2);
  }
  for (const t of terrain) { if (!t.mound) mx = Math.max(mx, t.x1); my = Math.max(my, t.h); }
  G.maxX = mx; G.maxY = my;
}

/* =====================================================================
   CONTACTS & DAMAGE
   ===================================================================== */
function slingBonus(mat) { if (G.mode === 'daily' || G.mode === 'pvp') return 1; const s = SLINGS.find((q) => q.id === save.sling) || SLINGS[0]; return (s.bonus && s.bonus[mat]) || 1; }
function onBegin(c) {
  const A = c.getFixtureA().getBody(), B = c.getFixtureB().getBody();
  const ea = A.getUserData(), eb = B.getUserData();
  if (!ea || !eb) return;
  const wm = c.getWorldManifold(null); if (!wm || !wm.pointCount) return;
  const p = wm.points[0], n = wm.normal;
  const va = A.getLinearVelocityFromWorldPoint(p), vb = B.getLinearVelocityFromWorldPoint(p);
  const vn = Math.abs((va.x - vb.x) * n.x + (va.y - vb.y) * n.y);
  if (ea.kind === 'proj') { if (!ea.hit) ea.hit = G.time; }
  if (eb.kind === 'proj') { if (!eb.hit) eb.hit = G.time; }
  const projectile = ea.kind === 'proj' ? ea : eb.kind === 'proj' ? eb : null;
  const target = projectile === ea ? eb : projectile === eb ? ea : null;
  if (projectile && target && target.body) {
    if (!projectile.hitCache) projectile.hitCache = new WeakMap();
    const prev = projectile.hitCache.get(target);
    if (prev !== undefined && G.time - prev < 0.1) return;
    projectile.hitCache.set(target, G.time);
  }
  if (ea.kind === 'balloon' || eb.kind === 'balloon') {
    const bal = ea.kind === 'balloon' ? ea : eb, other = bal === ea ? eb : ea;
    if (G.damageOn && (other.kind === 'proj' || vn > 1.2) && other.body !== bal.plat) bal.dead = true;
    return;
  }
  if (vn < 1.0 || !G.damageOn) return;
  shake = Math.max(shake, clamp(vn * 0.32, 1.5, 10));
  const mA = A.isDynamic() ? A.getMass() : 0, mB = B.isDynamic() ? B.getMass() : 0;
  const mRed = mA && mB ? (mA * mB) / (mA + mB) : mA || mB;
  const E = 0.5 * mRed * vn * vn;
  if (E > 22 && G.realT > G.impactCool && (ea.kind === 'proj' || eb.kind === 'proj' || ea.kind === 'tnt' || eb.kind === 'tnt')) {
    G.impactCool = G.realT + 0.34;
    G.tsTarget = 0.62; G.slowEnd = Math.max(G.slowEnd || 0, G.realT + 0.13);
    if (navigator.vibrate && G.realT - lastImpactVibe > 0.22) { try { navigator.vibrate(E > 85 ? 18 : 9); lastImpactVibe = G.realT; } catch (err) { /* haptics unavailable */ } }
  }
  const hpA = ea.hp, hpB = eb.hp;
  const dA = hitEntity(ea, E, eb, p), dB = hitEntity(eb, E, ea, p);
  if (eb.kind === 'proj' && ea.kind === 'block' && dA && ea.dead && dA > hpA * 1.3) { c._pass = true; queue.slow.push({ body: B, f: 1 - clamp(mA / (mA + mB), 0, 0.75) * 0.7 }); }
  if (ea.kind === 'proj' && eb.kind === 'block' && dB && eb.dead && dB > hpB * 1.3) { c._pass = true; queue.slow.push({ body: A, f: 1 - clamp(mB / (mA + mB), 0, 0.75) * 0.7 }); }
  if (E > 0.15) {
    const mat = ea.kind === 'block' ? ea.mat : eb.kind === 'block' ? eb.mat : (ea.kind === 'enemy' || eb.kind === 'enemy') ? 'enemy' : null;
    if (mat) audio.hit(mat, E);
    if (E > 4) { const col = ea.kind === 'block' ? MAT[ea.mat].chip : eb.kind === 'block' ? MAT[eb.mat].chip : ['#ddd', '#aaa']; for (let k = 0; k < Math.min(6, 1 + E / 10); k++) chip(p.x, p.y, col[(Math.random() * col.length) | 0], 0.6); }
  }
}
function hitEntity(e, E, other, contactPoint) {
  if (e.dead || e.hp === undefined) return 0;
  let dmg = 0;
  if (e.kind === 'block' || e.kind === 'debris') {
    // Convert impact energy into damage gradually; mass and speed already scale E.
    dmg = E * 1.12 * MAT[e.mat].resist;
    if (other.kind === 'proj') dmg *= PROJ[other.type].vs[e.mat] * slingBonus(e.mat);
    else dmg = E * 0.7 * MAT[e.mat].resist; /* falling beams chip, rather than vaporize, the structure */
  } else if (e.kind === 'enemy') { dmg = E * 16 * (e.helmet ? 0.55 : 1); if (dmg > 0.8) e.hurt = 0.6; }
  else if (e.kind === 'tnt' || e.kind === 'item') dmg = E * 10;
  else return 0;
  if (dmg < 0.4) return 0;
  damageEntity(e, dmg, other, contactPoint || e.body.getPosition());
  return dmg;
}
function damageEntity(e, dmg, other, pos) {
  if (dmg <= 0 || e.dead) return;
  if (e.kind === 'enemy') { e.hurt = Math.max(e.hurt || 0, 0.42); e.blink = -0.08; }
  const appliedDmg = Math.min(dmg, Math.max(0, e.hp));
  e.hp -= dmg;
  if (e.kind === 'block') {
    G.currentBlockHp = Math.max(0, (G.currentBlockHp || 0) - appliedDmg);
    updateDestructionMeter();
  }
  if ((e.kind === 'block' || e.kind === 'debris') && e.maxHp > 0 && e.pts > 0) {
    const target = Math.round(e.pts * (1 - Math.max(0, e.hp) / e.maxHp));
    const gain = Math.max(0, Math.min(e.pts, target) - (e.scoreGiven || 0));
    if (gain) {
      e.scoreGiven = (e.scoreGiven || 0) + gain;
      const pop = gain >= Math.max(90, e.pts * 0.13) || e.hp <= 0;
      addScore(gain, pop && pos ? pos.x : undefined, pop && pos ? pos.y : undefined, '#fff');
    }
  }
  if (e.hp <= 0) { e.breakAt = pos ? { x: pos.x, y: pos.y } : null; killEntity(e); }
}
function killEntity(e) {
  if (e.dead) return;
  e.dead = true;
  if (e.kind === 'enemy') {
    e.deathAge = 0; e.popReady = false;
    const remaining = aliveEnemies(e.team);
    if (remaining === 0 && (G.state === 'play' || G.state === 'turnwait')) {
      G.tsTarget = 0.32;
      G.slowEnd = Math.max(G.slowEnd || 0, G.realT + 0.75);
      shake = Math.max(shake, 10);
      if (navigator.vibrate) { try { navigator.vibrate([28, 45, 32]); } catch (err) {} }
    }
  }
}
function registerCombo(e, x, y) {
  if (G.mode !== 'campaign' && G.mode !== 'daily') return;
  if (G.realT <= (G.comboUntil || 0)) G.comboCount = (G.comboCount || 0) + 1;
  else G.comboCount = 1;
  G.comboUntil = G.realT + 1.25;
  if (G.comboCount >= 2) {
    const n = G.comboCount, bonus = Math.min(1000, (n - 1) * 200);
    addScore(bonus, x, y + 0.35, '#ffe36a', true);
    const titles = ['', '', 'DOUBLE STRIKE!', 'TRIPLE SMASH!', 'DEMOLITION!', 'WRECKING BALL!', 'UNSTOPPABLE!'];
    const label = n < titles.length ? titles[n] : 'SMASH ×' + n;
    popText(x, y + 0.95, label, n >= 4 ? '#ff7a3a' : '#ffd44f', true);
    spark(x, y + 0.5, 8, '#ffd25a');
  }
}

/* =====================================================================
   EFFECTS
   ===================================================================== */
function chip(x, y, col, sp) {
  if (parts.length > 700) return;
  const a = Math.random() * Math.PI * 2, s = (1 + Math.random() * 4) * (sp || 1);
  parts.push({ t: 'chip', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s + 2, life: 0, max: 0.8 + Math.random() * 0.8, c: col, s: 0.06 + Math.random() * 0.12, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 20 });
}
function puff(x, y, n, col, size, sp) {
  for (let k = 0; k < n; k++) {
    if (parts.length > 700) return;
    const a = Math.random() * Math.PI * 2, s = Math.random() * (sp || 1.5);
    parts.push({ t: 'puff', x: x + Math.cos(a) * 0.1, y: y + Math.sin(a) * 0.1, vx: Math.cos(a) * s, vy: Math.sin(a) * s + 0.3, life: 0, max: 0.5 + Math.random() * 0.5, c: col || '#fff', s: (size || 0.3) * (0.7 + Math.random() * 0.6) });
  }
}
function spark(x, y, n, col) {
  for (let k = 0; k < n; k++) { const a = Math.random() * 6.28, s = 3 + Math.random() * 6; parts.push({ t: 'spark', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 0.35 + Math.random() * 0.3, c: col || '#ffe36a', s: 0.06 }); }
}
function popText(x, y, text, col, big) { pops.push({ x: x, y: y, text: text, c: col || '#fff', t: 0, big: !!big }); }
function addScore(n, x, y, col, big) { if (G.mode !== 'campaign' && G.mode !== 'daily') return; G.score += n; if (x !== undefined) popText(x, y, String(n), col, big); updateHUDScore(); }

/* ---------------- explosions ---------------- */
function explode(x, y, R, power) {
  audio.boom(); shake = Math.max(shake, 14);
  parts.push({ t: 'flash', x: x, y: y, life: 0, max: 0.25, s: R * 0.9 });
  parts.push({ t: 'ring', x: x, y: y, life: 0, max: 0.45, s: R });
  for (let k = 0; k < 18; k++) { const a = Math.random() * 6.28, s = Math.random() * 3.5; parts.push({ t: 'fire', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s + 1, life: 0, max: 0.45 + Math.random() * 0.4, s: 0.35 + Math.random() * 0.5 }); }
  puff(x, y, 14, '#6f6a66', 0.55, 2.4);
  spark(x, y, 16, '#ffd25a');
  for (let b = world.getBodyList(); b; b = b.getNext()) {
    if (!b.isDynamic()) continue;
    const e = b.getUserData(); if (!e || e.dead) continue;
    const c = b.getWorldCenter(), dx = c.x - x, dy = c.y - y, d = Math.sqrt(dx * dx + dy * dy);
    if (d > R) continue;
    if (!blastVisible(x, y, b)) continue;
    const f = 1 - d / R, inv = d > 0.05 ? 1 / d : 0, m = b.getMass();
    const imp = power * f * Math.sqrt(clamp(m, 0.15, 3));
    b.applyLinearImpulse(Vec2(dx * inv * imp, (dy * inv + 0.35) * imp), c, true);
    b.applyAngularImpulse((gameRandom() - 0.5) * imp * 0.3, true);
    if (!G.damageOn) continue;
    if (e.kind === 'block' || e.kind === 'debris') damageEntity(e, power * 11 * Math.pow(f, 1.35) * MAT[e.mat].resist * slingBonus(e.mat), { kind: 'blast' }, c);
    else if (e.kind === 'enemy') { if (f > 0.12 || !e.helmet) damageEntity(e, power * 0.72 * Math.pow(f, 1.2) * (e.helmet ? 0.55 : 1), { kind: 'blast' }, c); }
    else if (e.kind === 'tnt' || e.kind === 'item') { e.hp = 0; e.dead = true; }
    else if (e.kind === 'balloon') e.dead = true;
  }
}
function blastVisible(x, y, targetBody) {
  let first = null;
  const target = targetBody.getWorldCenter();
  if (Math.hypot(target.x - x, target.y - y) < 0.08) return true;
  world.rayCast(Vec2(x, y), target, (fixture, point, normal, fraction) => {
    const body = fixture.getBody();
    if (body === targetBody) { first = body; return fraction; }
    const e = body.getUserData();
    if (!e || e.dead || e.kind === 'proj' || e.kind === 'balloon') return -1;
    first = body; return 0;
  });
  return first === targetBody;
}

/* ---------------- entity removal ---------------- */
function removeEntity(e) {
  if (e.removed) return;
  e.removed = true;
  const p = e.body.getPosition(), px = p.x, py = p.y;
  if (e.kind === 'block') spawnBlockDebris(e);
  world.destroyBody(e.body);
  if (e.kind === 'debris') {
    return;
  } else if (e.kind === 'block') {
    const m = MAT[e.mat], n = Math.round(clamp(e.w * e.h * 30, 6, 18));
    for (let k = 0; k < n; k++) chip(px + (Math.random() - 0.5) * e.w, py + (Math.random() - 0.5) * e.h, m.chip[(Math.random() * 3) | 0], 1);
    puff(px, py, 3, e.mat === 'ice' ? '#e8f8ff' : e.mat === 'stone' ? '#c9ccd0' : '#e6cfa8', 0.35, 1);
    audio.brk(e.mat);
    const rest = Math.max(0, e.pts - (e.scoreGiven || 0)); if (rest) addScore(rest, px, py, '#fff');
    registerCombo(e, px, py);
  } else if (e.kind === 'enemy') {
    const col = e.team === 1 ? '#ff8f8f' : e.team === 2 ? '#8fc0ff' : G.theme === THEMES[2] ? '#c9a6ff' : G.theme === THEMES[1] ? '#ffc07a' : '#9ae66a';
    puff(px, py, 12, col, 0.45, 2.2); puff(px, py, 5, '#ffffff', 0.35, 1.6); spark(px, py, 8, '#fff');
    audio.pop(); addScore(1000, px, py + 0.4, col, true); registerCombo(e, px, py + 0.4);
    if (G.mode === 'pvp') updatePvpHUD();
  } else if (e.kind === 'tnt') {
    for (let k = 0; k < 10; k++) chip(px, py, ['#d32f2f', '#8a1c1c', '#f2c14e'][k % 3], 1.6);
    queue.expl.push({ x: px, y: py, R: 3.4, P: 13 });
    addScore(500, px, py, '#ffd25a'); registerCombo(e, px, py);
  } else if (e.kind === 'item') {
    spark(px, py, 14, e.type === 'gem' ? '#8ff5ff' : '#ffd1e6'); puff(px, py, 5, '#fff', 0.3, 1.5);
    audio.chime(); G.items += e.type === 'gem' ? 5 : 3;
    addScore(e.type === 'gem' ? 800 : 1000, px, py + 0.3, e.type === 'gem' ? '#8ff5ff' : '#ff9ccf', true);
    registerCombo(e, px, py + 0.3);
  } else if (e.kind === 'balloon') {
    puff(px, py, 5, e.color, 0.25, 2); audio.balloon(); addScore(150, px, py, '#fff');
  } else if (e.kind === 'proj') { puff(px, py, 6, '#fff', 0.35, 1.2); }
}
function spawnBlockDebris(e) {
  const parent = e.body, p = parent.getPosition(), angle = parent.getAngle(), v = parent.getLinearVelocity();
  const live = ents.reduce((n, q) => n + (q.kind === 'debris' && !q.dead && !q.removed ? 1 : 0), 0);
  let made = 0;
  if (e.round) {
    const center = e.breakAt || p, count = Math.min(8, Math.max(0, 72 - live));
    for (let k = 0; k < count; k++) {
      const a = (k / count) * Math.PI * 2 + gameRandom() * 0.25, radius = e.r * (0.26 + gameRandom() * 0.13);
      const local = Vec2(Math.cos(a) * e.r * 0.48, Math.sin(a) * e.r * 0.48), pos = parent.getWorldPoint(local);
      const body = world.createBody({ type: 'dynamic', position: pos, angularDamping: 0.3 });
      body.createFixture(pl.Circle(radius), { density: MAT.stone.density * 0.9, friction: 0.78, restitution: 0.1 });
      const shard = { kind: 'debris', mat: 'stone', round: true, r: radius, w: radius * 2, h: radius * 2, hp: undefined, maxHp: 1, pts: 0, body: body, seed: e.seed + k * 41, age: 0, ttl: 2.6 + gameRandom() };
      body.setUserData(shard); ents.push(shard);
      const dx = pos.x - center.x, dy = pos.y - center.y, dl = Math.hypot(dx, dy) || 1, kick = 0.8 + gameRandom() * 1.2;
      body.setLinearVelocity(Vec2(v.x + dx / dl * kick, v.y + dy / dl * kick + 0.3));
      body.setAngularVelocity(parent.getAngularVelocity() + (gameRandom() - 0.5) * 9);
      made++;
    }
    return;
  }
  const cols = clamp(Math.ceil(e.w / 0.58), 2, 4), rows = clamp(Math.ceil(e.h / 0.48), 2, 3);
  const cw = e.w / cols, ch = e.h / rows, info = MAT[e.mat];
  const center = e.breakAt || p;
  const cap = Math.max(0, Math.min(cols * rows, 72 - live));
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    if (made >= cap) return;
    const lw = cw * 0.94, lh = ch * 0.93;
    const lx = -e.w / 2 + cw * (col + 0.5), ly = -e.h / 2 + ch * (row + 0.5);
    const pos = parent.getWorldPoint(Vec2(lx, ly));
    const body = world.createBody({ type: 'dynamic', position: pos, angle: angle, angularDamping: 0.35 });
    body.createFixture(pl.Box(lw / 2, lh / 2), { density: info.density * 0.92, friction: info.friction * 0.9, restitution: 0.08 });
    const shard = { kind: 'debris', mat: e.mat, w: lw, h: lh, hp: undefined, maxHp: 1, pts: 0, body: body, seed: e.seed + row * 17 + col * 31, age: 0, ttl: 2.4 + gameRandom() * 1.2 };
    body.setUserData(shard); ents.push(shard);
    const dx = pos.x - center.x, dy = pos.y - center.y, dl = Math.hypot(dx, dy) || 1;
    const kick = 0.7 + gameRandom() * 1.15;
    body.setLinearVelocity(Vec2(v.x + dx / dl * kick, v.y + dy / dl * kick + 0.35));
    body.setAngularVelocity(parent.getAngularVelocity() + (gameRandom() - 0.5) * 7);
    made++;
  }
}
function processDeaths() {
  const ready = (e) => e.dead && !e.removed && (e.kind !== 'enemy' || e.popReady);
  let guard = 0;
  do {
    for (const e of ents) if (ready(e)) removeEntity(e);
    const ex = queue.expl; queue.expl = [];
    for (const x of ex) explode(x.x, x.y, x.R, x.P);
    guard++;
  } while ((queue.expl.length || ents.some(ready)) && guard < 8);
  ents = ents.filter((e) => !e.removed);
}

/* =====================================================================
   PHYSICS STEP
   ===================================================================== */
function physicsStep() {
  for (const e of ents) {
    if (e.kind === 'balloon' && !e.dead) {
      const p = e.body.getPosition();
      e.body.applyForceToCenter(Vec2((e.anchor.x - p.x) * 70, (e.anchor.y - p.y) * 110 + 12 + Math.sin(G.time * 2 + e.anchor.x) * 0.6), true);
    } else if (e.kind === 'proj' && e.boost > 0) {
      e.boost -= STEP;
      e.body.setLinearVelocity(Vec2(e.dir.x * 30, e.dir.y * 30));
      if (e.boost <= 0) e.body.setGravityScale(1);
    }
  }
  world.step(STEP, 8, 3);
  for (const s of queue.slow) { const v = s.body.getLinearVelocity(); s.body.setLinearVelocity(Vec2(v.x * s.f, v.y * s.f)); }
  queue.slow.length = 0;
  for (const e of ents) {
    if (e.removed) continue;
    if (e.kind === 'enemy' && e.dead && !e.popReady) {
      e.deathAge = (e.deathAge || 0) + STEP;
      if (e.deathAge >= 0.28) e.popReady = true;
      if (!e.popReady) continue;
    }
    if (e.dead) continue;
    if (e.kind === 'debris') {
      e.age += STEP;
      const v = e.body.getLinearVelocity();
      if (e.age > e.ttl || (e.age > 1.7 && v.x * v.x + v.y * v.y < 0.025 && Math.abs(e.body.getAngularVelocity()) < 0.16)) e.dead = true;
    }
    // Every shot settles and despawns on its own now (not just the one G.proj is
    // currently tracking), which is what lets the player fire again immediately
    // instead of waiting for the previous shot to finish resolving.
    if (e.kind === 'proj' && projDone(e, STEP)) {
      e.doneT = (e.doneT || 0) + STEP;
      if (e.doneT > 0.5) e.dead = true;
    }
    const p = e.body.getPosition();
    if (p.y < -6 || p.x < -30 || p.x > G.maxX + 40) { if (e.kind === 'enemy' || e.kind === 'tnt' || e.kind === 'item' || e.kind === 'block' || e.kind === 'debris') killEntity(e); else if (e.kind === 'proj') e.done = true; }
    if (e.kind === 'proj' && e.type === 'bomb' && !e.used && e.hit && G.time - e.hit > 1.3) triggerAbility(e);
  }
  processDeaths();
}
// Runs the pre-level physics warmup, then forces every body to a dead stop.
// Without this, a fort that hasn't fully settled in `steps` ticks keeps
// visibly drifting/jittering into place after the player can already see
// and shoot at it, which reads as the structure being "broken" or "vague".
function settleWorld(steps) {
  G.damageOn = false;
  for (let k = 0; k < steps; k++) physicsStep();
  for (let bd = world.getBodyList(); bd; bd = bd.getNext()) {
    if (!bd.isDynamic()) continue;
    bd.setLinearVelocity(Vec2(0, 0));
    bd.setAngularVelocity(0);
  }
  parts = [];
  pops = [];
  queue.slow = [];
  queue.expl = [];
  for (const e of ents) {
    if (e.maxHp) e.hp = e.maxHp;
    if (e.hurt) e.hurt = 0;
    if (e.scoreGiven) e.scoreGiven = 0;
  }
}

/* =====================================================================
   SLINGSHOT, SHOTS & ABILITIES
   ===================================================================== */
function restPos(side) { const x = side === 1 ? G.arenaW : 0; return { x: x, y: G.moundH + REST_Y - MOUND_H }; }
function curSide() { return G.mode === 'pvp' ? G.turn : 0; }
function launch() {
  if (!G.loaded) { G.aim = null; return; }
  const side = curSide(), R = restPos(side), d = { x: G.pouch.x - R.x, y: G.pouch.y - R.y };
  const len = Math.hypot(d.x, d.y);
  if (len < 0.35) { G.aim = null; return; }
  const type = G.loaded, P = PROJ[type];
  const v = { x: -d.x * LAUNCH_K, y: -d.y * LAUNCH_K };
  const body = world.createBody({ type: 'dynamic', position: Vec2(G.pouch.x, G.pouch.y), angle: type === 'missile' ? Math.atan2(v.y, v.x) : 0, bullet: true, fixedRotation: type === 'missile', angularDamping: type === 'shuriken' ? 0.08 : 0.3 });
  if (type === 'shuriken') {
    body.createFixture(pl.Circle(P.r * 0.23), { density: P.density * 2.8, friction: 0.24, restitution: 0.08 });
    // Four convex steel blades on one spinning body give the shuriken a true cutting silhouette.
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
      const shape = pl.Polygon([[0.045,-0.043],[0.19,-0.071],[0.32,0],[0.19,0.071],[0.045,0.043]].map((p) => Vec2(p[0]*c-p[1]*s,p[0]*s+p[1]*c)));
      body.createFixture(shape, { density: P.density * 3.0, friction: 0.22, restitution: 0.12 });
    }
  } else if (type === 'missile') {
    const L = P.r * 2.6, r = P.r;
    body.createFixture(pl.Box(L * 0.27, r * 0.34, Vec2(-L * 0.04, 0)), { density: P.density, friction: 0.45, restitution: P.rest });
    body.createFixture(pl.Polygon([Vec2(L*.18,-r*.33),Vec2(L*.52,0),Vec2(L*.18,r*.33)]), { density: P.density * 0.65, friction: 0.42, restitution: P.rest });
    body.createFixture(pl.Polygon([Vec2(-L*.2,r*.24),Vec2(-L*.58,r*.7),Vec2(-L*.34,r*.2)]), { density: P.density * 0.4, friction: 0.45, restitution: P.rest });
    body.createFixture(pl.Polygon([Vec2(-L*.2,-r*.24),Vec2(-L*.34,-r*.2),Vec2(-L*.58,-r*.7)]), { density: P.density * 0.4, friction: 0.45, restitution: P.rest });
  } else body.createFixture(pl.Circle(P.r), { density: P.density, friction: 0.6, restitution: P.rest });
  body.setLinearVelocity(Vec2(v.x, v.y));
  body.setAngularVelocity(type === 'shuriken' ? -18 : type === 'missile' ? 0 : -v.x * 0.6);
  const e = { kind: 'proj', type: type, r: P.r, body: body, t: 0, used: type === 'rock', done: false, hit: 0, still: 0, boost: 0, dir: null };
  body.setUserData(e); ents.push(e);
  // The previous shot (if still flying/settling) is left to clean itself up generically
  // in physicsStep — it no longer has to finish before the player can fire again.
  G.proj = e; G.extras = []; G.loaded = null; G.aim = null; userPan = 0; G.afterShot = 0;
  lastTrail = trail; lastTrailKind = trailKind; trail = []; trailKind = type;
  G.pouchV = { x: -d.x * 22, y: -d.y * 22 };
  G.shots = (G.shots || 0) + 1;
  audio.launch();
  if (G.tut) { G.tut = false; $('hand').style.opacity = '0'; }
  const hint = P.hint; if (hint) showHint(hint); else showHint('');
}
function triggerAbility(e) {
  if (!e || e.used || e.done || e.removed) return;
  e.used = true; showHint('');
  if (G.mode === 'campaign' && !save.seenTap[e.type]) { save.seenTap[e.type] = true; persist(); }
  const p = e.body.getPosition(), v = e.body.getLinearVelocity();
  audio.ability();
  if (e.type === 'bomb') { e.dead = true; queue.expl.push({ x: p.x, y: p.y, R: 3.4, P: 12.5 }); processDeaths(); e.done = true; }
  else if (e.type === 'shuriken') {
    spark(p.x, p.y, 10, '#bff4ff');
    for (const a of [-0.22, 0.22]) {
      const c = Math.cos(a), s = Math.sin(a);
      const mv = { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
      const body = world.createBody({ type: 'dynamic', position: Vec2(p.x, p.y + a), angle: Math.atan2(mv.y, mv.x), bullet: true });
      body.createFixture(pl.Circle(PROJ.mini.r * 0.28), { density: PROJ.mini.density * 2.8, friction: 0.35, restitution: 0.1 });
      for (let z = 0; z < 4; z++) {
        const q = z * Math.PI / 2, cq = Math.cos(q), sq = Math.sin(q);
        const blade = pl.Polygon([[0.035,-0.033],[0.14,-0.055],[0.22,0],[0.14,0.055],[0.035,0.033]].map((pt) => Vec2(pt[0]*cq-pt[1]*sq,pt[0]*sq+pt[1]*cq)));
        body.createFixture(blade, { density: PROJ.mini.density * 3, friction: 0.3, restitution: 0.1 });
      }
      body.setLinearVelocity(Vec2(mv.x, mv.y)); body.setAngularVelocity(-20);
      const m = { kind: 'proj', type: 'mini', r: PROJ.mini.r, body: body, t: 0, used: true, done: false, hit: 0, still: 0, boost: 0 };
      body.setUserData(m); ents.push(m); G.extras.push(m);
    }
  } else if (e.type === 'missile') {
    const l = Math.hypot(v.x, v.y) || 1; e.dir = { x: v.x / l, y: v.y / l }; e.boost = 0.9; e.body.setGravityScale(0); audio.missile();
    puff(p.x, p.y, 6, '#ffffff', 0.35, 2);
  }
}
function projDone(e, dt) {
  if (!e || e.done || e.removed || e.dead) return true;
  e.t += dt;
  const v = e.body.getLinearVelocity(), sp = Math.hypot(v.x, v.y);
  if (e.hit && sp < 0.35) e.still += dt; else e.still = 0;
  if (e.still > 0.7 || e.t > 9 || (e.hit && e.t > 6.5)) e.done = true;
  return e.done;
}
function loadNext() {
  if (!G.ammo.length) return;
  G.loaded = G.ammo.shift();
  G.loadT = 0; audio.load();
  const R = restPos(curSide()); G.pouch = { x: R.x, y: R.y }; G.pouchV = { x: 0, y: 0 };
  const P = PROJ[G.loaded];
  if (P.hint && !G.tut) showHint(P.name + ' READY · ' + P.hint);
}
function clearShot() {
  const all = [G.proj].concat(G.extras);
  for (const e of all) if (e && !e.removed) { e.dead = true; }
  processDeaths();
  G.proj = null; G.extras = [];
}

/* =====================================================================
   CAMERA
   ===================================================================== */
function levelBounds() {
  if (G.mode === 'pvp') return { L: -3.2, R: G.arenaW + 3.2, T: Math.max(9, G.maxY + 3) };
  return { L: -3.6, R: G.maxX + 2.5, T: Math.max(8.5, G.maxY + 3, 6.6) };
}
function fitCamera(snap) {
  const isMobile = W < 768 || H < 520;
  const isPortrait = H > W;
  groundY = H * (isPortrait ? 0.78 : (isMobile ? 0.83 : 0.86));
  const topMargin = isMobile ? Math.max(48, H * 0.1) : Math.max(70, H * 0.13);
  const b = levelBounds(), fitW = W / (b.R - b.L), fitH = (groundY - topMargin) / b.T;
  const fit = Math.min(fitW, fitH);
  const minP = Math.min(W, H) / (G.mode === 'pvp' ? (isMobile ? 18 : 24) : (isPortrait ? 15 : (isMobile ? 18 : 21)));
  ppm = isPortrait ? Math.max(fit, minP) : fit;
  fitsAll = ppm <= fit + 0.05;
  camTarget = camFor('aim');
  if (snap) camL = camTarget;
}
function viewW() { return W / ppm; }
function camFor(kind) {
  const b = levelBounds(), vw = viewW();
  if (fitsAll) return b.L - (vw - (b.R - b.L)) / 2;
  const minL = b.L, maxL = b.R - vw;
  if (kind === 'end') return maxL;
  if (kind === 'aim') return G.mode === 'pvp' && G.turn === 1 ? maxL : minL;
  return clamp(kind, minL, maxL);
}
function updateCamera(dt) {
  let tgt = camFor('aim');
  const b = levelBounds(), vw = viewW();
  if (!fitsAll) {
    if (G.state === 'intro') {
      const u = clamp((G.stateT - 0.6) / 1.4, 0, 1);
      tgt = lerp(camFor('end'), camFor('aim'), easeInOut(u));
      camL = tgt;
    } else {
      const f = G.proj && !G.proj.done ? G.proj : G.extras.find((e) => !e.done && !e.removed);
      if (G.aim) {
        // While the player is pulling the slingshot, keep the aim anchor steady
        // so the slingshot never drifts or jitters under the finger!
        tgt = camFor('aim');
      } else if (f && !f.removed) {
        const x = f.body.getPosition().x;
        const vx = f.body.getLinearVelocity().x;
        tgt = camFor(x - vw * (vx >= 0 ? 0.36 : 0.64));
      } else if (userPan) {
        tgt = camFor(userPan);
      }
      const lerpSpeed = G.proj ? 7.2 : 5.8;
      camL += (tgt - camL) * (1 - Math.exp(-dt * lerpSpeed));
    }
  } else {
    camL = tgt;
  }
  camL = clamp(camL, b.L - vw, b.R);
}
function w2s(x, y) { return [(x - camL) * ppm, groundY - y * ppm]; }
function s2w(sx, sy) { return { x: sx / ppm + camL, y: (groundY - sy) / ppm }; }

/* =====================================================================
   PARALLAX BACKGROUND
   ===================================================================== */
let bg = null;
const CLOUD_CACHE = {};
function getCloudSprite(variant, isVolcano) {
  const key = `${variant}_${isVolcano ? 'v' : 'd'}`;
  if (CLOUD_CACHE[key]) return CLOUD_CACHE[key];
  const c = document.createElement('canvas');
  const w = 260, h = 140;
  c.width = w; c.height = h;
  const cx = c.getContext('2d');
  
  const shadowColor = isVolcano ? '#1e0c08' : '#d2e2f3';
  const bodyColor = isVolcano ? '#3c1813' : '#ffffff';
  const highlightColor = isVolcano ? '#54241d' : '#ffffff';

  const cloudShapes = [
    // 0: Classic 3-tier billowy cloud
    [
      { x: 130, y: 72, r: 38 },
      { x: 80, y: 84, r: 28 },
      { x: 180, y: 84, r: 28 },
      { x: 48, y: 94, r: 18 },
      { x: 212, y: 94, r: 18 },
      { x: 104, y: 54, r: 26 },
      { x: 154, y: 56, r: 24 },
      { x: 110, y: 94, r: 22 },
      { x: 150, y: 94, r: 22 }
    ],
    // 1: Wide sweeping cloud
    [
      { x: 105, y: 74, r: 34 },
      { x: 158, y: 70, r: 36 },
      { x: 60, y: 84, r: 24 },
      { x: 202, y: 82, r: 26 },
      { x: 30, y: 94, r: 16 },
      { x: 230, y: 94, r: 16 },
      { x: 132, y: 52, r: 28 },
      { x: 88, y: 92, r: 22 },
      { x: 130, y: 94, r: 24 },
      { x: 175, y: 92, r: 22 }
    ],
    // 2: Fluffy compact cloud
    [
      { x: 130, y: 72, r: 36 },
      { x: 86, y: 80, r: 28 },
      { x: 174, y: 80, r: 28 },
      { x: 54, y: 92, r: 18 },
      { x: 206, y: 92, r: 18 },
      { x: 108, y: 54, r: 26 },
      { x: 148, y: 58, r: 24 },
      { x: 130, y: 92, r: 22 }
    ]
  ];

  const puffs = cloudShapes[variant % cloudShapes.length];

  // 1. Underside ambient depth layer (offset downwards)
  cx.fillStyle = shadowColor;
  for (const p of puffs) {
    cx.beginPath();
    cx.arc(p.x, p.y + 4.5, p.r, 0, Math.PI * 2);
    cx.fill();
  }

  // 2. Solid pure cloud body
  cx.fillStyle = bodyColor;
  for (const p of puffs) {
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fill();
  }

  // 3. Top-left soft highlight for extra puffiness
  cx.fillStyle = highlightColor;
  for (const p of puffs) {
    cx.beginPath();
    cx.arc(p.x - p.r * 0.14, p.y - p.r * 0.16, p.r * 0.72, 0, Math.PI * 2);
    cx.fill();
  }

  CLOUD_CACHE[key] = c;
  return c;
}
function buildBackground(theme, seed) {
  const r = mulberry32(seed || 5), far = [], mid = [], clouds = [], deco = [];
  for (let x = -400; x < 2800; x += 140 + r() * 160) far.push({ x: x, w: 220 + r() * 260, h: 90 + r() * 170 });
  for (let x = -300; x < 2800; x += 120 + r() * 140) mid.push({ x: x, w: 260 + r() * 220, h: 40 + r() * 70 });
  for (let x = -200; x < 2800; x += 38 + r() * 70) deco.push({ x: x, s: 0.7 + r() * 0.6, v: r() });
  for (let k = 0; k < 7; k++) clouds.push({ x: r() * 2600, y: 0.08 + r() * 0.28, s: 0.7 + r() * 0.6, v: 3 + r() * 6 });
  bg = { theme: theme, far: far, mid: mid, clouds: clouds, deco: deco, snow: [] };
  if (theme.name === 'TUNDRA') for (let k = 0; k < 50; k++) bg.snow.push({ x: r(), y: r(), s: 1 + r() * 2.2, v: 0.03 + r() * 0.05, ph: r() * 6 });
  if (theme.name === 'VOLCANO') for (let k = 0; k < 10; k++) bg.snow.push({ x: r(), y: r(), s: 0.8 + r() * 1.4, v: 0.02 + r() * 0.03, ph: r() * 6.28 });
}
function drawBackground(dt) {
  const th = G.theme;
  const isVolcano = th.name === 'VOLCANO';
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  if (isVolcano) {
    sky.addColorStop(0, '#120404');
    sky.addColorStop(0.42, '#380c07');
    sky.addColorStop(0.78, '#822009');
    sky.addColorStop(1, '#c94612');
  } else {
    sky.addColorStop(0, th.sky[0]); sky.addColorStop(1, th.sky[1]);
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  
  const sc = clamp(H / 720, 0.55, 1.4);

  // Clean, stylized natural sun
  const sunX = W * 0.82 - camL * ppm * 0.02, sunY = groundY * 0.22;
  const sunR = 25 * sc;
  if (isVolcano) {
    // Warm golden setting sun
    const sg = ctx.createRadialGradient(sunX, sunY, sunR * 0.7, sunX, sunY, sunR * 2.3);
    sg.addColorStop(0, 'rgba(255, 175, 50, 0.4)');
    sg.addColorStop(1, 'rgba(255, 80, 10, 0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, sunR * 2.3, 0, 6.28); ctx.fill();

    const sunGrad = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
    sunGrad.addColorStop(0, '#ffe082');
    sunGrad.addColorStop(1, '#ff9100');
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, 6.28); ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath(); ctx.arc(sunX - sunR * 0.28, sunY - sunR * 0.28, sunR * 0.28, 0, 6.28); ctx.fill();
  } else {
    // Bright cheerful daytime sun
    const sg = ctx.createRadialGradient(sunX, sunY, sunR * 0.8, sunX, sunY, sunR * 2.2);
    sg.addColorStop(0, 'rgba(255, 245, 180, 0.45)');
    sg.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, sunR * 2.2, 0, 6.28); ctx.fill();

    const sunGrad = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.35, '#fff5b8');
    sunGrad.addColorStop(1, '#ffd03b');
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, 6.28); ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath(); ctx.arc(sunX - sunR * 0.28, sunY - sunR * 0.28, sunR * 0.28, 0, 6.28); ctx.fill();
  }

  // Fluffy, natural cartoon clouds (seamless offscreen cached sprites)
  for (let i = 0; i < bg.clouds.length; i++) {
    const c = bg.clouds[i];
    c.x += c.v * dt;
    const x = ((c.x - camL * ppm * 0.08) % 2800 + 2800) % 2800 - 200;
    const y = groundY * c.y;
    const s = c.s * sc * 0.9;
    const sprite = getCloudSprite(i, isVolcano);
    const sw = sprite.width * s;
    const sh = sprite.height * s;
    
    ctx.save();
    ctx.globalAlpha = isVolcano ? 0.45 : 0.92;
    ctx.drawImage(sprite, x - sw * 0.5, y - sh * 0.5, sw, sh);
    ctx.restore();
  }
  // far mountains / mesas / volcanic calderas
  const offF = -camL * ppm * 0.15;
  ctx.fillStyle = th.far;
  for (const m of bg.far) {
    const x = m.x + offF, h = m.h * sc, w = m.w * sc; if (x + w < -50 || x - w > W + 50) continue;
    ctx.beginPath();
    if (th === THEMES[1]) { ctx.moveTo(x - w * 0.5, groundY); ctx.lineTo(x - w * 0.36, groundY - h); ctx.lineTo(x + w * 0.34, groundY - h); ctx.lineTo(x + w * 0.5, groundY); }
    else if (isVolcano) {
      ctx.moveTo(x - w * 0.65, groundY); ctx.lineTo(x - w * 0.18, groundY - h); ctx.lineTo(x + w * 0.12, groundY - h * 0.95); ctx.lineTo(x + w * 0.65, groundY);
    } else {
      ctx.moveTo(x - w * 0.6, groundY); ctx.lineTo(x - w * 0.1, groundY - h); ctx.lineTo(x + w * 0.05, groundY - h * 0.92); ctx.lineTo(x + w * 0.6, groundY);
    }
    ctx.fill();
    if (isVolcano) {
      ctx.fillStyle = '#ff6a24'; ctx.beginPath(); ctx.ellipse(x - w * 0.03, groundY - h * 0.98, w * 0.16, h * 0.07, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = th.far;
    } else if (th.farSnow) {
      ctx.fillStyle = th.farSnow; ctx.beginPath(); ctx.moveTo(x - w * 0.1 - h * 0.18, groundY - h * 0.7); ctx.lineTo(x - w * 0.1, groundY - h); ctx.lineTo(x + w * 0.05, groundY - h * 0.92); ctx.lineTo(x + w * 0.05 + h * 0.18, groundY - h * 0.68); ctx.lineTo(x, groundY - h * 0.76); ctx.closePath(); ctx.fill(); ctx.fillStyle = th.far;
    }
  }
  // mid hills / ridges
  const offM = -camL * ppm * 0.4;
  for (const m of bg.mid) {
    const x = m.x + offM, w = m.w * sc, h = m.h * sc; if (x + w < -50 || x - w > W + 50) continue;
    ctx.fillStyle = th.mid; ctx.beginPath(); ctx.ellipse(x, groundY, w * 0.6, h, 0, Math.PI, 0); ctx.fill();
  }
  // deco (trees / cacti / calderas)
  const offD = -camL * ppm * 0.55;
  for (const d of bg.deco) {
    const x = d.x + offD, s = d.s * sc; if (x < -60 || x > W + 60) continue;
    const y = groundY;
    if (th.deco === 'tree') {
      ctx.fillStyle = '#6b4424'; ctx.fillRect(x - 3 * s, y - 34 * s, 6 * s, 34 * s);
      ctx.fillStyle = d.v < 0.5 ? th.midDark : '#58ad48';
      for (const [tx, ty, tr] of [[x, y - 44 * s, 20 * s], [x - 13 * s, y - 34 * s, 14 * s], [x + 13 * s, y - 34 * s, 14 * s]]) {
        ctx.beginPath(); ctx.arc(tx, ty, tr, 0, 6.28); ctx.fill();
      }
    } else if (th.deco === 'cactus') {
      if (d.v > 0.55) continue;
      ctx.fillStyle = '#5e9c4a'; const h = 40 * s;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 5 * s, y - h, 10 * s, h, 5 * s) : ctx.rect(x - 5 * s, y - h, 10 * s, h); ctx.fill();
      ctx.fillRect(x - 15 * s, y - h * 0.62, 10 * s, 5 * s); ctx.fillRect(x - 15 * s, y - h * 0.85, 5 * s, h * 0.28);
      ctx.fillRect(x + 5 * s, y - h * 0.45, 10 * s, 5 * s); ctx.fillRect(x + 10 * s, y - h * 0.7, 5 * s, h * 0.28);
    } else if (th.deco === 'volcano') {
      ctx.fillStyle = '#2a0d09'; const h = 22 * s;
      ctx.beginPath(); ctx.moveTo(x - 36 * s, y); ctx.quadraticCurveTo(x - 18 * s, y - h * 1.1, x - 8 * s, y - h); ctx.lineTo(x + 8 * s, y - h); ctx.quadraticCurveTo(x + 18 * s, y - h * 1.1, x + 36 * s, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#7a2a12'; ctx.beginPath(); ctx.ellipse(x, y - h, 6 * s, 1.8 * s, 0, 0, 6.28); ctx.fill();
    } else {
      ctx.fillStyle = '#4f7f6a'; const h = 54 * s;
      for (let k = 0; k < 3; k++) { const yy = y - h * (0.25 + k * 0.25), ww = (20 - k * 5) * s; ctx.beginPath(); ctx.moveTo(x - ww, yy + 12 * s); ctx.lineTo(x, yy - 14 * s); ctx.lineTo(x + ww, yy + 12 * s); ctx.fill(); }
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 7 * s, y - h * 0.82); ctx.lineTo(x, y - h * 0.98); ctx.lineTo(x + 7 * s, y - h * 0.82); ctx.fill();
    }
  }
}
function drawGround() {
  const th = G.theme;
  const isVolcano = th.name === 'VOLCANO';
  const gy = groundY;
  const g = ctx.createLinearGradient(0, gy, 0, H);
  g.addColorStop(0, th.dirt); g.addColorStop(1, th.dirtDark);
  ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy);
  
  // Ground specks
  ctx.fillStyle = isVolcano ? 'rgba(255,80,20,.12)' : 'rgba(0,0,0,.08)';
  const off = ((-camL * ppm) % 60 + 60) % 60;
  for (let x = -60 + off; x < W + 60; x += 60) { ctx.beginPath(); ctx.ellipse(x, gy + 26, 8, 4, 0, 0, 6.28); ctx.ellipse(x + 30, gy + 50, 5, 3, 0, 0, 6.28); ctx.fill(); }

  // Ground cap
  const capH = Math.max(8, ppm * 0.28);
  ctx.fillStyle = th.grass; ctx.fillRect(0, gy - 2, W, capH);
  ctx.fillStyle = th.grassDark; ctx.fillRect(0, gy + capH - 4, W, 4);
  
  if (isVolcano) {
    // Subtle warm rim
    ctx.fillStyle = '#ff6a20'; ctx.fillRect(0, gy - 2, W, 2.5);
    ctx.fillStyle = '#ffe066'; ctx.fillRect(0, gy - 1, W, 1.2);
  } else {
    ctx.fillStyle = th.grass;
    const t2 = ((-camL * ppm) % 18 + 18) % 18;
    ctx.beginPath(); for (let x = -18 + t2; x < W + 18; x += 18) { ctx.moveTo(x, gy + capH - 3); ctx.quadraticCurveTo(x + 9, gy + capH + 5, x + 18, gy + capH - 3); } ctx.fill();
  }
}
function drawTerrain(t) {
  const th = G.theme;
  const [x0, y1] = w2s(t.x0, t.h), [x1] = w2s(t.x1, 0);
  const w = x1 - x0, h = t.h * ppm;
  if (x1 < -20 || x0 > W + 20) return;
  const g = ctx.createLinearGradient(0, y1, 0, y1 + h);
  g.addColorStop(0, th.dirt); g.addColorStop(1, th.dirtDark);
  ctx.fillStyle = g;
  ctx.beginPath(); const r = Math.min(10, w * 0.1);
  ctx.moveTo(x0, y1 + h); ctx.lineTo(x0, y1 + r); ctx.quadraticCurveTo(x0, y1, x0 + r, y1); ctx.lineTo(x1 - r, y1); ctx.quadraticCurveTo(x1, y1, x1, y1 + r); ctx.lineTo(x1, y1 + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.1)';
  for (let k = 0; k < w / 40; k++) { const sx = x0 + 12 + k * 40 + ((t.x0 * 13) % 17), sy = y1 + h * (0.35 + ((k * 37) % 50) / 100); ctx.beginPath(); ctx.ellipse(sx, sy, 7, 3.5, 0, 0, 6.28); ctx.fill(); }
  const capH = Math.max(6, ppm * 0.24);
  ctx.fillStyle = th.grass; ctx.beginPath(); ctx.moveTo(x0 - 2, y1 + capH); ctx.lineTo(x0 - 2, y1 + r * 0.6); ctx.quadraticCurveTo(x0, y1 - 2, x0 + r, y1 - 2); ctx.lineTo(x1 - r, y1 - 2); ctx.quadraticCurveTo(x1, y1 - 2, x1 + 2, y1 + r * 0.6); ctx.lineTo(x1 + 2, y1 + capH); ctx.closePath(); ctx.fill();
  ctx.fillStyle = th.grassDark; ctx.fillRect(x0, y1 + capH - 3, w, 3);
}

/* =====================================================================
   ENTITY RENDERING
   ===================================================================== */
function rr(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function drawBlock(e) {
  const b = e.body, p = b.getPosition(), a = b.getAngle(), [sx, sy] = w2s(p.x, p.y);
  if (e.round) { drawBoulder(e, sx, sy, a); return; }
  let w = e.w * ppm, h = e.h * ppm;
  if (sx + Math.max(w, h) < -20 || sx - Math.max(w, h) > W + 20) return;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-a);
  if (e.h > e.w) { ctx.rotate(Math.PI / 2); const t = w; w = h; h = t; }
  const lw = Math.max(1.4, ppm * 0.04);
  ctx.globalAlpha = e.mat === 'ice' ? 0.9 : 1;
  ctx.fillStyle = patFor(e.mat, e.seed);
  rr(-w / 2, -h / 2, w, h, Math.min(3, h * 0.15)); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(-w / 2 + lw, -h / 2 + lw, w - 2 * lw, Math.max(1.5, h * 0.14));
  ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(-w / 2 + lw, h / 2 - lw - Math.max(1.5, h * 0.14), w - 2 * lw, Math.max(1.5, h * 0.14));
  if (e.mat === 'wood' && w > h * 2.5) { ctx.fillStyle = getOutl(e.mat); const nr = Math.max(1, h * 0.09); ctx.beginPath(); ctx.arc(-w / 2 + h * 0.5, 0, nr, 0, 6.28); ctx.arc(w / 2 - h * 0.5, 0, nr, 0, 6.28); ctx.fill(); }
  const f = e.hp / e.maxHp;
  if (f < 0.75) drawCracks(e, w, h, f);
  ctx.strokeStyle = getOutl(e.mat); ctx.lineWidth = lw; rr(-w / 2, -h / 2, w, h, Math.min(3, h * 0.15)); ctx.stroke();
  ctx.restore();
}
function drawCracks(e, w, h, f) {
  const seedVal = ((e.seed || 1) * 31337 + 101) | 0;
  const rng = mulberry32(seedVal);
  const mat = e.mat || (e.round ? 'stone' : 'wood');
  const tIdx = getThemeIndex();
  const hw = w * 0.5, hh = h * 0.5;
  const lw = Math.max(1.3, Math.min(w, h) * 0.034);
  const hiLw = Math.max(0.6, lw * 0.3);

  let shadowColor, lightColor;
  if (mat === 'ice') {
    shadowColor = tIdx === 3 ? 'rgba(10, 25, 45, 0.96)' : tIdx === 1 ? 'rgba(60, 30, 10, 0.95)' : 'rgba(8, 36, 70, 0.96)';
    lightColor = tIdx === 1 ? 'rgba(255, 240, 200, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  } else if (mat === 'stone') {
    shadowColor = tIdx === 1 ? 'rgba(40, 12, 5, 0.96)' : tIdx === 3 ? 'rgba(10, 5, 5, 0.98)' : tIdx === 2 ? 'rgba(10, 20, 30, 0.96)' : 'rgba(8, 10, 14, 0.96)';
    lightColor = tIdx === 1 ? 'rgba(255, 210, 180, 0.88)' : tIdx === 3 ? 'rgba(255, 120, 40, 0.92)' : 'rgba(255, 255, 255, 0.88)';
  } else {
    // wood
    shadowColor = tIdx === 1 ? 'rgba(45, 12, 4, 0.97)' : tIdx === 3 ? 'rgba(15, 8, 6, 0.98)' : tIdx === 2 ? 'rgba(25, 20, 16, 0.96)' : 'rgba(30, 14, 5, 0.97)';
    lightColor = tIdx === 1 ? 'rgba(255, 220, 170, 0.9)' : tIdx === 3 ? 'rgba(255, 100, 30, 0.85)' : tIdx === 2 ? 'rgba(245, 238, 228, 0.88)' : 'rgba(255, 228, 165, 0.88)';
  }

  const numMain = f < 0.15 ? 4 : f < 0.3 ? 3 : f < 0.55 ? 2 : 1;

  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-hw, -hh, w, h, Math.min(3, h * 0.15));
  else ctx.rect(-hw, -hh, w, h);
  ctx.clip();

  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 6;

  function jaggedPath(startX, startY, dirY, totalLen, segLen, spread) {
    const pts = [{ x: startX, y: startY }];
    let cx = startX, cy = startY, remaining = totalLen, side = rng() < 0.5 ? -1 : 1;
    while (remaining > 2) {
      const step = Math.min(segLen * (0.7 + rng() * 0.6), remaining);
      side *= -1;
      const kick = spread * (0.6 + rng() * 0.7) * side;
      const advance = dirY * step * (0.85 + rng() * 0.2);
      cx = clamp(cx + kick, -hw + 1, hw - 1);
      cy = clamp(cy + advance, -hh, hh);
      pts.push({ x: cx, y: cy });
      remaining -= step;
    }
    return pts;
  }

  const drawPoly = (points, offX, offY) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x + offX, points[0].y + offY);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x + offX, points[i].y + offY);
  };

  for (let k = 0; k < numMain; k++) {
    const startSide = rng() < 0.5 ? -1 : 1;
    let cx = clamp((rng() * 0.7 - 0.35) * w + (k - (numMain - 1) * 0.5) * (w * 0.4), -hw + 4, hw - 4);
    const cy = startSide * hh;
    const dirY = -startSide;
    const spread = (mat === 'wood' ? h * 0.3 : h * 0.22);

    const pts = jaggedPath(cx, cy, dirY, h * (0.9 + rng() * 0.25), h * 0.3, spread);
    const branches = [];
    for (let s = 1; s < pts.length - 1; s++) {
      if (rng() < 0.35) {
        branches.push(jaggedPath(pts[s].x, pts[s].y, dirY * 0.3, h * (0.18 + rng() * 0.14), h * 0.18, h * 0.14));
      }
    }

    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lw;
    drawPoly(pts, 0, 0);
    ctx.stroke();
    for (const b of branches) { ctx.lineWidth = lw * 0.8; drawPoly(b, 0, 0); ctx.stroke(); }

    ctx.strokeStyle = lightColor;
    ctx.lineWidth = hiLw;
    drawPoly(pts, -0.9, -0.9);
    ctx.stroke();
    for (const b of branches) { drawPoly(b, -0.9, -0.9); ctx.stroke(); }

    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = hiLw * 0.85;
    drawPoly(pts, 0.8, 0.8);
    ctx.stroke();
  }

  if (f < 0.45) {
    const numNotches = f < 0.25 ? 4 : 2;
    for (let n = 0; n < numNotches; n++) {
      const edge = rng() < 0.5 ? -hh : hh;
      const nx = (rng() - 0.5) * (w - 8);
      const nd = (rng() - 0.5) * 4;
      const depth = Math.min(hh * 0.6, 5 + rng() * 6);
      const tipY = edge < 0 ? edge + depth : edge - depth;
      ctx.strokeStyle = shadowColor; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(nx - 4, edge); ctx.lineTo(nx + nd, tipY); ctx.lineTo(nx + 4, edge); ctx.stroke();
      ctx.strokeStyle = lightColor; ctx.lineWidth = hiLw;
      ctx.beginPath(); ctx.moveTo(nx - 4 - 0.7, edge - 0.7); ctx.lineTo(nx + nd - 0.7, tipY - 0.7); ctx.lineTo(nx + 4 - 0.7, edge - 0.7); ctx.stroke();
    }
  }

  ctx.restore();
}
function drawBoulder(e, sx, sy, a) {
  const R = e.r * ppm; ctx.save(); ctx.translate(sx, sy); ctx.rotate(-a);
  ctx.fillStyle = patFor('stone', e.seed); ctx.beginPath();
  const r = mulberry32(e.seed); for (let k = 0; k < 11; k++) { const t = (k / 11) * 6.283, rad = R * (0.9 + r() * 0.12); k ? ctx.lineTo(Math.cos(t) * rad, Math.sin(t) * rad) : ctx.moveTo(Math.cos(t) * rad, Math.sin(t) * rad); }
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = getOutl('stone'); ctx.lineWidth = Math.max(1.5, ppm * 0.045); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(-R * 0.3, -R * 0.35, R * 0.35, R * 0.2, -0.5, 0, 6.28); ctx.fill();
  if (e.hp / e.maxHp < 0.7) drawCracks(e, R * 1.4, R * 1.4, e.hp / e.maxHp);
  ctx.restore();
}
function enemyColors(e) {
  if (e.team === 1) return ['#ff9a8a', '#e5483b', '#9e2419']; // PvP Red
  if (e.team === 2) return ['#9fd0ff', '#3a8bf5', '#1d4f9e']; // PvP Blue
  const t = getThemeIndex();
  if (t === 1) return ['#ffe58f', '#f59f2c', '#8a4805']; // Canyon Desert Bandit
  if (t === 2) return ['#cceeff', '#4db2f0', '#156199']; // Tundra Frost Imp
  if (t === 3) return ['#ff8855', '#e2381a', '#5c0c04']; // Volcano Magma Fiend
  return ['#d5f895', '#82c83d', '#3e7820']; // Forest Snort
}
function lookTarget() {
  const f = G.proj && !G.proj.removed ? G.proj.body.getPosition() : null;
  if (f) return f;
  const R = restPos(curSide()); return { x: R.x, y: R.y };
}
function drawEnemy(e, dt) {
  const b = e.body, p = b.getPosition(), a = b.getAngle(), [sx, sy] = w2s(p.x, p.y), R = e.r * ppm;
  if (sx + R < -20 || sx - R > W + 20) return;
  e.blink -= dt; if (e.blink < -0.13) e.blink = 2 + Math.random() * 3; if (e.hurt > 0) e.hurt -= dt;
  e.bob += dt * (e.hurt > 0 ? 10 : 3.2);
  const death = e.dead ? clamp((e.deathAge || 0) / 0.28, 0, 1) : 0;
  const squash = (e.hurt > 0 ? 1 + Math.sin(e.bob * 2) * 0.09 : 1 + Math.sin(e.bob) * 0.035) * (1 - death * 0.72);
  const [c0, c1, c2] = enemyColors(e);
  const tIdx = (e.team === 1 || e.team === 2) ? 0 : getThemeIndex();

  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-a - death * 0.65); ctx.globalAlpha = 1 - death * 0.82;

  // Tiny feet
  ctx.fillStyle = c2;
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(side * R * 0.47, R * 0.78, R * 0.2, R * 0.11, side * 0.12, 0, 6.28); ctx.fill(); }
  ctx.lineWidth = Math.max(1.3, R * 0.075);

  // Ears
  const earInner = tIdx === 1 ? '#ffe5a3' : tIdx === 2 ? '#ffc0d2' : tIdx === 3 ? '#ffd242' : '#b4dc72';
  for (const side of [-1, 1]) {
    ctx.fillStyle = c1; ctx.strokeStyle = c2;
    ctx.beginPath(); ctx.ellipse(side * R * 0.69, -R * 0.68, R * 0.25, R * 0.3, side * 0.24, 0, 6.28); ctx.fill(); ctx.stroke();
    ctx.fillStyle = earInner; ctx.beginPath(); ctx.ellipse(side * R * 0.69, -R * 0.67, R * 0.12, R * 0.16, side * 0.24, 0, 6.28); ctx.fill();
  }

  ctx.save(); ctx.scale((1 / Math.max(0.18, squash)) * (1 + death * 0.22), squash);

  // Body Radial Gradient
  const topShine = tIdx === 1 ? '#fff7dc' : tIdx === 2 ? '#f2fbff' : tIdx === 3 ? '#ffe28a' : '#ecffc3';
  const g = ctx.createRadialGradient(-R * 0.35, -R * 0.42, R * 0.06, -R * 0.05, -R * 0.05, R * 1.18);
  g.addColorStop(0, topShine); g.addColorStop(0.28, c0); g.addColorStop(0.78, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.strokeStyle = c2;
  ctx.beginPath(); ctx.ellipse(0, 0, R * 0.97, R * 0.96, 0, 0, 6.28); ctx.fill(); ctx.stroke();

  // Cheek spots / Theme Markings
  const cheekColor = tIdx === 1 ? 'rgba(165,75,10,.32)' : tIdx === 2 ? 'rgba(255,100,160,.38)' : tIdx === 3 ? 'rgba(70,12,6,.5)' : 'rgba(53,110,28,.28)';
  ctx.fillStyle = cheekColor;
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(side * R * 0.68, R * 0.04, R * 0.075, R * 0.055, side * 0.3, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.ellipse(side * R * 0.57, -R * 0.1, R * 0.045, R * 0.035, 0, 0, 6.28); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(-R * 0.37, -R * 0.48, R * 0.27, R * 0.14, -0.52, 0, 6.28); ctx.fill();

  // Eyes tracking projectile
  const tg = lookTarget(), dx = tg.x - p.x, dy = tg.y - p.y, ang = Math.atan2(-dy, dx) + a;
  const lx = Math.cos(ang) * R * 0.075, ly = Math.sin(ang) * R * 0.075;
  const eyeColor = tIdx === 1 ? '#6e3b08' : tIdx === 2 ? '#124168' : tIdx === 3 ? '#ffaa00' : '#4a6631';
  for (const s of [-1, 1]) {
    const ex = s * R * 0.3, ey = -R * 0.16;
    if (e.blink < 0) {
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = Math.max(1.4, R * 0.1);
      ctx.beginPath(); ctx.moveTo(ex - R * 0.16, ey); ctx.lineTo(ex + R * 0.16, ey); ctx.stroke();
      continue;
    }
    ctx.fillStyle = tIdx === 3 ? '#ffe8b5' : '#fff';
    ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.19, R * 0.24, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = eyeColor;
    ctx.beginPath(); ctx.arc(ex + lx, ey + ly, R * (e.hurt > 0 ? 0.065 : 0.105), 0, 6.28); ctx.fill();
    if (tIdx === 3) {
      ctx.fillStyle = '#630e04'; ctx.beginPath(); ctx.arc(ex + lx, ey + ly, R * (e.hurt > 0 ? 0.035 : 0.055), 0, 6.28); ctx.fill();
    }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + lx - R * 0.035, ey + ly - R * 0.045, R * 0.035, 0, 6.28); ctx.fill();
  }

  // Eyebrows
  ctx.strokeStyle = c2; ctx.lineWidth = Math.max(1.2, R * 0.075); ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(side * R * 0.16, -R * 0.46);
    ctx.quadraticCurveTo(side * R * 0.34, -R * 0.52, side * R * 0.47, -R * 0.42);
    ctx.stroke();
  }

  // Muzzle
  const muzzle = ctx.createRadialGradient(-R * 0.09, R * 0.14, R * 0.03, 0, R * 0.29, R * 0.54);
  if (tIdx === 1) {
    muzzle.addColorStop(0, '#fff0c7'); muzzle.addColorStop(0.7, '#f5b550'); muzzle.addColorStop(1, '#b86b12');
  } else if (tIdx === 2) {
    muzzle.addColorStop(0, '#e5f6ff'); muzzle.addColorStop(0.7, '#8ad0f7'); muzzle.addColorStop(1, '#3494ce');
  } else if (tIdx === 3) {
    muzzle.addColorStop(0, '#ffc085'); muzzle.addColorStop(0.7, '#f05626'); muzzle.addColorStop(1, '#9e1402');
  } else {
    muzzle.addColorStop(0, '#e4f4ab'); muzzle.addColorStop(0.7, '#a4d756'); muzzle.addColorStop(1, '#6eaa36');
  }
  ctx.fillStyle = muzzle; ctx.strokeStyle = c2; ctx.lineWidth = Math.max(1.1, R * 0.045);
  ctx.beginPath(); ctx.ellipse(0, R * 0.28, R * 0.43, R * 0.3, 0, 0, 6.28); ctx.fill(); ctx.stroke();

  // Nostrils
  const nostrilColor = tIdx === 1 ? 'rgba(110,48,5,.8)' : tIdx === 2 ? 'rgba(16,70,110,.8)' : tIdx === 3 ? 'rgba(70,8,2,.85)' : 'rgba(48,83,31,.76)';
  ctx.fillStyle = nostrilColor;
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(side * R * 0.15, R * 0.25, R * 0.055, R * 0.085, side * 0.16, 0, 6.28); ctx.fill(); }

  // Mouth
  ctx.strokeStyle = c2; ctx.lineWidth = Math.max(1.2, R * 0.075);
  if (e.hurt > 0) { ctx.fillStyle = '#5a1a1a'; ctx.beginPath(); ctx.ellipse(0, R * 0.62, R * 0.12, R * 0.15, 0, 0, 6.28); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(-R * 0.14, R * 0.62); ctx.quadraticCurveTo(0, R * 0.74, R * 0.14, R * 0.62); ctx.stroke(); }
  ctx.restore();

  // Helmet or Horns (themed per realm)
  if (tIdx === 3 && !e.helmet) {
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#ff6a18'; ctx.strokeStyle = '#4a0c05'; ctx.lineWidth = Math.max(1.1, R * 0.05);
      ctx.beginPath();
      ctx.moveTo(side * R * 0.42, -R * 0.72);
      ctx.quadraticCurveTo(side * R * 0.62, -R * 1.08, side * R * 0.32, -R * 1.18);
      ctx.quadraticCurveTo(side * R * 0.28, -R * 0.95, side * R * 0.22, -R * 0.76);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffe044'; ctx.beginPath(); ctx.arc(side * R * 0.32, -R * 1.18, R * 0.055, 0, 6.28); ctx.fill();
    }
  }

  if (e.helmet) {
    let hTop = '#dfe5ea', hBot = '#8e98a2', hBorder = '#4c535b', hRivet = '#b5bec6';
    if (tIdx === 1) {
      hTop = '#f9d27d'; hBot = '#b37622'; hBorder = '#59380a'; hRivet = '#ffe5a0';
    } else if (tIdx === 2) {
      hTop = '#eef8ff'; hBot = '#86a8c4'; hBorder = '#2e4960'; hRivet = '#c2e0f5';
    } else if (tIdx === 3) {
      hTop = '#3a201e'; hBot = '#140807'; hBorder = '#0d0403'; hRivet = '#ff8822';
    }
    const hg = ctx.createLinearGradient(0, -R, 0, -R * 0.2); hg.addColorStop(0, hTop); hg.addColorStop(1, hBot);
    ctx.fillStyle = hg; ctx.strokeStyle = hBorder; ctx.lineWidth = Math.max(1.4, R * 0.08);
    ctx.beginPath(); ctx.arc(0, -R * 0.22, R * 1.02, Math.PI * 1.04, Math.PI * 1.96); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = hRivet; ctx.beginPath(); ctx.arc(0, -R * 1.2, R * 0.13, 0, 6.28); ctx.fill(); ctx.stroke();
    if (tIdx === 3) {
      // Molten orange crown glow on Volcano helmet
      ctx.strokeStyle = '#ff6a20'; ctx.lineWidth = Math.max(1.0, R * 0.04);
      ctx.beginPath(); ctx.arc(0, -R * 0.22, R * 0.94, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
    if (e.hp < e.maxHp * 0.6) {
      ctx.strokeStyle = hBorder; ctx.beginPath(); ctx.moveTo(-R * 0.2, -R * 1.1); ctx.lineTo(0, -R * 0.8); ctx.lineTo(-R * 0.1, -R * 0.55); ctx.stroke();
    }
  }
  ctx.restore();
}
function drawTNT(e) {
  const b = e.body, p = b.getPosition(), a = b.getAngle(), [sx, sy] = w2s(p.x, p.y), s = e.w * ppm;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-a);
  const g = ctx.createLinearGradient(0, -s / 2, 0, s / 2); g.addColorStop(0, '#e8453c'); g.addColorStop(1, '#a51f18');
  ctx.fillStyle = g; rr(-s / 2, -s / 2, s, s, s * 0.08); ctx.fill();
  ctx.fillStyle = '#5a3413'; ctx.fillRect(-s / 2, -s * 0.36, s, s * 0.1); ctx.fillRect(-s / 2, s * 0.26, s, s * 0.1);
  ctx.fillStyle = '#ffe36a'; ctx.font = (s * 0.34) + 'px Lilita One, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#5a1510'; ctx.lineWidth = Math.max(1.2, s * 0.05); ctx.strokeText('TNT', 0, s * 0.02); ctx.fillText('TNT', 0, s * 0.02);
  ctx.strokeStyle = '#5a1510'; ctx.lineWidth = Math.max(1.4, ppm * 0.04); rr(-s / 2, -s / 2, s, s, s * 0.08); ctx.stroke();
  ctx.restore();
}
function drawItem(e, dt) {
  const b = e.body, p = b.getPosition(), a = b.getAngle(), [sx, sy] = w2s(p.x, p.y), w = e.w * ppm, h = e.h * ppm;
  e.tw += dt;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(-a);
  const lw = Math.max(1.2, ppm * 0.035);
  if (e.type === 'cake') {
    ctx.fillStyle = '#f7d9a6'; rr(-w / 2, -h * 0.1, w, h * 0.6, 3); ctx.fill();
    ctx.fillStyle = '#b86b3c'; ctx.fillRect(-w / 2, h * 0.12, w, h * 0.14);
    ctx.fillStyle = '#ff9ccf'; rr(-w / 2, -h / 2, w, h * 0.42, 4); ctx.fill();
    ctx.fillStyle = '#ff9ccf'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(-w / 2 + w * (0.12 + k * 0.25), -h * 0.08, w * 0.08, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = '#e8203a'; ctx.beginPath(); ctx.arc(0, -h * 0.58, w * 0.13, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-w * 0.04, -h * 0.62, w * 0.04, 0, 6.28); ctx.fill();
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = lw; rr(-w / 2, -h / 2, w, h, 4); ctx.stroke();
  } else {
    ctx.fillStyle = '#5fe3ff'; ctx.strokeStyle = '#1f7fa8'; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-w * 0.5, -h * 0.15); ctx.lineTo(-w * 0.28, -h * 0.5); ctx.lineTo(w * 0.28, -h * 0.5); ctx.lineTo(w * 0.5, -h * 0.15); ctx.lineTo(0, h * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c9f7ff'; ctx.beginPath(); ctx.moveTo(-w * 0.28, -h * 0.5); ctx.lineTo(-w * 0.1, -h * 0.15); ctx.lineTo(w * 0.1, -h * 0.15); ctx.lineTo(w * 0.28, -h * 0.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2fb8e0'; ctx.beginPath(); ctx.moveTo(-w * 0.1, -h * 0.15); ctx.lineTo(0, h * 0.5); ctx.lineTo(w * 0.1, -h * 0.15); ctx.closePath(); ctx.fill();
    const tw = Math.max(0, Math.sin(e.tw * 3)); ctx.fillStyle = 'rgba(255,255,255,' + tw + ')';
    ctx.beginPath(); ctx.moveTo(w * 0.3, -h * 0.8); ctx.lineTo(w * 0.35, -h * 0.62); ctx.lineTo(w * 0.52, -h * 0.57); ctx.lineTo(w * 0.35, -h * 0.52); ctx.lineTo(w * 0.3, -h * 0.34); ctx.lineTo(w * 0.25, -h * 0.52); ctx.lineTo(w * 0.08, -h * 0.57); ctx.lineTo(w * 0.25, -h * 0.62); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawBalloon(e) {
  const p = e.body.getPosition(), [sx, sy] = w2s(p.x, p.y), R = e.r * ppm;
  if (!e.plat || !e.plat.isActive || e.plat.getUserData().removed) { /* string dangles */ }
  else {
    const pa = e.plat.getWorldPoint(Vec2(e.off, 0.15)), [px, py] = w2s(pa.x, pa.y);
    ctx.strokeStyle = 'rgba(60,40,20,.85)'; ctx.lineWidth = Math.max(1, ppm * 0.025);
    ctx.beginPath(); ctx.moveTo(sx, sy + R); ctx.quadraticCurveTo(sx + (px - sx) * 0.5 + Math.sin(G.time * 2 + p.x) * 4, (sy + R + py) / 2, px, py); ctx.stroke();
  }
  ctx.save(); ctx.translate(sx, sy);
  const g = ctx.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.1, 0, 0, R * 1.1);
  g.addColorStop(0, '#fff'); g.addColorStop(0.18, e.color); g.addColorStop(1, e.color);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.92, R * 1.08, 0, 0, 6.28); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(1.2, ppm * 0.03); ctx.stroke();
  ctx.fillStyle = e.color; ctx.beginPath(); ctx.moveTo(-R * 0.14, R * 1.2); ctx.lineTo(0, R * 1.02); ctx.lineTo(R * 0.14, R * 1.2); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawProjShape(type, sx, sy, R, ang, e) {
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang);
  const lw = Math.max(1.4, R * 0.12);
  if (type === 'rock') {
    ctx.fillStyle = patFor('stone', 3); ctx.beginPath();
    const pts = [1, 0.92, 1.02, 0.88, 0.97, 1.05, 0.9, 1];
    for (let k = 0; k < 8; k++) { const t = (k / 8) * 6.283; k ? ctx.lineTo(Math.cos(t) * R * pts[k], Math.sin(t) * R * pts[k]) : ctx.moveTo(R, 0); }
    ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#4c535b'; ctx.lineWidth = lw; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-R * 0.3, -R * 0.35, R * 0.3, R * 0.17, -0.5, 0, 6.28); ctx.fill();
  } else if (type === 'bomb') {
    const t = G.realT || 0;
    // Spherical 3D iron body
    const g = ctx.createRadialGradient(-R * 0.35, -R * 0.38, R * 0.05, 0, 0, R * 1.05);
    g.addColorStop(0, '#757f8c'); g.addColorStop(0.22, '#424852'); g.addColorStop(0.65, '#1e2229'); g.addColorStop(1, '#0e1014');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.28); ctx.fill();

    // Glossy 3D specular highlight & subtle ambient ground rim bounce
    ctx.fillStyle = 'rgba(255,255,255,0.42)'; ctx.beginPath(); ctx.ellipse(-R * 0.35, -R * 0.42, R * 0.28, R * 0.14, -0.6, 0, 6.28); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(-R * 0.44, -R * 0.48, R * 0.065, 0, 6.28); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = lw * 0.65; ctx.beginPath(); ctx.arc(0, 0, R * 0.88, 0.4, 2.1); ctx.stroke();

    // Metallic brass collar atop the sphere
    const bg = ctx.createLinearGradient(-R * 0.26, 0, R * 0.26, 0);
    bg.addColorStop(0, '#7a5015'); bg.addColorStop(0.35, '#d4a84e'); bg.addColorStop(0.7, '#f7d37e'); bg.addColorStop(1, '#66400e');
    ctx.fillStyle = bg; ctx.strokeStyle = '#382208'; ctx.lineWidth = lw * 0.7;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-R * 0.23, -R * 1.1, R * 0.46, R * 0.26, R * 0.06) : ctx.rect(-R * 0.23, -R * 1.1, R * 0.46, R * 0.26);
    ctx.fill(); ctx.stroke();

    // Braided fuse rope
    ctx.strokeStyle = '#5a3d16'; ctx.lineWidth = lw * 0.95; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -R * 1.08); ctx.bezierCurveTo(R * 0.08, -R * 1.35, R * 0.42, -R * 1.2, R * 0.48, -R * 1.42); ctx.stroke();
    ctx.strokeStyle = '#e2c585'; ctx.lineWidth = lw * 0.65;
    ctx.beginPath(); ctx.moveTo(0, -R * 1.08); ctx.bezierCurveTo(R * 0.08, -R * 1.35, R * 0.42, -R * 1.2, R * 0.48, -R * 1.42); ctx.stroke();

    // Burning spark with animated flame and sparks
    const fl = 0.85 + Math.max(0, Math.sin(t * 32)) * 0.35;
    const fx = R * 0.48, fy = -R * 1.42;
    ctx.fillStyle = 'rgba(255, 90, 10, 0.35)'; ctx.beginPath(); ctx.arc(fx, fy, R * 0.32 * fl, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#ff5a14'; ctx.beginPath(); ctx.arc(fx, fy, R * 0.18 * fl, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#fff4a0'; ctx.beginPath(); ctx.arc(fx, fy, R * 0.09 * fl, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(fx, fy, R * 0.04 * fl, 0, 6.28); ctx.fill();
    for (let k = 0; k < 3; k++) {
      const sa = t * 12 + k * 2.09;
      const sr = R * (0.2 + (Math.sin(t * 18 + k) * 0.5 + 0.5) * 0.15);
      ctx.fillStyle = k % 2 === 0 ? '#ffb020' : '#ffe066';
      ctx.beginPath(); ctx.arc(fx + Math.cos(sa) * sr, fy + Math.sin(sa) * sr, R * 0.035, 0, 6.28); ctx.fill();
    }

    // Crisp outer cartoon silhouette outline
    ctx.strokeStyle = e && e.used ? '#ffb343' : '#101216'; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(0, 0, R * 0.98, 0, 6.28); ctx.stroke();

    // Armed / impact danger warning flash
    if (e && e.hit && !e.used && Math.sin(t * 24) > 0) {
      ctx.fillStyle = 'rgba(255,45,25,.42)'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.28); ctx.fill();
    }
  } else if (type === 'shuriken' || type === 'mini') {
    const rg = ctx.createLinearGradient(-R, -R, R, R); rg.addColorStop(0, '#fff'); rg.addColorStop(0.22, '#bfefff'); rg.addColorStop(0.48, '#6fadd0'); rg.addColorStop(0.7, '#e9fbff'); rg.addColorStop(1, '#38769c');
    ctx.fillStyle = rg; ctx.strokeStyle = '#356985'; ctx.lineWidth = lw * 0.72;
    ctx.beginPath();
    for (let k = 0; k < 8; k++) { const t = (k / 8) * 6.283, rad = k % 2 ? R * 0.32 : R * 1.36; k ? ctx.lineTo(Math.cos(t) * rad, Math.sin(t) * rad) : ctx.moveTo(rad, 0); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.78)'; ctx.lineWidth = lw * 0.32;
    for (let k = 0; k < 4; k++) { const t = k * Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(t) * R * 0.36, Math.sin(t) * R * 0.36); ctx.lineTo(Math.cos(t) * R * 1.04, Math.sin(t) * R * 1.04); ctx.stroke(); }
    ctx.fillStyle = '#293f52'; ctx.beginPath(); ctx.arc(0, 0, R * 0.23, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#b8dff2'; ctx.beginPath(); ctx.arc(0, 0, R * 0.12, 0, 6.28); ctx.fill();
  } else if (type === 'missile') {
    const L = R * 2.6;
    if (e && e.boost > 0) {
      const flick = 0.8 + Math.sin(G.realT * 68) * 0.2;
      ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.moveTo(-L * 0.48, -R * 0.3); ctx.lineTo(-L * (1.2 + flick * 0.24), 0); ctx.lineTo(-L * 0.48, R * 0.3); ctx.fill();
      ctx.fillStyle = '#ff7624'; ctx.beginPath(); ctx.moveTo(-L * 0.48, -R * 0.18); ctx.lineTo(-L * (0.93 + flick * 0.16), 0); ctx.lineTo(-L * 0.48, R * 0.18); ctx.fill();
    }
    ctx.fillStyle = '#b3241c'; ctx.strokeStyle = '#652018'; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(-L * 0.34, -R * 0.24); ctx.lineTo(-L * 0.56, -R * 0.78); ctx.lineTo(-L * 0.02, -R * 0.4); ctx.lineTo(L * 0.28, -R * 0.4); ctx.lineTo(L * 0.28, R * 0.4); ctx.lineTo(-L * 0.02, R * 0.4); ctx.lineTo(-L * 0.56, R * 0.78); ctx.lineTo(-L * 0.34, R * 0.24); ctx.closePath(); ctx.fill(); ctx.stroke();
    const mg = ctx.createLinearGradient(0, -R * 0.42, 0, R * 0.42); mg.addColorStop(0, '#ff816d'); mg.addColorStop(0.42, '#e9473b'); mg.addColorStop(1, '#9e201a');
    ctx.fillStyle = mg; ctx.strokeStyle = '#641710';
    ctx.beginPath(); ctx.moveTo(-L * 0.3, -R * 0.37); ctx.lineTo(L * 0.2, -R * 0.37); ctx.quadraticCurveTo(L * 0.55, 0, L * 0.2, R * 0.37); ctx.lineTo(-L * 0.3, R * 0.37); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d5edf5'; ctx.fillRect(-L * 0.04, -R * 0.37, L * 0.11, R * 0.74);
    ctx.fillStyle = '#75c9e7'; ctx.beginPath(); ctx.ellipse(L * 0.02, 0, R * 0.11, R * 0.25, 0, 0, 6.28); ctx.fill();
  }
  ctx.restore();
}
function drawProj(e) {
  const b = e.body, p = b.getPosition(), [sx, sy] = w2s(p.x, p.y);
  let ang = -b.getAngle();
  if (e.type === 'missile') { const v = b.getLinearVelocity(); ang = Math.atan2(-v.y, v.x); }
  drawProjShape(e.type, sx, sy, e.r * ppm, ang, e);
}

/* ---------------- slingshot ---------------- */
function slingSkin() {
  const baseSkin = SLINGS.find((q) => q.id === save.sling) || SLINGS[0];
  if ((!save.sling || save.sling === 'classic') && G.mode !== 'pvp') {
    const tIdx = getThemeIndex();
    if (tIdx === 3) return { id: 'volcano', name: 'MAGMA', price: 0, desc: 'Forged in lava.', bonus: {}, wood: '#3d1c16', dark: '#1c0a07', band: '#ff5722' };
  }
  return baseSkin;
}
function drawSlingPart(side, part, skinOverride) {
  const R = restPos(side), sk = skinOverride || (G.mode === 'pvp' ? (side ? { wood: '#b56b5a', dark: '#5e2a20', band: '#6b1f1a' } : { wood: '#6a8fc0', dark: '#2a4570', band: '#1d3d6b' }) : slingSkin());
  const base = w2s(R.x, R.y - (REST_Y - MOUND_H)), top = w2s(R.x, R.y - 0.55);
  const lw = Math.max(5, ppm * 0.22);
  const prongL = w2s(R.x - 0.42, R.y + 0.25), prongR = w2s(R.x + 0.42, R.y + 0.25);
  const front = side === 1 ? prongL : prongR, back = side === 1 ? prongR : prongL;
  const active = curSide() === side && (G.loaded || G.aim);
  const pouch = active ? w2s(G.pouch.x, G.pouch.y) : w2s(R.x, R.y);
  const woodStroke = (from, to) => { ctx.lineCap = 'round'; ctx.strokeStyle = sk.dark; ctx.lineWidth = lw + 3; ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]); ctx.stroke(); ctx.strokeStyle = sk.wood; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = lw * 0.3; ctx.beginPath(); ctx.moveTo(from[0] - lw * 0.18, from[1]); ctx.lineTo(to[0] - lw * 0.18, to[1]); ctx.stroke(); };
  const band = (from) => { const d = Math.hypot(pouch[0] - from[0], pouch[1] - from[1]); ctx.strokeStyle = sk.band; ctx.lineWidth = Math.max(2.5, ppm * 0.13 * clamp(1.4 - d / (ppm * 2.4), 0.45, 1.3)); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(pouch[0], pouch[1]); ctx.stroke(); };
  if (part === 'back') {
    woodStroke(base, top); woodStroke(top, back);
    band(back);
  } else {
    // pouch leather
    const ld = active ? Math.atan2(pouch[1] - top[1], pouch[0] - top[0]) : 0;
    ctx.save(); ctx.translate(pouch[0], pouch[1]); ctx.rotate(ld);
    ctx.fillStyle = '#5a3413'; rr(-ppm * 0.12, -ppm * 0.3, ppm * 0.24, ppm * 0.6, ppm * 0.08); ctx.fill(); ctx.restore();
    band(front);
    woodStroke(top, front);
    ctx.fillStyle = sk.dark; for (const pp of [prongL, prongR]) { ctx.beginPath(); ctx.arc(pp[0], pp[1], lw * 0.62, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = sk.band; ctx.fillRect(top[0] - lw * 0.62, top[1] + lw * 0.3, lw * 1.24, lw * 0.5);
  }
}
function drawLoaded() {
  if (!G.loaded) return;
  const side = curSide(), R = restPos(side);
  let x = G.pouch.x, y = G.pouch.y;
  if (G.loadT < 1) { const u = easeOutBack(clamp(G.loadT, 0, 1)); const q = queuePos(0, side); x = lerp(q.x, R.x, u); y = lerp(q.y, R.y, u) + Math.sin(clamp(G.loadT, 0, 1) * Math.PI) * 1.2; }
  const [sx, sy] = w2s(x, y);
  drawProjShape(G.loaded, sx, sy, PROJ[G.loaded].r * ppm, G.loaded === 'missile' ? (side ? Math.PI : 0) : 0, null);
}
function queuePos(i, side) { const R = restPos(side), dir = side === 1 ? 1 : -1; return { x: R.x + dir * (1.7 + i * 0.85), y: side === undefined || G.mode !== 'pvp' ? 0.32 : G.moundH + 0.32 }; }
function drawQueue() {
  if (G.mode !== 'campaign' && G.mode !== 'daily') return;
  G.ammo.forEach((t, i) => { const q = queuePos(i, 0), [sx, sy] = w2s(q.x, q.y + PROJ[t].r); drawProjShape(t, sx, sy, PROJ[t].r * ppm * 0.9, t === 'missile' ? -0.4 : 0, null); });
}
function predictShot(maxT) {
  const side = curSide(), R = restPos(side), dx = G.pouch.x - R.x, dy = G.pouch.y - R.y, len = Math.hypot(dx, dy);
  if (len < 0.35) return null;
  let vx = -dx * LAUNCH_K, vy = -dy * LAUNCH_K, x = G.pouch.x, y = G.pouch.y;
  const pts = [{ x: x, y: y }], h = 1 / 60, g = 10 * h, steps = Math.round(maxT * 60);
  let hit = null;
  for (let k = 0; k < steps; k++) {
    vy -= g; const nx = x + vx * h, ny = y + vy * h;
    if (k > 2) {
      let best = null;
      const speed = Math.hypot(vx, vy) || 1, px = -vy / speed, py = vx / speed, rad = (G.loaded && PROJ[G.loaded] ? PROJ[G.loaded].r : 0.3) * 0.76;
      // Three parallel casts approximate the radius of the round projectile, not just its center.
      for (const off of [-rad, 0, rad]) {
        const p0 = Vec2(x + px * off, y + py * off), p1 = Vec2(nx + px * off, ny + py * off);
        world.rayCast(p0, p1, (fix, point, normal, fraction) => {
          const u = fix.getBody().getUserData();
          if (u && (u.kind === 'proj' || u.kind === 'debris' && u.age > u.ttl - 0.3)) return -1;
          if (!best || fraction < best.fraction) best = { x: point.x - px * off, y: point.y - py * off, fraction: fraction };
          return fraction;
        });
      }
      if (best) { hit = best; pts.push(best); break; }
    }
    x = nx; y = ny; pts.push({ x: x, y: y });
    if (y < -2 || x < -40 || x > G.maxX + 30) break;
  }
  return { pts: pts, hit: hit, pull: Math.min(1, len / MAXPULL), ang: Math.atan2(-dy, side === 1 ? dx : -dx) };
}
function drawAim() {
  if (!G.aim) { G.pred = null; return; }
  const side = curSide(), R = restPos(side), [rx, ry] = w2s(R.x, R.y);
  // reach circle: how far you can pull
  ctx.setLineDash([Math.max(4, ppm * 0.15), Math.max(4, ppm * 0.15)]);
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(2, ppm * 0.045);
  ctx.beginPath(); ctx.arc(rx, ry, MAXPULL * ppm, 0, 6.28); ctx.stroke(); ctx.setLineDash([]);
  if (!G.pred || G.predDirty || G.realT - (G.predAt || 0) > 0.08) {
    G.pred = predictShot(G.mode === 'pvp' ? 0.9 : 3.2);
    G.predAt = G.realT; G.predDirty = false;
  }
  const P = G.pred;
  if (!P) {
    ctx.font = Math.max(13, ppm * 0.44) + 'px Lilita One, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = '#3a2410'; ctx.strokeText('PULL BACK', rx, ry - ppm * 1.1); ctx.fillStyle = '#fff'; ctx.fillText('PULL BACK', rx, ry - ppm * 1.1);
    return;
  }
  // dotted arc, one dot every ~0.42 m
  const pts = P.pts, fade = G.mode === 'pvp';
  let run = 0, total = 0;
  for (let k = 1; k < pts.length; k++) total += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
  let dist = 0;
  for (let k = 1; k < pts.length; k++) {
    const seg = Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
    run += seg; dist += seg;
    if (run < 0.42) continue;
    run = 0;
    const [sx, sy] = w2s(pts[k].x, pts[k].y), u = dist / Math.max(total, 0.01), a = fade ? 1 - u : 1 - u * 0.28;
    const r = Math.max(2.8, ppm * (0.095 - u * 0.03));
    // Crisp outer shadow
    ctx.fillStyle = 'rgba(20,10,0,' + (0.52 * a).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(sx + 1, sy + 1.5, r + 0.8, 0, 6.28); ctx.fill();
    // Inner vibrant core
    ctx.fillStyle = 'rgba(255,255,255,' + (0.98 * a).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.28); ctx.fill();
    // Glow core on apex
    if (k > pts.length - 8) {
      ctx.fillStyle = 'rgba(255,230,100,' + (0.85 * a).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(sx, sy, r * 0.55, 0, 6.28); ctx.fill();
    }
  }
  // landing target / high-clarity crosshair
  if (P.hit && !fade) {
    const [hx, hy] = w2s(P.hit.x, P.hit.y), rad = Math.max(12, ppm * 0.38) * (1 + Math.sin(G.realT * 8) * 0.08);
    const rot = G.realT * 2;
    // Outer drop shadow
    ctx.lineWidth = Math.max(3.2, ppm * 0.08);
    ctx.strokeStyle = 'rgba(20,10,0,.65)'; ctx.beginPath(); ctx.arc(hx + 1, hy + 1.5, rad, 0, 6.28); ctx.stroke();
    // Bright golden outer ring
    ctx.strokeStyle = '#ffd83a'; ctx.beginPath(); ctx.arc(hx, hy, rad, 0, 6.28); ctx.stroke();
    // Inner pulsing bullseye
    ctx.fillStyle = 'rgba(255,60,60,.4)'; ctx.beginPath(); ctx.arc(hx, hy, rad * 0.45, 0, 6.28); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, ppm * 0.05);
    // Rotating crosshair notches
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(rad * 0.6, 0); ctx.lineTo(rad * 1.35, 0); ctx.stroke();
    }
    ctx.restore();
  }
  // power + angle readout
  const pct = Math.round(P.pull * 100), deg = Math.round(P.ang * 180 / Math.PI), txt = pct + '%  ' + deg + '°';
  const fs = Math.max(13, ppm * 0.42), lx = rx, ly = ry - MAXPULL * ppm - fs * 0.95;
  ctx.font = fs + 'px Lilita One, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(txt).width + fs * 1.1;
  ctx.fillStyle = 'rgba(40,25,10,.75)'; rr(lx - tw / 2, ly - fs * 0.75, tw, fs * 1.5, fs * 0.75); ctx.fill();
  ctx.fillStyle = pct >= 95 ? '#ff8a5a' : pct >= 60 ? '#ffe36a' : '#bff59a'; ctx.fillText(txt, lx, ly + fs * 0.04);
}
function drawAbilityRing() {
  const p = abilityProj(); if (!p) return;
  const pos = p.body.getPosition(), [sx, sy] = w2s(pos.x, pos.y), R = p.r * ppm * (2 + Math.sin(G.realT * 12) * 0.3);
  ctx.strokeStyle = 'rgba(255,230,120,.95)'; ctx.lineWidth = Math.max(2, ppm * 0.07);
  ctx.beginPath(); ctx.arc(sx, sy, R, 0, 6.28); ctx.stroke();
}
function supportY(x, y) { let s = 0; for (const t of terrain) if (x >= t.x0 && x <= t.x1 && t.h <= y + 0.05 && t.h > s) s = t.h; return s; }
function drawShadows() {
  ctx.fillStyle = '#1e140a';
  for (const e of ents) {
    if (e.removed || e.kind === 'balloon') continue;
    const p = e.body.getPosition(), a = e.body.getAngle();
    const half = (e.kind === 'enemy' || e.kind === 'proj' || e.round) ? e.r : Math.abs(e.w / 2 * Math.sin(a)) + Math.abs(e.h / 2 * Math.cos(a));
    const bottom = p.y - half, sy = supportY(p.x, bottom), hgt = bottom - sy;
    if (hgt > 6 || hgt < -0.3) continue;
    const width = ((e.w || 2 * e.r) * 0.55 + 0.12) * ppm * (1 + Math.max(0, hgt) * 0.12), [sx, gy] = w2s(p.x, sy);
    ctx.globalAlpha = 0.24 * (1 - Math.max(0, hgt) / 6);
    ctx.beginPath(); ctx.ellipse(sx, gy + 1, width, Math.max(2, ppm * 0.1), 0, 0, 6.28); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
let vig = null;
function buildVignette() {
  vig = document.createElement('canvas'); vig.width = Math.max(1, Math.round(W / 2)); vig.height = Math.max(1, Math.round(H / 2));
  const g = vig.getContext('2d'), gr = g.createRadialGradient(vig.width / 2, vig.height * 0.45, Math.min(vig.width, vig.height) * 0.35, vig.width / 2, vig.height * 0.5, Math.max(vig.width, vig.height) * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(20,10,0,.28)'); g.fillStyle = gr; g.fillRect(0, 0, vig.width, vig.height);
}
function drawTrails() {
  const colors = { rock: ['rgba(221,226,230,', 'rgba(139,151,160,'], bomb: ['rgba(255,188,65,', 'rgba(255,108,35,'], shuriken: ['rgba(213,250,255,', 'rgba(75,214,247,'], missile: ['rgba(255,222,116,', 'rgba(255,112,45,'], mini: ['rgba(228,253,255,', 'rgba(79,217,247,'] };
  const dot = (points, alpha, type) => {
    const pal = colors[type] || colors.rock;
    for (let k = 0; k < points.length; k++) {
      const q = points[k], [sx, sy] = w2s(q.x, q.y), u = k / Math.max(1, points.length - 1);
      const r = Math.max(1.5, ppm * (0.035 + (1 - u) * 0.05));
      ctx.globalAlpha = alpha * (0.4 + (1 - u) * 0.6);
      ctx.fillStyle = pal[k % 3 === 0 ? 0 : 1] + '0.8)'; ctx.beginPath(); ctx.arc(sx, sy, r * 1.65, 0, 6.28); ctx.fill();
      ctx.fillStyle = pal[0] + '1)'; ctx.beginPath(); ctx.arc(sx, sy, r * 0.62, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  dot(lastTrail, 0.34, lastTrailKind); dot(trail, 0.9, trailKind);
}

/* ---------------- particles & popups ---------------- */
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life += dt;
    if (p.life >= p.max) { parts.splice(i, 1); continue; }
    if (p.t === 'chip') { p.vy -= 12 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.y < 0.03) { p.y = 0.03; p.vy *= -0.3; p.vx *= 0.6; } }
    else if (p.t === 'puff' || p.t === 'fire') { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= Math.pow(0.1, dt); p.vy = p.vy * Math.pow(0.2, dt) + 0.6 * dt; }
    else if (p.t === 'spark') { p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 8 * dt; }
  }
  for (let i = pops.length - 1; i >= 0; i--) { pops[i].t += dt; if (pops[i].t > 1.1) pops.splice(i, 1); }
}
function drawParts() {
  for (const p of parts) {
    const [sx, sy] = w2s(p.x, p.y), u = p.life / p.max;
    if (p.t === 'chip') { ctx.save(); ctx.translate(sx, sy); ctx.rotate(p.rot); ctx.globalAlpha = 1 - Math.max(0, u - 0.7) / 0.3; ctx.fillStyle = p.c; const s = p.s * ppm; ctx.fillRect(-s, -s * 0.6, s * 2, s * 1.2); ctx.restore(); }
    else if (p.t === 'puff') { ctx.globalAlpha = (1 - u) * 0.9; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(sx, sy, p.s * ppm * (0.6 + u * 1.2), 0, 6.28); ctx.fill(); }
    else if (p.t === 'fire') { ctx.globalAlpha = 1 - u; ctx.fillStyle = u < 0.3 ? '#fff3b0' : u < 0.6 ? '#ffb03a' : '#e2552a'; ctx.beginPath(); ctx.arc(sx, sy, p.s * ppm * (0.5 + u), 0, 6.28); ctx.fill(); }
    else if (p.t === 'spark') { ctx.globalAlpha = 1 - u; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(sx, sy, Math.max(1.5, ppm * p.s), 0, 6.28); ctx.fill(); }
    else if (p.t === 'flash') { ctx.globalAlpha = 1 - u; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.s * ppm * 1.4); g.addColorStop(0, 'rgba(255,255,220,1)'); g.addColorStop(0.4, 'rgba(255,200,90,.8)'); g.addColorStop(1, 'rgba(255,150,50,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, p.s * ppm * 1.4, 0, 6.28); ctx.fill(); }
    else if (p.t === 'ring') { ctx.globalAlpha = (1 - u) * 0.8; ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, ppm * 0.12 * (1 - u)); ctx.beginPath(); ctx.arc(sx, sy, p.s * ppm * (0.3 + u * 0.9), 0, 6.28); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const q of pops) {
    const [sx, sy] = w2s(q.x, q.y + q.t * 1.1), u = q.t / 1.1, s = q.big ? ppm * 0.62 : ppm * 0.42;
    const sc = q.t < 0.15 ? q.t / 0.15 * 1.2 : 1;
    ctx.globalAlpha = u > 0.7 ? (1 - u) / 0.3 : 1;
    ctx.font = Math.max(11, s * sc) + 'px Lilita One, sans-serif';
    ctx.lineWidth = Math.max(2, s * 0.18); ctx.strokeStyle = '#3a2410'; ctx.strokeText(q.text, sx, sy); ctx.fillStyle = q.c; ctx.fillText(q.text, sx, sy);
    ctx.globalAlpha = 1;
  }
}
function drawSnow(dt) {
  if (!bg.snow.length) return;
  const isVolcano = G.theme.name === 'VOLCANO';
  for (const f of bg.snow) {
    if (isVolcano) {
      f.y -= f.v * dt * 0.7; if (f.y < 0) f.y += 1;
      f.ph += dt;
      const x = ((f.x * W + Math.sin(f.ph * 1.6) * 12 - camL * ppm * 0.2) % W + W) % W;
      const py = f.y * H;
      const rad = Math.max(1, f.s * 0.9);
      
      // Gentle warm ember spark
      ctx.fillStyle = 'rgba(255, 140, 30, 0.45)';
      ctx.beginPath(); ctx.arc(x, py, rad * 1.8, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#ffe082';
      ctx.beginPath(); ctx.arc(x, py, rad * 0.8, 0, 6.28); ctx.fill();
    } else {
      f.y += f.v * dt; if (f.y > 1) f.y -= 1;
      f.ph += dt;
      const x = ((f.x * W + Math.sin(f.ph) * 12 - camL * ppm * 0.3) % W + W) % W;
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath(); ctx.arc(x, f.y * H, f.s, 0, 6.28); ctx.fill();
    }
  }
}

/* =====================================================================
   RENDER
   ===================================================================== */
function drawEnemyRadar() {
  if (G.mode !== 'campaign' && G.mode !== 'daily') return;
  const [leftEdge, rightEdge] = [camL, camL + viewW()];
  for (const e of ents) {
    if (e.removed || e.dead || e.kind !== 'enemy') continue;
    const p = e.body.getPosition();
    if (p.x < leftEdge - 0.5 || p.x > rightEdge + 0.5) {
      const isRight = p.x > rightEdge;
      const x = isRight ? W - 24 : 24;
      const [_, rawY] = w2s(p.x, p.y);
      const y = clamp(rawY, 70, H - 65);
      const bob = Math.sin(G.realT * 6) * 3;
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 6;
      ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, 6.28); ctx.fill(); ctx.stroke();
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff'; ctx.beginPath();
      if (isRight) { ctx.moveTo(5, 0); ctx.lineTo(-3, -4.5); ctx.lineTo(-3, 4.5); }
      else { ctx.moveTo(-5, 0); ctx.lineTo(3, -4.5); ctx.lineTo(3, 4.5); }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
}

function render(dt) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  let ox = 0, oy = 0;
  if (shake > 0.2) { ox = (Math.random() - 0.5) * shake; oy = (Math.random() - 0.5) * shake; shake *= Math.pow(0.02, dt); } else shake = 0;
  drawBackground(dt);
  ctx.save(); ctx.translate(ox, oy);
  drawGround();
  for (const t of terrain) drawTerrain(t);
  drawShadows();
  drawTrails();
  const sides = G.mode === 'pvp' ? [0, 1] : [0];
  for (const s of sides) drawSlingPart(s, 'back');
  drawQueue();
  for (const e of ents) {
    if (e.removed) continue;
    if (e.kind === 'block' || e.kind === 'debris') drawBlock(e);
    else if (e.kind === 'tnt') drawTNT(e);
    else if (e.kind === 'item') drawItem(e, dt);
    else if (e.kind === 'balloon') drawBalloon(e);
  }
  for (const e of ents) if (!e.removed && e.kind === 'enemy') drawEnemy(e, dt);
  drawLoaded();
  for (const e of ents) if (!e.removed && e.kind === 'proj') drawProj(e);
  for (const s of sides) drawSlingPart(s, 'front');
  drawAbilityRing();
  drawAim();
  drawParts();
  ctx.restore();
  drawEnemyRadar();
  drawSnow(dt);
  if (vig) ctx.drawImage(vig, 0, 0, W, H);
}

/* =====================================================================
   HUD
   ===================================================================== */
function updateHUDScore() {
  $('hScore').textContent = G.score.toLocaleString('en-US');
  const s3 = G.stars[2] || 1;
  $('hFill').style.width = clamp((G.score / s3) * 100, 0, 100) + '%';
  let lit = 0; for (let k = 0; k < 3; k++) if (G.score >= G.stars[k]) lit = k + 1;
  for (let k = 0; k < 3; k++) { const el = $('hs' + (k + 1)); const on = k < lit; if (on && !el.classList.contains('on')) { el.classList.add('on'); audio.star(k); } else if (!on) el.classList.remove('on'); }
  G.starsLit = aliveEnemies() === 0 ? lit : 0;
}
function placeHudStars() { for (let k = 0; k < 3; k++) $('hs' + (k + 1)).style.left = clamp((G.stars[k] / G.stars[2]) * 100, 8, 100) + '%'; }
const PVP_PIG = '<svg class="pvPig" viewBox="0 0 20 20"><circle cx="10" cy="11" r="7.5" fill="#9be36a" stroke="#2e6b1a" stroke-width="1.4"/><circle cx="7" cy="10" r="1.2" fill="#1d2a12"/><circle cx="13" cy="10" r="1.2" fill="#1d2a12"/><ellipse cx="10" cy="13.5" rx="2.4" ry="1.6" fill="#2e6b1a"/></svg>';
function pigRow(n) { return PVP_PIG.repeat(n); }
function updatePvpHUD() {
  $('pv1').querySelector('.pvLeft').innerHTML = pigRow(aliveEnemies(2));
  $('pv2').querySelector('.pvLeft').innerHTML = pigRow(aliveEnemies(1));
  $('pv1').classList.toggle('act', G.turn === 0); $('pv2').classList.toggle('act', G.turn === 1);
  $('pv1').classList.toggle('hide', G.turn !== 0); $('pv2').classList.toggle('hide', G.turn !== 1);
}
const ICON = {};
function projIcon(type) {
  if (ICON[type]) return ICON[type];
  const c = document.createElement('canvas'); c.width = c.height = 96;
  const saved = ctx; ctx = c.getContext('2d');
  drawProjShape(type, 48, type === 'bomb' ? 56 : 48, type === 'missile' ? 24 : 30, type === 'missile' ? -0.6 : 0, null);
  ctx = saved; ICON[type] = c.toDataURL(); return ICON[type];
}
function creatureIcon(canvas) {
  const g = canvas.getContext('2d'), s = canvas.width; g.clearRect(0, 0, s, s);
  const saved = [ctx, ppm, camL, groundY]; ctx = g; ppm = s * 0.9; camL = 0; groundY = s;
  drawEnemy({ body: { getPosition: () => ({ x: 0.555, y: 0.47 }), getAngle: () => 0 }, r: 0.36, blink: 1, hurt: 0, bob: 0, helmet: false, team: 0 }, 0);
  ctx = saved[0]; ppm = saved[1]; camL = saved[2]; groundY = saved[3];
}
let lastCreat = -1;
function updateCreatures() {
  if (G.mode !== 'campaign' && G.mode !== 'daily') return;
  const n = aliveEnemies();
  if (n === lastCreat) return;
  const el = $('hCreat');
  $('hCreatN').textContent = '×' + n; el.classList.toggle('zero', n === 0);
  if (lastCreat >= 0) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  lastCreat = n;
}
let trayKey = '';
function updateTray() {
  const tray = $('ammoTray');
  const list = G.mode === 'pvp' ? (G.loaded ? [G.loaded] : []) : (G.loaded ? [G.loaded] : []).concat(G.ammo);
  const key = G.mode + '|' + (G.loaded || '-') + '|' + list.join(',');
  if (key === trayKey) return; trayKey = key;
  tray.classList.toggle('hide', !list.length || G.mode === 'menu');
  tray.innerHTML = '<span class="lbl">SHOTS</span>' + list.map((t, i) => `<div class="am${i === 0 && G.loaded ? ' cur' : ''}${t !== 'rock' ? ' sp' : ''}" data-idx="${i}" title="${i === 0 ? 'Ready in slingshot' : 'Click to load into slingshot'}"><img src="${projIcon(t)}" alt="${PROJ[t].name}"></div>`).join('');
  tray.querySelectorAll('.am').forEach((el) => {
    el.onclick = (ev) => {
      ev.stopPropagation();
      const idx = parseInt(el.dataset.idx, 10);
      if (idx > 0) swapAmmo(idx - 1);
    };
  });
}
function swapAmmo(queueIdx) {
  if (G.state !== 'play' || G.aim || !G.loaded) return;
  if (queueIdx < 0 || queueIdx >= G.ammo.length) return;
  const prev = G.loaded;
  G.loaded = G.ammo[queueIdx];
  G.ammo[queueIdx] = prev;
  G.loadT = 0;
  audio.load();
  trayKey = '';
  updateTray();
  const P = PROJ[G.loaded];
  if (P.hint) showHint(P.name + ' READY · ' + P.hint);
  else showHint(P.name + ' READY');
}
function abilityProj() { const p = G.proj; return p && !p.used && !p.done && !p.removed && !p.dead && PROJ[p.type].hint ? p : null; }
let abType = '';
function updateAbilityBtn() {
  const p = G.state === 'play' ? abilityProj() : null, b = $('abilityBtn');
  if (!p) { b.classList.remove('on'); return; }
  if (abType !== p.type) { abType = p.type; $('abImg').src = projIcon(p.type); $('abTxt').textContent = p.type === 'bomb' ? 'BOOM!' : p.type === 'shuriken' ? 'SPLIT!' : 'BOOST!'; }
  b.classList.add('on');
}
function showObjective() {
  const n = aliveEnemies(), L = G.mode === 'daily' ? G.dailyConfig : getLevel(G.levelIdx);
  creatureIcon($('objIcon'));
  $('objN').textContent = n + (n === 1 ? ' CREATURE' : ' CREATURES');
  const specials = [...new Set((L.ammo || []).filter((t) => t !== 'rock'))].map((t) => PROJ[t].name);
  $('objective').querySelector('.o1').textContent = G.mode === 'daily' ? 'SHARED DAILY CHALLENGE' : 'DEFEAT ALL';
  $('objSub').textContent = G.mode === 'daily' ? 'Best score wins · replay to improve' : G.levelIdx === 0 ? 'Drag the loaded stone back · release to shoot' : (L.ammo ? L.ammo.length : 3) + ' shots' + (specials.length ? ' · ' + specials.join(', ') : '');
  const o = $('objective'); o.classList.remove('show'); void o.offsetWidth; o.classList.add('show');
}
let hintTimer = 0;
function showHint(t) { const h = $('hint'); if (!t) { h.classList.remove('on'); return; } h.textContent = t; h.classList.add('on'); clearTimeout(hintTimer); hintTimer = setTimeout(() => h.classList.remove('on'), 3200); }
function banner(t) { const b = $('banner'); b.textContent = t; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

/* =====================================================================
   SCREENS
   ===================================================================== */
const SCREENS = ['title', 'levels', 'daily', 'shop', 'pause', 'win', 'fail', 'card', 'pvpWin', 'guideModal'];
function show(id) { for (const s of SCREENS) $(s).classList.toggle('hide', s !== id); }
function hideAll() { for (const s of SCREENS) $(s).classList.add('hide'); }
let fading = false;
function transition(fn) { if (fading) return; fading = true; const f = $('fade'); f.classList.add('on'); setTimeout(() => { fn(); requestAnimationFrame(() => { f.classList.remove('on'); fading = false; }); }, 260); }
function syncSoundIcons() { $('bSoundT').innerHTML = save.sound ? I.soundOn : I.soundOff; $('togSound').classList.toggle('on', save.sound); $('bMusicT').innerHTML = save.music ? I.musicOn : I.musicOff; $('togMusic').classList.toggle('on', save.music); }
function nextLevelToPlay() {
  const maxAvail = Math.max(1, save.unlocked || 1);
  for (let i = 0; i < maxAvail; i++) if (!save.stars[i] && !(save.skipped && save.skipped[i])) return i;
  return maxAvail - 1;
}
function totalStars() { let n = 0; for (const k in save.stars) n += save.stars[k]; return n; }
function utcDay() { return new Date().toISOString().slice(0, 10); }
function dayNumber(key) { return Math.floor(Date.parse(key + 'T00:00:00Z') / 86400000); }
function stringSeed(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function dailyRecord(date) {
  date = date || utcDay();
  const d = save.daily;
  if (d.date !== date) return { date: date, best: 0, stars: 0, claimed: false, total: d.total || 0, lastClear: d.lastClear || '' };
  return d;
}
function dailyWorldIndex(date) { return dayNumber(date) % THEMES.length; }
function dailyRewardFor(stars, items) { return 25 + stars * 12 + Math.min(20, Math.max(0, items) * 2); }
function updateDailyPreview() {
  const d = dailyRecord(), w = dailyWorldIndex(d.date), theme = THEMES[w], c = $('dailyArt'), g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height);
  const sky = g.createLinearGradient(0, 0, 0, c.height); sky.addColorStop(0, theme.sky[0]); sky.addColorStop(0.72, theme.sky[1]); g.fillStyle = sky; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = theme.mid; g.beginPath(); g.ellipse(315, 240, 380, 90, 0, Math.PI, Math.PI * 2); g.fill();
  g.fillStyle = theme.grass; g.fillRect(0, 190, 600, 70); g.fillStyle = theme.dirt; g.fillRect(0, 208, 600, 52);
  const r = mulberry32(stringSeed(d.date)), count = 2 + (dayNumber(d.date) % 3), center = 365;
  g.fillStyle = '#75451f'; g.strokeStyle = '#4c2b14'; g.lineWidth = 3;
  for (let i = 0; i < count; i++) {
    const x = center - 93 + i * (186 / Math.max(1, count - 1)), h = 48 + r() * 25;
    g.fillRect(x - 10, 189 - h, 20, h); g.strokeRect(x - 10, 189 - h, 20, h);
  }
  g.fillStyle = '#c98a4b'; g.fillRect(center - 130, 155, 260, 17); g.strokeRect(center - 130, 155, 260, 17);
  g.fillStyle = '#b6ef72';
  for (let i = 0; i < count; i++) { const x = center - 88 + i * (176 / Math.max(1, count - 1)); g.beginPath(); g.arc(x, 139, 12, 0, 6.28); g.fill(); g.strokeStyle = '#3a6c22'; g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - 4, 136, 3, 0, 6.28); g.arc(x + 4, 136, 3, 0, 6.28); g.fill(); g.fillStyle = '#b6ef72'; }
  g.strokeStyle = '#75451f'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(68, 203); g.lineTo(68, 130); g.lineTo(94, 203); g.stroke();
  g.strokeStyle = '#7b2118'; g.lineWidth = 3; g.beginPath(); g.moveTo(68, 133); g.lineTo(81, 185); g.stroke();
  $('dailyTitle').textContent = d.date === utcDay() ? 'TODAY · ' + theme.name + ' FORTRESS' : theme.name + ' FORTRESS';
  const config = makeDailyConfig(d.date);
  $('dailyRule').textContent = config.title + ' · ' + config.enemies + ' hidden creatures · ' + config.ammo.length + ' shots · one shared puzzle (UTC day)';
  $('dailyStatus').textContent = d.best ? 'Best today: ' + d.best.toLocaleString('en-US') : 'Best today: —';
  $('dailyClaim').textContent = d.claimed ? '✓ TODAY’S REWARD CLAIMED' : 'First clear today earns ' + dailyRewardFor(3, 0) + '–' + dailyRewardFor(3, 5) + ' coins';
  $('dailyNote').textContent = (d.total || 0) + ' daily fortresses cleared · all ammo is loaned for a fair shared challenge';
  [...$('dailyStars').children].forEach((el, i) => { el.classList.toggle('on', i < d.stars); el.innerHTML = STAR; });
  $('bDailyStart').textContent = d.claimed ? 'REPLAY TODAY' : 'PLAY TODAY';
  $('bDailySub').textContent = d.stars ? 'TODAY · ' + d.stars + ' / 3 STARS' : 'TODAY’S SHARED FORTRESS';
}
function makeDailyConfig(date) {
  const day = dayNumber(date), seed = stringSeed('slingshot-daily-' + date), rng = mulberry32(seed);
  const difficulty = 1 + ((day % 3) + 3) % 3, enemies = 2 + difficulty;
  // Every player gets the same daily loadout regardless of campaign unlocks.
  const ammo = difficulty === 1 ? ['rock', 'rock', 'rock'] : difficulty === 2 ? ['rock', 'bomb', 'rock', 'rock'] : ['rock', 'bomb', 'missile', 'rock'];
  return { date: date, day: day, seed: seed, rng: rng, difficulty: difficulty, enemies: enemies, themeIndex: dailyWorldIndex(date), ammo: ammo, title: ['BASIC AIM', 'CHAIN REACTION', 'FORTRESS BREAKER'][difficulty - 1] };
}
function buildDailyWorld(cfg) {
  gameplayRng = mulberry32((cfg.seed ^ 0x51ed270b) >>> 0);
  newWorld();
  G.comboCount = 0; G.comboUntil = 0;
  G.proj = null; G.extras = []; G.aim = null; G.loaded = null; G.afterShot = 0; G.doneT = 0;
  G.score = 0; G.items = 0; G.shots = 0; G.time = 0; G.damageOn = false; G.stateT = 0; userPan = 0;
  G.dailyConfig = cfg; G.dailyDay = cfg.date;
  G.theme = THEMES[cfg.themeIndex]; buildBackground(G.theme, cfg.seed);
  mound(0);
  const b = kit(), r = cfg.rng, d = cfg.difficulty, mat0 = cfg.themeIndex === 2 ? 'ice' : cfg.themeIndex === 1 ? 'stone' : 'wood';
  const mat1 = cfg.themeIndex === 2 ? 'stone' : cfg.themeIndex === 1 ? 'wood' : 'ice';
  const center = 16.3 + r() * 1.5;
  const mainW = 3.6 + r() * 1.2;
  let leftEnemies = cfg.enemies;
  // A compact, vertically layered fort keeps the shared daily puzzle readable.
  const lower = leftEnemies > 3 ? ['e', r() < 0.5 ? 'cake' : 'e'] : 'e';
  leftEnemies -= Array.isArray(lower) ? lower.filter((x) => x === 'e').length : 1;
  const floors = [{ w: mainW, h: 1.35, in: lower, mid: Array.isArray(lower), mat: mat0, beam: mat0 }];
  if (d >= 2) {
    const mid = leftEnemies > 2 ? ['e', 'e'] : leftEnemies > 1 ? ['e', 'gem'] : 'e';
    leftEnemies -= Array.isArray(mid) ? mid.filter((x) => x === 'e').length : 1;
    floors.push({ w: mainW * 0.76, h: 1.2, in: mid, mid: Array.isArray(mid), mat: mat1, beam: mat0 });
  }
  if (d >= 3) {
    const upper = leftEnemies > 1 ? ['e', 'tnt'] : leftEnemies > 0 ? 'e' : 'cake';
    if (Array.isArray(upper)) leftEnemies -= upper.filter((x) => x === 'e').length; else if (upper === 'e') leftEnemies--;
    floors.push({ w: mainW * 0.54, h: 1.15, in: upper, mid: Array.isArray(upper), mat: mat0, beam: mat1 });
  }
  let top = leftEnemies > 0 ? 'e' : (r() < 0.5 ? 'cake' : null);
  if (leftEnemies > 0) leftEnemies--;
  b.fort(center, 0, floors, top);
  if (cfg.enemies >= 4) {
    const side = center + (r() < 0.5 ? -1 : 1) * (3.2 + r() * 0.6);
    const sideTop = leftEnemies > 0 ? 'e' : (r() < 0.5 ? 'gem' : null);
    if (leftEnemies > 0) leftEnemies--;
    const extra = [{ w: 2.2 + r() * 0.45, h: 1.25, in: leftEnemies > 0 ? 'e' : (r() < 0.4 ? 'tnt' : null), mat: mat1, beam: mat0 }];
    if (leftEnemies > 0) leftEnemies--;
    b.fort(side, 0, extra, sideTop);
  }
  while (leftEnemies > 0) {
    const side = center + (r() < 0.5 ? -1 : 1) * (3.1 + r() * 0.35);
    b.fort(side, 0, [{ w: 2.05, h: 1.2, in: 'e', mat: mat1, beam: mat0 }], leftEnemies > 1 ? 'e' : null);
    leftEnemies -= Math.min(2, leftEnemies);
  }
  if (cfg.day % 4 === 0 && cfg.themeIndex !== 1) {
    const bx = center + (r() < 0.5 ? -1 : 1) * 4.1;
    b.balloonPlat(bx, 5.0, 2.4, mat1, 1.4, r() < 0.5 ? 'gem' : 'cake');
  }
  if (!ents.some((e) => e.kind === 'item')) b.item(cfg.day % 5 === 0 ? 'gem' : 'cake', center, 3.25);
  computeExtents();
  settleWorld(60);
  G.levelIdx = 0;
}

function goTitle() {
  G.mode = 'menu'; G.state = 'menu';
  buildLevel(0, true);
  $('hud').classList.add('hide');
  $('tCoins').textContent = save.coins; syncSoundIcons();
  const nxt = nextLevelToPlay();
  if (nxt < 64) {
    const nw = Math.floor(nxt / 16);
    const nlv = (nxt % 16) + 1;
    $('bPlayLv').textContent = THEMES[nw].name + ' · LEVEL ' + nlv;
  } else {
    $('bPlayLv').textContent = 'ENDLESS · LEVEL ' + (nxt - 63);
  }
  updateDailyPreview();
  G.tsTarget = 1; G.timeScale = 1; G.tapTut = null;
  show('title');
}
function showDailyBoard() { updateDailyPreview(); show('daily'); }
let activeWorldTab = 0;
let activeEndlessPage = 0;
let lvToastTimer = null;
function showLvToast(msg) {
  const t = $('lvToast'); if (!t) return;
  t.innerHTML = msg;
  t.classList.remove('hide', 'pop');
  void t.offsetWidth;
  t.classList.add('pop');
  clearTimeout(lvToastTimer);
  lvToastTimer = setTimeout(() => { t.classList.remove('pop'); t.classList.add('hide'); }, 2800);
}

function buildLevelSelect() {
  save.worldChests = save.worldChests || {};
  if (activeWorldTab < 4) {
    G.theme = THEMES[activeWorldTab];
    buildBackground(G.theme, activeWorldTab * 17 + 5);
    document.body.style.background = G.theme.sky[0];
  }
  const tabsWrap = $('worldTabs');
  const worldNames = ['🌲 FOREST', '🏜️ CANYON', '❄️ TUNDRA', '🌋 VOLCANO', '🏰 ENDLESS'];
  tabsWrap.innerHTML = worldNames.map((name, idx) => {
    const isLocked = idx > 0 && idx < 4 && (save.unlocked || 1) <= idx * 16;
    return `<button class="wtab${idx === activeWorldTab ? ' act' : ''}${isLocked ? ' isLocked' : ''}" data-w="${idx}">${isLocked ? '🔒 ' : ''}${name}</button>`;
  }).join('');
  tabsWrap.querySelectorAll('.wtab').forEach((btn) => {
    btn.onclick = () => {
      audio.click();
      const newTab = parseInt(btn.dataset.w, 10);
      activeWorldTab = newTab;
      if (newTab < 4) {
        G.theme = THEMES[newTab];
        buildBackground(G.theme, newTab * 17 + 5);
        document.body.style.background = G.theme.sky[0];
      }
      buildLevelSelect();
    };
  });

  const wrap = $('lvWorlds'); wrap.innerHTML = '';
  const w = activeWorldTab;
  const card = document.createElement('div');
  card.className = 'worldCard w' + w;

  if (w < 4) {
    let gotStars = 0; for (let i = w * 16; i < w * 16 + 16; i++) gotStars += save.stars[i] || 0;
    const canClaim = gotStars >= 36 && !save.worldChests[w];
    const isClaimed = !!save.worldChests[w];
    const chestLabel = isClaimed ? '✓ 36★ CLAIMED' : canClaim ? '🎁 CLAIM 250 COINS' : `★ 36 CHEST (${gotStars}/36)`;
    const chestPct = Math.min(100, Math.round((gotStars / 36) * 100));

    const isWorldLocked = w > 0 && (save.unlocked || 1) <= w * 16;
    const prevRealmName = THEMES[Math.max(0, w - 1)].name;
    const prevRequiredLv = w * 16;
    const lvRemaining = Math.max(1, prevRequiredLv - ((save.unlocked || 1) - 1));

    let lockBannerHTML = '';
    if (isWorldLocked) {
      lockBannerHTML = `
        <div class="realmLockBanner">
          <div class="rlIcon">🔒</div>
          <div class="rlText">
            <div class="rlTitle">LOCKED REALM</div>
            <div class="rlSub">Clear <b>${prevRealmName} Level 16</b> (Level ${prevRequiredLv}) to unlock ${THEMES[w].name}! (<b>${lvRemaining}</b> level${lvRemaining > 1 ? 's' : ''} remaining)</div>
          </div>
          <button class="rlJumpBtn" id="bJumpPrevRealm">PLAY ${prevRealmName}</button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="worldHeader">
        <div class="worldTitle">${THEMES[w].name} REALM</div>
        <div class="worldRight">
          <div class="worldStarsBadge">★ ${gotStars} / 48</div>
          <button class="worldChestBtn${isClaimed ? ' claimed' : canClaim ? ' pulse' : ''}" id="bWorldChest">${chestLabel}</button>
        </div>
      </div>
      <div class="chestProgWrap"><div class="chestProgFill${chestPct >= 100 ? ' full' : ''}" style="width:${chestPct}%"></div></div>
      ${lockBannerHTML}
      <div class="grid" id="worldGrid"></div>
    `;
    const jumpBtn = card.querySelector('#bJumpPrevRealm');
    if (jumpBtn) {
      jumpBtn.onclick = () => {
        audio.click();
        activeWorldTab = w - 1;
        G.theme = THEMES[activeWorldTab];
        buildBackground(G.theme, activeWorldTab * 17 + 5);
        document.body.style.background = G.theme.sky[0];
        buildLevelSelect();
      };
    }
    const chestBtn = card.querySelector('#bWorldChest');
    if (canClaim) {
      chestBtn.onclick = () => {
        audio.chime();
        save.coins += 250;
        save.worldChests[w] = true;
        persist();
        buildLevelSelect();
      };
    }
    const grid = card.querySelector('#worldGrid');
    for (let i = w * 16; i < w * 16 + 16; i++) {
      const b = document.createElement('button');
      const locked = i + 1 > (save.unlocked || 1);
      const realmLv = (i % 16) + 1;
      b.className = 'lv' + (locked ? ' lock' : '') + (i + 1 === (save.unlocked || 1) && !save.stars[i] ? ' cur' : '');
      if (locked) {
        b.innerHTML = '<span class="lvNum">' + realmLv + '</span><span class="lvLockBadge">' + I.lock + '</span>';
        b.onclick = () => {
          audio.tone(130, 0.14, { type: 'triangle', vol: 0.22, to: 80 });
          audio.noise(0.06, { freq: 400, vol: 0.15 });
          b.classList.remove('shake');
          void b.offsetWidth;
          b.classList.add('shake');
          if (isWorldLocked) {
            showLvToast('🔒 Beat ' + prevRealmName + ' Level 16 to unlock ' + THEMES[w].name + '!');
          } else {
            showLvToast('🔒 Complete Level ' + (i) + ' to unlock Level ' + (i + 1) + '!');
          }
        };
      } else {
        const st = save.stars[i] || 0;
        const skipped = !st && save.skipped && save.skipped[i];
        b.innerHTML = '<span>' + realmLv + '</span>' + (skipped ? '<span class="skTag">SKIPPED</span>' : '') + '<span class="st">' + [0, 1, 2].map((k) => '<i class="' + (k < st ? 'on' : '') + '">' + STAR + '</i>').join('') + '</span>';
        b.onclick = () => { audio.init(); audio.click(); transition(() => startLevel(i)); };
      }
      grid.appendChild(b);
    }
  } else {
    // Endless Procedural Siege (Infinite scaling in pages of 16)
    const startEndless = 64;
    const maxUnlockedEndless = Math.max(1, save.endlessUnlocked || 1);
    const maxAvailablePage = Math.floor((maxUnlockedEndless - 1) / 16);
    const maxViewablePage = maxAvailablePage + 1;
    const comingSoonPage = maxViewablePage + 1;

    if (typeof activeEndlessPage !== 'number' || activeEndlessPage < 0) {
      activeEndlessPage = maxAvailablePage;
    }
    if (activeEndlessPage > comingSoonPage) activeEndlessPage = comingSoonPage;

    const pageStart = startEndless + activeEndlessPage * 16;
    const pageEnd = pageStart + 16;
    const displayStartNum = activeEndlessPage * 16 + 1;
    const displayEndNum = displayStartNum + 15;
    const isComingSoon = activeEndlessPage >= comingSoonPage;

    const pageDifficulty = 1 + Math.floor((pageStart - 28) / 4);
    const tierLabel = pageDifficulty <= 1 ? 'STARTING OUT' : pageDifficulty <= 4 ? 'GETTING TOUGH' : pageDifficulty <= 9 ? 'HARD' : pageDifficulty <= 16 ? 'BRUTAL' : 'NIGHTMARE';

    card.innerHTML = `
      <div class="worldHeader">
        <div class="worldTitle">ENDLESS SIEGE</div>
        <div class="worldRight">
          <div class="worldStarsBadge">LV ${displayStartNum}–${displayEndNum}</div>
          <div class="worldStarsBadge diffBadge">⚔ ${tierLabel}</div>
        </div>
      </div>
      <div class="endlessBanner">
        <span class="ebIcon">🏰</span>
        <span class="ebText">Procedural fortresses with infinite scaling. Each fortress is dynamically architected with unique layouts, aerial platforms & physics challenges!</span>
      </div>
      ${isComingSoon
        ? `<div class="comingSoonCard">
             <div class="csIcon">🔒</div>
             <div class="csTitle">COMING SOON</div>
             <div class="csDesc">Conquer previous fortresses to unlock this chapter! New siege pages unlock as you play.</div>
           </div>`
        : `<div class="grid" id="endlessGrid"></div>`}
      <div class="pageControls">
        <button class="pageBtn" id="bEndlessPrev"${activeEndlessPage === 0 ? ' disabled' : ''}>◀ PREV</button>
        <div class="pageIndicator">PAGE ${activeEndlessPage + 1}</div>
        <button class="pageBtn" id="bEndlessNext"${activeEndlessPage >= comingSoonPage ? ' disabled' : ''}>NEXT ▶</button>
      </div>
    `;

    const prevBtn = card.querySelector('#bEndlessPrev');
    if (prevBtn && activeEndlessPage > 0) {
      prevBtn.onclick = () => { audio.click(); activeEndlessPage--; buildLevelSelect(); };
    }
    const nextBtn = card.querySelector('#bEndlessNext');
    if (nextBtn) {
      nextBtn.onclick = () => { audio.click(); activeEndlessPage++; buildLevelSelect(); };
    }

    if (!isComingSoon) {
      const grid = card.querySelector('#endlessGrid');
      for (let i = pageStart; i < pageEnd; i++) {
        const b = document.createElement('button');
        const endlessLv = (i - startEndless) + 1;
        const locked = endlessLv > maxUnlockedEndless;
        b.className = 'lv' + (locked ? ' lock' : '') + (endlessLv === maxUnlockedEndless && !save.stars[i] ? ' cur' : '');
        if (locked) {
          b.innerHTML = '<span class="lvNum">' + endlessLv + '</span><span class="lvLockBadge">' + I.lock + '</span>';
          b.onclick = () => {
            audio.tone(130, 0.14, { type: 'triangle', vol: 0.22, to: 80 });
            audio.noise(0.06, { freq: 400, vol: 0.15 });
            b.classList.remove('shake');
            void b.offsetWidth;
            b.classList.add('shake');
            showLvToast('🔒 Complete Endless Level ' + (endlessLv - 1) + ' to unlock Level ' + endlessLv + '!');
          };
        } else {
          const st = save.stars[i] || 0;
          b.innerHTML = '<span>' + endlessLv + '</span><span class="st">' + [0, 1, 2].map((k) => '<i class="' + (k < st ? 'on' : '') + '">' + STAR + '</i>').join('') + '</span>';
          b.onclick = () => { audio.init(); audio.click(); transition(() => startLevel(i)); };
        }
        grid.appendChild(b);
      }
    }
  }
  wrap.appendChild(card);
  $('lvStars').textContent = totalStars();
}
function drawSlingIcon(canvas, sk) {
  const g = canvas.getContext('2d'), s = canvas.width; g.clearRect(0, 0, s, s); g.lineCap = 'round';
  const line = (x0, y0, x1, y1, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
  const w = s * 0.11;
  for (const [a, b, c, d] of [[s * 0.5, s * 0.92, s * 0.5, s * 0.55], [s * 0.5, s * 0.55, s * 0.25, s * 0.18], [s * 0.5, s * 0.55, s * 0.75, s * 0.18]]) { line(a, b, c, d, w + 4, sk.dark); line(a, b, c, d, w, sk.wood); }
  g.strokeStyle = sk.band; g.lineWidth = s * 0.05; g.beginPath(); g.moveTo(s * 0.25, s * 0.2); g.quadraticCurveTo(s * 0.5, s * 0.42, s * 0.75, s * 0.2); g.stroke();
}
const MAT_ICON = {
  wood: '<svg class="mico" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="9" fill="#c98a4b" stroke="#6b3d17" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4.5" ry="5" fill="#e6b27a" stroke="#6b3d17" stroke-width="1"/><circle cx="12" cy="12" r="1.6" fill="#8a5328"/></svg>',
  stone: '<svg class="mico" viewBox="0 0 24 24"><path d="M5 9l4-5h7l3 4-1 8-6 3-6-3z" fill="#9aa4ae" stroke="#4c535b" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 4l2 6M14 8l-2 5" stroke="#5f6770" stroke-width="1" fill="none"/></svg>',
  ice: '<svg class="mico" viewBox="0 0 24 24" fill="none" stroke="#2f87c4" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/></svg>'
};
function buildShop() {
  $('shCoins').textContent = save.coins;
  const list = $('shopList'); list.innerHTML = '';
  for (const sk of SLINGS) {
    const owned = save.owned.includes(sk.id), eq = save.sling === sk.id;
    const it = document.createElement('div'); it.className = 'item' + (eq ? ' eq' : '');
    const c = document.createElement('canvas'); c.width = c.height = 120; drawSlingIcon(c, sk);
    it.appendChild(c);
    const bWood = (sk.bonus && sk.bonus.wood) ? `+${Math.round((sk.bonus.wood - 1) * 100)}%` : 'Base';
    const bStone = (sk.bonus && sk.bonus.stone) ? `+${Math.round((sk.bonus.stone - 1) * 100)}%` : 'Base';
    const bIce = (sk.bonus && sk.bonus.ice) ? `+${Math.round((sk.bonus.ice - 1) * 100)}%` : 'Base';
    it.insertAdjacentHTML('beforeend', `
      <div class="nm">${sk.name}</div>
      <div class="ds">${sk.desc}</div>
      <div style="width:100%;font-size:calc(var(--u)*1.4);color:#6b4221;font-family:var(--font2);font-weight:700;margin-top:calc(var(--u)*.4);line-height:1.4">
        <div class="mrow">${MAT_ICON.wood} Wood: <b>${bWood}</b></div>
        <div class="mrow">${MAT_ICON.stone} Stone: <b>${bStone}</b></div>
        <div class="mrow">${MAT_ICON.ice} Ice: <b>${bIce}</b></div>
      </div>
    `);
    const btn = document.createElement('button');
    if (eq) { btn.className = 'on'; btn.textContent = 'EQUIPPED'; }
    else if (owned) { btn.className = 'equip'; btn.textContent = 'EQUIP'; btn.onclick = () => { audio.click(); save.sling = sk.id; persist(); buildShop(); }; }
    else { btn.className = 'buy'; btn.innerHTML = '<span class="coin">$</span>' + sk.price; btn.disabled = save.coins < sk.price; btn.onclick = () => { if (save.coins < sk.price) return; audio.chime(); save.coins -= sk.price; save.owned.push(sk.id); save.sling = sk.id; persist(); buildShop(); $('tCoins').textContent = save.coins; }; }
    it.appendChild(btn); list.appendChild(it);
  }
}

let activeGuideTab = 'weapons';
function buildGuide(tab) {
  activeGuideTab = tab || activeGuideTab;
  ['Weapons', 'Materials', 'Tactics'].forEach((name) => {
    const el = $('gtab' + name);
    if (el) el.classList.toggle('act', name.toLowerCase() === activeGuideTab);
  });
  const cont = $('guideContent');
  if (activeGuideTab === 'weapons') {
    cont.innerHTML = `
      <div class="guideCardGrid">
        <div class="guideCard">
          <img src="${projIcon('rock')}" alt="Stone">
          <div class="guideInfo">
            <b>STONE</b>
            Solid heavy rock. Excellent for smashing stone blocks, toppling pillars, and direct hits on creatures.
            <div class="badge">Heavy Blunt Ammo</div>
          </div>
        </div>
        <div class="guideCard">
          <img src="${projIcon('bomb')}" alt="Bomb">
          <div class="guideInfo">
            <b>BOMB</b>
            High-explosive shell. <b>Tap in mid-air</b> or wait for impact to detonate a wide shockwave that flattens towers!
            <div class="badge" style="background:#ff933b;color:#fff">Tap Mid-Air: Explode</div>
          </div>
        </div>
        <div class="guideCard">
          <img src="${projIcon('shuriken')}" alt="Ice Shuriken">
          <div class="guideInfo">
            <b>ICE SHURIKEN</b>
            Aerodynamic star. <b>Tap in mid-air</b> to split into 3 high-speed blades that slice cleanly through Wood and Ice!
            <div class="badge" style="background:#65cbff;color:#004b73">Tap Mid-Air: Split ×3</div>
          </div>
        </div>
        <div class="guideCard">
          <img src="${projIcon('missile')}" alt="Missile">
          <div class="guideInfo">
            <b>MISSILE</b>
            Rocket projectile. <b>Tap in mid-air</b> to ignite thrusters, piercing straight forward through heavy obstacles!
            <div class="badge" style="background:#ff5247;color:#fff">Tap Mid-Air: Boost</div>
          </div>
        </div>
      </div>
    `;
  } else if (activeGuideTab === 'materials') {
    cont.innerHTML = `
      <div class="guideCardGrid">
        <div class="guideCard">
          <div style="width:calc(var(--u)*6.4);height:calc(var(--u)*6.4);background:#c98a4b;border:calc(var(--u)*.3) solid #6b3d17;border-radius:calc(var(--u)*1);display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*3.2);flex:none">🪵</div>
          <div class="guideInfo">
            <b>WOOD</b>
            Standard building material. Vulnerable to Shurikens, Bombs, and direct high-impact stone hits.
          </div>
        </div>
        <div class="guideCard">
          <div style="width:calc(var(--u)*6.4);height:calc(var(--u)*6.4);background:#9aa4ae;border:calc(var(--u)*.3) solid #4c535b;border-radius:calc(var(--u)*1);display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*3.2);flex:none">🪨</div>
          <div class="guideInfo">
            <b>STONE</b>
            Heavy structural blocks. Durable against light strikes. Best broken with Bombs, high-speed stones, or rolling boulders!
          </div>
        </div>
        <div class="guideCard">
          <div style="width:calc(var(--u)*6.4);height:calc(var(--u)*6.4);background:#bfefff;border:calc(var(--u)*.3) solid #356985;border-radius:calc(var(--u)*1);display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*3.2);flex:none">❄️</div>
          <div class="guideInfo">
            <b>ICE</b>
            Slippery frozen slabs. Shatters rapidly under Shuriken blades, dropping towers above them!
          </div>
        </div>
        <div class="guideCard">
          <div style="width:calc(var(--u)*6.4);height:calc(var(--u)*6.4);background:#e8453c;border:calc(var(--u)*.3) solid #5a1510;border-radius:calc(var(--u)*1);display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*2.8);color:#ffe36a;font-family:var(--font);flex:none">TNT</div>
          <div class="guideInfo">
            <b>TNT BARRELS</b>
            Explosive volatility! A single strike triggers a chain-reaction blast that topples nearby columns and eliminates sheltered creatures.
          </div>
        </div>
        <div class="guideCard">
          <div style="width:calc(var(--u)*6.4);height:calc(var(--u)*6.4);background:#ff6f6f;border:calc(var(--u)*.3) solid #8a2020;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:calc(var(--u)*3.2);flex:none">🎈</div>
          <div class="guideInfo">
            <b>BALLOONS</b>
            Holds platforms and sniper nests airborne. Pop the balloon with any projectile to send the platform crashing down!
          </div>
        </div>
      </div>
    `;
  } else {
    cont.innerHTML = `
      <div style="background:#fff;border-radius:calc(var(--u)*1.6);border:calc(var(--u)*.3) solid #d8b88d;padding:calc(var(--u)*1.4);line-height:1.45;color:#5a3717;font-family:var(--font2);font-size:calc(var(--u)*1.7)">
        <div style="margin-bottom:calc(var(--u)*1)">🎯 <b>Target Foundation Weak Points:</b> Look for the lowest vertical columns holding the most weight. Knocking out the base collapses the entire fortress!</div>
        <div style="margin-bottom:calc(var(--u)*1)">⭐ <b>Unused Ammo Bonus:</b> Every projectile left in your queue when all enemies are defeated awards a massive <b>+10,000 bonus points</b>! Clear stages in fewer shots for 3 Gold Stars.</div>
        <div style="margin-bottom:calc(var(--u)*1)">🔄 <b>Tactical Ammo Swapping:</b> Click any projectile waiting in your bottom-left tray to swap it into the slingshot immediately!</div>
        <div style="margin-bottom:calc(var(--u)*1)">🔍 <b>Inspect Before Firing:</b> Tap the 🔍 Inspect button in the top right to survey the fortress, find hidden TNT barrels, and plan your trajectory.</div>
      </div>
    `;
  }
}

/* =====================================================================
   LEVEL FLOW
   ===================================================================== */
function buildLevel(idx, menu) {
  G.dailyConfig = null; G.dailyNewBest = false;
  gameplayRng = mulberry32((0x6d2b79f5 ^ Math.imul(idx + 1, 0x9e3779b1)) >>> 0);
  G.comboCount = 0; G.comboUntil = 0;
  let L = null;
  for (let attempt = 0; ; attempt++) {
    procAttempt = attempt;
    newWorld();
    L = getLevel(idx);
    G.theme = THEMES[L.w % THEMES.length]; buildBackground(G.theme, idx * 31 + 7);
    mound(0);
    L.build(kit());
    computeExtents();
    settleWorld(36);
    if (!L.procedural) break;
    pruneUnreachable();
    if (aliveEnemies() >= 2 || attempt >= 2) break;
  }
  G.shotBudget = Math.min(L.ammo.length, Math.max(2, Math.ceil(aliveEnemies() / 2) + 1));
  G.levelIdx = idx; G.proj = null; G.extras = []; G.aim = null; G.loaded = null; G.pouch = restPos(0);
  G.score = 0; G.items = 0; G.shots = 0; G.time = 0; G.damageOn = false; G.stateT = 0; userPan = 0; G.bonusScore = 0;
  G.milestone50 = false; G.milestone85 = false;

  let totalHp = 0;
  for (const e of ents) {
    if (e.kind === 'block' && e.hp) totalHp += e.hp;
  }
  G.initialBlockHp = Math.max(1, totalHp);
  G.currentBlockHp = totalHp;
  updateDestructionMeter();

  if (menu) { fitCamera(true); document.body.style.background = G.theme.sky[0]; }
}
function updateDestructionMeter() {
  if (G.mode !== 'campaign' && G.mode !== 'daily') return;
  const init = G.initialBlockHp || 1;
  const current = Math.max(0, G.currentBlockHp || 0);
  const pct = clamp(Math.round((1 - current / init) * 100), 0, 100);
  if (pct >= 50 && !G.milestone50) {
    G.milestone50 = true;
    popText(G.maxX * 0.5, G.maxY * 0.6 + 1.2, '50% DEMOLISHED!', '#ffe36a', true);
    audio.bonus();
  }
  if (pct >= 85 && !G.milestone85) {
    G.milestone85 = true;
    popText(G.maxX * 0.5, G.maxY * 0.6 + 1.5, 'TOTAL DESTRUCTION!', '#ff8a5a', true);
    audio.bonus();
  }
  G.destructPct = pct;
}
function starThresholds() {
  let enemyPts = 0, blockPts = 0;
  for (const e of ents) { if (e.kind === 'enemy') enemyPts += 1000; else if (e.kind === 'block') blockPts += e.pts; else if (e.kind === 'item') blockPts += 900; }
  const spec = G.mode === 'daily' && G.dailyConfig ? G.dailyConfig : getLevel(G.levelIdx);
  const spare = Math.max(0, G.ammo.length - 1);
  const s1 = enemyPts, s2 = Math.round((enemyPts + blockPts * 0.25 + 1000 * Math.min(1, spare)) / 100) * 100, s3 = Math.round((enemyPts + blockPts * 0.5 + 2000 * Math.min(1, spare)) / 100) * 100;
  return [s1, Math.max(s1 + 1000, s2), Math.max(s2 + 1500, s3)];
}
function setHudLevel(topText, bottomText) {
  const el = $('hLevel');
  if (!el) return;
  if (!bottomText) el.innerHTML = `<span class="hlNum">${topText}</span>`;
  else el.innerHTML = `<span class="hlWorld">${topText}</span><span class="hlNum">${bottomText}</span>`;
}

function startLevel(idx) {
  G.mode = 'campaign';
  G.dailyConfig = null; G.dailyNewBest = false;
  buildLevel(idx, false);
  const spec = getLevel(idx);
  G.ammo = spec.ammo.slice(0, G.shotBudget);
  G.stars = starThresholds(); G.starsLit = 0; placeHudStars();
  if (idx < 64) {
    const world = Math.floor(idx / 16);
    const realmLv = (idx % 16) + 1;
    setHudLevel(THEMES[world].name, 'LEVEL ' + realmLv);
  } else {
    setHudLevel('ENDLESS', 'LEVEL ' + (idx - 63));
  }
  $('hScoreWrap').classList.remove('hide'); $('hBar').classList.remove('hide'); $('hCreat').classList.remove('hide'); $('hPvp').classList.add('hide');
  lastCreat = -1; trayKey = ''; creatureIcon($('creatIcon')); updateCreatures();
  G.tsTarget = 1; G.timeScale = 1; G.slowEnd = 0; G.tapTut = null; G.pred = null;
  audio.key = [0, 2, -3, -5][spec.w % 4];
  document.body.style.background = G.theme.sky[0];
  hideAll(); $('hud').classList.remove('hide');
  updateHUDScore(); showHint('');
  fitCamera(true); if (!fitsAll) camL = camFor('end');
  G.state = 'intro'; G.stateT = 0;
  const fresh = [...new Set(G.ammo)].find((t) => t !== 'rock' && !save.seen[t]);
  G.pendingCard = fresh || null;
  G.tut = idx === 0 && !save.stars[0];
}
function startDaily() {
  const date = utcDay(), cfg = makeDailyConfig(date);
  const rec = dailyRecord(date); if (rec.date !== save.daily.date) save.daily = rec;
  G.mode = 'daily'; G.dailyConfig = cfg; G.dailyDay = date; G.dailyNewBest = false;
  buildDailyWorld(cfg);
  G.pendingCard = null; G.tut = false;
  G.ammo = cfg.ammo.slice(); G.score = 0; G.items = 0; G.shots = 0; G.dailyReward = 0;
  G.stars = starThresholds(); G.starsLit = 0; placeHudStars();
  setHudLevel('DAILY', 'CHALLENGE');
  $('hScoreWrap').classList.remove('hide'); $('hBar').classList.remove('hide'); $('hCreat').classList.remove('hide'); $('hPvp').classList.add('hide');
  lastCreat = -1; trayKey = ''; creatureIcon($('creatIcon')); updateCreatures();
  G.tsTarget = 1; G.timeScale = 1; G.slowEnd = 0; G.tapTut = null; G.pred = null; G.tut = false;
  audio.key = [0, 2, -3][cfg.themeIndex];
  document.body.style.background = G.theme.sky[0]; hideAll(); $('hud').classList.remove('hide');
  updateHUDScore(); showHint(''); fitCamera(true); if (!fitsAll) camL = camFor('end');
  G.state = 'intro'; G.stateT = 0;
  updateDailyPreview();
}
function beginPlay() {
  G.state = 'play'; G.stateT = 0; G.damageOn = true;
  showObjective();
  loadNext();
  if (TUT[G.levelIdx + 1] && G.tut) showHint(TUT[G.levelIdx + 1]);
}
function showCard(type) {
  G.state = 'card';
  const P = PROJ[type];
  $('cardName').textContent = P.name; $('cardDesc').textContent = P.desc;
  const c = $('cardIcon'), g = c.getContext('2d'); g.clearRect(0, 0, 200, 200);
  const saved = [ctx, ppm]; ctx = g; drawProjShape(type, 100, 100, 58, type === 'missile' ? -0.5 : 0, null); ctx = saved[0];
  show('card');
}
function winLevel() {
  G.state = 'won';
  const idx = G.levelIdx, stars = Math.max(1, G.starsLit);
  let coins = 0, best = G.score, prevBest = 0, prevStars = 0, chapterBonus = 0;
  $('chapterLine').classList.add('hide'); $('winNewChapter').classList.add('hide'); $('winDaily').classList.add('hide');
  if (G.mode === 'daily') {
    const rec = dailyRecord(G.dailyDay); prevBest = rec.best || 0; prevStars = rec.stars || 0;
    G.dailyNewBest = G.score > prevBest;
    rec.best = Math.max(prevBest, G.score); rec.stars = Math.max(rec.stars || 0, stars);
    if (!rec.claimed) {
      coins = dailyRewardFor(stars, G.items);
      rec.claimed = true; rec.total = (rec.total || 0) + 1; rec.lastClear = rec.date;
    }
    save.daily = rec; best = rec.best;
    $('winSign').textContent = 'DAILY FORTRESS';
    $('winDaily').textContent = coins ? 'FIRST CLEAR · TODAY’S REWARD' : G.dailyNewBest ? 'NEW DAILY PERSONAL BEST' : 'FREE REPLAY · NO EXTRA REWARD';
    $('winDaily').classList.remove('hide');
    $('winNew').textContent = 'NEW DAILY BEST!';
  } else {
    const prev = save.stars[idx] || 0; prevStars = prev; prevBest = save.best[idx] || 0; best = Math.max(prevBest, G.score);
    delete save.fails[idx];
    coins = stars * 10 + G.items + (prev === 0 ? 25 : 0);
    save.stars[idx] = Math.max(prev, stars); save.best[idx] = best;
    if (save.skipped) delete save.skipped[idx];
    if (idx >= 64) {
      const endlessNum = idx - 63;
      save.endlessUnlocked = Math.max(save.endlessUnlocked || 1, endlessNum + 1);
    } else {
      save.unlocked = Math.max(save.unlocked || 1, idx + 2);
    }
    const world = Math.floor(idx / 16), isChapterEnd = (idx + 1) % 16 === 0 && idx < 64;
    const realmLv = (idx % 16) + 1;
    if (isChapterEnd && !save.chapterRewards[world]) {
      chapterBonus = 150; coins += chapterBonus; save.chapterRewards[world] = true;
      $('winNewChapter').textContent = THEMES[world].name + ' REALM CONQUERED · +' + chapterBonus + ' COINS';
      $('winNewChapter').classList.remove('hide');
    }
    $('winSign').textContent = isChapterEnd ? THEMES[world].name + ' COMPLETE!' : idx >= 64 ? 'ENDLESS · LEVEL ' + (idx - 63) : THEMES[world].name + ' · LEVEL ' + realmLv;
    $('winNew').textContent = 'NEW BEST!';
    if (isChapterEnd) {
      const nextWorld = world + 1;
      $('chapterLine').textContent = nextWorld < THEMES.length ? 'Next Realm: ' + THEMES[nextWorld].name : 'All 4 Realms conquered! Endless Siege Mode Unlocked!';
      $('chapterLine').classList.remove('hide');
    }
  }
  const recordImproved = prevBest > 0 && G.score > prevBest;
  save.coins += coins;
  persist();
  countUp($('winScore'), G.score, 1000);
  $('winNew').classList.toggle('hide', !recordImproved);
  $('winBestBox').classList.toggle('hide', prevBest === 0);
  $('bWNext').classList.add('pulse');
  $('winBest').textContent = best.toLocaleString('en-US'); $('winCoins').textContent = '+' + coins;
  $('bWNext').style.visibility = G.mode === 'campaign' ? 'visible' : 'hidden';
  $('winSign').textContent = G.mode === 'daily' ? 'DAILY FORTRESS' : $('winSign').textContent;
  $('bWReplay').style.visibility = 'visible';
  if (G.mode === 'daily' && !coins) $('bWReplay').classList.add('pulse');
  else $('bWReplay').classList.remove('pulse');
  updateDailyPreview();
  const st = [...$('winStars').children]; st.forEach((s) => { s.className = ''; });

  // Colorful celebration confetti fireworks
  const cx = G.maxX ? G.maxX * 0.5 : 18;
  for (let k = 0; k < 45; k++) {
    const col = ['#ff4b4b', '#3a8bf5', '#ffd23f', '#44d67c', '#b042ff', '#ff84e8'][k % 6];
    chip(cx + (Math.random() - 0.5) * 8, 2 + Math.random() * 3, col, 2.2);
  }
  for (let k = 0; k < 25; k++) {
    spark(cx + (Math.random() - 0.5) * 6, 3 + Math.random() * 2, 1, '#ffffff');
  }

  show('win'); audio.win();
  const shownStars = G.mode === 'daily' ? Math.max(stars, prevStars) : stars;
  st.forEach((s, k) => setTimeout(() => { s.className = k < shownStars ? 'lit' : 'off'; if (k < shownStars) audio.star(k); }, 500 + k * 350));
}
function countUp(el, to, ms) {
  const t0 = performance.now();
  const step = (now) => { const u = Math.min(1, (now - t0) / ms), v = Math.round(to * (1 - Math.pow(1 - u, 3))); el.textContent = v.toLocaleString('en-US'); if (u < 1 && G.state === 'won') requestAnimationFrame(step); else el.textContent = to.toLocaleString('en-US'); };
  requestAnimationFrame(step);
}
function failLevel() {
  G.state = 'failed';
  const left = aliveEnemies();
  $('failN').textContent = left; $('failInfo').lastChild.textContent = left === 1 ? ' CREATURE LEFT' : ' CREATURES LEFT';
  const failKey = G.mode === 'daily' ? 'daily:' + G.dailyDay : String(G.levelIdx);
  save.fails[failKey] = (save.fails[failKey] || 0) + 1; persist();
  $('bFSkip').classList.toggle('hide', !(G.mode === 'campaign' && save.fails[failKey] >= 2));
  const tips = ['Aim for the base of the tower. It is all about that base!', 'Hit TNT crates to start a chain reaction!', 'Pop the balloons to drop what they hold!', 'Tap in mid-air to use a special weapon\'s power!', 'Shurikens slice wood and ice, stones crush stone.'];
  const contextual = [];
  if (ents.some((e) => e.kind === 'tnt' && !e.dead)) contextual.push('A TNT crate is still standing. Hit it for a chain reaction.');
  if (ents.some((e) => e.kind === 'balloon' && !e.dead)) contextual.push('Pop a balloon to drop the platform it is holding up.');
  if (G.ammo.includes('bomb') || G.loaded === 'bomb') contextual.push('Save the bomb for a packed section. Tap while it flies.');
  if (G.ammo.includes('shuriken') || G.loaded === 'shuriken') contextual.push('Shurikens cut wood and ice. Tap to split at the right moment.');
  contextual.push(tips[Math.min(save.fails[failKey] - 1, tips.length - 1)]);
  $('failTip').textContent = contextual[0];
  const c = $('failArt'), g = c.getContext('2d'); g.clearRect(0, 0, 220, 150);
  const saved = [ctx, ppm, camL, groundY]; ctx = g; ppm = 90; camL = 0; groundY = 150;
  drawEnemy({ body: { getPosition: () => ({ x: 1.22, y: 0.62 }), getAngle: () => 0 }, r: 0.52, blink: 1, hurt: 0, bob: G.time, helmet: false, team: 0 }, 0);
  ctx = saved[0]; ppm = saved[1]; camL = saved[2]; groundY = saved[3];
  show('fail'); audio.fail();
}
function calm() {
  for (let b = world.getBodyList(); b; b = b.getNext()) {
    if (!b.isDynamic() || !b.isAwake()) continue;
    const e = b.getUserData(); if (!e || e.kind === 'balloon') continue;
    const v = b.getLinearVelocity(); if (v.x * v.x + v.y * v.y > 0.09 || Math.abs(b.getAngularVelocity()) > 0.4) return false;
  }
  return true;
}

/* ---------------- 2 players ---------------- */
function pruneArena() {
  const kept = [];
  for (const e of ents.filter(x => x.kind === 'enemy')) {
    const p = e.body.getPosition();
    const crowded = kept.some(o => Math.hypot(o.body.getPosition().x - p.x, o.body.getPosition().y - p.y) < 1.1);
    if (p.y < 0 || crowded || !shotClear(e, e.team === 1 ? 1 : 0)) dropEnemy(e);
    else kept.push(e);
  }
}
function balanceArena() {
  while (aliveEnemies(2) !== aliveEnemies(1)) {
    const big = aliveEnemies(2) > aliveEnemies(1) ? 2 : 1;
    dropEnemy(ents.filter(x => x.kind === 'enemy' && x.team === big).pop());
  }
}
function buildArena() {
  gameplayRng = Math.random;
  G.theme = THEMES[(Math.random() * 3) | 0];
  G.arenaW = 34;
  for (let attempt = 0; ; attempt++) {
    newWorld();
    buildBackground(G.theme, (Math.random() * 1e6) | 0);
    mound(0, 3.4); mound(G.arenaW, 3.4);
    const b = kit(), layouts = [
      (x, dir) => { b.fort(x, 0, [{ w: 2.4, h: 1.3, in: 'e', mat: 'stone', beam: 'wood' }, { w: 2.4, h: 1.2, in: 'e', mat: 'wood' }], 'e'); },
      (x, dir) => { b.fort(x - dir * 1.3, 0, [{ w: 2, h: 1.3, in: 'e', mat: 'wood' }]); b.fort(x + dir * 1.3, 0, [{ w: 2, h: 1.3, in: 'e', mat: 'ice' }, { w: 2, h: 1.2, in: 'e', mat: 'ice' }]); },
      (x, dir) => { b.ground(x - 1.8, x + 1.8, 0.9); b.fort(x, 0.9, [{ w: 3.2, h: 1.3, in: ['e', 'e'], mid: true, mat: 'stone' }], 'e'); }
    ];
    const pick = (Math.random() * layouts.length) | 0;
    layouts[pick](9, 1);
    const n0 = ents.length;
    layouts[pick](G.arenaW - 9, -1);
    ents.forEach((e, i) => { if (e.kind === 'enemy') e.team = i < n0 ? 2 : 1; });
    computeExtents();
    settleWorld(60);
    settleWorld(90);
    pruneArena();
    addArenaPigs(2, 3);
    addArenaPigs(1, 3);
    balanceArena();
    if ((aliveEnemies(2) >= 3 && aliveEnemies(1) >= 3) || attempt >= 15) break;
  }
}
function addArenaPigs(team, n) {
  const side = team === 1 ? 1 : 0, half = G.arenaW / 2;
  for (let k = 0; k < n; k++) {
    const spots = perchCandidates().structure.filter(c => c.x > 7 && c.x < G.arenaW - 7 && (side ? c.x > half : c.x < half));
    let placed = false;
    for (let t = 0; t < 80 && spots.length && !placed; t++) {
      const c = spots[Math.floor(Math.random() * spots.length)];
      kit().enemy(c.x, c.y, Math.random() < 0.5);
      const e = ents[ents.length - 1];
      e.team = team;
      const p = e.body.getPosition();
      const crowded = ents.some(o => o !== e && o.kind === 'enemy' && Math.hypot(o.body.getPosition().x - p.x, o.body.getPosition().y - p.y) < 1.1);
      const inside = obstaclesNow().some(o => o(p.x, p.y + 0.2));
      if (!crowded && !inside && shotClear(e, side)) placed = true;
      else dropEnemy(e);
    }
  }
}
function startPvp() {
  G.mode = 'pvp'; G.turn = G.pvpNextFirst || 0; G.state = 'intro'; G.stateT = 0;
  buildArena();
  const special = ['bomb', 'shuriken', 'missile'];
  const shared = ['rock', special[(Math.random() * 3) | 0], special[(Math.random() * 3) | 0], special[(Math.random() * 3) | 0]];
  G.pvpAmmo = [shared.slice(), shared.slice()];
  G.ammo = G.pvpAmmo[G.turn];
  G.proj = null; G.extras = []; G.aim = null; G.loaded = null; G.time = 0; G.damageOn = false; userPan = 0; G.score = 0; G.shots = 0;
  setHudLevel('PASS & PLAY', '2 PLAYERS');
  $('hScoreWrap').classList.add('hide'); $('hBar').classList.add('hide'); $('hCreat').classList.add('hide'); $('hPvp').classList.remove('hide');
  trayKey = ''; G.tsTarget = 1; G.timeScale = 1; G.slowEnd = 0; G.tapTut = null; G.pred = null;
  document.body.style.background = G.theme.sky[0];
  hideAll(); $('hud').classList.remove('hide'); showHint('');
  fitCamera(true); updatePvpHUD();
  G.pendingCard = null; G.tut = false;
}
function endPvpMatch() {
  const a1 = aliveEnemies(2), a2 = aliveEnemies(1);
  const winner = a1 > a2 ? 1 : a2 > a1 ? 2 : 0;
  const wiped = !a1 || !a2;
  G.pvpNextFirst = winner === 1 ? 1 : 0;
  G.state = 'won';
  $('pvpText').textContent = winner ? (winner === 1 ? 'BLUE' : 'RED') + ' WINS!' : 'DRAW!';
  $('pvpSign').textContent = winner ? 'VICTORY' : 'TIE GAME';
  $('pvpSub').textContent = wiped ? (winner ? 'All enemy creatures defeated.' : 'Both sides were wiped out!') : 'Out of shots — most creatures left wins.';
  show('pvpWin'); audio.win();
}
function pvpNextTurn() {
  if (!aliveEnemies(2) || !aliveEnemies(1)) return endPvpMatch();
  const other = 1 - G.turn;
  const next = G.pvpAmmo[other].length ? other : G.pvpAmmo[G.turn].length ? G.turn : -1;
  if (next < 0) return endPvpMatch();
  G.turn = next; G.ammo = G.pvpAmmo[G.turn];
  updatePvpHUD();
  banner(G.turn === 0 ? 'BLUE' : 'RED');
  G.state = 'play'; G.stateT = 0; userPan = 0;
  loadNext();
}

/* =====================================================================
   UPDATE
   ===================================================================== */
function update(rdt) {
  rdt = Math.min(rdt, 0.033);
  G.realT += rdt;
  if (G.slowEnd && G.realT > G.slowEnd) { G.slowEnd = 0; G.tsTarget = 1; }
  G.timeScale += (G.tsTarget - G.timeScale) * (1 - Math.exp(-rdt * 14));
  const dt = rdt * G.timeScale;
  G.time += dt; G.stateT += rdt;
  const st = G.state;
  if (st === 'menu') { camL = camFor('aim') + Math.sin(G.time * 0.15) * 0.3; updateParts(dt); return; }
  if (st === 'paused' || st === 'card' || st === 'won' || st === 'failed') { updateParts(dt); return; }
  if (st === 'intro') {
    if (G.stateT > (fitsAll ? 0.7 : 2.1)) {
      if (G.pendingCard) { showCard(G.pendingCard); }
      else if (G.mode === 'pvp') { G.state = 'play'; G.damageOn = true; banner(G.turn === 0 ? 'BLUE' : 'RED'); loadNext(); }
      else beginPlay();
    }
  }
  // physics (runs on scaled time for slow motion)
  acc += dt; let steps = 0;
  while (acc >= STEP && steps < MAX_PHYSICS_STEPS) { physicsStep(); acc -= STEP; steps++; }
  if (steps === MAX_PHYSICS_STEPS && acc > STEP * MAX_PHYSICS_STEPS) acc = STEP * MAX_PHYSICS_STEPS;
  // loaded projectile hop / pouch spring
  if (G.loaded && G.loadT < 1) G.loadT += dt / 0.45;
  if (!G.aim) {
    const R = restPos(curSide());
    const springK = 320, damp = Math.exp(-dt * 24);
    G.pouchV.x = (G.pouchV.x + (R.x - G.pouch.x) * springK * dt) * damp;
    G.pouchV.y = (G.pouchV.y + (R.y - G.pouch.y) * springK * dt) * damp;
    G.pouch.x += G.pouchV.x * dt;
    G.pouch.y += G.pouchV.y * dt;
    if (Math.hypot(G.pouch.x - R.x, G.pouch.y - R.y) < 0.002 && Math.hypot(G.pouchV.x, G.pouchV.y) < 0.02) {
      G.pouch.x = R.x; G.pouch.y = R.y; G.pouchV.x = 0; G.pouchV.y = 0;
    }
  }
  // trail
  if (G.proj && !G.proj.removed && !G.proj.hit) { const p = G.proj.body.getPosition(); const l = trail[trail.length - 1]; if (!l || Math.hypot(l.x - p.x, l.y - p.y) > 0.45) trail.push({ x: p.x, y: p.y }); }
  if (G.proj && !G.proj.removed && G.proj.boost > 0 && Math.random() < 0.8) { const p = G.proj.body.getPosition(); puff(p.x - G.proj.dir.x * 0.5, p.y - G.proj.dir.y * 0.5, 1, '#ddd', 0.2, 0.4); }
  // Shots settle and despawn themselves generically in physicsStep; just drop
  // the UI-facing reference once that entity is actually gone.
  if (G.proj && G.proj.removed) G.proj = null;
  if (G.mode === 'campaign' || G.mode === 'daily') campaignFlow(dt); else if (G.mode === 'pvp') pvpFlow(dt);
  updateTapTutorial(rdt);
  updateCreatures(); updateTray(); updateAbilityBtn();
  // tutorial hand
  if (G.tapTut) { /* hand is showing the tap */ }
  else if (G.tut && G.state === 'play' && G.loaded && !G.aim && G.loadT >= 1) {
    const t = (G.time % 2.2) / 2.2, R = restPos(0), a = w2s(R.x, R.y), b = w2s(R.x - 1.3, R.y - 0.55);
    const u = t < 0.2 ? 0 : t < 0.7 ? easeInOut((t - 0.2) / 0.5) : 1, h = $('hand'), hw = h.offsetWidth;
    h.style.opacity = t > 0.85 ? String((1 - t) / 0.15) : '1';
    h.style.transform = 'translate(' + (lerp(a[0], b[0], u) - hw * 0.39) + 'px,' + (lerp(a[1], b[1], u) - hw * 0.05) + 'px) scale(' + (t < 0.2 ? 1.1 - t : 0.92) + ')';
  } else $('hand').style.opacity = '0';
  updateCamera(rdt);
  updateParts(dt);
}
function updateTapTutorial(rdt) {
  const p = G.state === 'play' ? abilityProj() : null;
  if (p && G.mode === 'campaign' && !save.seenTap[p.type] && !p.hit && p.t > 0.3) {
    if (!G.tapTut) { G.tapTut = { t: 0 }; showHint('TAP NOW!'); }
    G.tsTarget = 0.16; G.tapTut.t += rdt;
    const pos = p.body.getPosition(), [sx, sy] = w2s(pos.x, pos.y), h = $('hand'), hw = h.offsetWidth;
    const u = (G.tapTut.t % 0.7) / 0.7, sc = u < 0.25 ? 1.05 - u * 0.6 : 0.9 + (u - 0.25) * 0.33;
    h.style.opacity = '1';
    h.style.transform = 'translate(' + (sx - hw * 0.39 + hw * 0.25) + 'px,' + (sy - hw * 0.05 + hw * 0.3) + 'px) scale(' + sc.toFixed(3) + ')';
  } else if (G.tapTut) { G.tapTut = null; if (!G.slowEnd) G.tsTarget = 1; }
}
function campaignFlow(dt) {
  const st = G.state;
  if (st === 'play') {
    if (aliveEnemies() === 0) { G.state = 'winwait'; G.stateT = 0; showHint(''); G.tsTarget = 0.3; G.slowEnd = G.realT + 0.9; banner('ALL CLEAR!'); return; }
    if (!G.loaded) {
      // No longer waits on the previous shot (G.proj) to finish flying/settling —
      // only the brief pouch-reset animation gates the next load.
      if (G.ammo.length) { G.afterShot = (G.afterShot || 0) + dt; if (G.afterShot > 0.25) loadNext(); }
      else if (!G.proj) { G.state = 'failwait'; G.stateT = 0; }
    }
  } else if (st === 'winwait') {
    if (G.stateT > 1.7 && (calm() || G.stateT > 4)) {
      if (G.proj) clearShot();
      G.state = 'bonus'; G.stateT = 0;
      G.bonusLeft = G.ammo.length + (G.loaded ? 1 : 0);
      G.ammoBonusTotal = G.bonusLeft * 10000;
      G.bonusT = 0.3;
    }
  } else if (st === 'bonus') {
    G.bonusT -= dt;
    if (G.bonusT <= 0) {
      if (G.bonusLeft > 0) {
        let x, y;
        if (G.loaded) { x = G.pouch.x; y = G.pouch.y; G.loaded = null; }
        else { const q = queuePos(G.ammo.length - 1, 0); x = q.x; y = q.y + 0.4; G.ammo.pop(); }
        puff(x, y, 6, '#fff', 0.3, 1.5); spark(x, y, 8, '#ffe36a');
        addScore(1000, x, y + 0.6, '#ffe36a', true); audio.bonus();
        G.bonusLeft--; G.bonusT = 0.42;
      } else { G.bonusT = 99; setTimeout(() => { if (G.state === 'bonus') winLevel(); }, 500); }
    }
  } else if (st === 'failwait') {
    if (aliveEnemies() === 0) { G.state = 'winwait'; G.stateT = 0; return; }
    if (G.stateT > 1.2 && (calm() || G.stateT > 5)) { if (aliveEnemies() === 0) { G.state = 'winwait'; G.stateT = 0; } else failLevel(); }
  }
}
function pvpFlow(dt) {
  updatePvpHUD();
  if (G.state === 'play' && !G.proj && !G.loaded && G.shots) { G.state = 'turnwait'; G.stateT = 0; }
  else if (G.state === 'turnwait') {
    const dying = ents.some(e => e.kind === 'enemy' && e.dead && !e.popReady);
    if (G.stateT > 0.8 && ((calm() && !dying) || G.stateT > 4.5)) pvpNextTurn();
  }
}

/* =====================================================================
   INPUT
   ===================================================================== */
function pointerWorld(e) { return s2w(e.clientX, e.clientY); }
function aimPxPerUnit() { return Math.max(ppm, clamp(Math.min(W, H) * 0.3, 120, 300) / MAXPULL); }
function setAimFromPointer(cx, cy) {
  const k = aimPxPerUnit(), R = restPos(curSide());
  const anchor = w2s(R.x, R.y);
  let dx = (cx - anchor[0]) / k, dy = -(cy - anchor[1]) / k;
  const l = Math.hypot(dx, dy);
  if (l > MAXPULL) { dx *= MAXPULL / l; dy *= MAXPULL / l; }
  G.pouch = { x: R.x + dx, y: Math.max(G.moundH + 0.25, R.y + dy) };
  G.predDirty = true;
  const pull = Math.min(l, MAXPULL) / MAXPULL;
  if (Math.abs(pull - G.lastPull) > 0.12) {
    audio.stretch(pull);
    if (pull > 0.88 && G.lastPull <= 0.88 && navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
    G.lastPull = pull;
  }
}
cv.addEventListener('pointerdown', (e) => {
  audio.init(); audio.startMusic();
  if (inspecting) { inspecting = false; if ($('bInspect')) $('bInspect').classList.remove('act'); userPan = 0; }
  if (G.state === 'intro') { G.stateT = Math.max(G.stateT, 5); return; }
  if (G.state !== 'play') return;
  e.preventDefault();
  // Since a previous shot can still be mid-flight when the next one is ready,
  // a tap on the pouch must always start the next pull rather than detonate
  // whatever the last shot was — only fall back to the ability-tap otherwise.
  if (G.loaded && G.loadT >= 1 && !G.aim) {
    const w = pointerWorld(e), R = restPos(curSide());
    const onPouch = Math.hypot(w.x - G.pouch.x, w.y - G.pouch.y) * ppm < Math.max(76, ppm * 1.6)
      || Math.hypot(w.x - R.x, w.y - R.y) * ppm < Math.max(76, ppm * 1.6);
    if (onPouch) {
      G.aim = { id: e.pointerId };
      G.lastPull = 0;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      setAimFromPointer(e.clientX, e.clientY);
      return;
    }
  }
  const act = abilityProj();
  if (act) { triggerAbility(act); return; }
  if (!fitsAll) { G.pan = { id: e.pointerId, x: e.clientX, cam: camL }; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
}, { passive: false });
window.addEventListener('pointermove', (e) => {
  if (G.aim && e.pointerId === G.aim.id) { setAimFromPointer(e.clientX, e.clientY); return; }
  if (G.pan && e.pointerId === G.pan.id) { userPan = G.pan.cam - (e.clientX - G.pan.x) / ppm; camL = camFor(userPan); }
});
function endPointer(e) {
  if (G.aim && e.pointerId === G.aim.id) { launch(); return; }
  if (G.pan && e.pointerId === G.pan.id) G.pan = null;
}
window.addEventListener('pointerup', endPointer);
window.addEventListener('pointercancel', (e) => { if (G.aim && e.pointerId === G.aim.id) G.aim = null; if (G.pan && e.pointerId === G.pan.id) G.pan = null; });
window.addEventListener('blur', () => { if (G.aim && !G.aim.kb) G.aim = null; G.pan = null; });
$('abilityBtn').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); audio.init(); const p = abilityProj(); if (p) triggerAbility(p); });
$('ammoTray').addEventListener('click', () => { const t = G.loaded; if (t) showHint(PROJ[t].name + (PROJ[t].hint ? ' · ' + PROJ[t].hint : ' · A trusty stone')); });
cv.addEventListener('contextmenu', (e) => e.preventDefault());
function kbAimApply() {
  const R = restPos(curSide()), dir = curSide() === 1 ? -1 : 1, pull = MAXPULL * G.kb.pow;
  G.pouch = { x: R.x - dir * Math.cos(G.kb.ang) * pull, y: Math.max(G.moundH + 0.25, R.y - Math.sin(G.kb.ang) * pull) };
  G.predDirty = true;
}
window.addEventListener('keydown', (e) => {
  const arrows = { ArrowUp: [0.035, 0], ArrowDown: [-0.035, 0], ArrowRight: [0, 0.03], ArrowLeft: [0, -0.03] };
  if (arrows[e.code] && G.state === 'play' && G.loaded && G.loadT >= 1 && (!G.aim || G.aim.kb)) {
    audio.init(); audio.startMusic();
    if (!G.kb) G.kb = { ang: 0.45, pow: 0.8 };
    G.kb.ang = clamp(G.kb.ang + arrows[e.code][0], -0.7, 1.45); G.kb.pow = clamp(G.kb.pow + arrows[e.code][1], 0.25, 1);
    G.aim = { id: 'kb', kb: true }; kbAimApply(); e.preventDefault(); return;
  }
  if ((e.code === 'Space' || e.code === 'Enter') && G.state === 'play') {
    e.preventDefault();
    if (G.aim && G.aim.kb) { launch(); return; }
    const act = abilityProj(); if (act) triggerAbility(act);
    else if (G.loaded && G.loadT >= 1 && !G.aim) { if (!G.kb) G.kb = { ang: 0.45, pow: 0.8 }; G.aim = { id: 'kb', kb: true }; kbAimApply(); }
    return;
  }
  else if (e.code === 'KeyR' && (G.state === 'play' || G.state === 'failwait')) restart();
  else if (e.code === 'Escape') { if (G.state === 'paused') resume(); else if (G.state === 'play' || G.state === 'turnwait') pause(); }
});
window.addEventListener('resize', () => resize());

/* ---------------- buttons ---------------- */
const tap = (id, fn) => $(id).addEventListener('click', () => { audio.init(); audio.click(); fn(); });
let prevState = 'play';
function pause() { if (!['play', 'turnwait', 'winwait', 'failwait', 'bonus', 'intro'].includes(G.state)) return; prevState = G.state; G.state = 'paused'; G.aim = null; syncSoundIcons(); show('pause'); }
function resume() { hideAll(); G.state = prevState; }
function restart() { transition(() => { if (G.mode === 'pvp') startPvp(); else if (G.mode === 'daily') startDaily(); else startLevel(G.levelIdx); }); }
let inspecting = false;
function toggleInspect() {
  if (G.state !== 'play') return;
  inspecting = !inspecting;
  const btn = $('bInspect');
  if (btn) btn.classList.toggle('act', inspecting);
  if (inspecting) {
    userPan = G.maxX - viewW() * 0.72;
    showHint('SCOUTING FORTRESS · TAP INSPECT AGAIN OR DRAG TO AIM');
  } else {
    userPan = 0;
    showHint('');
  }
}
tap('bInspect', toggleInspect);
tap('bPause', pause); tap('bRestart', restart);
tap('bResume', resume); tap('bPRestart', restart);
tap('bGuide', () => { buildGuide('weapons'); show('guideModal'); });
tap('bPGuide', () => { buildGuide('weapons'); show('guideModal'); });
tap('bGuideClose', () => { if (G.state === 'paused') show('pause'); else show('title'); });
tap('gtabWeapons', () => buildGuide('weapons'));
tap('gtabMaterials', () => buildGuide('materials'));
tap('gtabTactics', () => buildGuide('tactics'));
tap('bPLevels', () => transition(() => { if (G.mode === 'pvp' || G.mode === 'daily') goTitle(); else { goTitle(); buildLevelSelect(); show('levels'); } }));
tap('togSound', () => { save.sound = !save.sound; persist(); syncSoundIcons(); });
tap('togMusic', () => { save.music = !save.music; persist(); audio.startMusic(); audio.setMusic(save.music); syncSoundIcons(); });
tap('bMusicT', () => { save.music = !save.music; persist(); audio.startMusic(); audio.setMusic(save.music); syncSoundIcons(); });
tap('bSoundT', () => { save.sound = !save.sound; persist(); syncSoundIcons(); });
tap('bPlay', () => { audio.startMusic(); transition(() => startLevel(nextLevelToPlay())); });
tap('bLevels', () => { audio.startMusic(); buildLevelSelect(); show('levels'); });
tap('bDaily', () => { audio.startMusic(); showDailyBoard(); });
tap('bDailyBack', () => goTitle());
tap('bDailyStart', () => { audio.startMusic(); transition(startDaily); });
tap('b2p', () => transition(startPvp));
tap('bShop', () => { buildShop(); show('shop'); });
tap('tCoinPill', () => { buildShop(); show('shop'); });
tap('bShopClose', () => { $('tCoins').textContent = save.coins; show('title'); });
tap('bLvBack', () => show('title'));
tap('bWLevels', () => { const mode = G.mode; transition(() => { goTitle(); if (mode === 'campaign') { buildLevelSelect(); show('levels'); } }); });
tap('bWReplay', () => { if (G.mode === 'daily') transition(startDaily); else restart(); });
tap('bWNext', () => { if (G.mode === 'campaign') transition(() => startLevel(G.levelIdx + 1)); });
tap('bFLevels', () => { const mode = G.mode; transition(() => { goTitle(); if (mode === 'campaign') { buildLevelSelect(); show('levels'); } }); });
tap('bFRetry', restart);
tap('bFSkip', () => { if (G.mode !== 'campaign') return; const n = G.levelIdx + 1; save.unlocked = Math.max(save.unlocked || 1, n + 1); delete save.fails[String(G.levelIdx)]; save.skipped = save.skipped || {}; save.skipped[G.levelIdx] = true; persist(); transition(() => startLevel(n)); });
let rotDismissed = false;
function checkRotate() { const need = H > W * 1.15 && !rotDismissed && ((window.matchMedia && matchMedia('(pointer: coarse)').matches) || W < 720); $('rotate').classList.toggle('hide', !need); }
tap('bRotOk', () => { rotDismissed = true; checkRotate(); });
tap('bCardOk', () => { save.seen[G.pendingCard] = true; persist(); G.pendingCard = null; hideAll(); beginPlay(); });
tap('bPvAgain', () => transition(startPvp));
tap('bPvMenu', () => transition(goTitle));
document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play' && !G.proj) pause(); });

/* =====================================================================
   MAIN LOOP
   ===================================================================== */
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
  if (!G.freeze) { update(dt); render(dt); }
  audio.tickMusic();
  requestAnimationFrame(frame);
}
resize();
checkRotate();
goTitle();
setLoad(1);
requestAnimationFrame((t) => { last = t; requestAnimationFrame(frame); });
setTimeout(() => $('loading').classList.add('fade'), 200);
}

boot();
})();
