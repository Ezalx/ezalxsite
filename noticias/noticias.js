// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    const setMenu = (open) => {
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        navMenu.classList.toggle('is-open', open);
    };

    navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
    navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// Lead tracking (Google Analytics)
document.querySelectorAll('a[href^="https://wa.me/"], a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'function') return;
        gtag('event', 'generate_lead', {
            method: link.href.startsWith('mailto:') ? 'email' : 'whatsapp',
            link_location: link.dataset.location || 'noticias'
        });
    });
});
