document.addEventListener("DOMContentLoaded", function() {

    // ========================================
    // SITE INFO (from JSON)
    // ========================================
    fetch("data/site-info.json")
        .then(response => response.json())
        .then(info => {
            // Header
            const siteName = document.getElementById("site-name");
            if (siteName) siteName.textContent = info.name;

            const siteTitle = document.getElementById("site-title");
            if (siteTitle) siteTitle.textContent = info.title;

            // Hero
            const heroName = document.getElementById("hero-name");
            if (heroName) heroName.textContent = info.name;

            const heroTitle = document.getElementById("hero-title");
            if (heroTitle) heroTitle.textContent = info.title.replace(/\s*\|\s*/g, " \u00b7 ");

            // Photo caption
            const caption = document.getElementById("photo-caption");
            if (caption) caption.textContent = info.name + " \u00b7 " + new Date().getFullYear();

            // Metrics
            const metricYears = document.getElementById("metric-years");
            if (metricYears) metricYears.setAttribute("data-target", info.metrics.years);

            const metricProjects = document.getElementById("metric-projects");
            if (metricProjects) metricProjects.setAttribute("data-target", info.metrics.projects);

            // CTA links
            const cvLink = document.getElementById("cv-link");
            if (cvLink) cvLink.href = info.cv;

            const linkedinLink = document.getElementById("linkedin-link");
            if (linkedinLink) linkedinLink.href = info.social.linkedin;

            const imdbLink = document.getElementById("imdb-link");
            if (imdbLink) imdbLink.href = info.social.imdb;

            // ShowReel
            const showreelIframe = document.getElementById("showreel-iframe");
            if (showreelIframe) showreelIframe.src = info.youtube.link;

            // Contact
            const contactEmail = document.getElementById("contact-email");
            if (contactEmail) {
                contactEmail.href = "mailto:" + info.email;
                contactEmail.textContent = info.email;
            }

            const contactLinkedin = document.getElementById("contact-linkedin");
            if (contactLinkedin) {
                contactLinkedin.href = info.social.linkedin;
                contactLinkedin.textContent = info.social.linkedin
                    .replace("https://www.", "")
                    .replace(/\/$/, "");
            }

            // Footer
            const footerText = document.getElementById("footer-text");
            if (footerText) footerText.innerHTML = "&copy; " + info.footer;
        })
        .catch(error => console.error("Site info loading error:", error));


    // ========================================
    // INTRO ANIMATION (WebM video)
    // ========================================
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');

    if (introScreen && introVideo) {
        document.body.classList.add('intro-active');
        let introSkipped = false;

        function endIntro() {
            if (introSkipped) return;
            introSkipped = true;
            introVideo.pause();
            introScreen.classList.add('fade-out');
            setTimeout(() => {
                introScreen.style.display = 'none';
                document.body.classList.remove('intro-active');
            }, 800);
        }

        introScreen.addEventListener('click', endIntro);
        introScreen.addEventListener('touchstart', endIntro, { passive: true });

        introVideo.addEventListener('ended', () => {
            setTimeout(endIntro, 300);
        });

        introVideo.play().catch(() => {
            endIntro();
        });
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
    fetch("data/all-personal-work.json")
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