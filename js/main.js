/**
 * Enhanced Portfolio JavaScript with Advanced Animations
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all enhancements
  initScrollAnimations();
  initHoverEffects();
  initTypewriterEffect();
  initSkillAnimations();
  initLoadingSequence();
  initParallaxEffects();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Enhanced scroll animations with intersection observer
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -20% 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Special animations for different elements
        if (entry.target.classList.contains("project-card")) {
          animateProjectCard(entry.target);
        } else if (entry.target.classList.contains("skill-tag")) {
          animateSkillTag(entry.target);
        }

        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const animatedElements = document.querySelectorAll(
    ".hover-card, .project-card, .skill-tag"
  );
  animatedElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
      index * 0.1
    }s`;
    observer.observe(el);
  });
}

// Enhanced hover effects
function initHoverEffects() {
  // Add magnetic effect to buttons and cards
  const magneticElements = document.querySelectorAll(
    ".hover-card, .hover-lift"
  );

  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      element.style.transform = `perspective(1000px) rotateX(${
        deltaY * 5
      }deg) rotateY(${deltaX * 5}deg) translateZ(10px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  });
}

// Typewriter effect for dynamic text
function initTypewriterEffect() {
  const typewriterElements = document.querySelectorAll(".typewriter-text");

  typewriterElements.forEach((element) => {
    const text = element.textContent;
    element.textContent = "";

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        element.classList.remove("typewriter-text");
      }
    }, 100);
  });
}

// Enhanced skill tag animations
function initSkillAnimations() {
  const skillTags = document.querySelectorAll(".skill-tag");

  skillTags.forEach((tag, index) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) translateY(-2px)";
      this.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
    });

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0px)";
      this.style.boxShadow = "none";
    });

    // Staggered entrance animation
    setTimeout(() => {
      tag.style.opacity = "1";
      tag.style.transform = "translateY(0)";
    }, index * 50);
  });
}

// Loading sequence with progressive enhancement
function initLoadingSequence() {
  // Simulate loading with progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      // Start revealing content
      setTimeout(() => {
        document.body.classList.add("loaded");
        revealContent();
      }, 500);
    }
  }, 100);
}

// Reveal content with staggered animations
function revealContent() {
  const elements = document.querySelectorAll(".hover-card");
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, index * 200);
  });
}

// Parallax effects for background elements
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".gradient-orb");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.3;
      element.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
    });
  });
}

// Animate project cards
function animateProjectCard(card) {
  const techTags = card.querySelectorAll(".tech-tag");
  const checkIcons = card.querySelectorAll(".fa-check-circle");

  techTags.forEach((tag, index) => {
    setTimeout(() => {
      tag.style.opacity = "1";
      tag.style.transform = "scale(1) translateY(0)";
    }, index * 100);
  });

  checkIcons.forEach((icon, index) => {
    setTimeout(() => {
      icon.style.color = "#10b981";
      icon.style.transform = "scale(1.2)";
      setTimeout(() => {
        icon.style.transform = "scale(1)";
      }, 200);
    }, techTags.length * 100 + index * 150);
  });
}

// Animate skill tags
function animateSkillTag(tag) {
  tag.style.opacity = "1";
  tag.style.transform = "translateY(0) scale(1)";

  // Add a subtle bounce effect
  setTimeout(() => {
    tag.style.transform = "translateY(0) scale(1.05)";
    setTimeout(() => {
      tag.style.transform = "translateY(0) scale(1)";
    }, 150);
  }, 100);
}

// Add CSS animation classes dynamically
const style = document.createElement("style");
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .loaded .hover-card {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);
