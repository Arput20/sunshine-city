// menu.js - Cinematic start screen and menus for Sunshine City

export class Menu {
  constructor() {
    this.active = true;
  }

  render(ctx, width, height, isStoryComplete = false) {
    ctx.save();

    // Deep sunset gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.6, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Radiant Sun on horizon
    const sunGrad = ctx.createRadialGradient(width / 2, height / 2 - 40, 10, width / 2, height / 2 - 40, 220);
    sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    sunGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.2)');
    sunGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);

    // Skyline silhouette
    ctx.fillStyle = '#090d16';
    const skylineHeights = [180, 240, 150, 310, 220, 280, 190, 340, 260, 210, 300, 170, 250, 320, 200];
    const bWidth = width / skylineHeights.length;
    for (let i = 0; i < skylineHeights.length; i++) {
      const bh = skylineHeights[i];
      ctx.fillRect(i * bWidth, height - bh, bWidth + 2, bh);
    }

    // Title neon glow effect
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 68px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUNSHINE CITY', width / 2, height / 2 - 100);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('O P E N - W O R L D   C R I M E   S A G A', width / 2, height / 2 - 50);

    // 2-sentence character story intro
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Rico Vega arrives in Sunshine City to seize control of the coast and build an empire.', width / 2, height / 2 + 10);
    ctx.fillText('Armed with fast cars and absolute grit, the neon underworld is yours for the taking.', width / 2, height / 2 + 35);

    // Menu buttons
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 320, height / 2 + 75, 640, 50, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('[START]       [CONTROLS: WASD + MOUSE]       [STORY MODE]', width / 2, height / 2 + 105);

    if (isStoryComplete) {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('MISSION COMPLETE - PROGRESSION SAVED', width / 2, height / 2 + 155);
    }

    ctx.restore();
  }
}
