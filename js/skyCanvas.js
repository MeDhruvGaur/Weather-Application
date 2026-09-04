// skyCanvas.js — draws a small looping "sky" that reflects the current
// condition: gradient by time of day, drifting clouds, falling rain/snow,
// twinkling stars at night, and a soft lightning flash for storms.
//
// This is the app's one deliberate piece of ambient motion. Everything
// else in the UI is still. It pauses entirely if the user's system asks
// for reduced motion.

class SkyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.category = 'clear';
    this.isDay = true;
    this.t = 0;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.clouds = this._makeClouds();
    this.drops = this._makeDrops(70);
    this.stars = this._makeStars(50);
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._raf = null;
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.reduceMotion) this._drawFrame();
  }

  _makeClouds() {
    return Array.from({ length: 4 }, (_, i) => ({
      x: Math.random(),
      y: 0.12 + i * 0.11 + Math.random() * 0.05,
      scale: 0.6 + Math.random() * 0.9,
      speed: 0.0025 + Math.random() * 0.004,
    }));
  }

  _makeDrops(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.015 + Math.random() * 0.02,
      speed: 0.01 + Math.random() * 0.012,
      drift: (Math.random() - 0.5) * 0.002,
      size: 1 + Math.random() * 2,
    }));
  }

  _makeStars() {
    return Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.6,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  setCondition(category, isDay) {
    this.category = category;
    this.isDay = isDay;
  }

  start() {
    if (this.reduceMotion) {
      this._drawFrame();
      return;
    }
    const loop = () => {
      this.t += 1;
      this._drawFrame();
      this._raf = requestAnimationFrame(loop);
    };
    if (this._raf) cancelAnimationFrame(this._raf);
    loop();
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _skyColors() {
    const palettes = {
      clear: { day: ['#5FA7DB', '#BFE1F2'], night: ['#0B1330', '#1C2B52'] },
      cloudy: { day: ['#7C93A8', '#C7D3DB'], night: ['#171F30', '#28344A'] },
      fog: { day: ['#9AA6A8', '#D8DEDD'], night: ['#20262B', '#39424A'] },
      rain: { day: ['#516B7A', '#8FA6B2'], night: ['#10161F', '#1F2C38'] },
      snow: { day: ['#8FA6BC', '#E4ECF3'], night: ['#1A2233', '#2C3A52'] },
      storm: { day: ['#3B4351', '#6B7686'], night: ['#0A0C13', '#181D2A'] },
    };
    const p = palettes[this.category] || palettes.clear;
    return this.isDay ? p.day : p.night;
  }

  _drawFrame() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    // sky gradient
    const [top, bottom] = this._skyColors();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (!this.isDay) this._drawStars();
    this._drawSunMoon();
    if (['cloudy', 'rain', 'snow', 'storm', 'fog'].includes(this.category)) {
      this._drawClouds();
    }
    if (this.category === 'rain') this._drawRain();
    if (this.category === 'snow') this._drawSnow();
    if (this.category === 'storm') this._maybeFlash();
    if (this.category === 'fog') this._drawFogBands();
  }

  _drawStars() {
    const { ctx } = this;
    this.stars.forEach((s) => {
      const twinkle = 0.5 + 0.5 * Math.sin(this.t * 0.02 + s.phase);
      ctx.globalAlpha = 0.3 + twinkle * 0.7;
      ctx.fillStyle = '#FFF7E0';
      ctx.beginPath();
      ctx.arc(s.x * this.w, s.y * this.h, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  _drawSunMoon() {
    const { ctx, w, h } = this;
    const cx = w * 0.78;
    const cy = h * 0.26 + Math.sin(this.t * 0.008) * 4;
    const pulse = 1 + 0.04 * Math.sin(this.t * 0.03);
    const r = Math.min(w, h) * 0.09 * pulse;

    if (this.isDay) {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.2);
      glow.addColorStop(0, 'rgba(255, 224, 130, 0.55)');
      glow.addColorStop(1, 'rgba(255, 224, 130, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
      glow.addColorStop(0, 'rgba(230, 236, 255, 0.35)');
      glow.addColorStop(1, 'rgba(230, 236, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F1F3F9';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      // crescent shadow
      ctx.fillStyle = this._skyColors()[0];
      ctx.beginPath();
      ctx.arc(cx + r * 0.35, cy - r * 0.15, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _cloudPath(cx, cy, scale) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34 * scale, 16 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - 24 * scale, cy + 4 * scale, 22 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 26 * scale, cy + 5 * scale, 24 * scale, 14 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawClouds() {
    const { ctx, w, h } = this;
    const dim = ['storm', 'rain'].includes(this.category);
    ctx.fillStyle = dim ? 'rgba(30, 36, 48, 0.55)' : 'rgba(255,255,255,0.75)';
    this.clouds.forEach((c) => {
      c.x = (c.x + c.speed * 0.02) % 1.3;
      const cx = (c.x - 0.15) * w;
      const cy = c.y * h;
      this._cloudPath(cx, cy, c.scale);
    });
  }

  _drawRain() {
    const { ctx, w, h } = this;
    ctx.strokeStyle = 'rgba(190, 220, 235, 0.55)';
    ctx.lineWidth = 1.2;
    this.drops.forEach((d) => {
      d.y = (d.y + d.speed) % 1.05;
      d.x = (d.x + d.drift + 1) % 1;
      const x = d.x * w;
      const y = d.y * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 2, y + d.len * h);
      ctx.stroke();
    });
  }

  _drawSnow() {
    const { ctx, w, h } = this;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    this.drops.forEach((d) => {
      d.y = (d.y + d.speed * 0.35) % 1.05;
      d.x = (d.x + Math.sin(this.t * 0.02 + d.y * 10) * 0.0015 + 1) % 1;
      ctx.beginPath();
      ctx.arc(d.x * w, d.y * h, d.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  _drawFogBands() {
    const { ctx, w, h } = this;
    for (let i = 0; i < 3; i++) {
      const y = h * (0.35 + i * 0.18) + Math.sin(this.t * 0.01 + i) * 4;
      ctx.fillStyle = `rgba(255,255,255,${0.08 + i * 0.03})`;
      ctx.fillRect(0, y, w, h * 0.1);
    }
  }

  _maybeFlash() {
    // rare, brief flash — storms shouldn't flicker constantly
    if (this.t % 190 < 4) {
      const { ctx, w, h } = this;
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(0, 0, w, h);
    }
  }
}
