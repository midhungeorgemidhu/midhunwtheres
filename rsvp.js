/**
 * Eternal Bloom - RSVP System, Confetti Celebration & Digital VIP Pass Engine
 */

// Confetti Particle Engine for instant celebratory celebration
class ConfettiCannon {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confettiCanvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1300';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 120) {
    this.particles = [];
    const colors = ['#d4af37', '#f7e7b4', '#e8a598', '#ffffff', '#aa8421', '#ff5964'];
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: this.canvas.height / 2 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 1.5) * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.35,
        opacity: 1
      });
    }

    this.animate();
  }

  animate() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Pseudo-QR Code Generator on Canvas
function drawStylizedQr(canvas, payloadText) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 120;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#0c1819';
  const cols = 15;
  const cell = size / cols;

  // Simple deterministic pattern based on hash
  let hash = 0;
  for (let i = 0; i < payloadText.length; i++) {
    hash = (hash << 5) - hash + payloadText.charCodeAt(i);
    hash |= 0;
  }

  // Draw corner locator squares
  function drawCorner(r, c) {
    ctx.fillRect(c * cell, r * cell, 4 * cell, 4 * cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((c + 1) * cell, (r + 1) * cell, 2 * cell, 2 * cell);
    ctx.fillStyle = '#0c1819';
    ctx.fillRect((c + 1.5) * cell, (r + 1.5) * cell, cell, cell);
  }

  drawCorner(0, 0);
  drawCorner(0, cols - 4);
  drawCorner(cols - 4, 0);

  // Fill random reproducible matrix cells
  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r < 4 && c < 4) || (r < 4 && c >= cols - 4) || (r >= cols - 4 && c < 4)) {
        continue;
      }
      const val = Math.sin(hash + r * 13 + c * 7);
      if (val > 0.05) {
        ctx.fillRect(c * cell + 0.5, r * cell + 0.5, cell - 1, cell - 1);
      }
    }
  }
}

// RSVP Manager
class RsvpManager {
  constructor() {
    this.storageKey = 'eternal_bloom_rsvps';
    this.confetti = new ConfettiCannon();
    this.form = document.getElementById('rsvpForm');
    this.passModal = document.getElementById('digitalPassModal');
    this.passCloseBtn = document.getElementById('passCloseBtn');
    this.downloadPassBtn = document.getElementById('downloadPassBtn');
    this.hostDashboardModal = document.getElementById('hostDashboardModal');

    this.bindEvents();
    this.updateGuestCounter();
  }

  bindEvents() {
    if (!this.form) return;

    // Meal card interactive selection
    const mealCards = document.querySelectorAll('.meal-card');
    mealCards.forEach(card => {
      card.addEventListener('click', () => {
        mealCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Attendance radio styling
    const radioCards = document.querySelectorAll('.radio-card');
    radioCards.forEach(card => {
      card.addEventListener('click', () => {
        radioCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        // Hide/Show meal selection if declining
        const mealSection = document.getElementById('mealSectionGroup');
        const isAttending = card.dataset.status === 'attending';
        if (mealSection) {
          mealSection.style.display = isAttending ? 'flex' : 'none';
        }
      });
    });

    // Form Submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Close Digital Pass Modal
    if (this.passCloseBtn) {
      this.passCloseBtn.addEventListener('click', () => {
        this.passModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Download/Print Pass
    if (this.downloadPassBtn) {
      this.downloadPassBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  getSavedRsvps() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveRsvp(rsvp) {
    const rsvps = this.getSavedRsvps();
    rsvps.unshift(rsvp);
    localStorage.setItem(this.storageKey, JSON.stringify(rsvps));
    this.updateGuestCounter();
  }

  updateGuestCounter() {
    const rsvps = this.getSavedRsvps();
    const countEl = document.getElementById('confirmedGuestCount');
    if (!countEl) return;

    let attendingCount = 142; // Base confirmed RSVP count
    rsvps.forEach(r => {
      if (r.attending === 'yes') {
        attendingCount += parseInt(r.guests || 1, 10);
      }
    });

    countEl.textContent = attendingCount;
  }

  handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('rsvpName').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const guests = document.getElementById('rsvpGuests').value;
    const attendingRadio = document.querySelector('input[name="attending"]:checked');
    const mealRadio = document.querySelector('input[name="meal"]:checked');
    const dietary = document.getElementById('rsvpDietary').value.trim();
    const song = document.getElementById('rsvpSong').value.trim();

    if (!name || !email || !attendingRadio) {
      alert('Please fill in your name, email, and attendance confirmation.');
      return;
    }

    const attending = attendingRadio.value;
    const meal = mealRadio ? mealRadio.value : 'Standard Gourmet';
    const passCode = 'EB-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const tableNo = 'Table ' + (Math.floor(Math.random() * 12) + 1);

    const rsvpRecord = {
      id: Date.now(),
      name,
      email,
      attending,
      guests: parseInt(guests, 10),
      meal: attending === 'yes' ? meal : 'N/A',
      dietary,
      song,
      passCode,
      tableNo,
      timestamp: new Date().toISOString()
    };

    this.saveRsvp(rsvpRecord);

    // Celebrate with Confetti!
    this.confetti.burst(150);

    // If attending, show digital pass modal!
    if (attending === 'yes') {
      this.displayDigitalPass(rsvpRecord);
    } else {
      alert(`Thank you, ${name}. We have received your RSVP and will miss celebrating with you in person!`);
      this.form.reset();
    }
  }

  displayDigitalPass(record) {
    const nameEl = document.getElementById('passGuestName');
    const codeEl = document.getElementById('passCodeVal');
    const guestsEl = document.getElementById('passGuestsVal');
    const tableEl = document.getElementById('passTableVal');
    const qrCanvas = document.getElementById('passQrCanvas');

    if (nameEl) nameEl.textContent = record.name;
    if (codeEl) codeEl.textContent = record.passCode;
    if (guestsEl) guestsEl.textContent = record.guests + ' Guest(s)';
    if (tableEl) tableEl.textContent = record.tableNo;

    drawStylizedQr(qrCanvas, `${record.name}|${record.passCode}|${record.tableNo}`);

    if (this.passModal) {
      this.passModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    this.form.reset();
  }
}

// Global Host Dashboard trigger for viewing all RSVPs
window.openHostRsvpDashboard = function() {
  const rsvps = JSON.parse(localStorage.getItem('eternal_bloom_rsvps') || '[]');
  let content = `=== Eternal Bloom Wedding - Host RSVP Overview ===\n\nTotal Submissions: ${rsvps.length}\n\n`;

  if (rsvps.length === 0) {
    content += 'No custom RSVPs submitted yet. Guests can submit via the RSVP form!';
  } else {
    rsvps.forEach((r, idx) => {
      content += `${idx + 1}. [${r.attending.toUpperCase()}] ${r.name} (${r.email}) - ${r.guests} guest(s), Meal: ${r.meal}, Code: ${r.passCode}, Song: "${r.song || 'None'}"\n`;
    });
  }

  alert(content);
};

document.addEventListener('DOMContentLoaded', () => {
  window.rsvpManager = new RsvpManager();
});
