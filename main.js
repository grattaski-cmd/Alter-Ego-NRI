(function() {
    'use strict';

    // ============================================================
    // 1. ЗАГРУЗОЧНЫЙ ЭКРАН
    // ============================================================
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
                document.querySelector('.content, .container')?.classList.add('loaded');
            }, 600);
        });
        setTimeout(function() {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 3000);
    }

    // ============================================================
    // 2. ТЕМА (светлая/тёмная)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (themeToggle) {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            body.classList.add('light');
            themeToggle.textContent = '☀️';
        }
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light');
            const isLight = body.classList.contains('light');
            this.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            body.classList.add('theme-switching');
            setTimeout(() => body.classList.remove('theme-switching'), 300);
        });
    }

    // ============================================================
    // 3. ДИНАМИЧЕСКИЙ ГРАДИЕНТНЫЙ ФОН
    // ============================================================
    const gradientBg = document.getElementById('gradient-bg');
    if (gradientBg) {
        let x = 20, y = 30;
        let direction = 1;
        setInterval(() => {
            x += 0.2 * direction;
            y += 0.1 * direction;
            if (x > 80 || x < 20) direction *= -1;
            const isLight = body.classList.contains('light');
            const color1 = isLight ? '#f0ebe5' : '#1a1320';
            const color2 = isLight ? '#f7f3ee' : '#0b0a0f';
            gradientBg.style.background = `radial-gradient(circle at ${x}% ${y}%, ${color1}, ${color2} 80%)`;
        }, 100);
    }

    // ============================================================
    // 4. ПРОГРЕСС-БАР
    // ============================================================
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    }

    // ============================================================
    // 5. КНОПКА «НАВЕРХ»
    // ============================================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) backBtn.classList.add('visible');
            else backBtn.classList.remove('visible');
        });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================================
    // 6. НАВИГАЦИЯ — скролл и активная ссылка
    // ============================================================
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });
    }

    // Подсветка активной ссылки (для страниц с якорями)
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length) {
        const sections = document.querySelectorAll('.lore-block, .quote-block, .dev-note, .subtype-card, .type-header');
        if (sections.length) {
            window.addEventListener('scroll', function() {
                let current = '';
                sections.forEach(section => {
                    const top = section.offsetTop - 150;
                    if (window.scrollY >= top) {
                        current = section.id;
                    }
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });
        }
    }

    // ============================================================
    // 7. БУРГЕР-МЕНЮ
    // ============================================================
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');
    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('open');
        });
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('open');
            });
        });
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('open');
            }
        });
    }

    // ============================================================
    // 8. ПОИСК ПО САЙТУ
    // ============================================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Добавили .card-link для поиска на главной
        const allCards = document.querySelectorAll('.card, .card-link, .race-card, .subtype-card, .gestalt-block, .lore-block');
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            let hasVisible = false;
            allCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isMatch = text.includes(query);
                card.style.display = (isMatch || query === '') ? '' : 'none';
                if (isMatch) hasVisible = true;
                if (isMatch && !card.classList.contains('visible')) {
                    card.classList.add('visible');
                }
            });
            let noResults = document.getElementById('no-results');
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.id = 'no-results';
                noResults.style.textAlign = 'center';
                noResults.style.color = 'var(--text-muted)';
                noResults.style.marginTop = '2rem';
                searchInput.parentNode.after(noResults);
            }
            if (query !== '' && !hasVisible) {
                noResults.textContent = 'Ничего не найдено. Попробуйте изменить запрос.';
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        });
    }

    // ============================================================
    // 9. ХЛЕБНЫЕ КРОШКИ (генерируются автоматически)
    // ============================================================
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (breadcrumbContainer) {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        const pageName = page.replace('.html', '').replace(/-/g, ' ');
        const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        let html = '<a href="index.html">Главная</a>';
        if (page !== 'index.html') {
            html += ' <span class="separator">›</span> ';
            html += `<span class="current">${capitalized}</span>`;
        }
        breadcrumbContainer.innerHTML = html;
    }

    // ============================================================
    // 10. ПЛАВАЮЩЕЕ ОГЛАВЛЕНИЕ (TOC)
    // ============================================================
    const tocFab = document.getElementById('tocFab');
    const tocPanel = document.getElementById('tocPanel');
    if (tocFab && tocPanel) {
        tocFab.addEventListener('click', function(e) {
            e.stopPropagation();
            tocPanel.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!tocPanel.contains(e.target) && !tocFab.contains(e.target)) {
                tocPanel.classList.remove('open');
            }
        });
        tocPanel.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    tocPanel.classList.remove('open');
                }
            });
        });
    }

    // ============================================================
    // 11. АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК (Intersection Observer)
    // ============================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    // Добавили .card-link в список наблюдаемых
    document.querySelectorAll('.card, .card-link, .race-card, .subtype-card, .quote-block:not(.visible), .gestalt-block, .lore-block').forEach(el => {
        observer.observe(el);
    });

    // ============================================================
    // 12. ЧАСТИЦЫ
    // ============================================================
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        const PARTICLE_COUNT = 55;
        let mouseX = 0, mouseY = 0;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.speedY = (Math.random() - 0.5) * 0.08;
                this.opacity = Math.random() * 0.28 + 0.08;
            }
            update() {
                this.x += 0.08;
                const dx = this.x - mouseX, dy = this.y - mouseY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    const angle = Math.atan2(dy, dx);
                    const force = (120 - dist) / 120 * 0.6;
                    this.x += Math.cos(angle) * force;
                    this.y += Math.sin(angle) * force;
                }
                this.x += this.speedX; this.y += this.speedY;
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
                if (this.y > height + 20) this.y = -20;
                if (this.y < -20) this.y = height + 20;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 165, 140, ${this.opacity})`;
                ctx.fill();
            }
        }
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ============================================================
    // 13. МИКРО-ВЗАИМОДЕЙСТВИЯ: Ripple-эффект для кнопок
    //     (Исключаем фиксированные элементы, чтобы не ломать позиционирование)
    // ============================================================
    document.querySelectorAll('.btn, .card a').forEach(el => {
        el.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'var(--accent-glow)';
            ripple.style.left = (x - 10) + 'px';
            ripple.style.top = (y - 10) + 'px';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.6s, opacity 0.6s';
            ripple.style.opacity = '0.6';
            // Если у элемента position static, делаем relative для корректного позиционирования ripple
            const computed = window.getComputedStyle(this).position;
            if (computed === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(10)';
                ripple.style.opacity = '0';
            });
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // ============================================================
    // 14. МОДАЛЬНОЕ ОКНО (для карточек на index и похожих страницах)
    // ============================================================
    const modal = document.getElementById('modal');
    if (modal) {
        const modalClose = document.getElementById('modalClose');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalTag = document.getElementById('modalTag');

        document.querySelectorAll('.card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('a')) return;
                const title = this.querySelector('h3')?.textContent || 'Без названия';
                const desc = this.querySelector('p')?.textContent || 'Нет описания';
                const tag = this.querySelector('.tag')?.textContent || '';
                if (modalTitle) modalTitle.textContent = title;
                if (modalDesc) modalDesc.textContent = desc;
                if (modalTag) modalTag.textContent = tag;
                modal.classList.add('active');
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => modal.classList.remove('active'));
        }
        modal.addEventListener('click', function(e) {
            if (e.target === this) modal.classList.remove('active');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') modal.classList.remove('active');
        });
    }

})();

// ===== ХЛЕБНЫЕ КРОШКИ =====
const breadcrumbContainer = document.getElementById('breadcrumbs');
if (breadcrumbContainer) {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    const pageNames = {
        'index.html': 'Главная',
        'races.html': 'Расы',
        'alt-gestalt.html': 'А. Гештальт',
        'lore.html': 'Лор',
        'traits.html': 'Черты',
        'Backstories.html': 'Предыстории',
        'alternative.html': 'Отыгрыш',
        'true-gestalt.html': 'И. Гештальт',
        'classes.html': 'Классы персонажей'
    };
    const pageName = pageNames[page] || page.replace('.html', '').replace(/-/g, ' ');
    const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    let html = '<a href="index.html">Главная</a>';
    if (page !== 'index.html') {
        html += ' <span class="separator">›</span> ';
        html += `<span class="current">${capitalized}</span>`;
    }
    breadcrumbContainer.innerHTML = html;
}