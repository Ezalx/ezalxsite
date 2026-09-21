/**
 * AI Core Hero Animation
 * Sophisticated AI-themed hero with particle system and interactive parallax
 */

(function() {
  'use strict';

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. AI Hero animations will be limited.');
    return;
  }

  const AIHero = {
    canvas: null,
    ctx: null,
    particles: [],
    nodes: [],
    centerX: 0,
    centerY: 0,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    particleCount: 0,
    animationId: null,
    isReducedMotion: false,

    /**
     * Initialize AI Hero
     */
    init() {
      // Check for reduced motion preference
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Get or create canvas
      const container = document.querySelector('.ai-core-container');
      if (!container) return;

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'ai-core-canvas';
      this.ctx = this.canvas.getContext('2d');
      container.appendChild(this.canvas);

      this.resizeCanvas();
      this.createParticles();
      this.setupAnimations();
      this.setupMouseTracking();
      this.animate();

      // Handle window resize
      window.addEventListener('resize', () => this.resizeCanvas());

      // Handle reduced motion
      window.matchMedia('(prefers-reduced-motion: reduce)').addListener((e) => {
        this.isReducedMotion = e.matches;
      });
    },

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
      const container = this.canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      this.canvas.width = window.innerWidth > 768 ? window.innerWidth / 2 : window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
    },

    /**
     * Create particle system
     */
    createParticles() {
      this.particles = [];
      this.nodes = [];

      // Reduce particles on mobile
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 20 : 40;

      // Center core
      this.nodes.push({
        x: this.centerX,
        y: this.centerY,
        radius: isMobile ? 15 : 25,
        baseRadius: isMobile ? 15 : 25,
        glowIntensity: 0.8,
        isCore: true
      });

      // Orbiting particles
      for (let i = 0; i < (isMobile ? 8 : 12); i++) {
        const angle = (i / (isMobile ? 8 : 12)) * Math.PI * 2;
        const distance = isMobile ? 80 : 120;
        this.particles.push({
          x: this.centerX + Math.cos(angle) * distance,
          y: this.centerY + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          radius: isMobile ? 3 : 5,
          angle: angle,
          distance: distance,
          speed: 0.01 + Math.random() * 0.01,
          opacity: 0.6 + Math.random() * 0.4,
          pulsing: Math.random() > 0.5
        });
      }

      // Data nodes (connecting lines)
      for (let i = 0; i < (isMobile ? 6 : 8); i++) {
        const angle = (i / (isMobile ? 6 : 8)) * Math.PI * 2;
        const distance = isMobile ? 60 : 100;
        this.nodes.push({
          x: this.centerX + Math.cos(angle) * distance,
          y: this.centerY + Math.sin(angle) * distance,
          radius: isMobile ? 2 : 3,
          opacity: 0.4 + Math.random() * 0.3,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      this.particleCount = count;
    },

    /**
     * Setup GSAP animations
     */
    setupAnimations() {
      if (this.isReducedMotion) return;

      // Timeline for entry
      const tl = gsap.timeline();

      // Fade in AI core
      tl.from('.ai-core-container', {
        opacity: 0,
        duration: 0.8,
        delay: 0.3
      }, 0);

      // Fade in content
      tl.from('.home-content__main', {
        opacity: 0,
        y: 30,
        duration: 0.8
      }, 0.3);

      // Fade in buttons
      tl.from('.home-content__button', {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, 0.5);

      // Continuous core pulse (very subtle)
      gsap.to('.ai-core-canvas', {
        opacity: '+=0.05',
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    },

    /**
     * Setup mouse tracking for parallax
     */
    setupMouseTracking() {
      if (window.innerWidth < 768) return; // Disable on mobile

      document.addEventListener('mousemove', (e) => {
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      // Smooth mouse follow with easing
      const updateMouse = () => {
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;
        requestAnimationFrame(updateMouse);
      };
      updateMouse();
    },

    /**
     * Main animation loop
     */
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Update and draw particles
      this.particles.forEach((p, i) => {
        if (!this.isReducedMotion) {
          // Orbit animation
          p.angle += p.speed;
          p.x = this.centerX + Math.cos(p.angle) * p.distance + this.mouseX * 10;
          p.y = this.centerY + Math.sin(p.angle) * p.distance + this.mouseY * 10;

          // Pulsing effect
          if (p.pulsing) {
            p.opacity = 0.6 + Math.sin(Date.now() * 0.005 + i) * 0.3;
          }
        }

        // Draw particle
        this.ctx.fillStyle = `rgba(255, 138, 80, ${p.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Draw connecting lines
      this.ctx.strokeStyle = 'rgba(255, 138, 80, 0.2)';
      this.ctx.lineWidth = 1;
      this.particles.forEach((p1, i) => {
        this.particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (dist < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        });
      });

      // Draw core
      const core = this.nodes[0];
      if (core) {
        // Glow effect
        const gradient = this.ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, core.radius * 3);
        gradient.addColorStop(0, 'rgba(255, 138, 80, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 138, 80, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(core.x, core.y, core.radius * 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Core circle with glow
        this.ctx.fillStyle = `rgba(255, 138, 80, ${0.8 + Math.sin(Date.now() * 0.003) * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(core.x, core.y, core.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Core border
        this.ctx.strokeStyle = 'rgba(255, 138, 80, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(core.x, core.y, core.radius, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Draw data nodes
      this.nodes.slice(1).forEach((node, i) => {
        node.opacity = 0.4 + Math.sin(Date.now() * 0.004 + i) * 0.2;
        this.ctx.fillStyle = `rgba(255, 138, 80, ${node.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      // Continue animation
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AIHero.init());
  } else {
    AIHero.init();
  }

  // Expose to window for debugging
  window.AIHero = AIHero;
})();
