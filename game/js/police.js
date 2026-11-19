// police.js - Polished police pursuit units with alternating red/blue lightbars for Sunshine City

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

      // Police Car Body (White and Black two-tone)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-22, -13, 44, 26, 6);
      ctx.fill();

      // Black Police Center Roof / Trim
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -11, 14, 22);

      // Alternating Red / Blue Siren Lightbar on Roof
      const flash = Math.floor(Date.now() / 150) % 2 === 0;
      ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
      ctx.fillRect(-4, -8, 8, 5);
      ctx.fillStyle = flash ? '#3b82f6' : '#ef4444';
      ctx.fillRect(-4, 3, 8, 5);

      ctx.restore();
    }
  }
}
