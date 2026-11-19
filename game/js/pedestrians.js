// pedestrians.js - Polished crowds with two-tone figures and walking bob for Sunshine City

export class PedestrianManager {
  constructor(city) {
    this.city = city;
    this.peds = [];
    this.spawnPeds();
  }

  spawnPeds() {
    const shirts = ['#f43f5e', '#0ea5e9', '#eab308', '#a855f7', '#22c55e', '#fb923c'];
    for (let i = 0; i < 50; i++) {
      this.peds.push({
        x: 120 + Math.random() * (this.city.width - 240),
        y: 120 + Math.random() * (this.city.height - 240),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        shirtColor: shirts[Math.floor(Math.random() * shirts.length)],
        bobOffset: Math.random() * Math.PI * 2
      });
    }
  }

  update() {
    for (const p of this.peds) {
      p.x += p.vx;
      p.y += p.vy;

      if (Math.random() < 0.02) {
        p.vx = (Math.random() - 0.5) * 1.2;
        p.vy = (Math.random() - 0.5) * 1.2;
      }

      p.x = Math.max(100, Math.min(this.city.width - 100, p.x));
      p.y = Math.max(100, Math.min(this.city.height - 100, p.y));
    }
  }

  render(ctx) {
    const time = Date.now() / 150;
    for (const p of this.peds) {
      const bob = Math.sin(time + p.bobOffset) * 2;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.arc(p.x, p.y + 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders / Shirt body
      ctx.fillStyle = p.shirtColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, 5, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 5 + bob, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
