// police.js - Pass 2: High-Performance Escalating Police AI & Wanted Stars System for Sunshine City
export class PoliceManager {
  constructor(city) {
    this.city = city;
    this.wantedLevel = 0;
    this.policeUnits = [];
    this.roadblocks = [];
    this.decayTimer = 0;
  }

  update(dt, playerX, playerY, playerVx, playerVy) {
    // Wanted star decay when out of sight of all police units (> 950px)
    if (this.wantedLevel > 0 && this.policeUnits.length > 0) {
      let maxDist = 0;
      for (let i = 0; i < this.policeUnits.length; i++) {
        const u = this.policeUnits[i];
        const dist = Math.hypot(playerX - u.x, playerY - u.y);
        if (dist > maxDist) maxDist = dist;
      }
      if (maxDist > 950) {
        this.decayTimer += dt;
        if (this.decayTimer > 7) {
          this.wantedLevel = Math.max(0, this.wantedLevel - 1);
          this.decayTimer = 0;
          if (this.wantedLevel === 0) {
            this.policeUnits = [];
            this.roadblocks = [];
          }
        }
      } else {
        this.decayTimer = 0;
      }
    }

    // Maintain police units count based on wanted level (0-5)
    const targetCount = this.wantedLevel * 3;
    if (this.wantedLevel > 0 && this.policeUnits.length < targetCount) {
      for (let i = this.policeUnits.length; i < targetCount; i++) {
        this.policeUnits.push({
          x: playerX + (Math.random() - 0.5) * 1500,
          y: playerY + (Math.random() - 0.5) * 1500,
          speed: 4.2 + this.wantedLevel * 0.75,
          angle: Math.random() * Math.PI * 2,
          state: 'patrol'
        });
      }
    } else if (this.wantedLevel === 0) {
      this.policeUnits = [];
      this.roadblocks = [];
    }

    // Roadblocks deployment at 4+ wanted stars ahead of player trajectory
    if (this.wantedLevel >= 4 && this.roadblocks.length === 0) {
      const aheadX = playerX + (playerVx || 0) * 50;
      const aheadY = playerY + (playerVy || 0) * 50;
      this.roadblocks.push(
        { x: aheadX + 120, y: aheadY },
        { x: aheadX - 120, y: aheadY }
      );
    } else if (this.wantedLevel < 4) {
      this.roadblocks = [];
    }

    // Update police units AI behavior across escalation tiers
    for (let i = 0; i < this.policeUnits.length; i++) {
      const u = this.policeUnits[i];
      const dx = playerX - u.x;
      const dy = playerY - u.y;
      const dist = Math.hypot(dx, dy);

      if (this.wantedLevel === 1) {
        // 1 Star: Patrol & Investigate
        u.state = 'investigate';
        if (dist > 35) {
          u.angle = Math.atan2(dy, dx);
          u.x += (dx / dist) * u.speed * 0.8;
          u.y += (dy / dist) * u.speed * 0.8;
        }
      } else if (this.wantedLevel === 2 || this.wantedLevel === 3) {
        // 2-3 Stars: Pursue & PIT Maneuver
        u.state = 'pit';
        const targetX = playerX + (playerVx || 0) * 20;
        const targetY = playerY + (playerVy || 0) * 20;
        const pdx = targetX - u.x;
        const pdy = targetY - u.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 15) {
          u.angle = Math.atan2(pdy, pdx);
          u.x += (pdx / pdist) * (u.speed * 1.3);
          u.y += (pdy / pdist) * (u.speed * 1.3);
        }
      } else if (this.wantedLevel >= 4) {
        // 4+ Stars: Aggressive swarm pursuit
        u.state = 'aggressive';
        if (dist > 15) {
          u.angle = Math.atan2(dy, dx);
          u.x += (dx / dist) * (u.speed * 1.6);
          u.y += (dy / dist) * (u.speed * 1.6);
        }
      }
    }
  }

  render(ctx) {
    // Render roadblocks
    for (let i = 0; i < this.roadblocks.length; i++) {
      const rb = this.roadblocks[i];
      ctx.save();
      ctx.translate(rb.x, rb.y);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-24, -10, 48, 20);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-18, -6, 36, 12);
      ctx.restore();
    }

    // Render police cruiser units
    for (let i = 0; i < this.policeUnits.length; i++) {
      const u = this.policeUnits[i];
      ctx.save();
      ctx.translate(u.x, u.y);
      ctx.rotate(u.angle);
      ctx.scale(1.25, 1.25);

      // Police cruiser body
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-22, -13, 44, 26, 6);
      ctx.fill();

      // Police side decals / trim
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -13, 16, 26);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-6, -10, 12, 20);

      const flash = Math.floor(Date.now() / 130) % 2 === 0;
      ctx.shadowBlur = 14;
      ctx.shadowColor = flash ? '#ef4444' : '#3b82f6';

      // Light bar
      ctx.fillStyle = flash ? '#ef4444' : '#93c5fd';
      ctx.beginPath();
      ctx.roundRect(-4, -10, 8, 4, 2);
      ctx.fill();

      ctx.fillStyle = flash ? '#93c5fd' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-4, 6, 8, 4, 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
}
