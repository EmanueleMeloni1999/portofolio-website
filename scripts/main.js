document.addEventListener("DOMContentLoaded", function() {

    // ========================================
    // INTRO ANIMATION
    // ========================================
    const introScreen = document.getElementById('intro-screen');
    const introImg = document.getElementById('intro-animation');

    if (introScreen && introImg) {
        console.log('Intro elements found, starting animation...');
        // Block scrolling during intro
        document.body.classList.add('intro-active');

        let currentFrame = 0;
        const totalFrames = 120; // thumb_reel000 to thumb_reel119
        const fps = 30; // 30 frames per second
        const frameInterval = 1000 / fps; // milliseconds per frame

        // Preload frames for smoother playback
        const frames = [];
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = `assets/sprites/thumb_animated/thumb_reel${String(i).padStart(3, '0')}.png`;
            frames.push(img);
        }
        console.log(`Preloading ${totalFrames} frames...`);

        // Play animation
        const animationInterval = setInterval(() => {
            currentFrame++;
            if (currentFrame < totalFrames) {
                introImg.src = frames[currentFrame].src;
            } else {
                // Animation complete - fade out
                console.log('Animation complete, fading out...');
                clearInterval(animationInterval);
                setTimeout(() => {
                    introScreen.classList.add('fade-out');
                    setTimeout(() => {
                        introScreen.style.display = 'none';
                        // Re-enable scrolling after intro
                        document.body.classList.remove('intro-active');
                        console.log('Intro finished');
                    }, 800); // Match CSS transition duration
                }, 300); // Small delay before fade
            }
        }, frameInterval);
    } else {
        console.error('Intro elements not found:', { introScreen, introImg });
    }

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const header = document.querySelector('.site-header');
    const headerNav = document.querySelector('.header-right');
    
    if (header && headerNav) {
        header.insertBefore(menuToggle, headerNav);
        
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
            document.body.style.overflow = headerNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = headerNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target) && headerNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    

    // ========================================
    // CORE SKILLS
    // ========================================
    fetch("data/skills.json")
        .then(response => response.json())
        .then(skills => {
            const grid = document.getElementById("skills-grid");
            if (!grid) return;

            skills.forEach(skill => {
                const item = document.createElement("a");
                item.classList.add("skill-item");

                if (skill.link) {
                    item.href = skill.link;
                    item.target = "_blank";
                    item.rel = "noopener noreferrer";
                }

                item.innerHTML = `
                    <img src="${skill.image}" alt="${skill.name}" loading="lazy">
                    <span>${skill.name}</span>
                `;

                grid.appendChild(item);
            });
        })
        .catch(error => console.error("Skills loading error:", error));


    // ========================================
    // PROJECTS
    // ========================================
    fetch("data/projects.json")
        .then(response => response.json())
        .then(projects => {
            const grid = document.querySelector(".projects-grid");
            if (!grid) return;

            projects.forEach(project => {
                const card = document.createElement("div");
                card.classList.add("project-card");

                // Determine status class
                let statusClass = '';
                let statusDot = '';
                if (project.status.toLowerCase().includes('production')) {
                    statusClass = 'status-production';
                    statusDot = '<span class="status-dot status-production"></span>';
                } else if (project.status.toLowerCase().includes('released')) {
                    statusClass = 'status-released';
                    statusDot = '<span class="status-dot status-released"></span>';
                }

                card.innerHTML = `
                    <div class="project-image">
                        ${project.kind ? `<span class="project-kind">${project.kind}</span>` : ''}
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                        ${project.video ? `
                            <video class="project-video" muted loop playsinline preload="none">
                                <source src="${project.video}" type="video/mp4">
                            </video>
                        ` : ''}
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p class="role-description">
                            <strong>${project.role}</strong> · ${project.description}
                        </p>
                        <div class="studio-status">
                            <span>${project.studio}</span>
                            <span class="status">${statusDot}${project.status}</span>
                        </div>
                    </div>
                `;

                // Video hover controls
                if (project.video) {
                    const videoElement = card.querySelector('.project-video');
                    if (videoElement) {
                        card.addEventListener('mouseenter', () => {
                            videoElement.play().catch(err => console.log('Video play failed:', err));
                        });
                        card.addEventListener('mouseleave', () => {
                            videoElement.pause();
                            videoElement.currentTime = 0;
                        });
                    }
                }

                if (project.link) {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        window.open(project.link, '_blank');
                    });
                }

                grid.appendChild(card);
            });
        })
        .catch(error => console.error("Projects loading error:", error));

    
    // ========================================
    // CAREER
    // ========================================
    fetch('data/career.json')
        .then(res => res.json())
        .then(career => {
            const container = document.querySelector('.career-grid');
            if(!container) return;
            
            career.forEach(c => {
                const card = document.createElement('div');
                card.classList.add('career-card');
                card.innerHTML = `
                    ${c.logo ? `<img src="${c.logo}" alt="${c.studio}" loading="lazy">` : ''}
                    <h3>${c.studio}</h3>
                    <span class="career-role">${c.role}</span>
                    <div class="career-info-container">
                        <span class="career-period">${c.period}</span>
                        ${c.kind ? `<span class="career-kind">${c.kind}</span>` : ''}
                    </div>
                `;

                if (c.link) {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        window.open(c.link, '_blank');
                    });
                }

                container.appendChild(card);
            });
        })
        .catch(err => console.error("Error loading career:", err));
    
    
    // ========================================
    // TEACHING
    // ========================================
    fetch("data/teaching.json")
        .then(response => response.json())
        .then(teaching => {
            const container = document.querySelector(".teaching-grid");
            if (!container) return;

            teaching.forEach(t => {
                const card = document.createElement("div");
                card.classList.add("teaching-card");

                card.innerHTML = `
                    ${t.image ? `<img src="${t.image}" alt="${t.title}" loading="lazy">` : ''}
                    <h3>${t.title}</h3>
                    ${t.role ? `<span class="teaching-role">${t.role}</span>` : ''}
                    <div class="teaching-info-container">
                        <span class="teaching-period">${t.period}</span>
                        ${t.location ? `<span class="teaching-location">${t.location}</span>` : ''}
                    </div>
                `;

                // Click to open link
                if (t.link) {
                    card.style.cursor = "pointer";
                    card.addEventListener("click", () => {
                        window.open(t.link, "_blank");
                    });
                }

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Teaching loading error:", error));
    
    
    // ========================================
    // PERSONAL PROJECTS (First 3 only)
    // ========================================
    fetch("data/personal-work.json")
        .then(response => response.json())
        .then(projects => {
            const container = document.querySelector(".personal-work-grid");
            if (!container) return;

            // Show only first 3 projects
            const displayProjects = projects.slice(0, 3);

            displayProjects.forEach((project, index) => {
                const card = document.createElement("div");
                card.classList.add("personal-card");

                card.innerHTML = `
                    <div class="personal-image">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                        <div class="view-project">VIEW PROJECT</div>
                    </div>
                    <div class="personal-content">
                        <span class="project-index">
                            ${String(index + 1).padStart(2, "0")}
                        </span>
                        <h3>${project.title}</h3>
                        ${project.subtitle ? `<h4>${project.subtitle}</h4>` : ''}
                        <p>${project.description}</p>
                    </div>
                `;

                // Click handler - navigate to individual project HTML page
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    window.location.href = `projects/${project.id}.html`;
                });

                container.appendChild(card);
            });

            // Add "View All Projects" button after the grid
            const btnWrapper = document.createElement("div");
            btnWrapper.classList.add("view-all-btn-wrapper");

            const viewAllBtn = document.createElement("a");
            viewAllBtn.href = "personal-projects.html";
            viewAllBtn.classList.add("view-all-projects-btn");
            viewAllBtn.innerHTML = `View All Projects <span class="arrow">→</span>`;

            btnWrapper.appendChild(viewAllBtn);

            const personalWorkSection = document.getElementById("personal-work");
            if (personalWorkSection) {
                personalWorkSection.appendChild(btnWrapper);
            }
        })
        .catch(error => console.error("Personal projects loading error:", error));

    
    // ========================================
    // METRIC COUNTER SCRAMBLE ANIMATION
    // ========================================
    const metricNumbers = document.querySelectorAll('.metric-number[data-target]');

    function scrambleCounter(element) {
        const target = parseInt(element.dataset.target);
        const valueSpan = element.querySelector('.metric-value');
        if (!valueSpan || element.dataset.animated === 'true') return;

        element.dataset.animated = 'true';

        const duration = 1000;       // 1 second total
        const scrambleSpeed = 50;    // new random number every 50ms
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (progress < 1) {
                // Random number scramble — range narrows as we approach the end
                const maxRange = Math.max(1, Math.ceil(9 * (1 - progress)));
                const randomNum = Math.floor(Math.random() * maxRange) +
                    Math.max(0, target - Math.ceil(maxRange / 2));
                valueSpan.textContent = Math.max(0, randomNum);
            } else {
                // Land on the correct number
                clearInterval(interval);
                valueSpan.textContent = target;
            }
        }, scrambleSpeed);
    }

    // Trigger on scroll into view
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Small stagger between metrics
                const metrics = entry.target.querySelectorAll('.metric-number[data-target]');
                metrics.forEach((el, i) => {
                    setTimeout(() => scrambleCounter(el), i * 200);
                });
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const metricsContainer = document.querySelector('.about-metrics');
    if (metricsContainer) {
        metricsObserver.observe(metricsContainer);
    }


    // ========================================
    // SMOOTH SCROLL WITH OFFSET
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========================================
    // HEADER BACKGROUND AND HERO BLUR ON SCROLL
    // ========================================
    let lastScroll = 0;
    const heroSection = document.querySelector('.hero');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const aboutSection = document.getElementById('about');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const siteHeader = document.querySelector('.site-header');

        // Header background change
        if (currentScroll > 100) {
            siteHeader.style.background = 'rgba(15, 15, 15, 0.98)';
        } else {
            siteHeader.style.background = 'rgba(15, 15, 15, 0.95)';
        }

        // Hero blur effect
        if (heroSection) {
            if (currentScroll > 400) {
                heroSection.classList.add('scrolled');
            } else {
                heroSection.classList.remove('scrolled');
            }
        }

        // Scroll to top button visibility
        if (scrollToTopBtn && aboutSection) {
            const aboutTop = aboutSection.offsetTop;
            if (currentScroll >= aboutTop) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // SCROLL TO TOP BUTTON CLICK
    // ========================================
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ── SHOWREEL MODAL ──────────────────────────────────
    const reelModal = document.getElementById('showreelModal');
    const reelInput = document.getElementById('showreelInput');
    const reelSubmit = document.getElementById('showreelSubmit');
    const reelError = document.getElementById('showreelError');
    const reelClose = document.getElementById('showreelClose');
    const reelPasswordSection = document.getElementById('showreelPassword');
    const reelPlayerSection = document.getElementById('showreelPlayer');
    const reelIframe = document.getElementById('showreelIframe');

    function openReelModal() {
        reelModal.classList.add('active');
        reelInput.focus();
    }

    function closeReelModal() {
        reelModal.classList.remove('active');
        reelInput.value = '';
        reelError.classList.remove('visible');
        reelError.textContent = 'Incorrect password';
        reelPasswordSection.style.display = '';
        reelPlayerSection.classList.remove('active');
        reelIframe.src = '';
        reelSubmit.disabled = false;
    }

    async function submitReelPassword() {
        const password = reelInput.value.trim();

        if (!password) {
            reelError.textContent = 'Please enter a password';
            reelError.classList.add('visible');
            return;
        }

        // Disable button durante la richiesta
        reelSubmit.disabled = true;
        reelError.classList.remove('visible');

        try {
            // Chiama l'API serverless
            const response = await fetch('/api/verify-showreel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                // Password corretta - mostra video
                reelPasswordSection.style.display = 'none';
                reelPlayerSection.classList.add('active');
                reelIframe.src = data.videoUrl;
            } else {
                // Password errata o rate limit
                reelError.textContent = data.error || 'Incorrect password';
                reelError.classList.add('visible');
                reelInput.value = '';
                reelInput.focus();
                reelSubmit.disabled = false;
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            reelError.textContent = 'Connection error. Please try again.';
            reelError.classList.add('visible');
            reelSubmit.disabled = false;
        }
    }

    document.querySelectorAll('.showreel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openReelModal();
        });
    });

    reelSubmit.addEventListener('click', submitReelPassword);

    reelInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitReelPassword();
    });

    reelClose.addEventListener('click', closeReelModal);

    reelModal.addEventListener('click', (e) => {
        if (e.target === reelModal) closeReelModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reelModal.classList.contains('active')) closeReelModal();
    });

    // ========================================
    // CONTACT FORM (Web3Forms)
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('contactSubmitBtn');
            const successMsg = document.getElementById('contactSuccess');
            const errorMsg = document.getElementById('contactError');
            const btnText = submitBtn.querySelector('span');

            // Hide previous feedback
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Loading state
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success) {
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    errorMsg.style.display = 'block';
                }
            })
            .catch(function () {
                errorMsg.style.display = 'block';
            })
            .finally(function () {
                btnText.textContent = 'Send Message';
                submitBtn.disabled = false;
            });
        });
    }

});