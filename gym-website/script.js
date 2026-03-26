// Interação de Scroll no Menu (Navbar)
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Interação Mobile (Menu Hambúrguer)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navBtns = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em um link (Mobile)
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Animações de Entrada (Scroll Reveal)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    observer.observe(el);
});

// Atualizar Link Ativo no Menu Baseado na Seção Visível
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Verifica se chegamos na seção
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href').includes(current)) {
            btn.classList.add('active');
        }
    });
});
