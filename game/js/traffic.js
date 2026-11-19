// traffic.js - AI traffic cars correctly aligned on road lanes for Sunshine City

import { Vehicle } from './vehicle.js';

export class TrafficManager {
  constructor(city) {
    this.city = city;
    this.cars = [];
    this.spawnCars();
  }

  spawnCars() {
    const palettes = ['#facc15', '#f97316', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];
    
    // Spawn moving cars on road grid lanes
    const roadSpacing = this.city.blockSize;
    for (let x = 100; x < this.city.width - 100; x += roadSpacing) {
      for (let y = 100; y < this.city.height - 100; y += roadSpacing) {
        // Horizontal lane car
        const isBus = Math.random() < 0.15;
        const color = palettes[Math.floor(Math.random() * palettes.length)];
        const carH = new Vehicle(x + 50, y + 20, color, isBus);
        carH.speed = 3 + Math.random() * 3;
        carH.angle = 0;
        this.cars.push(carH);

        // Vertical lane car
        const carV = new Vehicle(x + 20, y + 100, palettes[Math.floor(Math.random() * palettes.length)], false);
        carV.speed = 3 + Math.random() * 3;
        carV.angle = Math.PI / 2;
        this.cars.push(carV);
      }
    }

    // Spawn parked cars at curbs
    for (let i = 0; i < 20; i++) {
      const parkX = 150 + Math.random() * (this.city.width - 300);
      const parkY = 150 + Math.random() * (this.city.height - 300);
      const parkedCar = new Vehicle(parkX, parkY, palettes[Math.floor(Math.random() * palettes.length)], false);
      parkedCar.speed = 0;
      parkedCar.angle = Math.random() > 0.5 ? 0 : Math.PI / 2;
      this.cars.push(parkedCar);
    }
  }

  update() {
    for (const car of this.cars) {
      if (car.speed === 0) continue; // Parked cars stay parked

      car.x += Math.cos(car.angle) * car.speed;
      car.y += Math.sin(car.angle) * car.speed;

      // Wrap around grid boundaries smoothly
      if (car.x < 50) car.x = this.city.width - 50;
      if (car.x > this.city.width - 50) car.x = 50;
      if (car.y < 50) car.y = this.city.height - 50;
      if (car.y > this.city.height - 50) car.y = 50;
    }
  }

  render(ctx) {
    for (const car of this.cars) {
      car.render(ctx);
    }
  }
}
