/* ═══════════════════════════════════════
   ARANOVA MARKETPLACE — Interactions
   ═══════════════════════════════════════ */
(function () {
    'use strict';

    const WHATSAPP_NUMBER = '2349038819790';
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    // ─── Handle broken images ───
    $$('img').forEach(img => {
        img.addEventListener('error', function () {
            this.setAttribute('data-error', 'true');
            this.alt = this.alt || 'Product image';
        });
    });

    // ═══════════════════════════════════════
    //  1. Scroll Progress
    // ═══════════════════════════════════════
    const scrollBar = $('#scrollProgress');
    function updateScrollProgress() {
        const scrolled = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollBar && height > 0) {
            scrollBar.style.width = (scrolled / height * 100) + '%';
        }
    }

    // ═══════════════════════════════════════
    //  2. Navbar Scroll Effect
    // ═══════════════════════════════════════
    const navbar = $('#navbar');
    function handleNavScroll() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    // Combined scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                handleNavScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ═══════════════════════════════════════
    //  3. Mobile Nav Toggle
    // ═══════════════════════════════════════
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        $$('[data-nav]').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ═══════════════════════════════════════
    //  4. Scroll Reveal
    // ═══════════════════════════════════════
    const revealItems = $$('.reveal');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════
    //  5. FAQ Accordion
    // ═══════════════════════════════════════
    $$('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all others
            $$('.faq-item.active').forEach(active => {
                if (active !== item) active.classList.remove('active');
            });

            item.classList.toggle('active', !isActive);
            this.setAttribute('aria-expanded', !isActive);
        });
    });

    // ═══════════════════════════════════════
    //  6. Order Form Submission
    // ═══════════════════════════════════════
    const orderForm = $('#orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = ($('#formName') || {}).value || '';
            const email = ($('#formEmail') || {}).value || '';
            const phone = ($('#formPhone') || {}).value || '';
            const city = ($('#formCity') || {}).value || '';
            const items = ($('#formItems') || {}).value || '';
            const budget = ($('#formBudget') || {}).value || '';

            // Fire-and-forget to Formspree
            const formData = new FormData(this);
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch(() => { /* silent fail — WhatsApp is primary */ });

            // Build WhatsApp message
            let msg = `*Aranova MarketPlace — New Order*\n\n`;
            msg += `*Name:* ${name}\n`;
            msg += `*Email:* ${email}\n`;
            msg += `*Phone:* ${phone}\n`;
            msg += `*Delivery:* ${city}\n`;
            msg += `*Items:*\n${items}\n`;
            if (budget) msg += `\n*Budget/Notes:* ${budget}\n`;
            msg += `\n_Sent from Aranova Marketplace_`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

            // Update button → confirm
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const original = submitBtn.textContent;
                submitBtn.textContent = '✓ Request Sent! Opening WhatsApp…';
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.textContent = original;
                    submitBtn.disabled = false;
                }, 3000);
            }

            // GA4 event
            if (typeof gtag === 'function') {
                gtag('event', 'marketplace_order', {
                    event_category: 'conversion',
                    event_label: city,
                    value: 1
                });
            }

            // Open WhatsApp
            setTimeout(() => window.open(waUrl, '_blank'), 400);
        });
    }

    // ═══════════════════════════════════════
    //  7. CTA Click Tracking
    // ═══════════════════════════════════════
    $$('[data-cta]').forEach(el => {
        el.addEventListener('click', function () {
            const action = this.getAttribute('data-cta');
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    event_category: 'engagement',
                    event_label: action,
                    value: 1
                });
            }
        });
    });

    // ═══════════════════════════════════════
    //  8. Smooth Scroll for Anchors
    // ═══════════════════════════════════════
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

})();
