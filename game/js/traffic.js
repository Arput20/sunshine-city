// traffic.js - AI traffic cars for Sunshine City

import { Vehicle } from './vehicle.js';

export class TrafficManager {
  constructor(city) {
    this.city = city;
    this.cars = [];
    this.spawnCars();
  }

  spawnCars() {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
    for (let i = 0; i < 25; i++) {
      const x = 200 + Math.random() * (this.city.width - 400);
      const y = 200 + Math.random() * (this.city.height - 400);
      const car = new Vehicle(x, y, colors[Math.floor(Math.random() * colors.length)]);
      car.speed = 2 + Math.random() * 3;
      car.angle = Math.random() > 0.5 ? 0 : Math.PI / 2;
      this.cars.push(car);
    }
  }

  update() {
    for (const car of this.cars) {
      car.x += Math.cos(car.angle) * car.speed;
      car.y += Math.sin(car.angle) * car.speed;

      // Wrap around or turn at boundaries
      if (car.x < 100 || car.x > this.city.width - 100 || Math.random() < 0.02) {
        car.angle += Math.PI / 2;
      }
      if (car.y < 100 || car.y > this.city.height - 100 || Math.random() < 0.02) {
        car.angle += Math.PI / 2;
      }
    }
  }

  render(ctx) {
    for (const car of this.cars) {
      car.render(ctx);
    }
  }
}
