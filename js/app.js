/**
 * Eternal Bloom - Main Application Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeIntro();
  initThemeToggle();
  initFaqAccordion();
  initCopyButtons();
  initScrollSpy();
  initScrollAnimations();
  initPetalDockToggle();
});

/* --------------------------------------------------------------------------
   1. ENVELOPE & WAX SEAL INTRO
   -------------------------------------------------------------------------- */
function initEnvelopeIntro() {
  const overlay = document.getElementById('envelopeOverlay');
  const waxBtn = document.getElementById('waxSealBtn');
  const skipBtn = document.getElementById('skipIntroBtn');

  function openEnvelope() {
    if (!overlay) return;
    
    // Animate wax seal stamp
    if (waxBtn) waxBtn.style.animation = 'waxStampOpen 0.8s forwards';

    // Start romantic background soundscape
    setTimeout(() => {
      if (window.romanticSound && !window.romanticSound.isPlaying) {
        window.romanticSound.startSequence();
      }
    }, 400);

    // Fade out overlay
    setTimeout(() => {
      overlay.classList.add('opened');
      document.body.style.overflow = '';
      
      // Trigger opening confetti celebration
      if (window.rsvpManager && window.rsvpManager.confetti) {
        window.rsvpManager.confetti.burst(100);
      }
    }, 700);
  }

  if (waxBtn) waxBtn.addEventListener('click', openEnvelope);
  if (skipBtn) skipBtn.addEventListener('click', openEnvelope);
}

/* --------------------------------------------------------------------------
   2. THEME TOGGLING (Starlight Dark / Ivory Bloom Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('eternal_bloom_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('eternal_bloom_theme', nextTheme);
    updateThemeIcon(nextTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
  themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to Ivory Bloom Theme' : 'Switch to Royal Evening Theme');
}

/* --------------------------------------------------------------------------
   3. PETAL TOGGLE FROM DOCK
   -------------------------------------------------------------------------- */
function initPetalDockToggle() {
  const petalBtn = document.getElementById('petalToggleBtn');
  if (!petalBtn) return;

  petalBtn.addEventListener('click', () => {
    if (window.romanticPetals) {
      window.romanticPetals.toggle();
      const active = window.romanticPetals.isRunning;
      petalBtn.style.opacity = active ? '1' : '0.4';
      petalBtn.setAttribute('title', active ? 'Pause Falling Petals' : 'Enable Falling Petals');
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. COPY TO CLIPBOARD BUTTONS
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy || '';
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied!</span>';
        btn.classList.add('btn-copied');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-copied');
        }, 2000);
      }).catch(() => {
        alert('Copied to clipboard: ' + textToCopy);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL SPY & DOCK NAVIGATION
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const dockLinks = document.querySelectorAll('.dock-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    dockLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. INTERSECTION OBSERVER FOR FADE-UP ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.animate-fade-up');
  if (!animElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(el => observer.observe(el));
}
