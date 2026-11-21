// Defines the 4 screenshot scenarios for Sunshine City corresponding to shots.json.
import { SCREEN_PLAY, SCREEN_TITLE } from './render.js';

export function stageShot(name, world) {
  world.reset();
  if (name === '2') {
    world.state.police.wantedLevel = 3;
  } else if (name === '3') {
    world.state.timeOfDay = 22.0;
  } else if (name === '4') {
    // Mission UI scenario
  }
  return { screen: SCREEN_PLAY, best: 0 };
}
