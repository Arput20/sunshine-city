// vehicle.js - Two-tone procedural vehicle sprites, physics, wheels, windshields, headlights, and taillights for Sunshine City

export class Vehicle {
  constructor(x, y, color = '#ef4444', isBus = false, isPlayerCar = false) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = isBus ? 7 : (isPlayerCar ? 16 : 13);
    this.acceleration = 0.24;
    this.braking = 0.45;
    this.friction = 0.035;
    this.turnSpeed = 0.05;
    this.isPlayerCar = isPlayerCar;
    this.width = isBus ? 70 : (isPlayerCar ? 76 : 46);
    this.height = isBus ? 32 : (isPlayerCar ? 36 : 24);
    this.color = color;
    this.secondaryColor = '#0f172a';
    this.isBus = isBus;
    this.health = 100;
    this.isDriven = false;
    this.hasWhiteStripe = Math.random() > 0.4;
    this.suspensionOffset = 0;
    this.bounceTimer = 0;
    this.lastSkidX = null;
    this.lastSkidY = null;
  }

  update(keys, city, effects) {
    if (!this.isDriven) {
      this.speed *= (1 - this.friction);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.x += this.vx;
      this.y += this.vy;
      return;
    }

    if (keys['KeyW'] || keys['ArrowUp']) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
    } else if (keys['KeyS'] || keys['ArrowDown']) {
      this.speed = Math.max(-this.maxSpeed / 2, this.speed - this.braking);
    } else {
      this.speed *= (1 - this.friction);
    }

    if (Math.abs(this.speed) > 0.5) {
      const turnMultiplier = Math.sign(this.speed);
      if (keys['KeyA'] || keys['ArrowLeft']) {
        this.angle -= this.turnSpeed * turnMultiplier;
      }
      if (keys['KeyD'] || keys['ArrowRight']) {
        this.angle += this.turnSpeed * turnMultiplier;
      }
    }

    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    this.x = Math.max(60, Math.min(city.width - 60, this.x));
    this.y = Math.max(60, Math.min(city.height - 60, this.y));

    // Suspension bounce & skid marks / dust
    this.bounceTimer += Math.abs(this.speed) * 0.12;
    this.suspensionOffset = Math.sin(this.bounceTimer) * (Math.abs(this.speed) * 0.22);

    if (effects && Math.abs(this.speed) > 4) {
      const rearX = this.x - Math.cos(this.angle) * (this.width * 0.3);
      const rearY = this.y - Math.sin(this.angle) * (this.width * 0.3);
      if (city.isOffroad && city.isOffroad(this.x, this.y)) {
        effects.addDust(rearX, rearY);
      } else if (keys['KeyS'] || keys['ArrowDown'] || Math.abs(this.speed) > 10) {
        if (this.lastSkidX && this.lastSkidY) {
          effects.addSkidMark(this.lastSkidX, this.lastSkidY, rearX, rearY);
        }
        this.lastSkidX = rearX;
        this.lastSkidY = rearY;
      } else {
        this.lastSkidX = null;
        this.lastSkidY = null;
      }
    } else {
      this.lastSkidX = null;
      this.lastSkidY = null;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(0, this.suspensionOffset);

    // Headlight beams
    ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2 + 130, -this.height / 2 - 65);
    ctx.lineTo(this.width / 2 + 130, this.height / 2 + 65);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#020617';
    ctx.fillRect(-this.width * 0.35, -this.height / 2 - 5, 16, 6);
    ctx.fillRect(-this.width * 0.35, this.height / 2 - 1, 16, 6);
    ctx.fillRect(this.width * 0.15, -this.height / 2 - 5, 16, 6);
    ctx.fillRect(this.width * 0.15, this.height / 2 - 1, 16, 6);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-this.width / 2 + 6, -this.height / 2 + 6, this.width, this.height);

    // Main Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 9);
    ctx.fill();

    // Cabin / Roof
    ctx.fillStyle = this.secondaryColor;
    ctx.beginPath();
    ctx.roundRect(-this.width * 0.22, -this.height / 2 + 4, this.width * 0.52, this.height - 8, 5);
    ctx.fill();

    // Racing stripe
    if (this.hasWhiteStripe) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-this.width / 2, -3.5, this.width, 7);
    }

    // Windshield & Rear glass
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(6, -this.height / 2 + 6, 12, this.height - 12);
    ctx.fillRect(-16, -this.height / 2 + 6, 8, this.height - 12);

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(this.width / 2 - 5, -this.height / 2 + 3, 5, 6);
    ctx.fillRect(this.width / 2 - 5, this.height / 2 - 9, 5, 6);

    // Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-this.width / 2, -this.height / 2 + 3, 4, 6);
    ctx.fillRect(-this.width / 2, this.height / 2 - 9, 4, 6);

    ctx.restore();
  }
}
