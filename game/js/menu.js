// menu.js - Pass 2: High-Performance Start Screen, Pause Menu & Mission Integration for Sunshine City
export class Menu {
  constructor() {
    this.active = true;
    this.paused = false;
    this.showMissionList = false;
  }

  render(ctx, width, height, missionManager = null) {
    ctx.save();

    if (this.paused) {
      // Pause Menu Overlay
      ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 38px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME PAUSED', width / 2, height / 2 - 120);

      ctx.font = '16px system-ui, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('[ESC / P] Resume Game', width / 2, height / 2 - 50);
      ctx.fillText('[R] Restart Game', width / 2, height / 2 - 5);
      ctx.fillText('[M] Toggle Mission Selector', width / 2, height / 2 + 40);
      ctx.fillText('[WASD] Drive/Move | [E] Enter/Exit Car | [MOUSE] Shoot', width / 2, height / 2 + 90);

      ctx.restore();
      return;
    }

    if (this.active) {
      // Cinematic Start Screen
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.6, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const sunGrad = ctx.createRadialGradient(width / 2, height / 2 - 40, 10, width / 2, height / 2 - 40, 220);
      sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      sunGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.2)');
      sunGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#090d16';
      const skylineHeights = [180, 240, 150, 310, 220, 280, 190, 340, 260, 210, 300, 170, 250, 320, 200];
      const bWidth = width / skylineHeights.length;
      for (let i = 0; i < skylineHeights.length; i++) {
        const bh = skylineHeights[i];
        ctx.fillRect(i * bWidth, height - bh, bWidth + 2, bh);
      }

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

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText('Rico Vega arrives in Sunshine City to seize control of the coast and build an empire.', width / 2, height / 2 + 10);
      ctx.fillText('Armed with fast cars, 4+ mission types, escalating police AI, and absolute grit.', width / 2, height / 2 + 35);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 340, height / 2 + 75, 680, 55, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('[CLICK / ANY KEY] START | [M] MISSIONS | [ESC/P] PAUSE | [WASD] DRIVE', width / 2, height / 2 + 108);
    }

    ctx.restore();
  }
}
