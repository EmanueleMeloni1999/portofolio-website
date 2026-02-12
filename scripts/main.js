document.addEventListener("DOMContentLoaded", function() {
    // ---- Projects ----
    fetch("data/projects.json")
        .then(response => response.json())
        .then(projects => {
            const grid = document.querySelector(".projects-grid");

            projects.forEach(project => {
                const card = document.createElement("div");
                card.classList.add("project-card");

                card.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p class="role-description">
                            <strong>${project.role}</strong> · ${project.description}
                        </p>
                        <p class="studio-status">
                            ${project.studio} · <span class="status">${project.status}</span>
                        </p>
                    </div>
                `;

                grid.appendChild(card);
            });
        })
        .catch(error => console.error("Projects loading error:", error));

    // ---- Career ----
    fetch('data/career.json')
        .then(res => res.json())
        .then(career => {
            const container = document.querySelector('.career-grid');
            if(!container) return;
            career.forEach(c => {
                const card = document.createElement('div');
                card.classList.add('career-card');
                card.innerHTML = `
                    <img src="${c.logo}" alt="${c.studio}">
                    <h3>${c.studio}</h3>
                    <span>${c.role}</span>
                    <span>${c.period}</span>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => console.error("Error loading career:", err));
    
    // ---- Teaching ----
    fetch("data/teaching.json")
        .then(response => response.json())
        .then(teaching => {
            const container = document.querySelector(".teaching-grid");
            if (!container) return;

            teaching.forEach(t => {
                const card = document.createElement("div");
                card.classList.add("teaching-card");

                card.innerHTML = `
                    <img src="${t.image}" alt="${t.title}">
                    <div class="teaching-info">
                        <h3>${t.title}</h3>
                        <span>${t.period}</span>
                        <span>${t.location}</span>
                    </div>
                `;

                // click link
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
    
    // ---- Personal Projects ----
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
                        <img src="${project.image}" alt="${project.title}">
                        <div class="view-project">VIEW PROJECT</div>
                    </div>
                    <div class="personal-content">
                        <span class="project-index">
                            ${String(index + 1).padStart(2, "0")}
                        </span>
                        <h3>${project.title}</h3>
                        <h4>${project.subtitle}</h4>
                        <p>${project.description}</p>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => console.error("Personal projects loading error:", error));


});
