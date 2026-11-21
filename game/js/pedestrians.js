// pedestrians.js - Polished pedestrians with varied attire, walking animation, and colorful umbrellas for Sunshine City

export class PedestrianManager {
  constructor(city) {
    this.city = city;
    this.peds = [];
    this.spawnPeds();
  }

  spawnPeds() {
    const shirts = ['#f43f5e', '#0ea5e9', '#eab308', '#a855f7', '#22c55e', '#fb923c', '#ec4899', '#38bdf8', '#c084fc'];
    const pants = ['#1e293b', '#334155', '#475569', '#0f172a', '#1e1b4b'];
    const umbrellaColors = ['#0284c7', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

    for (let i = 0; i < 75; i++) {
      this.peds.push({
        x: 120 + Math.random() * (this.city.width - 240),
        y: 120 + Math.random() * (this.city.height - 240),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        shirtColor: shirts[Math.floor(Math.random() * shirts.length)],
        pantsColor: pants[Math.floor(Math.random() * pants.length)],
        umbrellaColor: umbrellaColors[Math.floor(Math.random() * umbrellaColors.length)],
        bobOffset: Math.random() * Math.PI * 2,
        hasUmbrella: Math.random() > 0.65
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
    const time = Date.now() / 130;
    for (const p of this.peds) {
      const bob = Math.sin(time + p.bobOffset) * 2.8;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.arc(p.x, p.y + 4, 5, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = p.pantsColor;
      ctx.fillRect(p.x - 3.5, p.y + bob, 2.5, 9);
      ctx.fillRect(p.x + 1, p.y - bob, 2.5, 9);

      // Torso / Shirt
      ctx.fillStyle = p.shirtColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 7 + bob, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Umbrella
      if (p.hasUmbrella) {
        ctx.fillStyle = p.umbrellaColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y - 20 + bob, 11, Math.PI, 0, false);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 8 + bob);
        ctx.lineTo(p.x, p.y - 20 + bob);
        ctx.stroke();
      }
    }
  }
}
