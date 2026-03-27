/* ═══════════════════════════════════════
   ARANOVA — JavaScript Interactions
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '2349038819790';

  // ─── Handle broken images gracefully ───
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.setAttribute('data-error', 'true');
      img.removeAttribute('alt');
    });
  });

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

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
    if (progressBar && docHeight > 0) {
      progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    }
  }

  // ═══════════════════════════════════════
  //  2. Navbar & Mobile Toggle
  // ═══════════════════════════════════════
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function handleNavScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  $$('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  // ═══════════════════════════════════════
  //  3. Smooth Scroll
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
  //  4. Scroll Reveal
  // ═══════════════════════════════════════
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
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
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  $$('.counter').forEach(el => counterObserver.observe(el));

  // ═══════════════════════════════════════
  //  6. FAQ Accordion
  // ═══════════════════════════════════════
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      $$('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ═══════════════════════════════════════
  //  7. Booking Form
  // ═══════════════════════════════════════
  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(this);
      const name = data.get('name') || '';
      const eventDate = data.get('event_date') || '';

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Calculate 5 weeks ahead
      const fiveWeeksFromNow = new Date();
      fiveWeeksFromNow.setDate(now.getDate() + 35);
      const deliveryStr = fiveWeeksFromNow.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      let msg = `Hi ARANOVA! 🌟\n\n`;
      msg += `*BOOKING REQUEST*\n`;
      msg += `-----------------------------------\n`;
      msg += `📅 Ordered On: ${dateStr} at ${timeStr}\n`;
      msg += `🚚 Estimated Setup: ${deliveryStr} (5 weeks)\n`;
      msg += `-----------------------------------\n`;
      msg += `Name: ${name}\n`;
      if (eventDate) msg += `Event Date: ${eventDate}\n`;
      msg += `\nSent from aranova.ng`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      const formAction = this.getAttribute('action');
      if (formAction) fetch(formAction, { method: 'POST', body: data });

      window.open(waUrl, '_blank');
    });
  }

  // ═══════════════════════════════════════
  //  8. Universal Sharing
  // ═══════════════════════════════════════
  window.shareToSocial = function () {
    const shareData = {
      title: 'ARANOVA — Nigeria\'s Premium Wedding Experience',
      text: 'Check out Aranova! They transform weddings into premium magazine cover stories. So iconic:',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Error sharing', err));
    } else {
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      showToast('Magic link copied! Share the love ✨');
    }
  };

  function showToast(msg) {
    let toast = $('#toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ═══════════════════════════════════════
  //  9. Audio Greeting (Web Speech API)
  // ═══════════════════════════════════════
  let greetingPlayed = false;
  function playGreeting() {
    if (greetingPlayed) return;
    const msg = new SpeechSynthesisUtterance();
    msg.text = "Hi dear, Welcome to Aranova. With Aranova, you are Special.";
    msg.rate = 0.85;
    msg.pitch = 1.0;
    window.speechSynthesis.speak(msg);
    greetingPlayed = true;
  }
  document.addEventListener('click', playGreeting, { once: true });
  document.addEventListener('scroll', playGreeting, { once: true });

  // ═══════════════════════════════════════
  //  10. Scroll Listener
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

})();
