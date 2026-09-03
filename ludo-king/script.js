(function(){
"use strict";

var AudioEngine = (function(){
  var ctx = null, enabled = true;
  function init(){
    if(!ctx && (window.AudioContext || window.webkitAudioContext)){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type, duration, gainVal){
    if(!enabled) return;
    init();
    if(!ctx) return;
    if(ctx.state === 'suspended') ctx.resume();
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainVal || 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  function playPop(freq, endFreq, dur, gainVal, type){
    if(!enabled) return;
    init(); if(!ctx) return;
    if(ctx.state === 'suspended') ctx.resume();
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), t + dur);
    gain.gain.setValueAtTime(gainVal || 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  return {
    toggle: function(){ enabled = !enabled; return enabled; },
    isEnabled: function(){ return enabled; },

    // Authentic Ludo King Shaker & Dice Land Impact Sound
    diceRoll: function(){
      if(!enabled) return;
      init(); if(!ctx) return;
      if(ctx.state === 'suspended') ctx.resume();
      
      // Fast rattle clicks (Dice shaking in cup)
      var rattles = 7;
      for(var i = 0; i < rattles; i++){
        (function(step){
          var delay = step * 48;
          var pitch = 380 + Math.random() * 260;
          var vol = 0.28 + (step / rattles) * 0.15;
          setTimeout(function(){
            playPop(pitch, pitch * 0.5, 0.045, vol, 'triangle');
          }, delay);
        })(i);
      }
      
      // Final solid dice landing slam on wood board
      setTimeout(function(){
        playPop(180, 50, 0.12, 0.55, 'triangle');
        playTone(520, 'sine', 0.06, 0.35);
      }, 390);
    },

    // Crisp Bouncy Ludo Pawn Step
    step: function(stepIndex){
      if(!enabled) return;
      var basePitch = 520 + (stepIndex % 6) * 35;
      playPop(basePitch, basePitch * 0.45, 0.07, 0.35, 'sine');
      playTone(basePitch * 1.4, 'triangle', 0.03, 0.15);
    },

    // Dramatic Ludo Pawn Capture Knockout
    capture: function(){
      if(!enabled) return;
      playPop(750, 80, 0.28, 0.6, 'sawtooth');
      playPop(350, 60, 0.20, 0.4, 'square');
      setTimeout(function(){
        playPop(160, 40, 0.25, 0.45, 'triangle');
      }, 90);
    },

    // Bright Ludo Home Stretch Celebration Chime
    enterHome: function(){
      if(!enabled) return;
      var notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach(function(freq, i){
        setTimeout(function(){
          playPop(freq, freq * 0.85, 0.18, 0.35, 'sine');
        }, i * 75);
      });
    },

    win: function(){
      this.playVictoryFanfare();
    },

    playVictoryFanfare: function(){
      if(!enabled) return;
      init(); if(!ctx) return;
      if(ctx.state === 'suspended') ctx.resume();
      var notes = [
        { f: 523.25, t: 0.0,  d: 0.22 },
        { f: 659.25, t: 0.12, d: 0.22 },
        { f: 783.99, t: 0.24, d: 0.22 },
        { f: 1046.50, t: 0.36, d: 0.40 },
        { f: 1318.51, t: 0.54, d: 0.55 },
        { f: 1567.98, t: 0.72, d: 0.80 }
      ];
      notes.forEach(function(n){
        setTimeout(function(){
          playPop(n.f, n.f * 0.95, n.d, 0.38, 'triangle');
          playTone(n.f * 1.5, 'sine', n.d * 0.7, 0.18);
        }, n.t * 1000);
      });
    },

    playStyleSound: function(styleName){
      if(!enabled) return;
      init(); if(!ctx) return;
      if(ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if(styleName === 'teleport'){
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, t);
        osc.frequency.exponentialRampToValueAtTime(1600, t + 0.10);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.25);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t); osc.stop(t + 0.25);
      } else if(styleName === 'surf'){
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.linearRampToValueAtTime(560, t + 0.10);
        osc.frequency.linearRampToValueAtTime(280, t + 0.22);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        osc.start(t); osc.stop(t + 0.24);
      } else if(styleName === 'meteor'){
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.28);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
        osc.start(t); osc.stop(t + 0.30);
      } else if(styleName === 'tornado'){
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, t);
        osc.frequency.exponentialRampToValueAtTime(130, t + 0.15);
        osc.frequency.linearRampToValueAtTime(380, t + 0.28);
        gain.gain.setValueAtTime(0.30, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.start(t); osc.stop(t + 0.28);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, t);
        osc.frequency.exponentialRampToValueAtTime(620, t + 0.12);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t); osc.stop(t + 0.14);
      }
    }
  };
})();

var BOARD_COORDS = [
  {r:13, c:6}, {r:12, c:6}, {r:11, c:6}, {r:10, c:6}, {r:9, c:6},
  {r:8, c:5}, {r:8, c:4}, {r:8, c:3}, {r:8, c:2}, {r:8, c:1}, {r:8, c:0},
  {r:7, c:0},
  {r:6, c:0}, {r:6, c:1}, {r:6, c:2}, {r:6, c:3}, {r:6, c:4}, {r:6, c:5},
  {r:5, c:6}, {r:4, c:6}, {r:3, c:6}, {r:2, c:6}, {r:1, c:6}, {r:0, c:6},
  {r:0, c:7},
  {r:0, c:8}, {r:1, c:8}, {r:2, c:8}, {r:3, c:8}, {r:4, c:8}, {r:5, c:8},
  {r:6, c:9}, {r:6, c:10}, {r:6, c:11}, {r:6, c:12}, {r:6, c:13}, {r:6, c:14},
  {r:7, c:14},
  {r:8, c:14}, {r:8, c:13}, {r:8, c:12}, {r:8, c:11}, {r:8, c:10}, {r:8, c:9},
  {r:9, c:8}, {r:10, c:8}, {r:11, c:8}, {r:12, c:8}, {r:13, c:8}, {r:14, c:8},
  {r:14, c:7}, {r:14, c:6}
];
var STAR_TILES = [0, 8, 13, 21, 26, 34, 39, 47];
var START_OFFSETS = { red: 0, green: 13, yellow: 26, blue: 39 };
var HOME_PATHS = {
  red:    [{r:13,c:7}, {r:12,c:7}, {r:11,c:7}, {r:10,c:7}, {r:9,c:7}],
  green:  [{r:7,c:1},  {r:7,c:2},  {r:7,c:3},  {r:7,c:4},  {r:7,c:5}],
  yellow: [{r:1,c:7},  {r:2,c:7},  {r:3,c:7},  {r:4,c:7},  {r:5,c:7}],
  blue:   [{r:7,c:13}, {r:7,c:12}, {r:7,c:11}, {r:7,c:10}, {r:7,c:9}]
};
var CENTER_COORDS = {
  red:    {r:8, c:7},
  green:  {r:7, c:6},
  yellow: {r:6, c:7},
  blue:   {r:7, c:8}
};
var YARD_COORDS = {
  red:    [{r:11, c:2}, {r:11, c:3}, {r:12, c:2}, {r:12, c:3}],
  green:  [{r:2, c:2},  {r:2, c:3},  {r:3, c:2},  {r:3, c:3}],
  yellow: [{r:2, c:11}, {r:2, c:12}, {r:3, c:11}, {r:3, c:12}],
  blue:   [{r:11, c:11},{r:11, c:12},{r:12, c:11},{r:12, c:12}]
};
var PLAYER_COLORS_HEX = {
  red:    0xef4444,
  green:  0x10b981,
  yellow: 0xeab308,
  blue:   0x3b82f6
};

var scene, camera, renderer, boardGroup, tokenGroup, starParticles;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var savedViewMode = (typeof localStorage !== 'undefined') ? localStorage.getItem('ludo_view_mode') : null;
var initial2DMode = (savedViewMode === '3d') ? false : true;

var gameState = {
  mode: 'ai',
  playerCount: 2,
  ruleType: 'classic',
  humanColor: 'red',
  activePlayers: ['red', 'yellow'],
  localSelectedColors: ['red', 'yellow'],
  tokens: { red:[], green:[], yellow:[], blue:[] },
  currentTurnIdx: 0,
  diceValue: 1,
  hasRolled: false,
  isMoving: false,
  gameOver: false,
  winners: [],
  hasKilled: { red: false, green: false, yellow: false, blue: false },
  is2DMode: initial2DMode,
  autoPOV: false,
  autoPlayAll: false
};

var isDragging = false, dragLastX = 0, dragLastY = 0;
var boardRotY = 0, boardRotX = initial2DMode ? (Math.PI / 2) : 0.45, boardVelY = 0, boardVelX = 0;
var zoomCurrent = 1.0, zoomTarget = 1.0;
var lastInteractTime = performance.now();
var autoSpinBlend = 0;
var AUTO_SPIN_DELAY = 3000;
var AUTO_SPIN_SPEED = 0.08;
var tokenMeshes = { red:[], green:[], yellow:[], blue:[] };
var _tileMeshMap = {};
var _starTileMeshes = {};
var _yardMeshes = { red:null, green:null, yellow:null, blue:null };
var _yardMaterials = { red:null, green:null, yellow:null, blue:null };
var _yardOuterRimMeshes = { red:null, green:null, yellow:null, blue:null };

function gridToWorld(r, c){
  var cellSize = 0.62;
  var x = (c - 7) * cellSize;
  var z = (r - 7) * cellSize;
  return { x: x, y: 0.18, z: z };
}
function getStarThemeProperties(){
  if (isLightTheme()) {
    return { color: 0x64748b, opacity: 0.45, size: 0.22, bg: 0xf1f5f9 };
  } else {
    return { color: 0xffffff, opacity: 0.80, size: 0.32, bg: 0x000000 };
  }
}
function init3D(){
  var container = document.getElementById('canvas-container');
  var canvas = document.getElementById('three-canvas');
  var starTheme = getStarThemeProperties();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(starTheme.bg);
  camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  var ambLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambLight);
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
  dirLight.position.set(12, 22, 14);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -12;
  dirLight.shadow.camera.right = 12;
  dirLight.shadow.camera.top = 12;
  dirLight.shadow.camera.bottom = -12;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);
  var pointLight = new THREE.PointLight(0xffffff, 0.12, 20);
  pointLight.position.set(0, 8, 0);
  scene.add(pointLight);
  
  var starGeo = new THREE.BufferGeometry();
  var starCount = 1500;
  var starPos = new Float32Array(starCount * 3);
  for(var i=0; i<starCount*3; i+=3){
    starPos[i]   = (Math.random() - 0.5) * 180;
    starPos[i+1] = -2.5 - Math.random() * 85;
    starPos[i+2] = (Math.random() - 0.5) * 180;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  var starMat = new THREE.PointsMaterial({
    color: starTheme.color,
    size: starTheme.size,
    transparent: true,
    opacity: starTheme.opacity,
    depthTest: true,
    depthWrite: false
  });
  starParticles = new THREE.Points(starGeo, starMat);
  starParticles.visible = true;
  scene.add(starParticles);
  
  boardGroup = new THREE.Group();
  tokenGroup = new THREE.Group();
  boardGroup.add(tokenGroup);
  scene.add(boardGroup);
  build3DBoard();
  build3DPawns();
  
  window.addEventListener('resize', onResize);
  canvas.addEventListener('pointerdown', onPointerDown, {passive:true});
  canvas.addEventListener('pointermove', onPointerMove, {passive:true});
  canvas.addEventListener('pointerup', onPointerUp, {passive:true});
  canvas.addEventListener('wheel', function(e){
    e.preventDefault();
    if (gameState && gameState.is2DMode) return;
    lastInteractTime = performance.now();
    autoSpinBlend = 0;
    zoomTarget = Math.max(0.55, Math.min(1.8, zoomTarget + e.deltaY * 0.001));
  }, {passive:false});
  animate();
}
function onResize(){
  var container = document.getElementById('canvas-container');
  if(!container || !renderer || !camera) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function createStarShape(radius, innerRadius, points, thickness) {
  var shape = new THREE.Shape();
  var pi2 = Math.PI * 2;
  for (var i = 0; i < points * 2; i++) {
    var r = (i % 2 === 0) ? radius : innerRadius;
    var a = (i / (points * 2)) * pi2 - Math.PI / 2;
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  if (thickness) {
    var holePath = new THREE.Path();
    var rOuter = radius - thickness;
    var rInner = innerRadius - thickness;
    for (var i = 0; i < points * 2; i++) {
      var r = (i % 2 === 0) ? rOuter : rInner;
      var a = (i / (points * 2)) * pi2 - Math.PI / 2;
      if (i === 0) holePath.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else holePath.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    shape.holes.push(holePath);
  }
  return shape;
}
function createArrowShape() {
  var shape = new THREE.Shape();
  var t = 0.015; 
  shape.moveTo(-t, -0.2);
  shape.lineTo(t, -0.2);
  shape.lineTo(t, 0.04);
  shape.lineTo(0.12, -0.05);
  shape.lineTo(0.14, -0.01);
  shape.lineTo(0, 0.16); 
  shape.lineTo(-0.14, -0.01);
  shape.lineTo(-0.12, -0.05);
  shape.lineTo(-t, 0.04);
  shape.lineTo(-t, -0.2);
  return shape;
}
function createHollowBorderShape(outerDim, innerDim) {
  var shape = new THREE.Shape();
  var o = outerDim / 2;
  shape.moveTo(-o, -o);
  shape.lineTo(o, -o);
  shape.lineTo(o, o);
  shape.lineTo(-o, o);
  shape.lineTo(-o, -o);

  var hole = new THREE.Path();
  var i = innerDim / 2;
  hole.moveTo(-i, -i);
  hole.lineTo(-i, i);
  hole.lineTo(i, i);
  hole.lineTo(i, -i);
  hole.lineTo(-i, -i);
  shape.holes.push(hole);
  return shape;
}
function isLightTheme(){
  return document.body.classList.contains('theme-light');
}
function build3DBoard(){
  _tileMeshMap = {};
  
  var cellSize = 0.62;
  var defaultTileColor = isLightTheme() ? 0xffffff : 0x121a28;
  
  var sharedTileGeo = new THREE.BoxGeometry(cellSize * 0.94, 0.08, cellSize * 0.94);
  var sharedShadowPlaneGeo = new THREE.PlaneGeometry(cellSize * 1.07, cellSize * 1.07);
  var sharedShadowPlaneMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: isLightTheme() ? 0.22 : 0.35,
    transparent: true,
    depthWrite: false
  });
  var tileMatCache = {};
  for(var r=0; r<15; r++){
    for(var c=0; c<15; c++){
      var pos = gridToWorld(r, c);
      var tileColor = defaultTileColor;
      
      PLAYERS.forEach(function(p){
        HOME_PATHS[p].forEach(function(hp){
          if(hp.r === r && hp.c === c) tileColor = PLAYER_COLORS_HEX[p];
        });
      });
      var isStartRed    = (r===13 && c===6);
      var isStartGreen  = (r===6  && c===1);
      var isStartYellow = (r===1  && c===8);
      var isStartBlue   = (r===8  && c===13);
      
      var isArrowRed    = (r===14 && c===7);
      var isArrowGreen  = (r===7  && c===0);
      var isArrowYellow = (r===0  && c===7);
      var isArrowBlue   = (r===7  && c===14);
      var isOtherSafe   = (r===8&&c===2)||(r===2&&c===6)||(r===6&&c===12)||(r===12&&c===8);
      
      if(isStartRed)    tileColor = PLAYER_COLORS_HEX.red;
      if(isStartGreen)  tileColor = PLAYER_COLORS_HEX.green;
      if(isStartYellow) tileColor = PLAYER_COLORS_HEX.yellow;
      if(isStartBlue)   tileColor = PLAYER_COLORS_HEX.blue;
      if (!tileMatCache[tileColor]) {
        var isWhiteTile = (tileColor === 0xffffff);
        tileMatCache[tileColor] = new THREE.MeshStandardMaterial({
          color: tileColor,
          roughness: isWhiteTile ? 0.15 : 0.35,
          metalness: isWhiteTile ? 0.0 : 0.15,
          emissive: isWhiteTile ? 0xffffff : 0x000000,
          emissiveIntensity: isWhiteTile ? 0.08 : 0
        });
      }
      var tileMesh = new THREE.Mesh(sharedTileGeo, tileMatCache[tileColor]);
      tileMesh.position.set(pos.x, 0.04, pos.z);
      tileMesh.receiveShadow = true;
      boardGroup.add(tileMesh);
      _tileMeshMap[r + '_' + c] = tileMesh;
      
      var shadowPlaneMesh = new THREE.Mesh(sharedShadowPlaneGeo, sharedShadowPlaneMat);
      shadowPlaneMesh.rotation.x = -Math.PI / 2;
      shadowPlaneMesh.position.set(pos.x, 0.005, pos.z);
      boardGroup.add(shadowPlaneMesh);
      
      var extrudeSettings = { depth: 0.012, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.003, bevelThickness: 0.003 };
      
      if(isOtherSafe){
        var starGeo = new THREE.ExtrudeGeometry(createStarShape(0.26, 0.11, 5, 0.020), extrudeSettings);
        var safeStarColor = isLightTheme() ? 0x9ca3af : 0xffffff;
        var starMat = new THREE.MeshStandardMaterial({
          color: safeStarColor,
          roughness: 0.35,
          metalness: 0.2,
          emissive: safeStarColor,
          emissiveIntensity: 0.15
        });
        var starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.rotation.x = -Math.PI / 2;
        starMesh.position.set(pos.x, 0.082, pos.z);
        boardGroup.add(starMesh);

        var keyName = "";
        if (r===8 && c===2) keyName = "P8";
        else if (r===2 && c===6) keyName = "P21";
        else if (r===6 && c===12) keyName = "P34";
        else if (r===12 && c===8) keyName = "P47";

        if(keyName) _starTileMeshes[keyName] = starMesh;
      }
      
      if(isArrowRed || isArrowGreen || isArrowYellow || isArrowBlue){
        var arrowGeo = new THREE.ExtrudeGeometry(createArrowShape(), extrudeSettings);
        var arrowColor, arrowRot;
        if(isArrowRed)    { arrowColor = PLAYER_COLORS_HEX.red;    arrowRot = 0; }
        if(isArrowGreen)  { arrowColor = PLAYER_COLORS_HEX.green;  arrowRot = -Math.PI/2; }
        if(isArrowYellow) { arrowColor = PLAYER_COLORS_HEX.yellow; arrowRot = Math.PI; }
        if(isArrowBlue)   { arrowColor = PLAYER_COLORS_HEX.blue;   arrowRot = Math.PI/2; }
        var arrowMat = new THREE.MeshStandardMaterial({ color: arrowColor, roughness: 0.3, metalness: 0.1 });
        var arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
        arrowMesh.rotation.x = -Math.PI / 2;
        arrowMesh.rotation.z = arrowRot;
        arrowMesh.position.set(pos.x, 0.08, pos.z);
        boardGroup.add(arrowMesh);
      }
    }
  }
  
  var yardSize = cellSize * 6; 
  var yardDefs = [
    { player: 'red',    color: PLAYER_COLORS_HEX.red,    x: -cellSize * 4.5, z:  cellSize * 4.5 },
    { player: 'green',  color: PLAYER_COLORS_HEX.green,  x: -cellSize * 4.5, z: -cellSize * 4.5 },
    { player: 'yellow', color: PLAYER_COLORS_HEX.yellow, x:  cellSize * 4.5, z: -cellSize * 4.5 },
    { player: 'blue',   color: PLAYER_COLORS_HEX.blue,   x:  cellSize * 4.5, z:  cellSize * 4.5 }
  ];
  yardDefs.forEach(function(yd){
    var yardGeo = new THREE.BoxGeometry(yardSize, 0.16, yardSize);
    var yMat = new THREE.MeshStandardMaterial({ color: yd.color, roughness: 0.35, metalness: 0.15 });
    var yMesh = new THREE.Mesh(yardGeo, yMat);
    yMesh.position.set(yd.x, 0.08, yd.z);
    yMesh.receiveShadow = true;
    boardGroup.add(yMesh);
    _yardMeshes[yd.player] = yMesh;
    _yardMaterials[yd.player] = yMat;

    var isLight = isLightTheme();
    var framePad = cellSize * 0.64;
    var frameInner = yardSize - framePad * 2;
    var whiteGeo = new THREE.BoxGeometry(frameInner, 0.012, frameInner);
    var whiteMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xffffff : 0x121a28,
      roughness: isLight ? 0.20 : 0.3,
      metalness: isLight ? 0.0 : 0.05,
      emissive: isLight ? 0xffffff : 0x000000,
      emissiveIntensity: isLight ? 0.03 : 0
    });
    var whiteMesh = new THREE.Mesh(whiteGeo, whiteMat);
    whiteMesh.position.set(yd.x, 0.166, yd.z);
    boardGroup.add(whiteMesh);

    // Animated outer hollow border rim mesh (fits exact 6x6 base square dimensions, zero UI or grid overflow)
    var hollowShape = createHollowBorderShape(yardSize, frameInner);
    var extrudeOpts = { depth: 0.02, bevelEnabled: false };
    var pulseGeo = new THREE.ExtrudeGeometry(hollowShape, extrudeOpts);
    var pulseMat = new THREE.MeshStandardMaterial({
      color: yd.color,
      emissive: yd.color,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.15,
      transparent: true,
      opacity: 0
    });
    var pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.rotation.x = -Math.PI / 2;
    pulseMesh.position.set(yd.x, 0.162, yd.z);
    pulseMesh.visible = false;
    boardGroup.add(pulseMesh);
    _yardOuterRimMeshes[yd.player] = pulseMesh;
    
    var trayEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(frameInner, 0.01, frameInner));
    var borderLine = new THREE.LineSegments(trayEdges,
      new THREE.LineBasicMaterial({ color: isLight ? 0x94a3b8 : 0x475569, opacity: 0.6, transparent: true }));
    borderLine.position.set(yd.x, 0.172, yd.z);
    boardGroup.add(borderLine);
    
    var nestOffsets = [
      { ox: -cellSize * 1.0, oz: -cellSize * 1.0 },
      { ox:  cellSize * 1.0, oz: -cellSize * 1.0 },
      { ox: -cellSize * 1.0, oz:  cellSize * 1.0 },
      { ox:  cellSize * 1.0, oz:  cellSize * 1.0 }
    ];
    nestOffsets.forEach(function(no){
      var nx = yd.x + no.ox;
      var nz = yd.z + no.oz;
      
      var ringGeo = new THREE.CylinderGeometry(cellSize * 0.68, cellSize * 0.68, 0.02, 48);
      var ringMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0xffffff : 0x1e293b,
        roughness: isLight ? 0.20 : 0.25,
        metalness: isLight ? 0.0 : 0.05,
        emissive: isLight ? 0xffffff : 0x000000,
        emissiveIntensity: isLight ? 0.03 : 0
      });
      var ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(nx, 0.176, nz);
      boardGroup.add(ringMesh);
      
      var discGeo = new THREE.CylinderGeometry(cellSize * 0.52, cellSize * 0.52, 0.025, 48);
      var discMat = new THREE.MeshStandardMaterial({ color: yd.color, roughness: 0.35, metalness: 0.15 });
      var discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.set(nx, 0.182, nz);
      boardGroup.add(discMesh);
      
      var shadowGeo = new THREE.TorusGeometry(cellSize * 0.52, 0.008, 12, 48);
      var shadowMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x64748b : 0x000000,
        roughness: 0.9,
        opacity: isLight ? 0.12 : 0.25,
        transparent: true
      });
      var shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = Math.PI / 2;
      shadowMesh.position.set(nx, 0.190, nz);
      boardGroup.add(shadowMesh);
    });
  });
  
  var cHalf = cellSize * 1.5;   
  var cY    = 0.09;             
  
  var cBaseGeo = new THREE.BoxGeometry(cHalf * 2, 0.055, cHalf * 2);
  var cBaseColor = isLightTheme() ? 0xffffff : 0x0f172a;
  var cBaseMat = new THREE.MeshStandardMaterial({ color: cBaseColor, roughness: 0.6, metalness: 0.05 });
  var cBaseMesh = new THREE.Mesh(cBaseGeo, cBaseMat);
  cBaseMesh.position.set(0, 0.058, 0);
  boardGroup.add(cBaseMesh);

  var wedgeDefs = [
    { hex: PLAYER_COLORS_HEX.yellow, x0:0,     z0:0,      x1:-cHalf, z1:-cHalf, x2: cHalf, z2:-cHalf }, 
    { hex: PLAYER_COLORS_HEX.blue,   x0:0,     z0:0,      x1: cHalf, z1:-cHalf, x2: cHalf, z2: cHalf }, 
    { hex: PLAYER_COLORS_HEX.red,    x0:0,     z0:0,      x1: cHalf, z1: cHalf, x2:-cHalf, z2: cHalf }, 
    { hex: PLAYER_COLORS_HEX.green,  x0:0,     z0:0,      x1:-cHalf, z1: cHalf, x2:-cHalf, z2:-cHalf }  
  ];
  wedgeDefs.forEach(function(wd){
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      wd.x0, 0, wd.z0,
      wd.x1, 0, wd.z1,
      wd.x2, 0, wd.z2
    ]), 3));
    geo.setIndex([0, 1, 2]);
    geo.computeVertexNormals();
    var mat = new THREE.MeshStandardMaterial({
      color: wd.hex, roughness: 0.6, metalness: 0.1,
      emissive: wd.hex, emissiveIntensity: 0.05,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, cY, 0);
    boardGroup.add(mesh);
  });
  
  var diagLen = Math.sqrt(2) * cHalf;
  var sepColor = isLightTheme() ? 0xffffff : 0x334155;
  [Math.PI / 4, -Math.PI / 4].forEach(function(a){
    var lGeo = new THREE.BoxGeometry(0.022, 0.018, diagLen);
    var lMesh = new THREE.Mesh(lGeo,
      new THREE.MeshStandardMaterial({ color: sepColor, roughness: 0.3 }));
    lMesh.rotation.y = a;
    lMesh.position.set(0, cY + 0.01, 0);
    boardGroup.add(lMesh);
  });
  
  var bSize = cHalf * 2 + 0.04;
  var borderEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(bSize, 0.01, bSize));
  var borderLines = new THREE.LineSegments(borderEdges,
    new THREE.LineBasicMaterial({ color: isLightTheme() ? 0xffffff : 0x334155, linewidth: 1 }));
  borderLines.position.set(0, cY + 0.02, 0);
  boardGroup.add(borderLines);
  
  var cDiscGeo = new THREE.CylinderGeometry(cellSize * 0.20, cellSize * 0.20, 0.055, 6);
  var isLightDisc = isLightTheme();
  var cDiscMat = new THREE.MeshStandardMaterial({
    color: isLightDisc ? 0xffffff : 0x0f172a,
    metalness: 0.0,
    roughness: isLightDisc ? 0.15 : 0.95,
    emissive: isLightDisc ? 0xffffff : 0x000000,
    emissiveIntensity: isLightDisc ? 0.08 : 0
  });
  var cDisc = new THREE.Mesh(cDiscGeo, cDiscMat);
  cDisc.position.set(0, cY + 0.03, 0);
  boardGroup.add(cDisc);

  buildHomeLocks();
}

var _homeLockMeshes = { red: null, green: null, yellow: null, blue: null };

function create3DPadlockMesh(colorHex) {
  var lockGroup = new THREE.Group();

  var bodyGeo = new THREE.BoxGeometry(0.24, 0.19, 0.11);
  var bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.65,
    roughness: 0.25,
    emissive: colorHex,
    emissiveIntensity: 0.35
  });
  var bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 0.095;
  bodyMesh.castShadow = true;
  lockGroup.add(bodyMesh);

  var keyholeGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.115, 16);
  var keyholeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 });
  var keyholeMesh = new THREE.Mesh(keyholeGeo, keyholeMat);
  keyholeMesh.rotation.x = Math.PI / 2;
  keyholeMesh.position.set(0, 0.095, 0);
  lockGroup.add(keyholeMesh);

  var isLight = (typeof isLightTheme === 'function' && isLightTheme());
  var shackleGeo = new THREE.TorusGeometry(0.075, 0.022, 16, 32, Math.PI);
  var shackleMat = new THREE.MeshStandardMaterial({
    color: isLight ? 0x1e293b : 0xf1f5f9,
    metalness: isLight ? 0.45 : 0.95,
    roughness: 0.15
  });
  var shackleMesh = new THREE.Mesh(shackleGeo, shackleMat);
  shackleMesh.position.set(0, 0.19, 0);
  shackleMesh.castShadow = true;
  shackleMesh.name = "shackle";
  lockGroup.add(shackleMesh);

  var ringGeo = new THREE.TorusGeometry(0.18, 0.015, 12, 32);
  var ringMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });
  var ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.01;
  lockGroup.add(ringMesh);

  return lockGroup;
}

function buildHomeLocks() {
  _homeLockMeshes = { red: null, green: null, yellow: null, blue: null };
  var lockCoords = {
    red:    HOME_PATHS.red[0],
    green:  HOME_PATHS.green[0],
    yellow: HOME_PATHS.yellow[0],
    blue:   HOME_PATHS.blue[0]
  };
  PLAYERS.forEach(function(color) {
    var lc = lockCoords[color];
    var pos = gridToWorld(lc.r, lc.c);
    var mesh = create3DPadlockMesh(PLAYER_COLORS_HEX[color]);
    mesh.position.set(pos.x, 0.08, pos.z);
    mesh.name = "lock_" + color;
    boardGroup.add(mesh);
    _homeLockMeshes[color] = mesh;
  });
  updateLockVisuals();
}

function position2DLockBadges() {
  if (!camera || !gameState || !boardGroup) return;
  var container = document.getElementById('canvas-container');
  if (!container) return;
  var w = container.clientWidth;
  var h = container.clientHeight;
  var isQuickMode = (gameState.ruleType === 'quick');
  boardGroup.updateMatrixWorld(true);

  PLAYERS.forEach(function(color) {
    var el = document.getElementById('lock-2d-' + color);
    if (!el) return;
    var isLocked = isQuickMode && (!gameState.hasKilled || !gameState.hasKilled[color]);
    var isActive = (gameState.activePlayers.indexOf(color) !== -1);
    var showLock = isLocked && isActive && !gameState.gameOver && gameState.is2DMode;

    if (!showLock) {
      el.style.display = 'none';
      return;
    }

    el.style.display = 'flex';
    var hp = HOME_PATHS[color][0];
    var worldPos = gridToWorld(hp.r, hp.c);
    var worldVec = new THREE.Vector3(worldPos.x, 0.12, worldPos.z);
    worldVec.applyMatrix4(boardGroup.matrixWorld);
    worldVec.project(camera);
    var px = (worldVec.x * 0.5 + 0.5) * w;
    var py = (-worldVec.y * 0.5 + 0.5) * h;

    el.style.left = px + 'px';
    el.style.top = py + 'px';
  });
}

function resetLockMeshToClosed(color) {
  var mesh = _homeLockMeshes ? _homeLockMeshes[color] : null;
  if (!mesh) return;
  var hp = HOME_PATHS[color][0];
  var pos = gridToWorld(hp.r, hp.c);
  mesh.position.set(pos.x, 0.08, pos.z);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.setScalar(1.0);
  var shackle = mesh.getObjectByName("shackle");
  if (shackle) {
    shackle.position.set(0, 0.19, 0);
    shackle.rotation.set(0, 0, 0);
  }
  var bodyMesh = mesh.children[0];
  if (bodyMesh && bodyMesh.material) {
    bodyMesh.material.emissiveIntensity = 0.35;
  }
}

function updateLockVisuals() {
  var isQuickMode = (gameState && gameState.ruleType === 'quick');
  PLAYERS.forEach(function(color) {
    var isLocked = isQuickMode && (!gameState.hasKilled || !gameState.hasKilled[color]);
    var isActive = (gameState && gameState.activePlayers && gameState.activePlayers.indexOf(color) !== -1);
    var showLock = isLocked && isActive && !(gameState && gameState.gameOver);

    var mesh = _homeLockMeshes ? _homeLockMeshes[color] : null;
    if (mesh) {
      if (showLock) {
        resetLockMeshToClosed(color);
      }
      mesh.visible = showLock && !(gameState && gameState.is2DMode);
    }

    var overlay2D = document.getElementById('lock-2d-' + color);
    if (overlay2D) {
      overlay2D.classList.remove('unlocking-2d-badge');
      overlay2D.style.display = (showLock && gameState && gameState.is2DMode) ? 'flex' : 'none';
    }
  });
  if (gameState && gameState.is2DMode) {
    position2DLockBadges();
  }
}

function trigger3DLockUnlockParticles(pos, colorHex) {
  if (!scene) return;
  var group = new THREE.Group();
  var particleCount = 18;
  var pGeo = new THREE.SphereGeometry(0.022, 8, 8);
  var pMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 1.2,
    metalness: 0.1,
    roughness: 0.1
  });

  var particles = [];
  for (var i = 0; i < particleCount; i++) {
    var mesh = new THREE.Mesh(pGeo, pMat);
    mesh.position.set(pos.x, 0.15, pos.z);
    var angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
    var speed = 0.02 + Math.random() * 0.025;
    var vy = 0.03 + Math.random() * 0.035;
    particles.push({
      mesh: mesh,
      vx: Math.cos(angle) * speed,
      vy: vy,
      vz: Math.sin(angle) * speed,
      scale: 1.0 + Math.random() * 0.5
    });
    group.add(mesh);
  }
  scene.add(group);

  var t0 = performance.now();
  var duration = 800;
  function update(now) {
    var progress = Math.min((now - t0) / duration, 1.0);
    particles.forEach(function(p) {
      p.mesh.position.x += p.vx;
      p.mesh.position.y += p.vy;
      p.mesh.position.z += p.vz;
      p.vy -= 0.0008;
      var s = Math.max(0, (1 - progress) * p.scale);
      p.mesh.scale.setScalar(s);
    });
    if (progress < 1.0) {
      requestAnimationFrame(update);
    } else {
      scene.remove(group);
    }
  }
  requestAnimationFrame(update);
}

function animateUnlockPadlock(color, onDone) {
  if (gameState && gameState.ruleType !== 'quick') {
    if (onDone) onDone();
    return;
  }
  var is2D = (gameState && gameState.is2DMode);
  
  if (AudioEngine && AudioEngine.playStyleSound) {
    AudioEngine.playStyleSound('teleport');
  } else if (AudioEngine && AudioEngine.enterHome) {
    AudioEngine.enterHome();
  }

  var overlay2D = document.getElementById('lock-2d-' + color);
  if (overlay2D && is2D) {
    overlay2D.classList.add('unlocking-2d-badge');
    
    var container = document.getElementById('canvas-container');
    if (container) {
      var flare = document.createElement('div');
      flare.className = 'lock-unlock-flare';
      flare.setAttribute('data-color', color);
      flare.style.left = overlay2D.style.left;
      flare.style.top = overlay2D.style.top;
      container.appendChild(flare);
      setTimeout(function() {
        if (flare.parentNode) flare.parentNode.removeChild(flare);
      }, 750);
    }

    setTimeout(function() {
      overlay2D.classList.remove('unlocking-2d-badge');
      overlay2D.style.display = 'none';
      if (onDone) onDone();
    }, 750);
  }

  var mesh = _homeLockMeshes ? _homeLockMeshes[color] : null;
  if (mesh) {
    mesh.visible = true;
    var shackle = mesh.getObjectByName("shackle");
    var bodyMesh = mesh.children[0];
    var hp = HOME_PATHS[color][0];
    var worldPos = gridToWorld(hp.r, hp.c);
    
    trigger3DLockUnlockParticles(worldPos, PLAYER_COLORS_HEX[color] || 0xf59e0b);
    
    var t0 = performance.now();
    var duration = 750;
    var startY = mesh.position.y;

    function step(now) {
      var progress = Math.min((now - t0) / duration, 1.0);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      
      if (shackle) {
        shackle.position.y = 0.19 + easeOut * 0.12;
        shackle.rotation.y = easeOut * Math.PI * 0.5;
      }
      
      mesh.position.y = startY + easeOut * 0.45;
      mesh.rotation.y += 0.12;
      
      var pulseScale = (1.0 + Math.sin(progress * Math.PI) * 0.4) * (1 - progress * 0.85);
      mesh.scale.setScalar(Math.max(0.01, pulseScale));

      if (bodyMesh && bodyMesh.material) {
        bodyMesh.material.emissiveIntensity = 0.35 + Math.sin(progress * Math.PI) * 1.8;
      }

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        mesh.visible = false;
        mesh.scale.setScalar(1.0);
        mesh.position.y = startY;
        if (bodyMesh && bodyMesh.material) bodyMesh.material.emissiveIntensity = 0.35;
        if (!is2D && onDone) onDone();
      }
    }
    requestAnimationFrame(step);
  } else if (!is2D && onDone) {
    onDone();
  }
}

function createPawnMesh(colorHex, colorName, tokIdx){
  var ctrl = [
    new THREE.Vector2(0.000, 0.000),  
    new THREE.Vector2(0.228, 0.000),  
    new THREE.Vector2(0.236, 0.016),  
    new THREE.Vector2(0.226, 0.036),  
    new THREE.Vector2(0.208, 0.055),  
    new THREE.Vector2(0.190, 0.085),  
    new THREE.Vector2(0.172, 0.118),  
    new THREE.Vector2(0.156, 0.155),  
    new THREE.Vector2(0.142, 0.192),  
    new THREE.Vector2(0.130, 0.228),  
    new THREE.Vector2(0.115, 0.258),  
    new THREE.Vector2(0.088, 0.284),  
    new THREE.Vector2(0.068, 0.306),  
    new THREE.Vector2(0.065, 0.326),  
    new THREE.Vector2(0.068, 0.342),  
    new THREE.Vector2(0.092, 0.356),  
  ];
  var curve    = new THREE.SplineCurve(ctrl);
  var pts      = curve.getPoints(80);
  var latheGeo = new THREE.LatheGeometry(pts, 64);
  
  var jR = 0.092, jY = 0.356, headR = 0.172;
  var headY = jY + Math.sqrt(Math.max(0, headR*headR - jR*jR));
  var headGeo = new THREE.SphereGeometry(headR, 48, 36);
  headGeo.translate(0, headY, 0);
  
  var pawnMat = new THREE.MeshStandardMaterial({
    color:             colorHex,
    roughness:         0.06,
    metalness:         0.05,
    emissive:          colorHex,
    emissiveIntensity: 0.18
  });
  
  var neckRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.068, 0.010, 10, 48),
    new THREE.MeshStandardMaterial({
      color: 0x111111, roughness: 0.5, metalness: 0.2,
      transparent: true, opacity: 0.55
    })
  );
  neckRing.rotation.x = Math.PI / 2;
  neckRing.position.y = 0.316;
  
  var baseRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.226, 0.010, 10, 48),
    new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.2, metalness: 0.8,
      emissive: 0x4f8cff, emissiveIntensity: 0.2
    })
  );
  baseRim.rotation.x = Math.PI / 2;
  baseRim.position.y = 0.016;
  var group = new THREE.Group();
  group.add(new THREE.Mesh(latheGeo, pawnMat));
  group.add(new THREE.Mesh(headGeo,  pawnMat));
  group.add(neckRing);
  group.add(baseRim);
  group.scale.setScalar(0.88);
  group.userData = { color: colorName, tokIdx: tokIdx };
  tokenGroup.add(group);
  return group;
}
function build3DPawns(){
  PLAYERS.forEach(function(p){
    tokenMeshes[p] = [];
    for(var i=0; i<4; i++){
      var mesh = createPawnMesh(PLAYER_COLORS_HEX[p], p, i);
      tokenMeshes[p].push(mesh);
    }
  });
}
function update3DPawnPositions(){
  var occupancy = {};
  PLAYERS.forEach(function(color){
    gameState.tokens[color].forEach(function(tok, idx){
      if(tok.step >= 0 && tok.step <= 56){
        var key = "";
        if (tok.step <= 50) key = "P" + ((START_OFFSETS[color] + tok.step) % 52);
        else if (tok.step <= 55) key = "H" + color + tok.step;
        else key = "C" + color;
        if(!occupancy[key]) occupancy[key] = [];
        occupancy[key].push({ color: color, idx: idx });
      }
    });
  });
  PLAYERS.forEach(function(color){
    gameState.tokens[color].forEach(function(tok, idx){
      var mesh = tokenMeshes[color][idx];
      if(!mesh) return;
      var isActivePlayer = true;
      if(gameState.activePlayers && gameState.activePlayers.length > 0) {
        isActivePlayer = gameState.activePlayers.indexOf(color) !== -1;
      }
      mesh.visible = isActivePlayer;
      if(!isActivePlayer) return;
      
      if(_animatingMeshes[mesh.uuid]) {
        var isMovable = (!gameState.gameOver && gameState.hasRolled && color === getCurrentPlayer() && isValidMove(color, idx, gameState.diceValue));
        mesh.children.forEach(function(ch){ if(ch.material) ch.material.emissiveIntensity = isMovable ? 0.6 : 0.12; });
        return;
      }
      var stackOx = 0, stackOz = 0, stackOy = 0;
      var pawnScale = 1.0;
      if(tok.step === -1){
        var cs = 0.62;
        var YARD_CENTERS = {
          red:    { x: -cs*4.5, z:  cs*4.5 },
          green:  { x: -cs*4.5, z: -cs*4.5 },
          yellow: { x:  cs*4.5, z: -cs*4.5 },
          blue:   { x:  cs*4.5, z:  cs*4.5 }
        };
        var NEST_OFFSETS = [
          { ox: -cs*1.0, oz: -cs*1.0 },
          { ox:  cs*1.0, oz: -cs*1.0 },
          { ox: -cs*1.0, oz:  cs*1.0 },
          { ox:  cs*1.0, oz:  cs*1.0 }
        ];
        var yc = YARD_CENTERS[color];
        var no = NEST_OFFSETS[idx];
        mesh.position.set(yc.x + no.ox, 0.24, yc.z + no.oz);
      } else {
        var coord;
        if(tok.step >= 0 && tok.step <= 56){
          var key = "";
          if(tok.step <= 50){
            var globalIdx = (START_OFFSETS[color] + tok.step) % 52;
            coord = BOARD_COORDS[globalIdx];
            key = "P" + globalIdx;
          } else if(tok.step <= 55) {
            coord = HOME_PATHS[color][tok.step - 51];
            key = "H" + color + tok.step;
          } else {
            coord = CENTER_COORDS[color];
            key = "C" + color;
          }
          
          var grp = occupancy[key] || [];
          var total = grp.length;
          if (total > 1) {
            var pos = -1;
            grp.forEach(function(g, gi){ if(g.color===color && g.idx===idx) pos=gi; });
            if(pos === -1) pos = 0;
            var isStarTile = false;
            if (tok.step <= 50) {
              var globalIdx = (START_OFFSETS[color] + tok.step) % 52;
              isStarTile = (STAR_TILES.indexOf(globalIdx) !== -1);
            }
            var isSafeTile = isStarTile || (tok.step >= 51);
            if (isSafeTile) {
              if (total === 2) {
                pawnScale = 0.72;
                var spread2 = 0.11;
                var isFirst = (pos === 0);
                stackOx = isFirst ? -spread2 : spread2;
                stackOz = isFirst ? -spread2 : spread2;
                stackOy = pos * 0.012;
              } else if (total === 3) {
                pawnScale = 0.60;
                var spread3 = 0.12;
                var angle3 = (pos / 3) * Math.PI * 2 - (Math.PI / 2);
                stackOx = Math.cos(angle3) * spread3;
                stackOz = Math.sin(angle3) * spread3;
                stackOy = pos * 0.010;
              } else if (total === 4) {
                pawnScale = 0.52;
                var spread4 = 0.12;
                var cornerOffsets4 = [
                  { ox: -spread4, oz: -spread4 },
                  { ox:  spread4, oz: -spread4 },
                  { ox: -spread4, oz:  spread4 },
                  { ox:  spread4, oz:  spread4 }
                ];
                stackOx = cornerOffsets4[pos % 4].ox;
                stackOz = cornerOffsets4[pos % 4].oz;
                stackOy = pos * 0.008;
              } else if (total === 5) {
                pawnScale = 0.46;
                var spread5 = 0.125;
                if (pos === 0) {
                  stackOx = 0;
                  stackOz = 0;
                } else {
                  var cornerOffsets5 = [
                    { ox: -spread5, oz: -spread5 },
                    { ox:  spread5, oz: -spread5 },
                    { ox: -spread5, oz:  spread5 },
                    { ox:  spread5, oz:  spread5 }
                  ];
                  stackOx = cornerOffsets5[(pos - 1) % 4].ox;
                  stackOz = cornerOffsets5[(pos - 1) % 4].oz;
                }
                stackOy = pos * 0.007;
              } else if (total === 6) {
                pawnScale = 0.42;
                var spread6 = 0.13;
                var angle6 = (pos / 6) * Math.PI * 2 - (Math.PI / 2);
                stackOx = Math.cos(angle6) * spread6;
                stackOz = Math.sin(angle6) * spread6;
                stackOy = pos * 0.006;
              } else if (total === 7) {
                pawnScale = 0.38;
                var spread7 = 0.14;
                if (pos === 0) {
                  stackOx = 0;
                  stackOz = 0;
                } else {
                  var angle7 = ((pos - 1) / 6) * Math.PI * 2 - (Math.PI / 2);
                  stackOx = Math.cos(angle7) * spread7;
                  stackOz = Math.sin(angle7) * spread7;
                }
                stackOy = pos * 0.005;
              } else { 
                pawnScale = 0.35;
                var spread8 = 0.145;
                if (pos === 0) {
                  stackOx = 0;
                  stackOz = 0;
                } else {
                  var angle8 = ((pos - 1) / (total - 1)) * Math.PI * 2 - (Math.PI / 2);
                  stackOx = Math.cos(angle8) * spread8;
                  stackOz = Math.sin(angle8) * spread8;
                }
                stackOy = pos * 0.004;
              }
            } else {
              pawnScale = 1.0;
              stackOx = 0;
              stackOz = 0;
              stackOy = 0;
            }
          } else {
            pawnScale = 1.0;
            stackOx = 0;
            stackOz = 0;
            stackOy = 0;
          }
        }
        var world = gridToWorld(coord.r, coord.c);
        mesh.position.set(world.x + stackOx, 0.08 + stackOy, world.z + stackOz);
      }
      
      var isMovable = (!gameState.gameOver && gameState.hasRolled && color === getCurrentPlayer() && isValidMove(color, idx, gameState.diceValue));
      mesh.children.forEach(function(ch){
        if(ch.material) ch.material.emissiveIntensity = isMovable ? 0.6 : 0.05;
      });
      var pulseMultiplier = isMovable ? (1.15 + Math.sin(performance.now() * 0.007) * 0.06) : 1.0;
      var finalScale = pawnScale * pulseMultiplier;
      mesh.scale.set(finalScale, finalScale, finalScale);
    });
  });

  if (typeof _starTileMeshes !== 'undefined') {
    Object.keys(_starTileMeshes).forEach(function(starKey) {
      var starMesh = _starTileMeshes[starKey];
      if (!starMesh) return;
      var hasPawns = occupancy[starKey] && occupancy[starKey].length > 0;
      if (hasPawns) {
        starMesh.position.y = 0.086;
        if (starMesh.material) starMesh.material.emissiveIntensity = 0.55;
      } else {
        starMesh.position.y = 0.082;
        if (starMesh.material) starMesh.material.emissiveIntensity = 0.15;
      }
    });
  }
}

function onPointerDown(e){
  lastInteractTime = performance.now();
  autoSpinBlend = 0;
  if(gameState && gameState.is2DMode) return;
  isDragging = true;
  dragLastX = e.clientX;
  dragLastY = e.clientY;
  boardVelY = 0;
  boardVelX = 0;
}
function onPointerMove(e){
  if(!isDragging || (gameState && gameState.is2DMode)) return;
  var dx = e.clientX - dragLastX;
  var dy = e.clientY - dragLastY;
  if(Math.abs(dx) > 2 || Math.abs(dy) > 2){
    boardVelY = dx * 0.012;
    boardVelX = dy * 0.008;
    boardRotY += boardVelY;
    boardRotX = Math.max(0.2, Math.min(0.85, boardRotX + boardVelX));
    dragLastX = e.clientX;
    dragLastY = e.clientY;
  }
}
function onPointerUp(e){
  isDragging = false;
  
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var allPawnMeshes = [];
  PLAYERS.forEach(function(p){
    tokenMeshes[p].forEach(function(g){ g.children.forEach(function(ch){ allPawnMeshes.push(ch); }); });
  });
  var intersects = raycaster.intersectObjects(allPawnMeshes, true);
  if(intersects.length > 0){
    var rootGroup = intersects[0].object.parent;
    if(rootGroup && rootGroup.userData){
      var col = rootGroup.userData.color;
      var idx = rootGroup.userData.tokIdx;
      if(gameState.hasRolled && col === getCurrentPlayer() && isValidMove(col, idx, gameState.diceValue)){
        executeMove(col, idx);
      }
    }
  }
}
var _lastHalfBoard = -1;
function getScreenCoords(localX, localY, localZ) {
  if (!camera || !boardGroup) return { x: 0, y: 0 };
  var p = new THREE.Vector3(localX, localY, localZ);
  boardGroup.updateMatrixWorld(true);
  p.applyMatrix4(boardGroup.matrixWorld);
  p.project(camera);
  var container = document.getElementById('canvas-container');
  var w = (container && container.clientWidth) || window.innerWidth;
  var h = (container && container.clientHeight) || (window.innerHeight - 50);
  return {
    x: (p.x + 1) * w / 2,
    y: (-p.y + 1) * h / 2 + 50
  };
}
function positionCornerDiceUIs(){
  if (!camera || !gameState || !boardGroup) return;
  var cs = 0.62;
  var cornerX = cs * 7.5; 
  var cornerZ = cs * 7.5; 
  
  var yardCorners = {
    red:    { x: -cornerX, y: 0.17, z:  cornerZ },
    green:  { x: -cornerX, y: 0.17, z: -cornerZ },
    yellow: { x:  cornerX, y: 0.17, z: -cornerZ },
    blue:   { x:  cornerX, y: 0.17, z:  cornerZ }
  };
  var container = document.getElementById('canvas-container');
  var w = (container && container.clientWidth) || window.innerWidth;
  var h = (container && container.clientHeight) || (window.innerHeight - 50);
  var minDim = Math.min(w, h);
  var cardScale = Math.max(0.45, Math.min(0.88, minDim / 750));
  boardGroup.updateMatrixWorld(true);
  PLAYERS.forEach(function(pColor){
    var el = document.getElementById('dice-ui-' + pColor);
    if (!el) return;
    var loc = yardCorners[pColor];
    var worldVec = new THREE.Vector3(loc.x, loc.y, loc.z);
    worldVec.applyMatrix4(boardGroup.matrixWorld);
    worldVec.project(camera);
    var px = (worldVec.x * 0.5 + 0.5) * w;
    var py = (-worldVec.y * 0.5 + 0.5) * h + 50;
    
    var isLeft = px < w / 2;
    var isTop  = py < (h / 2 + 50);
    var transX = isLeft ? '0%' : '-100%';
    var transY = isTop  ? '-100%' : '0%';
    var originX = isLeft ? 'left' : 'right';
    var originY = isTop  ? 'bottom' : 'top';
    el.style.position = 'absolute';
    el.style.top = py + 'px';
    el.style.left = px + 'px';
    el.style.width = 'auto';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.transformOrigin = originX + ' ' + originY;
    el.style.transform = 'translate(' + transX + ', ' + transY + ') scale(' + cardScale + ')';
    el.style.flexDirection = isLeft ? 'row' : 'row-reverse';
    var av = el.querySelector('.avatar-area');
    if (av) {
      av.style.borderRadius = isLeft ? '4px 0 0 4px' : '0 4px 4px 0';
    }
  });
  position2DLockBadges();
}
function updateYardBaseHighlight(now){
  if(!gameState || gameState.gameOver) {
    PLAYERS.forEach(function(color){
      if(_yardOuterRimMeshes[color]) _yardOuterRimMeshes[color].visible = false;
    });
    return;
  }
  
  var activePlayer = getCurrentPlayer();
  var pulse = (Math.sin(now * 0.0055) + 1) / 2;
  var glowOpacity = 0.45 + pulse * 0.50;
  var emissiveInt = 0.8 + pulse * 1.5;

  PLAYERS.forEach(function(color){
    var rimMesh = _yardOuterRimMeshes[color];
    var isActive = (color === activePlayer && gameState.activePlayers && gameState.activePlayers.indexOf(color) !== -1);

    if(isActive){
      if(rimMesh){
        rimMesh.visible = true;
        rimMesh.material.opacity = glowOpacity;
        rimMesh.material.emissiveIntensity = emissiveInt;
      }
    } else {
      if(rimMesh){
        rimMesh.visible = false;
      }
    }
  });
}

function animate(){
  requestAnimationFrame(animate);
  var now = performance.now();
  var dt = 0.016;
  
  zoomCurrent += (zoomTarget - zoomCurrent) * 0.1;
  
  autoSpinBlend = 0;
  if(!isDragging){
    boardVelY *= 0.88;
    boardVelX *= 0.88;
    boardRotY += boardVelY;
    if (gameState && gameState.is2DMode) {
      boardRotX += (Math.PI / 2 - boardRotX) * 0.1;
      var angles2D = { red: 0, green: -Math.PI/2, yellow: Math.PI, blue: Math.PI/2 };
      var target2D = angles2D[(gameState && gameState.humanColor) || 'red'] || 0;
      var diff = target2D - boardRotY;
      while(diff < -Math.PI) diff += Math.PI * 2;
      while(diff > Math.PI) diff -= Math.PI * 2;
      boardRotY += diff * 0.1;
      var container = document.getElementById('canvas-container');
      var w = (container && container.clientWidth) || window.innerWidth;
      var h = (container && container.clientHeight) || (window.innerHeight - 50);
      var asp = camera.aspect;
      
      var vertReserve = Math.max(12, Math.min(48, h * 0.08));
      var boardHeightFit = Math.max(0.35, (h - vertReserve) / h);
      
      var horizReserve = w < 600 ? 0 : 16;
      var boardWidthFit = Math.max(0.35, (w - horizReserve) / w);
      var fitRatio = Math.min(boardHeightFit, boardWidthFit);
      var z = 10.0 / (12.2772 * fitRatio);
      
      zoomTarget = asp < 1 ? z / (asp * 1.06) : z;
    } else {
      boardRotX = Math.max(0.2, Math.min(0.85, boardRotX + boardVelX));
      var container = document.getElementById('canvas-container');
      var w = (container && container.clientWidth) || window.innerWidth;
      var h = (container && container.clientHeight) || (window.innerHeight - 50);
      var asp = camera ? camera.aspect : (w / h);
      if (asp < 1) {
        zoomTarget = Math.max(1.12, 1.25 / asp);
      } else {
        zoomTarget = 1.0;
      }
      if(gameState && gameState.autoPOV && gameState.activePlayers && gameState.activePlayers.length > 0){
        var curPlayer = getCurrentPlayer();
        var angles = { red: 0, green: -Math.PI/2, yellow: Math.PI, blue: Math.PI/2 };
        var target = angles[curPlayer] || 0;
        var diff = target - boardRotY;
        while(diff < -Math.PI) diff += Math.PI * 2;
        while(diff > Math.PI) diff -= Math.PI * 2;
        boardRotY += diff * 0.05;
      }
    }
  }
  
  positionCornerDiceUIs();
  
  var camDist = 16 * zoomCurrent;
  var camY = Math.sin(boardRotX) * camDist;
  var camZ = Math.cos(boardRotX) * camDist;
  
  var targetOffsetZ = (gameState && !gameState.is2DMode && camera && camera.aspect < 1) ? -1.5 : 0;
  camera.position.x = Math.sin(boardRotY) * camZ;
  camera.position.z = Math.cos(boardRotY) * camZ + targetOffsetZ;
  camera.position.y = camY;
  camera.lookAt(0, 0, targetOffsetZ);
  
  if(starParticles){
    starParticles.position.y = (gameState && gameState.is2DMode) ? -15.0 : 0;
    starParticles.rotation.y = now * 0.000015 + boardRotY * 0.03;
    starParticles.rotation.x = Math.sin(now * 0.00001) * 0.02 + boardRotX * 0.02;
    var spinSpeed = Math.abs(boardVelY);
    var targetScale = 1 + Math.min(0.5, spinSpeed * 5);
    starParticles.scale.setScalar(targetScale);
  }
  if (_homeLockMeshes) {
    PLAYERS.forEach(function(color) {
      var mesh = _homeLockMeshes[color];
      if (mesh && mesh.visible) {
        mesh.position.y = 0.08 + Math.sin(now * 0.004) * 0.015;
        mesh.rotation.y = now * 0.0018;
      }
    });
  }
  updateYardBaseHighlight(now);
  update3DPawnPositions();
  renderer.render(scene, camera);
}

var PLAYERS = ['red', 'green', 'yellow', 'blue'];

function getCurrentPlayer(){ return gameState.activePlayers[gameState.currentTurnIdx]; }
function createDiceFaces(cubeEl){
  cubeEl.innerHTML = '';
  var dotPositions = {
    1: [{cx:50, cy:50}],
    2: [{cx:26, cy:26}, {cx:74, cy:74}],
    3: [{cx:26, cy:26}, {cx:50, cy:50}, {cx:74, cy:74}],
    4: [{cx:26, cy:26}, {cx:74, cy:26}, {cx:26, cy:74}, {cx:74, cy:74}],
    5: [{cx:26, cy:26}, {cx:74, cy:26}, {cx:50, cy:50}, {cx:26, cy:74}, {cx:74, cy:74}],
    6: [{cx:26, cy:24}, {cx:74, cy:24}, {cx:26, cy:50}, {cx:74, cy:50}, {cx:26, cy:76}, {cx:74, cy:76}]
  };
  for(var f=1; f<=6; f++){
    var face = document.createElement('div');
    face.className = 'dice-face dice-face-' + f;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'dice-face-svg');
    var dots = dotPositions[f];
    dots.forEach(function(pt){
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pt.cx);
      circle.setAttribute('cy', pt.cy);
      circle.setAttribute('r', '10');
      circle.setAttribute('class', 'dice-pip');
      svg.appendChild(circle);
    });
    face.appendChild(svg);
    cubeEl.appendChild(face);
  }
}
function setDiceFace(cubeEl, val){
  var rotMap = {
    1: 'rotateY(0deg)',
    2: 'rotateY(-90deg)',
    3: 'rotateX(-90deg)',
    4: 'rotateX(90deg)',
    5: 'rotateY(90deg)',
    6: 'rotateY(180deg)'
  };
  var transform = rotMap[val] || 'rotateY(0deg)';
  cubeEl.style.transform = transform;
  
  if (gameState && gameState.activePlayers && gameState.activePlayers.length > 0) {
    var active = getCurrentPlayer();
    var centralEl = document.getElementById('dice-cube-central');
    var cornerEl = document.getElementById('dice-cube-' + active);
    if (centralEl) centralEl.style.transform = transform;
    if (cornerEl) cornerEl.style.transform = transform;
  }
}
function generateSmartRoll(color) {
  var locked = 0, active = 0, home = 0;
  var myActiveTokens = [];
  gameState.tokens[color].forEach(function(tok){
    if(tok.step === -1) locked++;
    else if(tok.step === 56) home++;
    else { active++; myActiveTokens.push(tok); }
  });
  var w = [100, 100, 100, 100, 100, 100]; 
  
  if(locked === 4) {
    w[5] += 150; 
  } else if (locked === 3 && active === 1 && myActiveTokens[0].step < 10) {
    w[5] += 50; 
  }
  
  var maxOpponentHome = 0;
  var leaderColor = null;
  gameState.activePlayers.forEach(function(oppColor){
    if(oppColor !== color) {
      var oppHome = 0;
      gameState.tokens[oppColor].forEach(function(t){ if(t.step === 56) oppHome++; });
      if(oppHome > maxOpponentHome) {
        maxOpponentHome = oppHome;
        leaderColor = oppColor;
      }
    }
  });
  myActiveTokens.forEach(function(tok){
    if(tok.step >= 0 && tok.step <= 50) {
      var myGlobal = (START_OFFSETS[color] + tok.step) % 52;
      
      gameState.activePlayers.forEach(function(oppColor){
        if(oppColor !== color) {
          gameState.tokens[oppColor].forEach(function(oppTok){
            if(oppTok.step >= 0 && oppTok.step <= 50) {
              var oppGlobal = (START_OFFSETS[oppColor] + oppTok.step) % 52;
              var distBehind = (myGlobal - oppGlobal + 52) % 52;
              if (distBehind >= 1 && distBehind <= 5) {
                w[4] += 15; 
                w[5] += 25; 
              }
            }
          });
        }
      });
      
      for(var r = 1; r <= 6; r++) {
        if (tok.step + r <= 50) { 
          var targetGlobal = (myGlobal + r) % 52;
          if(STAR_TILES.indexOf(targetGlobal) === -1) {
            var hasOpponent = false;
            var isLeader = false;
            gameState.activePlayers.forEach(function(oppColor){
              if(oppColor !== color) {
                gameState.tokens[oppColor].forEach(function(oppTok){
                  if(oppTok.step >= 0 && oppTok.step <= 50) {
                    var oppGlobal = (START_OFFSETS[oppColor] + oppTok.step) % 52;
                    if(oppGlobal === targetGlobal) {
                      hasOpponent = true;
                      if (oppColor === leaderColor) isLeader = true;
                    }
                  }
                });
              }
            });
            if(hasOpponent) {
              if (isLeader && home < maxOpponentHome) w[r - 1] += 40; 
              else w[r - 1] += 25; 
            }
          }
        }
      }
    }
  });
  
  myActiveTokens.forEach(function(tok){
    if(tok.step > 50 && tok.step < 56) {
      var needed = 56 - tok.step; 
      if(needed >= 1 && needed <= 6) w[needed - 1] += 30; 
    }
  });
  
  if (maxOpponentHome - home >= 2) { 
    w[4] += 15; 
    w[5] += 20; 
  } else if (home > maxOpponentHome && home >= 2) {
    w[5] = Math.max(20, w[5] - 30); 
  }
  
  if (gameState.rollHistory && gameState.rollHistory[color]) {
    var history = gameState.rollHistory[color];
    if (history.length >= 3) {
      for(var v = 1; v <= 6; v++) {
        var count = 0;
        for(var hi = 0; hi < history.length; hi++) {
          if (history[hi] === v) count++;
        }
        if (count >= 3) w[v - 1] = Math.max(10, w[v - 1] - 60);
        if (count >= 4) w[v - 1] = 5; 
      }
    }
  }
  var total = w.reduce(function(a,b){ return a+b; }, 0);
  var rand = Math.random() * total;
  var sum = 0;
  for(var i=0; i<6; i++) {
    sum += w[i];
    if(rand <= sum) return i + 1;
  }
  return 6;
}
function getSpeedDelay(baseMs){
  var mult = window.gameSpeedMultiplier || 1;
  return Math.max(15, Math.round(baseMs / mult));
}
function rollDice(){
  if(gameState.hasRolled || gameState.isMoving || gameState.gameOver || gameState.isRolling) return;
  var active = getCurrentPlayer();
  if (gameState.winners && gameState.winners.indexOf(active) !== -1) {
    passTurn();
    return;
  }
  var restartBtn = document.getElementById('btn-game-restart');
  if (restartBtn) {
    restartBtn.disabled = false;
    restartBtn.style.opacity = '1';
    restartBtn.style.pointerEvents = 'auto';
  }
  var cubeId = (gameState && gameState.is2DMode) ? 'dice-cube-' + active : 'dice-cube-central';
  var cubeEl = document.getElementById(cubeId);
  if(!cubeEl || cubeEl.classList.contains('dice-rolling')) return;
  gameState.isRolling = true; 
  updateTurnDisplay();
  AudioEngine.diceRoll();
  cubeEl.classList.add('dice-rolling');
  var val = generateSmartRoll(active);
  gameState.diceValue = val;
  if(gameState.rollHistory && gameState.rollHistory[active]) {
    gameState.rollHistory[active].push(val);
    if(gameState.rollHistory[active].length > 6) gameState.rollHistory[active].shift();
  }
  setTimeout(function(){
    cubeEl.classList.remove('dice-rolling');
    setDiceFace(cubeEl, val);
    gameState.hasRolled = true;
    gameState.isRolling = false; 
    updateTurnDisplay();
    if(val === 6){
      if(gameState.mode === 'ai' && active !== gameState.humanColor){
        recordComputerStat('computerSixes', 1);
      }
      gameState.consecutiveSixes++;
      if(gameState.consecutiveSixes >= 3){
        updateStatus("Three 6s! Turn forfeited ⚠️");
        gameState.consecutiveSixes = 0;
        setTimeout(passTurn, getSpeedDelay(1000));
        return;
      }
    } else {
      gameState.consecutiveSixes = 0;
    }
    processTurnAfterRoll();
  }, getSpeedDelay(600));
}
function isValidMove(color, tokIdx, roll){
  var tok = gameState.tokens[color][tokIdx];
  if(tok.step === -1) return roll === 6;
  var targetStep = tok.step + roll;
  if(targetStep > 56) return false;
  if(targetStep >= 51 && gameState && gameState.ruleType === 'quick' && (!gameState.hasKilled || !gameState.hasKilled[color])){
    return false;
  }
  return true;
}
function getValidMoveCount(color, roll){
  var count = 0;
  gameState.tokens[color].forEach(function(tok, idx){
    if(isValidMove(color, idx, roll)) count++;
  });
  return count;
}
function getFirstValidTokenIndex(color, roll){
  for(var i=0; i<4; i++){
    if(isValidMove(color, i, roll)) return i;
  }
  return -1;
}
function processTurnAfterRoll(){
  var player = getCurrentPlayer();
  var validMoves = getValidMoveCount(player, gameState.diceValue);
  var isAI = (gameState.mode === 'ai' && player !== gameState.humanColor) || gameState.autoPlayAll;
  if(validMoves === 0){
    updateStatus("No valid moves for " + capitalize(player) + ".");
    setTimeout(passTurn, getSpeedDelay(850));
  } else if(validMoves === 1){
    var singleIdx = getFirstValidTokenIndex(player, gameState.diceValue);
    setTimeout(function(){ executeMove(player, singleIdx); }, getSpeedDelay(400));
  } else {
    if(isAI){
      setTimeout(function(){ executeAIMove(player, gameState.diceValue); }, getSpeedDelay(500));
    } else {
      updateStatus(capitalize(player) + " rolled a " + gameState.diceValue + "! Tap a glowing 3D pawn.");
    }
  }
}

var _animatingMeshes = {};

function walkPieceHome(vm, color, tokIdx, currentStep, onDone){
  var cs = 0.62;
  var YARD_CENTERS = {
    red:    { x:-cs*4.5, z: cs*4.5 },
    green:  { x:-cs*4.5, z:-cs*4.5 },
    yellow: { x: cs*4.5, z:-cs*4.5 },
    blue:   { x: cs*4.5, z: cs*4.5 }
  };
  var NEST_OFFSETS = [
    {ox:-cs*1.0, oz:-cs*1.0}, {ox:cs*1.0, oz:-cs*1.0},
    {ox:-cs*1.0, oz: cs*1.0}, {ox:cs*1.0, oz: cs*1.0}
  ];
  
  var pts = [{ x: vm.position.x, y: vm.position.y, z: vm.position.z }];
  for(var s = currentStep; s >= 0; s--){
    var w = getWorldForStep(color, s);
    pts.push({ x: w.x, y: w.y, z: w.z });
  }
  
  var yc = YARD_CENTERS[color];
  var no = NEST_OFFSETS[tokIdx];
  pts.push({ x: yc.x + no.ox, y: 0.24, z: yc.z + no.oz });
  
  var totalMs = Math.min(pts.length * 70, 2400);
  
  vm.children.forEach(function(ch){
    if(ch.material) ch.material.emissiveIntensity = 0.9;
  });
  
  var spinId = { active: true };
  (function spin(){
    if(!spinId.active) return;
    vm.rotation.y += 0.12;
    requestAnimationFrame(spin);
  })();
  
  var audioTicks = pts.map(function(pt, idx){
    return {
      atT: idx / Math.max(1, pts.length - 1),
      fn: function(){
        AudioEngine.step(idx + 1);
      }
    };
  });
  animatePieceAlongPath(pts, vm, totalMs, 0.12, audioTicks, function(){
    spinId.active = false;
    vm.rotation.y = 0;
    vm.children.forEach(function(ch){
      if(ch.material) ch.material.emissiveIntensity = 0.05;
    });
    if(onDone) onDone();
  });
}
function getWorldForStep(color, step){
  if(step === -1){
    var cs = 0.62;
    var YC = { red:{x:-cs*4.5,z:cs*4.5}, green:{x:-cs*4.5,z:-cs*4.5},
               yellow:{x:cs*4.5,z:-cs*4.5}, blue:{x:cs*4.5,z:cs*4.5} };
    return { x: YC[color].x, y: 0.24, z: YC[color].z };
  }
  var coord;
  if(step >= 0 && step <= 50){
    var gi = (START_OFFSETS[color] + step) % 52;
    coord = BOARD_COORDS[gi];
  } else if(step >= 51 && step <= 55){
    coord = HOME_PATHS[color][step - 51];
  } else {
    coord = CENTER_COORDS[color];
  }
  var w = gridToWorld(coord.r, coord.c);
  return { x: w.x, y: 0.08, z: w.z };
}

function animatePieceAlongPath(pts, mesh, totalMs, arcH, audioTicks, onDone){
  if(!mesh || pts.length < 2){ if(onDone) onDone(); return; }
  
  var v3pts = pts.map(function(p){ return new THREE.Vector3(p.x, p.y, p.z); });
  var curve  = new THREE.CatmullRomCurve3(v3pts, false, 'catmullrom', 0.5);
  var uid    = mesh.uuid;
  _animatingMeshes[uid] = true;
  var t0     = performance.now();
  var fired  = new Array(audioTicks.length).fill(false);
  function frame(now){
    var raw = Math.min((now - t0) / totalMs, 1);
    var t = -(Math.cos(Math.PI * raw) - 1) / 2;
    var pt = curve.getPoint(t);
    mesh.position.x = pt.x;
    mesh.position.z = pt.z;
    mesh.position.y = pt.y + arcH * Math.sin(Math.PI * raw);
    
    audioTicks.forEach(function(tk, i){
      if(!fired[i] && raw >= tk.atT){ fired[i] = true; tk.fn(); }
    });
    if(raw < 1){
      requestAnimationFrame(frame);
    } else {
      var last = pts[pts.length - 1];
      mesh.position.set(last.x, last.y, last.z);
      delete _animatingMeshes[uid];
      if(onDone) onDone();
    }
  }
  requestAnimationFrame(frame);
}

function getStepCoord(color, step){
  if(step >= 0 && step <= 50){
    var gi = (START_OFFSETS[color] + step) % 52;
    return BOARD_COORDS[gi];
  } else if(step >= 51 && step <= 55){
    return HOME_PATHS[color][step - 51];
  } else if(step === 56){
    return CENTER_COORDS[color];
  }
  return null;
}
function trigger3DTileBounce(coord, colorHex, isFinal) {
  if (!coord) return;
  var key = coord.r + '_' + coord.c;
  var tileMesh = _tileMeshMap[key];
  if (!tileMesh) return;
  
  if (!tileMesh.userData.isClonedMat) {
    tileMesh.material = tileMesh.material.clone();
    tileMesh.userData.isClonedMat = true;
  }
  var mat = tileMesh.material;
  var origEmissive = mat.emissive ? mat.emissive.getHex() : 0x000000;
  var origEmissiveInt = mat.emissiveIntensity !== undefined ? mat.emissiveIntensity : 0;
  var origColorHex = mat.color ? mat.color.getHex() : 0xffffff;

  var isLight = document.body.classList.contains('theme-light');
  var colObj = new THREE.Color(colorHex);
  var origColObj = new THREE.Color(origColorHex);

  if (isLight) {
    if (mat.color) mat.color.setHex(colorHex);
    if (mat.emissive) {
      mat.emissive.setHex(colorHex);
      mat.emissiveIntensity = 0.20;
    }
  } else {
    if (mat.emissive) {
      mat.emissive.setHex(colorHex);
      mat.emissiveIntensity = isFinal ? 0.90 : 0.65;
    }
  }

  var origY = tileMesh.position.y || 0.04;
  var dipY = isFinal ? 0.022 : 0.015; 
  var t0 = performance.now();
  var duration = isFinal ? 400 : 260;

  function animTile(now) {
    var progress = Math.min((now - t0) / duration, 1.0);
    var sinBounce = Math.sin(Math.PI * progress);
    tileMesh.position.y = origY - dipY * sinBounce;

    var alpha = (1.0 - progress);
    if (isLight) {
      if (mat.color) mat.color.copy(colObj).lerp(origColObj, progress);
      if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = origEmissiveInt + 0.20 * alpha;
    } else {
      if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = origEmissiveInt + (isFinal ? 0.90 : 0.65) * alpha;
    }

    if (progress < 1.0) {
      requestAnimationFrame(animTile);
    } else {
      tileMesh.position.y = origY;
      if (mat.emissive) {
        mat.emissive.setHex(origEmissive);
        mat.emissiveIntensity = origEmissiveInt;
      }
      if (mat.color) {
        mat.color.setHex(origColorHex);
      }
    }
  }
  requestAnimationFrame(animTile);
}
function executeMove(color, tokIdx){
  if(gameState.isMoving) return;
  gameState.isMoving = true;
  updateTurnDisplay();
  var tok  = gameState.tokens[color][tokIdx];
  var roll = gameState.diceValue;
  var mesh = tokenMeshes[color][tokIdx];
  
  if(tok.step === -1 && roll === 6){
    tok.step = 0;
    AudioEngine.step(1);
    if(mesh){
      var startPos = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
      var endPos   = getWorldForStep(color, 0);
      var stepCoord = getStepCoord(color, 0);
      var colorHex  = PLAYER_COLORS_HEX[color] || 0xffffff;
      var highlightTile = function(){
        trigger3DTileBounce(stepCoord, colorHex, true);
      };
      animatePieceTo(mesh, endPos.x, endPos.y, endPos.z, 520, 0.9, highlightTile, function(){
        gameState.isMoving = false;
        postMoveCheck(color, tokIdx, true);
      });
    } else {
      trigger3DTileBounce(getStepCoord(color, 0), PLAYER_COLORS_HEX[color] || 0xffffff, true);
      gameState.isMoving = false;
      postMoveCheck(color, tokIdx, true);
    }
    return;
  }
  
  var stepsLeft = roll;
  var currentStepDur = Math.max(15, Math.round(260 / (window.gameSpeedMultiplier || 1))); 
  var HOP_H     = 0.20;
  function doNextStep(){
    if(stepsLeft <= 0){
      gameState.isMoving = false;
      postMoveCheck(color, tokIdx, false);
      return;
    }
    tok.step++;
    stepsLeft--;
    AudioEngine.step(tok.step);
    var dest = getWorldForStep(color, tok.step);
    var isFinal = (stepsLeft === 0);
    var stepCoord = getStepCoord(color, tok.step);
    var colorHex  = PLAYER_COLORS_HEX[color] || 0xffffff;

    var highlightTile = function(){
      trigger3DTileBounce(stepCoord, colorHex, isFinal);
    };

    if(mesh){
      var hop = isFinal ? HOP_H * 2.0 : HOP_H;
      animatePieceTo(mesh, dest.x, dest.y, dest.z, currentStepDur, hop, highlightTile, doNextStep);
    } else {
      highlightTile();
      setTimeout(doNextStep, currentStepDur);
    }
  }
  doNextStep();
}

function animatePieceTo(mesh, tx, ty, tz, duration, hopH, tileHighlightFn, onDone){
  if(typeof tileHighlightFn === 'function' && !onDone){
    onDone = tileHighlightFn;
    tileHighlightFn = null;
  }
  var sx = mesh.position.x, sy = mesh.position.y, sz = mesh.position.z;
  var sRotY = mesh.rotation.y;
  var t0  = performance.now();
  var uid = mesh.uuid;
  _animatingMeshes[uid] = true;
  var style = window.pawnAnimStyle || 'bounce';
  var tileFired = false;

  if(style === 'teleport'){
    duration = Math.max(duration, Math.round(380 / (window.gameSpeedMultiplier || 1)));
  }

  if(AudioEngine && AudioEngine.playStyleSound){
    AudioEngine.playStyleSound(style);
  }

  function frame(now){
    var t = Math.min((now - t0) / duration, 1);
    var sinArc = Math.sin(Math.PI * t);
    var cx = sx, cy = sy, cz = sz;

    var touchdownTime = (style === 'teleport') ? 0.65 : 0.78;
    if(tileHighlightFn && !tileFired && t >= touchdownTime){
      tileFired = true;
      tileHighlightFn();
    }

    if(style === 'teleport'){
      if(t < 0.38){
        var u = t / 0.38;
        var fade = 1 - (u * u * (3 - 2 * u));
        cx = sx; cz = sz;
        cy = sy + u * 0.6;
        var scaleXZ = Math.max(0.01, fade * 0.9);
        var scaleY  = fade * 2.4 + 0.1;
        mesh.scale.set(scaleXZ, scaleY, scaleXZ);
        mesh.rotation.y = sRotY + u * Math.PI * 4;
      } else if(t < 0.52){
        cx = tx; cz = tz; cy = ty + 3.2;
        mesh.scale.set(0.001, 0.001, 0.001);
      } else {
        var u = (t - 0.52) / 0.48;
        var cubicOut = 1 - Math.pow(1 - u, 3);
        cx = tx; cz = tz;
        cy = ty + (1 - cubicOut) * 3.2;
        var landingDamp = u > 0.82 ? Math.sin((u - 0.82) / 0.18 * Math.PI) * 0.15 : 0;
        var scaleXZ = Math.min(1.15, u * 1.0 + landingDamp);
        var scaleY  = Math.max(0.3, (1 - u) * 2.2 + 1.0 - landingDamp * 0.6);
        mesh.scale.set(scaleXZ, scaleY, scaleXZ);
        mesh.rotation.y = sRotY + (1 - u) * Math.PI * 4;
      }
    } else if(style === 'surf'){
      var e = t * t * (3 - 2 * t);
      cx = sx + (tx - sx) * e + Math.sin(t * Math.PI * 2) * 0.28;
      cz = sz + (tz - sz) * e;
      cy = sy + (ty - sy) * e + 0.05;
      mesh.rotation.z = Math.sin(t * Math.PI * 2) * 0.35;
      mesh.scale.set(1.2, 0.8, 1.2);
    } else if(style === 'meteor'){
      var e = t < 0.5 ? Math.pow(t / 0.5, 2) * 0.5 : 0.5 + (1 - Math.pow(1 - (t - 0.5) / 0.5, 3)) * 0.5;
      cx = sx + (tx - sx) * e;
      cz = sz + (tz - sz) * e;
      cy = sy + (ty - sy) * e + (hopH * 5.0) * sinArc;
    } else if(style === 'tornado'){
      var e = t < 0.25 ? (t / 0.25) * 0.35 : (t < 0.75 ? 0.35 + ((t - 0.25) / 0.5) * 0.30 : 0.65 + ((t - 0.75) / 0.25) * 0.35);
      cx = sx + (tx - sx) * e;
      cz = sz + (tz - sz) * e;
      cy = sy + (ty - sy) * e + (hopH * 2.0) * sinArc;
      mesh.rotation.y = sRotY + t * Math.PI * 4;
      mesh.rotation.z = Math.sin(t * Math.PI * 2) * 0.45;
      mesh.scale.set(1.0 + sinArc * 0.25, 1.0 - sinArc * 0.15, 1.0 + sinArc * 0.25);
    } else {
      var e = 1 - Math.pow(1 - t, 3);
      cx = sx + (tx - sx) * e;
      cz = sz + (tz - sz) * e;
      cy = sy + (ty - sy) * e + hopH * sinArc;
      mesh.rotation.y = sRotY + t * Math.PI * 2;
      var stretch = sinArc * 0.22;
      mesh.scale.set(1.0 - stretch * 0.2, 1.0 + stretch * 0.35, 1.0 - stretch * 0.2);
    }

    mesh.position.set(cx, cy, cz);

    if(t < 1){
      requestAnimationFrame(frame);
    } else {
      if(tileHighlightFn && !tileFired){
        tileFired = true;
        tileHighlightFn();
      }
      mesh.position.set(tx, ty, tz);
      mesh.rotation.y = sRotY;
      mesh.rotation.z = 0;
      mesh.scale.set(1.0, 1.0, 1.0);
      delete _animatingMeshes[uid];
      if(onDone) onDone();
    }
  }
  requestAnimationFrame(frame);
}
function postMoveCheck(color, tokIdx, wasSpawn){
  var tok = gameState.tokens[color][tokIdx];
  var extraRoll = (gameState.diceValue === 6);
  if(tok.step === 56){
    AudioEngine.enterHome();
    extraRoll = true;
    updateStatus("Pawn reached HOME! 🎉 Bonus Roll!");
    if(gameState.mode === 'ai' && color !== gameState.humanColor){
      recordComputerStat('computerPawnsHome', 1);
    }
  }
  if(tok.step >= 0 && tok.step <= 50){
    var myGlobalIdx = (START_OFFSETS[color] + tok.step) % 52;
    var isSafe = (STAR_TILES.indexOf(myGlobalIdx) !== -1);
    if(!isSafe){
      gameState.activePlayers.forEach(function(oppColor){
        if(oppColor !== color){
          gameState.tokens[oppColor].forEach(function(oppTok, oppIdx){
            if(oppTok.step >= 0 && oppTok.step <= 50){
              var oppGlobalIdx = (START_OFFSETS[oppColor] + oppTok.step) % 52;
              if(oppGlobalIdx === myGlobalIdx){
                AudioEngine.capture();
                extraRoll = true;
                if(!gameState.hasKilled) gameState.hasKilled = {};
                var wasFirstKill = !gameState.hasKilled[color];
                gameState.hasKilled[color] = true;
                var isQuickMode = (gameState && gameState.ruleType === 'quick');
                if(isQuickMode && wasFirstKill){
                  updateStatus("🔓 " + capitalize(color) + " captured a pawn & UNLOCKED the Home Stretch!");
                  animateUnlockPadlock(color);
                } else {
                  updateStatus("Captured " + capitalize(oppColor) + "! Bonus roll awarded ⚔️");
                }
                updateTurnDisplay();
                if(gameState.mode === 'ai' && color !== gameState.humanColor){
                  recordComputerStat('computerCaptures', 1);
                }
                
                (function(oColor, oIdx, oTok){
                  var vm = tokenMeshes[oColor][oIdx];
                  var currentStp = oTok.step;
                  oTok.step = -1; 
                  if(!vm) return;
                  walkPieceHome(vm, oColor, oIdx, currentStp, function(){
                    update3DPawnPositions();
                  });
                })(oppColor, oppIdx, oppTok);
              }
            }
          });
        }
      });
    }
  }
  if(checkPlayerWin(color)){
    if(gameState.winners.indexOf(color) === -1){
      gameState.winners.push(color);
      triggerGrandVictoryCelebration(color);

      if(gameState.ruleType === 'quick'){
        gameState.tokens[color].forEach(function(tok, tokIdx){
          if(tok.step !== 56){
            tok.step = 56;
            var mesh = tokenMeshes[color] ? tokenMeshes[color][tokIdx] : null;
            if(mesh){
              var endPos = getWorldForStep(color, 56);
              var angle = (tokIdx / 4) * Math.PI * 2;
              var ox = Math.cos(angle) * 0.14;
              var oz = Math.sin(angle) * 0.14;
              animatePieceTo(mesh, endPos.x + ox, endPos.y, endPos.z + oz, 420, 0.6, function(){
                trigger3DTileBounce(getStepCoord(color, 56), PLAYER_COLORS_HEX[color] || 0xffffff, true);
              });
            }
          }
        });
      }
    }
    updateStatus("🏆 " + capitalize(color) + " HAS COMPLETED ALL PAWNS!");
    
    if(gameState.mode === 'ai' && color === gameState.humanColor && !gameState.autoPlayAll){
      var rankIdx = gameState.winners.indexOf(gameState.humanColor);
      var rankNum = rankIdx + 1;
      var rankSuffix = (rankNum === 1 ? '1st' : (rankNum === 2 ? '2nd' : (rankNum === 3 ? '3rd' : rankNum + 'th')));
      var rankEmoji = (rankNum === 1 ? '👑' : (rankNum === 2 ? '🥈' : '🥉'));
      var mTitle = document.getElementById('human-finish-modal-title');
      var mSub = document.getElementById('human-finish-modal-sub');
      if(mTitle) mTitle.textContent = 'You Finished ' + rankSuffix + ' Place! ' + rankEmoji;
      var pawnDesc = (gameState.ruleType === 'quick') ? 'Your pawn has' : 'All 4 of your pawns have';
      if(mSub) mSub.textContent = pawnDesc + ' reached home (' + rankSuffix + ' Place)! Would you like to end the game now and see final results, or watch the computer finish?';
      setEndMatchButtonVisible(false);
      var promptModal = document.getElementById('human-finished-modal');
      if(promptModal) promptModal.classList.remove('hidden');
    }
    if(gameState.winners.length >= gameState.activePlayers.length - 1){
      var remainingLast = gameState.activePlayers.filter(function(p){
        return gameState.winners.indexOf(p) === -1;
      });
      remainingLast.forEach(function(lastP){
        if(gameState.winners.indexOf(lastP) === -1){
          gameState.winners.push(lastP);
        }
      });
      endMatch();
      return;
    }
    
    passTurn();
    return;
  }
  if(extraRoll && !gameState.gameOver){
    gameState.hasRolled = false;
    updateTurnDisplay();
    updateStatus(capitalize(color) + " gets a Bonus Roll! 🎲");
    var isAI = (gameState.mode === 'ai' && color !== gameState.humanColor) || gameState.autoPlayAll;
    if(isAI){
      setTimeout(rollDice, getSpeedDelay(600));
    }
  } else if(!gameState.gameOver) {
    passTurn();
  }
}
function checkPlayerWin(color){
  var needed = gameState.ruleType === 'quick' ? 1 : 4;
  var homeCount = 0;
  gameState.tokens[color].forEach(function(t){ if(t.step === 56) homeCount++; });
  return homeCount >= needed;
}
function passTurn(){
  gameState.hasRolled = false;
  gameState.isMoving = false;
  do {
    gameState.currentTurnIdx = (gameState.currentTurnIdx + 1) % gameState.activePlayers.length;
  } while(gameState.winners.indexOf(getCurrentPlayer()) !== -1 && !gameState.gameOver);
  updateTurnDisplay();
  var nextPlayer = getCurrentPlayer();
  var isAI = (gameState.mode === 'ai' && nextPlayer !== gameState.humanColor) || gameState.autoPlayAll;
  if(isAI && !gameState.gameOver){
    setTimeout(rollDice, getSpeedDelay(600));
  }
}

function executeAIMove(color, roll){
  var validTokens = [];
  gameState.tokens[color].forEach(function(tok, idx){
    if(isValidMove(color, idx, roll)) validTokens.push(idx);
  });
  if(validTokens.length === 0){ passTurn(); return; }
  var bestIdx = validTokens[0], bestScore = -999;
  validTokens.forEach(function(idx){
    var tok = gameState.tokens[color][idx];
    var score = 0;
    
    if(tok.step >= 0 && tok.step + roll <= 50){
      var targetGlobal = (START_OFFSETS[color] + tok.step + roll) % 52;
      if(STAR_TILES.indexOf(targetGlobal) === -1){
        gameState.activePlayers.forEach(function(oppColor){
          if(oppColor !== color){
            gameState.tokens[oppColor].forEach(function(oppTok){
              if(oppTok.step >= 0 && oppTok.step <= 50){
                var oppGlobal = (START_OFFSETS[oppColor] + oppTok.step) % 52;
                if(oppGlobal === targetGlobal) score += 100;
              }
            });
          }
        });
      }
    }
    if(tok.step + roll === 56) score += 60;
    if(tok.step === -1 && roll === 6) score += 40;
    if(tok.step >= 0) score += tok.step * 0.5;
    if(score > bestScore){ bestScore = score; bestIdx = idx; }
  });
  executeMove(color, bestIdx);
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.add('hidden'); });
  var target = document.getElementById(id);
  if(target) target.classList.remove('hidden');
}
var _statusTimeout = null;
function updateStatus(text){
  var bar = document.getElementById('game-status-bar');
  var msg = document.getElementById('status-text');
  if(msg) msg.textContent = text;
  if(bar) {
    bar.classList.add('show-toast');
    clearTimeout(_statusTimeout);
    _statusTimeout = setTimeout(function(){
      bar.classList.remove('show-toast');
    }, 2500);
  }
}
function capitalize(str){
  if(gameState && gameState.playerNames && gameState.playerNames[str]) {
    return gameState.playerNames[str];
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getActiveColors() {
  if (gameState.mode === 'pass') {
    var selected = gameState.localSelectedColors || ['red', 'green'];
    if (selected.length < gameState.playerCount) {
      var all = ['red', 'green', 'yellow', 'blue'];
      for(var i=0; i<4 && selected.length < gameState.playerCount; i++){
        if(selected.indexOf(all[i]) === -1) selected.push(all[i]);
      }
    } else if (selected.length > gameState.playerCount) {
      selected = selected.slice(0, gameState.playerCount);
    }
    return selected;
  }
  var selected = gameState.humanColor || 'red';
  var others = ['red', 'green', 'yellow', 'blue'].filter(function(c){ return c !== selected; });
  if(gameState.playerCount === 2){
    var opp = {'red':'yellow', 'yellow':'red', 'green':'blue', 'blue':'green'}[selected];
    return [selected, opp];
  } else if(gameState.playerCount === 3){
    return [selected, others[0], others[1]];
  } else {
    return ['red', 'green', 'yellow', 'blue'];
  }
}
function updateNameLabels() {
  if (gameState.mode === 'pass') {
    var is4P = gameState.playerCount === 4;
    var is2P = gameState.playerCount === 2;
    var pList = document.getElementById('players-list-container');
    var cbTeam1 = document.getElementById('cb-team-1');
    var cbTeam2 = document.getElementById('cb-team-2');
    if (is2P) {
      if(pList) {
        pList.style.display = 'grid';
        pList.style.gridTemplateColumns = 'auto 1fr';
        pList.style.gridTemplateAreas = '"cb1 red" "cb1 yellow" "cb2 green" "cb2 blue"';
      }
      if(cbTeam1) { cbTeam1.style.display = 'flex'; cbTeam1.style.gridArea = 'cb1'; }
      if(cbTeam2) { cbTeam2.style.display = 'flex'; cbTeam2.style.gridArea = 'cb2'; }
      document.getElementById('group-red').style.gridArea = 'red';
      document.getElementById('group-yellow').style.gridArea = 'yellow';
      document.getElementById('group-green').style.gridArea = 'green';
      document.getElementById('group-blue').style.gridArea = 'blue';
      var isRY = gameState.localSelectedColors.indexOf('red') !== -1;
      if (isRY) {
        document.getElementById('span-cb-ry').classList.add('checked');
        document.getElementById('span-cb-gb').classList.remove('checked');
      } else {
        document.getElementById('span-cb-ry').classList.remove('checked');
        document.getElementById('span-cb-gb').classList.add('checked');
      }
    } else {
      if(pList) {
        pList.style.display = 'flex';
        pList.style.gridTemplateAreas = 'none';
        pList.appendChild(document.getElementById('group-red'));
        pList.appendChild(document.getElementById('group-green'));
        pList.appendChild(document.getElementById('group-yellow'));
        pList.appendChild(document.getElementById('group-blue'));
      }
      if(cbTeam1) cbTeam1.style.display = 'none';
      if(cbTeam2) cbTeam2.style.display = 'none';
    }
    var colors = ['red', 'green', 'yellow', 'blue'];
    colors.forEach(function(c){
      var group = document.getElementById('group-' + c);
      if(group) {
        var box = group.querySelector('.color-checkbox');
        if(box) box.style.display = (is4P || is2P) ? 'none' : 'flex';
        var isActive = gameState.localSelectedColors.indexOf(c) !== -1;
        if(isActive){
          group.classList.remove('disabled');
          box.classList.add('checked');
        } else {
          group.classList.add('disabled');
          box.classList.remove('checked');
        }
      }
    });
  }
}
function updateTurnDisplay(){
  updateLockVisuals();
  var active = getCurrentPlayer();
  var colorGlowMap = {
    red: '0 0 22px rgba(239, 68, 68, 0.95), 0 0 45px rgba(239, 68, 68, 0.45)',
    green: '0 0 22px rgba(16, 185, 129, 0.95), 0 0 45px rgba(16, 185, 129, 0.45)',
    yellow: '0 0 22px rgba(245, 158, 11, 0.95), 0 0 45px rgba(245, 158, 11, 0.45)',
    blue: '0 0 22px rgba(59, 130, 246, 0.95), 0 0 45px rgba(59, 130, 246, 0.45)'
  };
  var centralUi = document.getElementById('central-dice-ui');
  var avatarArea = document.getElementById('central-avatar-area');
  var pinPath = document.getElementById('central-pin-path');
  
  if (gameState && gameState.is2DMode) {
    if(centralUi) centralUi.style.display = 'none';
    positionCornerDiceUIs();
    
    ['red', 'green', 'yellow', 'blue'].forEach(function(color) {
      var ui = document.getElementById('dice-ui-' + color);
      if (ui) {
        if (gameState.activePlayers.indexOf(color) !== -1) {
          ui.style.display = 'flex';
          var av = ui.querySelector('.avatar-area');
          if (av) av.style.background = isLightTheme() ? '#ffffff' : '#0f172a';
          if (color === active) {
            ui.classList.add('active');
            ui.style.opacity = '1';
            ui.style.borderColor = 'var(--' + color + ')';
            ui.style.boxShadow = colorGlowMap[color] || '0 0 20px var(--' + color + ')';
          } else {
            ui.classList.remove('active');
            ui.style.opacity = '1';
            ui.style.borderColor = isLightTheme() ? '#cbd5e1' : '#334155';
            ui.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
          }
        } else {
          ui.style.display = 'none';
        }
      }
    });
  } else {
    if(centralUi) {
      centralUi.style.display = 'flex';
      centralUi.style.borderColor = 'var(--' + active + ')';
      centralUi.style.boxShadow = colorGlowMap[active] || '0 0 20px var(--' + active + ')';
      if(avatarArea) avatarArea.style.background = isLightTheme() ? '#ffffff' : '#0f172a';
      if(pinPath) pinPath.setAttribute('fill', 'var(--' + active + ')');
    }
    ['red', 'green', 'yellow', 'blue'].forEach(function(color) {
      var ui = document.getElementById('dice-ui-' + color);
      if (ui) ui.style.display = 'none';
    });
  }
  var isTurnToRoll = (gameState && !gameState.gameOver && !gameState.hasRolled && !gameState.isRolling && !gameState.isMoving);
  ['red', 'green', 'yellow', 'blue'].forEach(function(color) {
    var badge = document.getElementById('arrow-badge-' + color);
    if(badge){
      if(color === active && isTurnToRoll && gameState.is2DMode) {
        badge.classList.add('show-arrow');
      } else {
        badge.classList.remove('show-arrow');
      }
    }
  });
  var centralBadge = document.getElementById('arrow-badge-central');
  if(centralBadge){
    if(!gameState.is2DMode && isTurnToRoll) {
      centralBadge.classList.add('show-arrow');
    } else {
      centralBadge.classList.remove('show-arrow');
    }
  }

  var hudType = document.getElementById('hud-match-type');
  if(hudType && gameState.playerNames && gameState.playerNames[active]) {
    var pName = gameState.playerNames[active];
    if(pName.toLowerCase() === 'you') {
      hudType.textContent = "Your Turn";
    } else {
      hudType.textContent = pName + "'s Turn";
    }
    hudType.style.color = 'var(--' + active + ')';
  }
}
function startMatch(){
  stopVictoryBoardSpotlight();
  gameState.winners = [];
  gameState.gameOver = false;
  gameState.hasKilled = { red: false, green: false, yellow: false, blue: false };
  gameState.currentTurnIdx = 0;
  gameState.hasRolled = false;
  gameState.consecutiveSixes = 0;
  gameState.rollHistory = { red: [], green: [], yellow: [], blue: [] };
  function setEndMatchButtonVisible(visible) {
    var endTopBtn = document.getElementById('btn-end-match-now');
    var menuEndBtn = document.getElementById('btn-menu-end-now');
    if (endTopBtn) {
      endTopBtn.style.setProperty('display', visible ? 'inline-flex' : 'none', 'important');
    }
    if (menuEndBtn) {
      menuEndBtn.style.setProperty('display', visible ? 'flex' : 'none', 'important');
    }
  }
  window.setEndMatchButtonVisible = setEndMatchButtonVisible;
  setEndMatchButtonVisible(false);
  var promptModal = document.getElementById('human-finished-modal');
  if(promptModal) promptModal.classList.add('hidden');
  var restartBtn = document.getElementById('btn-game-restart');
  if (restartBtn) {
    restartBtn.disabled = true;
    restartBtn.style.opacity = '0.3';
    restartBtn.style.pointerEvents = 'none';
  }
  if (!gameState.humanColor) gameState.humanColor = 'red';
  gameState.activePlayers = getActiveColors();
  
  var humanIdx = gameState.activePlayers.indexOf(gameState.humanColor);
  if (humanIdx !== -1) {
    gameState.currentTurnIdx = humanIdx;
  } else {
    gameState.currentTurnIdx = 0;
  }
  
  var startAngles = { red: 0, green: -Math.PI/2, yellow: Math.PI, blue: Math.PI/2 };
  boardRotY = startAngles[gameState.humanColor] || 0;
  boardRotX = gameState.is2DMode ? (Math.PI / 2) : 0.55;
  _lastHalfBoard = -1;
  PLAYERS.forEach(function(p){
    gameState.tokens[p] = [{step:-1},{step:-1},{step:-1},{step:-1}];
  });
  gameState.playerNames = {};
  gameState.activePlayers.forEach(function(color, idx){
    var name = capitalize(color);
    if (gameState.mode === 'pass') {
      var val = document.getElementById('name-' + color).value.trim();
      if (val) name = val;
    } else {
      if (color === gameState.humanColor) {
        name = "You";
      } else {
        name = "Computer " + capitalize(color);
      }
    }
    gameState.playerNames[color] = name;
  });
  var centralCube = document.getElementById('dice-cube-central');
  if(centralCube) { createDiceFaces(centralCube); setDiceFace(centralCube, 1); }
  ['red', 'green', 'yellow', 'blue'].forEach(function(color) {
    var cube = document.getElementById('dice-cube-' + color);
    if(cube) { createDiceFaces(cube); setDiceFace(cube, 1); }
  });
  document.getElementById('hud-match-type').textContent = gameState.playerCount + 'P ' + (gameState.mode === 'ai' ? 'Vs Computer ' : '') + capitalize(gameState.ruleType);
  showScreen('game-screen');
  
  if(!renderer){
    init3D();
  } else {
    onResize();
  }
  update3DPawnPositions();
  updateTurnDisplay();
}
function endMatch(){
  gameState.gameOver = true;
  stopVictoryBoardSpotlight();
  setEndMatchButtonVisible(false);
  var promptModal = document.getElementById('human-finished-modal');
  if(promptModal) promptModal.classList.add('hidden');
  var modal = document.getElementById('win-modal');
  var card = modal ? modal.querySelector('.modal-card') : null;
  if(card && !card.querySelector('.victory-sunburst')){
    var sb = document.createElement('div');
    sb.className = 'victory-sunburst';
    card.insertBefore(sb, card.firstChild);
  }
  var podium = document.getElementById('podium-list');
  podium.innerHTML = '';
  
  var remaining = gameState.activePlayers.filter(function(p){
    return gameState.winners.indexOf(p) === -1;
  });
  remaining.sort(function(a, b){
    var sumA = gameState.tokens[a].reduce(function(acc, t){ return acc + (t.step === -1 ? 0 : t.step); }, 0);
    var sumB = gameState.tokens[b].reduce(function(acc, t){ return acc + (t.step === -1 ? 0 : t.step); }, 0);
    return sumB - sumA;
  });
  var finalOrder = gameState.winners.concat(remaining);
  finalOrder.forEach(function(w, idx){
    if (idx >= gameState.activePlayers.length) return; 
    var row = document.createElement('div');
    var isActualWinner = (gameState.winners.indexOf(w) !== -1);
    var rankClass = (idx === 0 ? ' first' : (idx === 1 ? ' second' : (idx === 2 ? ' third' : ' fourth')));
    row.className = 'podium-item' + rankClass;
    var rankLabel;
    if (isActualWinner) {
      rankLabel = (idx === 0 ? '🏆 1st Place' : (idx === 1 ? '🥈 2nd Place' : (idx === 2 ? '🥉 3rd Place' : '🏅 4th Place')));
    } else {
      var pts = gameState.tokens[w].reduce(function(acc, t){ return acc + (t.step === -1 ? 0 : t.step); }, 0);
      rankLabel = '🏃 Runner Up (' + pts + ' pts)';
    }
    var pName = (gameState.playerNames && gameState.playerNames[w]) ? gameState.playerNames[w] : capitalize(w);
    row.innerHTML = '<span>#' + (idx+1) + ' ' + pName + '</span><span>' + rankLabel + '</span>';
    podium.appendChild(row);
  });
  
  if(gameState.mode === 'ai'){
    var s = getComputerStats();
    s.matchesPlayed = (s.matchesPlayed || 0) + 1;
    var champ = finalOrder[0];
    if(champ && champ !== gameState.humanColor){
      s.computerWins = (s.computerWins || 0) + 1;
    } else {
      s.humanWins = (s.humanWins || 0) + 1;
    }
    saveComputerStats(s);
  }
  modal.classList.remove('hidden');
}

function getComputerStats(){
  try {
    var raw = localStorage.getItem('ludoking_ai_stats');
    if(raw) {
      var p = JSON.parse(raw);
      return {
        matchesPlayed: p.matchesPlayed || 0,
        humanWins: p.humanWins || 0,
        computerWins: p.computerWins || p.botWins || 0,
        computerCaptures: p.computerCaptures || p.botCaptures || 0,
        computerPawnsHome: p.computerPawnsHome || p.botPawnsHome || 0,
        computerSixes: p.computerSixes || p.botSixes || 0
      };
    }
  } catch(e){}
  return { matchesPlayed: 0, humanWins: 0, computerWins: 0, computerCaptures: 0, computerPawnsHome: 0, computerSixes: 0 };
}
function saveComputerStats(stats){
  try {
    localStorage.setItem('ludoking_ai_stats', JSON.stringify(stats));
  } catch(e){}
}
function recordComputerStat(key, amount){
  if(gameState.mode !== 'ai') return;
  var s = getComputerStats();
  s[key] = (s[key] || 0) + (amount || 1);
  saveComputerStats(s);
}
function updateComputerStatsDisplay(){
  var s = getComputerStats();
  var totalRecorded = (s.matchesPlayed || 0) + (s.computerCaptures || 0) + (s.computerPawnsHome || 0);
  var matchesEl = document.getElementById('stat-matches');
  if(matchesEl) matchesEl.textContent = s.matchesPlayed || 0;
  var winrateEl = document.getElementById('stat-winrate');
  if(winrateEl){
    var rate = s.matchesPlayed > 0 ? Math.round((s.computerWins / s.matchesPlayed) * 100) : 0;
    winrateEl.textContent = rate + '%';
  }
  var winsEl = document.getElementById('stat-bot-wins');
  if(winsEl) winsEl.textContent = s.computerWins || 0;
  var capsEl = document.getElementById('stat-bot-captures');
  if(capsEl) capsEl.textContent = s.computerCaptures || 0;
  var homeEl = document.getElementById('stat-bot-home');
  if(homeEl) homeEl.textContent = s.computerPawnsHome || 0;
  var sixesEl = document.getElementById('stat-bot-sixes');
  if(sixesEl) sixesEl.textContent = s.computerSixes || 0;
  var resetBtn = document.getElementById('btn-reset-stats');
  if(resetBtn){
    if(totalRecorded === 0){
      resetBtn.disabled = true;
      resetBtn.style.opacity = '0.4';
      resetBtn.style.pointerEvents = 'none';
      resetBtn.textContent = 'No Statistics to Reset';
    } else {
      resetBtn.disabled = false;
      resetBtn.style.opacity = '1';
      resetBtn.style.pointerEvents = '';
      resetBtn.textContent = 'Reset Statistics';
    }
  }
}

var _victoryDanceActive = false;
function triggerGrandVictoryCelebration(winnerColor){
  if(AudioEngine && AudioEngine.playVictoryFanfare){
    AudioEngine.playVictoryFanfare();
  } else if(AudioEngine) {
    AudioEngine.win();
  }
  
  if(typeof confetti === 'function'){
    var themeColors = {
      red:    ['#ef4444', '#fbbf24', '#ffffff', '#dc2626', '#ffd700'],
      green:  ['#10b981', '#fbbf24', '#ffffff', '#059669', '#ffd700'],
      yellow: ['#fbbf24', '#f59e0b', '#ffffff', '#d97706', '#ffe066'],
      blue:   ['#3b82f6', '#fbbf24', '#ffffff', '#2563eb', '#ffd700']
    };
    var colors = themeColors[winnerColor] || themeColors.yellow;
    
    confetti({
      particleCount: 90, angle: 60, spread: 75, origin: { x: 0, y: 0.75 }, colors: colors
    });
    confetti({
      particleCount: 90, angle: 120, spread: 75, origin: { x: 1, y: 0.75 }, colors: colors
    });
    
    setTimeout(function(){
      confetti({
        particleCount: 130, spread: 100, origin: { y: 0.45 },
        shapes: ['star', 'circle'], colors: colors, scalar: 1.2
      });
    }, 300);
    
    setTimeout(function(){
      confetti({
        particleCount: 100, angle: 90, spread: 120, startVelocity: 60,
        origin: { x: 0.5, y: 0.8 }, colors: colors
      });
    }, 600);
    
    var end = Date.now() + 2400;
    var interval = setInterval(function() {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 35, spread: 360, ticks: 60, zIndex: 120,
        particleCount: 25, origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: colors
      });
    }, 200);
  }
  
  animate3DVictoryDance(winnerColor);
}
function animate3DVictoryDance(color){
  if(!tokenMeshes || !tokenMeshes[color]) return;
  _victoryDanceActive = true;
  var startTime = performance.now();
  
  function danceFrame(now){
    if(!_victoryDanceActive || now - startTime > 8000) {
      stopVictoryBoardSpotlight();
      return;
    }
    var elapsed = (now - startTime) / 1000;
    tokenMeshes[color].forEach(function(mesh, i){
      if(mesh){
        var bounce = Math.abs(Math.sin(elapsed * 6 + i * 0.8)) * 0.45;
        mesh.position.y = 0.08 + bounce;
        mesh.rotation.y += 0.08;
      }
    });
    requestAnimationFrame(danceFrame);
  }
  requestAnimationFrame(danceFrame);
}
function stopVictoryBoardSpotlight(){
  _victoryDanceActive = false;
  if(scene){
    var spot = scene.getObjectByName("victorySpotlight");
    if(spot){
      if(spot.target) scene.remove(spot.target);
      scene.remove(spot);
    }
  }
  if(typeof PLAYERS !== 'undefined' && typeof tokenMeshes !== 'undefined'){
    PLAYERS.forEach(function(p){
      if(tokenMeshes[p]){
        tokenMeshes[p].forEach(function(m){
          if(m && typeof _animatingMeshes !== 'undefined' && !_animatingMeshes[m.uuid]) {
            m.position.y = 0.08;
            m.rotation.y = 0;
          }
        });
      }
    });
  }
}
function animatePawnsToHome(color, onDone) {
  var tokens = gameState.tokens[color];
  if (!tokens) { if (onDone) onDone(); return; }
  var countToMove = (gameState && gameState.ruleType === 'quick') ? 1 : 4;
  var completed = 0;
  for (var idx = 0; idx < countToMove; idx++) {
    (function(i) {
      var tok = tokens[i];
      tok.step = 56;
      var mesh = tokenMeshes[color][i];
      if (mesh) {
        setTimeout(function() {
          var endPos = getWorldForStep(color, 56);
          var angle = (i / 4) * Math.PI * 2;
          var ox = Math.cos(angle) * 0.14;
          var oz = Math.sin(angle) * 0.14;
          AudioEngine.enterHome();
          trigger3DTileBounce(getStepCoord(color, 56), PLAYER_COLORS_HEX[color] || 0xffffff, true);
          animatePieceTo(mesh, endPos.x + ox, endPos.y, endPos.z + oz, 480, 0.7, function() {
            completed++;
            if (completed >= countToMove && onDone) onDone();
          });
        }, i * 120);
      } else {
        completed++;
        if (completed >= countToMove && onDone) onDone();
      }
    })(idx);
  }
}
function updatePOVUI() {
  var povBtn = document.getElementById('btn-game-pov');
  var povIconSpan = document.getElementById('pov-icon-span');
  var povTextSpan = document.getElementById('pov-btn-text');
  var povChip = document.getElementById('toggle-pov-chip');
  if(povBtn) {
    povBtn.style.display = (gameState && gameState.is2DMode) ? 'none' : 'flex';
    povBtn.style.opacity = (gameState && gameState.autoPOV) ? '1' : '0.6';
  }
  if(povTextSpan) povTextSpan.textContent = (gameState && gameState.autoPOV) ? 'Auto POV: ON' : 'Auto POV: OFF';
  if(povIconSpan) {
    povIconSpan.innerHTML = (gameState && gameState.autoPOV) 
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
  }
  if (povChip) {
    povChip.style.display = (gameState && gameState.is2DMode) ? 'none' : 'flex';
    var toggleSwitch = povChip.querySelector('.toggle-switch');
    var statusText = povChip.querySelector('.toggle-status-text');
    if (toggleSwitch) {
      if (gameState.autoPOV) toggleSwitch.classList.add('active'); else toggleSwitch.classList.remove('active');
    }
    if (statusText) statusText.textContent = (gameState && gameState.autoPOV) ? 'ON' : 'OFF';
  }
}
function updateViewModeUI() {
  var btnText = document.getElementById('2d-btn-text');
  var btnIcon = document.getElementById('2d-icon-span');
  if (btnText) btnText.textContent = (gameState && gameState.is2DMode) ? 'Switch to 3D View' : 'Switch to 2D View';
  if (btnIcon) {
    btnIcon.innerHTML = (gameState && gameState.is2DMode)
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
  }
  updatePOVUI();
}
function hasAnyTokenMoved(){
  if(!gameState || !gameState.tokens) return false;
  var moved = false;
  PLAYERS.forEach(function(p){
    if(gameState.tokens[p]){
      gameState.tokens[p].forEach(function(t){
        if(t.step > -1) moved = true;
      });
    }
  });
  return moved;
}
function toggle2D3DView(force) {
  if (!force && gameState && !gameState.gameOver && hasAnyTokenMoved()) {
    var drop = document.getElementById('hamburger-dropdown');
    if (drop) drop.classList.add('hidden');
    window.pendingStatsReset = false;
    window.pendingModeSwitch = true;
    var titleEl = document.getElementById('restart-modal-title');
    var subEl   = document.getElementById('restart-modal-sub');
    if (titleEl) titleEl.textContent = 'Switch Mode?';
    if (subEl)   subEl.textContent = 'Switching mode will restart the match. Are you sure?';
    var modal = document.getElementById('restart-modal');
    if (modal) modal.classList.remove('hidden');
    return;
  }
  gameState.is2DMode = !gameState.is2DMode;
  try {
    localStorage.setItem('ludo_view_mode', gameState.is2DMode ? '2d' : '3d');
  } catch(e) {}
  
  boardRotX = gameState.is2DMode ? (Math.PI / 2) : 0.55;
  updateViewModeUI();
  updateTurnDisplay();
  updateStatus(gameState.is2DMode ? "Switched to 2D Top-Down View 📐" : "Switched to 3D Perspective View 🎲");
}

function bindEvents(){
  document.getElementById('btn-hamburger').addEventListener('click', function(e){
    e.stopPropagation();
    document.getElementById('hamburger-dropdown').classList.toggle('hidden');
  });
  window.addEventListener('click', function(e){
    var drop = document.getElementById('hamburger-dropdown');
    var btn = document.getElementById('btn-hamburger');
    if(drop && !drop.classList.contains('hidden')){
      if(!drop.contains(e.target) && !btn.contains(e.target)){
        drop.classList.add('hidden');
      }
    }
  });
  var btnMenuRules = document.getElementById('btn-menu-rules');
  if(btnMenuRules){ btnMenuRules.addEventListener('click', function(){ showScreen('rules-screen'); }); }
  document.getElementById('btn-menu-settings').addEventListener('click', function(){ showScreen('settings-screen'); });
  var btnMenuStats = document.getElementById('btn-menu-stats');
  if(btnMenuStats){
    btnMenuStats.addEventListener('click', function(){
      updateComputerStatsDisplay();
      showScreen('stats-screen');
    });
  }
  var btnStatsBack = document.getElementById('btn-stats-back');
  if(btnStatsBack){
    btnStatsBack.addEventListener('click', function(){
      showScreen('main-menu');
    });
  }
  var btnResetStats = document.getElementById('btn-reset-stats');
  if(btnResetStats){
    btnResetStats.addEventListener('click', function(){
      var s = getComputerStats();
      var totalRecorded = (s.matchesPlayed || 0) + (s.computerCaptures || 0) + (s.computerPawnsHome || 0);
      if(totalRecorded === 0){
        updateStatus("No statistics recorded yet to reset!");
        return;
      }
      window.pendingStatsReset = true;
      var titleEl = document.getElementById('restart-modal-title');
      var subEl   = document.getElementById('restart-modal-sub');
      if(titleEl) titleEl.textContent = "Reset Statistics?";
      if(subEl) subEl.textContent = "Are you sure you want to permanently clear all career statistics and match history? This action cannot be undone.";
      document.getElementById('restart-modal').classList.remove('hidden');
    });
  }
  document.getElementById('btn-mode-back').addEventListener('click', function(){
    var configPanel = document.getElementById('config-panel');
    var oppSection = document.getElementById('opponent-section');
    if (!configPanel.classList.contains('hidden')) {
      configPanel.classList.add('hidden');
      oppSection.classList.remove('hidden');
    } else {
      showScreen('main-menu');
    }
  });
  var btnRulesBack = document.getElementById('btn-rules-back');
  if(btnRulesBack){ btnRulesBack.addEventListener('click', function(){ showScreen('main-menu'); }); }
  document.getElementById('btn-settings-back').addEventListener('click', function(){ showScreen('main-menu'); });
  document.getElementById('btn-game-menu').addEventListener('click', function(){
    document.getElementById('hamburger-dropdown').classList.add('hidden');
    if(!gameState.gameOver) {
      document.getElementById('confirm-modal').classList.remove('hidden');
    } else {
      showScreen('main-menu');
    }
  });
  document.getElementById('btn-confirm-quit').addEventListener('click', function(){
    document.getElementById('confirm-modal').classList.add('hidden');
    showScreen('main-menu');
  });
  document.getElementById('btn-cancel-quit').addEventListener('click', function(){
    document.getElementById('confirm-modal').classList.add('hidden');
  });
  var btnRestart = document.getElementById('btn-game-restart');
  if(btnRestart){
    btnRestart.addEventListener('click', function(){
      document.getElementById('hamburger-dropdown').classList.add('hidden');
      window.pendingStatsReset = false;
      window.pendingModeSwitch = false;
      var titleEl = document.getElementById('restart-modal-title');
      var subEl   = document.getElementById('restart-modal-sub');
      if(titleEl) titleEl.textContent = 'Restart Match?';
      if(subEl) subEl.textContent = 'Are you sure you want to completely restart the current match? All current turn progress will be reset.';
      document.getElementById('restart-modal').classList.remove('hidden');
    });
  }
  var confirmRestartBtn = document.getElementById('btn-confirm-restart');
  if(confirmRestartBtn){
    confirmRestartBtn.addEventListener('click', function(){
      document.getElementById('restart-modal').classList.add('hidden');
      if (window.pendingStatsReset) {
        window.pendingStatsReset = false;
        saveComputerStats({ matchesPlayed: 0, humanWins: 0, computerWins: 0, computerCaptures: 0, computerPawnsHome: 0, computerSixes: 0 });
        updateComputerStatsDisplay();
        updateStatus("Statistics reset successfully.");
        return;
      }
      if (window.pendingModeSwitch) {
        window.pendingModeSwitch = false;
        toggle2D3DView(true);
      }
      startMatch();
    });
  }
  var cancelRestartBtn = document.getElementById('btn-cancel-restart');
  if(cancelRestartBtn){
    cancelRestartBtn.addEventListener('click', function(){
      window.pendingModeSwitch = false;
      window.pendingStatsReset = false;
      document.getElementById('restart-modal').classList.add('hidden');
    });
  }
  var openDevBtn = document.getElementById('btn-open-dev-tools');
  if(openDevBtn){
    openDevBtn.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.remove('hidden');
    });
  }
  var closeDevBtn = document.getElementById('btn-close-dev-test');
  if(closeDevBtn){
    closeDevBtn.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
    });
  }
  var test1stAction = document.getElementById('btn-test-action-1st');
  if(test1stAction){
    test1stAction.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
      var humanCol = (gameState && gameState.humanColor) || 'red';
      if(!gameState.hasKilled) gameState.hasKilled = { red: false, green: false, yellow: false, blue: false };
      gameState.hasKilled[humanCol] = true;
      updateLockVisuals();
      gameState.winners = [humanCol];
      animatePawnsToHome(humanCol, function(){
        var titleEl = document.getElementById('human-finish-modal-title');
        var subEl   = document.getElementById('human-finish-modal-sub');
        if(titleEl) titleEl.textContent = 'You Finished 1st Place! 👑';
        var pawnStr = (gameState && gameState.ruleType === 'quick') ? 'Your pawn has' : 'All 4 of your pawns have';
        if(subEl) subEl.textContent = pawnStr + ' reached home (1st Place)! Would you like to end the game now and see final results, or watch the computer finish?';
        triggerGrandVictoryCelebration(humanCol);
        document.getElementById('human-finished-modal').classList.remove('hidden');
      });
    });
  }
  var test2ndAction = document.getElementById('btn-test-action-2nd');
  if(test2ndAction){
    test2ndAction.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
      var humanCol = (gameState && gameState.humanColor) || 'red';
      var oppCol   = PLAYERS.find(function(p){ return p !== humanCol; }) || 'green';
      gameState.winners = [oppCol, humanCol];
      animatePawnsToHome(oppCol, function(){
        animatePawnsToHome(humanCol, function(){
          var titleEl = document.getElementById('human-finish-modal-title');
          var subEl   = document.getElementById('human-finish-modal-sub');
          if(titleEl) titleEl.textContent = 'You Finished 2nd Place! 🥈';
          var pawnStr2 = (gameState && gameState.ruleType === 'quick') ? 'Your pawn has' : 'All 4 of your pawns have';
          if(subEl) subEl.textContent = pawnStr2 + ' reached home (2nd Place)! Would you like to end the game now and see final results, or watch the computer finish?';
          triggerGrandVictoryCelebration(humanCol);
          document.getElementById('human-finished-modal').classList.remove('hidden');
        });
      });
    });
  }
  var test3rdAction = document.getElementById('btn-test-action-3rd');
  if(test3rdAction){
    test3rdAction.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
      var humanCol = (gameState && gameState.humanColor) || 'red';
      var otherCols = PLAYERS.filter(function(p){ return p !== humanCol; });
      var opp1 = otherCols[0] || 'green';
      var opp2 = otherCols[1] || 'yellow';
      gameState.winners = [opp1, opp2, humanCol];
      animatePawnsToHome(opp1, function(){
        animatePawnsToHome(opp2, function(){
          animatePawnsToHome(humanCol, function(){
            var titleEl = document.getElementById('human-finish-modal-title');
            var subEl   = document.getElementById('human-finish-modal-sub');
            if(titleEl) titleEl.textContent = 'You Finished 3rd Place! 🥉';
            var pawnStr3 = (gameState && gameState.ruleType === 'quick') ? 'Your pawn has' : 'All 4 of your pawns have';
            if(subEl) subEl.textContent = pawnStr3 + ' reached home (3rd Place)! Would you like to end the game now and see final results, or watch the computer finish?';
            triggerGrandVictoryCelebration(humanCol);
            document.getElementById('human-finished-modal').classList.remove('hidden');
          });
        });
      });
    });
  }
  var testPodiumAction = document.getElementById('btn-test-action-podium');
  if(testPodiumAction){
    testPodiumAction.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
      var humanCol = (gameState && gameState.humanColor) || 'red';
      var otherCols = PLAYERS.filter(function(p){ return p !== humanCol; });
      gameState.winners = [humanCol].concat(otherCols);
      PLAYERS.forEach(function(p){
        gameState.tokens[p] = [{step:56},{step:56},{step:56},{step:56}];
      });
      update3DPawnPositions();
      endMatch();
    });
  }
  var testConfettiAction = document.getElementById('btn-test-action-confetti');
  if(testConfettiAction){
    testConfettiAction.addEventListener('click', function(){
      var humanCol = (gameState && gameState.humanColor) || 'red';
      triggerGrandVictoryCelebration(humanCol);
    });
  }

  function testPieceStacking(count){
    var devModal = document.getElementById('dev-test-modal');
    if(devModal) devModal.classList.add('hidden');

    ['splash', 'num-players-modal', 'color-select-modal', 'human-finished-modal', 'match-results-modal'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.classList.add('hidden');
    });
    var gameScreen = document.getElementById('game-screen');
    if(gameScreen) gameScreen.classList.remove('hidden');

    if(!gameState) return;
    gameState.activePlayers = ['red', 'green', 'yellow', 'blue'];
    gameState.gameOver = false;
    gameState.hasRolled = false;

    PLAYERS.forEach(function(p){
      gameState.tokens[p] = [{step:-1},{step:-1},{step:-1},{step:-1}];
    });

    var stackPool = [
      { color: 'red', idx: 0, step: 8 },
      { color: 'green', idx: 0, step: 47 },
      { color: 'yellow', idx: 0, step: 34 },
      { color: 'blue', idx: 0, step: 21 },
      { color: 'red', idx: 1, step: 8 },
      { color: 'green', idx: 1, step: 47 },
      { color: 'yellow', idx: 1, step: 34 },
      { color: 'blue', idx: 1, step: 21 }
    ];

    for(var i = 0; i < count && i < stackPool.length; i++){
      var pObj = stackPool[i];
      gameState.tokens[pObj.color][pObj.idx].step = pObj.step;
    }

    update3DPawnPositions();
    updateStatus("♟️ Stacking test: Displaying " + count + " pieces stacked on Star Safe Tile (Global #8)! Toggle 2D/3D to inspect.");
  }

  var btnStack5 = document.getElementById('btn-test-stack-5');
  if(btnStack5){
    btnStack5.addEventListener('click', function(){ testPieceStacking(5); });
  }
  var btnStack6 = document.getElementById('btn-test-stack-6');
  if(btnStack6){
    btnStack6.addEventListener('click', function(){ testPieceStacking(6); });
  }
  var btnStack7 = document.getElementById('btn-test-stack-7');
  if(btnStack7){
    btnStack7.addEventListener('click', function(){ testPieceStacking(7); });
  }
  var stackCycleCount = 5;
  var btnStackCycle = document.getElementById('btn-test-stack-cycle');
  if(btnStackCycle){
    btnStackCycle.addEventListener('click', function(){
      testPieceStacking(stackCycleCount);
      stackCycleCount = (stackCycleCount === 5) ? 6 : (stackCycleCount === 6 ? 7 : 5);
    });
  }
  function toggleAutoPlay(forceState){
    if(typeof forceState === 'boolean'){
      gameState.autoPlayAll = forceState;
    } else {
      gameState.autoPlayAll = !gameState.autoPlayAll;
    }
    var state = gameState.autoPlayAll;
    var modalBtn = document.getElementById('btn-test-autoplay-modal');
    var hdrBtn = document.getElementById('btn-autoplay-toggle');
    var label = document.getElementById('autoplay-label');

    if(modalBtn){
      modalBtn.textContent = state ? '🤖 Auto-Play: ON (Hands-Free Active)' : '🤖 Toggle Auto-Play (Hands-Free All Turns)';
      modalBtn.style.background = state ? 'linear-gradient(135deg, #f59e0b, #b45309)' : 'linear-gradient(135deg, #10b981, #059669)';
    }
    if(hdrBtn){
      if(state) hdrBtn.classList.add('active');
      else hdrBtn.classList.remove('active');
    }
    if(label){
      label.textContent = state ? 'Auto-Play ON' : 'Auto-Play OFF';
    }
    updateStatus(state ? "🤖 Hands-Free Auto-Play ENABLED! AI plays all turns automatically." : "👤 Auto-Play DISABLED. Manual player control restored.");

    if(state && !gameState.gameOver && !gameState.isMoving){
      var player = getCurrentPlayer();
      if(!gameState.hasRolled){
        setTimeout(rollDice, getSpeedDelay(300));
      } else {
        processTurnAfterRoll();
      }
    }
  }

  var btnAutoPlayHdr = document.getElementById('btn-autoplay-toggle');
  if(btnAutoPlayHdr){
    btnAutoPlayHdr.addEventListener('click', function(){ toggleAutoPlay(); });
  }
  var btnAutoPlayModal = document.getElementById('btn-test-autoplay-modal');
  if(btnAutoPlayModal){
    btnAutoPlayModal.addEventListener('click', function(){
      document.getElementById('dev-test-modal').classList.add('hidden');
      toggleAutoPlay();
    });
  }

  var animStyleList = [
    { id: 'bounce', label: 'Arcade Hop', desc: '🏀 Style 1: Classic Arcade Hop & Flip' },
    { id: 'teleport', label: 'Flash Step', desc: '⚡ Style 2: Flash Step' },
    { id: 'surf', label: 'Wave Slide', desc: '🌊 Style 3: Hydro Wave Slide' },
    { id: 'meteor', label: 'Meteor Slam', desc: '💥 Style 4: Space Meteor Ground Slam' },
    { id: 'tornado', label: 'Tornado', desc: '🌪️ Style 5: Tornado Vortex' }
  ];

  function setPawnAnimStyle(styleName, desc, labelText){
    window.pawnAnimStyle = styleName;
    var devModal = document.getElementById('dev-test-modal');
    if(devModal) devModal.classList.add('hidden');
    var labelEl = document.getElementById('anim-style-label');
    if(labelEl && labelText) labelEl.textContent = labelText;
    updateStatus("Movement Style set to: " + labelText);
  }

  var btnHdrStyle = document.getElementById('btn-style-hdr-toggle');
  if(btnHdrStyle){
    btnHdrStyle.addEventListener('click', function(){
      var current = window.pawnAnimStyle || 'bounce';
      var idx = 0;
      for(var i=0; i<animStyleList.length; i++){
        if(animStyleList[i].id === current) { idx = (i + 1) % animStyleList.length; break; }
      }
      var nextObj = animStyleList[idx];
      setPawnAnimStyle(nextObj.id, nextObj.desc, nextObj.label);
    });
  }

  var btnAnimBounce = document.getElementById('btn-anim-bounce');
  if(btnAnimBounce){
    btnAnimBounce.addEventListener('click', function(){ setPawnAnimStyle('bounce', '🏀 Style 1: Classic Arcade Hop & Flip', 'Arcade Hop'); });
  }
  var btnAnimTeleport = document.getElementById('btn-anim-teleport');
  if(btnAnimTeleport){
    btnAnimTeleport.addEventListener('click', function(){ setPawnAnimStyle('teleport', '⚡ Style 2: Flash Step', 'Flash Step'); });
  }
  var btnAnimSurf = document.getElementById('btn-anim-surf');
  if(btnAnimSurf){
    btnAnimSurf.addEventListener('click', function(){ setPawnAnimStyle('surf', '🌊 Style 3: Hydro Wave Slide', 'Wave Slide'); });
  }
  var btnAnimMeteor = document.getElementById('btn-anim-meteor');
  if(btnAnimMeteor){
    btnAnimMeteor.addEventListener('click', function(){ setPawnAnimStyle('meteor', '💥 Style 4: Space Meteor Ground Slam', 'Meteor Slam'); });
  }
  var btnAnimTornado = document.getElementById('btn-anim-tornado');
  if(btnAnimTornado){
    btnAnimTornado.addEventListener('click', function(){ setPawnAnimStyle('tornado', '🌪️ Style 5: Tornado Vortex', 'Tornado'); });
  }

  var speedBtn = document.getElementById('btn-speed-toggle');
  var speedLabel = document.getElementById('speed-label');
  if(speedBtn){
    speedBtn.addEventListener('click', function(){
      var currentSpeed = window.gameSpeedMultiplier || 1;
      var nextSpeed = 1;
      var labelText = '1x Speed';
      var bgStyle = 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)';
      var borderCol = '#60a5fa';
      var borderBtm = '3.5px solid #1e40af';

      if(currentSpeed === 1){
        nextSpeed = 2;
        labelText = '2x Speed';
        bgStyle = 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)';
        borderCol = '#fbbf24';
        borderBtm = '3.5px solid #78350f';
      } else if(currentSpeed === 2){
        nextSpeed = 3;
        labelText = '3x Speed';
        bgStyle = 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)';
        borderCol = '#fca5a5';
        borderBtm = '3.5px solid #7f1d1d';
      } else if(currentSpeed === 3){
        nextSpeed = 5;
        labelText = '5x Speed ⚡';
        bgStyle = 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)';
        borderCol = '#c084fc';
        borderBtm = '3.5px solid #4c1d95';
      } else if(currentSpeed === 5){
        nextSpeed = 10;
        labelText = '10x Speed 🚀';
        bgStyle = 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)';
        borderCol = '#f472b6';
        borderBtm = '3.5px solid #831843';
      } else if(currentSpeed === 10){
        nextSpeed = 20;
        labelText = '20x MAX ⚡';
        bgStyle = 'linear-gradient(180deg, #06b6d4 0%, #0e7490 100%)';
        borderCol = '#67e8f9';
        borderBtm = '3.5px solid #155e75';
      } else {
        nextSpeed = 1;
        labelText = '1x Speed';
        bgStyle = 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)';
        borderCol = '#60a5fa';
        borderBtm = '3.5px solid #1e40af';
      }

      window.gameSpeedMultiplier = nextSpeed;
      if(speedLabel) speedLabel.textContent = labelText;
      speedBtn.style.setProperty('background', bgStyle, 'important');
      speedBtn.style.setProperty('color', '#ffffff', 'important');
      speedBtn.style.setProperty('border-color', borderCol, 'important');
      speedBtn.style.setProperty('border-bottom', borderBtm, 'important');
      updateStatus("Game Speed set to " + window.gameSpeedMultiplier + "x ⚡");
    });
  }
  var finishEndBtn = document.getElementById('btn-human-finish-end');
  if(finishEndBtn){
    finishEndBtn.addEventListener('click', function(){
      stopVictoryBoardSpotlight();
      document.getElementById('human-finished-modal').classList.add('hidden');
      endMatch();
    });
  }
  var finishWatchBtn = document.getElementById('btn-human-finish-watch');
  if(finishWatchBtn){
    finishWatchBtn.addEventListener('click', function(){
      stopVictoryBoardSpotlight();
      document.getElementById('human-finished-modal').classList.add('hidden');
      if (gameState && gameState.mode === 'ai') {
        setEndMatchButtonVisible(true);
        updateStatus("Watching Computer finish... Tap 'End Match' anytime.");
      } else {
        setEndMatchButtonVisible(false);
      }
    });
  }
  var endNowBtn = document.getElementById('btn-end-match-now');
  if(endNowBtn){
    endNowBtn.addEventListener('click', function(){
      stopVictoryBoardSpotlight();
      document.getElementById('human-finished-modal').classList.add('hidden');
      endMatch();
    });
  }
  var menuEndNowBtn = document.getElementById('btn-menu-end-now');
  if(menuEndNowBtn){
    menuEndNowBtn.addEventListener('click', function(){
      stopVictoryBoardSpotlight();
      document.getElementById('hamburger-dropdown').classList.add('hidden');
      document.getElementById('human-finished-modal').classList.add('hidden');
      endMatch();
    });
  }
  document.getElementById('btn-win-play-again').addEventListener('click', function(){
    document.getElementById('win-modal').classList.add('hidden');
    setEndMatchButtonVisible(false);
    startMatch();
  });
  document.getElementById('btn-win-menu').addEventListener('click', function(){
    document.getElementById('win-modal').classList.add('hidden');
    setEndMatchButtonVisible(false);
    showScreen('main-menu');
  });
  document.getElementById('chip-mode-pass').addEventListener('click', function(){
    gameState.mode = 'pass';
    document.getElementById('opponent-section').classList.add('hidden');
    document.getElementById('config-panel').classList.remove('hidden');
    document.getElementById('local-names-panel').classList.remove('hidden');
    document.getElementById('color-select-panel').classList.add('hidden');
    ['red', 'green', 'yellow', 'blue'].forEach(function(c){
      var inp = document.getElementById('name-' + c);
      if(inp) inp.value = '';
    });
    updateNameLabels();
  });
  document.getElementById('chip-mode-ai').addEventListener('click', function(){
    gameState.mode = 'ai';
    document.getElementById('opponent-section').classList.add('hidden');
    document.getElementById('config-panel').classList.remove('hidden');
    document.getElementById('local-names-panel').classList.add('hidden');
    document.getElementById('color-select-panel').classList.remove('hidden');
  });
  [2, 3, 4].forEach(function(cnt){
    document.getElementById('chip-count-' + cnt).addEventListener('click', function(){
      gameState.playerCount = cnt;
      var err = document.getElementById('name-error');
      if (err) err.style.display = 'none';
      if (cnt === 2) {
        gameState.localSelectedColors = ['red', 'yellow'];
      } else {
        gameState.localSelectedColors = ['red', 'green', 'yellow', 'blue'].slice(0, cnt);
      }
      [2, 3, 4].forEach(function(c){ document.getElementById('chip-count-' + c).classList.remove('active'); });
      this.classList.add('active');
      updateNameLabels();
    });
  });
  var cbTeam1 = document.getElementById('cb-team-1');
  if (cbTeam1) {
    cbTeam1.addEventListener('click', function() {
      if (gameState.mode !== 'pass' || gameState.playerCount !== 2) return;
      gameState.localSelectedColors = ['red', 'yellow'];
      var err = document.getElementById('name-error');
      if(err) err.style.display = 'none';
      updateNameLabels();
    });
  }
  var cbTeam2 = document.getElementById('cb-team-2');
  if (cbTeam2) {
    cbTeam2.addEventListener('click', function() {
      if (gameState.mode !== 'pass' || gameState.playerCount !== 2) return;
      gameState.localSelectedColors = ['green', 'blue'];
      var err = document.getElementById('name-error');
      if(err) err.style.display = 'none';
      updateNameLabels();
    });
  }
  ['red', 'green', 'yellow', 'blue'].forEach(function(color){
    var group = document.getElementById('group-' + color);
    if(group){
      var toggleEls = group.querySelectorAll('.color-checkbox, .pawn-icon');
      toggleEls.forEach(function(el){
        el.addEventListener('click', function(){
          if(gameState.mode !== 'pass') return;
          if(gameState.playerCount === 2) {
            if (color === 'red' || color === 'yellow') {
              gameState.localSelectedColors = ['red', 'yellow'];
            } else {
              gameState.localSelectedColors = ['green', 'blue'];
            }
            var err = document.getElementById('name-error');
            if(err) err.style.display = 'none';
          } else {
            var isChecked = gameState.localSelectedColors.indexOf(color) !== -1;
            if(!isChecked){
               if(gameState.localSelectedColors.length >= gameState.playerCount){
                 gameState.localSelectedColors.shift();
                 var err = document.getElementById('name-error');
                 if(err) err.style.display = 'none';
               }
               gameState.localSelectedColors.push(color);
            } else {
               if(gameState.localSelectedColors.length > 1) {
                 gameState.localSelectedColors.splice(gameState.localSelectedColors.indexOf(color), 1);
                 var err = document.getElementById('name-error');
                 if(err) err.style.display = 'none';
               }
            }
          }
          updateNameLabels();
        });
      });
    }
  });
  document.getElementById('chip-rule-classic').addEventListener('click', function(){
    gameState.ruleType = 'classic';
    this.classList.add('active');
    document.getElementById('chip-rule-quick').classList.remove('active');
  });
  ['red', 'green', 'yellow', 'blue'].forEach(function(color){
    var el = document.getElementById('chip-color-' + color);
    if(el) {
      el.addEventListener('click', function(){
        gameState.humanColor = color;
        ['red', 'green', 'yellow', 'blue'].forEach(function(c){ document.getElementById('chip-color-' + c).classList.remove('active'); });
        this.classList.add('active');
        updateNameLabels();
      });
    }
  });
  document.getElementById('chip-rule-quick').addEventListener('click', function(){
    gameState.ruleType = 'quick';
    this.classList.add('active');
    document.getElementById('chip-rule-classic').classList.remove('active');
  });
  document.getElementById('btn-start-game').addEventListener('click', function(){
    if (gameState.mode === 'pass') {
      var err = document.getElementById('name-error');
      if(err) err.style.display = 'none';
      if (gameState.localSelectedColors.length !== gameState.playerCount) {
        if(err) {
          err.textContent = "Please select any " + gameState.playerCount + " colors.";
          err.style.display = 'block';
        }
        return;
      }
      var inputs = [];
      for (var i = 0; i < gameState.activePlayers.length; i++) {
        var c = gameState.activePlayers[i];
        inputs.push(document.getElementById('name-' + c).value.trim());
      }
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].length === 1 || inputs[i].length > 10) {
          if(err) err.style.display = 'block';
          return;
        }
      }
      for (var i = 0; i < gameState.activePlayers.length; i++) {
        var c = gameState.activePlayers[i];
        var el = document.getElementById('name-' + c);
        if (el) {
          var v = el.value.trim();
          if (v) {
            localStorage.setItem('ludo_name_' + c, v);
          }
        }
      }
    }
    startMatch();
  });
  var centralBox = document.getElementById('dice-box-central');
  if(centralBox){
    centralBox.addEventListener('click', function(){
      var current = getCurrentPlayer();
      if(gameState.mode === 'ai' && current !== gameState.humanColor) return;
      if (!gameState.is2DMode) rollDice();
    });
  }
  
  ['red', 'green', 'yellow', 'blue'].forEach(function(color) {
    var box = document.getElementById('dice-box-' + color);
    if (box) {
      box.addEventListener('click', function(){
        var current = getCurrentPlayer();
        if(gameState.mode === 'ai' && current !== gameState.humanColor) return;
        if (gameState.is2DMode && current === color) rollDice();
      });
    }
  });
  var btn2D = document.getElementById('btn-game-2d');
  if(btn2D) {
    btn2D.addEventListener('click', function(){
      document.getElementById('hamburger-dropdown').classList.add('hidden');
      toggle2D3DView();
    });
  }
  var povBtn = document.getElementById('btn-game-pov');
  var povChip = document.getElementById('toggle-pov-chip');
  if(povBtn) {
    povBtn.addEventListener('click', function(){
      gameState.autoPOV = !gameState.autoPOV;
      updatePOVUI();
    });
  }
  if(povChip) {
    povChip.addEventListener('click', function(){
      gameState.autoPOV = !gameState.autoPOV;
      updatePOVUI();
    });
  }
  updatePOVUI();
  var soundBtn = document.getElementById('btn-game-sound');
  var soundChip = document.getElementById('toggle-sound-chip');
  function toggleSound(){
    var isEnabled = AudioEngine.toggle();
    
    var sSwitch = document.getElementById('settings-sound-switch');
    var sStatus = document.getElementById('settings-sound-status');
    var sIcon = document.getElementById('settings-sound-icon');
    if (sSwitch) {
      if (isEnabled) sSwitch.classList.add('active'); else sSwitch.classList.remove('active');
    }
    if (sStatus) {
      sStatus.textContent = isEnabled ? 'ON' : 'OFF';
    }
    if (sIcon) {
      sIcon.innerHTML = isEnabled 
        ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
        : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    }
    
    var hudIcon = document.getElementById('sound-icon-span');
    var hudText = document.getElementById('sound-btn-text');
    if (hudIcon) {
      hudIcon.innerHTML = isEnabled 
        ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    }
    if (hudText) {
      hudText.textContent = isEnabled ? 'Sound: ON' : 'Sound: OFF';
    }
    if (soundBtn) soundBtn.style.opacity = isEnabled ? '1' : '0.6';
  }
  if(soundBtn) soundBtn.addEventListener('click', toggleSound);
  if(soundChip) soundChip.addEventListener('click', toggleSound);
  function applyTheme(themeName){
    if (!themeName) return;
    document.body.className = themeName;
    localStorage.setItem('ludo_theme', themeName);
    document.querySelectorAll('[data-theme]').forEach(function(c){
      if (c.dataset.theme === themeName) c.classList.add('active');
      else c.classList.remove('active');
    });
    if(boardGroup){
      boardGroup.traverse(function(obj){
        if(obj !== boardGroup && obj !== tokenGroup && obj.parent !== tokenGroup){
          if(obj.geometry) obj.geometry.dispose();
          if(obj.material){
            if(Array.isArray(obj.material)) obj.material.forEach(function(m){ m.dispose(); });
            else obj.material.dispose();
          }
        }
      });
      while(boardGroup.children.length > 0) boardGroup.remove(boardGroup.children[0]);
      boardGroup.add(tokenGroup);
      build3DBoard();
    }
    
    var starProps = getStarThemeProperties();
    if(scene){
      scene.background = new THREE.Color(starProps.bg);
    }
    if(starParticles && starParticles.material){
      starParticles.material.color.setHex(starProps.color);
      starParticles.material.opacity = starProps.opacity;
      starParticles.material.size = starProps.size;
      starParticles.visible = true;
      starParticles.material.needsUpdate = true;
    }
  }
  window.applyTheme = applyTheme;

  document.querySelectorAll('[data-theme]').forEach(function(chip){
    chip.addEventListener('click', function(){
      applyTheme(this.dataset.theme);
    });
  });
}
window.addEventListener('DOMContentLoaded', function(){
  bindEvents();
  var savedTheme = localStorage.getItem('ludo_theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }
  var savedViewMode = localStorage.getItem('ludo_view_mode');
  if (savedViewMode) {
    gameState.is2DMode = (savedViewMode === '2d');
  } else {
    gameState.is2DMode = true;
  }
  boardRotX = gameState.is2DMode ? (Math.PI / 2) : 0.55;
  updateViewModeUI();
  
  var colors = ['red', 'green', 'yellow', 'blue'];
  for (var i = 0; i < colors.length; i++) {
    var c = colors[i];
    var stored = localStorage.getItem('ludo_name_' + c);
    var el = document.getElementById('name-' + c);
    if (stored && el) {
      el.value = stored;
    }
  }
  
  document.getElementById('btn-menu-play').addEventListener('click', function(){
    if(!gameState.humanColor) gameState.humanColor = 'red';
    if(!gameState.playerCount) gameState.playerCount = 2;
    document.getElementById('opponent-section').classList.remove('hidden');
    document.getElementById('config-panel').classList.add('hidden');
    updateNameLabels();
    showScreen('mode-screen');
  });
  setTimeout(function(){
    showScreen('main-menu');
  }, 700);
});
})();
