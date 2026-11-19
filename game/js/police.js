// police.js - Polished police pursuit units with 25% larger scale, white body/black doors, and separated red/blue glow lightbars for Sunshine City

export class PoliceManager {
  constructor(city) {
    this.city = city;
    this.wantedLevel = 0;
    this.policeUnits = [];
  }

  update(playerX, playerY) {
    if (this.wantedLevel > 0 && this.policeUnits.length === 0) {
      for (let i = 0; i < this.wantedLevel * 2; i++) {
        this.policeUnits.push({
          x: playerX + (Math.random() - 0.5) * 600,
          y: playerY + (Math.random() - 0.5) * 600,
          speed: 4.5 + this.wantedLevel * 0.9,
          angle: 0
        });
      }
    }

    for (const unit of this.policeUnits) {
      const dx = playerX - unit.x;
      const dy = playerY - unit.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 15) {
        unit.angle = Math.atan2(dy, dx);
        unit.x += (dx / dist) * unit.speed;
        unit.y += (dy / dist) * unit.speed;
      }
    }
  }

  render(ctx) {
    for (const unit of this.policeUnits) {
      ctx.save();
      ctx.translate(unit.x, unit.y);
      ctx.rotate(unit.angle);

      // Each 25% larger scale
      ctx.scale(1.25, 1.25);

      // Police Car Body (White)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-22, -13, 44, 26, 6);
      ctx.fill();

      // Black Doors / Center Trim
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -13, 16, 26);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-6, -10, 12, 20);

      // Lightbar: two clearly separated bright red and blue rounded rects with additive glow halo (alternate which is bright)
      const flash = Math.floor(Date.now() / 150) % 2 === 0;

      ctx.shadowBlur = 10;
      ctx.shadowColor = flash ? '#ef4444' : '#3b82f6';

      // Red light rect
      ctx.fillStyle = flash ? '#ef4444' : '#93c5fd';
      ctx.beginPath();
      ctx.roundRect(-4, -10, 8, 4, 2);
      ctx.fill();

      // Blue light rect (clearly separated)
      ctx.fillStyle = flash ? '#93c5fd' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-4, 6, 8, 4, 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      ctx.restore();
    }
  }
}
