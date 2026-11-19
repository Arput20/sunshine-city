// vehicle.js - Polished vehicle physics and rendering for Sunshine City

export class Vehicle {
  constructor(x, y, color = '#ef4444', isBus = false, isPlayerCar = false) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = isBus ? 8 : (isPlayerCar ? 16 : 14);
    this.acceleration = 0.25;
    this.braking = 0.45;
    this.friction = 0.04;
    this.turnSpeed = 0.045;
    this.isPlayerCar = isPlayerCar;
    this.width = isBus ? 64 : (isPlayerCar ? 72 : 40);
    this.height = isBus ? 28 : (isPlayerCar ? 32 : 20);
    this.color = color;
    this.isBus = isBus;
    this.health = 100;
    this.isDriven = false;
    this.hasWhiteStripe = false;
  }

  update(keys, city) {
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

    this.x = Math.max(50, Math.min(city.width - 50, this.x));
    this.y = Math.max(50, Math.min(city.height - 50, this.y));
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Headlight cones (subtle golden glow ahead)
    ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2 + 100, -this.height / 2 - 50);
    ctx.lineTo(this.width / 2 + 100, this.height / 2 + 50);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.fill();

    // Subtle drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-this.width / 2 + 6, -this.height / 2 + 6, this.width, this.height);

    // Two-tone rounded body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
    ctx.fill();

    // White racing stripe if enabled
    if (this.hasWhiteStripe) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-this.width / 2, -4, this.width, 8);
    }

    // Roof / Windshield
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, -this.height / 2 + 4, this.isBus ? 34 : 24, this.height - 8);

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(this.width / 2 - 6, -this.height / 2 + 3, 6, 6);
    ctx.fillRect(this.width / 2 - 6, this.height / 2 - 9, 6, 6);

    // Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-this.width / 2, -this.height / 2 + 3, 4, 6);
    ctx.fillRect(-this.width / 2, this.height / 2 - 9, 4, 6);

    ctx.restore();
  }
}
