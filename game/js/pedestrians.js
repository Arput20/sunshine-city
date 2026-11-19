// pedestrians.js - Walking crowds for Sunshine City

export class PedestrianManager {
  constructor(city) {
    this.city = city;
    this.peds = [];
    this.spawnPeds();
  }

  spawnPeds() {
    const shirts = ['#f43f5e', '#0ea5e9', '#eab308', '#a855f7', '#22c55e'];
    for (let i = 0; i < 40; i++) {
      this.peds.push({
        x: 100 + Math.random() * (this.city.width - 200),
        y: 100 + Math.random() * (this.city.height - 200),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        shirtColor: shirts[Math.floor(Math.random() * shirts.length)],
        radius: 6
      });
    }
  }

  update() {
    for (const p of this.peds) {
      p.x += p.vx;
      p.y += p.vy;

      if (Math.random() < 0.03) {
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = (Math.random() - 0.5) * 1.5;
      }

      p.x = Math.max(100, Math.min(this.city.width - 100, p.x));
      p.y = Math.max(100, Math.min(this.city.height - 100, p.y));
    }
  }

  render(ctx) {
    for (const p of this.peds) {
      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Shirt / Body
      ctx.fillStyle = p.shirtColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y + 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
