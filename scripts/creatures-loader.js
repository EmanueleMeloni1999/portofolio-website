document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('creatures-grid');
    if (!grid) return;

    fetch('../data/creatures.json')
        .then(response => response.json())
        .then(creatures => {
            grid.innerHTML = '';

            creatures.forEach(creature => {
                const statusClass = creature.status === 'rigged'
                    ? 'creature-role-rigged'
                    : 'creature-role-supervised';
                const statusLabel = creature.status === 'rigged' ? 'Rigged' : 'Supervised';

                const card = document.createElement('div');
                card.className = 'creature-card';
                card.innerHTML = `
                    <div class="creature-slider">
                        <img class="creature-img-render" src="${creature.render}" alt="${creature.asset} Render" draggable="false">
                        <img class="creature-img-rig" src="${creature.rig}" alt="${creature.asset} Rig" draggable="false">
                        <div class="creature-slider-line">
                            <div class="creature-slider-handle"></div>
                        </div>
                        <input type="range" min="0" max="100" value="50" aria-label="Compare Render and Rig">
                        <div class="creature-slider-labels">
                            <span class="creature-slider-label">Render</span>
                            <span class="creature-slider-label">Rig</span>
                        </div>
                    </div>
                    <div class="creature-info">
                        <h3>${creature.asset}</h3>
                        <span class="creature-role-label">My Role</span>
                        <span class="creature-role ${statusClass}">${statusLabel}</span>
                        <span class="creature-artist-label">Artist</span>
                        <p class="creature-credits">${creature.artists}</p>
                        <a href="${creature.link}" class="btn-purchase" target="_blank">Purchase Asset</a>
                    </div>
                `;

                grid.appendChild(card);

                // Slider logic
                const slider = card.querySelector('input[type="range"]');
                const rigImg = card.querySelector('.creature-img-rig');
                const line = card.querySelector('.creature-slider-line');

                slider.addEventListener('input', function () {
                    const val = this.value;
                    rigImg.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
                    line.style.left = val + '%';
                });
            });
        })
        .catch(error => {
            console.error('Error loading creatures:', error);
        });
});
