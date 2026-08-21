(function(){
"use strict";
/* ==================================================
   1. CONSTANTS
   ================================================== */
var WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
var HUMAN = 'X', AI_SYM = 'O';
var STORAGE_KEY = 'og_tictactoe_save_v1';
var CELL = 1.15;
var defaultCustomTheme = {board:'#0e1116', line:'#00f0ff', x:'#00f0ff', o:'#ff2fd0', accent:'#00f0ff', accent2:'#ff2fd0', bg:'#050609'};

function getThemeHex(name){
  if(!name) return THEME_HEX.light;
  if(name === 'custom') return (SAVE && SAVE.settings && SAVE.settings.customTheme) ? SAVE.settings.customTheme : defaultCustomTheme;
  return THEME_HEX[name] || THEME_HEX.light;
}

var THEME_HEX = {
  light:  {board:'#ffffff', line:'#000000', x:'#000000', o:'#000000', accent:'#000000', accent2:'#2d3748', bg:'#f8fafc'},
  dark:   {board:'#000000', line:'#ffffff', x:'#ffffff', o:'#ffffff', accent:'#ffffff', accent2:'#e5e5e5', bg:'#000000'},
  cyber:  {board:'#083244', line:'#00f0ff', x:'#00f0ff', o:'#00f0ff', accent:'#00f0ff', accent2:'#00f0ff', bg:'#0084a5'},
  get custom(){ return (SAVE && SAVE.settings && SAVE.settings.customTheme) ? SAVE.settings.customTheme : defaultCustomTheme; }
};

/* ==================================================
   2. CONFIG / STATE
   ================================================== */
var SAVE = null;
var game = {
  mode:'local', difficulty:'medium',
  board:new Array(9).fill(null),
  current:'X', gameOver:false, winner:null, winLine:null,
  history:[], // {index, player}
  inProgress:false, playerNames:{X:'Player X', O:'Player O'}
};
var pendingConfirm = null;

/* ==================================================
   3. SAVE SYSTEM
   ================================================== */
function defaultSave(){
  return {
    settings:{ theme:'light', sound:true, voice:false, vibration:true, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
    stats:{
      local:{ xWins:0, oWins:0, draws:0 },
      easy:{ wins:0, losses:0, draws:0 },
      medium:{ wins:0, losses:0, draws:0 },
      hard:{ wins:0, losses:0, draws:0 },
      impossible:{ wins:0, losses:0, draws:0 }
    },
    session:{ x:0, o:0, draw:0 },
    snapshot:null
  };
}
function loadSave(){
  try{
    var raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultSave();
    var parsed = JSON.parse(raw);
    var def = defaultSave();
    var loadedStats = Object.assign(def.stats, parsed.stats||{});
    if(!loadedStats.hard) loadedStats.hard = { wins:0, losses:0, draws:0 };
    return Object.assign(def, parsed, {
      settings:Object.assign(def.settings, parsed.settings||{}),
      stats:loadedStats,
      session:Object.assign(def.session, parsed.session||{})
    });
  }catch(e){ return defaultSave(); }
}
function persist(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(SAVE)); }catch(e){}
}
function saveSnapshot(){
  SAVE.snapshot = game.inProgress && !game.gameOver ? {
    mode:game.mode, difficulty:game.difficulty, board:game.board.slice(),
    current:game.current, history:game.history.slice(), playerNames:game.playerNames,
    human: HUMAN, aiSym: AI_SYM
  } : null;
  persist();
}

/* ==================================================
   4. THEME MANAGER
   ================================================== */
function getColorLuminance(hex){
  if(!hex) return 0;
  var c = hex.replace('#', '');
  if(c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  if(c.length < 6) return 0;
  var r = parseInt(c.substr(0,2),16)||0;
  var g = parseInt(c.substr(2,2),16)||0;
  var b = parseInt(c.substr(4,2),16)||0;
  return (r*299 + g*587 + b*114) / 1000;
}

var THEME_ORDER = ['light','dark','cyber'];
function applyTheme(name, skipPersist){
  document.body.className = 'theme-' + name;
  SAVE.settings.theme = name;
  if(name === 'custom'){
    var ct = THEME_HEX.custom;
    var boardLum = getColorLuminance(ct.board);
    var bgLum = getColorLuminance(ct.bg);
    var isLight = (boardLum > 135 || bgLum > 160);

    document.body.style.setProperty('--bg', ct.bg);
    document.body.style.setProperty('--bg2', ct.bg);
    document.body.style.setProperty('--board', ct.board);
    document.body.style.setProperty('--line', ct.line);
    document.body.style.setProperty('--accent', ct.x);
    document.body.style.setProperty('--accent2', ct.o);
    document.body.style.setProperty('--x-color', ct.x);
    document.body.style.setProperty('--o-color', ct.o);

    var lineLum = getColorLuminance(ct.line);

    if(isLight){
      document.body.style.setProperty('--text', '#090d16');
      document.body.style.setProperty('--text-dim', '#475569');
      document.body.style.setProperty('--surface', 'rgba(0, 0, 0, 0.07)');
      document.body.style.setProperty('--panel-bg', (ct.board && ct.board.length === 7) ? ct.board + 'f5' : 'rgba(255, 255, 255, 0.96)');
      document.body.style.setProperty('--border', lineLum > 210 ? 'rgba(0, 0, 0, 0.25)' : ct.line);
    } else {
      document.body.style.setProperty('--text', '#ffffff');
      document.body.style.setProperty('--text-dim', '#94a3b8');
      document.body.style.setProperty('--surface', 'rgba(255, 255, 255, 0.08)');
      document.body.style.setProperty('--panel-bg', (ct.board && ct.board.length === 7) ? ct.board + 'f5' : 'rgba(15, 23, 42, 0.94)');
      document.body.style.setProperty('--border', lineLum < 45 ? 'rgba(255, 255, 255, 0.22)' : ct.line);
    }
  } else {
    document.body.removeAttribute('style');
  }
  if(!skipPersist) persist();
  updateThemeSwatchActive();
  var cRow = document.getElementById('custom-theme-edit-row');
  if(cRow) cRow.classList.toggle('hidden', name !== 'custom');
  if(sceneReady) refreshSceneTheme();
}

function buildThemeGrid(){

  var btnOpenCustom = document.getElementById('btn-open-custom-modal');
  if(btnOpenCustom) btnOpenCustom.addEventListener('click', function(){ applyTheme('custom'); openModal('custom-theme-modal'); });

  var btnCloseCustom = document.getElementById('btn-close-custom-modal');
  if(btnCloseCustom) btnCloseCustom.addEventListener('click', function(){ closeModal('custom-theme-modal'); });

  var btnSaveCustom = document.getElementById('btn-save-custom-modal');
  if(btnSaveCustom) btnSaveCustom.addEventListener('click', function(){ closeModal('custom-theme-modal'); });


  var pickers = ['board', 'line', 'x', 'o', 'bg'];
  pickers.forEach(function(k){
    var p = document.getElementById('picker-' + k);
    if(p){
      p.value = THEME_HEX.custom[k] || '#000000';
      p.addEventListener('input', function(e){
        SAVE.settings.customTheme = SAVE.settings.customTheme || Object.assign({}, defaultCustomTheme);
        SAVE.settings.customTheme[k] = e.target.value;
        if(k === 'x') SAVE.settings.customTheme.accent = e.target.value;
        if(k === 'o') SAVE.settings.customTheme.accent2 = e.target.value;
        persist();
        if(SAVE.settings.theme === 'custom') applyTheme('custom');
      });
    }
  });
  var grid = document.getElementById('theme-grid');
  grid.innerHTML='';
  THEME_ORDER.forEach(function(t){
    var hx = getThemeHex(t);
    var el = document.createElement('div');
    el.className = 'theme-swatch';
    el.dataset.theme = t;
    if(t === 'cyber'){
      el.style.background = 'linear-gradient(135deg, #007791 0%, #00a8cc 100%)';
      el.style.color = '#ffffff';
    } else {
      el.style.background = 'linear-gradient(135deg, ' + hx.bg + ', ' + hx.board + ')';
      el.style.color = (t === 'light') ? '#0f172a' : '#ffffff';
    }
    el.innerHTML = '<span>' + t + '</span>';
    el.addEventListener('click', function(){ applyTheme(t); if(t === 'custom') openModal('custom-theme-modal'); });
    grid.appendChild(el);
  });
  updateThemeSwatchActive();
}
function updateThemeSwatchActive(){
  var swatches = document.querySelectorAll('.theme-swatch');
  swatches.forEach(function(s){ s.classList.toggle('active', s.dataset.theme === SAVE.settings.theme); });
}

/* ==================================================
   5. AUDIO MANAGER
   ================================================== */
var AudioMgr = (function(){
  var ctx = null;
  function ensure(){
    if(!ctx){
      try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ ctx = null; }
    }
    if(ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, gainAmt, delay){
    if(!SAVE.settings.sound) return;
    var c = ensure();
    if(!c) return;
    var t0 = c.currentTime + (delay||0);
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(gainAmt||0.14, t0+0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(t0); osc.stop(t0+dur+0.02);
  }
  return {
    unlock:ensure,
    click:function(){ tone(520,0.08,'triangle',0.1); },
    place:function(sym){ tone(sym==='X'?420:340, 0.16, 'sine', 0.16); },
    undo:function(){ tone(260,0.12,'square',0.08); },
    win:function(){ tone(523.25,0.15,'triangle',0.18,0); tone(659.25,0.15,'triangle',0.18,0.12); tone(783.99,0.28,'triangle',0.2,0.24); },
    lose:function(){ tone(300,0.22,'sawtooth',0.12,0); tone(220,0.3,'sawtooth',0.12,0.15); },
    draw:function(){ tone(392,0.18,'sine',0.14,0); tone(392,0.18,'sine',0.14,0.18); },
    hover:function(){ tone(880,0.04,'sine',0.03); }
  };
})();

/* ==================================================
   6. SPEECH MANAGER
   ================================================== */
var SpeechMgr = {
  speak:function(text){
    if(!SAVE.settings.voice || !('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05; u.pitch = 1.0; u.volume = 0.9;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
};

/* ==================================================
   7. STATISTICS MANAGER
   ================================================== */
var StatsMgr = {
  record:function(mode, difficulty, result){ // result: 'x'|'o'|'draw' relative to symbols
    if(mode === 'local'){
      if(result==='X') SAVE.stats.local.xWins++;
      else if(result==='O') SAVE.stats.local.oWins++;
      else SAVE.stats.local.draws++;
    } else {
      if(!SAVE.stats[difficulty]){
        SAVE.stats[difficulty] = { wins:0, losses:0, draws:0 };
      }
      var bucket = SAVE.stats[difficulty];
      if(result==='draw') bucket.draws++;
      else if(result===HUMAN) bucket.wins++;
      else bucket.losses++;
    }
    if(result==='X') SAVE.session.x++;
    else if(result==='O') SAVE.session.o++;
    else SAVE.session.draw++;
    persist();
  },
  render:function(){
    var p = document.getElementById('stats-panel');
    var s = SAVE.stats;
    function row(label, wins, losses, draws){
      var total = wins+losses+draws;
      var pct = total? Math.round(wins/total*100) : 0;
      return '<div style="padding:10px 0; border-bottom:1px solid var(--border);">' +
        '<div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px; margin-bottom:6px;"><span>'+label+'</span><span style="color:var(--text-dim); font-weight:500;">'+pct+'% win rate</span></div>' +
        '<div style="display:flex; gap:16px; font-size:12px; color:var(--text-dim);"><span>W '+wins+'</span><span>L '+losses+'</span><span>D '+draws+'</span></div></div>';
    }
    var html = '';
    html += row('Local - X wins', s.local.xWins, s.local.oWins, s.local.draws);
    html += row('Local - O wins', s.local.oWins, s.local.xWins, s.local.draws);
    html += row('Vs Easy', s.easy.wins, s.easy.losses, s.easy.draws);
    html += row('Vs Medium', s.medium.wins, s.medium.losses, s.medium.draws);
    if(s.hard) html += row('Vs Hard', s.hard.wins, s.hard.losses, s.hard.draws);
    html += row('Vs Impossible', s.impossible.wins, s.impossible.losses, s.impossible.draws);
    p.innerHTML = html;
  }
};

/* ==================================================
   GAME RULES / WIN DETECTION
   ================================================== */
function checkWinner(board){
  for(var i=0;i<WIN_LINES.length;i++){
    var l = WIN_LINES[i];
    var a=board[l[0]], b=board[l[1]], c=board[l[2]];
    if(a && a===b && a===c) return { player:a, line:l };
  }
  return null;
}
function isFull(board){ return board.every(function(v){return v;}); }

/* ==================================================
   AI ENGINE (Easy / Medium / Impossible)
   ================================================== */
function emptyIndices(board){
  var arr=[]; for(var i=0;i<9;i++) if(!board[i]) arr.push(i); return arr;
}
function minimax(board, depth, isMax, alpha, beta){
  var res = checkWinner(board);
  if(res) return res.player === AI_SYM ? (10-depth) : (depth-10);
  if(isFull(board)) return 0;
  if(isMax){
    var best=-Infinity;
    var idxs = emptyIndices(board);
    for(var i=0;i<idxs.length;i++){
      var idx=idxs[i];
      board[idx]=AI_SYM;
      best = Math.max(best, minimax(board, depth+1, false, alpha, beta));
      board[idx]=null;
      alpha = Math.max(alpha, best);
      if(beta<=alpha) break;
    }
    return best;
  } else {
    var best2=Infinity;
    var idxs2 = emptyIndices(board);
    for(var j=0;j<idxs2.length;j++){
      var idx2=idxs2[j];
      board[idx2]=HUMAN;
      best2 = Math.min(best2, minimax(board, depth+1, true, alpha, beta));
      board[idx2]=null;
      beta = Math.min(beta, best2);
      if(beta<=alpha) break;
    }
    return best2;
  }
}
function bestMove(board){
  var bestScore=-Infinity, moves=[];
  var idxs = emptyIndices(board);
  for(var i=0;i<idxs.length;i++){
    var idx=idxs[i];
    board[idx]=AI_SYM;
    var score = minimax(board, 0, false, -Infinity, Infinity);
    board[idx]=null;
    if(score>bestScore){ bestScore=score; moves=[idx]; }
    else if(score===bestScore){ moves.push(idx); }
  }
  return moves[Math.floor(Math.random()*moves.length)];
}
function findWinningMove(board, sym){
  for(var i=0; i<WIN_LINES.length; i++){
    var l = WIN_LINES[i];
    var count = 0, emptyIdx = -1;
    for(var j=0; j<3; j++){
      if(board[l[j]] === sym) count++;
      else if(!board[l[j]]) emptyIdx = l[j];
    }
    if(count === 2 && emptyIdx !== -1) return emptyIdx;
  }
  return -1;
}

function getAIMove(board, diff){
  var empties = emptyIndices(board);
  if(empties.length===0) return -1;

  if(diff==='easy'){
    if(Math.random() < 0.20){
      var winMvE = findWinningMove(board, AI_SYM);
      if(winMvE !== -1) return winMvE;
    }
    return empties[Math.floor(Math.random()*empties.length)];
  }

  if(diff==='medium'){
    // 1. Take instant win if available (100%)
    var winMvM = findWinningMove(board, AI_SYM);
    if(winMvM !== -1) return winMvM;

    // 2. Block human opponent 65% of the time
    var blockMvM = findWinningMove(board, HUMAN);
    if(blockMvM !== -1 && Math.random() < 0.65) return blockMvM;

    // 3. 50% chance to claim center or random corner
    if(Math.random() < 0.50){
      if(!board[4]) return 4;
      var corners = [0,2,6,8].filter(function(idx){ return !board[idx]; });
      if(corners.length > 0) return corners[Math.floor(Math.random()*corners.length)];
    }

    // 4. Otherwise casual random move
    return empties[Math.floor(Math.random()*empties.length)];
  }

  if(diff==='hard'){
    // 1. Instant win if available (96% execution)
    if(Math.random() < 0.96){
      var winMvH = findWinningMove(board, AI_SYM);
      if(winMvH !== -1) return winMvH;
    }

    // 2. Block human player (88% block rate - leaves ~10% win window for human across 10 games)
    if(Math.random() < 0.88){
      var blockMvH = findWinningMove(board, HUMAN);
      if(blockMvH !== -1) return blockMvH;
    }

    // 3. Claim center (85%) or strategic corner
    if(Math.random() < 0.85){
      if(!board[4]) return 4;
      var corners = [0,2,6,8].filter(function(idx){ return !board[idx]; });
      if(corners.length > 0) return corners[Math.floor(Math.random()*corners.length)];
    }

    // 4. 80% optimal minimax move, 20% positional move
    if(Math.random() < 0.80){
      var bestSH = -Infinity, bestMovesH = [];
      for(var k=0; k<empties.length; k++){
        var idxK = empties[k];
        board[idxK] = AI_SYM;
        var scoreK = minimax(board, 0, false, -Infinity, Infinity);
        board[idxK] = null;
        if(scoreK > bestSH){ bestSH = scoreK; bestMovesH = [idxK]; }
        else if(scoreK === bestSH){ bestMovesH.push(idxK); }
      }
      if(bestMovesH.length > 0) return bestMovesH[Math.floor(Math.random()*bestMovesH.length)];
    }
    return empties[Math.floor(Math.random()*empties.length)];
  }

  // IMPOSSIBLE: 100% Perfect Unbeatable Minimax Algorithm
  return bestMove(board);
}

/* ==================================================
   8-11. THREE.JS SCENE / CAMERA / RENDERER / LIGHTS
   ================================================== */
var scene, camera, renderer, canvas, container;
var boardGroup, cellMeshes=[], pieceMeshes=new Array(9).fill(null), hoverMesh;
var ambientLight, keyLight, accentLight;
var ambientParticles, hoverGhostGroup, winBeamMesh, victoryCrownMesh, victoryShockwaveMesh;
var sceneReady = false;
var raycaster, pointerNDC = new (window.THREE?THREE.Vector2:Object)();
var clock;
var tweens = [];
var particleSystems = [];
var shatteredPieces = [];
var laserScanMesh = null;
var activeRockets = [];
var arcadeStampMesh = null;
/* drag-to-rotate state */
var isDragging = false, dragLastX = 0, dragLastY = 0, dragDeltaTotal = 0;
var boardRotY = 0, boardRotX = 0, boardVelY = 0, boardVelX = 0;
/* zoom state */
var zoomCurrent = 1.0, zoomTarget = 1.0;
var pinchIds = [], pinchLastDist = 0;
/* auto-spin idle state */
var lastInteractTime = 0;        /* ms – updated on every user interaction   */
var AUTO_SPIN_DELAY  = 3000;     /* ms of idle before spin starts             */
var AUTO_SPIN_SPEED  = 0.28;     /* rad/s cruising speed                      */
var autoSpinBlend    = 0;        /* 0 = off, 1 = full speed (smooth ramp)     */
/* double-tap reset */
var lastTapTime  = 0;            /* ms of last short tap                      */
var DBL_TAP_MS   = 350;          /* max gap between two taps to count as dbl  */
var viewReset    = false;        /* true while animating back to default view  */
var viewResetTargetY = 0;        /* nearest clean Y angle to snap to          */
var resizeObserver;
var perfLastCheck = 0, perfFrames = 0, lowPerfMode = false;
var hoveredIndex = -1;

function initScene(){
  canvas = document.getElementById('three-canvas');
  container = document.getElementById('canvas-container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock();

  ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambientLight);
  keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(3, 6, 4);
  scene.add(keyLight);
  accentLight = new THREE.PointLight(0xffffff, 1.4, 20);
  accentLight.position.set(0, 3, 0);
  scene.add(accentLight);

  var count = 95;
  var gGeo = new THREE.BufferGeometry();
  var gPos = new Float32Array(count * 3);
  for(var i=0; i<count*3; i+=3){
    gPos[i] = (Math.random() - 0.5) * 20;
    gPos[i+1] = (Math.random() - 0.5) * 12 + 2;
    gPos[i+2] = (Math.random() - 0.5) * 20;
  }
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  var gMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.08, transparent: true, opacity: 0.5 });
  ambientParticles = new THREE.Points(gGeo, gMat);
  scene.add(ambientParticles);

  buildBoard();
  hoverGhostGroup = new THREE.Group();
  if(boardGroup) boardGroup.add(hoverGhostGroup);
  positionCameraDefault();

  resizeObserver = new ResizeObserver(function(){ onResize(); });
  resizeObserver.observe(container);
  onResize();

  canvas.addEventListener('pointerdown', onPointerDown, {passive:true});
  canvas.addEventListener('pointermove', onPointerMove, {passive:true});
  canvas.addEventListener('pointerup',   onPointerUp,   {passive:true});
  canvas.addEventListener('pointerleave', function(e){ isDragging=false; pinchIds=[]; setHover(-1); }, {passive:true});
  /* scroll-wheel zoom */
  canvas.addEventListener('wheel', function(e){
    e.preventDefault();
    lastInteractTime = performance.now();   /* reset idle timer on scroll */
    autoSpinBlend = 0;
    var delta = e.deltaMode === 1 ? e.deltaY * 30 : (e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY);
    zoomTarget = Math.max(0.45, Math.min(2.5, zoomTarget + delta * 0.0008));
  }, {passive:false});
  lastInteractTime = performance.now();     /* start the idle clock */

  sceneReady = true;
  refreshSceneTheme();
  requestAnimationFrame(loop);
}

function positionCameraDefault(){
  camera.position.set(0, 5.6, 5.4);
  camera.lookAt(0,0,0);
}

function onResize(){
  if(!container) return;
  var w = container.clientWidth, h = container.clientHeight;
  if(w<2||h<2) return;
  renderer.setSize(w,h,false);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
}

function buildBoard(){
  boardGroup = new THREE.Group();
  scene.add(boardGroup);

  var baseGeo = new THREE.BoxGeometry(CELL*3+0.2, 0.22, CELL*3+0.2);
  var baseMat = new THREE.MeshStandardMaterial({ color:0x1c222c, roughness:0.7, metalness:0.15 });
  var base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.13;
  base.userData.isBase = true;
  boardGroup.add(base);

  var lineMat = new THREE.MeshStandardMaterial({ color:0x2c3542, roughness:0.4, metalness:0.3, emissive:0x000000 });
  var offsets = [-CELL/2, CELL/2];
  offsets.forEach(function(o){
    var vGeo = new THREE.BoxGeometry(0.06, 0.16, CELL*3);
    var v = new THREE.Mesh(vGeo, lineMat.clone());
    v.position.set(o, 0.0, 0);
    v.userData.isLine = true;
    boardGroup.add(v);
    var hGeo = new THREE.BoxGeometry(CELL*3, 0.16, 0.06);
    var h = new THREE.Mesh(hGeo, lineMat.clone());
    h.position.set(0, 0.0, o);
    h.userData.isLine = true;
    boardGroup.add(h);
  });

  var cellGeo = new THREE.BoxGeometry(CELL*0.92, 0.05, CELL*0.92);
  for(var r=0;r<3;r++){
    for(var c=0;c<3;c++){
      var idx = r*3+c;
      var mat = new THREE.MeshStandardMaterial({ color:0x171c24, roughness:0.9, metalness:0.05, transparent:true, opacity:0.001 });
      var m = new THREE.Mesh(cellGeo, mat);
      m.position.set((c-1)*CELL, 0.02, (r-1)*CELL);
      m.userData.index = idx;
      m.userData.isCell = true;
      boardGroup.add(m);
      cellMeshes.push(m);
    }
  }

  var hoverGeo = new THREE.BoxGeometry(CELL*0.86, 0.03, CELL*0.86);
  var hoverMat = new THREE.MeshBasicMaterial({ color:0x00f0ff, transparent:true, opacity:0 });
  hoverMesh = new THREE.Mesh(hoverGeo, hoverMat);
  hoverMesh.position.y = 0.05;
  boardGroup.add(hoverMesh);
}

function refreshSceneTheme(){
  var name = SAVE.settings.theme;
  var hx = getThemeHex(name);
  boardGroup.children.forEach(function(child){
    if(child.userData.isBase) child.material.color.set(hx.board);
    if(child.userData.isLine) child.material.color.set(hx.line);
    if(child.userData.isCell) child.material.color.set(hx.board);
  });
  accentLight.color.set(hx.accent);
  if(ambientParticles) ambientParticles.material.color.set(hx.accent);
  hoverMesh.material.color.set(hx.accent);
  scene.background = null;
  pieceMeshes.forEach(function(p, i){
    if(p) colorPiece(p, game.board[i]);
  });
}

function colorPiece(mesh, sym){
  var theme = SAVE.settings ? SAVE.settings.theme : 'light';
  var hx = getThemeHex(theme);
  var col = sym==='X' ? (hx.x || '#ffffff') : (hx.o || '#ffffff');
  if(!mesh) return;
  mesh.traverse(function(o){
    if(o && o.isMesh && o.material){
      if(o.material.color) o.material.color.set(col);
      if(theme === 'light'){
        if(o.material.color) o.material.color.set(0x000000);
        if(o.material.emissive) o.material.emissive.set(0x000000);
        if(o.material.emissiveIntensity !== undefined) o.material.emissiveIntensity = 0;
        o.material.roughness = 0.55;
        o.material.metalness = 0.0;
      } else if(theme === 'dark'){
        if(o.material.color) o.material.color.set(0xffffff);
        if(o.material.emissive) o.material.emissive.set(0xffffff);
        if(o.material.emissiveIntensity !== undefined) o.material.emissiveIntensity = 0.8;
        o.material.roughness = 0.15;
        o.material.metalness = 0.5;
      } else {
        if(o.material.color) o.material.color.set(col);
        if(o.material.emissive) o.material.emissive.set(col);
        if(o.material.emissiveIntensity !== undefined) o.material.emissiveIntensity = 0.8;
      }
    }
  });
}

function makeXMesh(){
  var g = new THREE.Group();
  var geo = new THREE.BoxGeometry(CELL*0.62, 0.14, 0.15);
  var mat = new THREE.MeshStandardMaterial({ roughness:0.35, metalness:0.4 });
  var b1 = new THREE.Mesh(geo, mat); b1.rotation.y = Math.PI/4; b1.position.y = 0.001;
  var b2 = new THREE.Mesh(geo, mat.clone()); b2.rotation.y = -Math.PI/4; b2.position.y = -0.001;
  g.add(b1); g.add(b2);
  return g;
}
function makeOMesh(){
  var geo = new THREE.TorusGeometry(0.34, 0.11, 20, 36);
  var mat = new THREE.MeshStandardMaterial({ roughness:0.55, metalness:0.1 });
  var m = new THREE.Mesh(geo, mat);
  m.rotation.x = Math.PI/2;
  var g = new THREE.Group(); g.add(m);
  return g;
}

/* ==================================================
   14. INPUT CONTROLLER
   ================================================== */
function getPointerNDC(e){
  var rect = canvas.getBoundingClientRect();
  var x = ((e.clientX-rect.left)/rect.width)*2-1;
  var y = -((e.clientY-rect.top)/rect.height)*2+1;
  return {x:x,y:y};
}
function raycastCell(e){
  var p = getPointerNDC(e);
  raycaster.setFromCamera(p, camera);
  var hits = raycaster.intersectObjects(cellMeshes);
  return hits.length ? hits[0].object.userData.index : -1;
}
function onPointerMove(e){
  /* --- pinch-to-zoom: track two active pointers --- */
  if(pinchIds.length === 2){
    var touches = pinchIds.map(function(id){ return id === e.pointerId ? e : null; });
    /* update stored position for this pointer */
    for(var pi=0; pi<pinchIds.length; pi++){
      if(pinchIds[pi] === e.pointerId) pinchIds['pos'+pi] = {x: e.clientX, y: e.clientY};
    }
    if(pinchIds['pos0'] && pinchIds['pos1']){
      var dx = pinchIds['pos1'].x - pinchIds['pos0'].x;
      var dy = pinchIds['pos1'].y - pinchIds['pos0'].y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if(pinchLastDist > 0){
        var ratio = pinchLastDist / dist;          /* >1 = fingers closing = zoom in */
        zoomTarget = Math.max(0.45, Math.min(2.5, zoomTarget * ratio));
      }
      pinchLastDist = dist;
    }
    return; /* don't rotate while pinching */
  }

  if(isDragging){
    var dx = e.clientX - dragLastX;
    var dy = e.clientY - dragLastY;
    dragDeltaTotal += Math.abs(dx) + Math.abs(dy);
    boardVelY = dx * 0.013;
    boardVelX = dy * 0.009;
    boardRotY += boardVelY;
    boardRotX = Math.max(-1.25, Math.min(1.25, boardRotX + boardVelX));
    dragLastX = e.clientX;
    dragLastY = e.clientY;
  }
  /* only show hover highlight when NOT dragging */
  if(e.pointerType==='mouse' && !isDragging){
    var idx = raycastCell(e);
    setHover(idx);
  }
}
function setHover(idx){
  if(idx===hoveredIndex) return;
  hoveredIndex = idx;
  var canPlace = idx>=0 && !game.board[idx] && !game.gameOver && isHumanTurn();
  hoverMesh.material.opacity = canPlace ? 0.25 : 0;

  while(hoverGhostGroup && hoverGhostGroup.children.length > 0){
    var child = hoverGhostGroup.children[0];
    hoverGhostGroup.remove(child);
    if(child.geometry) child.geometry.dispose();
    if(child.material) child.material.dispose();
  }

  if(canPlace){
    var r = Math.floor(idx/3), c = idx%3;
    var px = (c-1)*CELL, pz = (r-1)*CELL;
    hoverMesh.position.set(px, 0.05, pz);
    hoverGhostGroup.position.set(px, 0.18, pz);

    var sym = game.current;
    var hx = getThemeHex(SAVE.settings.theme);
    var colHex = sym==='X' ? hx.x : hx.o;
    var gMat = new THREE.MeshStandardMaterial({ color: colHex, transparent: true, opacity: 0.45, roughness: 0.3, metalness: 0.2 });

    if(sym==='X'){
      var g1 = new THREE.BoxGeometry(0.68, 0.12, 0.15);
      var m1 = new THREE.Mesh(g1, gMat); m1.rotation.y = Math.PI/4; m1.position.y = 0.001;
      var m2 = new THREE.Mesh(g1, gMat); m2.rotation.y = -Math.PI/4; m2.position.y = -0.001;
      hoverGhostGroup.add(m1); hoverGhostGroup.add(m2);
    } else {
      var gTor = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
      var mTor = new THREE.Mesh(gTor, gMat); mTor.rotation.x = Math.PI/2;
      hoverGhostGroup.add(mTor);
    }
  }
}
function isHumanTurn(){
  if(game.mode==='local') return true;
  return game.current === HUMAN;
}
function onPointerDown(e){
  lastInteractTime = performance.now();  /* reset idle timer */
  autoSpinBlend   = 0;                  /* kill auto-spin immediately */
  /* --- pinch-to-zoom: register second finger --- */
  if(pinchIds.length < 2){
    var slot = pinchIds.length;
    pinchIds.push(e.pointerId);
    pinchIds['pos'+slot] = {x: e.clientX, y: e.clientY};
    if(pinchIds.length === 2){
      /* calculate initial distance */
      var dx = pinchIds['pos1'].x - pinchIds['pos0'].x;
      var dy = pinchIds['pos1'].y - pinchIds['pos0'].y;
      pinchLastDist = Math.sqrt(dx*dx + dy*dy);
      isDragging = false;  /* cancel single-finger drag */
      return;
    }
  }
  isDragging = true;
  dragLastX = e.clientX;
  dragLastY = e.clientY;
  dragDeltaTotal = 0;
  boardVelY = 0;
  boardVelX = 0;
  AudioMgr.unlock();
}
function onPointerUp(e){
  /* remove from pinch tracking */
  var pi = pinchIds.indexOf(e.pointerId);
  if(pi !== -1){ pinchIds.splice(pi, 1); pinchLastDist = 0; }
  if(!isDragging) return;
  isDragging = false;

  var isTap = dragDeltaTotal < 8;

  /* --- double-tap detection: reset view --- */
  if(isTap){
    var tapNow = performance.now();
    if(tapNow - lastTapTime < DBL_TAP_MS){
      /* DOUBLE TAP — trigger smooth view reset */
      viewReset = true;
      /* snap Y to nearest clean full-rotation so it doesn't spin past */
      viewResetTargetY = Math.round(boardRotY / (Math.PI * 2)) * Math.PI * 2;
      boardVelY = 0;
      boardVelX = 0;
      autoSpinBlend = 0;
      zoomTarget   = 1.0;
      lastTapTime  = 0;          /* prevent triple-tap triggering again */
      /* tiny visual pulse: briefly brighten accent light */
      accentLight.intensity = 4;
    } else {
      lastTapTime = tapNow;
    }
  }

  /* treat as a cell click only if the pointer barely moved (tap / click) */
  if(isTap && !game.gameOver && isHumanTurn()){
    var idx = raycastCell(e);
    if(idx >= 0 && !game.board[idx]) makeMove(idx);
  }
  if(!isTap) setHover(-1);
}

/* ==================================================
   15. ANIMATION SYSTEM (tween utility)
   ================================================== */
function addTween(obj, prop, to, duration, easeFn, onComplete){
  tweens.push({ obj:obj, prop:prop, from: (typeof obj[prop]==='object'? cloneVec(obj[prop]) : obj[prop]), to:to, duration:duration, start:performance.now(), ease: easeFn||easeOutBack, onComplete:onComplete, isVec: typeof obj[prop]==='object' });
}
function cloneVec(v){ return {x:v.x,y:v.y,z:v.z}; }
function easeOutBack(t){ var c1=1.70158, c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
function easeOutQuad(t){ return 1-(1-t)*(1-t); }
function updateTweens(now){
  for(var i=tweens.length-1;i>=0;i--){
    var tw = tweens[i];
    var t = Math.min(1, (now-tw.start)/tw.duration);
    var e = tw.ease(t);
    if(tw.isVec){
      tw.obj[tw.prop].x = tw.from.x + (tw.to.x-tw.from.x)*e;
      tw.obj[tw.prop].y = tw.from.y + (tw.to.y-tw.from.y)*e;
      tw.obj[tw.prop].z = tw.from.z + (tw.to.z-tw.from.z)*e;
    } else {
      tw.obj[tw.prop] = tw.from + (tw.to-tw.from)*e;
    }
    if(t>=1){
      tweens.splice(i,1);
      if(tw.onComplete) tw.onComplete();
    }
  }
}

/* ==================================================
   16. PARTICLE SYSTEM
   ================================================== */
function spawnParticles(position, colorHex, count, confetti){
  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(count*3);
  var velocities = [];
  for(var i=0;i<count;i++){
    positions[i*3] = position.x;
    positions[i*3+1] = position.y;
    positions[i*3+2] = position.z;
    var ang = Math.random()*Math.PI*2;
    var speed = 0.8+Math.random()*1.6;
    velocities.push({
      x: Math.cos(ang)*speed*(confetti?0.6:1),
      y: 1.2+Math.random()*2.2,
      z: Math.sin(ang)*speed*(confetti?0.6:1)
    });
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  var mat = new THREE.PointsMaterial({ color: colorHex, size: confetti?0.09:0.07, transparent:true, opacity:1 });
  var pts = new THREE.Points(geo, mat);
  scene.add(pts);
  particleSystems.push({ points:pts, velocities:velocities, life:0, maxLife: confetti?2.2:1.3 });
}
function updateParticles(dt){
  for(var i=particleSystems.length-1;i>=0;i--){
    var ps = particleSystems[i];
    ps.life += dt;
    var pos = ps.points.geometry.attributes.position.array;
    for(var j=0;j<ps.velocities.length;j++){
      var v = ps.velocities[j];
      pos[j*3] += v.x*dt;
      pos[j*3+1] += v.y*dt;
      pos[j*3+2] += v.z*dt;
      v.y -= 3.2*dt;
    }
    ps.points.geometry.attributes.position.needsUpdate = true;
    ps.points.material.opacity = Math.max(0, 1-(ps.life/ps.maxLife));
    if(ps.life>=ps.maxLife){
      scene.remove(ps.points);
      ps.points.geometry.dispose();
      ps.points.material.dispose();
      particleSystems.splice(i,1);
    }
  }
}

/* ==================================================
   MAIN GAME LOOP
   ================================================== */
function loop(){
  requestAnimationFrame(loop);
  var now = performance.now();
  var dt = Math.min(clock.getDelta(), 0.05);
  var t = clock.elapsedTime;

  updateTweens(now);
  updateParticles(dt);
  if(game.cameraShake > 0){
    game.cameraShake -= dt * 1.5;
    var shk = Math.max(0, game.cameraShake) * 0.18;
    camera.position.x += (Math.random() - 0.5) * shk;
    camera.position.y += (Math.random() - 0.5) * shk;
  }
  if(activeRockets.length > 0){
    for(var ri = activeRockets.length - 1; ri >= 0; ri--){
      var rkt = activeRockets[ri];
      rkt.position.y += rkt.userData.vy * dt;
      spawnParticles(rkt.position.clone(), new THREE.Color(rkt.userData.color), 3, false);
      if(rkt.position.y >= 4.5){
        spawnParticles(rkt.position.clone(), new THREE.Color(rkt.userData.color), 70, true);
        if(boardGroup) boardGroup.remove(rkt);
        disposeMesh(rkt);
        activeRockets.splice(ri, 1);
      }
    }
  }
  if(laserScanMesh && laserScanMesh.userData.active){
    laserScanMesh.userData.progress += dt * 5.2;
    laserScanMesh.position.x = laserScanMesh.userData.progress;
    if(laserScanMesh.position.x > 3.4){
      boardGroup.remove(laserScanMesh);
      disposeMesh(laserScanMesh);
      laserScanMesh = null;
    }
  }
  if(game.isShattered && shatteredPieces.length > 0){
    shatteredPieces.forEach(function(child){
      child.position.addScaledVector(child.userData.vel, dt);
      child.userData.vel.y -= dt * 1.5;
      child.rotation.x += child.userData.rotVel.x * dt;
      child.rotation.y += child.userData.rotVel.y * dt;
      child.rotation.z += child.userData.rotVel.z * dt;
    });
  }
  if(victoryShockwaveMesh){
    victoryShockwaveMesh.userData.scale += dt * 7.5;
    victoryShockwaveMesh.userData.opacity -= dt * 0.9;
    var sShk = victoryShockwaveMesh.userData.scale;
    victoryShockwaveMesh.scale.set(sShk, sShk, sShk);
    victoryShockwaveMesh.material.opacity = Math.max(0, victoryShockwaveMesh.userData.opacity);
    if(victoryShockwaveMesh.userData.opacity <= 0){
      boardGroup.remove(victoryShockwaveMesh);
      disposeMesh(victoryShockwaveMesh);
      victoryShockwaveMesh = null;
    }
  }
  if(victoryCrownMesh){
    victoryCrownMesh.rotation.y = t * 1.6;
    victoryCrownMesh.position.y = 1.6 + Math.sin(t * 4) * 0.15;
  }
  if(winBeamMesh && winBeamMesh.material){
    winBeamMesh.material.emissiveIntensity = 0.6 + Math.sin(t * 8) * 0.4;
  }
  if(ambientParticles){
    /* auto-drift + parallax with board drag */
    ambientParticles.rotation.y = t * 0.03 + boardRotY * 0.06;
    ambientParticles.rotation.x = Math.sin(t * 0.02) * 0.03 + boardRotX * 0.04;
    /* 🌊 speed-reactive size: stars swell when board spins fast */
    var spinSpeed   = Math.abs(boardVelY);
    var targetSize  = 0.08 * (1 + Math.min(1.5, spinSpeed * 12));
    var currentSize = ambientParticles.material.size || 0.08;
    ambientParticles.material.size += (targetSize - currentSize) * 0.08;
    ambientParticles.material.needsUpdate = true;
  }
  if(hoverGhostGroup && hoveredIndex >= 0){
    hoverGhostGroup.position.y = 0.18 + Math.sin(t * 5) * 0.03;
  }

  var reduced = SAVE.settings.reducedMotion;

  /* --- auto-spin when idle: disabled so board remains steady unless dragged --- */
  autoSpinBlend = 0;

  /* --- drag-to-rotate: apply inertia when not dragging --- */
  if(!isDragging){
    boardVelY *= 0.88;  /* Y-axis friction */
    boardVelX *= 0.88;  /* X-axis friction */

    /* --- smooth view-reset animation (double-tap) --- */
    if(viewReset){
      var lerpSpeed = 0.09;
      var dY = viewResetTargetY - boardRotY;
      var dX = 0             - boardRotX;
      boardRotY += dY * lerpSpeed;
      boardRotX += dX * lerpSpeed;
      /* done when close enough */
      if(Math.abs(dY) < 0.001 && Math.abs(dX) < 0.001){
        boardRotY = viewResetTargetY;
        boardRotX = 0;
        viewReset = false;
      }
    } else {
      boardRotY += boardVelY;
      boardRotX = Math.max(-1.25, Math.min(1.25, boardRotX + boardVelX));
      /* user angle preserved: no auto-resetting tilt */
    }
  }
  if(boardGroup){
    boardGroup.rotation.y = boardRotY;
    boardGroup.rotation.x = boardRotX;
  }

  /* --- fixed camera with zoom --- */
  zoomCurrent += (zoomTarget - zoomCurrent) * 0.1;   /* smooth lerp */
  if(game.victoryOrbit){
    game.victoryAngle = (game.victoryAngle || 0) + dt * 1.2;
    var vR = 5.4 * zoomCurrent;
    camera.position.x = Math.sin(game.victoryAngle) * vR;
    camera.position.z = Math.cos(game.victoryAngle) * vR;
    camera.position.y = (3.4 + Math.sin(game.victoryAngle * 0.5) * 0.5) * zoomCurrent;
    camera.lookAt(0, 0.2, 0);
  } else {
    camera.position.set(0, 5.6 * zoomCurrent, 5.4 * zoomCurrent);
    camera.lookAt(0, 0, 0);
  }

  accentLight.intensity = 1.2 + Math.sin(t*1.6)*0.25;

  renderer.render(scene, camera);

  perfFrames++;
  if(now - perfLastCheck > 1000){
    var fps = perfFrames*1000/(now-perfLastCheck);
    perfFrames = 0; perfLastCheck = now;
    if(fps < 30 && !lowPerfMode){
      lowPerfMode = true;
      renderer.setPixelRatio(1);
    }
  }
}

/* ==================================================
   GAME FLOW
   ================================================== */
function resetBoardVisual(){
  restoreBoardShatter();
  game.victoryOrbit = false;
  positionCameraDefault();
  if(winBeamMesh){ boardGroup.remove(winBeamMesh); winBeamMesh = null; }
  if(victoryCrownMesh){ boardGroup.remove(victoryCrownMesh); disposeMesh(victoryCrownMesh); victoryCrownMesh = null; }
  if(victoryShockwaveMesh){ boardGroup.remove(victoryShockwaveMesh); disposeMesh(victoryShockwaveMesh); victoryShockwaveMesh = null; }
  game.victoryOrbit = false;
  positionCameraDefault();
  pieceMeshes.forEach(function(p){ if(p){ boardGroup.remove(p); disposeMesh(p); } });
  pieceMeshes = new Array(9).fill(null);
  if(winBeamMesh){ boardGroup.remove(winBeamMesh); winBeamMesh = null; }
  var svg = document.getElementById('win-line-svg'); if(svg) svg.style.display = 'none';
  cellMeshes.forEach(function(m){ m.material.emissive && m.material.emissive.set(0x000000); });
}
function disposeMesh(g){
  g.traverse(function(o){ if(o.isMesh){ o.geometry.dispose(); o.material.dispose(); } });
}

function newGame(mode, difficulty){
  game.mode = mode;
  game.difficulty = difficulty || 'medium';
  game.board = new Array(9).fill(null);
  if(mode === 'computer'){ game.current = Math.random() < 0.5 ? HUMAN : AI_SYM; } else { game.current = 'X'; }
  game.gameOver = false;
  game.winner = null;
  game.winLine = null;
  game.history = [];
  game.inProgress = true;
  resetBoardVisual();
  showScreen('game-screen');
  updateHUD();
  updateHintBar();
  saveSnapshot();
  var streakEl = document.getElementById('streak-badge');
  if(!streakEl){
    streakEl = document.createElement('div');
    streakEl.id = 'streak-badge';
    streakEl.style.cssText = 'position:absolute; top:70px; left:50%; transform:translateX(-50%); font-size:11px; font-weight:700; color:var(--accent); letter-spacing:.08em; text-transform:uppercase; pointer-events:none; z-index:10; opacity:0.9; display:none;';
    var gameScreen = document.getElementById('game-screen');
    if(gameScreen) gameScreen.appendChild(streakEl);
  }
  if(streakEl){
    if(SAVE.stats && SAVE.stats.streak > 0){
      streakEl.textContent = '🔥 ' + SAVE.stats.streak + ' Win Streak';
      streakEl.style.display = 'block';
    } else {
      streakEl.style.display = 'none';
    }
  }
  announce('New game started. ' + (mode==='local'?'Local multiplayer.':'Versus computer, '+difficulty+' difficulty.') + ' ' + (mode==='computer' ? (game.current===HUMAN ? 'Your turn.' : 'Computer goes first.') : (game.playerNames[game.current] + ' starts.')));
  if (mode === 'computer' && game.current === AI_SYM) {
    setTimeout(function() {
      var move = getAIMove(game.board, game.difficulty);
      if(move !== -1) makeMove(move);
    }, 600);
  }
}

function resumeGame(){
  var snap = SAVE.snapshot;
  if(!snap) return;
  game.mode = snap.mode; game.difficulty = snap.difficulty;
  game.board = snap.board.slice(); game.current = snap.current;
  game.history = snap.history.slice(); game.gameOver=false; game.winner=null; game.winLine=null;
  game.playerNames = snap.playerNames || {X:'Player X', O:'Player O'};
  if(snap.human) HUMAN = snap.human;
  if(snap.aiSym) AI_SYM = snap.aiSym;
  else if(game.mode === 'computer') {
    if(game.playerNames.X === 'You') { HUMAN = 'X'; AI_SYM = 'O'; }
    else if(game.playerNames.O === 'You') { HUMAN = 'O'; AI_SYM = 'X'; }
  }
  game.inProgress = true;
  resetBoardVisual();
  showScreen('game-screen');
  game.board.forEach(function(sym, idx){ if(sym) placePieceVisual(idx, sym, true); });
  updateHUD();
  updateHintBar();
  if(game.mode === 'computer' && game.current === AI_SYM){
    setTimeout(function(){
      if(game.gameOver || !game.inProgress) return;
      var idx = getAIMove(game.board, game.difficulty);
      if(idx>=0) makeMove(idx);
    }, 450);
  }
}

function makeMove(index){
  if(game.board[index] || game.gameOver) return;
  var sym = game.current;
  game.board[index] = sym;
  game.history.push({ index:index, player:sym });
  placePieceVisual(index, sym, false);
  AudioMgr.place(sym);
  vibrate(15);
  setHover(-1);

  var res = checkWinner(game.board);
  if(res){
    endGame(res.player, res.line);
    return;
  }
  if(isFull(game.board)){
    endGame(null, null);
    return;
  }
  game.current = sym==='X' ? 'O' : 'X';
  updateHUD();
  updateHintBar();
  saveSnapshot();
  announceTurn();

  if(game.mode==='computer' || game.mode==='ai'){
    if(game.current === AI_SYM){
      setTimeout(function(){
        if(game.gameOver) return;
        var idx = getAIMove(game.board, game.difficulty);
        if(idx>=0) makeMove(idx);
      }, 420 + Math.random()*380);
    }
  }
}

function placePieceVisual(index, sym, instant){
  var r = Math.floor(index/3), c = index%3;
  var mesh = sym==='X' ? makeXMesh() : makeOMesh();
  mesh.position.set((c-1)*CELL, instant?0.15:1.8, (r-1)*CELL);
  mesh.scale.setScalar(instant?1:0.2);
  colorPiece(mesh, sym);
  boardGroup.add(mesh);
  pieceMeshes[index] = mesh;
  if(!instant){
    addTween(mesh.position, 'y', 0.15, 480, easeOutBack);
    tweenScalar(mesh.scale, 1, 420);
  }
}
function tweenScalar(scaleObj, target, duration){
  var start = performance.now();
  var from = scaleObj.x;
  function step(){
    var now = performance.now();
    var t = Math.min(1, (now-start)/duration);
    var e = easeOutBack(t);
    var v = from + (target-from)*e;
    scaleObj.setScalar(v);
    if(t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function spawnShockwave(colHex){
  if(victoryShockwaveMesh){ boardGroup.remove(victoryShockwaveMesh); disposeMesh(victoryShockwaveMesh); victoryShockwaveMesh=null; }
  var geo = new THREE.TorusGeometry(0.3, 0.05, 16, 48);
  var mat = new THREE.MeshStandardMaterial({ color: colHex, emissive: colHex, emissiveIntensity: 1.4, transparent: true, opacity: 0.9 });
  victoryShockwaveMesh = new THREE.Mesh(geo, mat);
  victoryShockwaveMesh.rotation.x = Math.PI / 2;
  victoryShockwaveMesh.position.set(0, 0.08, 0);
  victoryShockwaveMesh.userData = { scale: 1, opacity: 0.9 };
  if(boardGroup) boardGroup.add(victoryShockwaveMesh);
}
function spawn3DCrown(){
  if(victoryCrownMesh){ boardGroup.remove(victoryCrownMesh); disposeMesh(victoryCrownMesh); victoryCrownMesh=null; }
  var g = new THREE.Group();
  var goldMat = new THREE.MeshStandardMaterial({ color:0xffd700, metalness:0.9, roughness:0.2, emissive:0x664400, emissiveIntensity:0.3 });
  var ringGeo = new THREE.TorusGeometry(0.4, 0.07, 16, 32);
  var ring = new THREE.Mesh(ringGeo, goldMat); ring.rotation.x = Math.PI / 2; g.add(ring);
  for(var i=0; i<5; i++){
    var angle = (i / 5) * Math.PI * 2;
    var spikeGeo = new THREE.ConeGeometry(0.1, 0.4, 12);
    var spike = new THREE.Mesh(spikeGeo, goldMat);
    spike.position.set(Math.cos(angle) * 0.4, 0.2, Math.sin(angle) * 0.4);
    g.add(spike);
    var gemGeo = new THREE.SphereGeometry(0.06, 12, 12);
    var gemMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.8 });
    var gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(Math.cos(angle) * 0.4, 0.42, Math.sin(angle) * 0.4);
    g.add(gem);
  }
  g.position.set(0, 1.6, 0);
  victoryCrownMesh = g;
  if(boardGroup) boardGroup.add(victoryCrownMesh);
}
function triggerBoardShatter(){
  shatteredPieces = [];
  if(!boardGroup) return;
  boardGroup.children.forEach(function(child){
    if(child === hoverMesh || child === hoverGhostGroup) return;
    child.userData.origPos = child.position.clone();
    child.userData.origRot = child.rotation.clone();
    child.userData.vel = new THREE.Vector3(
      (Math.random() - 0.5) * 3.5,
      Math.random() * 2.5 + 1.2,
      (Math.random() - 0.5) * 3.5
    );
    child.userData.rotVel = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    );
    shatteredPieces.push(child);
  });
  game.isShattered = true;
}

function restoreBoardShatter(){
  game.isShattered = false;
  shatteredPieces.forEach(function(child){
    if(child.userData.origPos) child.position.copy(child.userData.origPos);
    if(child.userData.origRot) child.rotation.copy(child.userData.origRot);
  });
  shatteredPieces = [];
}
function endGame(winnerSym, line){
  game.victoryOrbit = false;
  if(winnerSym && window.THREE){ triggerBoardShatter(); }
  game.gameOver = true;
  game.winner = winnerSym;
  game.winLine = line;
  game.inProgress = false;
  SAVE.snapshot = null;
  persist();

  var hx = getThemeHex(SAVE.settings.theme);

  if(line){
    highlightLine(line);
    var color = winnerSym==='X' ? hx.x : hx.o;
    if(window.THREE && typeof spawnParticles === 'function'){
      line.forEach(function(idx){
        var r=Math.floor(idx/3), c=idx%3;
        spawnParticles(new THREE.Vector3((c-1)*CELL, 0.4, (r-1)*CELL), new THREE.Color(color || '#00f0ff'), 26, false);
      });
      spawnParticles(new THREE.Vector3(0,1.6,0), new THREE.Color(hx.accent || '#00f0ff'), 60, true);
    }
  }

  var resultForStats = winnerSym || 'draw';
  if(typeof StatsMgr !== 'undefined') StatsMgr.record(game.mode, game.difficulty, resultForStats);

  var isVsAI = (game.mode==='computer');
  var perspectiveWin = winnerSym && (!isVsAI || winnerSym===HUMAN);
  var perspectiveLose = winnerSym && isVsAI && winnerSym===AI_SYM;

  if(typeof AudioMgr !== 'undefined'){
    if(perspectiveLose) AudioMgr.lose();
    else if(winnerSym) AudioMgr.win();
    else AudioMgr.draw();
  }

  if(winnerSym) vibrate([30,40,30,40,60]); else vibrate(40);

  updateHUD();
  updateScoreboardChips();

  setTimeout(function(){
    try { showWinModal(winnerSym, isVsAI); } catch(err){ console.error("Win modal err:", err); }
  }, 350);
}

function highlightLine(line){
  var hx = getThemeHex(SAVE.settings.theme);
  line.forEach(function(idx){
    var mesh = pieceMeshes[idx];
    if(!mesh) return;
    mesh.traverse(function(o){
      if(o.isMesh) o.material.emissiveIntensity = 1.1;
    });
    tweenPulse(mesh);
  });
}
function tweenPulse(mesh){
  var start = performance.now();
  function step(){
    var now = performance.now();
    var t = (now-start)/1000;
    var s = 1 + Math.sin(t*4)*0.08;
    mesh.scale.setScalar(s);
    mesh.rotation.y += 0.035;
    if(game.gameOver && !game.replaying) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function showWinModal(winnerSym, isVsAI){
  var title = document.getElementById('win-title');
  var sub = document.getElementById('win-sub');
  var icon = document.getElementById('win-icon');
  if(!winnerSym){
    title.textContent = "It's a Draw";
    sub.textContent = 'Nobody claimed the board.';
    icon.style.background = 'rgba(255, 255, 255, 0.08)';
    icon.style.borderColor = 'var(--text-dim)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" style="width:32px; height:32px;"><path d="M5 9h14M5 15h14" fill="none" stroke="var(--text-dim)" stroke-width="3.5" stroke-linecap="round"/></svg>';
  } else if(isVsAI && winnerSym===AI_SYM){
    title.textContent = 'Computer Wins';
    sub.textContent = 'Better luck next round.';
    icon.style.background = 'rgba(239, 68, 68, 0.15)';
    icon.style.borderColor = 'var(--danger)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" style="width:32px; height:32px;"><path d="M18 6L6 18M6 6l12 12" fill="none" stroke="var(--danger)" stroke-width="3.5" stroke-linecap="round"/></svg>';
  } else {
    title.textContent = isVsAI ? 'You Win!' : (game.playerNames[winnerSym] + ' Wins!');
    sub.textContent = 'A brilliant victory!';
    icon.style.background = 'rgba(16, 185, 129, 0.15)';
    icon.style.borderColor = 'var(--success)';
    icon.innerHTML = '<svg viewBox="0 0 24 24" style="width:32px; height:32px;"><path d="M4 12.5l5 5L20 6" fill="none" stroke="var(--success)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  announce(title.textContent + '. ' + sub.textContent);
  openModal('win-modal');
}

/* ==================================================
   21. UNDO
   ================================================== */
function undo(){
  if(game.history.length === 0) return;
  if(game.mode === 'computer' && !game.history.some(function(h){ return h.player === HUMAN; })) return;

  if(game.gameOver){
    game.gameOver = false;
    closeModal('win-modal');
  }

  if(game.mode === 'computer'){
    while(game.history.length > 0){
      var last = game.history.pop();
      if(!last) break;
      game.board[last.index] = null;
      var mesh = pieceMeshes[last.index];
      if(mesh){ boardGroup.remove(mesh); disposeMesh(mesh); pieceMeshes[last.index] = null; }
      if(last.player === HUMAN){
        game.current = HUMAN;
        break;
      }
    }
  } else {
    var last = game.history.pop();
    if(last){
      game.board[last.index] = null;
      var mesh = pieceMeshes[last.index];
      if(mesh){ boardGroup.remove(mesh); disposeMesh(mesh); pieceMeshes[last.index] = null; }
      game.current = last.player;
    }
  }

  AudioMgr.undo();
  vibrate(12);
  updateHUD();
  updateHintBar();
  saveSnapshot();
  announce('Move undone.');
}

/* ==================================================
   20. REPLAY
   ================================================== */
function replay(){
  closeModal('win-modal');
  var moves = game.history.slice();
  game.replaying = true;
  setHover(-1);
  var pieceEl = document.getElementById('turn-piece');
  if(pieceEl){
    pieceEl.style.display = 'inline-block';
    pieceEl.innerHTML = '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 3v5h5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    pieceEl.style.color = 'var(--accent)';
  }
  updateHUD();
  resetBoardVisual();
  var b = new Array(9).fill(null);
  var i = 0;
  document.getElementById('turn-text').innerHTML = 'Watching<span class="sub">REPLAY</span>';
  function step(){
    if(i>=moves.length){
      game.replaying = false;
      if(pieceEl) pieceEl.style.display = "block";
      updateHUD();
      setTimeout(function(){ showWinModal(game.winner, game.mode==='computer'); }, 500);
      return;
    }
    var mv = moves[i];
    b[mv.index] = mv.player;
    placePieceVisual(mv.index, mv.player, false);
    AudioMgr.place(mv.player);
    i++;
    setTimeout(step, 560);
  }
  setTimeout(step, 300);
}

/* ==================================================
   22. UI MANAGER
   ================================================== */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.add('hidden'); });
  document.getElementById(id).classList.remove('hidden');
}
function openModal(id){
  var el = document.getElementById(id);
  if(!el) return;
  el.classList.remove('hidden');
  el.style.display = 'flex';
  el.style.opacity = '1';
  el.style.pointerEvents = 'auto';
}
function closeModal(id){
  var el = document.getElementById(id);
  if(!el) return;
  el.classList.add('hidden');
  el.style.display = 'none';
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
}
function announce(text){
  document.getElementById('status-live').textContent = text;
}
function announceTurn(){
  var who;
  if(game.mode==='computer'){
    who = game.current===HUMAN ? 'Your turn' : "Computer's turn";
  } else {
    who = game.playerNames[game.current] + "'s turn";
  }
  announce(who);
  /* Do not speak "Computer's turn" because AI responds quickly */
  if(game.mode === 'computer' && game.current !== HUMAN) return;
  SpeechMgr.speak(who);
}
function updateQuickSoundBtn(){
  var btn = document.getElementById('btn-sound-quick');
  if(!btn) return;
  var soundOn = SAVE.settings.sound;
  if(soundOn){
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="2" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" stroke-width="2" stroke-linecap="round"/></svg>';
    btn.style.opacity = '1';
    btn.title = 'Sound: On';
  } else {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke-width="2" stroke-linejoin="round"/><line x1="22" y1="9" x2="16" y2="15" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="9" x2="22" y2="15" stroke-width="2" stroke-linecap="round"/></svg>';
    btn.style.opacity = '0.4';
    btn.title = 'Sound: Off';
  }
}
function updateHUD(){
  updateQuickSoundBtn();
  var hudActions = document.getElementById('hud-actions');
  var btnMenu = document.getElementById('btn-menu');
  var btnUndo = document.getElementById('btn-undo');
  var btnRestart = document.getElementById('btn-restart');

  if(game.replaying){
    if(btnUndo) btnUndo.disabled = true;
    if(btnRestart) btnRestart.disabled = true;
    if(btnMenu) btnMenu.disabled = true;
    if(hudActions) hudActions.style.display = 'none';
    if(btnMenu) btnMenu.style.visibility = 'hidden';
    return;
  } else {
    if(btnMenu) { btnMenu.disabled = false; btnMenu.style.visibility = 'visible'; }
    if(hudActions) hudActions.style.display = 'flex';
  }
  updateQuickSoundBtn();
  var pieceEl = document.getElementById('turn-piece');
  if(pieceEl && !game.replaying) pieceEl.style.display = 'block';
  var textEl = document.getElementById('turn-text');
  var hx = getThemeHex(SAVE.settings.theme);
  if(game.current==='X'){
    pieceEl.innerHTML = '<path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>';
    pieceEl.style.color = hx.x; 
  } else {
    pieceEl.innerHTML = '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="3" fill="none"/>';
    pieceEl.style.color = hx.o;
  }
  var who = game.mode==='computer' ? (game.current===HUMAN?'Your':"Computer's") : (game.playerNames[game.current] + "'s");
  textEl.innerHTML = who + ' Turn';
  if(game.mode === 'computer'){
    document.getElementById('btn-undo').disabled = !game.history.some(function(h){ return h.player === HUMAN; });
  } else {
    document.getElementById('btn-undo').disabled = game.history.length === 0;
  }
  document.getElementById('btn-restart').disabled = game.history.length===0;
  
  updateScoreboardChips();
}
function updateScoreboardChips(){
  document.getElementById('score-x').textContent = SAVE.session.x;
  document.getElementById('score-o').textContent = SAVE.session.o;
  document.getElementById('score-d').textContent = SAVE.session.draw;
}
function updateHintBar(){
  var hint = document.getElementById('hint-bar');
  if(game.mode==='computer' && game.current===AI_SYM){
    hint.textContent = 'Computer is thinking…';
  } else {
    hint.textContent = 'Tap a tile to place your mark';
  }
}
function vibrate(pattern){
  if(SAVE.settings.vibration && 'vibrate' in navigator){
    try{ navigator.vibrate(pattern); }catch(e){}
  }
}

/* ==================================================
   EVENT WIRING
   ================================================== */
function initSwitch(id, key){
  var el = document.getElementById(id);
  function render(){ el.classList.toggle('on', !!SAVE.settings[key]); if(key==='sound') updateQuickSoundBtn(); }
  render();
  el.addEventListener('click', function(){
    SAVE.settings[key] = !SAVE.settings[key];
    render();
    persist();
    if(key==='reducedMotion'){ /* applied live in loop */ }
    AudioMgr.click();
  });
}

function bindEvents(){
  document.getElementById('btn-new-game').addEventListener('click', function(){ showScreen('mode-screen'); document.getElementById('opponent-section').style.display='flex'; document.getElementById('difficulty-panel').classList.add('hidden'); document.getElementById('local-names-panel').classList.add('hidden'); });
  document.getElementById('btn-continue').addEventListener('click', function(){ resumeGame(); });
  document.getElementById('btn-how-to-play').addEventListener('click', function(){ showScreen('how-to-play-screen'); });
  document.getElementById('htp-back').addEventListener('click', function(){ showScreen('main-menu'); refreshContinueVisibility(); });
  document.getElementById('btn-settings').addEventListener('click', function(){ showScreen('settings-screen'); });
  document.getElementById('btn-stats').addEventListener('click', function(){ StatsMgr.render(); showScreen('stats-screen'); });

  document.getElementById('mode-local').addEventListener('click', function(){ document.getElementById('opponent-section').style.display='none'; document.getElementById('local-names-panel').classList.remove('hidden'); document.getElementById('name-x').value=''; document.getElementById('name-o').value=''; });
  document.getElementById('mode-computer').addEventListener('click', function(){ document.getElementById('opponent-section').style.display='none'; document.getElementById('difficulty-panel').classList.remove('hidden'); chosenDiff = 'easy'; chosenSide = 'X'; document.querySelectorAll('.diff-btn').forEach(function(x){ x.classList.toggle('btn-primary', x.dataset.diff === 'easy'); }); document.querySelectorAll('.side-btn').forEach(function(x){ x.classList.toggle('btn-primary', x.dataset.side === 'X'); }); })
  document.getElementById('mode-back').addEventListener('click', function(){ 
    if(!document.getElementById('difficulty-panel').classList.contains('hidden')){
      document.getElementById('difficulty-panel').classList.add('hidden');
      document.getElementById('opponent-section').style.display='flex';
    } else if(!document.getElementById('local-names-panel').classList.contains('hidden')){
      document.getElementById('local-names-panel').classList.add('hidden');
      document.getElementById('opponent-section').style.display='flex';
    } else {
      showScreen('main-menu'); refreshContinueVisibility(); 
    }
  });
  var chosenDiff = 'easy';
  document.querySelectorAll('.diff-btn').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.diff-btn').forEach(function(x){ x.classList.remove('btn-primary'); });
      b.classList.add('btn-primary');
      chosenDiff = b.dataset.diff;
    });
  });
  var chosenSide = 'X';
  document.querySelectorAll('.side-btn').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.side-btn').forEach(function(x){ x.classList.remove('btn-primary'); });
      b.classList.add('btn-primary');
      chosenSide = b.dataset.side;
    });
  });
  
  function launchAiGame(){
    if(chosenSide === 'X') { HUMAN = 'X'; AI_SYM = 'O'; game.playerNames={X:'You', O:'Computer'}; }
    else { HUMAN = 'O'; AI_SYM = 'X'; game.playerNames={X:'Computer', O:'You'}; }
    newGame('computer', chosenDiff);
  }

  document.getElementById('btn-start-ai').addEventListener('click', function(){
    if(chosenDiff === 'impossible'){
      openModal('impossible-warning-modal');
    } else {
      launchAiGame();
    }
  });

  var btnConfirmImp = document.getElementById('btn-confirm-impossible');
  if(btnConfirmImp) btnConfirmImp.addEventListener('click', function(){
    closeModal('impossible-warning-modal');
    var titleEl = document.getElementById('imp-second-title');
    if(chosenSide === 'X'){
      if(titleEl) {
        titleEl.textContent = 'Are you SURE you want to play with X?!';
      }
    } else {
      if(titleEl) {
        titleEl.innerHTML = 'Avoiding X?<br><span style="font-size:15px; font-weight:600; color:var(--text-dim); display:block; margin-top:8px;">Are you sure you want to go with O?</span>';
      }
    }
    openModal('impossible-second-warning-modal');
  });

  var btnCancelImp = document.getElementById('btn-cancel-impossible');
  if(btnCancelImp) btnCancelImp.addEventListener('click', function(){
    closeModal('impossible-warning-modal');
    chosenDiff = 'medium';
    document.querySelectorAll('.diff-btn').forEach(function(x){ x.classList.toggle('btn-primary', x.dataset.diff === 'medium'); });
  });

  var btnConfirmImpFinal = document.getElementById('btn-confirm-impossible-final');
  if(btnConfirmImpFinal) btnConfirmImpFinal.addEventListener('click', function(){
    closeModal('impossible-second-warning-modal');
    launchAiGame();
  });

  var btnCancelImpFinal = document.getElementById('btn-cancel-impossible-final');
  if(btnCancelImpFinal) btnCancelImpFinal.addEventListener('click', function(){
    closeModal('impossible-second-warning-modal');
    chosenDiff = 'medium';
    document.querySelectorAll('.diff-btn').forEach(function(x){ x.classList.toggle('btn-primary', x.dataset.diff === 'medium'); });
  });
  document.getElementById('btn-start-local').addEventListener('click', function(){ 
    var ix = document.getElementById('name-x'), io = document.getElementById('name-o');
    var nx = ix.value.trim().slice(0, 10), no = io.value.trim().slice(0, 10);
    if(nx) nx = nx.charAt(0).toUpperCase() + nx.slice(1);
    if(no) no = no.charAt(0).toUpperCase() + no.slice(1);
    
    var finalX = nx || 'Player X';
    var finalO = no || 'Player O';
    
    var err = document.getElementById('name-error');
    if(err) err.style.display = 'none';
    ix.style.borderColor = '';
    io.style.borderColor = '';
    
    game.playerNames = { X: finalX, O: finalO };
    newGame('local'); 
  });

  document.getElementById('name-x').addEventListener('input', function(){ 
    this.style.borderColor=''; 
    if(!document.getElementById('name-o').style.borderColor) document.getElementById('name-error').style.display='none'; 
  });
  document.getElementById('name-o').addEventListener('input', function(){ 
    this.style.borderColor=''; 
    if(!document.getElementById('name-x').style.borderColor) document.getElementById('name-error').style.display='none'; 
  });

  document.getElementById('settings-back').addEventListener('click', function(){ showScreen('main-menu'); refreshContinueVisibility(); });
  document.getElementById('stats-back').addEventListener('click', function(){ showScreen('main-menu'); refreshContinueVisibility(); });
  document.getElementById('stats-reset').addEventListener('click', function(){
    requestConfirm('Reset statistics?', 'All win/loss records will be cleared.', function(){
      SAVE.stats = defaultSave().stats;
      SAVE.session = defaultSave().session;
      persist();
      StatsMgr.render();
      updateScoreboardChips();
    });
  });

  initSwitch('switch-sound','sound');
  initSwitch('switch-voice','voice');
  var isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobileDevice) {
    var vibRow = document.getElementById('row-vibration');
    if (vibRow) vibRow.style.display = 'none';
  }
  initSwitch('switch-vibration','vibration');
  initSwitch('switch-motion','reducedMotion');

  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-restart').addEventListener('click', function(){
    if(game.history.length === 0) return;
    if(game.gameOver){
      newGame(game.mode, game.difficulty);
    } else {
      requestConfirm('Restart this game?', 'Current progress will be cleared.', function(){
        newGame(game.mode, game.difficulty);
      });
    }
  });
  document.getElementById('btn-sound-quick').addEventListener('click', function(){
    SAVE.settings.sound = !SAVE.settings.sound; persist();
    document.getElementById('switch-sound').classList.toggle('on', SAVE.settings.sound);
    updateQuickSoundBtn();
    if(SAVE.settings.sound) AudioMgr.click();
  });
  document.getElementById('btn-fullscreen').addEventListener('click', function(){
    if(!document.fullscreenElement){ document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(function(){}); }
    else { document.exitFullscreen && document.exitFullscreen(); }
  });
  document.getElementById('btn-menu').addEventListener('click', function(){
    requestConfirm('Leave game?', 'Are you sure you want to leave?', function(){
      game.inProgress=false; SAVE.snapshot=null; persist();
      showScreen('main-menu'); refreshContinueVisibility();
    });
  });

  document.getElementById('btn-play-again').addEventListener('click', function(){
    closeModal('win-modal');
    newGame(game.mode, game.difficulty);
  });
  document.getElementById('btn-replay').addEventListener('click', replay);
  document.getElementById('btn-win-menu').addEventListener('click', function(){
    closeModal('win-modal');
    showScreen('main-menu');
    refreshContinueVisibility();
  });

  document.getElementById('confirm-yes').addEventListener('click', function(){
    var cb = pendingConfirm; closeModal('confirm-modal'); pendingConfirm=null;
    if(cb) cb();
  });
  document.getElementById('confirm-no').addEventListener('click', function(){ closeModal('confirm-modal'); pendingConfirm=null; });

  window.addEventListener('keydown', function(e){
    if(document.getElementById('game-screen').classList.contains('hidden')) return;
    var map = {'7':0,'8':1,'9':2,'4':3,'5':4,'6':5,'1':6,'2':7,'3':8};
    if(map.hasOwnProperty(e.key)){
      var idx = map[e.key];
      if(isHumanTurn() && !game.board[idx] && !game.gameOver) makeMove(idx);
    }
    if(e.key==='Escape'){ document.getElementById('btn-menu').click(); }
    if(e.key.toLowerCase()==='u'){ undo(); }
  });
}

function requestConfirm(title, sub, cb){
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-sub').textContent = sub;
  pendingConfirm = cb;
  openModal('confirm-modal');
}
function refreshContinueVisibility(){
  var btn = document.getElementById('btn-continue');
  btn.style.display = 'none';
}

/* ==================================================
   BOOT SEQUENCE
   ================================================== */
function boot(){
  SAVE = loadSave();
  document.body.className = 'theme-' + SAVE.settings.theme;
  buildThemeGrid();
  bindEvents();
  refreshContinueVisibility();

  var fill = document.getElementById('loader-fill');
  var label = document.getElementById('loader-label');
  var pct = 0;
  var iv = setInterval(function(){
    pct = Math.min(96, pct + (6+Math.random()*10));
    fill.style.width = pct+'%';
  }, 90);

  function finishLoad(){
    clearInterval(iv);
    fill.style.width = '100%';
    label.textContent = 'Ready';
    try{ initScene(); }catch(e){ console.error(e); }
    setTimeout(function(){
      showScreen('main-menu');
    }, 420);
  }

  if(window.THREE){
    setTimeout(finishLoad, 700);
  } else {
    var check = setInterval(function(){
      if(window.THREE){ clearInterval(check); finishLoad(); }
    }, 60);
    setTimeout(function(){ clearInterval(check); if(!sceneReady){ label.textContent='Engine unavailable'; } }, 6000);
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
