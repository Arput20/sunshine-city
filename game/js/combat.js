// combat.js - Combat system, bullets and projectiles for Sunshine City

export class CombatSystem {
  constructor() {
    this.bullets = [];
  }

  shoot(x, y, angle) {
    this.bullets.push({
      x,
      y,
      vx: Math.cos(angle) * 18,
      vy: Math.sin(angle) * 18,
      life: 50
    });
  }

  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
      if (b.life <= 0) {
        this.bullets.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = '#fef08a';
    for (const b of this.bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
