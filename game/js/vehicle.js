// vehicle.js - Vehicle physics and controls for Sunshine City

export class Vehicle {
  constructor(x, y, color = '#ef4444') {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = 12;
    this.acceleration = 0.2;
    this.braking = 0.4;
    this.friction = 0.05;
    this.turnSpeed = 0.04;
    this.width = 44;
    this.height = 24;
    this.color = color;
    this.health = 100;
    this.isDriven = false;
  }

  update(keys, city) {
    if (!this.isDriven) {
      // Apply slight friction when idle
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

    // Boundary check
    this.x = Math.max(50, Math.min(city.width - 50, this.x));
    this.y = Math.max(50, Math.min(city.height - 50, this.y));
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Car Body
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Windshield & Roof
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5, -this.height / 2 + 4, 16, this.height - 8);

    // Headlights
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(this.width / 2 - 4, -this.height / 2 + 2, 4, 6);
    ctx.fillRect(this.width / 2 - 4, this.height / 2 - 8, 4, 6);

    ctx.restore();
  }
}
