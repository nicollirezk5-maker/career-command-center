// =============================================
// SHAPE & SHIP STUDIO — Interactions
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initSmoothScroll();
    initAnimations();
});

// ── Navbar scroll effect ──
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ── Smooth scroll for anchor links ──
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            e.preventDefault();
            const target = document.querySelector(id);
            if (target) {
                // Close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('open');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── Intersection Observer for reveal animations ──
function initAnimations() {
    // Add data-animate to all animatable elements
    const selectors = [
        '.hero-badge', '.hero h1', '.hero-sub', '.hero-cta',
        '.metric',
        '.service-card',
        '.work-card',
        '.process-step',
        '.about-text', '.about-tags',
        '.contact-inner',
        '.section-title', '.label'
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.setAttribute('data-animate', '');
            el.style.transitionDelay = `${i * 0.05}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}
