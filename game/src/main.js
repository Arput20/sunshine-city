// Main entry point for Sunshine City simulator / test runner.
import { createRandom } from './random.js';
import { createWorld } from './world.js';
import { createInput } from './input.js';
import { createRenderer, SCREEN_PLAY } from './render.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = 12345;

const canvas = document.getElementById('game') || document.createElement('canvas');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);

if (shot) {
  stageShot(shot, world);
  renderer.draw(world.state, SCREEN_PLAY, 0);
  window.__shotReady = true;
} else {
  const input = createInput(canvas);
  function loop() {
    requestAnimationFrame(loop);
    world.step(1/60, input.axes());
    renderer.draw(world.state, SCREEN_PLAY, 0);
  }
  requestAnimationFrame(loop);
}
