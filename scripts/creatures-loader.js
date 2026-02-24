document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('creatures-grid');
    if (!grid) return;

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'creature-lightbox';
    lightbox.innerHTML = `
        <button class="creature-lightbox-close" aria-label="Close">&times;</button>
        <div class="creature-lightbox-content">
            <img class="creature-img-render" src="" alt="" draggable="false">
            <img class="creature-img-rig" src="" alt="" draggable="false">
            <div class="creature-slider-line">
                <div class="creature-slider-handle"></div>
            </div>
            <input type="range" min="0" max="100" value="50" aria-label="Compare Render and Rig">
        </div>
        <span class="creature-lightbox-title"></span>
    `;
    document.body.appendChild(lightbox);

    const lbContent = lightbox.querySelector('.creature-lightbox-content');
    const lbRender = lightbox.querySelector('.creature-img-render');
    const lbRig = lightbox.querySelector('.creature-img-rig');
    const lbSlider = lightbox.querySelector('input[type="range"]');
    const lbLine = lightbox.querySelector('.creature-slider-line');
    const lbTitle = lightbox.querySelector('.creature-lightbox-title');
    const lbClose = lightbox.querySelector('.creature-lightbox-close');

    function openLightbox(renderSrc, rigSrc, title, sliderValue) {
        lbRender.src = renderSrc;
        lbRig.src = rigSrc;
        lbTitle.textContent = title;
        lbSlider.value = sliderValue;
        lbRig.style.clipPath = 'inset(0 ' + (100 - sliderValue) + '% 0 0)';
        lbLine.style.left = sliderValue + '%';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lbSlider.addEventListener('input', function () {
        const val = this.value;
        lbRig.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
        lbLine.style.left = val + '%';
    });

    lbClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Load creatures
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
                        <button class="creature-expand-btn" aria-label="Expand"></button>
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

                // Expand button opens lightbox
                const expandBtn = card.querySelector('.creature-expand-btn');
                expandBtn.addEventListener('click', function () {
                    openLightbox(
                        creature.render,
                        creature.rig,
                        creature.asset,
                        slider.value
                    );
                });
            });
        })
        .catch(error => {
            console.error('Error loading creatures:', error);
        });
});
