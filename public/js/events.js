const scrollItems = document.querySelectorAll('.scroll-item');
const sightContents = document.querySelectorAll('.sight-content');

function showSight(targetId, preventScroll = false) {
    sightContents.forEach(content => {
        content.classList.remove('active');
    });

    scrollItems.forEach(item => {
        item.classList.remove('active');
    });

    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    const activeItem = document.querySelector(`[data-target="${targetId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        if (!preventScroll) {
            activeItem.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
        }
    }
}

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
        showSight('besbayev', true);
    }
});

window.addEventListener('hashchange', function () {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSight(hash, true);
    }
});

// Event planner functionality
const plannerKey = 'astana-guide-planner-v2';
const storedPlanner = JSON.parse(localStorage.getItem(plannerKey) || '{}');
const plannerItems = Array.from(document.querySelectorAll('.sight-content[data-event-id]'));
const plannerSummaryList = document.querySelector('.planner-summary-list');
const plannerSummaryEmpty = document.querySelector('.planner-summary-empty');
const now = new Date();
let storageTouched = false;

function persistPlanner() {
    if (!Object.keys(storedPlanner).length) {
        localStorage.removeItem(plannerKey);
        return;
    }
    localStorage.setItem(plannerKey, JSON.stringify(storedPlanner));
}

function applyState(item, buttons, value) {
    buttons.forEach(btn => {
        const isActive = btn.dataset.value === value;
        btn.classList.toggle('active', isActive);
    });
}

function renderPlannerSummary() {
    if (!plannerSummaryList || !plannerSummaryEmpty) {
        return;
    }
    plannerSummaryList.innerHTML = '';
    const wishItems = plannerItems.filter(content => storedPlanner[content.dataset.eventId] === 'wish');
    if (!wishItems.length) {
        plannerSummaryEmpty.style.display = 'block';
        plannerSummaryList.style.display = 'none';
        return;
    }
    plannerSummaryEmpty.style.display = 'none';
    plannerSummaryList.style.display = 'grid';
    wishItems.forEach(content => {
        const eventId = content.dataset.eventId;
        const summaryItem = document.createElement('div');
        summaryItem.className = 'planner-summary-item';
        summaryItem.dataset.eventId = eventId;

        const details = document.createElement('div');
        details.className = 'planner-summary-item-details';
        const title = content.dataset.title || content.querySelector('h3').textContent.trim();
        const dateText = content.dataset.dateText || content.querySelector('span').textContent.trim();
        details.innerHTML = `<h4>${title}</h4><span>${dateText}</span>`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'planner-summary-remove';
        removeBtn.textContent = 'Delete';
        removeBtn.addEventListener('click', () => {
            delete storedPlanner[eventId];
            const buttons = Array.from(content.querySelectorAll('.planner-btn'));
            applyState(content, buttons, undefined);
            persistPlanner();
            renderPlannerSummary();
        });

        summaryItem.appendChild(details);
        summaryItem.appendChild(removeBtn);
        plannerSummaryList.appendChild(summaryItem);
    });
}

plannerItems.forEach(item => {
    const eventId = item.dataset.eventId;
    const rawDate = item.dataset.date;
    const buttons = Array.from(item.querySelectorAll('.planner-btn'));
    const wishBtn = buttons.find(btn => btn.dataset.value === 'wish');
    let savedValue = storedPlanner[eventId];
    if (rawDate && wishBtn) {
        const eventDate = new Date(rawDate);
        if (!Number.isNaN(eventDate) && eventDate < now) {
            wishBtn.disabled = true;
            wishBtn.classList.add('planner-btn-disabled');
            if (savedValue === 'wish') {
                savedValue = 'done';
                storedPlanner[eventId] = 'done';
                storageTouched = true;
            }
        }
    }
    if (savedValue) {
        applyState(item, buttons, savedValue);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) {
                return;
            }
            const value = btn.dataset.value;
            const current = storedPlanner[eventId];
            if (current === value) {
                delete storedPlanner[eventId];
                applyState(item, buttons, undefined);
                persistPlanner();
                renderPlannerSummary();
                return;
            }
            storedPlanner[eventId] = value;
            applyState(item, buttons, value);
            persistPlanner();
            renderPlannerSummary();
        });
    });
});

if (storageTouched) {
    persistPlanner();
}

renderPlannerSummary();
