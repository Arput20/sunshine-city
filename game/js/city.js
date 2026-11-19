// city.js - Procedural coastal city grid for Sunshine City

export class City {
  constructor(width = 6000, height = 6000) {
    this.width = width;
    this.height = height;
    this.blockSize = 300;
    this.roadWidth = 60;
    this.blocks = [];
    this.buildings = [];
    this.palmTrees = [];
    this.generate();
  }

  generate() {
    const cols = Math.floor(this.width / this.blockSize);
    const rows = Math.floor(this.height / this.blockSize);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * this.blockSize + this.roadWidth / 2;
        const y = r * this.blockSize + this.roadWidth / 2;
        const w = this.blockSize - this.roadWidth;
        const h = this.blockSize - this.roadWidth;

        // Seafront on the right edge or bottom
        const isBeach = c >= cols - 2;
        const isPark = (c + r) % 7 === 3;

        this.blocks.push({ x, y, w, h, isBeach, isPark });

        if (isBeach) {
          // Palm trees along beach
          for (let i = 0; i < 4; i++) {
            this.palmTrees.push({
              x: x + 20 + Math.random() * (w - 40),
              y: y + i * (h / 4) + Math.random() * 30
            });
          }
        } else if (isPark) {
          // Park trees / benches
          for (let i = 0; i < 6; i++) {
            this.palmTrees.push({
              x: x + 30 + Math.random() * (w - 60),
              y: y + 30 + Math.random() * (h - 60)
            });
          }
        } else {
          // Buildings
          const bW = w - 30;
          const bH = h - 30;
          const palettes = [
            { wall: '#e28743', roof: '#383838', neon: '#ff007f' },
            { wall: '#2b9348', roof: '#1b4332', neon: '#00f5d4' },
            { wall: '#4361ee', roof: '#1d3557', neon: '#f72585' },
            { wall: '#f77f00', roof: '#d62828', neon: '#fcbf49' },
            { wall: '#9b5de5', roof: '#571089', neon: '#00bbf9' }
          ];
          const palette = palettes[(c * 7 + r * 13) % palettes.length];
          this.buildings.push({
            x: x + 15,
            y: y + 15,
            w: bW,
            h: bH,
            floors: 2 + ((c + r) % 5),
            palette
          });
        }
      }
    }
  }

  render(ctx, camera) {
    // Background (Ocean / Bay on the right, asphalt elsewhere)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Roads (Grid)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.width, this.height);

    // Road markings & asphalt grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = this.roadWidth;
    ctx.strokeRect(0, 0, this.width, this.height);

    // Blocks & Seafront
    for (const b of this.blocks) {
      if (b.isBeach) {
        // Sandy beach & turquoise water
        ctx.fillStyle = '#fde047'; // Sand
        ctx.fillRect(b.x - 15, b.y - 15, b.w + 30, b.h + 30);
        ctx.fillStyle = '#06b6d4'; // Turquoise bay
        ctx.fillRect(b.x + b.w / 2, b.y - 15, b.w / 2 + 15, b.h + 30);
      } else if (b.isPark) {
        ctx.fillStyle = '#14532d'; // Grass park
        ctx.fillRect(b.x, b.y, b.w, b.h);
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
    }

    // Buildings
    for (const b of this.buildings) {
      ctx.fillStyle = b.palette.wall;
      ctx.fillRect(b.x, b.y, b.w, b.h);

      // Roof
      ctx.fillStyle = b.palette.roof;
      ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);

      // Neon accent line
      ctx.strokeStyle = b.palette.neon;
      ctx.lineWidth = 3;
      ctx.strokeRect(b.x + 15, b.y + 15, b.w - 30, b.h - 30);

      // Windows grid
      ctx.fillStyle = '#fbbf24';
      for (let wx = b.x + 25; wx < b.x + b.w - 20; wx += 30) {
        for (let wy = b.y + 25; wy < b.y + b.h - 20; wy += 35) {
          ctx.fillRect(wx, wy, 12, 18);
        }
      }
    }

    // Palm trees
    for (const t of this.palmTrees) {
      ctx.fillStyle = '#854d0e'; // Trunk
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#15803d'; // Fronds
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.ellipse(t.x + Math.cos(a) * 12, t.y + Math.sin(a) * 12, 14, 6, a, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
