// World simulation state for Sunshine City: player, city layout, traffic, police, and missions.
import { WORLD, PLAYER } from './config.js';

export function createWorld(random) {
  const state = {
    player: { x: 1200, y: 1500, angle: 0, speed: 0, inVehicle: null },
    police: { wantedLevel: 0, units: [] },
    traffic: [],
    peds: [],
    missions: [
      { id: 1, title: 'Beachside Delivery', active: true, completed: false },
      { id: 2, title: 'Syndicate Car Chase', active: false, completed: false },
      { id: 3, title: 'Sunset Time Trial', active: false, completed: false },
      { id: 4, title: 'VIP Convoy Escort', active: false, completed: false },
    ],
    timeOfDay: 12.0,
    elapsed: 0,
  };

  function reset() {
    state.player.x = 1200;
    state.player.y = 1500;
    state.player.angle = 0;
    state.player.speed = 0;
    state.player.inVehicle = null;
    state.police.wantedLevel = 0;
    state.police.units = [];
    state.traffic = [];
    state.peds = [];
    state.timeOfDay = 12.0;
    state.elapsed = 0;
  }

  function step(dt, inputAxes) {
    state.elapsed += dt;
    state.timeOfDay = (state.timeOfDay + dt / 60) % 24;
    state.player.x += inputAxes.x * PLAYER.speed * dt;
    state.player.y += inputAxes.y * PLAYER.speed * dt;
  }

  return { state, reset, step };
}
