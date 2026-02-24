// Project navigation with Previous/Next functionality
document.addEventListener("DOMContentLoaded", function() {

    // Define all projects in order
    const projects = [
        { id: 'ms-workflow', title: 'MS Workflow' },
        { id: 'moonshot-creatures', title: 'Moonshot Creatures' },
        { id: 'drogon', title: 'Drogon' },
        { id: 'hiddenstudio', title: 'Alterego' },
        { id: 'chaosmonger', title: 'Italia 2162' },
        { id: 'luminairi', title: 'Outpost Alpha' },
        { id: 'grim', title: 'Grim.exe Rig' }
    ];

    // Get current project ID from the page URL
    const currentPath = window.location.pathname;
    const currentFileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const currentId = currentFileName.replace('.html', '');

    // Find current project index
    const currentIndex = projects.findIndex(p => p.id === currentId);

    if (currentIndex === -1) return; // Project not found

    // Get navigation elements
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');

    // Add Previous Project link (if not first)
    if (currentIndex > 0) {
        const prevProject = projects[currentIndex - 1];
        const prevLink = document.createElement('a');
        prevLink.href = `${prevProject.id}.html`;
        prevLink.classList.add('nav-link');
        prevLink.innerHTML = `← Previous`;
        navLeft.appendChild(prevLink);
    }

    // Add Next Project link (if not last)
    if (currentIndex < projects.length - 1) {
        const nextProject = projects[currentIndex + 1];
        const nextLink = document.createElement('a');
        nextLink.href = `${nextProject.id}.html`;
        nextLink.classList.add('nav-link');
        nextLink.innerHTML = `Next →`;
        navRight.appendChild(nextLink);
    }

});
