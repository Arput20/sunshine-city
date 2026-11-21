// player.js - Player character movement and actions for Sunshine City

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 3.5;
    this.angle = 0;
    this.health = 100;
    this.armor = 100;
    this.inVehicle = null;
  }

  update(keys, city, effects) {
    if (this.inVehicle) {
      this.inVehicle.update(keys, city, effects);
      this.x = this.inVehicle.x;
      this.y = this.inVehicle.y;
      this.angle = this.inVehicle.angle;
      return;
    }

    let dx = 0;
    let dy = 0;

    const moveSpeed = keys['ShiftLeft'] ? this.speed * 1.6 : this.speed;

    if (keys['KeyW'] || keys['ArrowUp']) dy -= moveSpeed;
    if (keys['KeyS'] || keys['ArrowDown']) dy += moveSpeed;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= moveSpeed;
    if (keys['KeyD'] || keys['ArrowRight']) dx += moveSpeed;

    if (dx !== 0 || dy !== 0) {
      this.angle = Math.atan2(dy, dx);
    }

    this.x += dx;
    this.y += dy;

    // Boundary check
    this.x = Math.max(50, Math.min(city.width - 50, this.x));
    this.y = Math.max(50, Math.min(city.height - 50, this.y));
  }

  render(ctx) {
    if (this.inVehicle) return; // Rendered inside vehicle when driving

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Player body (cyan jacket, sunglasses)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Aiming gun barrel
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(4, -3, 12, 6);

    ctx.restore();
  }
}
