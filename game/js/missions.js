// missions.js - Pass 2: Highly Optimized 4+ Mission System for Sunshine City
export class MissionManager {
  constructor() {
    this.missions = [
      {
        id: 1,
        type: 'delivery',
        title: 'BEACHSIDE PACKAGE DELIVERY',
        description: 'Pick up contraband briefcase at the pier and deliver it to the warehouse.',
        pickup: { x: 1200, y: 1500, reached: false },
        dropoff: { x: 2800, y: 1200, reached: false },
        reward: 5000,
        completed: false,
        active: true
      },
      {
        id: 2,
        type: 'chase',
        title: 'SYNDICATE CAR CHASE',
        description: 'Ram and disable the fleeing rival cartel sports car before it escapes.',
        target: { x: 2500, y: 2200, health: 100, maxHealth: 100, vx: 2, vy: 1 },
        reward: 10000,
        completed: false,
        active: false
      },
      {
        id: 3,
        type: 'race',
        title: 'SUNSET BOULEVARD TIME TRIAL',
        description: 'Navigate through all 5 checkpoint rings before the timer runs out.',
        checkpoints: [
          { x: 1000, y: 3000, passed: false },
          { x: 2000, y: 3500, passed: false },
          { x: 3500, y: 2800, passed: false },
          { x: 4200, y: 1800, passed: false },
          { x: 4000, y: 1000, passed: false }
        ],
        currentIndex: 0,
        timeLimit: 60,
        timeLeft: 60,
        reward: 8000,
        completed: false,
        active: false
      },
      {
        id: 4,
        type: 'protection',
        title: 'VIP CONVOY ESCORT',
        description: 'Escort and keep the VIP limousine alive as it drives across Sunshine City.',
        vip: { x: 1500, y: 3800, targetX: 4200, targetY: 1200, health: 100, maxHealth: 100, speed: 3.0 },
        reward: 15000,
        completed: false,
        active: false
      }
    ];
    this.currentMissionId = 1;
    this.uiOpen = false;
  }

  getCurrentMission() {
    return this.missions.find(m => m.id === this.currentMissionId) || this.missions[0];
  }

  selectMission(id) {
    const m = this.missions.find(item => item.id === id);
    if (m) {
      this.currentMissionId = id;
      m.active = true;
      if (m.type === 'delivery') {
        m.pickup.reached = false;
        m.dropoff.reached = false;
      } else if (m.type === 'chase') {
        m.target.health = m.target.maxHealth;
      } else if (m.type === 'race') {
        m.currentIndex = 0;
        m.timeLeft = m.timeLimit;
        for (let i = 0; i < m.checkpoints.length; i++) {
          m.checkpoints[i].passed = false;
        }
      } else if (m.type === 'protection') {
        m.vip.health = m.vip.maxHealth;
        m.vip.x = 1500;
        m.vip.y = 3800;
      }
    }
  }

  update(dt, playerX, playerY, hud) {
    const m = this.getCurrentMission();
    if (!m || m.completed) return;

    if (m.type === 'delivery') {
      if (!m.pickup.reached) {
        if (Math.hypot(playerX - m.pickup.x, playerY - m.pickup.y) < 70) {
          m.pickup.reached = true;
        }
      } else if (!m.dropoff.reached) {
        if (Math.hypot(playerX - m.dropoff.x, playerY - m.dropoff.y) < 70) {
          m.dropoff.reached = true;
          m.completed = true;
          hud.addCash(m.reward);
        }
      }
    } else if (m.type === 'chase') {
      const t = m.target;
      const angle = Math.atan2(playerY - t.y, playerX - t.x);
      t.x -= Math.cos(angle) * 3.2;
      t.y -= Math.sin(angle) * 3.2;
      if (Math.hypot(playerX - t.x, playerY - t.y) < 60) {
        t.health -= 1.2;
        if (t.health <= 0) {
          m.completed = true;
          hud.addCash(m.reward);
        }
      }
    } else if (m.type === 'race') {
      m.timeLeft -= dt;
      if (m.timeLeft <= 0) {
        m.timeLeft = m.timeLimit;
        m.currentIndex = 0;
        for (let i = 0; i < m.checkpoints.length; i++) {
          m.checkpoints[i].passed = false;
        }
      } else {
        const cp = m.checkpoints[m.currentIndex];
        if (cp && Math.hypot(playerX - cp.x, playerY - cp.y) < 80) {
          cp.passed = true;
          m.currentIndex++;
          if (m.currentIndex >= m.checkpoints.length) {
            m.completed = true;
            hud.addCash(m.reward);
          }
        }
      }
    } else if (m.type === 'protection') {
      const vip = m.vip;
      const dx = vip.targetX - vip.x;
      const dy = vip.targetY - vip.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 20) {
        vip.x += (dx / dist) * vip.speed;
        vip.y += (dy / dist) * vip.speed;
      } else {
        m.completed = true;
        hud.addCash(m.reward);
      }
      if (Math.hypot(playerX - vip.x, playerY - vip.y) > 550) {
        vip.health -= dt * 4.5;
        if (vip.health <= 0) {
          vip.health = vip.maxHealth;
          vip.x = 1500;
          vip.y = 3800;
        }
      }
    }
  }

  render(ctx) {
    const m = this.getCurrentMission();
    if (!m || m.completed) return;
    const pulse = 22 + Math.sin(Date.now() / 200) * 6;

    if (m.type === 'delivery') {
      const target = !m.pickup.reached ? m.pickup : m.dropoff;
      ctx.strokeStyle = !m.pickup.reached ? '#facc15' : '#4ade80';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(target.x, target.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    } else if (m.type === 'chase') {
      const t = m.target;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(t.x, t.y, pulse + 12, 0, Math.PI * 2);
      ctx.stroke();
    } else if (m.type === 'race') {
      const cp = m.checkpoints[m.currentIndex];
      if (cp) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, pulse + 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (m.type === 'protection') {
      const vip = m.vip;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(vip.x, vip.y, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  renderMissionListUI(ctx, width, height) {
    if (!this.uiOpen) return;
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.fillRect(width / 2 - 350, height / 2 - 240, 700, 480);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 350, height / 2 - 240, 700, 480);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION SELECTOR (PRESS M TO CLOSE)', width / 2, height / 2 - 190);

    let startY = height / 2 - 140;
    for (let i = 0; i < this.missions.length; i++) {
      const m = this.missions[i];
      const isSelected = m.id === this.currentMissionId;
      ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(width / 2 - 320, startY, 640, 75);
      ctx.strokeStyle = isSelected ? '#38bdf8' : '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(width / 2 - 320, startY, 640, 75);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(m.title, width / 2 - 300, startY + 25);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(m.description, width / 2 - 300, startY + 45);

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`REWARD: $${m.reward.toLocaleString()} ${m.completed ? '(COMPLETED)' : ''}`, width / 2 + 300, startY + 35);

      startY += 85;
    }
    ctx.restore();
  }
}
