// police.js - Wanted level and police chase mechanics for Sunshine City

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
          x: playerX + (Math.random() - 0.5) * 800,
          y: playerY + (Math.random() - 0.5) * 800,
          speed: 4 + this.wantedLevel * 0.8
        });
      }
    }

    for (const unit of this.policeUnits) {
      const dx = playerX - unit.x;
      const dy = playerY - unit.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        unit.x += (dx / dist) * unit.speed;
        unit.y += (dy / dist) * unit.speed;
      }
    }
  }

  render(ctx) {
    for (const unit of this.policeUnits) {
      ctx.save();
      ctx.translate(unit.x, unit.y);

      // Police Car Body (Black & White with flashing lights)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-20, -12, 40, 24);

      // Flashing siren lights (Red / Blue)
      const flash = Math.floor(Date.now() / 150) % 2 === 0;
      ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}
