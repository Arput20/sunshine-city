// missions.js - Story missions for Sunshine City

export class MissionManager {
  constructor() {
    this.missions = [
      { title: "Mission 1: Beachside Meet", objective: "Go to the neon pier and meet Slick.", x: 1200, y: 1500, completed: false },
      { title: "Mission 2: Boulevard Heist", objective: "Steal the red sports car and lose the cops.", x: 2500, y: 2200, completed: false },
      { title: "Mission 3: Sunset Showdown", objective: "Eliminate rival syndicate boss at the marina.", x: 4000, y: 3500, completed: false }
    ];
    this.currentMissionIndex = 0;
  }

  getCurrentMission() {
    return this.missions[this.currentMissionIndex] || null;
  }

  checkProgress(playerX, playerY) {
    const m = this.getCurrentMission();
    if (!m || m.completed) return false;

    const dist = Math.hypot(playerX - m.x, playerY - m.y);
    if (dist < 80) {
      m.completed = true;
      this.currentMissionIndex++;
      return true;
    }
    return false;
  }

  render(ctx) {
    const m = this.getCurrentMission();
    if (!m || m.completed) return;

    // Pulsing mission marker (Yellow/Gold ring and star)
    const pulse = 20 + Math.sin(Date.now() / 200) * 5;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(m.x, m.y, pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}
