// menu.js - Start screen and menus for Sunshine City

export class Menu {
  constructor() {
    this.active = true;
  }

  render(ctx, width, height, isStoryComplete = false) {
    ctx.save();
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    // Title neon glow effect
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 35;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 64px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUNSHINE CITY', width / 2, height / 2 - 120);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('An Open-World Coastal Crime Story', width / 2, height / 2 - 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Controls: WASD to Move/Drive | Mouse to Aim & Shoot | E to Enter/Steal Car | F to Exit', width / 2, height / 2 + 20);

    // Start Button prompt
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('PRESS ANY KEY OR CLICK TO START', width / 2, height / 2 + 100);

    if (isStoryComplete) {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText('MISSION COMPLETE - PROGRESSION SAVED', width / 2, height / 2 + 160);
    }

    ctx.restore();
  }
}
