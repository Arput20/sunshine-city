// effects.js - Warm sun lighting and particle effects for Sunshine City

export class EffectManager {
  constructor() {
    this.particles = [];
  }

  addSpark(x, y, color = '#fbbf24') {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 25,
      color
    });
  }

  addSmoke(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
      life: 30,
      color: 'rgba(203, 213, 225, 0.6)',
      isSmoke: true
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      if (p.isSmoke) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (35 - p.life) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }
    }
  }

  renderSunTint(ctx, width, height) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Screen space overlay
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.08)'); // Warm golden hour tint
    grad.addColorStop(1, 'rgba(249, 115, 22, 0.04)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
