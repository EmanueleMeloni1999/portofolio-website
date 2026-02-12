document.addEventListener("DOMContentLoaded", function() {
    
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
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
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
                    <span>${c.role}</span>
                    <span>${c.period}</span>
                `;
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
                    <div class="teaching-info">
                        <h3>${t.title}</h3>
                        <span>${t.period}</span>
                        ${t.location ? `<span>${t.location}</span>` : ''}
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
    // HEADER BACKGROUND ON SCROLL
    // ========================================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const siteHeader = document.querySelector('.site-header');
        
        if (currentScroll > 100) {
            siteHeader.style.background = 'rgba(15, 15, 15, 0.98)';
        } else {
            siteHeader.style.background = 'rgba(15, 15, 15, 0.95)';
        }
        
        lastScroll = currentScroll;
    });

});