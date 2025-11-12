
(function() {
    'use strict';

    const root = document.documentElement;

    function getPreferredTheme() {
        try {
            const stored = localStorage.getItem('theme');
            if (stored === 'dark' || stored === 'light') {
                return stored;
            }
        } catch (error) {
            
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    function updateToggleIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

        if (!themeIcon) {
            return;
        }

        themeIcon.classList.toggle('fa-sun', theme === 'dark');
        themeIcon.classList.toggle('fa-moon', theme !== 'dark');
    }

    function applyTheme(theme) {
        const normalized = theme === 'dark' ? 'dark' : 'light';
        root.setAttribute('data-theme', normalized);
        updateToggleIcon(normalized);
    }

    function persistTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
           
        }
    }

    function toggleTheme() {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        persistTheme(next);
    }

    function initTheme() {
        const initial = root.getAttribute('data-theme') || getPreferredTheme();
        applyTheme(initial);

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
