// city.js - Procedural coastal city grid for Sunshine City with seafront, pier, 3D buildings, and palm trees

export class City {
  constructor(width = 6000, height = 6000) {
    this.width = width;
    this.height = height;
    this.blockSize = 300;
    this.roadWidth = 70;
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

        // Seafront on the right edge
        const isBeach = c >= cols - 2;
        const isPark = (c + r) % 7 === 3;

        this.blocks.push({ x, y, w, h, isBeach, isPark });

        if (isBeach) {
          // Palm trees along beach promenade (5-6 trees)
          for (let i = 0; i < 6; i++) {
            this.palmTrees.push({
              x: x + 18 + Math.random() * (w - 36),
              y: y + i * (h / 6) + Math.random() * 20
            });
          }
        } else if (isPark) {
          // Park trees
          for (let i = 0; i < 7; i++) {
            this.palmTrees.push({
              x: x + 25 + Math.random() * (w - 50),
              y: y + 25 + Math.random() * (h - 50)
            });
          }
        } else {
          // Buildings with detailed footprints & glass towers on seafront side
          const bW = w - 24;
          const bH = h - 24;
          const isGlassTower = c >= cols - 4;
          const palettes = isGlassTower ? [
            { wall: '#0284c7', roof: '#0369a1', neon: '#38bdf8', glass: '#7dd3fc' },
            { wall: '#0369a1', roof: '#075985', neon: '#0284c7', glass: '#38bdf8' }
          ] : [
            { wall: '#d97706', roof: '#374151', neon: '#f43f5e', glass: '#fbbf24' },
            { wall: '#059669', roof: '#1f2937', neon: '#34d399', glass: '#6ee7b7' },
            { wall: '#2563eb', roof: '#1e293b', neon: '#60a5fa', glass: '#93c5fd' },
            { wall: '#7c3aed', roof: '#111827', neon: '#a78bfa', glass: '#c4b5fd' },
            { wall: '#db2777', roof: '#1f2937', neon: '#f472b6', glass: '#fbcfe8' }
          ];
          const palette = palettes[(c * 7 + r * 13) % palettes.length];
          this.buildings.push({
            x: x + 12,
            y: y + 12,
            w: bW,
            h: bH,
            floors: 3 + ((c + r) % 6),
            palette,
            hasRooftopDetails: true
          });
        }
      }
    }
  }

  render(ctx, camera) {
    // Ocean / Bay background
    ctx.fillStyle = '#0a1128';
    ctx.fillRect(0, 0, this.width, this.height);

    // Dark Asphalt Roads Grid
    ctx.fillStyle = '#182232';
    ctx.fillRect(0, 0, this.width, this.height);

    // Road grid lines / curbs
    ctx.strokeStyle = '#283548';
    ctx.lineWidth = this.roadWidth;
    ctx.strokeRect(0, 0, this.width, this.height);

    // Dashed yellow center lines on roads
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    
    for (let x = this.roadWidth / 2; x < this.width; x += this.blockSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = this.roadWidth / 2; y < this.height; y += this.blockSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // White crosswalks at intersections
    ctx.fillStyle = '#ffffff';
    for (let x = this.roadWidth / 2; x < this.width; x += this.blockSize) {
      for (let y = this.roadWidth / 2; y < this.height; y += this.blockSize) {
        const bx = x - this.roadWidth / 2;
        const by = y - this.roadWidth / 2;
        ctx.fillRect(bx - 4, by - 12, 8, 12);
        ctx.fillRect(bx - 12, by - 4, 12, 8);
      }
    }

    // Blocks, Parks, Beach, Bay & Pier
    for (const b of this.blocks) {
      if (b.isBeach) {
        // Sandy beach strip
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(b.x - 20, b.y - 20, b.w + 40, b.h + 40);
        
        // Turquoise bay with wave lines
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(b.x + b.w / 2, b.y - 20, b.w / 2 + 160, b.h + 40);

        ctx.strokeStyle = '#a5f3fc';
        ctx.lineWidth = 2;
        for (let wy = b.y; wy < b.y + b.h; wy += 35) {
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2 + 20, wy);
          ctx.quadraticCurveTo(b.x + b.w / 2 + 50, wy + 12, b.x + b.w + 120, wy);
          ctx.stroke();
        }

        // Pier (Wooden dock extending into the bay)
        const pierY = b.y + b.h / 2 - 22;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x + b.w / 2, pierY + 4, 180, 36);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(b.x + b.w / 2, pierY, 180, 30);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        for (let px = b.x + b.w / 2 + 20; px < b.x + b.w / 2 + 180; px += 24) {
          ctx.beginPath();
          ctx.moveTo(px, pierY);
          ctx.lineTo(px, pierY + 30);
          ctx.stroke();
        }

      } else if (b.isPark) {
        ctx.fillStyle = '#14532d';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);

        ctx.strokeStyle = '#78716c';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.h / 2);
        ctx.lineTo(b.x + b.w, b.y + b.h / 2);
        ctx.moveTo(b.x + b.w / 2, b.y);
        ctx.lineTo(b.x + b.w / 2, b.y + b.h);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#475569';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    }

    // Buildings with 3D block top face, varied window colours, drop shadows, and rooftop AC boxes
    for (const b of this.buildings) {
      // Building Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(b.x + 8, b.y + 8, b.w, b.h);

      // Main Wall
      ctx.fillStyle = b.palette.wall;
      ctx.fillRect(b.x, b.y, b.w, b.h);

      // Light top face (3px lighter tone) so they read as 3D blocks
      ctx.fillStyle = b.palette.glass;
      ctx.fillRect(b.x, b.y, b.w, 3);

      // Inner Roof Level 1
      ctx.fillStyle = b.palette.roof;
      ctx.fillRect(b.x + 8, b.y + 8, b.w - 16, b.h - 16);

      // Inner Roof Level 2
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(b.x + 16, b.y + 16, b.w - 32, b.h - 32);

      // Rooftop AC boxes and water tanks
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(b.x + 24, b.y + 24, 18, 14); // AC box 1
      ctx.fillRect(b.x + b.w - 42, b.y + 26, 14, 16); // AC box 2
      ctx.beginPath();
      ctx.arc(b.x + b.w - 32, b.y + b.h - 32, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Neon accent
      ctx.strokeStyle = b.palette.neon;
      ctx.lineWidth = 3;
      ctx.strokeRect(b.x + 12, b.y + 12, b.w - 24, b.h - 24);

      // Vary window colours slightly per building
      const winVariation = (b.x * 3 + b.y * 7) % 3;
      const winColors = [b.palette.glass, b.palette.neon, '#fef08a'];
      ctx.fillStyle = winColors[winVariation];

      for (let wx = b.x + 22; wx < b.x + b.w - 18; wx += 24) {
        for (let wy = b.y + 22; wy < b.y + b.h - 18; wy += 28) {
          if ((wx + wy) % 5 !== 0) {
            ctx.fillRect(wx, wy, 10, 16);
          }
        }
      }
    }

    // Palm trees with trunk + fronds along boulevard and parks
    for (const t of this.palmTrees) {
      // Trunk shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.arc(t.x + 3, t.y + 3, 6, 0, Math.PI * 2);
      ctx.fill();

      // Trunk
      ctx.fillStyle = '#a16207';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Fronds with dark rim
      ctx.fillStyle = '#166534';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.ellipse(t.x + Math.cos(a) * 14, t.y + Math.sin(a) * 14, 16, 7, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#22c55e';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.ellipse(t.x + Math.cos(a) * 10, t.y + Math.sin(a) * 10, 12, 5, a, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
