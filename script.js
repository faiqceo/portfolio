// Portfolio JavaScript
// Add your interactive functionality here

document.addEventListener('DOMContentLoaded', function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }

  // ── Nav: scroll state, active link ─────────────────────────────────────
  // The pill has no drop panel — every control is a direct link — so there is
  // no open/close state to manage here.
  const siteNav = document.getElementById('site-nav');

  if (siteNav) {
    const syncNavScrolled = () => {
      siteNav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    syncNavScrolled();
    window.addEventListener('scroll', syncNavScrolled, { passive: true });
  }

  // Highlight whichever section is currently in view.
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  const navTargets = navAnchors
    .map((anchor) => {
      const section = document.querySelector(anchor.getAttribute('href'));
      return section ? { anchor, section } : null;
    })
    .filter(Boolean);

  if (navTargets.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const match = navTargets.find((t) => t.section === entry.target);
          if (match) match.anchor.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      { rootMargin: '-58px 0px -60% 0px' }
    );

    navTargets.forEach(({ section }) => navObserver.observe(section));
  }

  // ── Selected work: scroll-driven preview swap ──────────────────────────
  // The left visual is sticky; whichever panel is nearest the viewport centre
  // wins and its preview crossfades in. Measuring distance-to-centre rather
  // than using IntersectionObserver thresholds means there is always exactly
  // one active panel, including at the very top and bottom of the section.
  const workPanels = Array.from(document.querySelectorAll('.work-panel'));
  const workShots = Array.from(document.querySelectorAll('.work-shot'));

  if (workPanels.length && workShots.length) {
    let activeWork = -1;
    let queued = false;

    const syncWork = () => {
      queued = false;
      const centre = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;

      workPanels.forEach((panel, i) => {
        const box = panel.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - centre);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      if (best === activeWork) return;
      activeWork = best;

      workPanels.forEach((panel, i) => panel.classList.toggle('is-active', i === best));
      workShots.forEach((shot, i) => shot.classList.toggle('is-active', i === best));
    };

    // Coalesce scroll events into one measurement per frame.
    const onWorkScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(syncWork);
    };

    syncWork();
    window.addEventListener('scroll', onWorkScroll, { passive: true });
    window.addEventListener('resize', onWorkScroll, { passive: true });
  }

  // ── Custom cursor ───────────────────────────────────────────────────────
  // A dot that tracks the pointer exactly and a ring that eases toward it. The
  // gap between them on fast movement is the whole effect. Skipped entirely on
  // touch/coarse pointers and under reduced-motion, matching the CSS guards —
  // without the .has-cursor class the native arrow is never hidden, so there is
  // no way to end up with no visible cursor at all.
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wantsMotion = !prefersReducedMotion;

  if (cursorDot && cursorRing && finePointer && wantsMotion) {
    const root = document.documentElement;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let started = false;

    const hoverSelector = 'a, button, [role="button"], input, textarea, select, .testimonial-card';

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!started) {
        // Jump the ring to the first known position so it doesn't fly in from
        // the centre of the screen on the first move.
        ringX = pointerX;
        ringY = pointerY;
        started = true;
        root.classList.add('has-cursor');
      }

      root.classList.toggle('cursor-hover', Boolean(event.target.closest(hoverSelector)));
    }, { passive: true });

    // Leaving the window or tabbing away hides both elements rather than
    // stranding them at the last known point.
    document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
    document.addEventListener('pointerenter', () => { if (started) root.classList.add('has-cursor'); });
    window.addEventListener('blur', () => root.classList.remove('cursor-down'));

    window.addEventListener('pointerdown', () => root.classList.add('cursor-down'));
    window.addEventListener('pointerup', () => root.classList.remove('cursor-down'));

    const drawCursor = () => {
      // Exponential ease — the ring closes 12% of the remaining gap per frame,
      // which at 60fps leaves a visible trail on fast movement but still
      // settles in a few hundred milliseconds once the pointer stops.
      ringX += (pointerX - ringX) * 0.12;
      ringY += (pointerY - ringY) * 0.12;

      cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      requestAnimationFrame(drawCursor);
    };

    requestAnimationFrame(drawCursor);
  }

  // Initialize animations and interactions

  // Video overlay functionality
  const videoOverlays = document.querySelectorAll('.vid-overlay');
  videoOverlays.forEach(overlay => {
    overlay.addEventListener('click', function() {
      // Add video play logic here
      this.classList.add('gone');
    });
  });
  
  // Project filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.proj-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          // Trigger animation by adding a small delay
          setTimeout(() => {
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
  
  // Set 'all' as default active filter
  const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilterBtn) {
    allFilterBtn.classList.add('active');
  }

  const dynamicWord = document.querySelector('.dynamic-word');
  const dynamicWords = [
    'modern digital experiences',
    'impactful product launches',
    'bold brand systems',
    'high-performance web products'
  ];
  let dynamicIndex = 0;

  if (dynamicWord) {
    setInterval(() => {
      dynamicIndex = (dynamicIndex + 1) % dynamicWords.length;
      dynamicWord.textContent = dynamicWords[dynamicIndex];
      dynamicWord.classList.add('pulse');
      setTimeout(() => dynamicWord.classList.remove('pulse'), 400);
    }, 3200);
  }

  const numbersSection = document.querySelector('.numbers-section');
  const numberItems = document.querySelectorAll('.number-item');

  if (numbersSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          numbersSection.classList.add('is-visible');
          numberItems.forEach((item) => {
            const valueEl = item.querySelector('.number-value');
            const target = item.getAttribute('data-target');
            const suffix = item.getAttribute('data-suffix') || '';
            const finalValue = valueEl ? valueEl.getAttribute('data-value') : '';
            if (!valueEl) return;

            const duration = 1200;
            const startTime = performance.now();

            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const numericValue = Number(target) * eased;

              let displayValue = '';
              if (target.includes('.')) {
                displayValue = numericValue.toFixed(1);
              } else {
                displayValue = Math.round(numericValue).toString();
              }

              valueEl.textContent = displayValue + suffix;

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                valueEl.textContent = finalValue;
              }
            };

            requestAnimationFrame(animate);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(numbersSection);
  }

  // ── Soft reveal on scroll ────────────────────────────────────────────────
  // Anything marked .reveal starts slightly low and transparent, then settles
  // once it enters view. Children of a .reveal-group stagger off their index so
  // a list arrives as a sequence rather than all at once. Reveals fire once and
  // then stop being observed — re-animating on every pass reads as noise.
  const reveals = document.querySelectorAll('.reveal, .reveal-group');

  if (reveals.length) {
    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('is-in'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          });
        },
        // Pulled up from the bottom edge so items commit only once they are
        // properly on screen, not while still clipped by the fold.
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      reveals.forEach((el) => {
        if (el.classList.contains('reveal-group')) {
          Array.from(el.children).forEach((child, i) => {
            child.style.setProperty('--reveal-i', i);
          });
        }
        revealObserver.observe(el);
      });
    }
  }
});

