/* ═══════════════════════════════════════
   ARANOVA — JavaScript Interactions
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '2349039919790';

  // ─── Handle broken images gracefully ───
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.setAttribute('data-error', 'true');
      img.removeAttribute('alt'); // remove alt text box
    });
  });

  // ─── Utility ───
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ─── GA4 Event Helper ───
  function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // ═══════════════════════════════════════
  //  1. Scroll Progress Bar
  // ═══════════════════════════════════════
  const progressBar = $('#scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // ═══════════════════════════════════════
  //  2. Navbar Scroll Effect + Mobile Toggle
  // ═══════════════════════════════════════
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  $$('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ═══════════════════════════════════════
  //  3. Smooth Scroll for Nav Links
  // ═══════════════════════════════════════
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = $(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════
  //  4. Scroll Reveal (IntersectionObserver)
  // ═══════════════════════════════════════
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve — only reveal once
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════════
  //  5. Counter Animation
  // ═══════════════════════════════════════
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  $$('.counter').forEach(el => counterObserver.observe(el));

  // ═══════════════════════════════════════
  //  6. FAQ Accordion
  // ═══════════════════════════════════════
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      // Close all
      $$('.faq-item.active').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if wasn't open)
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ═══════════════════════════════════════
  //  7. Theme Carousel Arrows
  // ═══════════════════════════════════════
  const themesTrack = $('#themesTrack');
  const prevBtn = $('#themesPrev');
  const nextBtn = $('#themesNext');
  const scrollAmount = 304; // card width + gap

  if (prevBtn && nextBtn && themesTrack) {
    prevBtn.addEventListener('click', () => {
      themesTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      themesTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ═══════════════════════════════════════
  //  8. Booking Form → WhatsApp + Formspree
  // ═══════════════════════════════════════
  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(this);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const email = data.get('email') || '';
      const eventType = data.get('event_type') || '';
      const eventDate = data.get('event_date') || '';
      const venue = data.get('venue') || '';
      const theme = data.get('magazine_theme') || '';
      const pkg = data.get('package') || '';
      const referral = data.get('referral') || '';
      const notes = data.get('notes') || '';

      // Build WhatsApp message
      let msg = `Hi ARANOVA! 🌟\n\n`;
      msg += `*New Booking Request*\n`;
      msg += `Name: ${name}\n`;
      msg += `Phone: ${phone}\n`;
      if (email) msg += `Email: ${email}\n`;
      if (eventType) msg += `Event Type: ${eventType}\n`;
      if (eventDate) msg += `Event Date: ${eventDate}\n`;
      if (venue) msg += `Venue: ${venue}\n`;
      if (theme) msg += `Magazine Theme: ${theme}\n`;
      if (pkg) msg += `Package: ${pkg}\n`;
      if (referral) msg += `Heard About Us: ${referral}\n`;
      if (notes) msg += `Notes: ${notes}\n`;
      msg += `\nSent from aranova.ng`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

      // Also submit to Formspree (fire-and-forget)
      const formAction = this.getAttribute('action');
      if (formAction && !formAction.includes('YOUR_FORM_ID')) {
        fetch(formAction, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).catch(() => { /* silent fail — WhatsApp is primary */ });
      }

      trackEvent('form_submit', { event_type: eventType, package: pkg });

      // Redirect to WhatsApp
      window.open(waUrl, '_blank');

      // Show confirmation
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '✓ Sent! Check WhatsApp';
      submitBtn.style.background = '#25D366';
      submitBtn.style.color = '#fff';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 4000);
    });
  }

  // ═══════════════════════════════════════
  //  8.5. Auto-select package from pricing cards
  // ═══════════════════════════════════════
  $$('a[data-package]').forEach(btn => {
    btn.addEventListener('click', function () {
      const pkg = this.getAttribute('data-package');
      const packageSelect = $('#formPackage');
      if (packageSelect && pkg) {
        packageSelect.value = pkg;
      }
    });
  });

  // ═══════════════════════════════════════
  //  9. CTA Click Tracking
  // ═══════════════════════════════════════
  $$('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('cta_click', { cta_name: el.dataset.cta });
    });
  });

  // ═══════════════════════════════════════
  //  10. Calendar Widget
  // ═══════════════════════════════════════
  function buildCalendar(container) {
    if (!container) return;

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Some demo blocked dates (Saturdays that are "booked")
    const blockedDates = [
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-06`,
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-13`,
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`,
    ];

    function render() {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = new Date();

      let html = `<div class="cal-header">
        <button class="cal-prev" aria-label="Previous month">‹</button>
        <h4>${monthNames[currentMonth]} ${currentYear}</h4>
        <button class="cal-next" aria-label="Next month">›</button>
      </div>
      <div class="cal-days">`;

      // Day labels
      dayNames.forEach(d => { html += `<span class="cal-day-label">${d}</span>`; });

      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        html += `<span class="cal-day cal-day--empty"></span>`;
      }

      // Day cells
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isBlocked = blockedDates.includes(dateStr);
        const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
        const isSaturday = new Date(currentYear, currentMonth, day).getDay() === 6;

        let cls = 'cal-day';
        if (isBlocked) cls += ' cal-day--blocked';
        else if (isSaturday) cls += ' cal-day--available';
        if (isToday) cls += ' cal-day--today';

        html += `<span class="${cls}" data-date="${dateStr}">${day}</span>`;
      }

      html += `</div>`;
      container.innerHTML = html;

      // Arrow events
      const prevArrow = container.querySelector('.cal-prev');
      const nextArrow = container.querySelector('.cal-next');
      if (prevArrow) prevArrow.addEventListener('click', () => { navigate(-1); });
      if (nextArrow) nextArrow.addEventListener('click', () => { navigate(1); });

      // Date click — scroll to booking form
      container.querySelectorAll('.cal-day:not(.cal-day--blocked):not(.cal-day--empty)').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
          const dateInput = $('#formDate');
          if (dateInput) {
            dateInput.value = dayEl.dataset.date;
            const booking = $('#booking');
            if (booking) {
              booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }

    function navigate(dir) {
      currentMonth += dir;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      render();
    }

    render();
  }

  buildCalendar($('#calendarWidget'));

  // ═══════════════════════════════════════
  //  Scroll Listener (throttled)
  // ═══════════════════════════════════════
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        handleNavScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calls
  updateProgress();
  handleNavScroll();

})();
