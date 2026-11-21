// hud.js - Pass 2: High-Performance HUD, Minimap & Pause Menu for Sunshine City
export class HUD {
  constructor() {
    this.cash = 285000;
  }

  addCash(amount) {
    this.cash += amount;
  }

  render(ctx, player, police, mission, city, canvasWidth, canvasHeight, traffic = null, policeManager = null) {
    ctx.save();

    const drawPanel = (x, y, w, h, borderColor = '#334155', bgColor = 'rgba(15, 23, 42, 0.9)') => {
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();
    };

    // 1. Top Left Panel: Health & Armor with icons
    drawPanel(20, 20, 220, 75);

    // Health Icon (Cross)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(32, 33, 10, 4);
    ctx.fillRect(35, 30, 4, 10);

    // Armor Icon (Shield/Square)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(32, 60, 10, 10);

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('HEALTH', 50, 40);
    ctx.fillText('ARMOR', 50, 70);

    // Health Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(100, 30, 125, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(100, 30, (Math.max(0, player.health) / 100) * 125, 12);

    // Armor Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(100, 60, 125, 12);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(100, 60, (Math.max(0, player.armor) / 100) * 125, 12);

    // Speedometer Panel (if in vehicle)
    if (player.inVehicle) {
      const speedKmH = Math.round(Math.abs(player.inVehicle.speed) * 16);
      drawPanel(20, 105, 140, 50);
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText('SPEED (KM/H)', 32, 122);
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${speedKmH} KM/H`, 32, 145);
    }

    // 2. Top Center Panel: Sunshine City Wordmark
    const topCenterW = 260;
    const topCenterX = canvasWidth / 2 - topCenterW / 2;
    drawPanel(topCenterX, 20, topCenterW, 75, '#38bdf8', 'rgba(15, 23, 42, 0.9)');

    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText('S U N S H I N E   C I T Y', canvasWidth / 2, 53);
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('OPEN WORLD ACTION', canvasWidth / 2, 70);

    // 3. Top Right Panel: Cash & Wanted Stars (0-5)
    const topRightX = canvasWidth - 260;
    drawPanel(topRightX, 20, 240, 75);

    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'right';
    ctx.fillText(`$${this.cash.toLocaleString()}`, topRightX + 220, 44);

    let starsText = '';
    for (let i = 0; i < 5; i++) {
      starsText += i < police.wantedLevel ? '★ ' : '☆ ';
    }
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'right';
    ctx.fillText(starsText.trim(), topRightX + 220, 66);

    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'left';
    ctx.fillText('WANTED', topRightX + 20, 65);

    // 4. Bottom Center: Active Mission Banner
    const currentMission = mission.getCurrentMission();
    if (currentMission && !currentMission.completed) {
      const bannerW = 640;
      const bannerH = 65;
      const bannerX = canvasWidth / 2 - bannerW / 2;
      const bannerY = canvasHeight - 90;

      drawPanel(bannerX, bannerY, bannerW, bannerH, '#38bdf8', 'rgba(15, 23, 42, 0.92)');

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentMission.title.toUpperCase(), canvasWidth / 2, bannerY + 25);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(currentMission.description, canvasWidth / 2, bannerY + 48);
    }

    // 5. Bottom Left Corner: Minimap with blips
    const mapSize = 180;
    const mapX = 30;
    const mapY = canvasHeight - mapSize - 30;

    drawPanel(mapX, mapY, mapSize, mapSize, '#38bdf8', 'rgba(15, 23, 42, 0.9)');

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
    ctx.clip();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    for (let i = 0; i < mapSize; i += 45) {
      ctx.beginPath();
      ctx.moveTo(mapX + i, mapY);
      ctx.lineTo(mapX + i, mapY + mapSize);
      ctx.moveTo(mapX, mapY + i);
      ctx.lineTo(mapX + mapSize, mapY + i);
      ctx.stroke();
    }

    // Mission blip on minimap
    if (currentMission && !currentMission.completed) {
      let mx = currentMission.x || (currentMission.pickup ? currentMission.pickup.x : 0);
      let my = currentMission.y || (currentMission.pickup ? currentMission.pickup.y : 0);
      const mMinimapX = mapX + (mx / city.width) * mapSize;
      const mMinimapY = mapY + (my / city.height) * mapSize;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(mMinimapX, mMinimapY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Police blips on minimap
    if (policeManager && policeManager.policeUnits) {
      const flash = Math.floor(Date.now() / 200) % 2 === 0;
      ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
      for (let i = 0; i < policeManager.policeUnits.length; i++) {
        const p = policeManager.policeUnits[i];
        const pMapX = mapX + (p.x / city.width) * mapSize;
        const pMapY = mapY + (p.y / city.height) * mapSize;
        ctx.fillRect(pMapX - 2, pMapY - 2, 5, 5);
      }
    }

    // Player blip on minimap
    const pMinimapX = mapX + (player.x / city.width) * mapSize;
    const pMinimapY = mapY + (player.y / city.height) * mapSize;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pMinimapX, pMinimapY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }
}
