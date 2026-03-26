// Custom Cursor Physics
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// Smooth follower logic loop
function animateCursor() {
    // Easing formula for the follower ring
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover effect to interactive elements
const interactiveLinks = document.querySelectorAll('a, button, .skill-item');
interactiveLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.5)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1.5)`;
        follower.style.borderColor = 'var(--text-primary)';
    });
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1)`;
        follower.style.borderColor = 'var(--accent)';
    });
});

// Scroll Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Play once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation for hamburger lines
        hamburger.classList.toggle('toggle');
        if (hamburger.classList.contains('toggle')) {
            hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburger.children[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.transform = 'none';
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.transform = 'none';
        });
    });
}
