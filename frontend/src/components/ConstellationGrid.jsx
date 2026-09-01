import { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '../hooks/useAnimationLoop';

// Particle-network mesh background, scoped to its parent container.
// Palette matches the rest of the app (accent purple / lavender / ice-teal).
const PALETTE = ['rgba(181,171,252,0.85)', 'rgba(210,206,253,0.7)', 'rgba(111,207,151,0.6)'];
const LINK_RGB = '150,138,224';

export default function ConstellationGrid({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent || prefersReducedMotion()) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf;
    let particles = [];
    let w = 0, h = 0;
    const mouse = { x: null, y: null, radius: 130 };

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size; this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > w || this.x < 0) this.dx = -this.dx;
        if (this.y > h || this.y < 0) this.dy = -this.dy;
        if (mouse.x !== null) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius + this.size && dist > 0) {
            const fx = dx / dist, fy = dy / dist;
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= fx * force * 4.5;
            this.y -= fy * force * 4.5;
          }
        }
        this.x += this.dx; this.y += this.dy;
        this.draw();
      }
    }

    function init() {
      particles = [];
      const count = Math.min(150, Math.round((w * h) / 11000));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 1.7 + 0.6;
        const x = Math.random() * w, y = Math.random() * h;
        const dx = (Math.random() * 0.4) - 0.2, dy = (Math.random() * 0.4) - 0.2;
        particles.push(new Particle(x, y, dx, dy, size, PALETTE[i % PALETTE.length]));
      }
    }

    function resize() {
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function connect() {
      const maxDistSq = (w / 6) * (h / 6);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= maxDistSq) continue;
          const op = 1 - distSq / 22000;
          if (op <= 0) continue;
          ctx.strokeStyle = `rgba(${LINK_RGB},${op * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    function animate() {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => p.update());
      connect();
    }

    const handleMove = (e) => {
      const r = parent.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const handleLeave = () => { mouse.x = null; mouse.y = null; };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    parent.addEventListener('mousemove', handleMove);
    parent.addEventListener('mouseleave', handleLeave);
    animate();

    return () => {
      ro.disconnect();
      parent.removeEventListener('mousemove', handleMove);
      parent.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}