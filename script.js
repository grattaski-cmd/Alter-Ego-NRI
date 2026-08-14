(function() {
    'use strict';

    // ============================================================
    // 1. ТЕМА (светлая / тёмная)
    // ============================================================
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        const body = document.body;
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            body.classList.add('light');
            toggle.textContent = '☀️';
        }

        toggle.addEventListener('click', function() {
            body.classList.add('theme-switching');
            body.classList.toggle('light');
            const isLight = body.classList.contains('light');
            this.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            setTimeout(() => body.classList.remove('theme-switching'), 400);
        });
    }

    // ============================================================
    // 2. ПРОГРЕСС-БАР
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
    // 3. КНОПКА «НАВЕРХ»
    // ============================================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        });
        backBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // 4. ПОИСК (работает на страницах, где есть .search-input и .card)
    // ============================================================
    const searchInput = document.getElementById('searchInput');
    const allCards = document.querySelectorAll('.card');
    if (searchInput && allCards.length) {
        function filterCards(query) {
            const lower = query.toLowerCase().trim();
            allCards.forEach(function(card) {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent?.toLowerCase() || '';
                const tag = card.querySelector('.tag')?.textContent?.toLowerCase() || '';
                const match = lower === '' || title.includes(lower) || desc.includes(lower) || tag.includes(lower);
                card.classList.toggle('hidden', !match);
            });
            // перезапускаем анимацию для видимых карточек
            observeCards();
        }
        searchInput.addEventListener('input', function(e) {
            filterCards(e.target.value);
        });
    }

    // ============================================================
    // 5. НАВИГАЦИЯ (плавный скролл по якорям на текущей странице)
    // ============================================================
    document.querySelectorAll('nav a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(this.getAttribute('href').substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    // 6. АНИМАЦИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ
    // ============================================================
    function observeCards() {
        const cards = document.querySelectorAll('.card:not(.hidden)');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('visible');
                    }, index * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        cards.forEach(function(card) {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                card.classList.add('visible');
            } else {
                observer.observe(card);
            }
        });
    }

    // Запускаем после загрузки и при изменении размера окна
    window.addEventListener('load', observeCards);
    window.addEventListener('resize', observeCards);

    // ============================================================
    // 7. МОДАЛЬНОЕ ОКНО (клик по карточке)
    // ============================================================
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTag = document.getElementById('modalTag');

    if (modal) {
        document.querySelectorAll('.card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') return;
                const title = this.querySelector('h3')?.textContent || 'Без названия';
                const desc = this.querySelector('p')?.textContent || 'Нет описания';
                const tag = this.querySelector('.tag')?.textContent || 'Без тега';
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalTag.textContent = tag;
                modal.classList.add('active');
            });
        });

        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', function(e) {
            if (e.target === this) modal.classList.remove('active');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') modal.classList.remove('active');
        });
    }

    // ============================================================
    // 8. RIPPLE-ЭФФЕКТ НА КАРТОЧКАХ
    // ============================================================
    document.querySelectorAll('.card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = '20px';
            this.appendChild(ripple);
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // ============================================================
    // 9. ИНТЕРАКТИВНЫЙ ФОН (песчинки на canvas)
    // ============================================================
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const PARTICLE_COUNT = 80;
        let mouseX = 0, mouseY = 0;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += 0.08; // ветер слева направо
                // влияние мыши (отталкивание)
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const angle = Math.atan2(dy, dx);
                    const force = (120 - dist) / 120 * 0.6;
                    this.x += Math.cos(angle) * force;
                    this.y += Math.sin(angle) * force;
                }
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
                if (this.y > height + 20) this.y = -20;
                if (this.y < -20) this.y = height + 20;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(210, 190, 160, ' + this.opacity + ')';
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(function(p) {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

})();