document.addEventListener("DOMContentLoaded", function() {

    // ========================================
    // LOAD ALL PERSONAL PROJECTS
    // ========================================

    // Get project ID from URL if present (e.g., ?project=project-1)
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');

    fetch("data/all-personal-work.json")
        .then(response => response.json())
        .then(projects => {
            const container = document.getElementById("all-projects-grid");
            if (!container) return;

            // If there's a project ID, scroll to it after rendering
            let targetProject = null;

            projects.forEach((project, index) => {
                const card = document.createElement("div");
                card.classList.add("project-card");
                card.id = project.id; // Add ID for scrolling

                card.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                        <div class="view-project">VIEW PROJECT</div>
                    </div>
                    <div class="project-content">
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

                // Check if this is the target project
                if (project.id === projectId) {
                    targetProject = card;
                }
            });

            // Scroll to target project if specified
            if (targetProject) {
                setTimeout(() => {
                    targetProject.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    // Add highlight effect
                    targetProject.style.borderColor = 'var(--accent)';
                    setTimeout(() => {
                        targetProject.style.borderColor = '';
                    }, 2000);
                }, 300);
            }
        })
        .catch(error => console.error("Personal projects loading error:", error));

});
