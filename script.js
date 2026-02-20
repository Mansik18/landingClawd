/* ============================================
   CLAWD LANDING — Advanced Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Cursor Glow Follow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // --- Particle System ---
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir * 0.002;
                if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDir *= -1;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        const particleCount = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    const announcementBar = document.querySelector('.announcement-bar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
            if (announcementBar) {
                announcementBar.style.transform = 'translateY(-100%)';
                announcementBar.style.position = 'fixed';
                announcementBar.style.top = '0';
                announcementBar.style.left = '0';
                announcementBar.style.right = '0';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (announcementBar) {
                announcementBar.style.transform = 'translateY(0)';
                announcementBar.style.position = 'relative';
            }
        }
    });

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // --- Use Case Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- Terminal Typing Effect ---
    const commands = [
        { cmd: 'clawdcloud deploy --plan hobby', output: '> OpenClaw развёрнут на managed VPS. Статус: online. Время: 47 сек.' },
        { cmd: 'clawdcloud status', output: '> OpenClaw v3.2.1 | Uptime: 99.98% | RAM: 1.2/2GB | Бэкап: 2 часа назад' },
        { cmd: 'clawdcloud connect --telegram @mybot', output: '> Telegram-бот подключён. OpenClaw доступен в чате. Всё готово.' },
        { cmd: 'clawdcloud upgrade --plan pro', output: '> Тариф обновлён до Pro. 8GB RAM, +$50 бонусных кредитов. Без простоя.' },
        { cmd: 'clawdcloud logs --tail 5', output: '> [OK] 12 задач выполнено | [OK] Бэкап завершён | [OK] Обновление установлено' },
    ];

    const terminalCommand = document.getElementById('terminalCommand');
    const terminalOutput = document.getElementById('terminalOutput');
    let cmdIndex = 0;

    function typeCommand(text, callback) {
        let i = 0;
        terminalCommand.textContent = '';
        terminalOutput.textContent = '';

        function type() {
            if (i < text.length) {
                terminalCommand.textContent += text[i];
                i++;
                setTimeout(type, 30 + Math.random() * 40);
            } else {
                setTimeout(callback, 500);
            }
        }
        type();
    }

    function showOutput(text, callback) {
        terminalOutput.style.opacity = '0';
        terminalOutput.textContent = text;
        setTimeout(() => {
            terminalOutput.style.transition = 'opacity 0.3s';
            terminalOutput.style.opacity = '1';
            setTimeout(callback, 3000);
        }, 100);
    }

    function runTerminalLoop() {
        const { cmd, output } = commands[cmdIndex];
        typeCommand(cmd, () => {
            showOutput(output, () => {
                cmdIndex = (cmdIndex + 1) % commands.length;
                runTerminalLoop();
            });
        });
    }

    if (terminalCommand) {
        setTimeout(runTerminalLoop, 1500);
    }

    // --- Animated Counters ---
    function animateCounter(el, target, prefix, suffix) {
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startVal + (target - startVal) * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Counter for hero social proof
    const proofCount = document.querySelector('.proof-count');
    if (proofCount) {
        const target = parseInt(proofCount.dataset.target) || 847;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(proofCount, target, '', '');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(proofCount);
    }

    // Savings counter
    const savingsNumber = document.querySelector('.savings-number');
    if (savingsNumber) {
        const target = parseInt(savingsNumber.dataset.target) || 589;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(savingsNumber, target, '$', '');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(savingsNumber);
    }

    // --- 3D Tilt Effect ---
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- Scroll Reveal with Stagger ---
    const revealElements = document.querySelectorAll(
        '.step-card, .bento-card, .int-chip, .pricing-card, .pricing-free, .faq-item, .use-case-card, .waitlist-form, .section-badge, .section-title, .section-subtitle'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Add stagger classes to grids
    document.querySelectorAll('.bento-grid, .steps-grid, .pricing-grid, .faq-list').forEach(grid => {
        grid.classList.add('reveal-stagger');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Spots Counter (dynamic from DB) ---
    const TOTAL_SPOTS = 500;
    const spotsCounter = document.getElementById('spotsCounter');
    const waitlistSpots = document.getElementById('waitlistSpots');

    function updateSpots(count) {
        const remaining = Math.max(0, TOTAL_SPOTS - count);
        if (spotsCounter) spotsCounter.textContent = remaining;
        if (waitlistSpots) waitlistSpots.textContent = remaining;
    }

    async function fetchSpots() {
        try {
            const res = await fetch('/api/waitlist/count');
            const { count } = await res.json();
            updateSpots(count);
        } catch (_) {}
    }

    fetchSpots();

    // --- Bar Chart Animation ---
    const barFills = document.querySelectorAll('.bar-fill');
    if (barFills.length) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Bars already have height set in HTML, just trigger animation
                    entry.target.style.height = entry.target.style.height;
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        barFills.forEach(bar => {
            const targetHeight = bar.style.height;
            bar.style.height = '0%';
            chartObserver.observe(bar);

            const parentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            bar.style.height = targetHeight;
                        }, 300);
                        parentObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            parentObserver.observe(bar.closest('.bento-card') || bar);
        });
    }

    // --- Waitlist Form ---
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistSuccess = document.getElementById('waitlistSuccess');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Отправка...';

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                telegram: document.getElementById('telegram').value,
                useCase: document.getElementById('useCase').value,
            };

            try {
                const res = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Ошибка сервера');
                }

                updateSpots(data.position);
                waitlistForm.style.display = 'none';
                waitlistSuccess.style.display = 'block';
                waitlistSuccess.style.animation = 'fadeInUp 0.5s ease';
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert(err.message);
            }
        });
    }

    // --- Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = '#f0f0f5';
            }
        });
    });
});
