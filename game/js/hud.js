// hud.js - Heads Up Display with labelled bars, wanted stars, bottom-left minimap for Sunshine City

export class HUD {
  constructor() {
    this.cash = 2500;
  }

  render(ctx, player, police, mission, city, canvasWidth, canvasHeight, traffic = null, policeManager = null) {
    ctx.save();

    // Top Right: Cash & Wanted Stars
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'right';
    ctx.fillText(`$${this.cash.toLocaleString()}`, canvasWidth - 30, 45);

    // Wanted Stars
    let starsText = '';
    for (let i = 0; i < 5; i++) {
      starsText += i < police.wantedLevel ? '★ ' : '☆ ';
    }
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.fillText(starsText.trim(), canvasWidth - 30, 75);

    // Top Left: Health & Armor bars with tiny caps text labels
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(20, 20, 220, 75);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 220, 75);

    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('HEALTH', 32, 38);
    ctx.fillText('ARMOR', 32, 70);

    // Health Bar
    ctx.fillStyle = '#334155';
    ctx.fillRect(90, 28, 135, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(90, 28, (Math.max(0, player.health) / 100) * 135, 12);

    // Armor Bar
    ctx.fillStyle = '#334155';
    ctx.fillRect(90, 60, 135, 12);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(90, 60, (Math.max(0, player.armor) / 100) * 135, 12);

    // Bottom Center: Mission Objective Banner with Drop Shadow
    const currentMission = mission.getCurrentMission();
    if (currentMission) {
      const bannerW = 620;
      const bannerH = 65;
      const bannerX = canvasWidth / 2 - bannerW / 2;
      const bannerY = canvasHeight - 90;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentMission.title, canvasWidth / 2, bannerY + 25);

      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(currentMission.objective, canvasWidth / 2, bannerY + 48);
      ctx.shadowBlur = 0; // Reset shadow
    }

    // Bottom Left Corner: Minimap showing road network, player arrow, police blips, mission marker
    const mapSize = 180;
    const mapX = 30;
    const mapY = canvasHeight - mapSize - 30;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);

    // Minimap Roads grid preview
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

    // Minimap Mission Marker (Yellow)
    if (currentMission && !currentMission.completed) {
      const mMinimapX = mapX + (currentMission.x / city.width) * mapSize;
      const mMinimapY = mapY + (currentMission.y / city.height) * mapSize;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(mMinimapX, mMinimapY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Minimap Police Blips (Flashing Red/Blue)
    if (policeManager && policeManager.policeUnits) {
      const flash = Math.floor(Date.now() / 200) % 2 === 0;
      ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
      for (const p of policeManager.policeUnits) {
        const pMapX = mapX + (p.x / city.width) * mapSize;
        const pMapY = mapY + (p.y / city.height) * mapSize;
        ctx.fillRect(pMapX - 2, pMapY - 2, 5, 5);
      }
    }

    // Minimap Player Arrow / Dot
    const pMinimapX = mapX + (player.x / city.width) * mapSize;
    const pMinimapY = mapY + (player.y / city.height) * mapSize;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pMinimapX, pMinimapY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
