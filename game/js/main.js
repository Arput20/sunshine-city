// main.js - Pass 2: Comprehensive game loop and event coordination for Sunshine City

import { City } from './city.js';
import { Player } from './player.js';
import { Vehicle } from './vehicle.js';
import { TrafficManager } from './traffic.js';
import { PedestrianManager } from './pedestrians.js';
import { PoliceManager } from './police.js';
import { MissionManager } from './missions.js';
import { CombatSystem } from './combat.js';
import { HUD } from './hud.js';
import { AudioManager } from './audio.js';
import { Menu } from './menu.js';
import { EffectManager } from './effects.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'F3') {
    debugMode = !debugMode;
    audio.playBlip();
    e.preventDefault();
    return;
  }

  if (menu.active) {
    menu.active = false;
    audio.playBlip();
    return;
  }

  if (e.code === 'KeyM') {
    menu.showMissionList = !menu.showMissionList;
    audio.playBlip();
    return;
  }

  if (e.code === 'Escape' || e.code === 'KeyP') {
    menu.paused = !menu.paused;
    audio.playBlip();
    return;
  }

  if (e.code === 'KeyR' && menu.paused) {
    window.location.reload();
    return;
  }

  if (menu.paused || menu.showMissionList) return;

  if (e.code === 'KeyE') {
    if (player.inVehicle) {
      player.inVehicle.isDriven = false;
      player.x = player.inVehicle.x + 45;
      player.y = player.inVehicle.y;
      player.inVehicle = null;
      audio.playBlip();
    } else {
      for (let i = 0; i < traffic.cars.length; i++) {
        const car = traffic.cars[i];
        if (Math.hypot(player.x - car.x, player.y - car.y) < 55) {
          player.inVehicle = car;
          car.isDriven = true;
          audio.playBlip();
          break;
        }
      }
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

window.addEventListener('mousedown', (e) => {
  if (menu.active) {
    menu.active = false;
    audio.playBlip();
    return;
  }
  if (menu.paused || menu.showMissionList) return;

  if (!player.inVehicle) {
    combat.shoot(player.x, player.y, player.angle);
    audio.playGunshot();
    effects.addSpark(player.x + Math.cos(player.angle) * 22, player.y + Math.sin(player.angle) * 22);
  }
});

const city = new City();
const player = new Player(1200, 1500);
const traffic = new TrafficManager(city);
const peds = new PedestrianManager(city);
const police = new PoliceManager(city);
const mission = new MissionManager();
const combat = new CombatSystem();
const hud = new HUD();
const audio = new AudioManager();
const menu = new Menu();
const effects = new EffectManager();

// Parse URL shot parameter for automated screenshots
const urlParams = new URLSearchParams(window.location.search);
const shotMode = urlParams.get('shot');

if (shotMode === '1') {
  menu.active = false;
  player.x = 1200;
  player.y = 1500;
  police.wantedLevel = 1;
} else if (shotMode === '2') {
  menu.active = false;
  player.x = 2500;
  player.y = 2200;
  const stolenCar = new Vehicle(player.x, player.y, '#ef4444', false, true);
  stolenCar.isDriven = true;
  player.inVehicle = stolenCar;
  police.wantedLevel = 3;
} else if (shotMode === '3') {
  menu.active = false;
  player.x = 4000;
  player.y = 3500;
  police.wantedLevel = 4;
} else if (shotMode === '4') {
  menu.active = false;
  menu.showMissionList = true;
  mission.uiOpen = true;
}

const camera = { x: player.x, y: player.y, shakeTimer: 0, shakeIntensity: 0 };
let lastTime = performance.now();
let debugMode = false;
let fps = 60;
let targetX = 0;
let targetY = 0;
let velX = 0;
let velY = 0;
let lookAheadX = 0;
let lookAheadY = 0;
let currentSpeed = 0;
let isDriven = false;
let shakeX = 0;
let shakeY = 0;

function triggerShake(intensity, duration) {
  camera.shakeIntensity = intensity;
  camera.shakeTimer = duration;
}

function update(dt) {
  if (menu.active || menu.paused || menu.showMissionList) return;

  city.update(dt);
  player.update(keys, city, effects);
  traffic.update();
  peds.update();
  police.update(dt, player.x, player.y, player.inVehicle ? player.inVehicle.vx : 0, player.inVehicle ? player.inVehicle.vy : 0);
  combat.update(police, traffic, peds, hud);
  effects.update();

  mission.update(dt, player.x, player.y, hud);

  // Check vehicle collisions for screen shake & thud
  if (player.inVehicle && Math.abs(player.inVehicle.speed) > 3) {
    for (let i = 0; i < traffic.cars.length; i++) {
      const car = traffic.cars[i];
      if (car !== player.inVehicle && Math.hypot(player.inVehicle.x - car.x, player.inVehicle.y - car.y) < 50) {
        audio.playCollisionThud();
        effects.addCollisionDebris(player.inVehicle.x, player.inVehicle.y);
        triggerShake(7, 18);
        player.inVehicle.speed *= -0.3;
        break;
      }
    }
  }

  // Audio engine sound sync
  currentSpeed = player.inVehicle ? player.inVehicle.speed : (player.speed || 0);
  isDriven = player.inVehicle && player.inVehicle.isDriven;
  audio.updateEngine(currentSpeed, isDriven);

  // Smooth camera follow with velocity look-ahead
  targetX = player.inVehicle ? player.inVehicle.x : player.x;
  targetY = player.inVehicle ? player.inVehicle.y : player.y;
  velX = player.inVehicle ? player.inVehicle.vx : 0;
  velY = player.inVehicle ? player.inVehicle.vy : 0;

  lookAheadX = targetX + velX * 18;
  lookAheadY = targetY + velY * 18;

  camera.x += (lookAheadX - camera.x) * 0.1;
  camera.y += (lookAheadY - camera.y) * 0.1;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (menu.active) {
    menu.render(ctx, canvas.width, canvas.height, mission);
    return;
  }

  ctx.save();

  shakeX = 0;
  shakeY = 0;
  if (camera.shakeTimer > 0) {
    camera.shakeTimer--;
    shakeX = (Math.random() - 0.5) * camera.shakeIntensity;
    shakeY = (Math.random() - 0.5) * camera.shakeIntensity;
  }

  ctx.translate(canvas.width / 2 - camera.x + shakeX, canvas.height / 2 - camera.y + shakeY);

  city.render(ctx, camera);
  peds.render(ctx);
  traffic.render(ctx);
  police.render(ctx);
  mission.render(ctx);
  combat.render(ctx);
  effects.render(ctx);
  player.render(ctx);

  if (player.inVehicle) {
    player.inVehicle.render(ctx);
  }

  ctx.restore();

  effects.renderSunTint(ctx, canvas.width, canvas.height);
  hud.render(ctx, player, police, mission, city, canvas.width, canvas.height, traffic, police);

  if (debugMode) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(15, 15, 210, 95);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, 15, 210, 95);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '13px monospace';
    ctx.fillText(`[F3] DEBUG MODE`, 28, 38);
    ctx.fillText(`FPS: ${fps}`, 28, 58);
    ctx.fillText(`Particles: ${effects.particles.length}`, 28, 78);
    ctx.fillText(`Traffic Cars: ${traffic.cars.length}`, 28, 98);
    ctx.restore();
  }

  if (menu.paused || menu.showMissionList) {
    menu.render(ctx, canvas.width, canvas.height, mission);
  }
}

function loop(timestamp) {
  const dt = Math.min(0.1, (timestamp - lastTime) / 1000);
  fps = Math.round(1 / dt);
  lastTime = timestamp;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
