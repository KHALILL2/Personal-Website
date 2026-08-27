// ===================================
// Modern Professional Portfolio JS
// Optimized for smooth performance
// ===================================

'use strict';

// ===================================
// Global Error Handling
// ===================================

// Global error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack
  });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// ===================================
// Unified, Passive Scroll & RAF Handler
// ===================================

const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

let isScrolling = false;

function updateOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 1. Navbar scrolled class toggle
    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 2. Active section highlight
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
    
    isScrolling = false;
}

// Single scroll listener with passive: true
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(updateOnScroll);
        isScrolling = true;
    }
}, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Lazy load images when they come into view (for future use)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message for developers
console.log(
    '%c👋 Hello Developer!',
    'color: #ffffff; font-size: 20px; font-weight: bold; background: #000000; padding: 10px; border-radius: 5px;'
);
console.log(
    '%cWelcome to my portfolio. Built with performance and simplicity in mind.',
    'color: #a0a0a0; font-size: 14px;'
);
console.log(
    '%cTech Stack: Bootstrap 5, Font Awesome, AOS, Vanilla JS',
    'color: #666666; font-size: 12px;'
);
console.log(
    '%c💼 Looking for collaboration? Reach out: khalill21652006@gmail.com',
    'color: #ffffff; font-size: 12px;'
);

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #00ff00; font-weight: bold;');
        }
    });
}

// Prevent layout shift
document.fonts.ready.then(() => {
    document.body.style.opacity = '1';
});

// Optimize font loading
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('1em Inter'),
        document.fonts.load('700 1em Inter'),
        document.fonts.load('600 1em Inter')
    ]).then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Remove transitions
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
    });
}

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    // Focus visible outline for keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add keyboard navigation styles
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);
// ===================================
// Mobile Menu Functionality
// ===================================

// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Only initialize if elements exist (for pages that have mobile menu)
if (mobileMenuToggle && mobileMenu) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// ===================================
// Theme Toggle
// ===================================

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const icon = toggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}