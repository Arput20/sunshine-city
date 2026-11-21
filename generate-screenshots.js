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
  { name: '01-hero.png', shotMode: '1' },
  { name: '02-chase.png', shotMode: '2' },
  { name: '03-night.png', shotMode: '3' },
  { name: '04-missions.png', shotMode: '4' }
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
    // Frame seafront: sandy beach strip, bay, palm trees, pier, glass towers
    player.x = 5450;
    player.y = 2750;
    police.wantedLevel = 1;
    peds.peds.push({ x: player.x - 60, y: player.y + 40, shirtColor: '#f43f5e', bobOffset: 0 });
    peds.peds.push({ x: player.x - 80, y: player.y + 70, shirtColor: '#0ea5e9', bobOffset: 1 });
  } else if (shot.shotMode === '2') {
    menu.active = false;
    // Chase staging: player car (teal, white stripe, ~2x traffic size) moving on boulevard
    player.x = 2600;
    player.y = 2200;
    const stolenCar = new Vehicle(player.x, player.y, '#06b6d4', false, true);
    stolenCar.isDriven = true;
    stolenCar.hasWhiteStripe = true;
    stolenCar.speed = 12;
    player.inVehicle = stolenCar;
    police.wantedLevel = 4;

    // TWO police cars chasing 40-80px directly behind player car in the same lane
    police.policeUnits = [
      { x: player.x - 70, y: player.y, speed: 13, angle: 0 },
      { x: player.x - 145, y: player.y, speed: 13.5, angle: 0 }
    ];

    // Tyre smoke & speed lines behind player
    effects.addSmoke(player.x - 50, player.y - 14);
    effects.addSmoke(player.x - 65, player.y + 14);
    effects.addSmoke(player.x - 90, player.y);

    // Speed lines / motion streaks
    for (let i = 0; i < 14; i++) {
      effects.particles.push({
        x: player.x - 80 - Math.random() * 120,
        y: player.y + (Math.random() - 0.5) * 60,
        vx: -18 - Math.random() * 8,
        vy: 0,
        life: 15,
        color: 'rgba(255, 255, 255, 0.45)'
      });
    }

    // Traffic cars nearby in other lanes
    traffic.cars.push(new Vehicle(player.x + 200, player.y - 80, '#f97316'));
    traffic.cars.push(new Vehicle(player.x - 100, player.y + 120, '#eab308'));

    // Pedestrians on sidewalk
    peds.peds.push({ x: player.x + 40, y: player.y - 120, shirtColor: '#22c55e', bobOffset: 0 });
    peds.peds.push({ x: player.x - 40, y: player.y + 130, shirtColor: '#ec4899', bobOffset: 2 });

  } else if (shot.shotMode === '3') {
    menu.active = false;
    // Frame seafront combat: muzzle flash, blood/particles, police unit
    player.x = 5380;
    player.y = 3080;
    police.wantedLevel = 3;
    police.policeUnits = [
      { x: player.x + 90, y: player.y - 35, speed: 5, angle: Math.PI }
    ];
    combat.shoot(player.x, player.y, 0);
    combat.shoot(player.x + 15, player.y - 5, 0.1);

    // Muzzle flash particle & blood / sparks
    effects.addSpark(player.x + 25, player.y, '#fef08a'); // Muzzle flash
    effects.addSpark(player.x + 45, player.y - 12, '#ef4444'); // Blood / impact
    effects.addSpark(player.x + 55, player.y + 10, '#38bdf8'); // Spark

  } else if (shot.shotMode === '4') {
    menu.active = false;
    menu.showMissionList = true;
    mission.uiOpen = true;
  }

  const camera = { x: player.x, y: player.y };

  if (shot.shotMode === '4') {
    menu.render(ctx, width, height, mission);
    mission.renderMissionListUI(ctx, width, height);
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
