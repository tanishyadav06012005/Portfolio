/**
 * Advanced Cursor Effects with Wavy Patterns
 * Creates beautiful liquid-like cursor trails
 */
document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.running = true;
  ctx.frame = 1;

  let hue = 0;
  let mouse = {};
  let trails = [];

  // Configuration for the cursor trails
  const config = {
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98,
  };

  // Color wave controller
  function ColorWave(options) {
    this.init(options || {});
  }

  ColorWave.prototype = {
    init: function (options) {
      this.phase = options.phase || 0;
      this.offset = options.offset || 0;
      this.frequency = options.frequency || 0.001;
      this.amplitude = options.amplitude || 1;
    },
    update: function () {
      this.phase += this.frequency;
      return this.offset + Math.sin(this.phase) * this.amplitude;
    },
    value: function () {
      return hue;
    },
  };

  // Node for trail points
  function Node() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
  }

  // Trail constructor
  function Trail(options) {
    this.init(options || {});
  }

  Trail.prototype = {
    init: function (options) {
      this.spring = options.spring + 0.1 * Math.random() - 0.02;
      this.friction = config.friction + 0.01 * Math.random() - 0.002;
      this.nodes = [];

      // Create trail nodes
      for (let i = 0; i < config.size; i++) {
        const node = new Node();
        node.x = mouse.x;
        node.y = mouse.y;
        this.nodes.push(node);
      }
    },
    update: function () {
      let spring = this.spring;
      const firstNode = this.nodes[0];

      // Apply physics to the first node (directly follows cursor)
      firstNode.vx += (mouse.x - firstNode.x) * spring;
      firstNode.vy += (mouse.y - firstNode.y) * spring;

      // Update each node in the trail
      for (let i = 0, n = this.nodes.length; i < n; i++) {
        const currentNode = this.nodes[i];

        // All nodes except the first one
        if (i > 0) {
          const previousNode = this.nodes[i - 1];

          // Apply spring force towards the previous node
          currentNode.vx += (previousNode.x - currentNode.x) * spring;
          currentNode.vy += (previousNode.y - currentNode.y) * spring;

          // Add damping from the previous node's velocity
          currentNode.vx += previousNode.vx * config.dampening;
          currentNode.vy += previousNode.vy * config.dampening;
        }

        // Apply friction to slow down movement
        currentNode.vx *= this.friction;
        currentNode.vy *= this.friction;

        // Update position based on velocity
        currentNode.x += currentNode.vx;
        currentNode.y += currentNode.vy;

        // Reduce spring constant for each subsequent node
        spring *= config.tension;
      }
    },
    draw: function () {
      // Start drawing from the first node
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;

      ctx.beginPath();
      ctx.moveTo(x, y);

      // Draw smooth curves through the nodes
      for (let i = 1, n = this.nodes.length - 2; i < n; i++) {
        const currentNode = this.nodes[i];
        const nextNode = this.nodes[i + 1];

        // Calculate midpoint for quadratic curve
        x = (currentNode.x + nextNode.x) * 0.5;
        y = (currentNode.y + nextNode.y) * 0.5;

        // Draw quadratic curve to midpoint
        ctx.quadraticCurveTo(currentNode.x, currentNode.y, x, y);
      }

      // Connect the last two nodes
      const secondLastNode = this.nodes[this.nodes.length - 2];
      const lastNode = this.nodes[this.nodes.length - 1];

      ctx.quadraticCurveTo(
        secondLastNode.x,
        secondLastNode.y,
        lastNode.x,
        lastNode.y
      );
      ctx.stroke();
      ctx.closePath();
    },
  };

  // Handle mouse movement
  function handleMouseMove(e) {
    // Remove initial event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchstart", handleMouseMove);

    // Add tracking event listeners
    document.addEventListener("mousemove", trackMouse);
    document.addEventListener("touchmove", trackMouse);
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        mouse.x = e.touches[0].pageX;
        mouse.y = e.touches[0].pageY;
      }
    });

    // Track the initial mouse position
    trackMouse(e);
    initTrails();
    animate();
  }

  // Track mouse position
  function trackMouse(e) {
    if (e.touches) {
      mouse.x = e.touches[0].pageX;
      mouse.y = e.touches[0].pageY;
    } else {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    e.preventDefault();
  }

  // Initialize trails
  function initTrails() {
    trails = [];
    for (let i = 0; i < config.trails; i++) {
      trails.push(
        new Trail({
          spring: 0.4 + (i / config.trails) * 0.025,
        })
      );
    }
  }

  // Resize canvas to match window size
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Animation loop
  function animate() {
    if (ctx.running) {
      // Clear the canvas with transparency
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set blending mode for trails
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle =
        "hsla(" + Math.round(colorWave.update()) + ",50%,50%,0.2)";
      ctx.lineWidth = 1;

      // Update and draw each trail
      for (let i = 0; i < config.trails; i++) {
        const trail = trails[i];
        trail.update();
        trail.draw();
      }

      ctx.frame++;
      window.requestAnimationFrame(animate);
    }
  }

  // Initialize everything
  function init() {
    // Set up canvas
    resize();

    // Create color wave generator
    colorWave = new ColorWave({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    // Set up event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleMouseMove);
    document.body.addEventListener("orientationchange", resize);
    window.addEventListener("resize", resize);

    // Handle window focus/blur
    window.addEventListener("focus", () => {
      if (!ctx.running) {
        ctx.running = true;
        animate();
      }
    });

    window.addEventListener("blur", () => {
      ctx.running = true;
    });
  }

  // Start the animation
  init();
});
