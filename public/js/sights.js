const scrollItems = document.querySelectorAll('.scroll-item');
const sightContents = document.querySelectorAll('.sight-content');
const mapInstances = {};
const infoImages = document.querySelectorAll('.sight-info img.img-fluid');
const IMAGE_VISIBLE_TEXT = 'Image visible';
const IMAGE_HIDDEN_TEXT = 'Image hidden';

const sightVariants = {
    'bayterek': {
        images: [
            {src: 'images/sights_images/sights_baiterek.jpg', alt: 'View of Bayterek Tower at sunset'},
            {src: 'https://www.tourstouzbekistan.com/uploads/blog/Astana-Baiterek2.jpg', alt: 'Downtown Astana skyline at night'}
        ],
        links: [
            {href: '#map-bayterek', label: 'Bayterek map view'},
            {href: 'https://en.wikipedia.org/wiki/Baiterek', label: 'Read about Bayterek'}
        ]
    },
    'khan-shatyr': {
        images: [
            {src: 'images/sights_images/sights_khan_shatyr1.jpg', alt: 'Khan Shatyr exterior at dusk'},
            {src: 'images/sights_images/sights_khan_shatyr.jpg', alt: 'Khan Shatyr interior dome'}
        ],
        links: [
            {href: '#map-khan-shatyr', label: 'Khan Shatyr map view'},
            {href: 'https://en.wikipedia.org/wiki/Khan_Shatyr_Entertainment_Center', label: 'Read about Khan Shatyr'}
        ]
    },
    'hazret-sultan': {
        images: [
            {src: 'images/sights_images/hazrat_sultan_mosque.png', alt: 'Hazret Sultan Mosque from the front'},
            {src: 'https://astana.citypass.kz/wp-content/uploads/MxOCyZ.jpg', alt: 'Golden domes near the Ishim River'}
        ],
        links: [
            {href: '#map-hazret-sultan', label: 'Hazret Sultan map view'},
            {href: 'https://en.wikipedia.org/wiki/Hazret_Sultan_Mosque', label: 'Read about Hazret Sultan'}
        ]
    },
    'akorda': {
        images: [
            {src: 'images/sights_images/ak_orda.png', alt: 'Akorda Presidential Palace facade'},
            {src: 'https://upload.wikimedia.org/wikivoyage/ru/f/f2/Ak_Orda_Presidential_Palace_by_night_05.jpg', alt: 'View across Independence Square'}
        ],
        links: [
            {href: '#map-akorda', label: 'Akorda map view'},
            {href: 'https://en.wikipedia.org/wiki/Ak_Orda_Presidential_Palace', label: 'Read about Akorda'}
        ]
    },
    'nur-astana': {
        images: [
            {src: 'images/sights_images/nur_astana_mosque.png', alt: 'Nur-Astana Mosque main entrance'},
            {src: 'https://media.istockphoto.com/id/1453247591/photo/panoramic-view-of-snow-white-modern-hazaret-sultan-mosque-at-night-nur-sultan-astana.jpg?s=612x612&w=0&k=20&c=as6DAC0KmDP7ggBUsDkuZ3NwUBSx6WpddhQm3YniCCk=', alt: 'Green promenade near Nur-Astana Mosque'}
        ],
        links: [
            {href: '#map-nur-astana', label: 'Nur-Astana map view'},
            {href: 'https://en.wikipedia.org/wiki/Nur-Astana_Mosque', label: 'Read about Nur-Astana'}
        ]
    },
    'expo': {
        images: [
            {src: 'images/sights_images/expo.jpg', alt: 'Nur Alem pavilion at EXPO 2017'},
            {src: 'https://www.dirtymonitor.com/projects/img/projets/595b89f2a5085-expo2017-astana-3d-projection-mappingvideo-futurenergy-dirtymonitor-slider7.jpg', alt: 'Astana Guide blueprint illustration'}
        ],
        links: [
            {href: '#map-expo', label: 'EXPO map view'},
            {href: 'https://en.wikipedia.org/wiki/Expo_2017', label: 'Read about Expo 2017'}
        ]
    },
    'square': {
        images: [
            {src: 'images/sights_images/independence_square.jpg', alt: 'Independence Square fountains'},
            {src: 'https://www.shutterstock.com/image-photo/astana-kazakhstan-06202017-monument-kazakh-600nw-2621371465.jpg', alt: 'Akorda Palace from the square'}
        ],
        links: [
            {href: '#map-square', label: 'Independence Square map view'},
            {href: 'https://en.wikipedia.org/wiki/Independence_Square_(Nur-Sultan)', label: 'Read about Independence Square'}
        ]
    },
    'park': {
        images: [
            {src: 'images/sights_images/central_park_astana.webp', alt: 'Astana Central Park lake'},
            {src: 'https://ink-a.com/assets/components/phpthumbof/cache/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B2%D1%8F%281%29.aa0fdfa69740d22a4e3cc983a4aaa0ed.webp', alt: 'Stylised outline of Astana attractions'}
        ],
        links: [
            {href: '#map-park', label: 'Central Park map view'},
            {href: 'https://welcome.kz/ru/info-cities/astana/astana-central-park', label: 'Read about Astana Central Park'}
        ]
    }
};

function applyImageVariant(content, index) {
    const variants = sightVariants[content.id];
    if (!variants || !variants.images.length) {
        return;
    }
    const info = content.querySelector('.sight-info');
    const image = info ? info.querySelector('img.img-fluid') : null;
    if (!image) {
        return;
    }
    const normalizedIndex = index % variants.images.length;
    const next = variants.images[normalizedIndex];
    image.src = next.src;
    image.alt = next.alt;
    content.dataset.imageIndex = String(normalizedIndex);
}

function applyLinkVariant(content, index) {
    const variants = sightVariants[content.id];
    if (!variants || !variants.links || !variants.links.length) {
        return;
    }
    const link = content.querySelector('.sight-info-link');
    if (!link) {
        return;
    }
    const normalizedIndex = index % variants.links.length;
    const next = variants.links[normalizedIndex];
    link.href = next.href;
    link.textContent = next.label;
    if (next.href.startsWith('#')) {
        link.removeAttribute('target');
        link.removeAttribute('rel');
    } else {
        link.target = '_blank';
        link.rel = 'noopener';
    }
    content.dataset.linkIndex = String(normalizedIndex);
}

function ensureMap(mapId, lat, lng, zoom) {
    if (mapInstances[mapId]) {
        setTimeout(() => mapInstances[mapId].invalidateSize(), 200);
        return;
    }
    const map = L.map(mapId).setView([lat, lng], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    L.marker([lat, lng]).addTo(map);
    mapInstances[mapId] = map;
    setTimeout(() => map.invalidateSize(), 250);
}

function resetSightContent(content) {
    const info = content.querySelector('.sight-info');
    const image = info ? info.querySelector('img.img-fluid') : null;
    const view = content.closest('.sight-view');

    content.classList.remove('sight-content-expanded');

    if (view) {
        view.classList.remove('sight-view-expanded');
    }

    if (info) {
        info.classList.remove('sight-info-collapsed', 'sight-info-expanded');
        info.querySelectorAll('h3, p').forEach(node => {
            node.hidden = false;
        });
    }

    if (image) {
        image.classList.remove('sight-image-expanded', 'sight-image-hidden');
    }

    const toggleInput = content.querySelector('.sight-toggle-input');
    const toggleStatus = content.querySelector('.sight-toggle-status');
    if (toggleInput) {
        toggleInput.checked = true;
    }
    if (toggleStatus) {
        toggleStatus.textContent = IMAGE_VISIBLE_TEXT;
    }
    if (sightVariants[content.id]) {
        content.dataset.imageIndex = '0';
        content.dataset.linkIndex = '0';
        applyImageVariant(content, 0);
        applyLinkVariant(content, 0);
    }
}

function setActiveView(content, view) {
    const tabs = content.querySelectorAll('.sight-tab');
    const info = content.querySelector('.sight-info');
    const map = content.querySelector('.sight-map');
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.view === view));
    if (view === 'info') {
        info.classList.add('active');
        map.classList.remove('active');
        return;
    }
    resetSightContent(content);
    info.classList.remove('active');
    map.classList.add('active');
    const mapId = map.id;
    const lat = parseFloat(content.dataset.lat);
    const lng = parseFloat(content.dataset.lng);
    const zoom = parseInt(content.dataset.zoom || '15', 10);
    ensureMap(mapId, lat, lng, zoom);
}

function showSight(targetId, preventScroll = false) {
    sightContents.forEach(c => {
        resetSightContent(c);
        c.classList.remove('active');
    });
    scrollItems.forEach(i => i.classList.remove('active'));
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
        setActiveView(targetContent, 'info');
    }
    const activeItem = document.querySelector(`[data-target="${targetId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        if (!preventScroll) {
            activeItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
        }
    }
}

document.querySelectorAll('.sight-tab').forEach(tab => {
    tab.addEventListener('click', function (e) {
        e.preventDefault();
        const content = this.closest('.sight-content');
        const view = this.dataset.view;
        if (content) setActiveView(content, view);
    });
});

sightContents.forEach((content, index) => {
    const tabs = content.querySelector('.sight-tabs');
    const info = content.querySelector('.sight-info');
    const image = info ? info.querySelector('img.img-fluid') : null;
    if (!tabs || !image) {
        return;
    }

    if (content.querySelector('.sight-image-toggle')) {
        return;
    }

    const view = content.closest('.sight-view');
    const baseId = content.id || `sight-${index}`;
    const toggleId = `${baseId}-image-toggle`;
    const statusId = `${toggleId}-status`;

    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'sight-image-toggle';
    toggleWrapper.innerHTML = `
        <span id="${statusId}" class="sight-toggle-status">${IMAGE_VISIBLE_TEXT}</span>
        <label class="sight-toggle-switch">
            <input type="checkbox" class="sight-toggle-input" id="${toggleId}" checked aria-describedby="${statusId}" aria-label="Toggle sight image visibility">
            <span class="sight-toggle-slider" aria-hidden="true"></span>
        </label>
    `;

    tabs.parentNode.insertBefore(toggleWrapper, tabs);

    const toggleInput = toggleWrapper.querySelector('.sight-toggle-input');
    const statusNode = toggleWrapper.querySelector('.sight-toggle-status');

    toggleInput.addEventListener('change', function () {
        if (this.checked) {
            image.classList.remove('sight-image-hidden');
            statusNode.textContent = IMAGE_VISIBLE_TEXT;
            return;
        }

        content.classList.remove('sight-content-expanded');
        if (view) {
            view.classList.remove('sight-view-expanded');
        }
        if (info) {
            info.classList.remove('sight-info-collapsed', 'sight-info-expanded');
            info.querySelectorAll('h3, p').forEach(node => {
                node.hidden = false;
            });
        }
        image.classList.remove('sight-image-expanded');
        image.classList.add('sight-image-hidden');
        statusNode.textContent = IMAGE_HIDDEN_TEXT;
    });

    const actions = document.createElement('div');
    actions.className = 'sight-info-actions';

    const imageBtn = document.createElement('button');
    imageBtn.type = 'button';
    imageBtn.className = 'btn btn-outline-primary sight-cycle-image';
    imageBtn.textContent = 'Change Image';

    const linkBtn = document.createElement('button');
    linkBtn.type = 'button';
    linkBtn.className = 'btn btn-outline-secondary sight-cycle-link';
    linkBtn.textContent = 'Change Link';

    const linkAction = document.createElement('a');
    linkAction.className = 'btn btn-primary sight-info-link';
    linkAction.href = '#';

    actions.appendChild(imageBtn);
    actions.appendChild(linkBtn);
    actions.appendChild(linkAction);
    info.appendChild(actions);

    content.dataset.imageIndex = '0';
    content.dataset.linkIndex = '0';
    applyImageVariant(content, 0);
    applyLinkVariant(content, 0);

    imageBtn.addEventListener('click', function () {
        if (!sightVariants[content.id] || !sightVariants[content.id].images.length) {
            return;
        }
        const nextIndex = (parseInt(content.dataset.imageIndex || '0', 10) + 1) % sightVariants[content.id].images.length;
        applyImageVariant(content, nextIndex);
    });

    linkBtn.addEventListener('click', function () {
        if (!sightVariants[content.id] || !sightVariants[content.id].links || !sightVariants[content.id].links.length) {
            return;
        }
        const nextIndex = (parseInt(content.dataset.linkIndex || '0', 10) + 1) % sightVariants[content.id].links.length;
        applyLinkVariant(content, nextIndex);
    });

    linkAction.addEventListener('click', function (event) {
        const href = this.getAttribute('href') || '#';
        if (!href.startsWith('#')) {
            return;
        }
        event.preventDefault();
        setActiveView(content, 'map');
        const targetId = href.substring(1);
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    });
});

infoImages.forEach(image => {
    image.addEventListener('click', function () {
        const info = this.closest('.sight-info');
        if (!info) {
            return;
        }
        const content = info.closest('.sight-content');
        const view = content ? content.closest('.sight-view') : null;
        const textBlocks = info.querySelectorAll('h3, p');
        const expand = !this.classList.contains('sight-image-expanded');

        if (expand) {
            this.classList.add('sight-image-expanded');
            info.classList.add('sight-info-collapsed', 'sight-info-expanded');
            textBlocks.forEach(node => {
                node.hidden = true;
            });
            if (content) {
                content.classList.add('sight-content-expanded');
            }
            if (view) {
                view.classList.add('sight-view-expanded');
            }
            return;
        }

        this.classList.remove('sight-image-expanded');
        info.classList.remove('sight-info-collapsed', 'sight-info-expanded');
        textBlocks.forEach(node => {
            node.hidden = false;
        });
        if (content) {
            content.classList.remove('sight-content-expanded');
        }
        if (view) {
            view.classList.remove('sight-view-expanded');
        }
        const statusNode = content ? content.querySelector('.sight-toggle-status') : null;
        const toggleInput = content ? content.querySelector('.sight-toggle-input') : null;
        if (toggleInput) {
            toggleInput.checked = true;
        }
        if (statusNode) {
            statusNode.textContent = IMAGE_VISIBLE_TEXT;
        }
    });
});

scrollItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const scrollPos = window.scrollY;
        showSight(targetId);
        history.pushState(null, '', '#' + targetId);
        window.scrollTo(0, scrollPos);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSight(hash, true);
    } else {
        showSight('bayterek', true);
    }
});

window.addEventListener('hashchange', function () {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) showSight(hash, true);
});
