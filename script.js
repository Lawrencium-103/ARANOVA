/* ═══════════════════════════════════════
   ARANOVA — JavaScript Interactions
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '2349038819790';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ─── Utility ───
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
  //  1. Audio Luxury Suite (Bespoke Voice + Celebration)
  // ═══════════════════════════════════════
  let sensoryTriggered = false;

  // Preloading audio globally eliminates network latency on click
  const greetingAudio = new Audio('assets/greeting_main.wav');
  greetingAudio.preload = 'auto';
  const celebrationAudio = new Audio('assets/celebration.mp3');
  celebrationAudio.preload = 'auto';

  function triggerSensory() {
    if (sensoryTriggered) return;
    sensoryTriggered = true;

    // Luxury manual fade helper (maximum browser compatibility)
    const fadeAudio = (audio, targetVol, duration) => {
      audio.volume = 0;
      const steps = 30;
      const stepVal = targetVol / steps;
      const stepTime = duration / steps;
      let current = 0;
      const timer = setInterval(() => {
        if (current < steps) {
          audio.volume = Math.min(targetVol, audio.volume + stepVal);
          current++;
        } else {
          clearInterval(timer);
        }
      }, stepTime);
    };

    try {
      // 1. Play Premium Greeting (WAV)
      greetingAudio.play().then(() => {
        fadeAudio(greetingAudio, 0.95, 1200);
      }).catch(e => console.error("Greeting blocked/missing:", e));

      // 2. Play Celebration (MP3) after a much shorter delay
      setTimeout(() => {
        celebrationAudio.play().then(() => {
          fadeAudio(celebrationAudio, 0.5, 2000);

          // Fade out and pause after 7.5 seconds
          setTimeout(() => {
            const outTimer = setInterval(() => {
              if (celebration.volume > 0.05) {
                celebration.volume -= 0.05;
              } else {
                celebration.pause();
                clearInterval(outTimer);
              }
            }, 120);
          }, 7500);
        }).catch(e => console.error("Celebration blocked/missing:", e));
      }, 600); // Reduced delay from 3500ms to 600ms

    } catch (e) { console.error("Sensory suite failed:", e); }
  }

  // Exclusive Click trigger for absolute reliability
  document.addEventListener('click', triggerSensory, { once: true });

  // ═══════════════════════════════════════
  //  2. Dynamic Calendar & Booking Logic
  // ═══════════════════════════════════════
  function renderCalendar() {
    const container = $('#calendarWidget');
    if (!container) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Update Scarcity Headlines
    const monthYearStr = `${monthNames[currentMonth]} ${currentYear}`;
    if ($('#calMonthOut')) $('#calMonthOut').textContent = monthYearStr;
    if ($('#monthNameText')) $('#monthNameText').innerHTML = `<strong>${monthNames[currentMonth]}</strong>`;

    // Calendar Calculations
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let html = `<div class="calendar-header"><h4>${monthYearStr}</h4></div>`;
    html += `<div class="calendar-grid">`;

    // Day Labels
    ["S", "M", "T", "W", "T", "F", "S"].forEach(day => {
      html += `<div class="calendar-day-label">${day}</div>`;
    });

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="day empty"></div>`;
    }

    let saturdayCount = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(currentYear, currentMonth, i);
      const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = i < today;

      let className = "day";
      if (isPast) className += " past";
      if (i === today) className += " today";
      if (isWeekend) className += " weekend";
      className += " available"; // Now all days are available to click
      if (dayOfWeek === 6 && !isPast) saturdayCount++;

      html += `<div class="${className}" data-date="${i} ${monthNames[currentMonth]} ${currentYear}">${i}</div>`;
    }
    html += `</div>`;
    container.innerHTML = html;

    // Update Dynamic Scarcity Counter (Saturdays focus)
    const totalSlotsRemaining = saturdayCount; // 1 slot per Saturday
    if ($('#slotsCounter')) $('#slotsCounter').textContent = totalSlotsRemaining;
    if ($('#slotsText')) $('#slotsText').textContent = totalSlotsRemaining;

    // Interaction
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('available')) {
        const date = e.target.getAttribute('data-date');
        const dateInput = $('#formDate');
        if (dateInput) {
          dateInput.value = date;

          // Scroll to Form
          const bookingSection = $('#booking');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
          }

          showToast(`Selected: ${date} ✨`);
          $$('.day').forEach(d => d.classList.remove('selected'));
          e.target.classList.add('selected');
        }
      } else if (e.target.classList.contains('past')) {
        showToast("That moment is already iconic. Please pick a future date! ✨");
      }
    });
  }

  // ═══════════════════════════════════════
  //  2.1 Social Proof Ticker Logic
  // ═══════════════════════════════════════
  function renderTicker() {
    const tickerEl = $('#socialTicker');
    if (!tickerEl) return;

    // Diverse Nigerian Names & Locations (Biased towards Lagos, Abuja, PH, IB)
    const names1 = ['Ope', 'Tolu', 'Chidi', 'Zainab', 'Nneka', 'Efosa', 'Boma', 'Terhemen', 'Ese', 'Kemi', 'Fatima', 'Bisi', 'Chinwe', 'Halima', 'Ivi', 'Nosa', 'Ejiro', 'Sola', 'Yemisi', 'Ngozi', 'Maryam', 'Aisha', 'Uche', 'Ritgak', 'Weng', 'Ene', 'Ifeoma', 'Funke', 'Hauwa', 'Edidiong', 'Nkem', 'Emeka'];
    const names2 = ['John', 'Femi', 'Amaka', 'Umar', 'Obi', 'Joy', 'Tari', 'Doo', 'David', 'Seun', 'Ali', 'Dele', 'Emeka', 'Sani', 'Preye', 'Osas', 'Ochuko', 'Tunde', 'Kunle', 'Kalu', 'Yusuf', 'Ibrahim', 'Chika', 'Nanfa', 'Dung', 'Oche', 'Chukwudi', 'Segun', 'Abubakar', 'Aniekan', 'Chinedu', 'Chioma'];

    // Increased weight for major centers
    const cities = [
      'Lagos', 'Lagos', 'Lagos', 'Lagos', 'Lagos',
      'Abuja', 'Abuja', 'Abuja', 'Abuja',
      'PH', 'PH', 'PH',
      'IB', 'IB', 'IB',
      'Benin', 'Jos', 'Kano', 'Enugu', 'Uyo', 'Warri', 'Asaba', 'Kaduna', 'Calabar', 'Owerri', 'Ilorin'
    ];

    const shuffle = array => [...array].sort(() => 0.5 - Math.random());
    const sNames1 = shuffle(names1);
    const sNames2 = shuffle(names2);

    let html = '';
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 32; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const year = currentYear + Math.floor(Math.random() * 2);
      const tag = `#${sNames1[i].toUpperCase()}${sNames2[i].toUpperCase()}`;
      html += `<span>${tag} <i>${year} in ${city}</i></span>`;
    }

    // Duplicate content twice to create a seamless infinite scroll effect
    tickerEl.innerHTML = html + html;
  }

  renderCalendar();
  renderTicker();

  // ═══════════════════════════════════════
  //  2.2 Magazine Themes Marquee Logic
  // ═══════════════════════════════════════
  const themesTrack = $('#themesTrack');
  if (themesTrack) {
    // Duplicate the 10 themes for seamless infinite scroll
    const originalThemes = themesTrack.innerHTML;
    themesTrack.innerHTML = originalThemes + originalThemes;
  }

  // ═══════════════════════════════════════
  //  3. Premium WhatsApp Bridge (Invoice Format)
  // ═══════════════════════════════════════
  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(this);

      const name = data.get('name') || 'Valued Guest';
      const phone = data.get('phone') || '';
      const email = data.get('email') || 'N/A';
      const state = data.get('state') || 'Lagos';
      const venue = data.get('venue') || '';
      const eventDate = data.get('event_date') || $('#formDate').value || 'TBD';
      const eventType = data.get('event_type') || 'Celebration';
      const pkg = data.get('package') || 'Custom Package';
      const theme = data.get('magazine_theme') || 'Classic Aranova';

      const now = new Date();
      const orderTimestamp = now.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      let msg = `*✨ ARANOVA OFFICIAL — BOOKING ORDER ✨*\n\n`;
      msg += `*Order Reference:* #${Math.floor(1000 + Math.random() * 9000)}\n`;
      msg += `*Order Initiated:* ${orderTimestamp}\n`;
      msg += `-----------------------------------\n\n`;
      msg += `*👑 CLIENT INFORMATION*\n`;
      msg += `> *Name:* ${name.toUpperCase()}\n`;
      msg += `> *WhatsApp:* ${phone}\n`;
      msg += `> *Email:* ${email}\n\n`;
      msg += `*📍 EVENT DETAILS*\n`;
      msg += `> *Booked Date:* ${eventDate}\n`;
      msg += `> *Event Type:* ${eventType}\n`;
      msg += `> *State:* ${state}\n`;
      msg += `> *Venue:* ${venue}\n\n`;
      msg += `*💎 SERVICE SUMMARY*\n`;
      msg += `> *Service:* ARANOVA BOX EXPERIENCE\n`;
      msg += `> *Package:* ${pkg}\n`;
      msg += `> *Theme:* ${theme}\n`;
      msg += `> *Availability:* Priority Weekend Slot\n\n`;
      msg += `-----------------------------------\n`;
      msg += `\n_Every couple is a story. Your story begins with Aranova._`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

      fetch(this.action, { method: 'POST', body: data });
      window.open(waUrl, '_blank');
      showToast('Opening WhatsApp... Your official order is ready! ✨');
    });
  }

  // ═══════════════════════════════════════
  //  4. General UI & Reveal
  // ═══════════════════════════════════════
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  window.shareToSocial = function () {
    if (navigator.share) {
      navigator.share({ title: 'Aranova', text: 'Where you become the cover.', url: window.location.href });
    } else {
      showToast('Magic link copied! Share the icons ✨');
    }
  };

})();
