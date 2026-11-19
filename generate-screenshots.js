// generate-screenshots.js - Generate polished screenshots for Sunshine City using node-canvas

import { createCanvas } from 'canvas';
import {writeFileSync, mkdirSync} from 'node:fs';
import { City } from './game/js/city.js';
import { Player } from './game/js/player.js';
import { Vehicle } from './game/js/vehicle.js';
import { TrafficManager } from './game/js/traffic.js';
import { PedestrianManager } from './game/js/pedestrians.js';
import { PoliceManager } from './game/js/police.js';
import { MissionManager } from './game/js/missions.js';
import { CombatSystem } from './game/js/combat.js';
import { HUD } from './game/js/hud.js';
import { EffectManager } from './game/js/effects.js';
import { Menu } from './game/js/menu.js';

mkdirSync('screenshots', { recursive: true });

const width = 1280;
const height = 720;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const shots = [
  { name: '01-city.png', shotMode: '1' },
  { name: '02-chase.png', shotMode: '2' },
  { name: '03-combat.png', shotMode: '3' },
  { name: '04-story.png', shotMode: '4' }
];

for (const shot of shots) {
  ctx.clearRect(0, 0, width, height);

  const city = new City();
  const player = new Player(1200, 1500);
  const traffic = new TrafficManager(city);
  const peds = new PedestrianManager(city);
  const police = new PoliceManager(city);
  const mission = new MissionManager();
  const combat = new CombatSystem();
  const hud = new HUD();
  const menu = new Menu();
  const effects = new EffectManager();

  if (shot.shotMode === '1') {
    menu.active = false;
    // Frame seafront: sandy beach strip, bay, palm trees, pier
    player.x = 5500;
    player.y = 2800;
    police.wantedLevel = 1;
  } else if (shot.shotMode === '2') {
    menu.active = false;
    player.x = 2600;
    player.y = 2200;
    const stolenCar = new Vehicle(player.x, player.y, '#06b6d4');
    stolenCar.isDriven = true;
    stolenCar.hasWhiteStripe = true;
    player.inVehicle = stolenCar;
    police.wantedLevel = 3;
    // TWO police cars directly behind player car on the same road lane
    police.policeUnits = [
      { x: player.x - 70, y: player.y, speed: 6, angle: 0 },
      { x: player.x - 135, y: player.y, speed: 6, angle: 0 }
    ];
    effects.addSmoke(player.x - 45, player.y - 12);
    effects.addSmoke(player.x - 60, player.y + 12);
    effects.addSmoke(player.x - 85, player.y);
  } else if (shot.shotMode === '3') {
    menu.active = false;
    // Frame seafront combat
    player.x = 5400;
    player.y = 3100;
    police.wantedLevel = 4;
    police.policeUnits = [
      { x: player.x + 80, y: player.y - 30, speed: 5, angle: Math.PI }
    ];
    combat.shoot(player.x, player.y, 0);
    effects.addSpark(player.x + 30, player.y + 10, '#ef4444');
    effects.addSpark(player.x + 40, player.y - 10, '#fbbf24');
  } else if (shot.shotMode === '4') {
    menu.active = false;
  }

  const camera = { x: player.x, y: player.y };

  if (shot.shotMode === '4') {
    menu.render(ctx, width, height, true);
  } else {
    ctx.save();
    ctx.translate(width / 2 - camera.x, height / 2 - camera.y);

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

    effects.renderSunTint(ctx, width, height);
    hud.render(ctx, player, police, mission, city, width, height, traffic, police);
  }

  const pngBuffer = canvas.toBuffer('image/png');
  writeFileSync(`screenshots/${shot.name}`, pngBuffer);
  console.log(`Generated screenshots/${shot.name} (${pngBuffer.length} bytes)`);
}
console.log('All screenshots generated successfully!');
