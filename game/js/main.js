// main.js - Main game loop, camera smoothing, state, and shot setups for Sunshine City

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
  if (menu.active) {
    menu.active = false;
    audio.playBlip();
  }
  if (e.code === 'KeyE') {
    // Enter/Exit car logic
    if (player.inVehicle) {
      player.inVehicle.isDriven = false;
      player.x = player.inVehicle.x + 40;
      player.y = player.inVehicle.y;
      player.inVehicle = null;
    } else {
      // Find nearest car
      for (const car of traffic.cars) {
        if (Math.hypot(player.x - car.x, player.y - car.y) < 50) {
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
  if (!player.inVehicle) {
    combat.shoot(player.x, player.y, player.angle);
    audio.playGunshot();
    effects.addSpark(player.x + Math.cos(player.angle) * 20, player.y + Math.sin(player.angle) * 20);
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
  const stolenCar = new Vehicle(player.x, player.y, '#ef4444');
  stolenCar.isDriven = true;
  player.inVehicle = stolenCar;
  police.wantedLevel = 3;
  police.policeUnits = [
    { x: player.x - 70, y: player.y - 40, speed: 6, angle: 0 },
    { x: player.x - 90, y: player.y + 40, speed: 6, angle: 0 }
  ];
  effects.addSmoke(player.x - 40, player.y);
  effects.addSmoke(player.x - 50, player.y);
} else if (shotMode === '3') {
  menu.active = false;
  player.x = 4000;
  player.y = 3500;
  police.wantedLevel = 4;
  police.policeUnits = [
    { x: player.x + 80, y: player.y - 30, speed: 5, angle: Math.PI }
  ];
  combat.shoot(player.x, player.y, 0);
  effects.addSpark(player.x + 30, player.y + 10, '#ef4444');
  effects.addSpark(player.x + 40, player.y - 10, '#fbbf24');
} else if (shotMode === '4') {
  menu.active = false;
  // Shot 4: Story / menu / progression view
}

let camera = { x: player.x, y: player.y };

function update() {
  if (menu.active) return;

  player.update(keys, city);
  traffic.update();
  peds.update();
  police.update(player.x, player.y);
  combat.update();
  effects.update();

  mission.checkProgress(player.x, player.y);

  // Smooth camera follow
  camera.x += (player.x - camera.x) * 0.1;
  camera.y += (player.y - camera.y) * 0.1;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (menu.active && shotMode !== '4') {
    menu.render(ctx, canvas.width, canvas.height);
    return;
  }

  if (shotMode === '4') {
    menu.render(ctx, canvas.width, canvas.height, true);
    return;
  }

  ctx.save();
  ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

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

  // Warm sun lighting overlay
  effects.renderSunTint(ctx, canvas.width, canvas.height);

  hud.render(ctx, player, police, mission, city, canvas.width, canvas.height, traffic, police);
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
