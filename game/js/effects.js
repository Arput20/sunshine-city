// effects.js - Tyre smoke, skid marks, explosion/collision particles, and neon lighting for Sunshine City

export class EffectManager {
  constructor() {
    this.particles = [];
    this.skidMarks = [];
  }

  addSpark(x, y, color = '#fbbf24') {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 18 + Math.random() * 15,
        maxLife: 33,
        color,
        size: 2.5 + Math.random() * 3
      });
    }
  }

  addSmoke(x, y, isHeavy = false) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.2 - Math.random() * 2,
      life: 35,
      maxLife: 35,
      color: 'rgba(226, 232, 240, 0.55)',
      isSmoke: true,
      size: isHeavy ? 24 : 14
    });
  }

  addExplosion(x, y) {
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        color: Math.random() > 0.4 ? '#ef4444' : (Math.random() > 0.5 ? '#f59e0b' : '#38bdf8'),
        size: 5 + Math.random() * 8
      });
    }
  }

  addCollisionDebris(x, y, color = '#f59e0b') {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  addDust(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      life: 25,
      maxLife: 25,
      color: 'rgba(210, 190, 140, 0.4)',
      isDust: true,
      size: 12 + Math.random() * 8
    });
  }

  addSkidMark(x1, y1, x2, y2) {
    this.skidMarks.push({ x1, y1, x2, y2, life: 800 });
    if (this.skidMarks.length > 600) {
      this.skidMarks.shift();
    }
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

    for (let i = this.skidMarks.length - 1; i >= 0; i--) {
      const s = this.skidMarks[i];
      s.life--;
      if (s.life <= 0) {
        this.skidMarks.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Persistent skid marks with subtle fading
    for (const s of this.skidMarks) {
      ctx.save();
      ctx.strokeStyle = `rgba(11, 15, 25, ${Math.min(0.8, s.life / 200)})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (const p of this.particles) {
      ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      if (p.isSmoke || p.isDust) {
        ctx.fillStyle = p.isDust ? `rgba(210, 190, 140, ${alpha * 0.4})` : `rgba(203, 213, 225, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (p.maxLife - p.life) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
  }

  renderSunTint(ctx, width, height) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.05)');
    grad.addColorStop(1, 'rgba(249, 115, 22, 0.025)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
