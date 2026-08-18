(function() {
    'use strict';

    // ============================================================
    // 0. ГАРАНТИРОВАННОЕ СКРЫТИЕ ЛОАДЕРА
    // ============================================================
    // Скрываем сразу, как только скрипт загрузился
    var loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }

    // Дублируем через таймаут на случай, если что-то помешало
    setTimeout(function() {
        var loader2 = document.getElementById('loader');
        if (loader2) {
            loader2.classList.add('hidden');
        }
    }, 2000);

    // ============================================================
    // 1. ТЕМА (светлая/тёмная)
    // ============================================================
    (function() {
        var themeToggle = document.getElementById('themeToggle');
        var body = document.body;
        if (!themeToggle || !body) return;
        var saved = localStorage.getItem('theme');
        if (saved === 'light') {
            body.classList.add('light');
            themeToggle.textContent = '☀️';
        }
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light');
            var isLight = body.classList.contains('light');
            this.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            body.classList.add('theme-switching');
            setTimeout(function() {
                body.classList.remove('theme-switching');
            }, 300);
        });
    })();

    // ============================================================
    // 2. ДИНАМИЧЕСКИЙ ГРАДИЕНТНЫЙ ФОН
    // ============================================================
    (function() {
        var gradientBg = document.getElementById('gradient-bg');
        var body = document.body;
        if (!gradientBg) return;
        var x = 20, y = 30;
        var direction = 1;
        setInterval(function() {
            x += 0.2 * direction;
            y += 0.1 * direction;
            if (x > 80 || x < 20) direction *= -1;
            var isLight = body.classList.contains('light');
            var color1 = isLight ? '#f0ebe5' : '#1a1320';
            var color2 = isLight ? '#f7f3ee' : '#0b0a0f';
            gradientBg.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, ' + color1 + ', ' + color2 + ' 80%)';
        }, 100);
    })();

    // ============================================================
    // 3. ПРОГРЕСС-БАР
    // ============================================================
    (function() {
        var progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        window.addEventListener('scroll', function() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    })();

    // ============================================================
    // 4. КНОПКА «НАВЕРХ»
    // ============================================================
    (function() {
        var backBtn = document.getElementById('backToTop');
        if (!backBtn) return;
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) backBtn.classList.add('visible');
            else backBtn.classList.remove('visible');
        });
        backBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    // ============================================================
    // 5. НАВИГАЦИЯ — скролл
    // ============================================================
    (function() {
        var nav = document.getElementById('mainNav');
        if (!nav) return;
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });
    })();

    // ============================================================
    // 6. БУРГЕР-МЕНЮ
    // ============================================================
    (function() {
        var navToggle = document.getElementById('navToggle');
        var navLinksContainer = document.getElementById('navLinks');
        var nav = document.getElementById('mainNav');
        if (!navToggle || !navLinksContainer || !nav) return;
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('open');
        });
        navLinksContainer.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
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
    })();

    // ============================================================
    // 7. ПОИСК ПО САЙТУ
    // ============================================================
    (function() {
        var searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        var allCards = document.querySelectorAll('.card, .card-link, .race-card, .subtype-card, .gestalt-block, .lore-block, .trait-card, .backstory-card');
        if (!allCards.length) return;
        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var hasVisible = false;
            allCards.forEach(function(card) {
                var text = card.textContent.toLowerCase();
                var isMatch = text.indexOf(query) !== -1;
                card.style.display = (isMatch || query === '') ? '' : 'none';
                if (isMatch) hasVisible = true;
                if (isMatch && !card.classList.contains('visible')) {
                    card.classList.add('visible');
                }
            });
            var noResults = document.getElementById('no-results');
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.id = 'no-results';
                noResults.style.textAlign = 'center';
                noResults.style.color = 'var(--text-muted)';
                noResults.style.marginTop = '2rem';
                var wrap = searchInput.closest('.search-wrap');
                if (wrap) wrap.after(noResults);
                else searchInput.parentNode.after(noResults);
            }
            if (query !== '' && !hasVisible) {
                noResults.textContent = 'Ничего не найдено. Попробуйте изменить запрос.';
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        });
    })();

    // ============================================================
    // 8. ХЛЕБНЫЕ КРОШКИ (русские названия)
    // ============================================================
    (function() {
        var breadcrumbContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbContainer) return;
        var path = window.location.pathname;
        var page = path.split('/').pop() || 'index.html';
        var pageNames = {
            'index.html': 'Главная',
            'races.html': 'Расы',
            'alt-gestalt.html': 'А. Гештальт',
            'true-gestalt.html': 'И. Гештальт',
            'classes.html': 'Классы персонажей',
            'lore.html': 'Лор',
            'traits.html': 'Черты',
            'Backstories.html': 'Предыстории',
            'alternative.html': 'Отыгрыш'
        };
        var pageName = pageNames[page] || page.replace('.html', '').replace(/-/g, ' ');
        var capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        var html = '<a href="index.html">Главная</a>';
        if (page !== 'index.html') {
            html += ' <span class="separator">›</span> ';
            html += '<span class="current">' + capitalized + '</span>';
        }
        breadcrumbContainer.innerHTML = html;
    })();

    // ============================================================
    // 9. ПЛАВАЮЩЕЕ ОГЛАВЛЕНИЕ (TOC)
    // ============================================================
    (function() {
        var tocFab = document.getElementById('tocFab');
        var tocPanel = document.getElementById('tocPanel');
        if (!tocFab || !tocPanel) return;
        tocFab.addEventListener('click', function(e) {
            e.stopPropagation();
            tocPanel.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!tocPanel.contains(e.target) && !tocFab.contains(e.target)) {
                tocPanel.classList.remove('open');
            }
        });
        tocPanel.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    tocPanel.classList.remove('open');
                }
            });
        });
    })();

    // ============================================================
    // 10. АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК (Intersection Observer)
    // ============================================================
    (function() {
        var elements = document.querySelectorAll('.card, .card-link, .race-card, .subtype-card, .quote-block:not(.visible), .gestalt-block, .lore-block, .trait-card, .backstory-card');
        if (!elements.length) return;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        elements.forEach(function(el) {
            observer.observe(el);
        });
    })();

    // ============================================================
    // 11. ЧАСТИЦЫ
    // ============================================================
    (function() {
        var canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var width, height, particles = [];
        var PARTICLE_COUNT = 55;
        var mouseX = 0, mouseY = 0;

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

        function Particle() {
            this.reset = function() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.speedY = (Math.random() - 0.5) * 0.08;
                this.opacity = Math.random() * 0.28 + 0.08;
            };
            this.update = function() {
                this.x += 0.08;
                var dx = this.x - mouseX, dy = this.y - mouseY;
                var dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    var angle = Math.atan2(dy, dx);
                    var force = (120 - dist) / 120 * 0.6;
                    this.x += Math.cos(angle) * force;
                    this.y += Math.sin(angle) * force;
                }
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > width + 20) this.x = -20;
                if (this.x < -20) this.x = width + 20;
                if (this.y > height + 20) this.y = -20;
                if (this.y < -20) this.y = height + 20;
            };
            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180, 165, 140, ' + this.opacity + ')';
                ctx.fill();
            };
        }

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            var p = new Particle();
            p.reset();
            particles.push(p);
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(function(p) {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    })();

    // ============================================================
    // 12. МИКРО-ВЗАИМОДЕЙСТВИЯ: Ripple-эффект для кнопок
    // ============================================================
    (function() {
        var elements = document.querySelectorAll('.btn, .card a, .filter-btn, .toc-fab, .theme-toggle, #backToTop');
        if (!elements.length) return;
        elements.forEach(function(el) {
            el.addEventListener('click', function(e) {
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var ripple = document.createElement('span');
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
                var computed = window.getComputedStyle(this).position;
                if (computed === 'static') {
                    this.style.position = 'relative';
                }
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                requestAnimationFrame(function() {
                    ripple.style.transform = 'scale(10)';
                    ripple.style.opacity = '0';
                });
                setTimeout(function() {
                    ripple.remove();
                }, 700);
            });
        });
    })();

    // ============================================================
    // 13. МОДАЛЬНОЕ ОКНО
    // ============================================================
    (function() {
        var modal = document.getElementById('modal');
        if (!modal) return;
        var modalClose = document.getElementById('modalClose');
        var modalTitle = document.getElementById('modalTitle');
        var modalDesc = document.getElementById('modalDesc');
        var modalTag = document.getElementById('modalTag');

        var cards = document.querySelectorAll('.card, .trait-card, .backstory-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('a')) return;
                var title = this.querySelector('h3');
                var desc = this.querySelector('p');
                var tag = this.querySelector('.tag');
                if (modalTitle) modalTitle.textContent = title ? title.textContent : 'Без названия';
                if (modalDesc) modalDesc.textContent = desc ? desc.textContent : 'Нет описания';
                if (modalTag) modalTag.textContent = tag ? tag.textContent : '';
                modal.classList.add('active');
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        modal.addEventListener('click', function(e) {
            if (e.target === this) modal.classList.remove('active');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') modal.classList.remove('active');
        });
    })();

})();

var socialLinks = {
    'Telegram': 'https://t.me/blanche_fleur_space',
    'Boosty': 'https://boosty.to/aimorwind'
    // 'Patreon': 'https://patreon.com/...'  // добавишь, когда будет
};