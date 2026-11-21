// combat.js - Pass 2: High-Performance Combat System & Projectile Collisions for Sunshine City
export class CombatSystem {
  constructor() {
    this.bullets = [];
  }

  shoot(x, y, angle) {
    this.bullets.push({
      x,
      y,
      vx: Math.cos(angle) * 22,
      vy: Math.sin(angle) * 22,
      life: 60
    });
  }

  update(police, traffic, peds, hud) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      if (b.life <= 0) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check collision with police units
      let hit = false;
      if (police && police.policeUnits) {
        for (let p = police.policeUnits.length - 1; p >= 0; p--) {
          const pu = police.policeUnits[p];
          if (Math.hypot(b.x - pu.x, b.y - pu.y) < 32) {
            police.wantedLevel = Math.min(5, police.wantedLevel + 1);
            hit = true;
            break;
          }
        }
      }

      // Also trigger minor wanted increase when shooting guns in public
      if (!hit && Math.random() < 0.05 && police && police.wantedLevel === 0) {
        police.wantedLevel = 1;
      }

      if (hit) {
        this.bullets.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
