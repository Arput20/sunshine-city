// hud.js - Heads Up Display and Minimap for Sunshine City

export class HUD {
  constructor() {
    this.cash = 2500;
  }

  render(ctx, player, police, mission, city, canvasWidth, canvasHeight) {
    ctx.save();

    // Top Right: Cash & Wanted Stars
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'right';
    ctx.fillText(`$${this.cash.toLocaleString()}`, canvasWidth - 30, 40);

    // Wanted Stars
    let starsText = '';
    for (let i = 0; i < 5; i++) {
      starsText += i < police.wantedLevel ? '★' : '☆';
    }
    ctx.fillStyle = '#facc15';
    ctx.fillText(starsText, canvasWidth - 30, 70);

    // Top Left: Health & Armor bars
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(20, 20, 200, 50);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(30, 30, (player.health / 100) * 180, 12);

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(30, 50, (player.armor / 100) * 180, 12);

    // Bottom Center: Mission Objective Banner
    const currentMission = mission.getCurrentMission();
    if (currentMission) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(canvasWidth / 2 - 300, canvasHeight - 90, 600, 65);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvasWidth / 2 - 300, canvasHeight - 90, 600, 65);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentMission.title, canvasWidth / 2, canvasHeight - 62);
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(currentMission.objective, canvasWidth / 2, canvasHeight - 40);
    }

    // Top Right Corner: Minimap
    const mapSize = 160;
    const mapX = canvasWidth - mapSize - 30;
    const mapY = 90;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);

    // Minimap player dot
    const pMinimapX = mapX + (player.x / city.width) * mapSize;
    const pMinimapY = mapY + (player.y / city.height) * mapSize;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pMinimapX, pMinimapY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
