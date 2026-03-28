/* ═══════════════════════════════════════
   ARANOVA MARKETPLACE — Interactions
   ═══════════════════════════════════════ */
(function () {
    'use strict';

    const WHATSAPP_NUMBER = '2349038819790';
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

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
    //  1. Audio Greeting (Bespoke Voice)
    // ═══════════════════════════════════════
    let greetingPlayed = false;

    function playGreeting() {
        if (greetingPlayed) return;
        greetingPlayed = true;

        // Luxury manual fade helper (maximum browser compatibility)
        const fadeAudio = (audio, targetVol, duration) => {
            audio.volume = 0;
            const steps = 25;
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
            // Play Marketplace Greeting (WAV)
            const audio = new Audio('../assets/greeting_marketplace.wav');
            audio.preload = 'auto'; // Force browser fetch to eliminate delay
            audio.play().then(() => {
                fadeAudio(audio, 0.9, 1500);
            }).catch(e => console.error("Greeting blocked/missing:", e));
        } catch (e) {
            console.error("Audio failed:", e);
        }
    }

    // Trigger on interaction (Click is most reliable)
    document.addEventListener('click', playGreeting, { once: true });

    // ═══════════════════════════════════════
    //  2. Savings & Selection Logic
    // ═══════════════════════════════════════
    const essentialItems = $$('.essential-item');
    const essentialsCountEl = $('#essentialsCount');
    const formItemsEl = $('#formItems');

    function updateEssentialsCount() {
        const selected = $$('.essential-item.selected');
        const count = selected.length;
        let totalSavings = 0;

        selected.forEach(el => {
            const savings = parseInt(el.getAttribute('data-savings') || '0', 10);
            totalSavings += savings;
        });

        if (essentialsCountEl) essentialsCountEl.textContent = count;

        if (formItemsEl) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const fiveWeeksFromNow = new Date();
            fiveWeeksFromNow.setDate(now.getDate() + 35);
            const deliveryStr = fiveWeeksFromNow.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

            const items = [];
            items.push(`🕒 ORDERED ON: ${dateStr} at ${timeStr}`);
            items.push(`🚚 ESTIMATED DELIVERY: ${deliveryStr}`);
            items.push(`💰 TOTAL SAVINGS: ₦${totalSavings.toLocaleString()}`);
            items.push(`-----------------------------------`);
            selected.forEach(el => items.push('• ' + el.getAttribute('data-item')));

            formItemsEl.value = items.join('\n');
        }
    }

    essentialItems.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('selected');
            updateEssentialsCount();
        });
    });

    // ═══════════════════════════════════════
    //  3. Order Submission
    // ═══════════════════════════════════════
    const orderForm = $('#orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = $('#formName').value;
            const phone = $('#formPhone').value;
            const city = $('#formCity').value;
            const address = $('#formAddress').value;
            const items = $('#formItems').value;
            const budget = $('#formBudget').value;

            let msg = `*ARANOVA MARKETPLACE — NEW ORDER*\n\n`;
            msg += `*Customer:* ${name}\n`;
            msg += `*WhatsApp:* ${phone}\n`;
            msg += `*Location:* ${city}\n`;
            msg += `*Address:* ${address}\n\n`;
            msg += `*Order Highlights:*\n${items}\n`;
            if (budget) msg += `\n*Notes:* ${budget}\n`;
            msg += `\n_Building a forever home with Aranova_`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
            fetch(this.action, { method: 'POST', body: new FormData(this) });
            window.open(waUrl, '_blank');
            showToast('Opening WhatsApp... Your special order is ready!');
        });
    }

    // ═══════════════════════════════════════
    //  4. General UI
    // ═══════════════════════════════════════
    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
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
            navigator.share({ title: 'Aranova Marketplace', text: 'Save 40%+ on your home essentials.', url: window.location.href });
        } else {
            showToast('Magic link copied! Share the love ✨');
        }
    };

})();
