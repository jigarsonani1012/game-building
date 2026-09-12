/* ================================================================
   SHAPEBOUND — The Art of Perfect Shapes · single-file premium logic game
   Sections: CONFIG / UTILS / AUDIO / STATE / SAVE / THEMES /
   RNG+GEN / CANDIDATES / SOLVER / DIFFICULTY / VALIDATION /
   HISTORY / TIMER / HINTS / BOARD / INPUT / UI / MODALS /
  MODES / STATS+ACH / DAILY+SHARE / DEBUG / INIT
================================================================ */
      /* ---------- CONFIG ---------- */
      const DIFFS = ["Beginner", "Easy", "Medium", "Hard", "Expert", "Master"];
      const DIFF_SHORT = ["BEG", "ESY", "MED", "HRD", "EXP", "MST"];

      function campaignSpec(i) {
        if (i < 0) i = 0;
        let w, h, diff;
        if (i < 8) {
          w = (i % 2 === 0) ? 5 : 6;
          h = (i % 3 === 0) ? 5 : 6;
          diff = 0; // Beginner
        } else if (i < 20) {
          w = (i % 2 === 0) ? 6 : 7;
          h = (i % 3 === 0) ? 6 : 7;
          diff = 1; // Easy
        } else if (i < 40) {
          w = (i % 2 === 0) ? 7 : 8;
          h = (i % 3 === 0) ? 7 : 8;
          diff = 2; // Medium
        } else if (i < 70) {
          w = (i % 2 === 0) ? 8 : 9;
          h = (i % 3 === 0) ? 8 : 9;
          diff = 3; // Hard
        } else if (i < 110) {
          w = (i % 2 === 0) ? 9 : 10;
          h = (i % 3 === 0) ? 9 : 10;
          diff = 4; // Expert
        } else {
          const sizes = [10, 11, 12, 13, 14];
          w = sizes[(i * 3) % sizes.length];
          h = sizes[(i * 7) % sizes.length];
          diff = 5; // Master
        }
        return { w, h, diff };
      }

      function getDynamicChapters(maxUnlocked) {
        const visibleMax = Math.max(20, Math.ceil((maxUnlocked + 5) / 10) * 10);
        const chapterDefs = [
          { name: "I · Learn the Language", sub: "5×5 · 6×6 — area is everything", min: 0, max: 7 },
          { name: "II · Form & Edges", sub: "6×6 · 7×7 — walls are clues", min: 8, max: 19 },
          { name: "III · Cross-Constraints", sub: "7×7 · 8×8 — clues talk to each other", min: 20, max: 39 },
          { name: "IV · Narrow Corridors", sub: "8×8 · 9×9 — tight space deduction", min: 40, max: 69 },
          { name: "V · Deep Deduction", sub: "9×9 · 10×10 — think three moves ahead", min: 70, max: 109 },
          { name: "VI · Master Realm", sub: "10×10 · 12×12 — sustained reasoning", min: 110, max: 159 },
          { name: "VII · Infinite Summit", sub: "12×12 · 14×14 — the endless challenge", min: 160, max: Infinity }
        ];

        const chapters = [];
        for (const def of chapterDefs) {
          if (def.min >= visibleMax) break;
          const end = Math.min(def.max, visibleMax - 1);
          const levels = [];
          for (let l = def.min; l <= end; l++) levels.push(l);
          if (levels.length) {
            chapters.push({ name: def.name, sub: def.sub, levels });
          }
        }
        return chapters;
      }
      const THEMES = {
        paper: {
          label: "Paper",
          bg: "#F6F1E7",
          surface: "#FFFDF7",
          board: "#ECE5D3",
          grid: "#D9D1BC",
          strong: "#2A2822",
          text: "#1E1C17",
          clue: "#2A2822",
          accent: "#1E6B52",
          tileFace: "#FFFFFF",
          tileHoverFace: "#EAE3D2",
          tileShadow: "#D6CCB8",
          tileBorder: "rgba(0,0,0,0.06)",
          regions: [
            "#E8D7F5",
            "#FCE1EB",
            "#D7EAF9",
            "#FFE4CD",
            "#D5F3DF",
            "#FFF5C4",
          ],
          "3dRegions": [
            { face: "#E8D7F5", shadow: "#C8AFDF", text: "#3D1E56" },
            { face: "#FCE1EB", shadow: "#EEACC1", text: "#631530" },
            { face: "#D7EAF9", shadow: "#A3C7E9", text: "#0E3C66" },
            { face: "#FFE4CD", shadow: "#F4BA8D", text: "#582B05" },
            { face: "#D5F3DF", shadow: "#9EDDAE", text: "#0F4722" },
            { face: "#FFF5C4", shadow: "#E2D078", text: "#4D4103" },
          ],
          lock: 0,
        },
      };

      /* ---------- UTILS ---------- */
      const $ = (s) => document.querySelector(s),
        $$ = (s) => [...document.querySelectorAll(s)];
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      function hashStr(s) {
        let h = 2166136261;
        for (let i = 0; i < s.length; i++) {
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return h >>> 0;
      }
      function mulberry32(a) {
        return function () {
          a |= 0;
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }
      function fmtTime(ms) {
        if (ms == null || !isFinite(ms)) return "—";
        const s = Math.floor(ms / 1000);
        return (
          String(Math.floor(s / 60)).padStart(2, "0") +
          ":" +
          String(s % 60).padStart(2, "0")
        );
      }
      function dateKey(d = new Date()) {
        return (
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0")
        );
      }
      function addDays(key, n) {
        const d = new Date(key + "T12:00:00");
        d.setDate(d.getDate() + n);
        return dateKey(d);
      }
      function dayNum(key) {
        const a = new Date("2024-01-01T12:00:00"),
          b = new Date(key + "T12:00:00");
        return Math.round((b - a) / 864e5) + 1;
      }
      function announce(msg) {
        const el = $("#srLive");
        el.textContent = "";
        requestAnimationFrame(() => (el.textContent = msg));
        if (S.save.settings.sr) {
          /* also toast-lite */
        }
      }
      function copyText(t) {
        if (navigator.clipboard && navigator.clipboard.writeText)
          return navigator.clipboard
            .writeText(t)
            .then(() => true)
            .catch(() => fallbackCopy(t));
        return Promise.resolve(fallbackCopy(t));
      }
      function fallbackCopy(t) {
        try {
          const ta = document.createElement("textarea");
          ta.value = t;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          return true;
        } catch (e) {
          return false;
        }
      }
      function animate(el, vars) {
        try {
          if (window.gsap && !S.save.settings.reducedMotion) {
            const cb = vars.onComplete;
            const v = Object.assign({}, vars, {
              onComplete: () => {
                if (el && el.style) {
                  el.style.transform = "";
                  el.style.opacity = "";
                }
                if (cb) cb();
              },
            });
            gsap.to(el, v);
            return;
          } else {
            if (el && el.style) {
              if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
              if (vars.y !== undefined)
                el.style.transform = `translateY(${vars.y}px)`;
            }
            if (vars.onComplete) vars.onComplete();
          }
        } catch (e) {
          if (vars.onComplete) vars.onComplete();
        }
      }
      function animateFrom(el, vars) {
        try {
          if (window.gsap && !S.save.settings.reducedMotion) {
            const cb = vars.onComplete;
            const v = Object.assign({}, vars, {
              onComplete: () => {
                if (el && el.style) {
                  el.style.transform = "";
                  el.style.opacity = "";
                }
                if (cb) cb();
              },
            });
            gsap.from(el, v);
            return;
          } else {
            if (el && el.style) {
              if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
              if (vars.y !== undefined)
                el.style.transform = `translateY(${vars.y}px)`;
            }
            if (vars.onComplete) vars.onComplete();
          }
        } catch (e) {
          if (vars.onComplete) vars.onComplete();
        }
      }
      /* ---------- AUDIO ---------- */
      const AudioSys = {
        ctx: null,
        master: null,
        ambGain: null,
        ambOsc: null,
        init() {
          if (this.ctx) return;
          try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.master = this.ctx.createGain();
            this.master.gain.value = S.save.settings.sound
              ? S.save.settings.vol / 100
              : 0;
            this.master.connect(this.ctx.destination);
            this.ambGain = this.ctx.createGain();
            this.ambGain.gain.value = 0;
            this.ambGain.connect(this.ctx.destination);
            this.startAmbient();
          } catch (e) {}
        },
        resume() {
          try {
            if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
          } catch (e) {}
        },
        startAmbient() {
          try {
            if (!this.ctx || this.ambOsc) return;
            const o = this.ctx.createOscillator(),
              o2 = this.ctx.createOscillator(),
              g = this.ctx.createGain();
            o.type = "sine";
            o.frequency.value = 110;
            o2.type = "sine";
            o2.frequency.value = 164.8;
            g.gain.value = 0.015;
            const tg = (S.save.settings.amb / 100) * 0.05;
            o.connect(g);
            o2.connect(g);
            g.connect(this.ambGain);
            this.ambGain.gain.value = S.save.settings.sound ? tg : 0;
            o.start();
            o2.start();
            this.ambOsc = [o, o2];
          } catch (e) {}
        },
        setVolumes() {
          if (!this.ctx) return;
          const s = S.save.settings;
          try {
            this.master.gain.value = s.sound ? s.vol / 100 : 0;
            this.ambGain.gain.value = s.sound ? (s.amb / 100) * 0.05 : 0;
          } catch (e) {}
        },
        tone(f, d = 0.08, type = "sine", v = 0.2, slide = 0, delay = 0) {
          if (!S.save.settings.sound) return;
          this.init();
          this.resume();
          if (!this.ctx) return;
          try {
            const t = this.ctx.currentTime + delay,
              o = this.ctx.createOscillator(),
              g = this.ctx.createGain();
            o.type = type;
            o.frequency.setValueAtTime(f, t);
            if (slide)
              o.frequency.exponentialRampToValueAtTime(
                Math.max(40, f + slide),
                t + d,
              );
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(v, t + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, t + d);
            o.connect(g);
            g.connect(this.master);
            o.start(t);
            o.stop(t + d + 0.02);
          } catch (e) {}
        },
        play(n) {
          if (!S.save.settings.sound) return;
          switch (n) {
            case "click":
              this.tone(620, 0.05, "sine", 0.12);
              break;
            case "place":
              this.tone(420, 0.09, "triangle", 0.22, 180);
              this.tone(840, 0.07, "sine", 0.08, 0, 0.03);
              break;
            case "invalid":
              this.tone(210, 0.12, "sine", 0.1, -40);
              break;
            case "delete":
              this.tone(330, 0.08, "sine", 0.14, -120);
              break;
            case "hint":
              this.tone(740, 0.14, "sine", 0.14, 160);
              this.tone(990, 0.12, "sine", 0.08, 0, 0.08);
              break;
            case "select":
              this.tone(560, 0.04, "sine", 0.07);
              break;
            case "win":
              [523, 659, 784, 1046].forEach((f, i) =>
                this.tone(f, 0.22, "triangle", 0.16, 0, i * 0.09),
              );
              break;
            case "ach":
              this.tone(880, 0.16, "sine", 0.14, 220);
              break;
            case "daily":
              [392, 523, 659, 784, 1046].forEach((f, i) =>
                this.tone(f, 0.2, "sine", 0.13, 0, i * 0.08),
              );
              break;
          }
        },
      };
      /* ---------- STATE ---------- */
      const S = {
        view: "home",
        mode: null,
        puzzle: null,
        playerRects: [],
        selectedId: null,
        anchor: null,
        draft: null,
        hoverCell: null,
        dragging: false,
        dragStart: null,
        hintFx: null,
        hintFxUntil: 0,
        assistCands: [],
        cursor: { x: 0, y: 0 },
        cursorOn: false,
        completed: false,
        paused: false,
        hintsUsed: 0,
        mistakes: 0,
        startStamp: 0,
        streakRun: 0,
        countdownMs: 0,
        countdownOn: false,
        timerAccum: 0,
        timerRunning: false,
        timerStart: 0,
        rectId: 1,
        winShown: false,
        genToken: 0,
        save: null,
        boardGeom: { cell: 30, ox: 0, oy: 0, w: 0, h: 0, dpr: 1 },
        pal: THEMES.paper,
      };
      function defaultSave() {
        return {
          v: 1,
          theme: "paper",
          settings: {
            input: "auto",
            strict: true,
            showErrors: true,
            assist: false,
            confirmReset: true,
            hintsInChallenge: true,
            lines: 1,
            tint: 70,
            comfort: false,
            sound: true,
            vol: 70,
            amb: 30,
            reducedMotion:
              window.matchMedia &&
              matchMedia("(prefers-reduced-motion: reduce)").matches,
            colorblind: false,
            largeText: false,
            sr: false,
          },
          stats: {
            solved: 0,
            totalMs: 0,
            fastest: Infinity,
          },
          campaign: {
            completed: [],
            best: {},
            hints: {},
            hintFree: {},
          },
          daily: { streak: 0, longest: 0, lastSolved: null, solved: {} },
          cache: {},
        };
      }
      /* ---------- SAVE SYSTEM ---------- */
      const LS_KEY = "shapebound_save_v1";
      const LEGACY_LS_KEY = "parcel_save_v1";
      let storageOK = true,
        saveTimer = null;
      function loadSave() {
        try {
          let raw = localStorage.getItem(LS_KEY);
          if (!raw) raw = localStorage.getItem(LEGACY_LS_KEY);
          if (!raw) {
            S.save = defaultSave();
            return;
          }
          const p = JSON.parse(raw);
          const d = defaultSave();
          S.save = Object.assign(d, p);
          S.save.settings = Object.assign(d.settings, p.settings || {});
          S.save.stats = Object.assign(d.stats, p.stats || {});
          S.save.campaign = Object.assign(d.campaign, p.campaign || {});
          S.save.daily = Object.assign(d.daily, p.daily || {});
          // strip orphaned fields that may exist in older saves
          delete S.save.profile;
          delete S.save.ach;
          delete S.save.xp;
          delete S.save.current;
          delete S.save.campaign.recent;
          if (!Array.isArray(S.save.campaign.completed))
            S.save.campaign.completed = [];
        } catch (e) {
          storageOK = false;
          S.save = defaultSave();
          toast("Save data was corrupted — started fresh (session only).", "⚠");
        }
      }
      function persist(immediate) {
        $("#saveTxt").textContent = "Saving…";
        const write = () => {
          if (!storageOK) return;
          try {
            localStorage.setItem(LS_KEY, JSON.stringify(S.save));
            $("#saveTxt").textContent = "Saved";
          } catch (e) {
            storageOK = false;
            $("#saveTxt").textContent = "Session only";
          }
        };
        if (immediate) {
          clearTimeout(saveTimer);
          write();
        } else {
          clearTimeout(saveTimer);
          saveTimer = setTimeout(write, 400);
        }
      }
      /* ---------- THEMES ---------- */
      function applyTheme() {
        S.save.theme = "paper";
        S.pal = THEMES.paper;
        document.documentElement.dataset.theme = "paper";
        document.querySelector('meta[name="theme-color"]').content = S.pal.bg;
        const b1 = $("#blob1"),
          b2 = $("#blob2");
        if (b1 && b2) {
          b1.style.cssText = `width:44vmax;height:44vmax;left:-10vmax;top:-12vmax;background:radial-gradient(circle, ${S.pal.accent}33 0%, transparent 70%)`;
          b2.style.cssText = `width:38vmax;height:38vmax;right:-8vmax;bottom:-10vmax;background:radial-gradient(circle, ${S.pal.accent}22 0%, transparent 70%)`;
          if (S.save.settings.reducedMotion) {
            b1.style.display = "none";
            b2.style.display = "none";
          } else {
            b1.style.display = "";
            b2.style.display = "";
          }
        }
        drawBoard();
      }
      function themeUnlocked(k) {
        const t = THEMES[k];
        if (!t.lock) return true;
        return (S.save.stats.solved || 0) >= t.lock;
      }
      /* ---------- RNG + GENERATION ---------- */
      function factorPairs(n) {
        const out = [];
        for (let d = 1; d * d <= n; d++)
          if (n % d === 0) {
            out.push([d, n / d]);
            if (d * d !== n) out.push([n / d, d]);
          }
        return out;
      }
      function generatePartition(W, H, rng, opts = {}) {
        const maxArea = opts.maxArea || 8,
          minKeep =
            opts.minCount || Math.max(3, Math.round((W * H) / (opts.avg || 4.5)));
        let rects = [{ x: 0, y: 0, w: W, h: H }];
        let guard = 0;
        const needSplit = (r) => r.w * r.h > maxArea;
        while (guard++ < 400) {
          let idx = -1;
          for (let k = 0; k < rects.length; k++)
            if (needSplit(rects[k])) {
              idx = k;
              break;
            }
          if (idx === -1) {
            if (rects.length >= minKeep) break;
            let bi = 0,
              ba = 0;
            rects.forEach((r, i) => {
              const a = r.w * r.h;
              if (a > ba && a > 2) {
                ba = a;
                bi = i;
              }
            });
            if (ba <= 2) break;
            idx = bi;
          }
          const r = rects[idx];
          const canV = r.w >= 2,
            canH = r.h >= 2;
          if (!canV && !canH) break;
          let vert;
          if (!canV) vert = false;
          else if (!canH) vert = true;
          else {
            if (r.w > r.h) vert = rng() < 0.72;
            else if (r.h > r.w) vert = rng() < 0.28;
            else vert = rng() < 0.5;
          }
          let r1, r2;
          if (vert) {
            if (r.w < 2) continue;
            const k = 1 + Math.floor(rng() * (r.w - 1));
            r1 = { x: r.x, y: r.y, w: k, h: r.h };
            r2 = { x: r.x + k, y: r.y, w: r.w - k, h: r.h };
          } else {
            if (r.h < 2) continue;
            const k = 1 + Math.floor(rng() * (r.h - 1));
            r1 = { x: r.x, y: r.y, w: r.w, h: k };
            r2 = { x: r.x, y: r.y + k, w: r.w, h: r.h - k };
          }
          if (r1.w * r1.h < 1 || r2.w * r2.h < 1) continue;
          rects.splice(idx, 1, r1, r2);
        }
        return rects;
      }
      function cluesForPartition(rects, rng) {
        return rects.map((r) => ({
          x: r.x + Math.floor(rng() * r.w),
          y: r.y + Math.floor(rng() * r.h),
          value: r.w * r.h,
        }));
      }
      /* ---------- CANDIDATES ---------- */
      function candidatesForClue(W, H, clues, i) {
        const c = clues[i],
          N = c.value,
          out = [];
        const pairs = factorPairs(N);
        for (const [w, h] of pairs) {
          if (w > W || h > H) continue;
          for (let x = c.x - w + 1; x <= c.x; x++) {
            if (x < 0 || x + w > W) continue;
            for (let y = c.y - h + 1; y <= c.y; y++) {
              if (y < 0 || y + h > H) continue;
              let ok = true;
              for (let j = 0; j < clues.length; j++) {
                if (j === i) continue;
                const o = clues[j];
                if (o.x >= x && o.x < x + w && o.y >= y && o.y < y + h) {
                  ok = false;
                  break;
                }
              }
              if (!ok) continue;
              const cells = [];
              for (let yy = y; yy < y + h; yy++)
                for (let xx = x; xx < x + w; xx++) cells.push(yy * W + xx);
              out.push({ x, y, w, h, clue: i, cells });
            }
          }
        }
        return out;
      }
      function allCandidates(p) {
        return p.clues.map((_, i) => candidatesForClue(p.w, p.h, p.clues, i));
      }
      /* ---------- SOLVER ---------- */
      function countSolutions(
        puzzle,
        limit = 2,
        maxNodes = 25000,
        fixed = null,
      ) {
        const W = puzzle.w,
          H = puzzle.h,
          clues = puzzle.clues,
          n = clues.length;
        const cands = allCandidates(puzzle);
        for (const l of cands)
          if (l.length === 0) return { count: 0, nodes: 0, aborted: false };
        const grid = new Int16Array(W * H).fill(-1);
        const used = new Array(n).fill(false);
        let covered = 0;
        if (fixed && fixed.length) {
          for (const f of fixed) {
            const cells = [];
            for (let y = f.y; y < f.y + f.h; y++)
              for (let x = f.x; x < f.x + f.w; x++) {
                const idx = y * W + x;
                if (grid[idx] !== -1)
                  return { count: 0, nodes: 0, aborted: false };
                grid[idx] = f.clue;
                cells.push(idx);
              }
            used[f.clue] = true;
            covered += f.w * f.h;
          }
        }
        let count = 0,
          nodes = 0,
          aborted = false;
        const total = W * H;
        const sol = [];
        function overlaps(c) {
          const cl = c.cells;
          for (let k = 0; k < cl.length; k++)
            if (grid[cl[k]] !== -1) return true;
          return false;
        }
        function place(c, v) {
          const cl = c.cells;
          for (let k = 0; k < cl.length; k++) grid[cl[k]] = v;
        }
        function unplace(c) {
          const cl = c.cells;
          for (let k = 0; k < cl.length; k++) grid[cl[k]] = -1;
        }
        function dfs(cov) {
          if (count >= limit || aborted) return true;
          if (++nodes > maxNodes) {
            aborted = true;
            return true;
          }
          if (cov === total) {
            count++;
            return count >= limit;
          }
          let idx = -1;
          for (let i = 0; i < total; i++)
            if (grid[i] === -1) {
              idx = i;
              break;
            }
          const cx = idx % W,
            cy = (idx / W) | 0;
          for (let i = 0; i < n; i++) {
            if (used[i]) continue;
            const lst = cands[i];
            for (let k = 0; k < lst.length; k++) {
              const c = lst[k];
              if (cx < c.x || cx >= c.x + c.w || cy < c.y || cy >= c.y + c.h)
                continue;
              if (overlaps(c)) continue;
              used[i] = true;
              place(c, i);
              sol.push(c);
              if (dfs(cov + clues[i].value)) {
                /* unwind one level for correctness when limit hit */
              }
              sol.pop();
              unplace(c);
              used[i] = false;
              if (count >= limit || aborted) return true;
            }
          }
          return false;
        }
        dfs(covered);
        return { count, nodes, aborted };
      }
      function solveOne(puzzle, maxNodes = 80000, fixed = null) {
        const W = puzzle.w,
          H = puzzle.h,
          clues = puzzle.clues,
          n = clues.length;
        const cands = allCandidates(puzzle);
        for (const l of cands) if (!l.length) return null;
        const grid = new Int16Array(W * H).fill(-1);
        const used = new Array(n).fill(false);
        let covered = 0;
        const path = [];
        if (fixed)
          for (const f of fixed) {
            for (let y = f.y; y < f.y + f.h; y++)
              for (let x = f.x; x < f.x + f.w; x++) grid[y * W + x] = f.clue;
            used[f.clue] = true;
            covered += f.w * f.h;
            path.push({ x: f.x, y: f.y, w: f.w, h: f.h, clue: f.clue });
          }
        let nodes = 0,
          found = null;
        const total = W * H;
        const overlaps = (c) => {
          for (const i of c.cells) if (grid[i] !== -1) return true;
          return false;
        };
        function dfs(cov) {
          if (found || nodes > maxNodes) return true;
          nodes++;
          if (cov === total) {
            found = path.slice();
            return true;
          }
          let idx = -1;
          for (let i = 0; i < total; i++)
            if (grid[i] === -1) {
              idx = i;
              break;
            }
          const cx = idx % W,
            cy = (idx / W) | 0;
          const order = [];
          for (let i = 0; i < n; i++) if (!used[i]) order.push(i);
          order.sort((a, b) => cands[a].length - cands[b].length);
          for (const i of order) {
            for (const c of cands[i]) {
              if (cx < c.x || cx >= c.x + c.w || cy < c.y || cy >= c.y + c.h)
                continue;
              if (overlaps(c)) continue;
              used[i] = true;
              for (const k of c.cells) grid[k] = i;
              path.push(c);
              if (dfs(cov + clues[i].value)) return true;
              path.pop();
              for (const k of c.cells) grid[k] = -1;
              used[i] = false;
              if (found) return true;
            }
          }
          return false;
        }
        dfs(covered);
        return found;
      }
      /* ---------- DIFFICULTY ---------- */
      function estimateDifficulty(puzzle, solverNodes) {
        const cands = allCandidates(puzzle);
        const n = cands.length;
        let total = 0,
          forced = 0;
        for (const l of cands) {
          total += l.length;
          if (l.length === 1) forced++;
        }
        const avg = total / Math.max(1, n),
          area = puzzle.w * puzzle.h;
        const score =
          avg * 1.35 +
          area * 0.08 +
          Math.log10((solverNodes || 10) + 1) * 2.2 -
          forced * 1.1;
        let tier = 0;
        if (score < 4.0) tier = 0;
        else if (score < 6.2) tier = 1;
        else if (score < 8.8) tier = 2;
        else if (score < 12.0) tier = 3;
        else if (score < 15.5) tier = 4;
        else tier = 5;
        return { tier, score, avg, forced, total, nodes: solverNodes || 0 };
      }
      const MAXAREA_BY_DIFF = [6, 8, 10, 12, 15, 16],
        AVG_BY_DIFF = [4.2, 4.8, 5.2, 5.8, 6.2, 6.8];
      function fallbackPuzzle(W, H, seed) {
        const cx = Math.floor(W / 2);
        const clues = [];
        const sol = [];
        for (let y = 0; y < H; y++) {
          clues.push({ x: cx, y, value: W });
          sol.push({ x: 0, y, w: W, h: 1, clue: y });
        }
        return {
          w: W,
          h: H,
          clues,
          solution: sol,
          seed: seed >>> 0 || 7,
          difficulty: 0,
          fallback: true,
          verified: true,
        };
      }
      async function generatePuzzle(W, H, seed, targetDiff = -1, onTick) {
        W = clamp(Math.round(W) || 8, 4, 16);
        H = clamp(Math.round(H) || 8, 4, 16);
        seed = seed >>> 0 || 1;
        const token = ++S.genToken;
        let best = null,
          bestGap = 999;
        const td = targetDiff < 0 ? -1 : targetDiff;
        const maxArea = td >= 0 ? MAXAREA_BY_DIFF[td] : 10,
          avg = td >= 0 ? AVG_BY_DIFF[td] : 5.5;
        const outerAttempts = W * H > 120 ? 14 : 22;
        for (let a = 0; a < outerAttempts; a++) {
          if (token !== S.genToken) return null;
          const rng = mulberry32((seed ^ Math.imul(a + 1, 0x9e3779b9)) >>> 0);
          const minCount = Math.max(3, Math.round((W * H) / avg));
          const part = generatePartition(W, H, rng, { maxArea, avg, minCount });
          if (part.length < 3) continue;
          const ones = part.filter((r) => r.w * r.h === 1).length;
          if (ones > Math.ceil(W * H * 0.12)) continue;
          const inner = W * H > 120 ? 3 : 5;
          for (let b = 0; b < inner; b++) {
            const rng2 = mulberry32(
              (seed ^ Math.imul(a * 31 + b + 7, 0x85ebca6b)) >>> 0,
            );
            const clues = cluesForPartition(part, rng2);
            const pz = { w: W, h: H, clues, seed };
            const res = countSolutions(pz, 2, 22000);
            if (res.aborted || res.count !== 1) continue;
            const est = estimateDifficulty(pz, res.nodes);
            // Search for matching tier and minimize forced initial placements
            const gap = td < 0 ? 0 : Math.abs(est.tier - td) * 10 + est.forced;
            const cand = {
              w: W,
              h: H,
              clues,
              solution: part.map((r, i) => ({
                x: r.x,
                y: r.y,
                w: r.w,
                h: r.h,
                clue: i,
              })),
              seed: seed + a * 1000 + b,
              difficulty: est.tier,
              est,
              verified: true,
            };
            if (gap < bestGap) {
              bestGap = gap;
              best = cand;
              if (td >= 0 && est.tier === td && est.forced <= 1) return cand;
            }
            if (onTick && (a * inner + b) % 4 === 0) {
              onTick(a * inner + b);
              await sleep(0);
            }
          }
          if (a % 3 === 2) await sleep(0);
        }
        if (best) return best;
        return fallbackPuzzle(W, H, seed);
      }
      /* ---------- VALIDATION ---------- */
      function rectsOverlap(a, b) {
        return (
          a.x < b.x + b.w &&
          b.x < a.x + a.w &&
          a.y < b.y + b.h &&
          b.y < a.y + a.h
        );
      }
      function cluesInside(puzzle, r) {
        const out = [];
        puzzle.clues.forEach((c, i) => {
          if (c.x >= r.x && c.x < r.x + r.w && c.y >= r.y && c.y < r.y + r.h)
            out.push(i);
        });
        return out;
      }
      function validateDraft(puzzle, rects, r) {
        if (!r || r.w < 1 || r.h < 1)
          return {
            valid: false,
            reason: "Empty rectangle.",
            area: 0,
            clues: [],
          };
        if (r.x < 0 || r.y < 0 || r.x + r.w > puzzle.w || r.y + r.h > puzzle.h)
          return {
            valid: false,
            reason: "Extends outside the board.",
            area: r.w * r.h,
            clues: [],
          };
        const inside = cluesInside(puzzle, r);
        if (inside.length === 0)
          return {
            valid: false,
            reason: "Rectangle contains no clue.",
            area: r.w * r.h,
            clues: inside,
          };
        if (inside.length > 1)
          return {
            valid: false,
            reason: `Contains ${inside.length} clues — must hold exactly 1.`,
            area: r.w * r.h,
            clues: inside,
          };
        const need = puzzle.clues[inside[0]].value,
          area = r.w * r.h;
        if (area !== need)
          return {
            valid: false,
            reason: `Area is ${area}; this clue needs ${need}.`,
            area,
            clues: inside,
            need,
          };
        const overlapping = rects.filter((e) => rectsOverlap(e, r));
        if (overlapping.length > 0)
          return {
            valid: false,
            reason: "Overlaps an existing region — erase it first.",
            area,
            clues: inside,
            need,
            overlapping,
          };
        return {
          valid: true,
          reason: "Valid.",
          area,
          clues: inside,
          need,
          overlapping: [],
        };
      }
      function validateCompleteBoard(puzzle, rects) {
        const W = puzzle.w,
          H = puzzle.h,
          grid = new Int16Array(W * H).fill(0);
        let overlapCells = 0,
          emptyRects = 0,
          multi = 0,
          wrong = 0;
        const invalid = [];
        rects.forEach((r, i) => {
          const ins = cluesInside(puzzle, r);
          if (ins.length === 0) emptyRects++;
          if (ins.length > 1) multi++;
          if (ins.length === 1 && r.w * r.h !== puzzle.clues[ins[0]].value)
            wrong++;
          if (
            ins.length !== 1 ||
            r.w * r.h !== (puzzle.clues[ins[0]] || { value: -1 }).value
          )
            invalid.push(i);
          for (let y = r.y; y < r.y + r.h; y++)
            for (let x = r.x; x < r.x + r.w; x++) {
              const k = y * W + x;
              grid[k]++;
              if (grid[k] === 2) overlapCells++;
            }
        });
        let uncovered = 0;
        for (let i = 0; i < W * H; i++) if (grid[i] === 0) uncovered++;
        const solved =
          uncovered === 0 &&
          overlapCells === 0 &&
          emptyRects === 0 &&
          multi === 0 &&
          wrong === 0;
        return {
          solved,
          uncoveredCells: uncovered,
          overlapCells,
          emptyRectangles: emptyRects,
          multiClueRectangles: multi,
          wrongAreas: wrong,
          invalidRectangles: invalid,
        };
      }
      /* ---------- TIMER ---------- */
      let tickInt = null;
      function timerStart() {
        timerStop();
        S.timerAccum = S.timerAccum || 0;
        S.timerStart = performance.now();
        S.timerRunning = true;
        tickInt = setInterval(timerTick, 200);
      }
      function timerPause() {
        if (S.timerRunning) {
          S.timerAccum += performance.now() - S.timerStart;
          S.timerRunning = false;
        }
        clearInterval(tickInt);
        tickInt = null;
        timerTick();
      }
      function timerResume() {
        if (S.completed || S.paused) return;
        if (S.timerRunning) return;
        S.timerStart = performance.now();
        S.timerRunning = true;
        if (!tickInt) tickInt = setInterval(timerTick, 200);
      }
      function timerStop() {
        clearInterval(tickInt);
        tickInt = null;
        S.timerRunning = false;
      }
      function activeMs() {
        return (
          S.timerAccum + (S.timerRunning ? performance.now() - S.timerStart : 0)
        );
      }
      function timerTick() {
        const el = $("#gameHeaderTimer");
        if (!el) return;
        if (S.mode === "zen" && !S.showZenTimer) {
          el.textContent = "☾ zen";
          el.style.borderColor = "";
          return;
        }
        if (S.countdownOn) {
          const left = S.countdownMs - activeMs();
          if (left <= 0) {
            el.textContent = "00:00";
            el.style.borderColor = "var(--danger)";
            onTimeUp();
            return;
          }
          el.textContent = "⏱ " + fmtTime(left);
          el.style.borderColor = left < 60000 ? "var(--danger)" : "";
          return;
        }
        el.style.borderColor = "";
        el.textContent = fmtTime(activeMs());
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (S.view === "play" && !S.completed && !S.paused) timerPause();
        } else {
          if (S.view === "play" && !S.completed && !S.paused) timerResume();
        }
      });
      /* ---------- HINTS ---------- */
      function trueSolution() {
        if (S.puzzle.solution && S.puzzle.verified) return S.puzzle.solution;
        const s = solveOne(S.puzzle);
        if (s) {
          S.puzzle.solution = s;
          S.puzzle.verified = true;
        }
        return s;
      }
      function findHintTarget() {
        const sol = trueSolution();
        if (!sol) return null;
        const match = (r) =>
          sol.some(
            (s) => s.x === r.x && s.y === r.y && s.w === r.w && s.h === r.h,
          );
        const wrong = S.playerRects.find((r) => !match(r));
        if (wrong) return { kind: "wrong", rect: wrong };
        for (const s of sol) {
          const has = S.playerRects.some(
            (r) => r.x === s.x && r.y === s.y && r.w === s.w && r.h === s.h,
          );
          if (!has) {
            const clue = S.puzzle.clues[s.clue];
            return { kind: "missing", rect: s, clue, clueIndex: s.clue };
          }
        }
        return null;
      }
      function getMaxHints() {
        if (!S.puzzle) return 3;
        // Campaign levels
        if (S.mode === "campaign" && S.levelIndex != null) {
          if (S.levelIndex === 0) return 3; // First level (Level 1): 3 hints
          if (S.levelIndex < 5) return 2;  // Early levels (Level 2-5): 2 hints
          return 1;                        // Harder / advanced levels (Level 6+): 1 hint
        }
        // General / Difficulty-based (Custom, Daily, Time Trial, etc.)
        const diff = S.puzzle.difficulty != null ? S.puzzle.difficulty : 0;
        if (diff === 0) return 3; // Beginner: 3 hints
        if (diff === 1) return 2; // Easy: 2 hints
        return 1;                 // Medium, Hard, Expert, Master: 1 hint
      }

      function updateHintUI() {
        const btn = $("#btnHint");
        if (!btn) return;
        const maxHints = getMaxHints();
        const used = S.hintsUsed || 0;
        const remaining = Math.max(0, maxHints - used);
        const lbl = $("#btnHintLabel");
        if (lbl) {
          lbl.textContent = "HINT";
        }
        const badge = $("#hintBadge");
        if (badge) {
          badge.textContent = remaining;
          badge.classList.toggle("empty", remaining <= 0);
        }
        const isOutOfHints = remaining <= 0;
        btn.disabled = isOutOfHints || S.completed || S.paused;
        btn.classList.toggle("is-disabled", isOutOfHints);
        btn.title =
          remaining > 0
            ? `Reveal next rectangle (${remaining} left)`
            : "No hints remaining for this puzzle";
      }

      function applyHint() {
        if (S.completed || S.paused || !S.puzzle) return;
        const maxHints = getMaxHints();
        if ((S.hintsUsed || 0) >= maxHints) {
          AudioSys.play("invalid");
          return;
        }
        const t = findHintTarget();
        if (!t) {
          AudioSys.play("invalid");
          return;
        }
        S.hintsUsed = (S.hintsUsed || 0) + 1;
        S.save.stats.hints = (S.save.stats.hints || 0) + 1;
        persist();
        AudioSys.play("hint");
        const now = performance.now();
        if (t.kind === "wrong") {
          S.playerRects = S.playerRects.filter((r) => r.id !== t.rect.id);
          S.selectedId = null;
          afterChange("hint-remove");
        } else {
          const s = t.rect;
          S.playerRects.push({
            x: s.x,
            y: s.y,
            w: s.w,
            h: s.h,
            clue: s.clue,
            id: S.rectId++,
            born: now,
          });
          afterChange("hint-reveal");
        }
        drawBoard();
        updateSide();
      }

      /* ---------- TUTORIAL LOGIC ---------- */
      function updateTutorialUI() {
        const bar = $("#tutorialBar");
        const wasHidden = !bar || bar.classList.contains("hidden");
        if (!S.tutorial || !S.tutorial.active || !S.puzzle) {
          if (bar && !wasHidden) {
            bar.classList.add("hidden");
            if (S.view === "play") resizeBoard();
          }
          return;
        }
        const sol = trueSolution();
        if (!sol) {
          if (bar && !wasHidden) {
            bar.classList.add("hidden");
            if (S.view === "play") resizeBoard();
          }
          return;
        }
        const missing = sol.find(
          (s) =>
            !S.playerRects.some(
              (r) => r.x === s.x && r.y === s.y && r.w === s.w && r.h === s.h,
            ),
        );
        if (!missing) {
          S.tutorial.active = false;
          if (bar && !wasHidden) {
            bar.classList.add("hidden");
            if (S.view === "play") resizeBoard();
          }
          return;
        }
        const clue = S.puzzle.clues[missing.clue];
        const clueVal = clue ? clue.value : missing.w * missing.h;
        S.tutorial.target = {
          ...missing,
          clueVal,
        };
        if (bar) {
          bar.classList.remove("hidden");
          if (wasHidden && S.view === "play") {
            resizeBoard();
          }
        }
        const txt = $("#tutorialText");
        if (txt) {
          txt.textContent = `Enclose clue ${clueVal} · drag ${missing.w}×${missing.h} area`;
        }
      }

      /* ---------- BOARD RENDERER ---------- */
      const board = $("#board"),
        bctx = board.getContext("2d");
      let fxAnims = [];
      function regionColor(idx, neighbors) {
        const pal = S.pal.regions || [
          "#E8D7F5",
          "#FCE1EB",
          "#D7EAF9",
          "#FFE4CD",
          "#D5F3DF",
          "#FFF5C4",
        ];
        const used = new Set(neighbors);
        for (let i = 0; i < pal.length; i++) {
          const c = (idx + i) % pal.length;
          if (!used.has(c)) return { fill: pal[c], ci: c };
        }
        return { fill: pal[idx % pal.length], ci: idx % pal.length };
      }
      function adjacent(a, b) {
        return (
          ((a.x === b.x + b.w || b.x === a.x + a.w) &&
            !(a.y + a.h <= b.y || b.y + b.h <= a.y)) ||
          ((a.y === b.y + b.h || b.y === a.y + a.h) &&
            !(a.x + a.w <= b.x || b.x + b.w <= a.x))
        );
      }
      function drawRoundRect(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        if (r < 1) r = 0;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, r);
          return;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
      function resizeBoard() {
        if (!S.puzzle) return;
        const playAreaEl = document.querySelector("#view-play .play-board-area") || document.querySelector("#view-play");
        const areaH = playAreaEl ? playAreaEl.clientHeight : 0;
        const areaW = playAreaEl ? playAreaEl.clientWidth : 0;

        const headerEl = document.querySelector("header");
        const headerH = headerEl && headerEl.style.display !== "none" ? headerEl.offsetHeight : 0;
        const mainEl = document.querySelector("main");
        const mainStyle = mainEl ? window.getComputedStyle(mainEl) : null;
        const mainPad = mainStyle ? (parseFloat(mainStyle.paddingTop || "4") + parseFloat(mainStyle.paddingBottom || "4")) : 8;
        const controlsEl = document.querySelector("#play-actions-bar .play-actions") || document.querySelector(".play-actions");
        const controlsH = controlsEl ? controlsEl.offsetHeight : 52;
        const hintEl = document.querySelector("#view-play p.text-\\[11px\\]");
        const hintH = hintEl ? hintEl.offsetHeight : 0;
        const tutorialBarEl = document.querySelector("#tutorialBar");
        const tutorialH = (tutorialBarEl && !tutorialBarEl.classList.contains("hidden")) ? (tutorialBarEl.offsetHeight + 12) : 0;
        
        const calcH = window.innerHeight - headerH - mainPad - controlsH - hintH - tutorialH - 12;
        const availH = Math.max(120, Math.min(areaH > 50 ? (areaH - tutorialH - 6) : calcH, 850));
        const availW = Math.max(160, areaW > 50 ? areaW - 12 : (window.innerWidth - 32));

        let cell = Math.floor(
          Math.min(availW / (S.puzzle.w + 0.15), availH / (S.puzzle.h + 0.15)),
        );
        cell = clamp(cell, 14, 150);
        const gap = clamp(Math.round(cell * 0.09), 2, 7);
        const pad = Math.max(4, gap);
        const cw = S.puzzle.w * cell + pad * 2,
          ch = S.puzzle.h * cell + pad * 2;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        S.boardGeom = { cell, gap, pad, ox: 0, oy: 0, w: cw, h: ch, dpr };
        board.style.width = cw + "px";
        board.style.height = ch + "px";
        board.width = Math.round(cw * dpr);
        board.height = Math.round(ch * dpr);
        bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bctx.imageSmoothingEnabled = true;

        // Dynamically align HINT and RESET buttons width with board width (cw)
        if (controlsEl) {
          controlsEl.style.width = Math.max(160, Math.min(cw, 380)) + "px";
        }

        drawBoard();
      }
      let drawFramePending = false;
      function requestDrawBoard() {
        if (drawFramePending) return;
        drawFramePending = true;
        requestAnimationFrame(() => {
          drawFramePending = false;
          if (S.view === "play") drawBoard();
        });
      }
      function drawBoard() {
        if (!S.puzzle) return;
        const W = S.puzzle.w,
          H = S.puzzle.h;
        const { cell, gap, pad } = S.boardGeom;
        const cw = W * cell + pad * 2,
          ch = H * cell + pad * 2;
        const pal = S.pal;
        const radius = clamp(Math.round(cell * 0.22), 6, 14);
        const depth = clamp(Math.round(cell * 0.08), 3, 6);
        const now = performance.now();
        bctx.clearRect(0, 0, cw, ch);
        const rectAreaOk = S.playerRects.map((r) => {
          const insideClues = S.puzzle.clues.filter(
            (c, ci) =>
              c.x >= r.x && c.x < r.x + r.w && c.y >= r.y && c.y < r.y + r.h,
          );
          return insideClues.length === 1 && r.w * r.h === insideClues[0].value;
        });
        const gridCovered = new Array(W * H).fill(false);
        S.playerRects.forEach((r, i) => {
          if (!rectAreaOk[i]) return;
          for (let y = r.y; y < r.y + r.h; y++) {
            for (let x = r.x; x < r.x + r.w; x++) {
              if (x >= 0 && x < W && y >= 0 && y < H)
                gridCovered[y * W + x] = true;
            }
          }
        });

        const tFace = pal.tileFace || "#FFFFFF";
        const tHoverFace = pal.tileHoverFace || "#EAE3D2";
        const tShadow = pal.tileShadow || "rgba(0,0,0,0.12)";
        const tBorder = pal.tileBorder || "rgba(0,0,0,0.06)";
        for (let gy = 0; gy < H; gy++) {
          for (let gx = 0; gx < W; gx++) {
            if (gridCovered[gy * W + gx]) continue;
            const tx = pad + gx * cell + gap / 2;
            const ty = pad + gy * cell + gap / 2;
            const tw = cell - gap;
            const th = cell - gap;
            const isHovered =
              S.hoverCell &&
              !S.draft &&
              S.view === "play" &&
              !S.completed &&
              !S.paused &&
              S.hoverCell.x === gx &&
              S.hoverCell.y === gy;
            bctx.fillStyle = tShadow;
            drawRoundRect(bctx, tx, ty, tw, th, radius);
            bctx.fill();
            bctx.fillStyle = isHovered ? tHoverFace : tFace;
            drawRoundRect(bctx, tx, ty, tw, th - depth, radius);
            bctx.fill();
            bctx.strokeStyle = tBorder;
            bctx.lineWidth = 1;
            bctx.stroke();
          }
        }
        const colorIdx = [];
        let hasBeaming = false;
        S.playerRects.forEach((r, i) => {
          const neigh = [];
          S.playerRects.forEach((o, j) => {
            if (i !== j && adjacent(r, o) && colorIdx[j] !== undefined)
              neigh.push(colorIdx[j]);
          });
          const ci =
            r.colorIdx !== undefined ? r.colorIdx : regionColor(i, neigh).ci;
          colorIdx[i] = ci;
          const bx = pad + r.x * cell + gap / 2;
          const by = pad + r.y * cell + gap / 2;
          const bw = r.w * cell - gap;
          const bh = r.h * cell - gap;
          let pStyle;
          if (pal["3dRegions"]) {
            pStyle = pal["3dRegions"][ci % pal["3dRegions"].length];
          } else {
            pStyle = {
              face: pal.regions[ci % pal.regions.length],
              shadow: "rgba(0,0,0,0.25)",
              text: pal.text,
            };
          }
          const age = (now - (r.born || 0)) / 220;
          let isBeaming = age < 1;
          if (isBeaming) hasBeaming = true;
          bctx.save();
          const isOk = rectAreaOk[i];
          if (isOk) {
            bctx.fillStyle = pStyle.shadow;
            drawRoundRect(bctx, bx, by, bw, bh, radius);
            bctx.fill();
            bctx.fillStyle = pStyle.face;
            drawRoundRect(bctx, bx, by, bw, bh - depth, radius);
            bctx.fill();
            bctx.strokeStyle = "rgba(255,255,255,0.4)";
            bctx.lineWidth = 1.5;
            bctx.setLineDash([]);
            bctx.stroke();
          } else {
            // Exact drag effect style for mismatched regions
            bctx.globalAlpha = 0.55;
            bctx.fillStyle = pStyle.face;
            drawRoundRect(bctx, bx, by, bw, bh, radius);
            bctx.fill();
            bctx.globalAlpha = 0.95;
            bctx.strokeStyle = pStyle.face;
            bctx.lineWidth = 2.5;
            bctx.setLineDash([]);
            drawRoundRect(bctx, bx, by, bw, bh, radius);
            bctx.stroke();
          }

          if (S.selectedId === r.id) {
            bctx.save();
            bctx.strokeStyle = pal.accent || "#3B82F6";
            bctx.lineWidth = 3.5;
            bctx.setLineDash([]);
            drawRoundRect(
              bctx,
              bx - 1,
              by - 1,
              bw + 2,
              bh - depth + 2,
              radius + 1,
            );
            bctx.stroke();
            bctx.restore();
          }
          if (isBeaming && !S.save.settings.reducedMotion) {
            bctx.globalAlpha = 0.9 * (1 - age);
            bctx.strokeStyle = "#FFFFFF";
            bctx.lineWidth = 3;
            bctx.setLineDash([]);
            drawRoundRect(bctx, bx, by, bw, bh, radius);
            bctx.stroke();
          }
          bctx.restore();
        });
        if (hasBeaming && !S.save.settings.reducedMotion) {
          requestDrawBoard();
        }
        if (S.save.settings.assist && S.assistCands.length) {
          bctx.save();
          for (const c of S.assistCands) {
            const cx = pad + c.x * cell + gap / 2;
            const cy = pad + c.y * cell + gap / 2;
            const cw = c.w * cell - gap;
            const ch = c.h * cell - gap;
            bctx.fillStyle = pal.accent;
            bctx.globalAlpha = 0.15;
            drawRoundRect(bctx, cx, cy, cw, ch, radius);
            bctx.fill();
            bctx.strokeStyle = pal.accent;
            bctx.globalAlpha = 0.6;
            bctx.lineWidth = 2;
            bctx.setLineDash([4, 3]);
            bctx.stroke();
          }
          bctx.restore();
        }
        if (S.hintFx && now < S.hintFx.until) {
          const f = S.hintFx;
          const pulse = S.save.settings.reducedMotion
            ? 0
            : Math.sin(now / 220) * 2;
          bctx.save();
          const hx = pad + f.rect.x * cell + gap / 2;
          const hy = pad + f.rect.y * cell + gap / 2;
          const hw = f.rect.w * cell - gap;
          const hh = f.rect.h * cell - gap;
          if (f.mode === "clue") {
            bctx.strokeStyle = pal.accent;
            bctx.lineWidth = 3 + pulse;
            bctx.setLineDash([6, 4]);
            drawRoundRect(bctx, hx, hy, hw, hh, radius);
            bctx.stroke();
          } else if (f.mode === "exact") {
            bctx.strokeStyle = "#22C55E";
            bctx.lineWidth = 3.5 + pulse;
            bctx.setLineDash([8, 4]);
            drawRoundRect(bctx, hx, hy, hw, hh, radius);
            bctx.stroke();
          } else if (f.mode === "wrong") {
            bctx.strokeStyle = "#EF4444";
            bctx.lineWidth = 3.5;
            bctx.setLineDash([6, 4]);
            drawRoundRect(bctx, hx, hy, hw, hh, radius);
            bctx.stroke();
          }
          bctx.restore();
          if (!S.save.settings.reducedMotion) requestDrawBoard();
        }
        if (S.erasingRects && S.erasingRects.length) {
          const nowE = performance.now();
          S.erasingRects = S.erasingRects.filter(
            (er) => nowE - er.erasedAt < er.duration,
          );
          for (const er of S.erasingRects) {
            const p = (nowE - er.erasedAt) / er.duration;
            const alpha = Math.max(0, (1 - p) * 0.85);
            const scale = 1 - p * 0.2;
            const ex = pad + (er.x + er.w * (1 - scale) * 0.5) * cell + gap / 2;
            const ey = pad + (er.y + er.h * (1 - scale) * 0.5) * cell + gap / 2;
            const ew = er.w * cell * scale - gap;
            const eh = er.h * cell * scale - gap;
            bctx.save();
            bctx.globalAlpha = alpha;
            bctx.fillStyle = er.color || "#3B82F6";
            drawRoundRect(bctx, ex, ey, ew, eh, radius);
            bctx.fill();
            bctx.strokeStyle = "rgba(255,255,255,0.7)";
            bctx.lineWidth = 2;
            drawRoundRect(bctx, ex, ey, ew, eh, radius);
            bctx.stroke();
            bctx.restore();
          }
          if (!S.save.settings.reducedMotion && S.erasingRects.length) {
            requestDrawBoard();
          }
        }
        if (S.draft) {
          const d = S.draft;
          const v = d.validation;
          const ok = v && v.valid;
          const hasOverlap = v && v.overlapping && v.overlapping.length > 0;
          const nextIdx =
            S.draftColorIdx !== undefined && S.draftColorIdx !== null
              ? S.draftColorIdx
              : S.playerRects.length;
          let previewColor;
          if (pal["3dRegions"]) {
            previewColor =
              pal["3dRegions"][nextIdx % pal["3dRegions"].length].face;
          } else {
            const regs = pal.regions || [
              "#E8D7F5",
              "#FCE1EB",
              "#D7EAF9",
              "#FFE4CD",
              "#D5F3DF",
              "#FFF5C4",
            ];
            previewColor = regs[nextIdx % regs.length];
          }
          const px = pad + d.x * cell + gap / 2;
          const py = pad + d.y * cell + gap / 2;
          const pw = d.w * cell - gap;
          const ph = d.h * cell - gap;

          bctx.save();
          // Semi-transparent pastel overlay fill over background tiles
          bctx.globalAlpha = hasOverlap ? 0.35 : 0.55;
          bctx.fillStyle = hasOverlap ? "#EF4444" : previewColor;
          drawRoundRect(bctx, px, py, pw, ph, radius);
          bctx.fill();

          // Solid rounded border outline in region color
          bctx.globalAlpha = hasOverlap ? 0.8 : 0.95;
          bctx.strokeStyle = hasOverlap ? "#EF4444" : previewColor;
          bctx.lineWidth = 2.5;
          bctx.setLineDash([]);
          drawRoundRect(bctx, px, py, pw, ph, radius);
          bctx.stroke();
          bctx.restore();
        }
        const inRect = (x, y) =>
          S.playerRects.find(
            (r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h,
          );
        bctx.textAlign = "center";
        bctx.textBaseline = "middle";
        S.puzzle.clues.forEach((c, ci) => {
          const placed = inRect(c.x, c.y);
          const cx = pad + (c.x + 0.5) * cell;
          const cy = pad + (c.y + 0.5) * cell;
          const fs = clamp(cell * 0.44, 12, 32);
          bctx.save();
          bctx.font = `800 ${fs}px Inter,system-ui,sans-serif`;
          if (placed) {
            const idx = S.playerRects.indexOf(placed);
            const pci = colorIdx[idx] ?? 0;
            const pStyle = pal["3dRegions"]
              ? pal["3dRegions"][pci % pal["3dRegions"].length]
              : { text: pal.clue };
            bctx.fillStyle = pStyle.text || pal.clue || pal.text;
            bctx.fillText(String(c.value), cx, cy);
          } else {
            bctx.fillStyle = pal.clue || pal.text;
            bctx.fillText(String(c.value), cx, cy);
          }
          bctx.restore();
        });
        if (S.cursorOn && S.view === "play") {
          bctx.save();
          const kx = pad + S.cursor.x * cell + gap / 2;
          const ky = pad + S.cursor.y * cell + gap / 2;
          const kw = cell - gap;
          const kh = cell - gap;
          bctx.strokeStyle = pal.accent;
          bctx.lineWidth = 3;
          bctx.setLineDash([4, 3]);
          drawRoundRect(bctx, kx, ky, kw, kh, radius);
          bctx.stroke();
          bctx.restore();
        }

        /* Tutorial Guide & Animated Drag Pointer */
        if (
          S.tutorial &&
          S.tutorial.active &&
          S.tutorial.target &&
          !S.draft &&
          S.view === "play"
        ) {
          const tg = S.tutorial.target;
          const hx = pad + tg.x * cell + gap / 2;
          const hy = pad + tg.y * cell + gap / 2;
          const hw = tg.w * cell - gap;
          const hh = tg.h * cell - gap;

          // 1. Pulsing glowing dashed guide rectangle
          bctx.save();
          const pulse = (Math.sin(now / 220) + 1) / 2;
          bctx.strokeStyle = pal.accent || "#1E6B52";
          bctx.lineWidth = 3 + pulse * 1.5;
          bctx.setLineDash([8, 6]);
          bctx.lineDashOffset = -(now / 35);
          bctx.fillStyle = "rgba(30, 107, 82, " + (0.08 + pulse * 0.08) + ")";
          drawRoundRect(bctx, hx, hy, hw, hh, radius);
          bctx.fill();
          bctx.stroke();
          bctx.restore();

          // 2. Animated finger / touch drag indicator
          const cycle = 2000;
          const t = (now % cycle) / cycle;
          const startX = pad + (tg.x + 0.5) * cell;
          const startY = pad + (tg.y + 0.5) * cell;
          const endX = pad + (tg.x + tg.w - 0.5) * cell;
          const endY = pad + (tg.y + tg.h - 0.5) * cell;

          let cx,
            cy,
            isPressing = false;
          if (t < 0.18) {
            cx = startX;
            cy = startY;
            isPressing = false;
          } else if (t < 0.82) {
            const ease = (t - 0.18) / 0.64;
            const eased =
              ease < 0.5 ? 2 * ease * ease : -1 + (4 - 2 * ease) * ease;
            cx = startX + (endX - startX) * eased;
            cy = startY + (endY - startY) * eased;
            isPressing = true;
          } else {
            cx = endX;
            cy = endY;
            isPressing = false;
          }

          // Drag trail
          if (isPressing) {
            bctx.save();
            bctx.strokeStyle = "rgba(30, 107, 82, 0.45)";
            bctx.lineWidth = 2.5;
            bctx.setLineDash([4, 4]);
            bctx.beginPath();
            bctx.moveTo(startX, startY);
            bctx.lineTo(cx, cy);
            bctx.stroke();
            bctx.restore();
          }

          // Touch pointer circle
          bctx.save();
          bctx.shadowColor = "rgba(0, 0, 0, 0.35)";
          bctx.shadowBlur = 8;
          bctx.shadowOffsetY = 3;
          bctx.fillStyle = isPressing ? pal.accent || "#1E6B52" : "#FFFFFF";
          bctx.strokeStyle = "#FFFFFF";
          bctx.lineWidth = 2.5;
          bctx.beginPath();
          bctx.arc(cx, cy, isPressing ? 13 : 11, 0, Math.PI * 2);
          bctx.fill();
          bctx.stroke();
          // Inner dot
          bctx.fillStyle = isPressing ? "#FFFFFF" : pal.accent || "#1E6B52";
          bctx.beginPath();
          bctx.arc(cx, cy, 4, 0, Math.PI * 2);
          bctx.fill();
          bctx.restore();

          if (!S.save.settings.reducedMotion) {
            requestDrawBoard();
          }
        }
      }
      function cellFromEvent(e) {
        const r = board.getBoundingClientRect();
        const { cell, pad } = S.boardGeom;
        if (!cell || !S.puzzle) return null;
        const x = Math.floor((e.clientX - r.left - pad) / cell);
        const y = Math.floor((e.clientY - r.top - pad) / cell);
        return {
          x: clamp(x, 0, S.puzzle.w - 1),
          y: clamp(y, 0, S.puzzle.h - 1),
          inside: x >= 0 && y >= 0 && x < S.puzzle.w && y < S.puzzle.h,
        };
      }
      function normRect(a, b) {
        return {
          x: Math.min(a.x, b.x),
          y: Math.min(a.y, b.y),
          w: Math.abs(a.x - b.x) + 1,
          h: Math.abs(a.y - b.y) + 1,
        };
      }
      function rectAt(x, y) {
        return S.playerRects.find(
          (r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h,
        );
      }
      function eraseRectangles(rectList, reason) {
        if (!rectList || !rectList.length) return;
        if (!S.hasModifiedDrag) {
          S.hasModifiedDrag = true;
        }
        S.erasingRects = S.erasingRects || [];
        const now = performance.now();
        const pal = THEMES[S.save.theme] || THEMES.classic;
        rectList.forEach((r) => {
          const cIdx =
            r.colorIdx !== undefined
              ? r.colorIdx
              : S.playerRects.indexOf(r) >= 0
                ? S.playerRects.indexOf(r)
                : 0;
          let faceColor;
          if (pal["3dRegions"]) {
            faceColor = pal["3dRegions"][cIdx % pal["3dRegions"].length].face;
          } else {
            const regs = pal.regions || [
              "#E8D7F5",
              "#FCE1EB",
              "#D7EAF9",
              "#FFE4CD",
              "#D5F3DF",
              "#FFF5C4",
            ];
            faceColor = regs[cIdx % regs.length];
          }
          S.erasingRects.push({
            x: r.x,
            y: r.y,
            w: r.w,
            h: r.h,
            color: faceColor,
            erasedAt: now,
            duration: 280,
          });
        });
        const ids = new Set(rectList.map((r) => r.id));
        S.playerRects = S.playerRects.filter((r) => !ids.has(r.id));
        if (S.selectedId && ids.has(S.selectedId)) S.selectedId = null;
        AudioSys.play("delete");
        afterChange(reason || "erase");
      }
      function checkAndEraseOverlaps() {
        if (!S.draft || !S.playerRects || !S.playerRects.length) return;
        const overlapped = S.playerRects.filter((r) =>
          rectsOverlap(S.draft, r),
        );
        if (overlapped.length > 0) {
          eraseRectangles(overlapped, "drag-auto-erase");
        }
      }
      let longPressT = null,
        pressMoved = false;
      function getBoardCursor(type = "hover") {
        if (type === "drag") return "grabbing";
        return "grab";
      }
      function bindBoard() {
        board.addEventListener("pointerdown", (e) => {
          AudioSys.init();
          AudioSys.resume();
          if (S.completed || S.paused || !S.puzzle) return;
          e.preventDefault();
          board.setPointerCapture && board.setPointerCapture(e.pointerId);
          const c = cellFromEvent(e);
          if (!c) return;
          if (e.button === 2) return;
          S.downPos = { x: e.clientX, y: e.clientY };
          S.dragStart = c;
          pressMoved = false;
          S.dragging = true;
          S.hasModifiedDrag = false;
          S.dragInitialRects = [...S.playerRects];
          S.draft = null;
          S.hoverCell = null;
          board.style.cursor = getBoardCursor("drag");
          clearTimeout(longPressT);
          longPressT = setTimeout(() => {
            if (!pressMoved && S.dragging) {
              const r = rectAt(c.x, c.y);
              if (r) {
                eraseRectangles([r], "longpress-delete");
                S.dragging = false;
                S.draft = null;
                S.draftColorIdx = null;
                drawBoard();
                updateDrawInfo(null);
                announce("Region erased");
              }
            }
          }, 650);
        });
        board.addEventListener("pointermove", (e) => {
          if (S.dragging) e.preventDefault();
          const c = cellFromEvent(e);
          if (!S.dragging) {
            const newHover =
              c && c.inside && !S.completed && !S.paused
                ? { x: c.x, y: c.y }
                : null;
            const prevHover = S.hoverCell;
            const hoverChanged =
              prevHover?.x !== newHover?.x || prevHover?.y !== newHover?.y;
            const desiredCursor = getBoardCursor("hover");
            if (board.style.cursor !== desiredCursor) {
              board.style.cursor = desiredCursor;
            }
            if (hoverChanged) {
              S.hoverCell = newHover;
              if (S.anchor) {
                if (S.hoverCell) {
                  S.draft = normRect(S.anchor, S.hoverCell);
                  updateDraftValidation();
                } else {
                  S.draft = null;
                  updateDrawInfo(null);
                }
              }
              requestDrawBoard();
            }
            return;
          }
          if (!S.dragStart || !c) return;
          const dragCursor = getBoardCursor("drag");
          if (board.style.cursor !== dragCursor) {
            board.style.cursor = dragCursor;
          }
          const dist = S.downPos
            ? Math.hypot(e.clientX - S.downPos.x, e.clientY - S.downPos.y)
            : 0;
          if (c.x !== S.dragStart.x || c.y !== S.dragStart.y || dist > 6)
            pressMoved = true;
          if (S.save.settings.input === "tap" && !pressMoved) return;
          if (pressMoved) {
            if (!S.draft) {
              S.colorCounter = S.colorCounter || S.playerRects.length;
              S.draftColorIdx = S.colorCounter;
            }
            const newDraft = normRect(S.dragStart, c);
            if (
              !S.draft ||
              S.draft.x !== newDraft.x ||
              S.draft.y !== newDraft.y ||
              S.draft.w !== newDraft.w ||
              S.draft.h !== newDraft.h
            ) {
              S.draft = newDraft;
              checkAndEraseOverlaps();
              updateDraftValidation();
              requestDrawBoard();
            }
          }
        });
        board.addEventListener("pointerleave", () => {
          if (S.hoverCell || S.anchor) {
            S.hoverCell = null;
            board.style.cursor = getBoardCursor("hover");
            if (S.anchor && !S.dragging) {
              S.draft = null;
              updateDrawInfo(null);
            }
            drawBoard();
          }
        });
        const up = (e) => {
          clearTimeout(longPressT);
          if (!S.dragging) return;
          S.dragging = false;
          if (!S.puzzle) {
            S.draft = null;
            S.draftColorIdx = null;
            return;
          }
          const c = cellFromEvent(e) || S.dragStart;
          const sameCell = c.x === S.dragStart.x && c.y === S.dragStart.y;
          if (!pressMoved) {
            if (S.dragInitialRects) S.playerRects = [...S.dragInitialRects];
            S.draftColorIdx = null;
            S.draft = null;
            handleTap(c);
            drawBoard();
            return;
          }
          if (S.save.settings.input === "tap") {
            if (S.dragInitialRects) S.playerRects = [...S.dragInitialRects];
            S.draftColorIdx = null;
            S.draft = null;
            drawBoard();
            handleTap(c);
            return;
          }
          const r = normRect(S.dragStart, c);
          attemptPlace(r);
          S.draft = null;
          S.anchor = null;
          drawBoard();
        };
        board.addEventListener("pointerup", up);
        board.addEventListener("pointercancel", () => {
          clearTimeout(longPressT);
          if (S.dragInitialRects && !S.hasModifiedDrag)
            S.playerRects = [...S.dragInitialRects];
          S.dragging = false;
          S.draft = null;
          S.draftColorIdx = null;
          drawBoard();
          updateDrawInfo(null);
        });
        board.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if (S.completed || S.paused) return;
          const c = cellFromEvent(e);
          if (!c) return;
          const r = rectAt(c.x, c.y);
          if (r) {
            eraseRectangles([r], "right-erase");
          }
        });
        board.addEventListener("keydown", (e) => {
          if (!S.puzzle) return;
          S.cursorOn = true;
          const k = e.key;
          if (
            [
              "ArrowUp",
              "ArrowDown",
              "ArrowLeft",
              "ArrowRight",
              "Enter",
              " ",
              "Escape",
            ].includes(k)
          )
            e.preventDefault();
          if (k.startsWith("Arrow")) {
            const d = {
              ArrowUp: [0, -1],
              ArrowDown: [0, 1],
              ArrowLeft: [-1, 0],
              ArrowRight: [1, 0],
            }[k];
            S.cursor.x = clamp(S.cursor.x + d[0], 0, S.puzzle.w - 1);
            S.cursor.y = clamp(S.cursor.y + d[1], 0, S.puzzle.h - 1);
            announce(`Cell ${S.cursor.x + 1}, ${S.cursor.y + 1}`);
            drawBoard();
          } else if (k === "Enter" || k === " ") {
            handleTap({ x: S.cursor.x, y: S.cursor.y });
          } else if (k === "Escape") {
            S.anchor = null;
            S.selectedId = null;
            S.draftColorIdx = null;
            drawBoard();
          }
        });
        document.addEventListener(
          "touchmove",
          (e) => {
            if (S.view === "play" && S.dragging) {
              e.preventDefault();
            }
          },
          { passive: false }
        );
      }
      function handleTap(c) {
        const existing = rectAt(c.x, c.y);
        if (existing) {
          eraseRectangles([existing], "erase-tap");
          toast("Region removed.", "⌫");
          S.selectedId = null;
          drawBoard();
          return;
        }
        S.selectedId = null;
        if (S.anchor && (S.anchor.x !== c.x || S.anchor.y !== c.y)) {
          const r = normRect(S.anchor, c);
          S.anchor = null;
          attemptPlace(r);
          drawBoard();
          return;
        }
        S.anchor = null;
        attemptPlace({ x: c.x, y: c.y, w: 1, h: 1 });
        const clueOnCell = S.puzzle
          ? S.puzzle.clues.find((cl) => cl.x === c.x && cl.y === c.y)
          : null;
        if (clueOnCell) {
          const ci = S.puzzle.clues.indexOf(clueOnCell);
          inspectClue(ci);
        }
        drawBoard();
        updateDrawInfo(null);
      }
      function updateDraftValidation() {
        if (!S.draft) return;
        const v = validateDraft(S.puzzle, S.playerRects, S.draft);
        S.draft.validation = v;
        updateDrawInfo(v);
        if (S.save.settings.sr)
          announce(
            `${S.draft.w} by ${S.draft.h}, area ${v.area}, ${v.clues.length} clues, ${v.valid ? "valid" : "invalid: " + v.reason}`,
          );
      }
      function updateDrawInfo(v) {}
      function attemptPlace(r) {
        if (S.completed || S.paused) return;
        const v = validateDraft(S.puzzle, S.playerRects, r);
        if (
          !v.valid &&
          (v.reason.includes("Overlap") || v.reason.includes("outside"))
        ) {
          AudioSys.play("invalid");
          toast(v.reason, "⚠");
          return;
        }
        if (!v.valid) {
          toast(v.reason, "⚠");
        }
        const placedColorIdx =
          S.draftColorIdx !== undefined && S.draftColorIdx !== null
            ? S.draftColorIdx
            : S.colorCounter || 0;
        S.playerRects.push({
          x: r.x,
          y: r.y,
          w: r.w,
          h: r.h,
          clue: v.clues[0] ?? -1,
          id: S.rectId++,
          born: performance.now(),
          colorIdx: placedColorIdx,
        });
        S.colorCounter = placedColorIdx + 1;
        S.draftColorIdx = null;
        S.selectedId = null;
        AudioSys.play("place");
        unlock("first_rect");
        afterChange("place");
      }
      function afterChange(why) {
        S.assistCands = [];
        updateTutorialUI();
        updateSide();
        updateDrawInfo(null);
        drawBoard();
        autosaveCurrent();
        const res = validateCompleteBoard(S.puzzle, S.playerRects);
        if (res.solved) {
          onSolved();
        } else if (res.uncoveredCells === 0 && why.startsWith("place")) {
          toast(`Board full, but ${describeProblems(res)}`, "⚠");
        }
      }
      function describeProblems(res) {
        const p = [];
        if (res.uncoveredCells)
          p.push(
            res.uncoveredCells + " gap" + (res.uncoveredCells > 1 ? "s" : ""),
          );
        if (res.overlapCells) p.push("overlap");
        if (res.wrongAreas)
          p.push(
            res.wrongAreas + " wrong area" + (res.wrongAreas > 1 ? "s" : ""),
          );
        if (res.multiClueRectangles) p.push("multi-clue");
        if (res.emptyRectangles) p.push("empty");
        return p.join(" · ") || "check regions";
      }
      function updateSide() {
        if (!S.puzzle) return;
        if ($("#sideRects")) $("#sideRects").textContent = S.playerRects.length;
        if ($("#sideRectsTotal")) $("#sideRectsTotal").textContent = "/ " + S.puzzle.clues.length;
        if ($("#sideHints")) $("#sideHints").textContent = S.hintsUsed;
        if ($("#sideMist")) $("#sideMist").textContent = S.mistakes;
        updateHintUI();
      }
      /* clue inspector */
      function inspectClue(i) {
        if (i == null || i < 0) {
          S.assistCands = [];
          return;
        }
        const c = S.puzzle.clues[i];
        const pairs = factorPairs(c.value)
          .map(([w, h]) => `${w}×${h}`)
          .join(" · ");
        const cands = candidatesForClue(
          S.puzzle.w,
          S.puzzle.h,
          S.puzzle.clues,
          i,
        ).filter((cd) => !S.playerRects.some((e) => rectsOverlap(e, cd)));
        if (S.save.settings.assist) {
          S.assistCands = cands;
          drawBoard();
        }
        $("#assistBody").innerHTML =
          `<div class="flex items-center gap-2 mb-1"><span class="font-display text-2xl font-bold" style="color:var(--accent)">${c.value}</span><span class="text-xs">at column ${c.x + 1}, row ${c.y + 1}</span></div><div class="text-xs">Factor pairs: <b>${pairs}</b></div><div class="text-xs mt-1">${cands.length} legal placement${cands.length === 1 ? "" : "s"} right now${S.save.settings.assist ? " — shaded on board" : ""}. ${cands.length === 1 ? '<b style="color:var(--success)">Forced — draw it.</b>' : ""}</div>`;
      }
      /* ---------- UI NAV ---------- */
      const VIEWS = [
        "home",
        "levels",
        "play",
        "howto",
        "daily",
        "custom",
      ];
      function openSettingsModal() {
        refreshSettingsUI();
        const dataSec = $("#settingsDataSection");
        if (dataSec) {
          dataSec.classList.toggle("hidden", S.view !== "home");
        }
        const m = $("#modal-settings");
        if (m) m.classList.add("open");
      }
      function showView(v) {
        document.body.classList.toggle("in-game", v === "play");
        const hdr = $("header");
        if (hdr) hdr.style.display = v === "home" ? "none" : "block";
        const prev = S.view;
        if (prev === "play" && v !== "play" && S.puzzle && !S.completed) {
          try {
            timerPause();
            saveCurrent();
          } catch (e) {}
          if (v === "settings") S.returnTo = "play";
        }
        if (v === "play" || v === "home") S.returnTo = null;
        S.view = v;
        VIEWS.forEach((x) => {
          const viewEl = $("#view-" + x);
          if (viewEl) viewEl.classList.toggle("active", x === v);
        });
        const showBack = v !== "home";
        const btnBack = $("#btnBack");
        if (btnBack) {
          btnBack.classList.toggle("hidden", !showBack);
          btnBack.style.display = showBack ? "inline-flex" : "none";
          if (showBack)
            btnBack.innerHTML =
              S.returnTo === "play" && S.puzzle && !S.completed
                ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="10,3 5,8 10,13"/></svg><span class="back-label">Resume</span>`
                : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="10,3 5,8 10,13"/></svg><span class="back-label">Back</span>`;
        }
        window.scrollTo({ top: 0 });
        if (v === "home") renderHome();
        if (v === "levels") renderLevels();
        if (v === "daily") renderDaily();
        const el = $("#view-" + v);
        if (el) animateFrom(el, { opacity: 0, duration: 0.18, ease: "power2.out" });
        if (v === "play") {
          setTimeout(() => {
            resizeBoard();
            drawBoard();
          }, 20);
        }
        AudioSys.play("click");
      }
      function toast() {
        /* toasts disabled */
      }
      /* ---------- RENDER: HOME/LEVELS/etc ---------- */

      function renderHome() {
        $$(".homeStreakNum").forEach((el) => (el.textContent = S.save.daily.streak));
        const dk = dateKey();
        if ($("#homeDailySub")) {
          $("#homeDailySub").textContent = S.save.daily.solved[dk]
            ? "✓ Solved " + fmtTime(S.save.daily.solved[dk])
            : "Daily Challenge";
        }
        const doneCount = (S.save.campaign.completed || []).length;
        if ($("#homeLevelsSub")) {
          $("#homeLevelsSub").textContent = doneCount ? `${doneCount} level${doneCount === 1 ? "" : "s"} solved` : "Auto-expanding levels";
        }
      }
      function renderLevels() {
        const completed = S.save.campaign.completed || [];
        const doneCount = completed.length;
        if ($("#levelsProgress")) {
          $("#levelsProgress").textContent = `${doneCount} level${doneCount === 1 ? "" : "s"} solved`;
        }
        const maxSolved = completed.length ? Math.max(...completed) : -1;
        const maxUnlocked = maxSolved + 1;
        
        const visibleMax = Math.max(20, Math.ceil((maxUnlocked + 5) / 10) * 10);
        const box = $("#chapterList");
        if (!box) return;
        box.innerHTML = "";

        const grid = document.createElement("div");
        grid.className = "levels-grid";

        for (let i = 0; i < visibleMax; i++) {
          const solved = completed.includes(i);
          const locked = i > maxUnlocked;
          const cur = i === maxUnlocked;
          
          const d = document.createElement("button");
          d.className = `level-tile ${locked ? "locked" : ""} ${solved ? "solved" : ""} ${cur ? "current" : ""}`;
          d.innerHTML = `<div class="font-display font-bold text-xs ${locked ? "opacity-60" : ""}">Level ${i + 1}</div>` +
            (locked ? `<span class="text-sm mt-0.5 opacity-80">🔒</span>` : "") +
            (solved ? `<span class="text-xs font-bold mt-0.5" style="color:var(--success)">✓</span>` : "");
          if (!locked)
            d.onclick = () => {
              AudioSys.play("click");
              loadCampaignLevel(i);
            };
          grid.appendChild(d);
        }

        // Trailing 'More Unlocking' tile to indicate infinite auto-expanding campaign
        const nextBatchStart = visibleMax + 1;
        const moreTile = document.createElement("div");
        moreTile.className = "level-tile cursor-default opacity-80";
        moreTile.style.cssText = "border-style: dashed; background: var(--surface-2);";
        moreTile.innerHTML = `<div class="font-display font-bold text-[10px]" style="color:var(--text-muted)">Level ${nextBatchStart}+</div><span class="text-sm mt-0.5">✨</span><div class="text-[9px] font-bold mt-0.5" style="color:var(--accent)">Unlocks as you play</div>`;
        grid.appendChild(moreTile);

        box.appendChild(grid);
      }
      function renderAchievements() {}
      function renderThemes() {}
      function renderDaily() {
        const dk = dateKey();
        $("#dailyTitle").textContent = "Daily Challenge";
        $("#dailyDate").textContent = new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        const spec = dailySpec(dk);
        $("#dailySize").textContent = spec.w + "×" + spec.h;
        $("#dailyDiff").textContent = DIFFS[spec.diff];
        $("#dailyStreak").textContent = S.save.daily.streak;
        const done = S.save.daily.solved[dk];
        $("#dailyBest").textContent = done
          ? "Solved " + fmtTime(done)
          : S.save.campaign.best["daily-" + dk]
            ? fmtTime(S.save.campaign.best["daily-" + dk])
            : "Best —";
        $("#dailyDone").classList.toggle("hidden", !done);
        $("#btnDailyStart").textContent = done
          ? "Replay Daily →"
          : "Start Daily →";
      }

      /* ---------- MODES / FLOW ---------- */
      function showLoading(on, sub) {
        $("#loadingOverlay").classList.toggle("open", on);
        if (sub) $("#loadingSub").textContent = sub;
      }
      async function loadCampaignLevel(i, forceTutorial = false) {
        showView("play");
        showLoading(true, "Verifying a unique solution");
        const key = "camp-" + i;
        let pz = S.save.cache[key];
        if (!pz || !pz.clues) {
          const sp = campaignSpec(i);
          const seed = hashStr("SHAPEBOUND-campaign-v1-" + i);
          pz = await generatePuzzle(sp.w, sp.h, seed, sp.diff);
          if (!pz) {
            showLoading(false);
            return;
          }
          pz.title = `Level ${i + 1}`;
          pz.levelIndex = i;
          S.save.cache[key] = {
            w: pz.w,
            h: pz.h,
            clues: pz.clues,
            solution: pz.solution,
            seed: pz.seed,
            difficulty: pz.difficulty,
            verified: true,
          };
          persist();
        } else {
          pz = Object.assign({}, pz, {
            title: `Level ${i + 1}`,
            levelIndex: i,
          });
        }
        showLoading(false);
        startPuzzle({
          mode: "campaign",
          puzzle: pz,
          title: `Level ${i + 1}`,
          levelIndex: i,
          forceTutorial,
        });
      }
      function dailySpec(dk) {
        const sizes = [
          [6, 6, 1],
          [7, 7, 1],
          [8, 8, 2],
          [9, 9, 3],
          [10, 10, 3],
          [12, 12, 4],
          [8, 8, 2],
        ];
        const idx = Math.abs(dayNum(dk)) % 7;
        const s = sizes[idx];
        // gentle escalation within month
        const dom = parseInt(dk.slice(8, 10), 10);
        let diff = s[2];
        if (dom > 24) diff = Math.min(5, diff + 1);
        return { w: s[0], h: s[1], diff };
      }
      async function loadDaily(dk) {
        dk = dk || dateKey();
        showView("play");
        showLoading(true, "Unsealing today's challenge");
        const key = "daily-" + dk;
        let pz = S.save.cache[key];
        if (!pz || !pz.clues) {
          const spec = dailySpec(dk);
          const seed = hashStr("SHAPEBOUND-DAILY-v1-" + dk);
          pz = await generatePuzzle(spec.w, spec.h, seed, spec.diff);
          if (!pz) {
            showLoading(false);
            return;
          }
          pz.dailyKey = dk;
          S.save.cache[key] = {
            w: pz.w,
            h: pz.h,
            clues: pz.clues,
            solution: pz.solution,
            seed: pz.seed,
            difficulty: pz.difficulty,
            verified: true,
            dailyKey: dk,
          };
          persist();
        } else pz = Object.assign({}, pz, { dailyKey: dk });
        showLoading(false);
        startPuzzle({
          mode: dk === dateKey() ? "daily" : "archive",
          puzzle: pz,
          title: `Daily Challenge`,
          dailyKey: dk,
        });
      }
      async function startGenerated(mode, W, H, diff, seed, opts = {}) {
        showView("play");
        showLoading(true, "Verifying a unique solution");
        seed = seed || (Math.random() * 1e9) >>> 0;
        const pz = await generatePuzzle(W, H, seed, diff);
        showLoading(false);
        if (!pz) return;
        startPuzzle(
          Object.assign(
            {
              mode,
              puzzle: pz,
              title: opts.title || `${W}×${H} · ${DIFFS[pz.difficulty]}`,
            },
            opts,
          ),
        );
      }
      function startPuzzle(o) {
        S.mode = o.mode;
        S.puzzle = o.puzzle;
        S.levelIndex = o.levelIndex ?? null;
        S.dailyKey = o.dailyKey || null;
        S.playerRects = [];
        S.selectedId = null;
        S.anchor = null;
        S.draft = null;
        S.colorCounter = 0;
        S.completed = false;
        S.paused = false;
        S.winShown = false;
        S.hintsUsed = 0;
        S.mistakes = 0;
        S.rectId = 1;
        S.hintFx = null;
        S.assistCands = [];
        S.cursorOn = false;
        S._timeUpShown = false;
        S.timerAccum = 0;
        S.timerRunning = false;
        S.countdownOn = false;
        S.showZenTimer = false;
        S.timeLimitMinutes =
          o.timeLimitMinutes !== undefined
            ? o.timeLimitMinutes
            : o.mode === "timetrial"
              ? 5
              : null;
        if (o.mode === "timetrial" || (S.timeLimitMinutes && S.timeLimitMinutes > 0)) {
          S.countdownOn = true;
          S.countdownMs = (S.timeLimitMinutes || 5) * 60 * 1000;
        }
        if (o.assist !== undefined) {
          /* per-game assist override */
        }
        if (o.timerAccum) S.timerAccum = o.timerAccum;
        if (o.rects)
          S.playerRects = o.rects.map((r) => ({ ...r, id: S.rectId++ }));
        if (!o.isResume) {
          S.save.stats.attempted++;
          persist();
        }
        const shouldShowTutorial =
          Boolean(o.forceTutorial) ||
          (o.mode === "campaign" &&
            o.levelIndex === 0 &&
            !(S.save.campaign.completed || []).includes(0));
        S.tutorial = {
          active: shouldShowTutorial,
          target: null,
        };
        updateTutorialUI();
        S.returnTo = null;
        $("#gameHeaderTitle").textContent = o.title || "Puzzle";
        if ($("#playSub"))
          $("#playSub").textContent =
          `${S.puzzle.w}×${S.puzzle.h} · ${DIFFS[S.puzzle.difficulty] ?? "Custom"} · ${S.puzzle.clues.length} clues` +
          (S.mode === "zen" ? " · zen" : "");
        if ($("#sideBest")) $("#sideBest").textContent = bestForCurrent() || "—";
        if ($("#chkStrict2")) $("#chkStrict2").checked = S.save.settings.strict;
        if ($("#btnAssist")) {
          $("#btnAssist").textContent =
            "Assist: " + (S.save.settings.assist ? "On" : "Off");
          if ($("#btnAssist").parentElement && $("#btnAssist").parentElement.parentElement) {
            $("#btnAssist").parentElement.parentElement.classList.toggle(
              "opacity-70",
              !S.save.settings.assist,
            );
          }
        }
        if ($("#assistBody")) {
          $("#assistBody").innerHTML =
            "Tap a clue to inspect its factor pairs and candidates. Enable <b>Assist</b> to preview every legal placement.";
        }
        [
          "loadingOverlay",
          "modal-pause",
          "modal-win",
          "modal-confirm",
        ].forEach((id) => {
          try {
            $("#" + id).classList.remove("open");
          } catch (e) {}
        });
        try {
          $("#btnSoundQuick").textContent = S.save.settings.sound
            ? "🔊 Sound"
            : "🔇 Muted";
        } catch (e) {}
        showView("play");
        resizeBoard();
        updateSide();
        updateDrawInfo(null);
        timerStart();
        timerTick();
        announce(
          `Puzzle started. ${S.puzzle.w} by ${S.puzzle.h}, ${S.puzzle.clues.length} clues.`,
        );
        saveCurrent(o.title);
      }
      function bestForCurrent() {
        if (S.mode === "campaign" && S.levelIndex != null) {
          const b = S.save.campaign.best[S.levelIndex];
          return b != null ? fmtTime(b) : null;
        }
        if ((S.mode === "daily" || S.mode === "archive") && S.dailyKey) {
          const b = S.save.daily.solved[S.dailyKey];
          return b ? fmtTime(b) : null;
        }
        return null;
      }
      function saveCurrent() {
        S.save.current = null;
      }
      function autosaveCurrent() {}
      function resumeCurrent() {}
      function resumePlayView() {
        if (!S.puzzle) {
          showView("home");
          return;
        }
        S.returnTo = null;
        showView("play");
        requestAnimationFrame(() => {
          resizeBoard();
          drawBoard();
        });
        if (!S.completed && !S.paused) timerResume();
        if (S.paused) $("#modal-pause").classList.add("open");
      }
      /* solved */
      function onSolved() {
        if (S.completed) return;
        S.completed = true;
        timerPause();
        const ms = activeMs();
        AudioSys.play(S.mode === "daily" ? "daily" : "win");
        S.save.stats.solved = (S.save.stats.solved || 0) + 1;
        S.save.stats.totalMs = (S.save.stats.totalMs || 0) + ms;
        if (!S.save.stats.fastest || ms < S.save.stats.fastest) S.save.stats.fastest = ms;

        let isBest = false;
        if (S.mode === "campaign" && S.levelIndex != null) {
          if (!S.save.campaign.completed.includes(S.levelIndex))
            S.save.campaign.completed.push(S.levelIndex);
          const pb = S.save.campaign.best[S.levelIndex];
          if (pb == null || ms < pb) {
            S.save.campaign.best[S.levelIndex] = ms;
            isBest = true;
          }

          if (S.hintsUsed === 0) S.save.campaign.hintFree[S.levelIndex] = true;
          S.save.campaign.hints[S.levelIndex] =
            (S.save.campaign.hints[S.levelIndex] || 0) + S.hintsUsed;
        }
        if (S.mode === "daily" && S.dailyKey) {
          const dk = S.dailyKey,
            last = S.save.daily.lastSolved;
          const yest = addDays(dk, -1);
          if (last !== dk) {
            S.save.daily.streak = last === yest ? S.save.daily.streak + 1 : 1;
            S.save.daily.longest = Math.max(
              S.save.daily.longest,
              S.save.daily.streak,
            );
            S.save.daily.lastSolved = dk;
          }
          if (!S.save.daily.solved[dk] || ms < S.save.daily.solved[dk]) {
            S.save.daily.solved[dk] = ms;
            isBest = true;
          }
        }
        if (S.mode === "archive" && S.dailyKey) {
          if (
            !S.save.daily.solved[S.dailyKey] ||
            ms < S.save.daily.solved[S.dailyKey]
          )
            S.save.daily.solved[S.dailyKey] = ms;
        }
        S.save.current = null;
        persist(true);
        checkAchievements(ms);
        drawBoard();
        winParticles();
        setTimeout(
          () => showWin(ms, isBest),
          S.save.settings.reducedMotion ? 150 : 700,
        );
        announce(
          `Puzzle complete in ${fmtTime(ms)} with ${S.hintsUsed} hints.`,
        );
      }
      function onTimeUp() {
        if (S.completed || (S.paused && S.countdownOn && S._timeUpShown))
          return;
        S._timeUpShown = true;
        S.paused = true;
        timerPause();
        AudioSys.play("invalid");
        const limitStr = fmtTime(S.countdownMs);
        confirmBox(
          "Time's up",
          `The ${limitStr} clock expired. Your board is kept — retry with a fresh clock, or exit.`,
          () => {
            S.timerAccum = 0;
            S.paused = false;
            S._timeUpShown = false;
            timerStart();
            toast(`Clock reset (${limitStr}) — go!`, "⏱");
          },
          () => {
            timerStop();
            S.paused = false;
            showView("home");
          },
          "Retry",
          "Exit",
        );
      }
      function showWin(ms, isBest) {
        if (S.winShown) return;
        S.winShown = true;
        $("#winTime").textContent = fmtTime(ms);

        const titles = [
          "Beautifully divided.",
          "Quietly perfect.",
          "Every shape bounded.",
          "A clean map.",
          "Logic, settled.",
        ];
        $("#winTitle").textContent =
          titles[Math.floor(Math.random() * titles.length)];

        $("#modal-win").classList.add("open");
        $("#btnWinNext").style.display =
          S.mode === "campaign" && S.levelIndex != null
            ? ""
            : "none";
        animateFrom("#modal-win .modal", {
          opacity: 0,
          scale: 0.94,
          y: 10,
          duration: 0.4,
          ease: "power2.out",
        });
      }
      function winParticles() {
        if (S.save.settings.reducedMotion) return;
        try {
          const cv = $("#fx");
          if (!cv) return;
          const ctx = cv.getContext("2d");
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const W = window.innerWidth;
          const H = window.innerHeight;
          cv.width = W * dpr;
          cv.height = H * dpr;
          cv.style.width = W + "px";
          cv.style.height = H + "px";
          ctx.scale(dpr, dpr);

          const colors = [
            "#F59E0B", "#FBBF24", // Vibrant Gold / Amber
            "#10B981", "#34D399", // Emerald
            "#3B82F6", "#60A5FA", // Electric Blue
            "#EC4899", "#F472B6", // Bright Rose / Pink
            "#8B5CF6", "#A78BFA", // Violet
            "#EF4444", "#F87171", // Coral
            S.pal && S.pal.accent ? S.pal.accent : "#F59E0B",
          ];

          const particles = [];

          // 1. Center radial burst
          const centerCount = 65;
          for (let i = 0; i < centerCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 9;
            particles.push({
              x: W / 2,
              y: H * 0.45,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 2.5,
              size: 6 + Math.random() * 8,
              color: colors[Math.floor(Math.random() * colors.length)],
              tilt: Math.random() * 360,
              tiltSpeed: (Math.random() - 0.5) * 12,
              wobble: Math.random() * Math.PI * 2,
              wobbleSpeed: 0.08 + Math.random() * 0.08,
              shape: Math.random() > 0.35 ? "rect" : (Math.random() > 0.5 ? "circle" : "star"),
              alpha: 1,
              decay: 0.005 + Math.random() * 0.004,
              gravity: 0.16 + Math.random() * 0.06,
              drag: 0.985,
            });
          }

          // 2. Left corner cannon (shoots up and right)
          const leftCannonCount = 55;
          for (let i = 0; i < leftCannonCount; i++) {
            const angle = -Math.PI * 0.18 - Math.random() * Math.PI * 0.22;
            const speed = 13 + Math.random() * 11;
            particles.push({
              x: W * 0.06,
              y: H * 0.94,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 7 + Math.random() * 9,
              color: colors[Math.floor(Math.random() * colors.length)],
              tilt: Math.random() * 360,
              tiltSpeed: (Math.random() - 0.5) * 14,
              wobble: Math.random() * Math.PI * 2,
              wobbleSpeed: 0.06 + Math.random() * 0.08,
              shape: Math.random() > 0.35 ? "rect" : (Math.random() > 0.5 ? "circle" : "star"),
              alpha: 1,
              decay: 0.004 + Math.random() * 0.003,
              gravity: 0.20 + Math.random() * 0.06,
              drag: 0.982,
            });
          }

          // 3. Right corner cannon (shoots up and left)
          const rightCannonCount = 55;
          for (let i = 0; i < rightCannonCount; i++) {
            const angle = -Math.PI * 0.60 - Math.random() * Math.PI * 0.22;
            const speed = 13 + Math.random() * 11;
            particles.push({
              x: W * 0.94,
              y: H * 0.94,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 7 + Math.random() * 9,
              color: colors[Math.floor(Math.random() * colors.length)],
              tilt: Math.random() * 360,
              tiltSpeed: (Math.random() - 0.5) * 14,
              wobble: Math.random() * Math.PI * 2,
              wobbleSpeed: 0.06 + Math.random() * 0.08,
              shape: Math.random() > 0.35 ? "rect" : (Math.random() > 0.5 ? "circle" : "star"),
              alpha: 1,
              decay: 0.004 + Math.random() * 0.003,
              gravity: 0.20 + Math.random() * 0.06,
              drag: 0.982,
            });
          }

          let frame = 0;
          const maxFrames = 240;

          function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
            let rot = (Math.PI / 2) * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
              x = cx + Math.cos(rot) * outerRadius;
              y = cy + Math.sin(rot) * outerRadius;
              ctx.lineTo(x, y);
              rot += step;
              x = cx + Math.cos(rot) * innerRadius;
              y = cy + Math.sin(rot) * innerRadius;
              ctx.lineTo(x, y);
              rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
          }

          (function tick() {
            frame++;
            ctx.clearRect(0, 0, W, H);
            let alive = 0;

            for (let i = 0; i < particles.length; i++) {
              const p = particles[i];
              if (p.alpha <= 0.01) continue;
              alive++;

              p.x += p.vx;
              p.y += p.vy;
              p.vx *= p.drag;
              p.vy = p.vy * p.drag + p.gravity;
              p.tilt += p.tiltSpeed;
              p.wobble += p.wobbleSpeed;
              p.alpha -= p.decay;

              const xWobble = p.x + Math.sin(p.wobble) * 8;
              const tiltCos = Math.cos((p.tilt * Math.PI) / 180);

              ctx.save();
              ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
              ctx.fillStyle = p.color;
              ctx.translate(xWobble, p.y);

              if (p.shape === "circle") {
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
              } else if (p.shape === "star") {
                ctx.rotate((p.tilt * Math.PI) / 180);
                drawStar(ctx, 0, 0, 5, p.size * 0.7, p.size * 0.35);
              } else {
                // 3D Fluttering Rectangle / Ribbon
                ctx.scale(1, tiltCos);
                ctx.rotate(((p.tilt * 0.5) * Math.PI) / 180);
                ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size * 1.2, p.size * 0.6);
              }

              ctx.restore();
            }

            if (alive > 0 && frame < maxFrames) {
              requestAnimationFrame(tick);
            } else {
              ctx.clearRect(0, 0, W, H);
            }
          })();
        } catch (e) {
          console.warn("Celebration fx error:", e);
        }
      }
      /* ---------- ACHIEVEMENTS ---------- */
      function unlock(id) {}
      function checkAchievements(ms) {}
      /* ---------- MODALS ---------- */
      let confirmCb = null,
        confirmAlt = null;
      function confirmBox(title, msg, onYes, onAlt, yesLabel, noLabel) {
        onAlt = onAlt || null;
        yesLabel = yesLabel || "Confirm";
        noLabel = noLabel || "Cancel";
        $("#confirmTitle").textContent = title;
        $("#confirmMsg").textContent = msg;
        $("#btnConfirmYes").textContent = yesLabel || "Confirm";
        $("#btnConfirmNo").textContent = noLabel || "Cancel";
        $("#confirmInput").classList.add("hidden");
        $("#confirmInput").value = "";
        $("#confirmInput").classList.remove("shake-input");
        const confirmErr = $("#confirmError");
        if (confirmErr) confirmErr.classList.add("hidden");
        confirmCb = onYes;
        confirmAlt = onAlt;
        $("#modal-confirm").classList.add("open");
        animateFrom("#modal-confirm .modal", {
          opacity: 0,
          scale: 0.94,
          y: 10,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      function pauseGame() {
        if (S.completed || S.view !== "play") return;
        S.paused = true;
        timerPause();
        $("#pauseTime").textContent = S.countdownOn
          ? fmtTime(Math.max(0, S.countdownMs - activeMs()))
          : fmtTime(activeMs());
        $("#modal-pause").classList.add("open");
        AudioSys.play("click");
      }
      function requestExitPuzzle() {
        if (S.completed || S.view !== "play") return;
        const wasPaused = S.paused;
        if (!wasPaused) timerPause();
        S.paused = true;
        confirmBox(
          "Exit puzzle?",
          "Your current progress will be saved on this device.",
          () => {
            timerStop();
            S.paused = false;
            saveCurrent();
            showView("home");
          },
          () => {
            if (!wasPaused) {
              S.paused = false;
              timerResume();
            }
          },
          "Exit puzzle",
          "Stay",
        );
      }
      function resumeGame() {
        S.paused = false;
        $("#modal-pause").classList.remove("open");
        timerResume();
        AudioSys.play("click");
      }
      function continueFromPause() {
        S.paused = false;
        $("#modal-pause").classList.remove("open");
        if (S.view === "play" && !S.completed) timerResume();
      }
      /* ---------- SHARE / ENCODING ---------- */
      function encodePuzzle(p) {
        try {
          const o = { w: p.w, h: p.h, s: p.seed >>> 0, d: p.difficulty ?? 2 };
          const j = JSON.stringify(o);
          const b = btoa(j)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
          return "PCL1-" + b;
        } catch (e) {
          return "";
        }
      }
      function decodePuzzle(code) {
        try {
          code = code.trim();
          if (code.startsWith("http") || code.includes("#")) {
            const m = code.match(/p=([A-Za-z0-9\-_]+)/);
            if (m) code = m[1];
          }
          if (!code.startsWith("PCL1-")) return null;
          const b = code.slice(5).replace(/-/g, "+").replace(/_/g, "/");
          const j = atob(b);
          const o = JSON.parse(j);
          if (!o.w || !o.h || o.w < 4 || o.h < 4 || o.w > 16 || o.h > 16)
            return null;
          return o;
        } catch (e) {
          return null;
        }
      }

      /* ---------- DEBUG ---------- */
      let fpsFrames = 0,
        fpsLast = performance.now(),
        fps = 0;
      (function fpsLoop() {
        fpsFrames++;
        const n = performance.now();
        const debugOn =
          $("#debugOverlay") && $("#debugOverlay").style.display === "block";
        if (n - fpsLast > 1000) {
          fps = fpsFrames;
          fpsFrames = 0;
          fpsLast = n;
          if (debugOn) updateDebug();
        }
        if (debugOn) {
          requestAnimationFrame(fpsLoop);
        } else {
          setTimeout(fpsLoop, 1000);
        }
      })();
      function updateDebug() {
        const d = $("#debugOverlay");
        if (d.style.display !== "block") return;
        const cands = S.puzzle ? allCandidates(S.puzzle) : [];
        const tot = cands.reduce((a, l) => a + l.length, 0);
        d.innerHTML = `FPS ${fps} · ${S.view}/${S.mode || "-"} · seed ${S.puzzle ? S.puzzle.seed : "-"}<br>board ${S.puzzle ? S.puzzle.w + "×" + S.puzzle.h : "-"} · diff ${S.puzzle ? DIFFS[S.puzzle.difficulty] : "-"} · rects ${S.playerRects.length}/${S.puzzle ? S.puzzle.clues.length : 0}<br>candidates ${tot} · timer ${fmtTime(activeMs())} · hints ${S.hintsUsed}<br><button id="dbgSol" style="background:#0f0;border:none;padding:2px 8px;border-radius:4px;cursor:pointer">show solution</button> <button id="dbgCand" style="background:#0ff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer">candidates</button>`;
        const s = $("#dbgSol");
        if (s)
          s.onclick = () => {
            const sol = trueSolution();
            if (sol) {
              S.playerRects = sol.map((r) => ({
                ...r,
                id: S.rectId++,
                born: performance.now(),
              }));
              afterChange("debug-solve");
            }
          };
        const cd = $("#dbgCand");
        if (cd)
          cd.onclick = () => {
            S.save.settings.assist = !S.save.settings.assist;
            S.assistCands = [];
            if (S.puzzle && S.save.settings.assist) {
              const all = allCandidates(S.puzzle);
              S.assistCands = all.flat().slice(0, 200);
            }
            drawBoard();
          };
      }
      /* ---------- SETTINGS BIND ---------- */
      function bindToggle(id, get, set) {
        const el = $(id);
        if (!el) return () => {};
        const paint = () => el.classList.toggle("on", !!get());
        paint();
        const flip = () => {
          set(!get());
          paint();
          AudioSys.play("click");
        };
        el.onclick = flip;
        el.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            flip();
          }
        };
        return paint;
      }
      function updateRangeFill(el) {
        if (!el) return;
        const min = +el.min || 0;
        const max = +el.max || 100;
        const val = +el.value || 0;
        const pct = ((val - min) / (max - min)) * 100;
        el.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--surface-3) ${pct}%, var(--surface-3) 100%)`;
      }
      function updateSoundSlidersUI() {
        const soundOn = !!S.save.settings.sound;
        ["setVol", "setAmb"].forEach((id) => {
          const input = $("#" + id);
          if (!input) return;
          input.disabled = !soundOn;
          const lbl = input.closest("label");
          if (lbl) {
            lbl.style.opacity = soundOn ? "1" : "0.45";
            lbl.style.cursor = soundOn ? "auto" : "not-allowed";
          }
        });
      }
      let painters = [];
      function initSettings() {
        const s = S.save.settings;
        if ($("#setInput")) {
          $("#setInput").value = s.input;
          $("#setInput").onchange = (e) => {
            s.input = e.target.value;
            persist();
            toast("Interaction: " + e.target.selectedOptions[0].text, "🎮");
          };
        }
        painters = [

          bindToggle(
            "#setSound",
            () => s.sound,
            (v) => {
              s.sound = v;
              AudioSys.setVolumes();
              persist();
              updateSoundSlidersUI();
            },
          ),
        ];
        const th = $("#setTheme");
        if (th) {
          th.innerHTML = Object.entries(THEMES)
            .map(
              ([k, t]) =>
                `<option value="${k}">${t.label}${themeUnlocked(k) ? "" : " 🔒"}</option>`,
            )
            .join("");
          th.value = S.save.theme;
          th.onchange = (e) => {
            if (!themeUnlocked(e.target.value)) {
              toast("Locked — " + THEMES[e.target.value].lockTxt + ".", "🔒");
              e.target.value = S.save.theme;
              return;
            }
            applyTheme(e.target.value);
            persist();
          };
        }
        const sl = $("#setLines");
        if (sl) {
          sl.value = String(s.lines);
          sl.onchange = (e) => {
            s.lines = +e.target.value;
            persist();
            drawBoard();
          };
        }
        const st = $("#setTint");
        if (st) {
          st.value = s.tint;
          st.oninput = (e) => {
            s.tint = +e.target.value;
            drawBoard();
          };
          st.onchange = () => persist();
        }
        $("#setVol").value = s.vol;
        updateRangeFill($("#setVol"));
        $("#setVol").oninput = (e) => {
          s.vol = +e.target.value;
          AudioSys.setVolumes();
          updateRangeFill(e.target);
        };
        $("#setVol").onchange = () => persist();
        $("#setAmb").value = s.amb;
        updateRangeFill($("#setAmb"));
        $("#setAmb").oninput = (e) => {
          s.amb = +e.target.value;
          AudioSys.setVolumes();
          updateRangeFill(e.target);
        };
        $("#setAmb").onchange = () => persist();

        updateSoundSlidersUI();
      }
      function refreshSettingsUI() {
        const s = S.save.settings;
        try {
          const th = $("#setTheme");
          if (th) {
            th.innerHTML = Object.entries(THEMES)
              .map(
                ([k, t]) =>
                  `<option value="${k}">${t.label}${themeUnlocked(k) ? "" : " 🔒"}</option>`,
              )
              .join("");
            th.value = s.theme;
          }
          if ($("#setInput")) $("#setInput").value = s.input;
          if ($("#setLines")) $("#setLines").value = String(s.lines);
          if ($("#setTint")) $("#setTint").value = s.tint;
          $("#setVol").value = s.vol;
          updateRangeFill($("#setVol"));
          $("#setAmb").value = s.amb;
          updateRangeFill($("#setAmb"));

          if ($("#btnSoundQuick")) $("#btnSoundQuick").textContent = s.sound ? "🔊 Sound" : "🔇 Muted";

          const hasCampaignProgress =
            (S.save.campaign?.completed || []).length > 0 ||
            Object.keys(S.save.campaign?.best || {}).length > 0;
          const btnResetCamp = $("#btnResetCampaign");
          if (btnResetCamp) {
            btnResetCamp.disabled = !hasCampaignProgress;
            btnResetCamp.classList.toggle("opacity-40", !hasCampaignProgress);
            btnResetCamp.classList.toggle("cursor-not-allowed", !hasCampaignProgress);
            btnResetCamp.title = hasCampaignProgress
              ? "Clear level completions & best times"
              : "No level progress to reset";
          }

          const hasAnyData =
            hasCampaignProgress ||
            (S.save.stats && S.save.stats.solved > 0) ||
            (S.save.daily &&
              (S.save.daily.streak > 0 ||
                Object.keys(S.save.daily.solved || {}).length > 0)) ||
            S.save.current != null;
          const btnClear = $("#btnClearData");
          if (btnClear) {
            btnClear.disabled = !hasAnyData;
            btnClear.classList.toggle("opacity-40", !hasAnyData);
            btnClear.classList.toggle("cursor-not-allowed", !hasAnyData);
            btnClear.title = hasAnyData
              ? "Wipe puzzles, streaks, and settings"
              : "Already fresh — no data to clear";
          }
        } catch (e) {}
        painters.forEach((p) => {
          try {
            p();
          } catch (e) {}
        });
        updateSoundSlidersUI();
      }
      /* ---------- INIT / EVENTS ---------- */
      function init() {
        loadSave();
        document.body.classList.toggle(
          "reduced-motion",
          !!S.save.settings.reducedMotion,
        );
        document.body.classList.toggle(
          "large-text",
          !!S.save.settings.largeText,
        );
        applyTheme(S.save.theme || "paper", false);
        initSettings();
        bindBoard();
        // nav
        $$("[data-go]").forEach(
          (b) =>
            (b.onclick = () => {
              if (b.dataset.go === "settings") openSettingsModal();
              else showView(b.dataset.go);
            }),
        );
        $$("[data-mode]").forEach(
          (b) => (b.onclick = () => quickMode(b.dataset.mode)),
        );
        $$(".stepper-btn").forEach((btn) => {
          btn.onclick = () => {
            const input = $("#" + btn.dataset.for);
            if (!input) return;
            const min = +input.min || 1;
            const max = +input.max || 99;
            const step = +btn.dataset.step || 1;
            let val = (+input.value || min) + step;
            input.value = Math.max(min, Math.min(max, val));
            AudioSys.play("click");
          };
        });
        ["fpW", "fpH"].forEach((id) => {
          const el = $("#" + id);
          if (!el) return;
          el.oninput = () => {
            if (el.value.length > 2) el.value = el.value.slice(0, 2);
            let val = parseInt(el.value, 10);
            if (!isNaN(val) && val > 14) el.value = 14;
          };
          el.onblur = () => {
            let val = parseInt(el.value, 10);
            if (isNaN(val) || val < 5) el.value = 5;
            else if (val > 14) el.value = 14;
          };
        });
        $("#logoBtn").onclick = () => {
          if (S.view === "play") {
            pauseGame();
          } else if (S.returnTo === "play" && S.puzzle && !S.completed) {
            resumePlayView();
          } else showView("home");
        };
        $("#btnBack").onclick = () => {
          if (S.view === "play") {
            requestExitPuzzle();
          } else if (S.returnTo === "play" && S.puzzle && !S.completed) {
            resumePlayView();
          } else {
            S.returnTo = null;
            showView("home");
          }
        };
        if ($("#btnSettings")) $("#btnSettings").onclick = openSettingsModal;
        if ($("#btnHomeSettings")) $("#btnHomeSettings").onclick = openSettingsModal;
        if ($("#btnHomeFullscreen"))
          $("#btnHomeFullscreen").onclick = () => {
            try {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen();
            } catch (e) {
              toast("Fullscreen not supported here.", "⛶");
            }
          };

        const closeSettingsModal = () => {
          const m = $("#modal-settings");
          if (m) m.classList.remove("open");
        };
        if ($("#btnCloseSettingsModal")) $("#btnCloseSettingsModal").onclick = closeSettingsModal;
        if ($("#btnSaveSettingsModal")) $("#btnSaveSettingsModal").onclick = closeSettingsModal;
        if ($("#filterChapter")) $("#filterChapter").onchange = renderLevels;
        if ($("#filterStatus")) $("#filterStatus").onchange = renderLevels;
        if ($("#sortLevels")) $("#sortLevels").onchange = renderLevels;
        // play buttons
        $("#gameHeaderPause").onclick = pauseGame;
        $("#btnResume").onclick = resumeGame;
        $("#btnPauseReset").onclick = () => {
          continueFromPause();
          resetPuzzle();
        };
        $("#btnPauseSettings").onclick = () => {
          continueFromPause();
          openSettingsModal();
        };
        $("#btnPauseExit").onclick = () => {
          $("#modal-pause").classList.remove("open");
          S.paused = false;
          timerStop();
          saveCurrent();
          showView("home");
        };
        $("#btnHint").onclick = () => {
          applyHint();
        };
        $("#btnReset").onclick = resetPuzzle;
        if ($("#btnSkipTutorial")) {
          $("#btnSkipTutorial").onclick = () => {
            if (S.tutorial) S.tutorial.active = false;
            if ($("#tutorialBar")) $("#tutorialBar").classList.add("hidden");
            if (S.view === "play") resizeBoard();
          };
        }
        if ($("#btnStartTutorialHowTo")) {
          $("#btnStartTutorialHowTo").onclick = () => {
            loadCampaignLevel(0, true);
          };
        }
        if ($("#chkStrict2")) {
          $("#chkStrict2").onchange = (e) => {
            S.save.settings.strict = e.target.checked;
            persist();
          };
        }
        if ($("#btnAssist")) {
          $("#btnAssist").onclick = () => {
            S.save.settings.assist = !S.save.settings.assist;
            $("#btnAssist").textContent =
              "Assist: " + (S.save.settings.assist ? "On" : "Off");
            persist();
            toast(
              "Assist " +
                (S.save.settings.assist ? "on — tap any clue." : "off."),
              "◈",
            );
            if (!S.save.settings.assist) {
              S.assistCands = [];
              drawBoard();
            }
          };
        }
        if ($("#btnSoundQuick")) {
          $("#btnSoundQuick").onclick = () => {
            S.save.settings.sound = !S.save.settings.sound;
            AudioSys.setVolumes();
            persist();
            $("#btnSoundQuick").textContent = S.save.settings.sound
              ? "🔊 Sound"
              : "🔇 Muted";
            refreshSettingsUI();
          };
        }
        // win
        $("#btnWinReplay").onclick = () => {
          $("#modal-win").classList.remove("open");
          replayPuzzle();
        };
        $("#btnWinLevels").onclick = () => {
          $("#modal-win").classList.remove("open");
          showView(S.mode === "campaign" ? "levels" : "home");
        };
        $("#btnWinNext").onclick = () => {
          $("#modal-win").classList.remove("open");
          nextPuzzle();
        };
        // confirm
        $("#btnConfirmNo").onclick = () => {
          $("#modal-confirm").classList.remove("open");
          const f = confirmAlt;
          confirmCb = confirmAlt = null;
          if (f)
            try {
              f();
            } catch (e) {}
        };
        $("#btnConfirmYes").onclick = () => {
          const inp = $("#confirmInput");
          const err = $("#confirmError");
          if (!inp.classList.contains("hidden")) {
            const val = inp.value.trim().toUpperCase();
            if (val !== "RESET") {
              inp.classList.remove("shake-input");
              void inp.offsetWidth; // trigger reflow for re-animation
              inp.classList.add("shake-input");
              if (err) {
                err.classList.remove("hidden");
                err.textContent = "⚠ Please type RESET to confirm";
              }
              inp.focus();
              AudioSys.play("invalid");
              toast("Type RESET to confirm.", "⚠");
              return;
            }
          }
          if (err) err.classList.add("hidden");
          inp.classList.remove("shake-input");
          $("#modal-confirm").classList.remove("open");
          if (confirmCb) confirmCb();
          confirmCb = confirmAlt = null;
        };

        const confirmInp = $("#confirmInput");
        if (confirmInp) {
          confirmInp.addEventListener("input", (e) => {
            const err = $("#confirmError");
            if (e.target.value.trim().toUpperCase() === "RESET") {
              if (err) err.classList.add("hidden");
              e.target.classList.remove("shake-input");
            }
          });
          confirmInp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              $("#btnConfirmYes").click();
            }
          });
        }
        // daily
        $("#btnDailyStart").onclick = () => loadDaily(dateKey());
        // custom
        $("#btnRandomSeed").onclick = () => {
          $("#fpSeed").value = String((Math.random() * 900000 + 10000) >>> 0);
          AudioSys.play("click");
        };
        if ($("#btnFreeStart")) {
          $("#btnFreeStart").onclick = async () => {
            const w = clamp(+$("#fpW").value || 8, 5, 14),
              h = clamp(+$("#fpH").value || 8, 5, 14),
              d = +$("#fpDiff").value,
              timerMins = +($("#fpTimer")?.value || 0);
            let seed = $("#fpSeed") && $("#fpSeed").value.trim()
              ? hashStr("seed-" + $("#fpSeed").value.trim())
              : (Math.random() * 1e9) >>> 0;
            const isAssist = $("#fpAssist") && $("#fpAssist").checked;
            if (isAssist) {
              S.save.settings.assist = true;
              persist();
            }
            await startGenerated(
              isAssist ? "practice" : "free",
              w,
              h,
              d,
              seed,
              {
                title: `${w}×${h} · ${d < 0 ? "Mixed" : DIFFS[d]}` + (timerMins > 0 ? ` · ${timerMins}m Trial` : ""),
                timeLimitMinutes: timerMins,
              },
            );
          };
        }
        // destructive
        $("#btnResetCampaign").onclick = () => {
          const hasCampaignProgress =
            (S.save.campaign.completed || []).length > 0 ||
            Object.keys(S.save.campaign.best || {}).length > 0;
          if (!hasCampaignProgress) {
            toast("Nothing to reset — no level progress saved.", "ℹ");
            return;
          }
          confirmBox(
            "Reset Level Progress?",
            "All level completions, best times, and progress will be erased. Daily streaks stay.",
            () => {
              S.save.campaign = {
                completed: [],
                best: {},
                hints: {},
                hintFree: {},
              };
              persist(true);
              renderLevels();
              renderHome();
              refreshSettingsUI();
              toast("Level progress reset.", "↺");
            },
          );
        };
        $("#btnClearData").onclick = () => {
          const hasCampaignProgress =
            (S.save.campaign?.completed || []).length > 0 ||
            Object.keys(S.save.campaign?.best || {}).length > 0;
          const hasAnyData =
            hasCampaignProgress ||
            (S.save.stats && S.save.stats.solved > 0) ||
            (S.save.daily &&
              (S.save.daily.streak > 0 ||
                Object.keys(S.save.daily.solved || {}).length > 0)) ||
            S.save.current != null;
          if (!hasAnyData) {
            toast("Nothing to clear — data is already fresh.", "ℹ");
            return;
          }
          $("#confirmTitle").textContent = "Erase everything?";
          $("#confirmMsg").textContent =
            "This wipes puzzles, stats, streaks and settings on this device. There is no undo.";
          $("#confirmInput").classList.remove("hidden");
          $("#confirmInput").value = "";
          $("#confirmInput").classList.remove("shake-input");
          const confirmErr = $("#confirmError");
          if (confirmErr) confirmErr.classList.add("hidden");
          $("#modal-confirm").classList.add("open");
          animateFrom("#modal-confirm .modal", {
            opacity: 0,
            scale: 0.94,
            y: 10,
            duration: 0.3,
            ease: "power2.out",
          });
          confirmCb = () => {
            try {
              localStorage.removeItem(LS_KEY);
            } catch (e) {}
            S.save = defaultSave();
            storageOK = true;
            persist(true);
            applyTheme("paper", false);
            refreshSettingsUI();
            renderHome();
            renderLevels();
            const m = $("#modal-settings");
            if (m) m.classList.remove("open");
            toast("All local data cleared.", "🗑");
          };
        };
        // modal backdrop click
        $$(".modal-backdrop").forEach((m) =>
          m.addEventListener("pointerdown", (e) => {
            if (
              e.target === m &&
              m.id !== "loadingOverlay" &&
              m.id !== "modal-win" &&
              m.id !== "modal-pause"
            ) {
              m.classList.remove("open");
            }
          }),
        );
        // keyboard
        document.addEventListener("keydown", (e) => {
          if (e.key === "F3") {
            e.preventDefault();
            const d = $("#debugOverlay");
            d.style.display = d.style.display === "block" ? "none" : "block";
            updateDebug();
            return;
          }
          if (e.key === "Escape") {
            ["modal-confirm", "modal-settings"].forEach((id) =>
              $("#" + id).classList.remove("open"),
            );
            if (
              S.view === "play" &&
              !$("#modal-pause").classList.contains("open") &&
              !$("#modal-win").classList.contains("open")
            ) {
              if (S.anchor || S.selectedId) {
                S.anchor = null;
                S.selectedId = null;
                drawBoard();
              } else pauseGame();
            } else if ($("#modal-pause").classList.contains("open"))
              resumeGame();
            return;
          }
          if (S.view !== "play") return;
          if (e.key.toLowerCase() === "r") {
            $("#btnReset").click();
          } else if (e.key.toLowerCase() === "h") {
            applyHint();
          }
        });
        let rz;
        window.addEventListener("resize", () => {
          clearTimeout(rz);
          rz = setTimeout(() => {
            if (S.view === "play") resizeBoard();
          }, 150);
        });
        window.addEventListener(
          "pointerdown",
          () => {
            AudioSys.init();
            AudioSys.resume();
          },
          { once: true },
        );

        showView("home");
        renderHome();
        announce("Shapebound loaded. Choose Daily, Levels, or Learn.");
      }
      function quickMode(m) {
        if (m === "practice") {
          showView("custom");
          setTimeout(() => $("#fpW").focus(), 200);
          toast("Pick a size and difficulty, then Generate.", "◈");
        } else if (m === "zen") {
          startGenerated("zen", 8, 8, 1, (Math.random() * 1e9) >>> 0, {
            title: "Zen · 8×8",
          });
        } else if (m === "timetrial") {
          startGenerated("timetrial", 8, 8, 2, (Math.random() * 1e9) >>> 0, {
            title: "Time Trial · 8×8",
          });
        }
      }
      function resetPuzzle() {
        if (!S.puzzle || S.completed) return;
        const go = () => {
          S.playerRects = [];
          S.selectedId = null;
          S.anchor = null;
          S.draft = null;
          S.draftColorIdx = null;
          S.colorCounter = 0;
          S.hintsUsed = 0;
          S.mistakes = 0;
          S.timerAccum = 0;
          S.timerStart = performance.now();
          S._timeUpShown = false;
          S.paused = false;
          if (S.view === "play" && !S.completed) {
            timerStart();
          }
          AudioSys.play("delete");
          afterChange("reset");
          timerTick();
          drawBoard();
          updateSide();
          toast("Puzzle reset — fresh start.", "↺");
        };
        if (S.save.settings.confirmReset)
          confirmBox(
            "Reset this puzzle?",
            "All placed regions and timer will be reset.",
            go,
          );
        else go();
      }
      function replayPuzzle() {
        if (!S.puzzle) return;
        const o = {
          mode: S.mode,
          puzzle: S.puzzle,
          title: $("#gameHeaderTitle").textContent,
          levelIndex: S.levelIndex,
          dailyKey: S.dailyKey,
          timeLimitMinutes: S.timeLimitMinutes,
        };
        startPuzzle(o);
      }
      function nextPuzzle() {
        if (S.mode === "campaign" && S.levelIndex != null)
          loadCampaignLevel(S.levelIndex + 1);
        else showView("home");
      }
      document.addEventListener("DOMContentLoaded", init);
