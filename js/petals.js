/**
 * Eternal Bloom - Falling Rose Petals & Golden Sparkles Engine
 */

class RomanticPetalsEngine {
  constructor(canvasId = 'petalCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkles = [];
    this.maxPetals = 35;
    this.maxSparkles = 25;
    this.isRunning = true;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
    });

    // Create initial petals
    for (let i = 0; i < this.maxPetals; i++) {
      this.particles.push(this.createPetal(true));
    }

    // Create golden sparkles
    for (let i = 0; i < this.maxSparkles; i++) {
      this.sparkles.push(this.createSparkle(true));
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createPetal(randomY = false) {
    const colors = [
      'rgba(232, 165, 152, 0.75)', // soft blush
      'rgba(244, 185, 175, 0.8)',  // rose gold
      'rgba(255, 230, 220, 0.7)',  // ivory petal
      'rgba(212, 175, 55, 0.65)'   // subtle champagne gold
    ];

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01
    };
  }

  createSparkle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      size: Math.random() * 2.5 + 1,
      color: 'rgba(247, 231, 180, ' + (Math.random() * 0.7 + 0.3) + ')',
      speedY: Math.random() * 0.5 + 0.3,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1)
    };
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.cos(p.flip), 1);

    this.ctx.beginPath();
    this.ctx.fillStyle = p.color;
    // Organic petal shape
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.5, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.5, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawSparkle(s) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    this.ctx.fillStyle = s.color;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = '#d4af37';
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      s.y += s.speedY;
      s.alpha += s.alphaSpeed;
      if (s.alpha > 1 || s.alpha < 0.2) s.alphaSpeed *= -1;

      this.drawSparkle(s);

      if (s.y > this.height) {
        this.sparkles[i] = this.createSparkle();
      }
    }

    // Update & draw petals
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * 0.8 + (this.mouseX || 0);
      p.rotation += p.rotationSpeed;
      p.flip += p.flipSpeed;

      this.drawPetal(p);

      if (p.y > this.height + 20 || p.x < -30 || p.x > this.width + 30) {
        this.particles[i] = this.createPetal();
      }
    }

    requestAnimationFrame(this.animate);
  }

  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.animate();
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// Auto init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.romanticPetals = new RomanticPetalsEngine();
});
