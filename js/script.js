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
// IntersectionObserver: Navbar & Scrollspy
// ===================================

const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

// --- Navbar ".scrolled" state ---
// A sentinel element at the top of the page triggers the navbar state.
// When it leaves the viewport, the navbar gets the .scrolled class.
const navbarSentinel = document.createElement('div');
navbarSentinel.setAttribute('aria-hidden', 'true');
navbarSentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:50px;pointer-events:none;';
document.body.prepend(navbarSentinel);

if (navbar) {
    const navbarObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // When the sentinel is NOT intersecting (scrolled past 50px), add .scrolled
                if (entry.isIntersecting) {
                    navbar.classList.remove('scrolled');
                } else {
                    navbar.classList.add('scrolled');
                }
            });
        },
        { threshold: 0 }
    );
    navbarObserver.observe(navbarSentinel);
}

// --- Active Section Highlighting (Scrollspy) ---
// Each section is observed. The one most recently intersecting gets highlighted.
if (sections.length > 0 && navLinks.length > 0) {
    const scrollspyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        },
        {
            // rootMargin: top offset accounts for the fixed navbar (negative),
            // bottom offset ensures only the section near the top third triggers.
            rootMargin: '-120px 0px -60% 0px',
            threshold: 0
        }
    );

    sections.forEach((section) => scrollspyObserver.observe(section));
}

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
    '%c💼 Looking for collaboration? Reach out: khalil.muhammad.personal@gmail.com',
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
// Theme & Language Architecture
// ===================================

const THEME_KEY = 'khalil_portfolio_theme';
const LANG_KEY = 'khalil_portfolio_lang';
const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

// Translation Dictionary
const i18nDictionary = {
  en: {
    nav_experience: "Experience",
    nav_work: "Work",
    nav_certifications: "Certifications",
    nav_leadership: "Leadership",
    nav_about: "About",
    nav_contact: "Contact",
    hero_title: "Building secure systems<br>and elegant interfaces",
    hero_subtitle: "IT Specialist & Systems Engineer bridging embedded systems, enterprise IT operations, and full-stack software development.",
    btn_view_work: "Explore Solutions",
    btn_get_in_touch: "Get in Touch",
    projects_title: "Featured Work",
    cat_hardware_title: "Hardware and IoT",
    cat_software_title: "Software Engineering",
    cat_cloud_title: "Cloud and Automation",
    aws_ml_title: "AWS Machine Learning Capstone",
    aws_ml_desc: "Architected and deployed a scalable predictive modeling pipeline utilizing AWS cloud infrastructure. Engineered machine learning algorithms in Python to process large datasets, focusing on high availability, cost-efficiency, and seamless cloud deployment.",
    cat_creative_title: "Creative Ventures",
    badge_featured: "Featured Project",
    turnstile_title: "Smart Turnstile Access Gate",
    turnstile_desc: "Intelligent campus access control system powered by Raspberry Pi 4B and Arduino Mega. Integrates high-frequency RFID/NFC authentication, automated stepper motor gate control, a modern CustomTkinter Python GUI, and real-time synchronization with the university LMS for automated attendance logging.",
    batu_title: "BATU Timetable",
    batu_desc: "University scheduling and course management platform for Borg Al Arab Technological University. Features conflict detection algorithms and automated timetable generation.",
    gdg_title: "GDG on Campus BATU",
    gdg_desc: "Technical community platform and workshop curriculum founded to empower students with cloud technologies, security fundamentals, and collaborative software development.",
    crafted_title: "CRAFTED",
    crafted_desc: "Modern furniture branding project exploring digital art direction and visual design systems.",
    cybersecurity_title: "Cybersecurity & Infrastructure",
    cybersecurity_lead: "Specialized in defensive systems engineering, OS-level hardening, and privacy-centric architecture design.",
    cyber_card1_title: "OS Hardening & System Optimization",
    cyber_card1_desc: "Deep hands-on experience configuring hardened Unix and Windows environments. Proficient in Kali Linux for penetration auditing, Ubuntu Server administration, and high-performance WSL development workflows. Specialized in Windows registry optimization, attack surface minimization, and telemetry neutralization.",
    cyber_card2_title: "Threat Analysis & Defensive Tooling",
    cyber_card2_desc: "Network traffic inspection, vulnerability discovery, and static malware triage. Building custom Python and C++ automation utilities for packet parsing, integrity verification, and incident response mitigation.",
    cyber_card3_title: "Privacy Architecture & Cryptography",
    cyber_card3_desc: "Designing zero-trust workflows, public-key infrastructure (PGP/GPG), encrypted local communication protocols for IoT devices, and virtualized isolation sandboxes for safe execution and research.",
    leadership_title: "Leadership",
    leadership_nexus_subtitle: "The Convergence of Hardware & Intelligence",
    leadership_nexus_desc: "Founded and leading a specialized technical innovation team at BATU, pioneering smart campus solutions. We bridge hardware and software to create intelligent automation systems - from IoT-integrated turnstiles to LMS-synchronized attendance tracking.",
    leadership_role: "Founder & Team Lead",
    leadership_team_size: "5-8 Engineers",
    leadership_domain: "IoT & Automation",
    about_title: "About Me",
    about_p1: "I am an IT Specialist and Systems Engineer with a proven track record of bridging embedded systems, enterprise IT operations, and full-stack software development. With hands-on experience managing university data centers, leading IT operations, and engineering integrated IoT access control systems, I specialize in translating complex operational requirements into highly reliable, secure, and scalable architectures.",
    experience_title: "Experience & IT Operations",
    exp_batu_role: "IT Specialist",
    exp_batu_desc: "Providing comprehensive campus-wide technical support and data center maintenance. Responsible for server health monitoring, operating system and software deployment, and ensuring uninterrupted IT services for faculty and students.",
    exp_ctu_role: "IT Operations Lead",
    exp_ctu_desc: "Directed hardware assembly and supervised lab proctors. Established rigorous hardware audit procedures and effectively minimized instructional downtime by maintaining optimal lab environments.",
    certifications_title: "Certifications & Training",
    cert_nvidia_title: "NVIDIA DLI",
    cert_nvidia_desc: "AI for All: GenAI Practice (Sep 2025)<br>Building LLM Applications With Prompt Engineering (Oct 2025)<br>Building RAG Agents with LLMs (Aug 2026)<br>Getting Started with AI on Jetson Nano (Oct 2025)",
    cert_iti_title: "ITI",
    cert_iti_desc: "NVIDIA DLI Program: Generative AI (Oct 2025)<br>Introduction to Deep Learning (Feb 2026)",
    cert_itida_title: "ITIDA",
    cert_itida_desc: "ITIDA GIGS freelancing program (Apr 2026)",
    contact_title: "Let's Work Together",
    contact_desc: "I'm available for new opportunities and collaborations! Whether you have a project in mind or just want to connect - I'd love to hear from you.",
    btn_send_email: "Request a Consultation",
    btn_my_links: "My Links",
    btn_pgp_key: "Public PGP Key",
    theme_dark: "Dark",
    theme_light: "Light",
    theme_system: "System",
    footer_rights: "© 2026 Khalil Muhammad. All rights reserved.",
    back_to_projects: "Back to Projects",
    links_page_title: "Khalil Muhammad",
    links_page_tagline: "IT Undergraduate & Cybersecurity Specialist",
    link_portfolio: "Main Portfolio",
    link_github: "GitHub",
    link_linkedin: "LinkedIn",
    link_facebook: "Facebook",
    link_instagram: "Instagram",
    link_telegram: "Telegram",
    link_whatsapp: "WhatsApp",
    link_email: "Email Me"
  },
  ar: {
    nav_experience: "الخبرات",
    nav_work: "المشاريع",
    nav_certifications: "الشهادات",
    nav_leadership: "القيادة",
    nav_about: "نبذة عني",
    nav_contact: "تواصل معي",
    hero_title: "بناء أنظمة آمنة<br>وواجهات رقمية متقدمة",
    hero_subtitle: "أخصائي تقنية معلومات ومهندس أنظمة يجمع بين الأنظمة المدمجة، عمليات تقنية المعلومات المؤسسية، وتطوير الويب المتكامل.",
    btn_view_work: "استكشاف الحلول",
    btn_get_in_touch: "تواصل معي",
    projects_title: "أبرز الأعمال",
    cat_hardware_title: "العتاد وإنترنت الأشياء",
    cat_software_title: "هندسة البرمجيات",
    cat_cloud_title: "السحابة والأتمتة",
    aws_ml_title: "مشروع التخرج: تعلم الآلة عبر AWS",
    aws_ml_desc: "تصميم ونشر بنية تحتية قابلة للتطوير للنماذج التنبؤية باستخدام سحابة AWS. برمجة خوارزميات تعلم الآلة بلغة Python لمعالجة البيانات الضخمة، مع التركيز على التوافر العالي، كفاءة التكلفة، والنشر السحابي السلس.",
    cat_creative_title: "مشاريع إبداعية",
    badge_featured: "مشروع مميز",
    turnstile_title: "بوابة العبور الذكية (Smart Turnstile)",
    turnstile_desc: "نظام تحكم ذكي في الدخول مدعوم بمعالج Raspberry Pi 4B و Arduino Mega. يدمج المصادقة عبر RFID/NFC مع التحكم الآلي بمحركات البوابات، وواجهة CustomTkinter حديثة مع الربط اللحظي بنظام إدارة التعلم (LMS) لتسجيل الحضور آلياً.",
    batu_title: "جدول جامعة BATU",
    batu_desc: "منصة إدارة الجداول والمقررات الدراسية لجامعة برج العرب التكنولوجية، تتميز بخوارزميات كشف التعارض والإنشاء الآلي للجداول.",
    gdg_title: "مجتمع GDG on Campus BATU",
    gdg_desc: "منصة مجتمعية ومنهج ورش عمل تقنية تأسست لتمكين الطلاب من تقنيات السحابة وأساسيات الأمان وتطوير البرمجيات التعاونية.",
    crafted_title: "هوية CRAFTED",
    crafted_desc: "مشروع هوية بصرية وتصميم أنظمة واجهات متكاملة لعلامة أثاث عصرية.",
    cybersecurity_title: "الأمن السيبراني والبنية التحتية",
    cybersecurity_lead: "متخصص في هندسة الأنظمة الدفاعية، تعزيز أمان أنظمة التشغيل، وتصميم البنى التحتية المرتكزة على الخصوصية.",
    cyber_card1_title: "تأمين أنظمة التشغيل وتحسين الأداء",
    cyber_card1_desc: "خبرة عملية عميقة في تكوين بيئات Unix و Windows المؤمنة. إتقان العمل بنظام Kali Linux لتدقيق الاختراق، وإدارة خوادم Ubuntu، وبيئات WSL عالية الأداء، مع تحسين سجل النظام (Registry) وتقليل مساحات الهجوم.",
    cyber_card2_title: "تحليل التهديدات والأدوات الدفاعية",
    cyber_card2_desc: "فحص وتحليل حزم الشبكات، واكتشاف الثغرات، والتحليل الساكن للبرمجيات الخبيثة. بناء أدوات أتمتة مخصصة بلغات Python و C++ للتحقق من سلامة البيانات والاستجابة للحوادث.",
    cyber_card3_title: "هندسة الخصوصية والتشفير",
    cyber_card3_desc: "تصميم آليات المصادقة عديمة الثقة (Zero Trust)، وتطبيق البنية التحتية للمفاتيح العامة (PGP/GPG)، وبروتوكولات الاتصال المشفرة لأجهزة إنترنت الأشياء، وعزل البيئات الافتراضية.",
    leadership_title: "القيادة والفرق التقنية",
    leadership_nexus_subtitle: "ملتقى العتاد والذكاء التقني",
    leadership_nexus_desc: "مؤسس وقائد فريق الابتكار التقني NEXUS بجامعة BATU لتطوير حلول الحرم الجامعي الذكي وأنظمة الأتمتة المدمجة وتتبع الحضور.",
    leadership_role: "المؤسس وقائد الفريق",
    leadership_team_size: "5-8 مهندسين",
    leadership_domain: "إنترنت الأشياء والأتمتة",
    about_title: "نبذة عني",
    about_p1: "أعمل كأخصائي تقنية المعلومات ومهندس نظم، وأمتلك سجلاً حافلاً في دمج الأنظمة المدمجة، وإدارة عمليات تقنية المعلومات المؤسسية، وتطوير الويب المتكامل. من خلال خبرتي العملية في إدارة مراكز بيانات الجامعة، وقيادة البنية التحتية التقنية، وهندسة أنظمة التحكم في الوصول المتكاملة بتقنيات إنترنت الأشياء، أختص في تحويل المتطلبات التشغيلية المعقدة إلى بنى تحتية مؤسسية موثوقة، آمنة، وقابلة للتوسع.",
    experience_title: "الخبرات الميدانية والعمليات التقنية",
    exp_batu_role: "أخصائي تقنية المعلومات",
    exp_batu_desc: "توفير الدعم الفني الشامل وإدارة مراكز البيانات على مستوى الحرم الجامعي. مسؤول عن مراقبة استقرار الخوادم، ونشر أنظمة التشغيل، وصيانة البنية التحتية لضمان استمرارية الخدمات التقنية لأعضاء هيئة التدريس والطلاب.",
    exp_ctu_role: "قائد عمليات تقنية المعلومات",
    exp_ctu_desc: "إدارة تجميع العتاد والإشراف التقني على المعامل. تأسيس إجراءات صارمة لتدقيق الأجهزة، والحد بفعالية من أوقات التوقف عن العمل عبر ضمان استقرار بيئات التشغيل الأكاديمية.",
    certifications_title: "الشهادات المهنية والتدريب",
    cert_nvidia_title: "NVIDIA DLI",
    cert_nvidia_desc: "الذكاء الاصطناعي للجميع: ممارسة الذكاء الاصطناعي التوليدي (سبتمبر 2025)<br>بناء تطبيقات النماذج اللغوية الكبيرة مع هندسة الأوامر (أكتوبر 2025)<br>بناء وكلاء RAG باستخدام النماذج اللغوية الكبيرة (أغسطس 2026)<br>البدء مع الذكاء الاصطناعي على أجهزة Jetson Nano (أكتوبر 2025)",
    cert_iti_title: "معهد تكنولوجيا المعلومات (ITI)",
    cert_iti_desc: "برنامج NVIDIA DLI: الذكاء الاصطناعي التوليدي (أكتوبر 2025)<br>مقدمة في التعلم العميق (فبراير 2026)",
    cert_itida_title: "هيئة تنمية صناعة تكنولوجيا المعلومات (ITIDA)",
    cert_itida_desc: "برنامج العمل الحر ITIDA GIGS (أبريل 2026)",
    contact_title: "لنعمل معاً",
    contact_desc: "متاح للفرص الجديدة والتعاون في المشاريع البرمجية والأنظمة المدمجة. يسعدني دائماً تواصلكم!",
    btn_send_email: "طلب استشارة",
    btn_my_links: "روابطي",
    btn_pgp_key: "مفتاح PGP العام",
    theme_dark: "داكن",
    theme_light: "فاتح",
    theme_system: "النظام",
    footer_rights: "© 2026 خليل محمد. جميع الحقوق محفوظة.",
    back_to_projects: "العودة للمشاريع",
    links_page_title: "خليل محمد",
    links_page_tagline: "طالب تكنولوجيا المعلومات ومتخصص أمن سيبراني",
    link_portfolio: "الموقع الرئيسي",
    link_github: "جيت هاب",
    link_linkedin: "لينكد إن",
    link_facebook: "فيسبوك",
    link_instagram: "إنستغرام",
    link_telegram: "تيليجرام",
    link_whatsapp: "واتساب",
    link_email: "راسلني بالبريد"
  }
};

// ============================================
// 1. Theme Controller
// ============================================

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(mode) {
  let effectiveTheme = mode;
  if (mode === 'system') {
    effectiveTheme = systemDarkMedia.matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  document.documentElement.setAttribute('data-theme-mode', mode);
  updateThemeDropdownUI(mode, effectiveTheme);
}

function updateThemeDropdownUI(mode, effectiveTheme) {
  const currentThemeIcons = document.querySelectorAll('#currentThemeIcon, .currentThemeIcon');
  currentThemeIcons.forEach(icon => {
    if (mode === 'system') {
      icon.className = 'fas fa-desktop currentThemeIcon';
    } else if (effectiveTheme === 'light') {
      icon.className = 'fas fa-sun currentThemeIcon';
    } else {
      icon.className = 'fas fa-moon currentThemeIcon';
    }
  });

  document.querySelectorAll('.dropdown-item[data-theme-val]').forEach(item => {
    const val = item.getAttribute('data-theme-val');
    if (val === mode) {
      item.classList.add('selected');
      item.setAttribute('aria-selected', 'true');
    } else {
      item.classList.remove('selected');
      item.setAttribute('aria-selected', 'false');
    }
  });
}

// System theme change listener
systemDarkMedia.addEventListener('change', () => {
  if (getStoredTheme() === 'system') {
    applyTheme('system');
  }
});

// ============================================
// 2. Language Controller
// ============================================

function getStoredLang() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

function applyLanguage(lang) {
  // Fade out the DOM
  document.body.style.opacity = '0';
  
  // Wait for fade out, then swap layout/text, then fade in
  setTimeout(() => {
    const targetLang = lang === 'ar' ? 'ar' : 'en';
    const isRtl = targetLang === 'ar';

    document.documentElement.setAttribute('lang', targetLang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    const currentLangLabels = document.querySelectorAll('#currentLangLabel, .currentLangLabel');
    currentLangLabels.forEach(label => {
      label.textContent = targetLang.toUpperCase();
    });

    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
      const val = item.getAttribute('data-lang');
      if (val === targetLang) {
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // Update i18n text nodes
    const dict = i18nDictionary[targetLang] || i18nDictionary.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict && dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    localStorage.setItem(LANG_KEY, targetLang);
    
    // Fade the DOM back in
    document.body.style.opacity = '1';
  }, 300);
}

// ============================================
// 3. Dropdown Menu Interaction Manager
// ============================================

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
    menu.classList.remove('active');
  });
  document.querySelectorAll('.dropdown.open').forEach(dropdown => {
    dropdown.classList.remove('open');
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  });
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyActive = menu.classList.contains('active');

      closeAllDropdowns();

      if (!isCurrentlyActive) {
        menu.classList.add('active');
        dropdown.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  // Direct Language Selection Items
  document.querySelectorAll('.dropdown-item[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang) {
        localStorage.setItem(LANG_KEY, selectedLang);
        applyLanguage(selectedLang);
        closeAllDropdowns();
      }
    });
  });

  // Direct Theme Selection Items
  document.querySelectorAll('.dropdown-item[data-theme-val]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedTheme = btn.getAttribute('data-theme-val');
      if (selectedTheme) {
        localStorage.setItem(THEME_KEY, selectedTheme);
        applyTheme(selectedTheme);
        closeAllDropdowns();
      }
    });
  });
}

// ============================================
// Initialization on Page Load
// ============================================

applyTheme(getStoredTheme());
applyLanguage(getStoredLang());
initDropdowns();