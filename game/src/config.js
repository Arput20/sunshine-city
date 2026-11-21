// Configuration constants for Sunshine City: world layout, day/night cycle, player stats, colors, and UI.

export const WORLD = {
  width: 6000,
  height: 6000,
  dayDuration: 300,
};

export const FIELD = { width: 1280, height: 720 };

export const STEP = 1 / 60;

export const PLAYER = {
  width: 32,
  height: 32,
  speed: 220,
  carSpeed: 520,
};

export const PALETTE = {
  backdrop: '#060913',
  asphalt: '#1e293b',
  sidewalk: '#334155',
  grass: '#14532d',
  water: '#0284c7',
  building: '#0f172a',
  neon: '#38bdf8',
  player: '#f43f5e',
  police: '#2563eb',
  traffic: '#f97316',
  text: '#f8fafc',
  muted: '#94a3b8',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
