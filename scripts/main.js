document.addEventListener("DOMContentLoaded", function() {

    // ========================================
    // INTRO ANIMATION
    // ========================================
    const introScreen = document.getElementById('intro-screen');
    const introImg = document.getElementById('intro-animation');

    if (introScreen && introImg) {
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

        // Play animation
        const animationInterval = setInterval(() => {
            currentFrame++;
            if (currentFrame < totalFrames) {
                introImg.src = frames[currentFrame].src;
            } else {
                // Animation complete - fade out
                clearInterval(animationInterval);
                setTimeout(() => {
                    introScreen.classList.add('fade-out');
                    setTimeout(() => {
                        introScreen.style.display = 'none';
                    }, 800); // Match CSS transition duration
                }, 300); // Small delay before fade
            }
        }, frameInterval);
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
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
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
    // PERSONAL PROJECTS
    // ========================================
    fetch("data/personal-work.json")
        .then(response => response.json())
        .then(projects => {
            const container = document.querySelector(".personal-work-grid");
            if (!container) return;

            projects.forEach((project, index) => {
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

                // Optional: add click handler for projects with links
                if (project.link) {
                    card.style.cursor = "pointer";
                    card.addEventListener("click", () => {
                        window.open(project.link, "_blank");
                    });
                }

                container.appendChild(card);
            });
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
            if (currentScroll > 200) {
                heroSection.classList.add('scrolled');
            } else {
                heroSection.classList.remove('scrolled');
            }
        }

        lastScroll = currentScroll;
    });

});