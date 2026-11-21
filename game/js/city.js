// city.js - Procedural coastal city grid for Sunshine City with seafront, pier, 3D buildings, parked cars, streetlights, and day/night cycle

export class City {
  constructor(width = 6000, height = 6000) {
    this.width = width;
    this.height = height;
    this.blockSize = 320;
    this.roadWidth = 80;
    this.blocks = [];
    this.buildings = [];
    this.palmTrees = [];
    this.parkedCars = [];
    this.streetLights = [];
    this.timeOfDay = 0.25; // 0 to 1 (0 = dawn, 0.25 = day, 0.5 = sunset, 0.75 = night)
    this.dayDuration = 180; // 3 minutes per full cycle in seconds
    this.generate();
  }

  generate() {
    const cols = Math.floor(this.width / this.blockSize);
    const rows = Math.floor(this.height / this.blockSize);
    const vehicleColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff', '#1e293b'];

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * this.blockSize + this.roadWidth / 2;
        const y = r * this.blockSize + this.roadWidth / 2;
        const w = this.blockSize - this.roadWidth;
        const h = this.blockSize - this.roadWidth;

        const isBeach = c >= cols - 2;
        const isPark = (c + r * 3) % 8 === 2;

        this.blocks.push({ x, y, w, h, isBeach, isPark });

        if (isBeach) {
          for (let i = 0; i < 7; i++) {
            this.palmTrees.push({
              x: x + 20 + Math.random() * (w - 40),
              y: y + i * (h / 7) + Math.random() * 20
            });
          }
        } else if (isPark) {
          for (let i = 0; i < 9; i++) {
            this.palmTrees.push({
              x: x + 30 + Math.random() * (w - 60),
              y: y + 30 + Math.random() * (h - 60)
            });
          }
        } else {
          const isGlassTower = c >= cols - 4;
          const palettes = isGlassTower ? [
            { wall: '#0284c7', roof: '#0369a1', neon: '#38bdf8', glass: '#7dd3fc' },
            { wall: '#0369a1', roof: '#075985', neon: '#0284c7', glass: '#38bdf8' }
          ] : [
            { wall: '#b45309', roof: '#374151', neon: '#f43f5e', glass: '#fcd34d' },
            { wall: '#047857', roof: '#1f2937', neon: '#34d399', glass: '#a7f3d0' },
            { wall: '#1d4ed8', roof: '#1e293b', neon: '#60a5fa', glass: '#bfdbfe' },
            { wall: '#6d28d9', roof: '#111827', neon: '#a78bfa', glass: '#ddd6fe' },
            { wall: '#be185d', roof: '#1f2937', neon: '#f472b6', glass: '#fbcfe8' }
          ];
          const palette = palettes[(c * 5 + r * 11) % palettes.length];
          const floors = 3 + ((c * 3 + r * 7) % 7);

          const windows = [];
          for (let wx = 16; wx < w - 24; wx += 22) {
            for (let wy = 16; wy < h - 24; wy += 22) {
              windows.push({ x: wx, y: wy, lit: Math.random() > 0.35 });
            }
          }

          const rooftopDetails = [
            { rx: w * 0.3, ry: h * 0.3, rw: 24, rh: 16 },
            { rx: w * 0.6, ry: h * 0.5, rw: 18, rh: 22 },
            { rx: w * 0.4, ry: h * 0.7, rw: 20, rh: 20 }
          ];

          this.buildings.push({
            x: x + 10,
            y: y + 10,
            w: w - 20,
            h: h - 20,
            floors,
            palette,
            windows,
            rooftopDetails
          });

          if ((c + r) % 3 === 0) {
            this.parkedCars.push({
              x: x - 18,
              y: y + h / 2,
              angle: 0,
              color: vehicleColors[(c + r) % vehicleColors.length]
            });
          }
        }
      }
    }

    // Add streetlights at intersection corners
    for (let x = 0; x <= this.width; x += this.blockSize) {
      for (let y = 0; y <= this.height; y += this.blockSize) {
        this.streetLights.push({ x: x - this.roadWidth / 4, y: y - this.roadWidth / 4 });
      }
    }
  }

  update(dt = 0.016) {
    this.timeOfDay = (this.timeOfDay + dt / this.dayDuration) % 1;
  }

  isOffroad(x, y) {
    for (const b of this.blocks) {
      if (x >= b.x - 6 && x <= b.x + b.w + 6 && y >= b.y - 6 && y <= b.y + b.h + 6) {
        return true;
      }
    }
    return false;
  }

  render(ctx, camera) {
    const time = Date.now() / 1000;
    const isNight = this.timeOfDay > 0.7 || this.timeOfDay < 0.2;
    const isSunset = this.timeOfDay >= 0.45 && this.timeOfDay <= 0.7;

    // Ocean / Bay background
    ctx.fillStyle = isNight ? '#030712' : '#0a1128';
    ctx.fillRect(0, 0, this.width, this.height);

    // Asphalt Roads Grid
    ctx.fillStyle = isNight ? '#0f172a' : '#1e293b';
    ctx.fillRect(0, 0, this.width, this.height);

    // Blocks, Parks, Beach, Bay & Pier
    for (const b of this.blocks) {
      if (b.isBeach) {
        ctx.fillStyle = isNight ? '#292514' : '#fef08a';
        ctx.fillRect(b.x - 24, b.y - 24, b.w + 48, b.h + 48);
        
        ctx.fillStyle = isNight ? '#082f49' : '#06b6d4';
        ctx.fillRect(b.x + b.w / 2, b.y - 24, b.w / 2 + 200, b.h + 48);

        ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.35)' : '#a5f3fc';
        ctx.lineWidth = 2;
        let waveOffset = Math.sin(time * 2.5) * 6;
        for (let wy = b.y; wy < b.y + b.h; wy += 32) {
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2 + 20, wy + waveOffset);
          ctx.quadraticCurveTo(b.x + b.w / 2 + 60, wy + 16 - waveOffset, b.x + b.w + 140, wy + waveOffset);
          ctx.stroke();
        }

        const pierY = b.y + b.h / 2 - 24;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x + b.w / 2, pierY + 6, 200, 40);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(b.x + b.w / 2, pierY, 200, 32);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        for (let px = b.x + b.w / 2 + 20; px < b.x + b.w / 2 + 200; px += 25) {
          ctx.beginPath();
          ctx.moveTo(px, pierY);
          ctx.lineTo(px, pierY + 32);
          ctx.stroke();
        }

      } else if (b.isPark) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
        ctx.fillStyle = isNight ? '#064e3b' : '#15803d';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = isNight ? '#047857' : '#22c55e';
        ctx.fillRect(b.x + 12, b.y + 12, b.w - 24, b.h - 24);

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.h / 2);
        ctx.lineTo(b.x + b.w, b.y + b.h / 2);
        ctx.moveTo(b.x + b.w / 2, b.y);
        ctx.lineTo(b.x + b.w / 2, b.y + b.h);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#475569';
        ctx.fillRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    }

    // Road markings
    ctx.strokeStyle = isSunset ? '#fde047' : '#facc15';
    ctx.lineWidth = 3;
    ctx.setLineDash([24, 24]);
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

    // Crosswalks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let x = this.roadWidth / 2; x < this.width; x += this.blockSize) {
      for (let y = this.roadWidth / 2; y < this.height; y += this.blockSize) {
        const bx = x - this.roadWidth / 2;
        const by = y - this.roadWidth / 2;
        for (let i = -16; i <= 16; i += 8) {
          ctx.fillRect(bx + i, by - 16, 6, 12);
          ctx.fillRect(bx - 16, by + i, 12, 6);
        }
      }
    }

    // Streetlights & night glow cones
    for (const sl of this.streetLights) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(sl.x, sl.y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (isNight) {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
        ctx.beginPath();
        ctx.arc(sl.x, sl.y, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sl.x - 2, sl.y - 2, 4, 4);
      }
    }

    // Parked cars
    for (const pc of this.parkedCars) {
      ctx.save();
      ctx.translate(pc.x, pc.y);
      ctx.rotate(pc.angle);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(-22, -12, 44, 24);
      ctx.fillStyle = pc.color;
      ctx.beginPath();
      ctx.roundRect(-20, -10, 40, 20, 6);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -8, 16, 16);
      ctx.restore();
    }

    // Buildings
    for (const b of this.buildings) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(b.x + 10, b.y + 10, b.w, b.h);

      ctx.fillStyle = isNight ? '#0b0f19' : b.palette.wall;
      ctx.fillRect(b.x, b.y, b.w, b.h);

      ctx.fillStyle = b.palette.glass;
      ctx.fillRect(b.x, b.y, b.w, 4);

      ctx.fillStyle = b.palette.roof;
      ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);

      for (const rd of b.rooftopDetails) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x + rd.rx, b.y + rd.ry, rd.rw, rd.rh);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(b.x + rd.rx + 4, b.y + rd.ry + 4, rd.rw - 8, rd.rh - 8);
      }

      for (const win of b.windows) {
        if (isNight || isSunset) {
          ctx.fillStyle = win.lit ? b.palette.neon : '#111827';
        } else {
          ctx.fillStyle = win.lit ? '#f8fafc' : '#475569';
        }
        ctx.fillRect(b.x + win.x, b.y + win.y, 10, 14);
      }

      if (isNight) {
        ctx.strokeStyle = b.palette.neon;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    }

    // Palm & Park trees
    for (const tree of this.palmTrees) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.arc(tree.x + 6, tree.y + 6, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(tree.x, tree.y);
      ctx.lineTo(tree.x + 4, tree.y - 12);
      ctx.stroke();

      ctx.fillStyle = isNight ? '#065f46' : '#16a34a';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
        ctx.beginPath();
        ctx.ellipse(
          tree.x + 4 + Math.cos(a) * 10,
          tree.y - 12 + Math.sin(a) * 10,
          12,
          5,
          a,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Atmosphere overlays
    if (isNight) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
      ctx.fillRect(0, 0, this.width, this.height);
    } else if (isSunset) {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.18)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}
